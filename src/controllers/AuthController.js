class AuthController {
  async index(req, res) {
    return res.render('auth/loginRegister');
  }
}

export default new AuthController();
