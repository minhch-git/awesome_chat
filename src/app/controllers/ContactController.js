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
}

export default new ContactController();
