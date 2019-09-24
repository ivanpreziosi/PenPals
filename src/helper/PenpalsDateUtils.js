
exports.getUnixTimestampNow = function () {
  return Date.now() / 1000 | 0;
};

exports.getMysqlDateNow = function () {
    var d = new Date();    
    var datestring = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    return datestring;
};