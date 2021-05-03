import { authService } from './../services'
class AuthController {

  // [ GET ] /auth/login-register
  async loginRegister(req, res) {
    return res.render('auth/main');
  }

  // [ POST ] /auth/register
  async postRegister(req, res) {
    try {
      let { email, gender, password } = await req.body.valueChecked
      let successArr = []

      // register 
      let createUserSuccess = await authService.register(email, gender, password, req.protocol, req.get('host'))

      // messages success
      successArr.push(createUserSuccess)
      
      res.render('auth/main', { successArr })
    } catch (errors) {
      let errorArr = []
      // messages error
      errors.details ? errors.details.forEach(err => errorArr.push(err.message)) : errorArr.push(errors)
      res.render('auth/main', { errorArr })
    }
  }
}

export default new AuthController();
