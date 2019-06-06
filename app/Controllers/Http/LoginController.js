'use strict'
const jwt = require('jsonwebtoken')
const User = use('App/Models/User')

class LoginController {
  async index ({request}) {
    const {user_name, password} = request.post()
    const models = await User.where({ user_name: user_name }).fetch()

    if (models.rows.length === 0) return { success: false, message: '用户不存在' }
    const model = models.rows[0]
    if (password !== model.password) return { success: false, message: '密码不正确' }

    const user_id = model._id
    const token = jwt.sign({ user_id, user_name }, '844030491@qq.com', {
        expiresIn: '7 days'
    })

    return {
      success: true,
      token,
      user_data: model,
    }
  }
  
  async register ({request}) {
    const {user_name, password, nick_name, avatar_id} = request.post()

    if ( !user_name || !password || !nick_name) return { success: false }

    const model = new User()
    model.fill({ user_name, password, nick_name, admin: false, avatar_id, is_deleted: false })
    await model.save()

    return {
      success: true,
    }
  }
}

module.exports = LoginController
