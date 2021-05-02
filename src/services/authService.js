import UserModel from '../models/userModel'
import { transErrors, tranSuccess } from './../../lang/vi'

import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

let saltRound = 8;

class AuthServices {
  register(email, gender, password) {
    return new Promise(async (resolve, reject) => {
      let userByEmail = await UserModel.findByEmail(email)
      let salt = bcryptjs.genSaltSync(saltRound);

      let errorMessages = userByEmail.deleteAt == null && transErrors.account_removed
        || !userByEmail.local.isActive && transErrors.account_not_active
        || !!userByEmail && transErrors.account_in_use

      if (errorMessages) {
        return reject(errorMessages)
      }
      let userItem = {
        username: email.split('@')[0],
        gender,
        local: {
          email,
          password: bcryptjs.hashSync(password, salt),
          verifyToken: uuidv4()
        }
      }

      let user = await UserModel.createNew(userItem)
      resolve(tranSuccess.userCreated(user.local.email))
    })
  }
}

export default new AuthServices();
