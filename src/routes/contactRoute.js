import { Router } from 'express'
import Validate, { SchemaValidate } from './../validation/validate'
let router = new Router()

import contactController from '../app/controllers/ContactController'
import isLogin from './../validation/isLogin'

router.get('/find-users/:keyword', Validate.params(SchemaValidate.keyword) , contactController.findUsersContact)
router.post('/add-new', isLogin.isLoggedIn , contactController.addNew)
router.delete('/remove-request-contact', isLogin.isLoggedIn , contactController.removeRequestContact)
export default router