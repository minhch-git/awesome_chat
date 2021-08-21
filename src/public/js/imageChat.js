function bufferToBase64(buffer) {
  var binary = ''
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

function imageChat(divId) {
  $(`#image-chat-${divId}`)
    .unbind('change')
    .on('change', function () {
      let fileData = $(this).prop('files')[0]
      let math = ['image/jpg', 'image/png', 'image/jpeg']
      let limit = 1048576 //byte = 1MB

      if ($.inArray(fileData.type, math) == -1) {
        alertify.notify(
          'Kiểu file không hơp lệ, chỉ chấp nhận ảnh png, jpg và jpeg ',
          'error',
          7
        )
        $(this).val(null)
        return false
      }

      if (fileData.size > limit) {
        alertify.notify(`Ảnh upload tối đa cho phép là ${limit}`, 'error', 7)
        $(this).val(null)
        return false
      }

      let targetId = $(this).data('chat')
      let isChatGroup = false
      let formData = new FormData()

      formData.append('my-image-chat', fileData)
      formData.append('uid', targetId)

      if ($(this).hasClass('chat-in-group')) {
        formData.append('isChatGroup', true)
        isChatGroup = true
      }

      $.ajax({
        url: '/message/add-new-image',
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
            `<div class="bubble me buble-image-file" data-mess-id="${message._id}"></div>`
          )
          let imageChat = `<img class="show-image-chat" src="data:${
            message.file.contentType
          }; base64, ${bufferToBase64(message.file.data.data)} " />`

          if (isChatGroup) {
            let senderAvatar = `<img src="/images/users/${message.sender.avatar}" class="avatar-small mx-1" title="" alt="${message.sender.name}"/>`

            messageOfme.html(`${senderAvatar} ${imageChat}`)
            increaseNumberMessageGroup(divId)
            dataToEmit.groupId = targetId
          } else {
            messageOfme.html(imageChat)
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
            .html('hình ảnh...')

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
          socket.emit('chat-image', dataToEmit)

          // Step 07: Emit remove typing realtime: nothing to code :))))
          // Step 08: If this has typing, remove that immediate: nothing to code :))))

          // Step 09: Add to modal image
          let imageChatAddToModal = `<img src="data:${
            message.file.contentType
          }; base64, ${bufferToBase64(message.file.data.data)}" />`

          $(`#imagesModal_${divId}`)
            .find(`div.all-images`)
            .append(imageChatAddToModal)
        },
        error: function (error) {
          alertify.notify(error.responseText, 'error', 6)
        },
      })
    })
}
$(document).ready(function () {
  socket.on(
    'response-chat-image',
    function ({ message, currentGroupId, currentUserId }) {
      let divId = ''

      // step 1: handle message data before show
      let messageOfYou = $(
        `<div class="bubble you buble-image-file" data-mess-id="${message._id}"></div>`
      )
      let imageChat = `<img class="show-image-chat" src="data:${
        message.file.contentType
      }; base64, ${bufferToBase64(message.file.data.data)} " />`

      if (currentGroupId) {
        let senderAvatar = `<img src="/images/users/${message.sender.avatar}" class="avatar-small mx-1" title="" alt="${message.sender.name}"/>`
        messageOfYou.html(`${senderAvatar} ${imageChat}`)

        divId = currentGroupId
        if (currentUserId !== $('#dropdown-navbar-user').data('uid')) {
          increaseNumberMessageGroup(divId)
        }
      } else {
        divId = currentUserId
        messageOfYou.html(imageChat)
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
      $(`.person[data-chat=${divId}]`).find('span.preview').html('hình ảnh...')

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

      // Step 09: Add to modal image
      if (currentUserId !== $('#dropdown-navbar-user').data('uid')) {
        let imageChatAddToModal = `<img src="data:${
          message.file.contentType
        }; base64, ${bufferToBase64(message.file.data.data)}" />`

        $(`#imagesModal_${divId}`)
          .find(`div.all-images`)
          .append(imageChatAddToModal)
      }
    }
  )
})
