const makeNotificationsAsRead = async (targetUsers) => {
  const response = await fetch('/notification/mark-all-as-read', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ targetUsers: targetUsers })
  })
  const result = await response.json()
  if (result.success) {
    targetUsers.forEach(uid => {
      $('.noti_content').find(`span[data-uid=${uid}]`)
        .removeClass('notif-readed-false')
      $('ul.list-notifications').find(`li>span[data-uid=${uid}]`)
        .removeClass('notif-readed-false')
    })
    decreaseNumberNotification('.noti_counter', targetUsers.length)
  }
}

$(document).ready(() => {
  // link at popup notifications
  $('#popup-mark-notif-as-read').bind('click', function () {
    let targetUsers = []
    $('.noti_content').find('span.notif-readed-false')
      .each(function (index, notification) {
        targetUsers.push(notification.dataset.uid)
      })
    if (!targetUsers.length) {
      alertify.notify('Bạn không còn thông báo nào chưa được đọc', 'error', 7)
      return false
    }
    makeNotificationsAsRead(targetUsers)
  })

  // link at modal notifications
  $('#modal-mark-notif-as-read').bind('click', function () {
    let targetUsers = []
    $('ul.list-notifications').find('li>span.notif-readed-false')
      .each(function (index, notification) {
        targetUsers.push(notification.dataset.uid)
      })
    if (!targetUsers.length) {
      alertify.notify('Bạn không còn thông báo nào chưa được đọc', 'error', 7)
      return false
    }
    makeNotificationsAsRead(targetUsers)
  })
})