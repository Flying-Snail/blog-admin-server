const makeDouNum = function (num) {
  return num > 9 ? num : '0' + num
}
exports.formatDate = function () {
  const time = new Date()
  return time.getFullYear() + '/' + makeDouNum(time.getMonth() + 1)
}