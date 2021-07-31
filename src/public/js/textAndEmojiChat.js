function textAndEmojiChat(divId) {
  $(".emojionearea")
    .unbind("keyup")
    .on("keyup", e => {
      if (e.which === 13) {
        let targetId = $(`#write-chat-${divId}`).data("chat");
        let messageVal = $(`#write-chat-${divId}`).val();
        console.log(targetId, messageVal);
        if (!targetId || !messageVal) {
          return false;
        }

        let dataTextEmojiForSend = {
          uid: targetId,
          messageVal,
        };
        if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
          dataTextEmojiForSend.isChatGroup = true;
        }
        // Call API
        $.post(
          "/message/add-new-text-emoji",
          dataTextEmojiForSend,
          function (data) {
            // success
          }
        ).fail(response => {
          // error
        });
      }
    });
}
