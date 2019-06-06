const jwt = require('jsonwebtoken')
const User = use('App/Models/User')

const makeDouNum = function (num) {
  return num > 9 ? num : '0' + num
}
exports.formatDate = function () {
  const time = new Date()
  return time.getFullYear() + '/' + makeDouNum(time.getMonth() + 1)
}

exports.verifyUser = async function (token) {
  try {
    const sign = jwt.verify(token, "844030491@qq.com")
    const _id = sign.user_id
    const model = await User.find(_id)
    if (!model.admin) throw new Error("admin required")
  } catch (error) {
    throw error
  }
}