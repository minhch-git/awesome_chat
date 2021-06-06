import express from 'express'
import path from 'path'
import flash from 'connect-flash'
// import pem from 'pem'
// import https from 'https'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

const host = process.env.APP_HOST || 'localhost'
const port = process.env.APP_PORT || 8080

import * as config from './config'
import initRoutes from './routes/web'
import initSocket from './sockets/index'
import cookieParser from 'cookie-parser'

// init app
const app = express()

// init server with socket.io & epxress app
const server = createServer(app);
const io = new Server(server)

// Connect db (mongodb)
config.connectDB()

// Config session
config.applySession(app)
app.use(flash())

// use cookie parser
app.use(cookieParser())

// Templates engine
config.viewEngine(app, path.join(__dirname, 'views'))

// Enable post data for request
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Config passport js
config.applyPassport(app)

// init routes
initRoutes(app)

// Config socket io 
config.socketIo(io, cookieParser, config.sessionStore)

// init all socket
initSocket(io)

server.listen(port, () => console.log(`App listening at http://${host}:${port}`))


// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//   if (err) {
//     throw err
//   }

//   // init app
//   const app = express()

//   // Connect db (mongodb)
//   config.connectDB()

//   // Config session
//   config.applySession(app)
//   app.use(flash())

//   // Templates engine
//   config.viewEngine(app, path.join(__dirname, 'views'))

//   // Enable post data for request
//   app.use(express.json())
//   app.use(express.urlencoded({ extended: false }))

//   // Config passport js
//   config.applyPassport(app)

//   // init routes
//   initRoutes(app)

//   https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).
//     listen(port, console.log(`App listening at https://${host}:${port}`))
// })
