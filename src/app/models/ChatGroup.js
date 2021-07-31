import mongoose from "mongoose";

const ChatGroupSchema = mongoose.Schema({
  name: String,
  usersAmount: { type: Number, default: 3 },
  messagesAnount: { type: Number, default: 0 },
  userId: String,
  members: [{ userId: String }],
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  deletedAt: { type: Number, default: null },
});

ChatGroupSchema.statics = {
  /**
   * Get chat group by userId and limit
   * @param {string} userId current userId
   * @param {number} limit
   */
  getChatGroups(userId, limit) {
    return this.find({
      members: { $elemMatch: { userId } },
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .exec();
  },
  /**
   * Get chat group
   * @param {string} id
   * @returns
   */
  getChatGroupById(id) {
    return this.findById(id).exec();
  },

  /**
   * Update group chat when has new message
   * @param {string} id
   * @param {number} newMessageAmout
   */
  updateWhenHasNewMessage(id, newMessageAmout) {
    return this.findByIdAndUpdate(id, {
      messagesAnount: newMessageAmout,
      updatedAt: Date.now(),
    }).exec();
  },
};

export default mongoose.model("chat_group", ChatGroupSchema);
