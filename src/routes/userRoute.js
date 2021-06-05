import { Router } from 'express'
import validate, { SchemaValidate } from '../validation/validate'
let router = new Router()
import isLogin from './../validation/isLogin'

import userController from '../app/controllers/UserController'

router.put('/update-info',
  isLogin.isLoggedIn,
  validate.body(SchemaValidate.updateInfo),
  userController.updateInfo)

router.put('/update-avatar',
  isLogin.isLoggedIn,
  userController.updateAvatar)

router.put('/update-password',
  isLogin.isLoggedIn,
  validate.body(SchemaValidate.updatePassword),
  userController.updatePassword)


export default router