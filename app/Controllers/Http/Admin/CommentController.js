'use strict'
const Comment = use('App/Models/Comment')
const User = use('App/Models/User')
const Post = use('App/Models/Post')
const Image = use('App/Models/Image')

class CommentController {
  async index ({ request }) {
    const post_id = request.get().post_id
    if (!post_id) return {}
    const models =  await Comment.where({post_id: post_id, is_deleted: false}).fetch()
    const getUsersPromises =  models.rows.map(async (model) => {
      const user_id = model.user_id
      const user_model = await User.find(user_id)
      const avatar_id = user_model.avatar_id
      const avatar_model = await Image.find(avatar_id)

      if (model.replyed_id) {
        const replyed_user_id = model.replyed_user_id
        const user_model = await User.find(replyed_user_id)
        model.replyed_nick_name = user_model.nick_name
      }

      model.avatar_path = avatar_model.file_path + '/' + avatar_model.file_name
      model.nick_name = user_model.nick_name
    })
    await Promise.all(getUsersPromises)
    return models
  }

  async store ({ request }) {
    const { content, post_id, user_id, replyed_id, replyed_user_id } = request.post()
    const data = {
      is_released: false,
      is_deleted: false,
      content,
      post_id,
      user_id,
      replyed_id,
      replyed_user_id,
    }

    const model = new Comment()
    const model_post = await Post.find(post_id)
    const comment_num = model_post.comment_num + 1

    model.fill(data)
    model_post.merge({comment_num})
    await model.save()
    await model_post.save()

    return model
  }

  async destroy ({ params }) {
    const id = params.id
    const model = await Comment.find(id)

    if (!model || model.is_deleted) return { success: true }
    model.is_deleted = true

    await model.save()
    return {
      success: true
    }
  }
}

module.exports = CommentController
