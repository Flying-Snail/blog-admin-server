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

Route.get('/', 'SiteController.index')
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

// Uncomment the following code to test with mongodb

// Route.get('/test', async () => {
//   const User = use('App/Models/User')
//   await User.findOrCreate({
//     name: 'adonis-mongo-app'
//   }, {
//     name: 'adonis-mongo-app',
//     github: 'https://github.com/wxs77577/adonis-mongo-app',
//     cmd: 'adonis new api-server --blueprint wxs77577/adonis-mongo-app',
//     'cmd-cnpm': 'adonis new api-server --blueprint wxs77577/adonis-mongo-app --cnpm'
//   })
//   return await User.query().sort('-_id').paginate(1)
// })