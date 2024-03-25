/* ***** ----------------------------------------------- ***** **
/* ***** Absolute URL Filter
/* ***** ----------------------------------------------- ***** */

const { mode } = require('../../config.js')
const homeUrl = mode[process.env.NODE_ENV.trim()]


module.exports = (value) => {
  const regex = /^(http|https):\/\//i;
  if(regex.test(value)){
    return value;
  }
  return homeUrl.url ? homeUrl.url + value : value;
}
