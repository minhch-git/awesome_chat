import { Router } from 'express'
import passport from 'passport'
const router = new Router()

// import controller
import siteController from './../controllers/SiteController'
import authController from './../controllers/AuthController'
import { validate, schemaValidate } from './../validate'
import initPassportLocal from './../controllers/passportController/local'

// init passport
initPassportLocal()

// add route
router.post('/register', validate.body(schemaValidate.register), authController.postRegister)
router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/',
    failureRedirect: '/login-register',
    successFlash: true,
    failureFlash: true,
  }
))

router.get('/login-register', authController.loginRegister)
router.get('/verify/:token', authController.verifyAccount)

router.route('/')
  .get(siteController.index)

export default router
