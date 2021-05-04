class SiteController {
  // [ GET ] /
  async getHome(req, res) {
    return res.render('main/home/home', {
      errors: req.flash('errors'),
      success: req.flash('success')
    });
  }
}

export default new SiteController();
