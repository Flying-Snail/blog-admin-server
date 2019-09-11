'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.post('/login', 'LoginController.index')
Route.post('/register', 'LoginController.register')
Route.get('/admin/api/users/show', 'Admin/UserController.show')
Route.post('/admin/api/posts/like/:id', 'Admin/PostController.like')
Route.get('/admin/api/posts/search', 'Admin/PostController.search')

Route.resource('/admin/api/users', 'Admin/UserController')
Route.resource('/admin/api/posts', 'Admin/PostController')
Route.resource('/admin/api/comment', 'Admin/CommentController')
Route.resource('/admin/api/labels', 'Admin/LabelController')
Route.resource('/admin/upload/image', 'Asset/ImageController')