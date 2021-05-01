class SiteController {
  async index(req, res) {
    return res.render('main/home/home');
  }
}

export default new SiteController();
