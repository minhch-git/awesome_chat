import { authService } from './../services'
class AuthController {

  // [ GET ] /auth/login-register
  async loginRegister(req, res) {
    return res.render('auth/main');
  }

  // [ POST ] /auth/register
  async postRegister(req, res) {
    try {
      let successArr = []
      let { email, gender, password } = await req.body.valueChecked

      // register 
      let createUserSuccess = await authService.register(email, gender, password)
      successArr.push(createUserSuccess)
      
      res.render('auth/main', { successArr })
    } catch (errors) {
      let errorArr = []
      errors.details ? errors.details.forEach(err => errorArr.push(err.message)) : errorArr.push(errors)
      res.render('auth/main', { errorArr })
    }
  }
}

export default new AuthController();
