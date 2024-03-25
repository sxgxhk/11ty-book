module.exports = (value,wordcount) => {
    if (value) {
        // 使用正则表达式将文本按照空格切分成数组
        return value.slice(0, wordcount)+" ...";
    }
};
