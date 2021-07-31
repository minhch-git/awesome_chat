function textAndEmojiChat(divId) {
  $(".emojionearea")
    .unbind("keyup")
    .on("keyup", e => {
      if (e.which === 13) {
        let targetId = $(`#write-chat-${divId}`).data("chat");
        let messageVal = $(`#write-chat-${divId}`).val();
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
            console.log(data);
          }
        ).fail(response => {
          // error
          console.log(response);

          alertify.notify(response.responseText, "error", 6);
        });
      }
    });
}
