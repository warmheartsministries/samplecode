/**
 * Required External Modules
 */

import * as dotenv from "dotenv";
import express from "express";
import { connect } from "mongoose";
import { auth } from "express-openid-connect";
import { contentRouter } from "./content/content.router";
import { connectRouter } from "./connect/connect.router";
import { calendarRouter } from "./calendar/calendar.router";
import { videoRouter } from "./video/video.router";
import { designationRouter } from "./designation/designation.router";
import { memberRouter } from "./member/member.router";
import { documentRouter } from "./document/document.router";
import { blogRouter } from "./blog/blog.router";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import path from "path";

dotenv.config();

/**
 * App Variables
 */

if (!process.env.PORT) {
  console.log("ERROR: PORT not found.");
  process.exit(1);
}
const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

const config = {
  authRequired: false,
  idpLogout: true,
  auth0Logout: true,
  secret: process.env.SECRET,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  baseURL: process.env.BASE_URL,
};

const connectDB = async () => {
  console.log("Connecting to MONGODB....");
  try {
    if (process.env.MONGODB_URL) {
      const conn = await connect(process.env.MONGODB_URL);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } else {
      console.log("ERROR: MONGODB_URL not found.");
      process.exit(1);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

/**
 *  App Configuration
 */

//app.use(express.static(path.join(__dirname, "../../web/build")));
app.use(express.static(path.join(__dirname, "./web/build")));
app.use(express.json());

app.use(auth(config));

app.use("/", connectRouter);
app.use("/api", contentRouter);
app.use("/calendar", calendarRouter);
app.use("/videos", videoRouter);
app.use("/designation", designationRouter);
app.use("/members", memberRouter);
app.use("/documents", documentRouter);
app.use("/blogs", blogRouter);

app.use(errorHandler);

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  //res.sendFile(path.resolve(__dirname, "../../web/build", "index.html"));
  res.sendFile(path.resolve(__dirname, "./web/build", "index.html"));
});

app.use(notFoundHandler);

/**
 * Server Activation
 */

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
