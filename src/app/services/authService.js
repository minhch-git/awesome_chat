import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import User from "../models/User";
import { transErrors, tranSuccess, transEmail } from "../../../lang/vi";
import sendEmail from "../../config/mailer";

let saltRound = 8;

class AuthServices {
  register(email, gender, password, protocol, reqHost) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findByEmail(email);
        const salt = bcryptjs.genSaltSync(saltRound);

        if (user) {
          let errMessages =
            (!!user.deleteAt && transErrors.account_removed) ||
            (!user.local.isActive && transErrors.account_not_active) ||
            transErrors.account_in_use;

          return reject(errMessages);
        }

        const userItem = {
          username: email.split("@")[0],
          gender,
          local: {
            email,
            password: bcryptjs.hashSync(password, salt),
            verifyToken: uuidv4(),
          },
        };

        const newUser = await User.createNew(userItem);

        // Send email
        let linkVerify = `${protocol}://${reqHost}/auth/verify/${newUser.local.verifyToken}`;

        sendEmail(
          newUser.local.email,
          transEmail.subject,
          transEmail.template(linkVerify)
        )
          .then(success => {
            resolve(tranSuccess.userCreated(newUser.local.email));
          })
          .catch(async error => {
            console.error(error);
            // remove user
            await User.removeById(newUser._id);
            reject(transEmail.send_failed);
          });
      } catch (error) {
        reject(transErrors.server_error);
      }
    });
  }

  verifyAccount(token) {
    return new Promise(async (resolve, reject) => {
      try {
        let userByToken = await User.findByToken(token);

        if (!userByToken) {
          return reject(transErrors.token_undefined);
        }
        await User.verifyToken(token);
        resolve(tranSuccess.account_actived);
      } catch (error) {
        reject(transErrors.server_error);
      }
    });
  }
}

export default new AuthServices();
