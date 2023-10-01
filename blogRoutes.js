const express = require("express");
const router = express.Router();
const blogController = require("./blogController");

router.route("/blog-stats").get(blogController.getBlogStats);
router.route("/blog-search").get(blogController.getBlogs);

module.exports = router;
