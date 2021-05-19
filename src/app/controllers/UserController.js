import multer from 'multer'
import { transErrors, tranSuccess } from '../../../lang/vi'
import { appConfig } from '../../config/index'
import { v4 as uuidv4 } from 'uuid'
import userService from '../services/userService'
import fsExtra from 'fs-extra'

class UserController {
  updateAvatar(req, res) {
    avatarUploadFile(req, res, async (err) => {

      if (err) {
        if (err.messages) {
          return res.status(500).send(transErrors.avatar_limit_size)
        }
        return res.status(500).send(err)
      }


      try {
        let updateUserItem = {
          avatar: req.file.filename,
          updateAt: Date.now()
        }
        let userUpdate = await userService.updateUser(req.user._id, updateUserItem)
        // remove old user avatar

        fsExtra.removeSync(`${appConfig.avatar_directory}/${userUpdate.avatar}`)
        let result = {
          messages: tranSuccess.avatar_update,
          imageSrc: `/images/users/${req.file.filename}`
        }
        return res.status(200).send(result)
      } catch (error) {
        console.log(error);
        // remove new user avatar
        fsExtra.removeSync(`${appConfig.avatar_directory}/${req.file.filename}`)
        return res.status(500).send(error)
      }
    })
  }
}


let storageAvatar = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, appConfig.avatar_directory)
  },

  filename: (req, file, callback) => {
    let math = appConfig.avatar_types

    if (!math.includes(file.mimetype)) {
      return callback(transErrors.avatar_type, null)
    }
    let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`
    callback(null, avatarName)
  }
})

let avatarUploadFile = multer({
  storage: storageAvatar,
  limits: { fileSize: appConfig.avatar_limit_size }
}).single('avatar')



export default new UserController();
