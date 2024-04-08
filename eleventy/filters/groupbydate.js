/* ***** ----------------------------------------------- ***** **
/* ***** RSS Date Filter
/* ***** ----------------------------------------------- ***** */

const _ = require("lodash");

module.exports = (data) => {
  // 先按照年份分组
  let result = _(data)
  .groupBy(x => x.published_at.substring(0, 4)) // group by year
  .map((value, key) => ({
    year: key,
    data: _(value).groupBy(x => x.published_at.substring(5, 7)) // group by month
              .map((v, k) => ({ month: k, data: v })).orderBy(['month'], ['desc']).value() // formate month data
  }))
  .orderBy(['year'], ['desc'])
  .value();

  return result;
};
