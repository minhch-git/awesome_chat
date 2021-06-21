function addContact() {
  $('.user-add-new-contact').bind('click', async function () {
    let targetId = $(this).data('uid')

    const dataResponse = await fetch('/contact/add-new', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid: targetId })
    })
    let data = await dataResponse.json()
    if (data.success) {
      $('#find-user').find(`div.user-add-new-contact[data-uid=${targetId}]`).hide()
      $('#find-user').find(`div.user-remove-request-contact[data-uid=${targetId}]`).css('display', 'inline-block')
      increaseNumberNotifContact('.count-request-contact-sent')
      // Xử lý realtime
      socket.emit('add-new-contact', { contactId: targetId })
    }
  })
}

socket.on('response-add-new-contact', (user) => {
  console.log(user)

  let notif = `
    <span class="d-block " data-uid="${user.id}">
      <img class="avatar-small" src="images/users/${user.avatar}" alt="" />
      <strong>${user.username}</strong> Đã gửi cho bạn một lời mời kết bạn!
    </span>
  `

  $('.noti_content').prepend(notif)
  $('.list-notifications').prepend(`<li>${notif}</li>`)

  increaseNumberNotifContact('.count-request-contact-received')

  increaseNumberNotification('.noti_contact_counter')
  increaseNumberNotification('.noti_counter')
})