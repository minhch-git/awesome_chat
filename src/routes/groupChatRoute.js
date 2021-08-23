// import controller
import isLogin from './../validation/isLogin'

import { Router } from 'express'
import validate, { SchemaValidate } from '../validation/validate'
import GroupChatController from '../app/controllers/GroupChatController'
const router = new Router()

router.post(
  '/add-new',
  isLogin.isLoggedIn,
  validate.body(SchemaValidate.addNewGroup),
  GroupChatController.addNew
)

export default router
