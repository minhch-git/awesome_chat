import { Router } from 'express'
let router = new Router()
import authMiddleware from '../app/middlewares/authMiddleware'

import userController from '../app/controllers/UserController'

router.put('/update-avatar', authMiddleware.isLoggedIn, userController.updateAvatar)

export default router