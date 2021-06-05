function increaseNumberNotifCation(className) {
  let currentValue = + $(`.${className}`).find('em').text()
  currentValue += 1
  if(currentValue === 0) {
    $(`.${className}`).html(' ')
  }else {
    $(`.${className}`).html(`(<em>${currentValue}</em>)`)
  }
}
function addContact() {
  $('.user-add-new-contact').bind('click', async function () {
    let targetId = $(this).data('uid')

    const dataResponse = await fetch('/contact/add-new', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({uid: targetId})
    })
    let data = await dataResponse.json()
    if(data.success) {
      $('#find-user').find(`div.user-add-new-contact[data-uid=${targetId}]`).hide()
      $('#find-user').find(`div.user-remove-request-contact[data-uid=${targetId}]`).css('display', 'inline-block')
      increaseNumberNotifCation('count-request-contact-sent')
      // Xử lý realtime ở bài sau
    }
  })
}