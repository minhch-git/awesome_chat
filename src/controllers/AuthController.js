class AuthController {
  async index(req, res) {
    return res.render('auth/main');
  }
}

export default new AuthController();
