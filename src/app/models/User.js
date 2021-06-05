import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
const UserSchema = mongoose.Schema({
  username: String,
  gender: { type: String, default: 'male' },
  phone: { type: String, default: null, },
  address: { type: String, default: null },
  avatar: { type: String, default: 'avatar-default.jpg', },
  role: { type: String, default: 'user', },
  local: {
    email: { type: String, trim: true, lowerCase: true, },
    password: String,
    isActive: { type: Boolean, default: false },
    verifyToken: String,
    token: String
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
  findByUserId(id) {
    return this.findById(id).exec()
  },

  findByEmail(email) {
    return this.findOne({ 'local.email': email }).exec()
  },

  createNew(item) {
    return this.create(item)
  },

  findUserIdAndUpdate(id, item) {
    return this.findByIdAndUpdate(id, item).exec()
  },

  removeById(id) {
    return this.findByIdAndRemove(id).exec()
  },

  findByToken(token) {
    return this.findOne({ 'local.verifyToken': token }).exec()
  },

  verifyToken(token) {
    return this.findOneAndUpdate(
      { 'local.verifyToken': token },
      {
        'local.isActive': true,
        'local.verifyToken': null
      }
    ).exec()
  },

  findByFacebookUid(uid) {
    return this.findOne({ 'facebook.uid': uid }).exec()
  },

  findByGoogleUid(uid) {
    return this.findOne({ 'google.uid': uid }).exec()
  },

  updatePassword(id, hashedPassword) {
    return this.findByIdAndUpdate(id, { "local.password": hashedPassword }).exec()
  },

  findAllForAddContact(deprecatedUserIds, keyword) {
    return this.find({
      $and: [
        {'_id': { $nin: deprecatedUserIds }},
        {'local.isActive': true},
        {$or: [
          {'username': {'$regex': new RegExp(keyword, 'i')}},
          {'local.email': {'$regex': new RegExp(keyword, 'i')}},
          {'facebook.email': {'$regex': new RegExp(keyword, 'i')}},
          {'google.email': {'$regex': new RegExp(keyword, 'i')}},
        ]}
      ]
    }, {_id: 1, username: 1, address: 1, avatar: 1}).exec()
  }
}

UserSchema.methods = {
  comparePassword(password) {
    return bcryptjs.compareSync(password, this.local.password)
  }
}

export default mongoose.model('user', UserSchema)
