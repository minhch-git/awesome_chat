import { notificationService } from "../services"

class NotifController {
  async readMore(req, res) {
    try {
      // get skip number form query param
      const skipNumberNotif = +req.query.skipNumber
      // get more items
      const newNotifications = await notificationService.readMore(req.user._id, skipNumberNotif)
      return res.status(200).send(newNotifications)
    } catch (error) {
      res.status(400).send(error)
    }
  }
}

export default new NotifController()
