function addFriendsToGroup() {
  $('ul#group-chat-friends')
    .find('div.add-user')
    .bind('click', function () {
      let uid = $(this).data('uid')
      $(this).remove()
      let html = $('ul#group-chat-friends')
        .find('div[data-uid=' + uid + ']')
        .html()

      let promise = new Promise(function (resolve, reject) {
        $('ul#friends-added').append(html)
        $('#groupChatModal .list-user-added').show()
        resolve(true)
      })
      promise.then(function (success) {
        $('ul#group-chat-friends')
          .find('div[data-uid=' + uid + ']')
          .remove()
      })
    })
}

function cancelCreateGroup() {
  $('#cancel-group-chat').bind('click', function () {
    $('#groupChatModal .list-user-added').hide()
    if ($('ul#friends-added>li').length) {
      $('ul#friends-added>li').each(function (index) {
        $(this).remove()
      })
    }
  })
}

function callSearchFriends(element) {
  if (element.which === 13 || element.type === 'click') {
    let keyword = $('#input-search-friends-to-add-group-chat').val()

    if (!keyword.length) {
      alertify.notify('Chưa nhập nội dung tìm kiếm', 'error', 7)
      return false
    }

    // check value of input

    // call API
    fetch(`/contact/search-friends/${keyword}`)
      .then(res => {
        if (!res.ok) {
          throw res.json()
        }

        return res.json()
      })
      .then(users => {
        $('ul#group-chat-friends').html(renderUsers(users))

        // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
        addFriendsToGroup()

        // Action hủy việc tạo nhóm trò chuyện
        cancelCreateGroup()
      })
      .catch(async ex => {
        alertify.notify(await ex, 'error', 8)
      })
  }
}

function callCreateGroupChat() {}

function renderUsers(users) {
  return users.map(user => {
    return `
      <div data-uid="${user._id}" >
      <li data-uid="${user._id}" >
        <div class='contactPanel'>
          <div class='user-avatar'>
            <img src='images/users/${user.avatar}' alt='' />
          </div>
          <div class='user-name'>
            <p>${user.username}</p>
          </div>
          <br />
          <div class='user-address'>
            <span>&nbsp; ${user.address}</span>
          </div>
          <div class='add-user' data-uid="${user._id}" >
            Thêm vào nhóm
          </div>
        </div>
      </li>
    </div>
    `
  })
}

$(document).ready(function () {
  $('#input-search-friends-to-add-group-chat').bind(
    'keypress',
    callSearchFriends
  )

  $('#btn-search-friends-to-add-group-chat').bind('click', callSearchFriends)
})
