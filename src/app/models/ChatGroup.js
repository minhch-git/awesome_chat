import mongoose from 'mongoose';

const ChatGroupSchema = mongoose.Schema({
  name: String,
  usersAmount: { type: Number, default: 3 },
  messagesAnount: { type: Number, default: 0 },
  userId: String,
  members: [{ userId: String }],
  createAt: { type: Number, default: Date.now },
  updateAt: { type: Number, default: null },
  deleteAt: { type: Number, default: null },
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
      .sort({ createAt: -1 })
      .limit(limit)
      .exec();
  },
};

export default mongoose.model('chat-group', ChatGroupSchema);
