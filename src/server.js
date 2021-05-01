import express from 'express'
import path from 'path'

const app = express()
const host = process.env.APP_HOST || 'localhost'
const port = process.env.APP_PORT || 8080

import db from './config/db'
import viewEngine from './config/templates//viewEngine'
import initRoutes from './routes/web'

// connect db (mongodb)
db.connect()

// templates engine
viewEngine.configViewEngine(app, path.join(__dirname, 'views'))

// Enable post data for request
app.use(express.urlencoded({ extended: true }))

// init routes
initRoutes(app)

app.listen(port, console.log(`App listening at http://${host}:${port}`))
