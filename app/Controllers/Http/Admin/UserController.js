'use strict'
const User = use('App/Models/User')
const jwt = require('jsonwebtoken')

class UserController {
  async index ({request}) {
    const token = request.header('authorization')
    const page = request.get().page || 1
    const perPage = request.get().perPage || 10

    try {
      const sign = jwt.verify(token, "844030491@qq.com")
      const _id = sign.user_id
      const model = await User.find(_id)
      if (!model.admin) throw new Error("admin required")
    } catch (error) {
      throw error
    }

    return await User.where({admin: false}).paginate(page, perPage)
  }

  /**
   * Create/save a new post.
   * POST posts
   */
  async update ({ params, request }) {
    const data = request.post()
    const model = await User.find(params.id)
    model.merge(data)
    await model.save()
    return {
      success: true
    }
  }

  /**
   * Delete a post with id.
   * DELETE posts/:id
   */
  async destroy ({ params }) {
    const user_id = params.id
    const model = await Post.find(user_id)

    if (!model || model.is_deleted) return
    model.is_deleted = true

    await model.save()
    return {
      success: true
    }
  }
}

module.exports = UserController
