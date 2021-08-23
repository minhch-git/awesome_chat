import { tranSuccess } from '../../../lang/vi'
import groupChatService from '../services/groupChatService'

class GroupChatController {
  async addNew(req, res) {
    try {
      let currentUserId = req.user._id
      let data = await req.body.valueChecked
      const groupChat = await groupChatService.addNew(currentUserId, data)
      res.status(200).json(groupChat)
    } catch (error) {
      return res.status(500).json({ message: error.details[0].message })
    }
  }
}

export default new GroupChatController()
