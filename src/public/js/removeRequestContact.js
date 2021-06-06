function removeRequestContact() {
  $('.user-remove-request-contact').bind('click', async function () {
    let targetId = $(this).data('uid')
    const dataResponse = await fetch('/contact/remove-request-contact', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({uid: targetId})
    })
    let data = await dataResponse.json()
    if(data.success) {
      $('#find-user').find(`div.user-remove-request-contact[data-uid=${targetId}]`).hide()
      $('#find-user').find(`div.user-add-new-contact[data-uid=${targetId}]`).css('display', 'inline-block')
      decreaseNumberNotifCation('count-request-contact-sent')
      // Xử lý realtime ở bài sau
    }
  })
}