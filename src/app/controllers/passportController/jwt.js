import { Strategy, ExtractJwt } from 'passport-jwt'
import User from '../../models/userModel'

const applyPassportJwtStrategy = passport => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  }
  
  passport.use(new Strategy(options, async (payload, done) => {
    try {
      let user = await User.findByEmail(payload.local.email)
      if (user) {
        return done(null, user)
      }
      return done(null, false)
    } catch (error) {
      done(error, false)
    }
  }))
}

export default applyPassportJwtStrategy