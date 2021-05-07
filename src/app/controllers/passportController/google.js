import { tranSuccess } from '../../../../lang/vi'
import UserModel from '../../models/User'

import passport from 'passport'
import passportGoogle from 'passport-google-oauth'


let GoogleStrategy = passportGoogle.OAuth2Strategy;
let ggAppId = process.env.GG_APP_ID
let ggAppSecret = process.env.GG_APP_SECRET
let ggCallbackUrl = process.env.GG_CALLBACK_URL

const initPassportGoogle = () => {
  passport.use(new GoogleStrategy({
    clientID: ggAppId,
    clientSecret: ggAppSecret,
    callbackURL: ggCallbackUrl,
  },
    async (accessToken, refreshTokem, profile, done) => {
     try {
      let user = await UserModel.findByGoogleUid(profile.id)
      if (user) {
        return done(null, user)
      }

      let newUserItem = {
        username: profile.displayName,
        gender: profile.gender,
        local: {
          isActive: true
        },
        google: {
          uid: profile.id,
          email: profile.emails[0].value,
          token: accessToken
        }
      }

      let newUser = UserModel.createNew(newUserItem)
      return done(null, newUser)
     } catch (error) {
      console.log(error)
      return done(null, false)
     }
    }
  ))

  // save userId to session
  passport.serializeUser((user, done) => done(null, user._id))

  // this is called by passport.session()
  // return userInfo to req.user
  passport.deserializeUser((user, done) => {
    UserModel.findByUserId(user._id)
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })

}

export default initPassportGoogle

