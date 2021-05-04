import { tranSuccess } from '../../../lang/vi';
import { authService } from './../services'

class AuthController {

  // [ GET ] /login-register
  async getLoginRegister(req, res) {
    return res.render('auth/main', {
      errors: req.flash('errors'),
      success: req.flash('success')
    });
  }

  // [ GET ] /getLogout
  async getLogout (req, res) {
    req.logout() // remove session passport user

    req.flash('success', tranSuccess.logout_success)
    res.redirect('/login-register')
  }

  // [ POST ] /register
  async postRegister(req, res) {
    let errorsArr = []
    let successArr = []
    try {
      // register 
      let { email, gender, password } = await req.body.valueChecked
      let createUserSuccess = await authService.register(email, gender, password, req.protocol, req.get('host'))
      successArr.push(createUserSuccess)

      req.flash('success', successArr)
      res.redirect('/login-register')
    } catch (errors) {
      // messages error
      errors.details ? errors.details.forEach(err => errorsArr.push(err.message)) : errorsArr.push(errors)

      req.flash('errors', errorsArr)
      res.redirect('/login-register')
    }
  }

  // [ GET ] /verify/token
  async verifyAccount(req, res) {
    let successArr = []
    let errorsArr = []
    try {
      let { token } = req.params
      let verifySuccess = await authService.verifyAccount(token)
      successArr.push(verifySuccess)

      req.flash('success', successArr)
      res.redirect('/login-register')
    } catch (error) {
      errorsArr.push(error)
      
      req.flash('errors', errorsArr)
      res.redirect('/login-register')
    }
  }
}

export default new AuthController();
