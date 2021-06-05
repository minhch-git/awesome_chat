class Login {
  isLoggedOut(req, res, next) {
    if (req.isAuthenticated()) { //false
      return res.redirect('/')
    }
    next()
  }

  isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) { // true
      return res.redirect('/login-register')
    }
    next()
  }
}

export default new Login()