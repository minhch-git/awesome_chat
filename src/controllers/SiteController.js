class SiteController {
  // [ GET ] /
  async index(req, res) {
    return res.render('main/home/home', {
      errors: req.flash('errors'),
      success: req.flash('success')
    });
  }
}

export default new SiteController();
