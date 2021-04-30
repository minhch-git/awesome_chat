class SiteController {
  async index(req, res) {
    return res.render('main/master');
  }
}

export default new SiteController();
