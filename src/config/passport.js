import User from '../app/models/User'

import passport from 'passport'

/**
 * Config session for app
 * @param app from exactly express module
 */
const applyPassport = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())
  sessionPassport(passport)
}

const sessionPassport = passport => {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  })
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}

export default applyPassport