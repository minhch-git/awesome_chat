import { Router } from 'express'
const router = new Router()


import authController from './../controllers/AuthController'
import { validate, schemaValidate } from './../validate'

router.route('/register')
  .post(validate.body(schemaValidate.register), authController.postRegister)

router.get('/login-register', authController.loginRegister)

export default router
