import { tranSuccess } from "../../../lang/vi";
import { authService } from "./../services";

class AuthController {
  // [ POST ] /auth/register
  async create(req, res) {
    let errorsArr = [];
    let successArr = [];
    try {
      // register
      let { email, gender, password } = await req.body.valueChecked; // from validate
      let createUserSuccess = await authService.register(
        email,
        gender,
        password,
        req.protocol,
        req.get("host")
      );
      successArr.push(createUserSuccess);

      req.flash("success", successArr);
      res.redirect("/login-register");
    } catch (errors) {
      // errors from validate(of Joi)
      errors.details
        ? errors.details.forEach(err => errorsArr.push(err.message))
        : errorsArr.push(errors);
      req.flash("errors", errorsArr);
      res.redirect("/login-register");
    }
  }
  // [ GET ] /auth/verify/:token (nodemailer)
  async verifyAccount(req, res) {
    let successArr = [];
    let errorsArr = [];
    try {
      let { token } = req.params;
      let verifySuccess = await authService.verifyAccount(token);
      successArr.push(verifySuccess);

      req.flash("success", successArr);
      res.redirect("/login-register");
    } catch (error) {
      errorsArr.push(error);

      req.flash("errors", errorsArr);
      res.redirect("/login-register");
    }
  }

  // [ GET ] /auth/getLogout
  async getLogout(req, res) {
    req.logout(); // remove session passport user
    req.flash("success", tranSuccess.logout_success);
    res.redirect("/login-register");
  }
}

export default new AuthController();
