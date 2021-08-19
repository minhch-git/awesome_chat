function typingOn(divId) {
  let targetId = $(`#write-chat-${divId}`).data('chat')

  if ($(`#write-chat-${divId}`).hasClass('chat-in-group')) {
    socket.emit('user-is-typing', { groupId: targetId })
  } else {
    socket.emit('user-is-typing', { contactId: targetId })
  }
}
function typingOff(divId) {
  let targetId = $(`#write-chat-${divId}`).data('chat')

  if ($(`#write-chat-${divId}`).hasClass('chat-in-group')) {
    socket.emit('user-is-not-typing', { groupId: targetId })
  } else {
    socket.emit('user-is-not-typing', { contactId: targetId })
  }
}

$(document).ready(function () {
  // listen typing on
  socket.on(
    'response-user-is-typing',
    function ({ currentGroupId, currentUserId }) {
      let messageTyping = `<div class="bubble you bubble-typing-gif">
      <img src="/images/chat/typing.gif" />
    </div>`

      if (currentGroupId) {
        if (currentUserId !== $('#dropdown-navbar-user').data('uid')) {
          let checkTyping = $(`.chat[data-chat="${currentGroupId}"]`).find(
            'div.bubble-typing-gif'
          )
          if (checkTyping.length) return false
          $(`.chat[data-chat="${currentGroupId}"]`).append(messageTyping)
          nineScrollRight(currentGroupId)
        }
      } else {
        let checkTyping = $(`.chat[data-chat="${currentUserId}"]`).find(
          'div.bubble-typing-gif'
        )

        if (checkTyping.length) return false
        $(`.chat[data-chat="${currentUserId}"]`).append(messageTyping)
        nineScrollRight(currentUserId)
      }
    }
  )

  // listen typing off
  socket.on(
    'response-user-is-not-typing',
    function ({ currentGroupId, currentUserId }) {
      if (currentGroupId) {
        if (currentUserId !== $('#dropdown-navbar-user').data('uid')) {
          $(`.chat[data-chat="${currentGroupId}"]`)
            .find('div.bubble-typing-gif')
            .remove()
          nineScrollRight(currentGroupId)
        }
      } else {
        $(`.chat[data-chat="${currentUserId}"]`)
          .find('div.bubble-typing-gif')
          .remove()
        nineScrollRight(currentUserId)
      }
    }
  )
})
