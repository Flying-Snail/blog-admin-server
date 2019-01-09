'use strict'

const Post = use('App/Models/Post')

class PostController {
  async index ({view}) {
    // return await Post.all()
    const posts = (await Post.all()).toJSON()

    return view.render('posts.index', {
      posts
    })
  }
  async show ({params, view}) {
    const post = (await Post.find(params.id)).toJSON()
    return view.render('posts.show', {
      post
    })
  }
}

module.exports = PostController
