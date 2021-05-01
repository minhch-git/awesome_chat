import { Router } from 'express'
const router = new Router()

// import controller
import siteController from './../controllers/SiteController'
import authController from './../controllers/AuthController'
import validate from './../validate/validate'
import { register } from './../validate/schemaValidate'

// add route
router.route('/')
  .get(siteController.index)

router.route('/register')
  .post(validate.body(register), authController.postRegister)

export default router
