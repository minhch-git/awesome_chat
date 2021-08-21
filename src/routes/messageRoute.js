import { Router } from 'express'
import MessageController from '../app/controllers/MessageController'
import isLogin from '../validation/isLogin'
import validate, { SchemaValidate } from '../validation/validate'

const router = new Router()

router.post(
  '/add-new-text-emoji',
  isLogin.isLoggedIn,
  validate.body(SchemaValidate.message),
  MessageController.addNewTextEmoji
)
router.post('/add-new-image', isLogin.isLoggedIn, MessageController.addNewImage)

export default router
