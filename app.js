const express = require("express");
const blogRouter = require("./blogRoutes");
const globalErrorHandler = require("./errorController");
const app = express();
app.use(express.json());
app.use("/", (req, res, next) => {
  console.log("In the middlewarwe");
  next();
});
app.use("/api", blogRouter);
app.use(globalErrorHandler);
module.exports = app;
