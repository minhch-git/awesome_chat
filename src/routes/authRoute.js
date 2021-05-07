import { Router } from 'express'
const router = new Router()

import validate, { SchemaValidate } from '../validation/validate'
import authController from '../app/controllers/AuthController'

import passportController from '../app/controllers/PassportController'
import passport from 'passport'


// init passport
passportController.applyPassportLocal(passport);

// login type: local
router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login-register',
    successRedirect: '/',
    successFlash: true,
    failureFlash: true
  })
)

router.post('/register',
  validate.body(SchemaValidate.register),
  authController.postRegister
)
router.get('/verify/:token', authController.verifyAccount)

export default router
