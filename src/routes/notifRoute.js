import { Router } from 'express'
const router = new Router()
import notifController from '../app/controllers/notifController'
import isLogin from './../validation/isLogin'

router.put('/mark-all-as-read', isLogin.isLoggedIn, notifController.markAllAsRead)
router.get('/read-more', isLogin.isLoggedIn, notifController.readMore)
export default router
