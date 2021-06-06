import session from 'express-session'
import MongoStore from 'connect-mongo'

/**
 * this variable is where save session, in this case is mongodb
 */
let sessionStore = MongoStore.create({
  mongoUrl: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  touchAfter: 24 * 3600,
  // autoRemove: 'native' default
})
/**
 * Config session for app
 * @param app from exactly express module
 */
let applySession = (app) => {
  app.use(session({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 86400000 seconds = 1 day
    }
  }))
}

export {
  sessionStore
}

export default applySession