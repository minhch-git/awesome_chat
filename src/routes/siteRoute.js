// import controller
import siteController from '../app/controllers/SiteController'
import authMiddleware from '../app/middlewares/authMiddleware'

import { Router } from 'express'
const router = new Router()

router.get('/login-register', authMiddleware.isLoggedOut, siteController.getLoginRegister)
router.get('/', authMiddleware.isLoggedIn, siteController.getHome)

export default router
