'use strict'
const User = use('App/Models/User')
const Image = use('App/Models/Image')
const jwt = require('jsonwebtoken')
const { verifyUser } = require('../../../util')

class UserController {
  async index ({request}) {
    const token = request.header('authorization')
    const page = request.get().page || 1
    const perPage = request.get().perPage || 10

    if (!token) return {success: false}

    verifyUser(token)

    return await User.where({admin: false, is_deleted: false}).paginate(page, perPage)
  }

  async show ({ request }) {
    const token = request.header('authorization')
    if (!token) return { success: false }
    try {
      const sign = jwt.verify(token, '844030491@qq.com')
      const id = sign.user_id
      const model_user = await User.find(id)
      const model_image = await Image.find(model_user.avatar_id)
      model_user.avatar_path = model_image.file_path + '/' + model_image.file_name
      return model_user
    } catch (error) {
      throw new Error(error)
    }
  }

  async update ({ params, request }) {
    const data = request.post()
    const model = await User.find(params.id)
    model.merge(data)
    await model.save()
    return {
      success: true
    }
  }

  async destroy ({ params, request }) {
    const token = request.header('authorization')
    verifyUser(token)

    const user_id = params.id
    const model = await User.find(user_id)

    if (!model || model.is_deleted) return
    model.is_deleted = true

    await model.save()
    return {
      success: true
    }
  }
}

module.exports = UserController
