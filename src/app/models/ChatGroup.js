import mongoose from 'mongoose'

const ChatGroupModel = mongoose.Schema({
  name: String,
  usersAmount: { type: Number, default: 3, },
  messagesAnount: { type: Number, default: 0, },
  userId: String,
  members: [
    { userId: String, },
  ],
  createAt: { type: Number, default: Date.now, },
  updateAt: { type: Number, default: null, },
  deleteAt: { type: Number, default: null, }
})

export default mongoose.model('contact', ChatGroupModel)
