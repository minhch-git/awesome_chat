// import controller
import siteController from '../app/controllers/SiteController'

import { Router } from 'express'
const router = new Router()

router.get('/login-register', siteController.getLoginRegister)
router.get('/', siteController.getHome)

export default router

