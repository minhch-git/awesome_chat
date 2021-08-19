import contactService from './../services/contactService'

class ContactController {
  async findUsersContact(req, res) {
    try {
      let currentUserId = req.user._id
      let { keyword } = await req.params.valueChecked
      let users = await contactService.findUsersContact(currentUserId, keyword)
      res.status(200).json(users)
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async addNew(req, res) {
    try {
      let currentUserId = req.user._id
      let contactId = req.body.uid
      let newContact = await contactService.addNew(currentUserId, contactId)
      res.status(200).json({ success: !!newContact })
    } catch (error) {
      return res.status(500).json(error)
    }
  }
  async removeContact(req, res) {
    try {
      let currentUserId = req.user._id
      let contactId = req.body.uid
      let removeContact = await contactService.removeContact(
        currentUserId,
        contactId
      )
      return res.status(200).json({ success: !!removeContact })
    } catch (error) {
      return res.status(500).json(error)
    }
  }
  async removeRequestContactSent(req, res) {
    try {
      let currentUserId = req.user._id
      let contactId = req.body.uid
      let removeReq = await contactService.removeRequestContactSent(
        currentUserId,
        contactId
      )
      return res.status(200).json({ success: !!removeReq })
    } catch (error) {
      return res.status(500).json(error)
    }
  }
  async removeRequestContactReceived(req, res) {
    try {
      let currentUserId = req.user._id
      let contactId = req.body.uid
      let removeReq = await contactService.removeRequestContactReceived(
        currentUserId,
        contactId
      )
      return res.status(200).json({ success: !!removeReq })
    } catch (error) {
      return res.status(500).json(error)
    }
  }
  async approveRequestContactReceived(req, res) {
    try {
      let currentUserId = req.user._id
      let contactId = req.body.uid
      let approveReq = await contactService.approveRequestContactReceived(
        currentUserId,
        contactId
      )
      return res.status(200).json({ success: !!approveReq })
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async readMoreContacts(req, res) {
    try {
      let skipNumberContacts = +req.query.skipNumber
      let newContactUsers = await contactService.readMoreContacts(
        req.user._id,
        skipNumberContacts
      )
      return res.status(200).json(newContactUsers)
    } catch (error) {
      return res.status(500).json(error)
    }
  }
  async readMoreContactsSent(req, res) {
    try {
      let skipNumberContacts = +req.query.skipNumber
      let newContactUsers = await contactService.readMoreContactsSent(
        req.user._id,
        skipNumberContacts
      )
      return res.status(200).json(newContactUsers)
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  async readMoreContactsReceived(req, res) {
    try {
      let skipNumberContacts = +req.query.skipNumber
      let newContactUsers = await contactService.readMoreContactsReceived(
        req.user._id,
        skipNumberContacts
      )
      return res.status(200).json(newContactUsers)
    } catch (error) {
      return res.status(500).json(error)
    }
  }
}
export default new ContactController()
