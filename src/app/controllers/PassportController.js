import passportLocal from "passport-local";
import passportFacebook from "passport-facebook";
import passportGoogle from "passport-google-oauth";

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;
const GoogleStrategy = passportGoogle.OAuth2Strategy;

import User from "../models/User";
import { transErrors, tranSuccess } from "../../../lang/vi";

class PassportController {
  applyPassportLocal(passport) {
    passport.use(
      new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password",
          passReqToCallback: true,
        },
        async (req, email, password, done) => {
          try {
            const user = await User.findByEmail(email);
            if (user && user.local.isActive && user.comparePassword(password)) {
              return done(
                null,
                user,
                req.flash("success", tranSuccess.login_success(user.username))
              );
            }

            if (user && !user.local.isActive) {
              return done(
                null,
                false,
                req.flash("errors", transErrors.account_not_active)
              );
            }

            return done(
              null,
              false,
              req.flash("errors", transErrors.login_failed)
            );
          } catch (error) {
            console.log(error);
            req.flash("errors", transErrors.server_error);
            done(error);
          }
        }
      )
    );
  }

  applyPassportFacebook(passport) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FB_APP_ID,
          clientSecret: process.env.FB_APP_SECRET,
          callbackURL: process.env.FB_CALLBACK_URL,
          profileFields: ["displayName", "email", "gender"],
          passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
          try {
            let user = await User.findByFacebookUid(profile.id);
            if (user)
              return done(
                null,
                user,
                req.flash(
                  "success",
                  tranSuccess.login_success(profile.displayName)
                )
              );
            const userItem = {
              username: profile.displayName,
              gender: profile.gender,
              local: {
                isActive: true,
              },
              facebook: {
                uid: profile.id,
                token: refreshToken,
                email: profile.emails[0].value,
              },
            };
            const newUser = await User.createNew(userItem);
            done(
              null,
              newUser,
              req.flash("success", tranSuccess.login_success(newUser.username))
            );
          } catch (error) {
            done(
              error,
              null,
              req.flash("error", req.flash("errors", transErrors.login_failed))
            );
          }
        }
      )
    );
  }

  applyPassportGoogle(passport) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GG_APP_ID,
          clientSecret: process.env.GG_APP_SECRET,
          callbackURL: process.env.GG_CALLBACK_URL,
          profileFields: ["displayName", "email", "gender"],
          passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
          try {
            const user = await User.findByEmail(profile.emails[0].value);
            if (user)
              return done(
                null,
                user,
                req.flash("success", tranSuccess.login_success(user.username))
              );
            const userItem = {
              username: profile.username,
              gender: profile.gender,
              local: { isActive: true },
              google: {
                uid: profile.id,
                token: accessToken,
                email: profile.emails[0].value,
              },
            };
            const newUser = await User.createNew(userItem);
            return done(
              null,
              newUser,
              req.flash("success", tranSuccess.login_success(newUser.username))
            );
          } catch (error) {
            done(error);
          }
        }
      )
    );
  }
}

export default new PassportController();
