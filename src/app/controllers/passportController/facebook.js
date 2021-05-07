import UserModel from '../../models/User'
import { tranSuccess } from '../../../../lang/vi'

import passport from 'passport'
import passportFacebook from 'passport-facebook'

let FacebookStrategy = passportFacebook.Strategy
let fbAppId = process.env.FB_APP_ID
let fbAppSecret = process.env.FB_APP_SECRET
let fbCallbackUrl = process.env.FB_CALLBACK_URL
/**
 * Valid user account type: facebook
 */
let initPassportFacebook = () => {
  passport.use(new FacebookStrategy({
    clientID: fbAppId,
    clientSecret: fbAppSecret,
    callbackURL: fbCallbackUrl,
    profileFields: ['id', 'email', 'gender', 'displayName'],
  },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findByFacebookUid(profile.id)

        if (user) {
          return done(null, user)
        }
        let userItem = {
          username: profile.displayName,
          gender: profile.gender,
          local: {
            isActive: true
          },
          facebook: {
            uid: profile.id,
            token: accessToken,
            email: profile.emails[0].value,
          },
        }

        let newUser = await UserModel.createNew(userItem)
        return done(null, newUser)

      } catch (error) {
        console.log(error)
        return done(null, false, req.flash('errors', transErrors.server_error))
      }
    }
  ))

  // save userId to session
  passport.serializeUser((user, done) => done(null, user._id))

  // this is called by passport.session()
  // return userInfo to req.user
  passport.deserializeUser(async (user, done) => {
    UserModel.findByUserId(user._id)
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}

export default initPassportFacebook
