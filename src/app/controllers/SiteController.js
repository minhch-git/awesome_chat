class SiteController {
  // [ GET ] /
  async getHome(req, res) {
    return res.render('main/home/home', {
      errors: req.flash('errors'),
      success: req.flash('success')
    });
  }

  // [ GET ] /login-register
  async getLoginRegister(req, res) {
    return res.render('auth/main', {
      errors: req.flash('errors'),
      success: req.flash('success')
    });
  }
}

export default new SiteController();
