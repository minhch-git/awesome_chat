import { Router } from 'express'
const router = new Router()

// import controller
import siteController from './../controllers/SiteController'

// add route
router.route('/')
  .get(siteController.index)

export default router
