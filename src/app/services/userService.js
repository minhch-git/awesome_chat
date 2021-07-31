import { transErrors } from "../../../lang/vi";
import User from "../models/User";
import bcryptjs from "bcryptjs";

/**
 * @param { userId } id
 * @param {data update} item
 */

class UserService {
  async updateUser(id, item) {
    return User.findUserIdAndUpdate(id, item);
  }

  updatePassword(id, dataUpdate) {
    return new Promise(async (resolve, reject) => {
      let currentUser = await User.findByUserIdToUpdatePassword(id);
      if (!currentUser) return reject(transErrors.account_undefined);

      // check current password
      let checkCurrentPass = await currentUser.comparePassword(
        dataUpdate.currentPassword
      );
      if (!checkCurrentPass)
        return reject(transErrors.user_current_password_failed);

      let salt = bcryptjs.genSaltSync(8);
      await User.updatePassword(
        id,
        bcryptjs.hashSync(dataUpdate.newPassword, salt)
      );
      resolve(true);
    });
  }
}

export default new UserService();
