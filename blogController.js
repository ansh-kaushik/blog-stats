const _ = require("lodash");
const AppError = require("./appError");
const getData = async (url, method, options, next) => {
  try {
    const apiUrl = url;
    const requestOptions = {
      method,
      headers: options.customHeaders,
    };
    const response = await fetch(apiUrl, requestOptions);
    const data = await response.json();
    // return next(new AppError("Something went wrong", 500));
    const blogs = data.blogs;
    if (!blogs) return next(new AppError(data.error, 500));
    return blogs;
  } catch (err) {
    next(err);
  }
};

const getSearchedBlogs = (str, queryWord) => {
  const regExp = new RegExp(queryWord, "i");

  return regExp.test(str);
};
exports.getBlogStats = async (req, res, next) => {
  //  1) fetching blogs
  try {
    const url = "https://intent-kit-16.hasura.app/api/rest/blogs";
    const customHeaders = {
      "x-hasura-admin-secret":
        "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
    };
    const blogs = await getData(url, "GET", { customHeaders }, next);
    if (!blogs) return next(new AppError("Something went wrong", 500));

    // 2) data manipuation
    const totalBlogsCount = _.size(blogs);
    const titleList = _.map(blogs, (el) => el.title);
    const longestTitle = _.maxBy(titleList, "length");

    const privacyTitleBlogsCount = _(titleList)
      .filter((str) => _.includes(str, "Privacy"))
      .size();
    const uniqueTitlesList = _.uniq(titleList);
    const uniqueTitles = { count: _.size(uniqueTitlesList), uniqueTitlesList };

    // 3) sending res
    res.status(200).json({
      status: "success",
      data: {
        totalBlogsCount,
        longestTitle,
        privacyTitleBlogsCount,
        uniqueTitles,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getBlogs = async (req, res, next) => {
  try {
    //  1) fetching blogs
    const url = "https://intent-kit-16.hasura.app/api/rest/blogs";
    const customHeaders = {
      "x-hasura-admin-secret":
        "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
    };
    const blogs = await getData(url, "GET", { customHeaders }, next);
    if (!blogs) return next(new AppError("Something went wrong", 500));
    // 2)data maniputaion
    const queryParams = req.query;
    const queryWord = queryParams.query;
    if (!queryWord) {
      return next(new AppError("Please provide the query string", 400));
    }
    const results = blogs.filter((el) => getSearchedBlogs(el.title, queryWord));

    res.status(200).json({
      status: "success",
      data: {
        results,
      },
    });
  } catch (err) {
    next(err);
  }
};
