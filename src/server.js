import express from 'express'
import path from 'path'
import passport from 'passport'
import flash from 'connect-flash'
import pem from 'pem'
import https from 'https'

const host = process.env.APP_HOST || 'localhost'
const port = process.env.APP_PORT || 8080

import * as config from './config'
import initRoutes from './routes/web'

pem.createCertificate({ days: 1, selfSigned: true }, (err, keys) => {
  if (err) {
    throw err
  }

  // init app
  const app = express()

  // Connect db (mongodb)
  config.connectDB()

  // Config session
  config.session(app)
  app.use(flash())

  // Templates engine
  config.viewEngine(app, path.join(__dirname, 'views'))

  // Enable post data for request
  app.use(express.urlencoded({ extended: true }))

  // // Config passport js
  app.use(passport.initialize())
  app.use(passport.session())

  // init routes
  initRoutes(app)

  https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(port, console.log(`App listening at https://${host}:${port}`))
})

// // init app
// const app = express()

// // Connect db (mongodb)
// config.connectDB()

// // Config session
// config.session(app)
// app.use(flash())

// // Templates engine
// config.viewEngine(app, path.join(__dirname, 'views'))

// // Enable post data for request
// app.use(express.urlencoded({ extended: true }))

// // // Config passport js
// app.use(passport.initialize())
// app.use(passport.session())

// // init routes
// initRoutes(app)

// app.listen(port, console.log(`App listening at http://${host}:${port}`))
