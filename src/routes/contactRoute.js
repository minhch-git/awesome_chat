import { Router } from 'express'
import Validate, { SchemaValidate } from './../validation/validate'
let router = new Router()

import contactController from '../app/controllers/ContactController'


router.get('/find-users/:keyword', Validate.params(SchemaValidate.keyword) , contactController.findUsersContact)
export default router