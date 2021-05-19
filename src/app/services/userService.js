import User from '../models/User'

/**
 * @param { userId } id
 * @param {data update} item
 */

class UserService {
  async updateUser(id, item) {
    return User.findUserIdAndUpdate(id, item)
  }
}

export default new UserService();
