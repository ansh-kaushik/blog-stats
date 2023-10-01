const sendBlogError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    messasge: err.message,
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  sendBlogError(err, res);
  next();
};
