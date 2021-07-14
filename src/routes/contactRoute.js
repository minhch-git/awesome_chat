import { Router } from 'express';
import Validate, { SchemaValidate } from './../validation/validate';
let router = new Router();

import contactController from '../app/controllers/ContactController';
import isLogin from './../validation/isLogin';

router.get(
  '/find-users/:keyword',
  Validate.params(SchemaValidate.keyword),
  contactController.findUsersContact
);
router.post(
  '/add-new',
  isLogin.isLoggedIn,
  contactController.addNew
);
router.delete(
  '/remove-contact',
  isLogin.isLoggedIn,
  contactController.removeContact
);
router.delete(
  '/remove-request-contact-sent',
  isLogin.isLoggedIn,
  contactController.removeRequestContactSent
);
router.delete(
  '/remove-request-contact-received',
  isLogin.isLoggedIn,
  contactController.removeRequestContactReceived
);

router.put(
  '/approve-request-contact-received',
  isLogin.isLoggedIn,
  contactController.approveRequestContactReceived
);

router.get(
  '/read-more-contacts',
  isLogin.isLoggedIn,
  contactController.readMoreContacts
);

router.get(
  '/read-more-contacts-sent',
  isLogin.isLoggedIn,
  contactController.readMoreContactsSent
);
router.get(
  '/read-more-contacts-received',
  isLogin.isLoggedIn,
  contactController.readMoreContactsReceived
);

export default router;
