import express from 'express'
const app = express()

const host = process.env.APP_HOST || 'localhost'
const port = process.env.APP_PORT || 8080

import db from './config/db'
import ContactModel from './models/contactModel'


// Connect db (mongodb)
db.connect()

app.get('/test-database', async(req, res) => {
  try {
    let item = {
      userId: '123123',
      contactId: '123123',
    }
    let contactNew = await ContactModel.createNew(item)
  } catch (error) {
    console.error(error)
  }
})


app.get('/test-database2', (req, res) => {
})

app.listen(port, console.log(`App listening at http://${host}:${port}`))
