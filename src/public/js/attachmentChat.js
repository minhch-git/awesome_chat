function attachmentChat(divId) {
  $(`#attachment-chat-${divId}`)
    .unbind('change')
    .on('change', function () {
      console.log({ data: this })
      let fileData = $(this).prop('files')[0]
      let limit = 1048576 //byte = 1MB

      if (fileData.size > limit) {
        alertify.notify(
          `Tệp tin đính kèm upload tối đa cho phép là ${limit}`,
          'error',
          7
        )
        $(this).val(null)
        return false
      }

      let targetId = $(this).data('chat')
      let isChatGroup = false
      let formData = new FormData()

      formData.append('my-attachment-chat', fileData)
      formData.append('uid', targetId)

      if ($(this).hasClass('chat-in-group')) {
        formData.append('isChatGroup', true)
        isChatGroup = true
      }

      $.ajax({
        url: '/message/add-new-attachment',
        type: 'POST',
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        success: function ({ message }) {
          // handle realtime
          let dataToEmit = {
            message,
          }

          // step 1: handle message data before show
          let messageOfme = $(
            `<div class="bubble me buble-attachment-file" data-mess-id="${message._id}"></div>`
          )
          let attachmentChat = `
          <a href="data:${message.file.contentType}; base64, 
          ${bufferToBase64(message.file.data.data)}" 
          download="${message.file.fileName}">
          ${message.file.fileName}
          </a>
        `

          if (isChatGroup) {
            let senderAvatar = `<img src="/images/users/${message.sender.avatar}" class="avatar-small mx-1" title="" alt="${message.sender.name}"/>`

            messageOfme.html(`${senderAvatar} ${attachmentChat}`)
            increaseNumberMessageGroup(divId)
            dataToEmit.groupId = targetId
          } else {
            messageOfme.html(attachmentChat)
            dataToEmit.contactId = targetId
          }

          // Step 02: append message data to screen
          $(`.right .chat[data-chat="${divId}"]`).append(messageOfme)
          nineScrollRight(divId)

          // Step 03: remove all data at input: nothing to code :))))

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
            .html('tệp đính kèm...')

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
          socket.emit('chat-attachment', dataToEmit)

          // Step 07: Emit remove typing realtime: nothing to code :))))
          // Step 08: If this has typing, remove that immediate: nothing to code :))))

          // Step 09: Add to modal attachment

          let attachmentChatAddToModal = `
          <li>
            <a href="data:${message.file.contentType}; base64,
            ${bufferToBase64(message.file.data.data)}" 
            download="${message.file.fileName}">
              ${message.file.fileName}
            </a>
          </li>`

          $(`#attachmentsModal_${divId}`)
            .find(`ul.list-attachments`)
            .append(attachmentChatAddToModal)
        },
        error: function (error) {
          alertify.notify(error.responseText, 'error', 6)
        },
      })
    })
}

$(document).ready(function () {
  socket.on(
    'response-chat-attachment',
    function ({ message, currentGroupId, currentUserId }) {
      let divId = ''
      console.log({ message, currentGroupId, currentUserId })

      // step 1: handle message data before show
      let messageOfYou = $(
        `<div class="bubble you buble-attachment-file" data-mess-id="${message._id}"></div>`
      )

      let attachmentChat = `
      <a href="data:${message.file.contentType}; base64, 
      ${bufferToBase64(message.file.data.data)}" 
      download="${message.file.fileName}">
      ${message.file.fileName}
      </a>
    `

      if (currentGroupId) {
        let senderAvatar = `<img src="/images/users/${message.sender.avatar}" class="avatar-small mx-1" title="" alt="${message.sender.name}"/>`
        messageOfYou.html(`${senderAvatar} ${attachmentChat}`)

        divId = currentGroupId
        if (currentUserId !== $('#dropdown-navbar-user').data('uid')) {
          increaseNumberMessageGroup(divId)
        }
      } else {
        divId = currentUserId
        messageOfYou.html(attachmentChat)
      }

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
        .html('tệp đính kèm...')

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
      // Step 07: Emit remove typing realtime: nothing to code :))))
      // Step 08: If this has typing, remove that immediate: nothing to code :))))

      // Step 09: Add to modal attachment
      if (currentUserId !== $('#dropdown-navbar-user').data('uid')) {
        let attachmentChatAddToModal = `
          <li>
            <a href="data:${message.file.contentType}; base64,
            ${bufferToBase64(message.file.data.data)}" 
            download="${message.file.fileName}">
              ${message.file.fileName}
            </a>
          </li>`

        $(`#attachmentsModal_${divId}`)
          .find(`ul.list-attachments`)
          .append(attachmentChatAddToModal)
      }
    }
  )
})
