import mongoose from "mongoose";

const MessageSchema = mongoose.Schema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
  sender: {
    id: String,
    name: String,
    avatar: String,
  },
  receiver: {
    id: String,
    name: String,
    avatar: String,
  },
  text: String,
  file: { data: Buffer, contentType: String, fileName: String },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
});

const MESSAGE_CONVERSATION_TYPES = {
  PERSONAL: "personal",
  GROUP: "group",
};

const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
};

MessageSchema.statics = {
  /**
   * get limited one item of personal
   * @param {string} senderId
   * @param {string} receiverId
   * @param {number} limit
   */
  getMessagesInPersonal(senderId, receiverId, limit) {
    return this.find({
      $or: [
        {
          $and: [{ senderId: senderId }, { receiverId: receiverId }],
        },
        {
          $and: [{ senderId: receiverId }, { receiverId: senderId }],
        },
      ],
    })
      .sort({ createAt: 1 })
      .limit(limit)
      .exec();
  },

  /**
   * get message in group
   * @param {string} receiverId
   * @param {number} limit
   */
  getMessagesInGroup(receiverId, limit) {
    return this.find({ receiverId: receiverId })
      .sort({ createAt: 1 })
      .limit(limit)
      .exec();
  },
};

export default mongoose.model("message", MessageSchema);
export { MESSAGE_CONVERSATION_TYPES, MESSAGE_TYPES };
