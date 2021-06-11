import { notificationService } from './../services/index'
class SiteController {
  // [ GET ] /
  async getHome(req, res) {
    let notifications = await notificationService.getNotifications(req.user._id)
    console.log(notifications)

    return res.render('main/home/home', {
      errors: req.flash('errors'),
      success: req.flash('success'),
      user: req.user,
      notifications: notifications
    });
  }

  // [ GET ] /login-register
  async getLoginRegister(req, res) {
    return res.render('auth/main', {
      errors: req.flash('errors'),
      success: req.flash('success')
    });
  }
}

export default new SiteController();
