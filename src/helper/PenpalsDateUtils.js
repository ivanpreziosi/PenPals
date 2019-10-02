

exports.getUnixTimestampNow = function () {
  var moment = require('moment');
  return moment().format('X');
};

exports.getMysqlDateNow = function () {
  var moment = require('moment');
  return moment().format('YYYY-MM-DD HH:mm:ss');
};

exports.getRequestExpirationDate = function () {
  var moment = require('moment');
  return moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss');
};

exports.getTokenExpirationDate = function () {
  var moment = require('moment');
  return moment().subtract(20, 'minutes').format('YYYY-MM-DD HH:mm:ss');
};