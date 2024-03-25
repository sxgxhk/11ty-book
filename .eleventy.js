/* ***** ----------------------------------------------- ***** **
/* ***** Eleventy Config
/* ***** ----------------------------------------------- ***** */

// Import transforms
const parseContent = require("./eleventy/transforms/parseContent.js");
// const minifyHtml = require("./eleventy/transforms/minifyHtml.js");
// const addHeaderCredit = require("./eleventy/transforms/addHeaderCredit.js");

// // Import filters
const absoluteUrl = require("./eleventy/filters/absoluteUrl.js");
const cacheBust = require("./eleventy/filters/cacheBust.js");
const htmlDate = require("./eleventy/filters/htmlDate.js");
// const readableDate = require("./eleventy/filters/readableDate.js");
const rssLastUpdatedDate = require("./eleventy/filters/rssLastUpdatedDate.js");
// const rssDate = require("./eleventy/filters/rssDate.js");
const articleUrl = require("./eleventy/filters/articleUrl.js");
const articleCategoryUrl = require("./eleventy/filters/articleCategoryUrl.js");
// const highlight = require("./eleventy/filters/highlight.js");
// const groupbydate = require("./eleventy/filters/groupbydate.js");
// const usMonth = require("./eleventy/filters/usMonth.js");

// // Import shortcodes
// // const imageUrl = require("./eleventy/shortcodes/imageUrl.js");
// const imageSrcset = require("./eleventy/shortcodes/imageSrcset.js");
// const isSamePageOrSection = require("./eleventy/shortcodes/isSamePageOrSection.js");
// const svg = require("./eleventy/shortcodes/svg.js");
// const currentYear = require("./eleventy/shortcodes/currentYear.js");

const excerpt = require("./eleventy/filters/excerpt.js");

const ghostContentAPI = require("@tryghost/content-api");
const {
    ghost,
    memos,
    mode,
    customPage,
    taxonomy,
    footer,
} = require("./config.js");

// Init Ghost API
const api = new ghostContentAPI({ ...ghost });
// const pd = require("pandas");

// const axios = require("axios");

const loadData = mode[process.env.NODE_ENV.trim()].limit;

