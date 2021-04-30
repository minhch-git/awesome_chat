import Bluebird from 'bluebird'
import mongoose from 'mongoose'

const connect = () => {
  mongoose.Promise = Bluebird
  const URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(db => console.log('Connect mongodb successfully!'))
    .catch(err => console.error('Connect mongodb failure!', err))
}

export default { connect }
