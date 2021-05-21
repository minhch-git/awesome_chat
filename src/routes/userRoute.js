import { Router } from 'express'
import validate, { SchemaValidate } from '../validation/validate'
let router = new Router()
import authMiddleware from '../app/middlewares/authMiddleware'

import userController from '../app/controllers/UserController'

router.put('/update-info', authMiddleware.isLoggedIn, validate.body(SchemaValidate.update) , userController.updateInfo)
router.put('/update-avatar', authMiddleware.isLoggedIn, userController.updateAvatar)

export default router