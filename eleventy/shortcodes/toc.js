const cheerio = require('cheerio');

module.exports = (html) => {
    if (!html) return;

    const $ = cheerio.load(html);
    let toc = "<ul>";
    let currentH2 = null;
    let currentH3 = null;

    $("h2, h3, h4").each((i, el) => {
        const tagName = $(el).prop("tagName");
        const id = $(el).attr("id");
        const title = $(el).text();

        if (tagName === "H2") {
            if (currentH2) {
                if (currentH3) {
                    toc += "</ul></li>";
                    currentH3 = null;
                }
                toc += "</ul></li>";
            }
            toc += `<li><a href="#${id}">${title}</a><ul>`;
            currentH2 = id;
        } else if (tagName === "H3") {
            if (currentH3) {
                toc += "</ul></li>";
            }
            toc += `<li><a href="#${id}">${title}</a><ul>`;
            currentH3 = id;
        } else if (tagName === "H4") {
            toc += `<li><a href="#${id}">${title}</a></li>`;
        }
    });

    if (currentH3) {
        toc += "</ul></li>";
    }
    if (currentH2) {
        toc += "</ul></li>";
    }
    toc += "</ul>";

    return toc;
};
