import passport from 'passport'
import passportLocal from 'passport-local'

let LocalStrategy = passportLocal.Strategy

import UserModel from './../../models/userModel'
import { transErrors, tranSuccess } from './../../../lang/vi'

/**
 * Valid user account type local
 */

let initPassportLocal = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  }, async (req, username, password, done) => {
    try {
      let user = await UserModel.findByEmail(username)

      if (!user) {
        return done(null, false, req.flash('errors', transErrors.login_failed))
      }

      if(!user.local.isActive) {
        return done(null, false, req.flash('errors', transErrors.account_not_active))
      }

      let checkPassword = await user.comparePassword(password)
      if(!checkPassword) {
        return done(null, false, req.flash('errors', transErrors.login_failed))
      }
      return done(null, user, req.flash('success', tranSuccess.login_success(user.username)))
    } catch (error) {
      console.log(error)
      return done(null, false, req.flash('errors', transErrors.server_error))
    }
  }))
  
  // save userId to session
  passport.serializeUser((user, done)=>done(null, user.id))

  // this is called by passport.session()
  // return userInfo to req.user
  passport.deserializeUser((id, done) => {
    UserModel.findByUserId(id)
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
  
}

export default initPassportLocal
