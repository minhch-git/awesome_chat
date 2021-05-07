import express from 'express'
import path from 'path'
import passport from 'passport'
import flash from 'connect-flash'

const host = process.env.APP_HOST || 'localhost'
const port = process.env.APP_PORT || 8080

import * as config from './config'
import initRoutes from './routes/web'

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

app.listen(port, console.log(`App listening at http://${host}:${port}`))
