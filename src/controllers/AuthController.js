class AuthController {

  // [ GET ] /auth/login-register
  async index(req, res) {
    return res.render('auth/main');
  }

  // [ POST ] /auth/register
  async postRegister(req, res) {
    console.log(req.body)
  }
}

export default new AuthController();
