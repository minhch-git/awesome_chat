import User from '../app/models/User'
import ChatGroup from '../app/models/ChatGroup'

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

const sessionPassport = (passport) => {
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      let user = await User.findByUserIdForSessionToUse(id)
      let getChatGroupByIds = await ChatGroup.getChatGroupByIds(user._id)

      user = user.toObject()
      user.groupByIds = getChatGroupByIds
      return done(null, user)
    } catch (error) {
      done(error, null)
    }
  })
}

export default applyPassport
