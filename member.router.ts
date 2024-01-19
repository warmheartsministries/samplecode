/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import { requiresAuth } from "express-openid-connect";
import MemberItem from "./member.item.model";
import Content from "../content/content.model";

/**
 * Router Definition
 */

export const memberRouter = express.Router();

/**
 * Controller Definitions
 */

// GET all members
memberRouter.get("/:id", async (req, res) => {
  try {
    const codeAggregate = await MemberItem.aggregate([
      {
        //$match: { org: req.params.id, code: { $exists: true } },
        $match: {
          org: req.params.id,
        },
      },
      {
        $group: {
          _id: "$designation",
          members: {
            $push: {
              _id: "$_id",
              first_name: "$first_name",
              last_name: "$last_name",
              title: "$title",
              photo: "$photo",
              description: "$description",
            },
          },
        },
      },
      {
        $sort: {_id: 1},
      }
    ]);
    /*const members: any = await MemberItem.find({
      org: req.params.id,
    });*/
    let data = {};
    for await (const doc of codeAggregate) {
      data = { ...data, [`${doc._id}`]: doc };
    }
    const content = await Content.findOne({ org: req.params.id });
    const finalData = { members: data, designations: content && content.designations ? content.designations : "" };
    res.status(200).send(finalData);
  } catch (e: any) {
    res.status(500).send({ error: e.message });
  }
});

// GET a member item
memberRouter.get("/:id/member/:member_id", async (req, res) => {
  try {
    const member = await MemberItem.findById({
      _id: req.params.member_id,
    });
    res.status(200).send(member);
  } catch (e: any) {
    res.status(500).send({ error: e.message });
  }
});
