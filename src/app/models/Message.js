import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
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
  text: String,
  file: { data: Buffer, contentType: String, fileName: String },
  createAt: { type: Number, default: Date.now },
  updateAt: { type: Number, default: null },
  deleteAt: { type: Number, default: null },
});

const MESSAGE_CONVERSATION_TYPES = {
  PERSONAL: 'personal',
  GROUP: 'group',
};

const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
};

MessageSchema.statics = {
  /**
   * get limited one item
   * @param {string} senderId
   * @param {string} receiverId
   * @param {number} limit
   */
  getMessages(senderId, receiverId, limit) {
    return this.find({
      $or: [
        {
          $and: [
            { senderId: senderId },
            { receiverId: receiverId },
          ],
        },
        {
          $and: [
            { senderId: receiverId },
            { receiverId: senderId },
          ],
        },
      ],
    })
      .sort({ createAt: 1 })
      .limit(limit)
      .exec();
  },
};

export default mongoose.model('message', MessageSchema);
export { MESSAGE_CONVERSATION_TYPES, MESSAGE_TYPES };
