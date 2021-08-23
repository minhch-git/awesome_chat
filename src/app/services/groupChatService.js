import _ from 'lodash'
import Contact from '../models/Contact'
import Message, {
  MESSAGE_CONVERSATION_TYPES as messageConverSationType,
  MESSAGE_TYPES as messageType,
} from '../models/Message'
import User from '../models/User'
import ChatGroup from '../models/ChatGroup'
import { transErrors } from '../../../lang/vi'
import { appConfig } from '../../config'
import fsExtra from 'fs-extra'

const LIMIT_CONVERSATIONS_TAKEN = 30
const LIMIT_MESSAGES_TAKEN = 30
class groupChatServices {
  addNew(currentUserId, data) {
    return new Promise(async (resolve, reject) => {
      try {
        let item = {
          name: data.groupChatName,
          usersAmount: data.arrayId.length + 1,
          userId: currentUserId,
          members: [{ userId: currentUserId }, ...data.arrayId],
        }
        const groupChat = await ChatGroup.createNew(item)
        resolve(groupChat)
      } catch (error) {
        reject(error)
      }
    })
  }
}
export default new groupChatServices()
