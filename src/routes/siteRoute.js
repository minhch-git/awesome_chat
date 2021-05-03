import { Router } from 'express'
const router = new Router()

// import controller
import siteController from './../controllers/SiteController'
import authController from './../controllers/AuthController'
import { validate, schemaValidate } from './../validate'

// add route
router.route('/login-register')
  .post(validate.body(schemaValidate.register), authController.postRegister)

router.get('/login-register', authController.loginRegister)
router.get('/verify/:token', authController.verifyAccount)

router.route('/')
  .get(siteController.index)

export default router
