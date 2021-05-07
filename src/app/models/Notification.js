import mongoose from 'mongoose'

const NotificationModel = mongoose.Schema({
  sender: {
    id: String,
    username: String,
    avatar: String,
  },
  receiver: {
    id: String,
    username: String,
    avatar: String,
  },
  type: String,
  content: String,
  createAt: { type: Number, default: Date.now, },
  updateAt: { type: Number, default: null, },
  deleteAt: { type: Number, default: null, }
})

export default mongoose.model('contact', NotificationModel)
