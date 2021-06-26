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
  async markAllAsRead(req, res) {
    try {
      let mark = await notificationService.markAllAsRead(req.user._id, req.body.targetUsers)
      return res.status(200).send(mark)
    } catch (error) {
      res.status(400).send(error)
    }
  }

}

export default new NotifController()
