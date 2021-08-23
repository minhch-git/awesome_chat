import {
  bufferToBase64,
  lastItemOfArray,
  convertTimestampToHumanTime,
} from '../../helpers/clientHelper'
import {
  notificationService,
  contactService,
  messageServices,
} from './../services/index'
import rp from 'request-promise'
import r from 'request'
function getICETurnServer() {
  return new Promise(async (resolve, reject) => {
    // Node Get ICE STUN and TURN list
    let o = {
      format: 'urls',
    }
    let bodyString = JSON.stringify(o)

    let uri = 'https://global.xirsys.net/_turn/AwesomeChat'
    let options = {
      host: 'global.xirsys.net',
      path: '/_turn/AwesomeChat',
      method: 'PUT',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from('minhchiu:2e6d782c-03a6-11ec-b6c4-0242ac130003').toString(
            'base64'
          ),
        'Content-Type': 'application/json',
        'Content-Length': bodyString.length,
      },
    }

    rp(uri, options)
      .then(body => {
        let bodyJson = JSON.parse(body)
        resolve(bodyJson.v.iceServers)
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
  })
}
class SiteController {
  // [ GET ] /
  async getHome(req, res) {
    // get notifications (10 items one time)
    let notifs = await notificationService.getNotifications(req.user._id)
    // get amount notifications unread
    let countNotifUnread = await notificationService.countNotifUnread(
      req.user._id
    )

    // get contacts (10 items one time)
    let contacts = await contactService.getContacts(req.user._id)
    // get contacts sent (10 items one time)
    let contactsSent = await contactService.getContactsSent(req.user._id)
    // get contacts received (10 items one time)
    let contactsReceived = await contactService.getContactsReceived(
      req.user._id
    )

    // Count all contacts
    let countAllContacts = await contactService.countAllContacts(req.user._id)
    // Count all contacts sent
    let countAllContactsSent = await contactService.countAllContactsSent(
      req.user._id
    )
    // Count all contacts received
    let countAllContactsReceived =
      await contactService.countAllContactsReceived(req.user._id)

    // get ICE list from xirsys turn server
    let iceServerList = await getICETurnServer()

    let {
      userConversations,
      groupConversations,
      allConversations,
      allConversationsWithMessage,
    } = await messageServices.getAllConversationItems(req.user._id)

    return res.render('main/home/home', {
      errors: req.flash('errors'),
      success: req.flash('success'),
      user: req.user,
      notifications: notifs,
      countNotifUnread: countNotifUnread,
      contacts,
      contactsSent,
      contactsReceived,
      countAllContacts,
      countAllContactsSent,
      countAllContactsReceived,
      userConversations,
      groupConversations,
      allConversations,
      allConversationsWithMessage,
      bufferToBase64,
      lastItemOfArray,
      convertTimestampToHumanTime,
      iceServerList: JSON.stringify(iceServerList),
    })
  }

  // [ GET ] /login-register
  async getLoginRegister(req, res) {
    return res.render('auth/main', {
      errors: req.flash('errors'),
      success: req.flash('success'),
    })
  }
}

export default new SiteController()
