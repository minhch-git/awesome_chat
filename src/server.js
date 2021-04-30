require('dotenv').config()

import express from 'express'
const app = express()

const PORT = process.env.APP_PORT || 8080
const HOST = process.env.APP_HOST || 'localhost'

app.listen(PORT, console.log(`App listening at http://${HOST}:${PORT}`))
