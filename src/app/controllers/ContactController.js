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

  async removeRequestContact(req, res) {
    try {
      let currentUserId = req.user._id
      let contactId = req.body.uid
      let removeReq = await contactService.removeRequestContact(currentUserId, contactId)
      return res.status(200).json({ success: removeReq })
    } catch (error) {
      return res.status(500).json(error)
    }
  }
}

export default new ContactController();
