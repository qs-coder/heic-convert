const decode = require('@qs-coder/heic-decode');
const formats = require('./formats-browser.js');
const { one, all } = require('./lib.js')(decode, formats);

module.exports = one;
module.exports.all = all;
