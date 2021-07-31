import messageService from "../services/messageServices";
class MessageController {
  async addNewTextEmoji(req, res) {
    try {
      const {
        uid: receivedId,
        messageVal,
        isChatGroup,
      } = await req.body.valueChecked;
      let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar,
      };
      let newMessage = await messageService.addNewTextEmoji(
        sender,
        receivedId,
        messageVal,
        isChatGroup
      );
      return res.status(200).json({ message: newMessage });
    } catch (error) {
      return res.status(500).json(error.details[0].message);
    }
  }
}

export default new MessageController();
