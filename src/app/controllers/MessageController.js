import messageService from '../services/messageServices'
import { appConfig } from '../../config/index'
import multer from 'multer'
import fsExtra from 'fs-extra'

class MessageController {
  async addNewTextEmoji(req, res) {
    try {
      const {
        uid: receivedId,
        messageVal,
        isChatGroup,
      } = await req.body.valueChecked

      let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar,
      }

      let newMessage = await messageService.addNewTextEmoji(
        sender,
        receivedId,
        messageVal,
        isChatGroup
      )

      return res.status(200).json({ message: newMessage })
    } catch (error) {
      return res.status(500).json(error.details[0].message)
    }
  }

  async addNewImage(req, res) {
    imageMessageUploadFile(req, res, async err => {
      if (err) {
        if (err.messages) {
          return res.status(500).send(transErrors.image_message_size)
        }
        return res.status(500).send(err)
      }

      try {
        let sender = {
          id: req.user._id,
          name: req.user.username,
          avatar: req.user.avatar,
        }
        let receivedId = req.body.uid
        let messageVal = req.file
        let isChatGroup = req.body.isChatGroup
        let newMessage = await messageService.addNewImage(
          sender,
          receivedId,
          messageVal,
          isChatGroup
        )

        // Remove image, because this image is saved to mongodb
        await fsExtra.remove(
          `${appConfig.image_message_directory}/${newMessage.file.fileName}`
        )

        return res.status(200).json({ message: newMessage })
      } catch (error) {
        console.log({ error })
        return res.status(500).json(error)
      }
    })
  }
}

let storageImageChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, appConfig.image_message_directory)
  },

  filename: (req, file, callback) => {
    let math = appConfig.image_message_types

    if (!math.includes(file.mimetype)) {
      return callback(transErrors.image_message_type, null)
    }
    let imageName = file.originalname
    callback(null, imageName)
  },
})

let imageMessageUploadFile = multer({
  storage: storageImageChat,
  limits: { fileSize: appConfig.image_message_limit_size },
}).single('my-image-chat')

export default new MessageController()
