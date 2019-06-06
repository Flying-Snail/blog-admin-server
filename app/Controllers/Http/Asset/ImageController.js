'use strict'

const Image = use('App/Models/Image')
const Helpers = use('Helpers')
const util = require('../../../util')
const Drive = use('Drive')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with images
 */
class ImageController {
  /**
   * Show a list of all images.
   * GET images
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    return await Image.all()
  }

  /**
   * Render a form to be used for creating a new image.
   * GET images/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new image.
   * POST images
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    
    const date = util.formatDate()
    const path = '/assets/images/'+ date
    const profilePic = request.file('image', {
      types: ['image'],
      size: '10mb'
    })
    const name = `${new Date().getTime()}.${profilePic.subtype}`
    await profilePic.move(Helpers.resourcesPath(path), {
      name: name,
      overwrite: true
    })
    if (!profilePic.moved()) {
      return profilePic.error()
    }
    const model = new Image()
    const data = {
      file_name: name,
      file_path: path
    }
    model.fill(data)
    await model.save()
    return model
  }

  /**
   * Display a single image.
   * GET images/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request 
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    return await Image.find(params.id)
  }

  /**
   * Render a form to update an existing image.
   * GET images/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update image details.
   * PUT or PATCH images/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a image with id.
   * DELETE images/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const model = await Image.find(params.id)
    const file = Helpers.resourcesPath() + model.file_path + '/' + model.file_name
    await Drive.delete(file)
    await model.delete()
    return {
      success: true
    }
  }
}

module.exports = ImageController
