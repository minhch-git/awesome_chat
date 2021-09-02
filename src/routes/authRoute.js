import { Router } from "express";
const router = new Router();
import passport from "passport";
import validate, { SchemaValidate } from "../validation/validate";

import authController from "../app/controllers/AuthController";
import passportController from "../app/controllers/PassportController";

// init passport
passportController.applyPassportLocal(passport);
// passportController.applyPassportFacebook(passport)
// passportController.applyPassportGoogle(passport)

// login type: google
// router.get('/google',
//   passport.authenticate('google', { scope: ['email'] }))
// router.get('/google/callback',
//   passport.authenticate('google', {
//     successRedirect: '/',
//     failureRedirect: '/login-register',
//     successFlash: true,
//     failureFlash: true,
//   }))

// login type: facebook
// router.get('/facebook',
//   passport.authenticate('facebook', { scope: ['email'] }))
// router.get('/facebook/callback',
//   passport.authenticate('facebook', {
//     successRedirect: '/',
//     failureRedirect: '/login-register',
//     failureFlash: true,
//     successFlash: true,
//   })
// )

// login type: local
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-register",
    successRedirect: "/",
    successFlash: true,
    failureFlash: true,
  })
);

router.post(
  "/register",
  validate.body(SchemaValidate.register),
  authController.create
);

router.get("/logout", authController.getLogout);

router.get("/verify/:token", authController.verifyAccount);

export default router;
