import mongoose from 'mongoose'

const UserSchema = mongoose.Schema({
  username: String,
  gender: { type: String, default: 'male' },
  phone: { type: String, default: null, },
  address: { type: String, default: null },
  avatar: { type: String, default: 'avatar_default.jpg', },
  role: { type: String, default: 'user', },
  local: {
    email: { type: String, trim: true, lowerCase: true, },
    password: String,
    isActive: { type: Boolean, default: false },
    verifyToken: String,
  },
  facebook: {
    uid: String,
    token: String,
    email: { type: String, trim: true, lowerCase: true, },
  },
  google: {
    uid: String,
    token: String,
    email: { type: String, trim: true, lowerCase: true, },
  },
  createAt: { type: Number, default: Date.now, },
  updateAt: { type: Number, default: null },
  deleteAt: { type: Number, default: null },
})

UserSchema.statics = {
  createNew(item) {
    return this.create(item)
  },

  findByEmail(email) {
    return this.findOne({'local.email': email}).exec()
  },
  removeById(id) {
    return this.findByIdAndRemove(id).exec()
  }
}

export default mongoose.model('user', UserSchema)