module.exports = function (config) {
    //   if (process.env.NODE_ENV.trim() !== "development")
    //     config.addTransform("minifyHtml", minifyHtml);
    //   config.addTransform("addHeaderCredit", addHeaderCredit);
    config.addTransform("parseContent", parseContent);

    config.addGlobalData("taxonomys", taxonomy);
    config.addGlobalData("footer", footer);

    // Filters
    config.addFilter("excerpt", excerpt);
    config.addFilter("absoluteUrl", absoluteUrl);
    config.addFilter("cacheBust", cacheBust);
    config.addFilter("htmlDate", htmlDate);
    //   config.addFilter("readableDate", readableDate);
    config.addFilter("rssLastUpdatedDate", rssLastUpdatedDate);
    //   config.addFilter("rssDate", rssDate);
    config.addFilter("articleUrl", articleUrl);
    config.addFilter("articleCategoryUrl", articleCategoryUrl);
    //   config.addFilter("highlight", highlight);
    //   config.addFilter("getReadingTime", (text) => {
    //     const wordsPerMinute = 200;
    //     const numberOfWords = text.split(/\s/g).length;
    //     return Math.ceil(numberOfWords / wordsPerMinute);
    //   });
    //   config.addFilter("groupbydate", groupbydate);
    //   config.addFilter("usMonth", usMonth);

    //   // Shortcodes
    //   // config.addShortcode("imageUrl", imageUrl);
    //   config.addShortcode("imageSrcset", imageSrcset);
    //   config.addShortcode("isSamePageOrSection", isSamePageOrSection);
    //   config.addShortcode("svg", svg);
    //   config.addShortcode("currentYear", currentYear);

    // Layout aliases
    config.addLayoutAlias("base", "layouts/base.liquid");

    config.addFilter("getReadingTime", (text) => {
        const wordsPerMinute = 200;
        const numberOfWords = text.split(/\s/g).length;
        return Math.ceil(numberOfWords / wordsPerMinute);
    });

    // Don't ignore the same files ignored in the git repo
    config.setUseGitIgnore(false);

    // Get all pages, called 'docs' to prevent
    // conflicting the eleventy page object
    config.addCollection("docs", async function (collection) {
        collection = await api.pages
            .browse({
                include: "tags,authors",
                limit: "all",
            })
            .catch((err) => {
                console.error(err);
            });

        collection = collection.filter(function (page) {
            return customPage.indexOf(page.slug);
        });

        return collection;
    });

    // Get all posts
    config.addCollection("posts", async function (collection) {
        collection = await api.posts
            .browse({
                include: "tags,authors",
                limit: loadData,
                order: "published_at desc",
                filter: "visibility:public",
            })
            .catch((err) => {
                console.error(err);
            });

        return collection;
    });

    // Get all authors
    config.addCollection("authors", async function (collection) {
        collection = await api.authors
            .browse({
                limit: "all",
                filter: "visibility:public",
            })
            .catch((err) => {
                console.error(err);
            });

        // Get all posts with their authors attached
        const posts = await api.posts
            .browse({
                include: "authors",
                filter: "visibility:public",
                limit: "all",
            })
            .catch((err) => {
                console.error(err);
            });

        return collection;
    });

    // Get all tags
    config.addCollection("tags", async function (collection) {
        collection = await api.tags
            .browse({
                include: "count.posts",
                limit: "all",
                order: "count.posts desc",
            })
            .catch((err) => {
                console.error(err);
            });

        // Get all posts with their tags attached
        const posts = await api.posts
            .browse({
                include: "tags,authors",
                limit: "all",
                order: "published_at desc",
                filter: "visibility:public",
            })
            .catch((err) => {
                console.error(err);
            });

        posts.forEach((post) => {
            post.tags = post.tags.filter((tag) => tag.visibility == "public");
        });

        // Attach posts to their respective tags
        collection.forEach(async (tag) => {
            const taggedPosts = posts.filter((post) => {
                return post.primary_tag && post.primary_tag.slug === tag.slug;
            });
            if (taggedPosts.length) tag.posts = taggedPosts;
        });

        return collection;
    });

    // Get all tags
    config.addCollection("tagsPagetion", async function (collection) {
        collection = await api.tags
            .browse({
                include: "count.posts",
                limit: "all",
            })
            .catch((err) => {
                console.error(err);
            });

        // Get all posts with their tags attached
        const posts = await api.posts
            .browse({
                include: "tags,authors",
                limit: "all",
                order: "published_at desc",
                filter: "visibility:public",
            })
            .catch((err) => {
                console.error(err);
            });

        // posts.forEach((post) => {
        //   post.tags = post.tags.filter((tag) => tag.visibility == "public");
        // });

        const pagedPosts = [];

        // Attach posts to their respective tags
        collection.forEach(async (tag) => {
            const taggedPosts = posts.filter((post) => {
                return post.tags.some((ptag) => ptag.slug === tag.slug);
            });
            // if (taggedPosts.length) tag.posts = taggedPosts;
            if (taggedPosts.length) {
                const numberOfPage = Math.ceil(taggedPosts.length / 7);
                for (let pageNum = 1; pageNum <= numberOfPage; pageNum++) {
                    const sliceFrom = (pageNum - 1) * 7;
                    const sliceTo = sliceFrom + 7;

                    pagedPosts.push({
                        tagName: tag.name,
                        tagSlug: tag.slug,
                        number: pageNum,
                        posts: taggedPosts.slice(sliceFrom, sliceTo),
                        first: pageNum === 1,
                        last: pageNum === numberOfPage,
                    });
                    tag.posts = pagedPosts;
                }
            }
        });

        return pagedPosts;
    });

    return {
        dir: {
            input: "src/site",
            output: "dist",
        },
        htmlTemplateEngine: "liquid",
        markdownTemplateEngine: "liquid",
        dataTemplateEngine: "liquid",
    };
};
