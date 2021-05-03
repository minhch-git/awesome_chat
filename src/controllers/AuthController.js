import { authService } from './../services'
class AuthController {

  // [ GET ] /auth/login-register
  async loginRegister(req, res) {
    return res.render('auth/main');
  }

  // [ POST ] /auth/register
  async postRegister(req, res) {
    let errorArr = []
    let successArr = []
    let { email, gender, password } = await req.body.valueChecked

    try {
      // register 
      let createUserSuccess = await authService.register(email, gender, password, req.protocol, req.get('host'))

      successArr.push(createUserSuccess)
      res.render('auth/main', { successArr })
    } catch (errors) {
      // messages error
      errors.details ? errors.details.forEach(err => errorArr.push(err.message)) : errorArr.push(errors)
      res.render('auth/main', { errorArr })
    }
  }

  // [ GET ] /verify/token
  async verifyAccount(req, res) {
    let successArr = []
    let errorArr = []
    try {
      let { token } = req.params
      let verifySuccess = await authService.verifyAccount(token)
      successArr.push(verifySuccess)
      res.render('auth/main', { successArr })
    } catch (error) {
      errorArr.push(error)
      res.render('auth/main', { errorArr })
    }
  }
}

export default new AuthController();
