import mongoose from 'mongoose'

const ContactSchema = mongoose.Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false, },
  createAt: { type: Number, default: Date.now, },
  updateAt: { type: Number, default: null, },
  deleteAt: { type: Number, default: null, }
})

export default mongoose.model('contact', ContactSchema)
