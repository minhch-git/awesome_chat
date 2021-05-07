import passportLocal from 'passport-local'
import passportFacebook from 'passport-facebook'
import passportGoogle from 'passport-google-oauth'

const LocalStrategy = passportLocal.Strategy
const FacebookStrategy = passportFacebook.Strategy
const GoogleStrategy = passportGoogle.Strategy


import User from '../models/User'
import { transErrors, tranSuccess } from '../../../lang/vi'


class PassportController {
  applyPassportLocal(passport) {
    passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, async (req, email, password, done) => {
      try {
        const user = await User.findByEmail(email)
        if (user && user.local.isActive && user.comparePassword(password)) {
          return done(null, user, req.flash('success', tranSuccess.login_success(user.username)))
        }

        if (user && !user.local.isActive) {
          return done(null, false, req.flash('errors', transErrors.account_not_active))
        }

        return done(null, false, req.flash('errors', transErrors.login_failed))
      } catch (error) {
        console.log(error)
        req.flash('errors', transErrors.server_error)
        done(error)
      }
    }))
    configSessionPassport(passport)
  }
}

const configSessionPassport = passport => {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  })
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}

export default new PassportController();
