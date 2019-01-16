module.exports = class Util{
  formatDate() {
    const time = new Date()
    return time.getFullYear() + '/' + this.makeDouNum(time.getMonth() + 1)
  }
  makeDouNum(num) {
    return num > 9 ? num : '0' + num
  }
}