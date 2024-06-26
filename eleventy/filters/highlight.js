/* ***** ----------------------------------------------- ***** **
/* ***** Cache Bust Filter 文章主题代码高亮
/* ***** ----------------------------------------------- ***** */


const { parseHTML } = require('linkedom');
const pangu = require('pangu/src/browser/pangu');
const hljs  = require("highlight.js")

module.exports = (value) => {
    const { document } = parseHTML(value);
    const blocks = document.querySelectorAll('pre code');
    for (const block of blocks) {
        block.innerHTML = hljs.highlightAuto(block.innerHTML).value;
    }

    value = document.toString();
    return value;
  }
  