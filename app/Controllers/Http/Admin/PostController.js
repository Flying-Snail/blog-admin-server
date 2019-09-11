'use strict'

const Post = use('App/Models/Post')
const Label = use('App/Models/Label')
const jwt = require('jsonwebtoken')
const User = use('App/Models/User')
const LabelController = require('./LabelController')
const { verifyUser } = require('../../../util')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with posts
 */
class PostController {

  async index ({ request }) {
    const label_id = request.get().label_id
    const page = request.get().page || 1
    const perPage = 10
    const token = request.header('authorization')
    let posts = []
    let isAdmin = false

    if (!!token) {
      // 权限认证，看请求人是否是管理员
      try {
        const sign = jwt.verify(token, '844030491@qq.com')
        const id = sign.user_id
        const model_user = await User.find(id)
        isAdmin = model_user.admin
      } catch (error) {
      }
    }

    if (!label_id) {
      // 带 label_id 参数的请求
      // admin 权限可以查看所有博客，普通权限只能查看已发布
      posts = isAdmin
        ? await Post.where({is_deleted: false}).sort('-is_top').paginate(page, perPage)
        : await Post.where({is_deleted: false, is_released: true}).sort('-is_top').paginate(page, perPage)

      return posts
    }

    const model_label = await Label.find(label_id)
    const post_ids = model_label.posts
    const datas = post_ids.map(async (post_id) => await Post.find(post_id))
    await Promise.all(datas).then(data => {
      const visible_data = data.filter(post => !post.is_deleted)
      const total = visible_data.length
      const lastPage = Math.ceil(total / perPage)
      posts = {
        total, page, perPage, lastPage, 
        data: visible_data,
      }
    })
    return posts
  }

  /**
   * Create/save a new post.
   * POST posts
   */
  async store ({ request, response }) {
    const token = request.header('authorization')
    verifyUser(token)

    const data = Object.assign({}, request.post(), {
      is_released: false,
      is_deleted: false,
      like_num: 0,
      comment_num: 0,
      see_num: 0,
    })

    const modelPost = new Post()
    modelPost.fill(data)
    await modelPost.save()

    // 储存 label 表数据
    const labels = data.labels
    const postId = modelPost._id
    LabelController.store(postId, labels)

    return modelPost
  }

  async like ({ params, request }) {
    const is_add  = request.post().add
    const token = request.header('authorization')

    if (token) {
      try {
        const sign = jwt.verify(token, '844030491@qq.com')
        const id = sign.user_id
        const model_user = await User.find(id)
        const posts =  is_add
                        ? model_user.liked_posts.concat([params.id])
                        : model_user.liked_posts.filter(id => (id !== params.id))
        model_user.merge({liked_posts: posts})
        await model_user.save()
      } catch (error) {
        return {
          success: false,
          message: error.message,
        }
      }
    }
  
    const model = await Post.find(params.id)
    const new_like_num = is_add ? model.like_num + 1 : model.like_num - 1
    model.merge({ like_num: new_like_num })
    await model.save()
    return {
      success: true
    }
  }

  /**
   * Display a single post.
   * GET posts/:id
   */
  async show ({ params }) {
    const id = params.id
    const model = await Post.find(id)
    const see_num = model.see_num + 1
    model.merge({see_num})
    await model.save()
    return model
  }

  /**
   * Render a form to update an existing post.
   * GET posts/:id/edit
   */
  async edit ({ params, request, response, view }) {
    return await Post.find(params.id)
  }

  /**
   * Update post details.
   * PUT or PATCH posts/:id
   */
  async update ({ params, request }) {
    const data = request.post()
    const model = await Post.find(params.id)
    const oldLabels = model.labels
    const newLabels = data.labels
    const lessLabels = oldLabels.filter(label => {
      return newLabels.indexOf(label) === -1
    })
    const addLabels = newLabels.filter(label => {
      return oldLabels.indexOf(label) === -1
    })

    LabelController.store(params.id, addLabels)
    LabelController.lessPostLabels(lessLabels, params.id)

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
    const post_id = params.id
    const model = await Post.find(post_id)

    if (!model || model.is_deleted) return
    model.is_deleted = true

    await model.save()
    return {
      success: true
    }
  }

  async search ({ request }) {
    const input = request.get().search
    const page = request.get().page || 1
    const perPage = 10

    if (!input) return await Post.where({is_deleted: false}).sort('-is_top').paginate(page, perPage)

    const models = await Post.where({is_deleted: false}).fetch()
    const posts = models.rows.filter(model => {
      return new RegExp(input).test(model.title) || model._id === input
    })
    const total = posts.length
    const lastPage = Math.ceil(total / perPage)
    return {
      total, page, perPage, lastPage, 
      data: posts,
    }
  }
}

module.exports = PostController
