'use strict'

const Post = use('App/Models/Post')
const Label = use('App/Models/Label')
const LabelController = require('./LabelController')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with posts
 */
class PostController {
  /**
   * Show a list of all posts.
   * GET posts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const label_id = request.get().label_id
    const page = request.get().page || 1
    const perPage = 10
    let posts = {}

    if (!label_id) {
      posts = await Post.where({is_deleted: false}).sort('-is_top').paginate(page, perPage)
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
    const data = Object.assign({}, request.post(), {
      is_deleted: false,
      like_num: 0,
      comment_num: 0,
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

  /**
   * Display a single post.
   * GET posts/:id
   */
  async show ({ params, request, response, view }) {
    return await Post.find(params.id)
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
  async update ({ params, request, response }) {
    const data = request.post()
    const model = await Post.find(params.id)
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
}

module.exports = PostController
