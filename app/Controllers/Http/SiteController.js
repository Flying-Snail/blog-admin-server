'use strict'

class SiteController {
  index () {
    return {
      name: 'Home'
    }
  }
  login () {
    return 'login'
  }
}

module.exports = SiteController
