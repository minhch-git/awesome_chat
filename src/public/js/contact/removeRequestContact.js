function removeRequestContact() {
  $('.user-remove-request-contact').bind('click', async function () {
    let targetId = $(this).data('uid')
    const dataResponse = await fetch('/contact/remove-request-contact', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid: targetId })
    })
    let data = await dataResponse.json()
    if (data.success) {
      $('#find-user').find(`div.user-remove-request-contact[data-uid=${targetId}]`).hide()
      $('#find-user').find(`div.user-add-new-contact[data-uid=${targetId}]`).css('display', 'inline-block')
      decreaseNumberNotifContact('.count-request-contact-sent')
      // Xử lý realtime
      socket.emit('remove-request-contact', { contactId: targetId })
    }
  })
}

socket.on('response-remove-request-contact', (user) => {
  console.log(user)
  $('.noti_content').find(`span[data-uid=${user.id}]`).remove() // remove popup mark notif
  $('.noti_content').find(`li>div[data-uid=${user.id}]`).parent().remove() // remove modal notif

  // Xóa kêt bạn ở yêu cầu kết bạn

  decreaseNumberNotifContact('.count-request-contact-received')

  decreaseNumberNotification('.noti_contact_counter')
  decreaseNumberNotification('.noti_counter')
})