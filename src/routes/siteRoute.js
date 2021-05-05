// import controller
import siteController from '../app/controllers/SiteController'
import authController from '../app/controllers/AuthController'
import { initPassportLocal, initPassportFacebook } from '../app/controllers/passportController'
import { validate, schemaValidate } from '../validation'
import authMiddleware from '../app/middlewares/authMiddleware'
import { Router } from 'express'
import passport from 'passport'
const router = new Router()

// init passport
initPassportLocal()
initPassportFacebook()


// add route
router.post('/register', authMiddleware.checkLoggedOut, validate.body(schemaValidate.register), authController.postRegister)
router.post('/login', authMiddleware.checkLoggedOut, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login-register',
  successFlash: true,
  failureFlash: true,
}))

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }))
router.get('/auth/facebook/callback', passport.authenticate('facebook',{
  successRedirect: '/',
  failureRedirect: '/login-register',
}))

router.get('/logout', authMiddleware.checkLoggedIn, authController.getLogout)

router.get('/login-register', authMiddleware.checkLoggedOut, authController.getLoginRegister)
router.get('/verify/:token', authMiddleware.checkLoggedOut, authController.verifyAccount)

router.get('/', authMiddleware.checkLoggedIn, siteController.getHome)

export default router
