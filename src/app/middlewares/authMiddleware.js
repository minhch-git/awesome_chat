class AuthMiddleware {
  checkLoggedOut(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/login-register')
    }
    next()
  }

  checkLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
}

export default new AuthMiddleware()