import { notificationService } from './../services/index'
class SiteController {
  // [ GET ] /
  async getHome(req, res) {
    // only 10 items one time
    let notifs = await notificationService.getNotifications(req.user._id)

    // get amount notifications unread
    let countNotifUnread = notificationService.countNotifUnread(req.user._id)

    return res.render('main/home/home', {
      errors: req.flash('errors'),
      success: req.flash('success'),
      user: req.user,
      notifications: notifs,
      countNotifUnread: countNotifUnread,
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
