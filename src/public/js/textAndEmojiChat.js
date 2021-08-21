function textAndEmojiChat(divId) {
  $('.emojionearea')
    .unbind('keyup')
    .on('keyup', function (e) {
      let currentEmojioneArea = $(this)

      if (e.which === 13) {
        let targetId = $(`#write-chat-${divId}`).data('chat')
        let messageVal = $(`#write-chat-${divId}`).val()
        if (!targetId || !messageVal) {
          return false
        }
        let dataTextEmojiForSend = {
          uid: targetId,
          messageVal,
        }
        if ($(`#write-chat-${divId}`).hasClass('chat-in-group')) {
          dataTextEmojiForSend.isChatGroup = true
        }
        // Call API
        $.post(
          '/message/add-new-text-emoji',
          dataTextEmojiForSend,
          function ({ message }) {
            let dataToEmit = {
              message,
            }
            // step 1: handle message data before show
            let messageOfme = $(
              `<div class="bubble me" data-mess-id="${message._id}"></div>`
            )
            messageOfme.text(message.text)
            let convertEmojiMessage = emojione.toImage(messageOfme.html())

            if (dataTextEmojiForSend.isChatGroup) {
              let senderAvatar = `<img src="/images/users/${message.sender.avatar}" class="avatar-small mx-1" title="" alt="${message.sender.name}"/>`
              messageOfme.html(`${senderAvatar} ${convertEmojiMessage}`)

              increaseNumberMessageGroup(divId)
              dataToEmit.groupId = targetId
            } else {
              messageOfme.html(convertEmojiMessage)
              dataToEmit.contactId = targetId
            }

            // Step 02: append message data to screen
            $(`.right .chat[data-chat="${divId}"]`).append(messageOfme)
            nineScrollRight(divId)

            // Step 03: remove all data at input
            $(`#write-chat-${divId}`).val('')
            currentEmojioneArea.find('.emojionearea-editor').text('')

            // Step 04: change data preview & time in leftSide
            $(`.person[data-chat=${divId}]`)
              .find('span.time')
              .removeClass('message-time-realtime')
              .html(
                moment(message.createdAt)
                  .locale('vi')
                  .startOf('seconds')
                  .fromNow()
              )
            $(`.person[data-chat=${divId}]`)
              .find('span.preview')
              .html(emojione.toImage(message.text))

            // Step 05: move converstation to the top
            $(`.person[data-chat=${divId}]`).on(
              'test.moveConversationToTheTop',
              function () {
                let dataToMove = $(this).parent()
                $(this).closest('ul').prepend(dataToMove)
                $(this).off('test.moveConversationToTheTop')
              }
            )
            $(`.person[data-chat=${divId}]`).trigger(
              'test.moveConversationToTheTop'
            )

            // Step 06: Emit realtime
            socket.emit('chat-text-emoji', dataToEmit)

            // Step 07: Emit remove typing realtime
            typingOff(divId)

            // Steo 08: If this has typing, remove that immediate
            let checkTyping = $(`.chat[data-chat="${divId}"]`).find(
              'div.bubble-typing-gif'
            )
            if (checkTyping.length) checkTyping.remove()
          }
        ).fail(response => {
          // error
          console.log(response)

          alertify.notify(response.responseText, 'error', 6)
        })
      }
    })
}
$(document).ready(function () {
  socket.on(
    'response-chat-text-emoji',
    function ({ message, currentGroupId, currentUserId }) {
      let divId = ''
      // step 1: handle message data before show
      let messageOfYou = $(
        `<div class="bubble you" data-mess-id="${message._id}"></div>`
      )
      messageOfYou.text(message.text)
      let convertEmojiMessage = emojione.toImage(messageOfYou.html())

      if (currentGroupId) {
        let senderAvatar = `<img src="/images/users/${message.sender.avatar}" class="avatar-small mx-1" title="" alt="${message.sender.name}"/>`
        messageOfYou.html(`${senderAvatar} ${convertEmojiMessage}`)

        divId = currentGroupId
        if (currentUserId !== $('#dropdown-navbar-user').data('uid')) {
          increaseNumberMessageGroup(divId)
        }
      } else {
        divId = currentUserId
        messageOfYou.html(convertEmojiMessage)
      }
      console.log({ messageOfYou })

      // Step 02: append message data to screen
      if (currentUserId !== $('#dropdown-navbar-user').data('uid')) {
        $(`.right .chat[data-chat=${divId}]`).append(messageOfYou)
        $(`.person[data-chat=${divId}]`)
          .find('span.time')
          .addClass('message-time-realtime')
        nineScrollRight(divId)
      }

      // Step 03: remove all data at input // nothing to do code

      // Step 04: change data preview & time in leftSide
      $(`.person[data-chat=${divId}]`)
        .find('span.time')
        .html(
          moment(message.createdAt).locale('vi').startOf('seconds').fromNow()
        )
      $(`.person[data-chat=${divId}]`)
        .find('span.preview')
        .html(emojione.toImage(message.text))

      // Step 05: move converstation to the top
      $(`.person[data-chat=${divId}]`).on(
        'test.moveConversationToTheTop',
        function () {
          let dataToMove = $(this).parent()
          $(this).closest('ul').prepend(dataToMove)
          $(this).off('test.moveConversationToTheTop')
        }
      )
      $(`.person[data-chat=${divId}]`).trigger('test.moveConversationToTheTop')

      // Step 06: Emit realtime // nothing to do code
    }
  )
})
