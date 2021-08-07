function textAndEmojiChat(divId) {
  $(".emojionearea")
    .unbind("keyup")
    .on("keyup", function(e) {

      let currentEmojioneArea = $(this)

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
          function ({message}) {

            // step 1: handle message data before show
           let messageOfme = $(`<div class="bubble me" data-mess-id="${message._id}"></div>`)
            if(dataTextEmojiForSend.isChatGroup) {

              messageOfme.html(`<img src="/images/users/${message.sender.avatar}" class="avatar-small mx-1" title="" alt="${message.sender.name}">`)

              messageOfme.text(message.text)

              increaseNumberMessageGroup(divId)
              
            }else {
              messageOfme.text(message.text)
            }
            let convertEmojiMessage = emojione.toImage(messageOfme.html())
            messageOfme.html(convertEmojiMessage)

            // Step 02: append message data to screen
            $(`.right .chat[data-chat=${divId}]`).append(messageOfme)
            nineScrollRight(divId)

            // Step 03: remove all data at input
            $(`#write-chat-${divId}`).val('')
            currentEmojioneArea.find('.emojionearea-editor').text('')

            // Step 04: change data preview & time in leftSide
            $(`.person[data-chat=${divId}]`).find('span.time').html(moment(message.createdAt).locale("vi").startOf("seconds").fromNow())
            $(`.person[data-chat=${divId}]`).find('span.preview').html(emojione.toImage(message.text))

            // Step 05: move converstation to the top
            $(`.person[data-chat=${divId}]`).on('click.moveConversationToTheTop', function () {
              let dataToMove = $(this).parent()
              $(this).closest("ul").prepend(dataToMove)
              $(this).off('click.moveConversationToTheTop')
            })
            $(`.person[data-chat=${divId}]`).click()
          }
        ).fail(response => {
          // error
          console.log(response);

          alertify.notify(response.responseText, "error", 6);
        });
      }
    });
}
