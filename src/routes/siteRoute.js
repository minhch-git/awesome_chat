// import controller
import siteController from '../app/controllers/SiteController'
import authController from '../app/controllers/AuthController'
import { validate, schemaValidate } from '../validation'
import initPassportLocal from '../app/controllers/passportController/local'
import authMiddleware from '../app/middlewares/authMiddleware'
import { Router } from 'express'
import passport from 'passport'
const router = new Router()

// init passport
initPassportLocal()

// add route
router.post('/register', authMiddleware.checkLoggedOut, validate.body(schemaValidate.register), authController.postRegister)
router.post('/login', authMiddleware.checkLoggedOut, passport.authenticate('local',
  {
    successRedirect: '/',
    failureRedirect: '/login-register',
    successFlash: true,
    failureFlash: true,
  }
))

router.get('/logout', authMiddleware.checkLoggedIn, authController.getLogout)

router.get('/login-register', authMiddleware.checkLoggedOut, authController.getLoginRegister)
router.get('/verify/:token', authMiddleware.checkLoggedOut, authController.verifyAccount)

router.get('/', authMiddleware.checkLoggedIn, siteController.getHome)

export default router
