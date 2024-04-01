/* ***** ----------------------------------------------- ***** **
/* ***** HTML Date Filter 时间格式转换
/* ***** ----------------------------------------------- ***** */

const { DateTime } = require('luxon')
const { format } = require('timeago.js')

module.exports = (isoDate,format = 'LLLL dd, yyyy') => {
  if(isoDate == 'dddd' || format == 'dddd'){
    console.log('11');
  }
  return DateTime.fromISO(isoDate).toFormat(format)
}
