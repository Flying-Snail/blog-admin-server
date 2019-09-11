'use strict'

const Label = use('App/Models/Label')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with labels
 */
class LabelController {
  /**
   * Show a list of all labels.
   * GET labels
   */
  async index () {
    const labels = await Label.all()
    return labels
  }

  static async store (post_id, labels) {
    labels.forEach(async (label) => {
      // 查询数据库 name = label的数据
      const modelLabels = await Label.query().where({ name: label }).fetch()

      // 数据库不存在当前 label,新建 label,否则向 label 中 push post_id
      if (modelLabels.rows.length === 0) {
        this.create({name: label, posts: [post_id]})
      } else {
        this.add({ label, post_id, })
      }
    })
  }

  static async create (data) {
    const model = new Label()
    model.fill(data)
    await model.save()
  }

  static async add ({ label, post_id }) {
    const models = await Label.query().where({ name: label }).fetch()
    const model = models.rows[0]
    const origin_posts = model.posts

    model.posts = origin_posts.concat([post_id])
    await model.save()

    return {
      success: true
    }
  }

  static async lessPostLabels (labels, post_id) {
    labels.forEach(label => {
      this.less(label, post_id)
    })
  }

  static async less (label, post_id) {
    const models = await Label.query().where({ name: label }).fetch()
    const model = models.rows[0]
    const origin_posts = model.posts
    const index = origin_posts.indexOf(post_id)

    model.posts = origin_posts.splice(index, 1)
    await model.save()

    return {
      success: true
    }
  }

  async show ({ params }) {
    const labelId = params.id
    const model = await Label.find(labelId)
    return model.posts
  }

  /**
   * Delete a label with id.
   * DELETE posts/:id
   */
  async destroy ({ params }) {
    const model = await Label.find(params.id)
    await model.delete()
    return {
      success: true
    }
  }
}

module.exports = LabelController
