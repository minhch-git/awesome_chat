import express from 'express'
import path from 'path'
const app = express()

const host = process.env.APP_HOST || 'localhost'
const port = process.env.APP_PORT || 8080

app.use(express.static(path.join(__dirname, 'public')))

import db from './config/db'
import viewEngine from './config/templates//viewEngine'

// Connect db (mongodb)
db.connect()

// templates engine
viewEngine.configViewEngine(app, path.join(__dirname, 'views'))

app.get('/test-view-engine', async(req, res) => {
  res.render('auth/loginRegister')
})


app.listen(port, console.log(`App listening at http://${host}:${port}`))
