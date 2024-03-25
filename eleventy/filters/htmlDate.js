/* ***** ----------------------------------------------- ***** **
/* ***** HTML Date Filter 时间格式转换
/* ***** ----------------------------------------------- ***** */

const { DateTime } = require('luxon')
const { format } = require('timeago.js')

module.exports = (isoDate) => {
  return DateTime.fromISO(isoDate).toFormat('LLLL dd, yyyy')
}
