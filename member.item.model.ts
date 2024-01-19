import mongoose from "mongoose";

const memberItemSchema = new mongoose.Schema({
  org: {
    type: String,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  title: {
    type: String,
  },
  designation: {
    type: Number,
  },
  description: {
    type: String,
  },
  photo: {
    type: String,
  },
});

const MemberItem = mongoose.model("MemberItem", memberItemSchema);

export default MemberItem;
