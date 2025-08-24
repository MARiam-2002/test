import app from "../src/index.js";
import serverless from "serverless-http";

const handler = serverless(app);
export default handler;
