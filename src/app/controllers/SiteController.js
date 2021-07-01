import {
  notificationService,
  contactService,
} from './../services/index';
class SiteController {
  // [ GET ] /
  async getHome(req, res) {
    // get notifications (10 items one time)
    let notifs = await notificationService.getNotifications(
      req.user._id
    );
    // get amount notifications unread
    let countNotifUnread =
      await notificationService.countNotifUnread(req.user._id);

    // get contacts (10 items one time)
    let contacts = await contactService.getContacts(req.user._id);
    // get contacts sent (10 items one time)
    let contactsSent = await contactService.getContactsSent(
      req.user._id
    );
    // get contacts received (10 items one time)
    let contactsReceived = await contactService.getContactsReceived(
      req.user._id
    );

    // Count all contacts
    let countAllContacts = await contactService.countAllContacts(
      req.user._id
    );
    // Count all contacts sent
    let countAllContactsSent =
      await contactService.countAllContactsSent(req.user._id);
    // Count all contacts received
    let countAllContactsReceived =
      await contactService.countAllContactsReceived(req.user._id);

    return res.render('main/home/home', {
      errors: req.flash('errors'),
      success: req.flash('success'),
      user: req.user,
      notifications: notifs,
      countNotifUnread: countNotifUnread,
      contacts,
      contactsSent,
      contactsReceived,
      countAllContacts,
      countAllContactsSent,
      countAllContactsReceived,
    });
  }

  // [ GET ] /login-register
  async getLoginRegister(req, res) {
    return res.render('auth/main', {
      errors: req.flash('errors'),
      success: req.flash('success'),
    });
  }
}

export default new SiteController();
