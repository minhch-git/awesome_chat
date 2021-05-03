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
      if (userByEmail) {

        let errMessages = !!userByEmail.deleteAt && transErrors.account_removed
          || !userByEmail.local.isActive && transErrors.account_not_active
          || transErrors.account_in_use

        return reject(errMessages)
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
      console.log(user.local.email)
      resolve(tranSuccess.userCreated(user.local.email))
    })
  }
}

export default new AuthServices();
