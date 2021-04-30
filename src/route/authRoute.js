import { Router } from 'express'
const router = new Router()

import authController from './../controllers/AuthController'

router.get('/login-register', authController.index)
router.route('/')
  .get()

export default router
