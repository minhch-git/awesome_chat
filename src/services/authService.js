import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

import UserModel from '../models/userModel'
import { transErrors, tranSuccess, transEmail } from './../../lang/vi'
import sendEmail from './../config/mailer'

let saltRound = 8;

class AuthServices {
  register(email, gender, password, protocol, reqHost) {
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

      // Send email
      let linkVerify = `${protocol}://${reqHost}/verify/${user.local.verifyToken}`
      sendEmail(user.local.email, transEmail.subject, transEmail.template(linkVerify))
        .then(success => resolve(tranSuccess.userCreated(user.local.email)))
        .catch(async (error) => {
          // remove user
          await UserModel.removeById(user._id)
          console.log('error: ', error)
          return reject(transEmail.send_failed)
        })
      resolve(tranSuccess.userCreated(user.local.email))
    })
  }
}

export default new AuthServices();
