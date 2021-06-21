function callFindUsers(element) {
  if (element.which === 13 || element.type === 'click') {
    let keyword = $('#input-find-users-contact').val()

    if (!keyword.length) {
      alertify.notify('Chưa nhập nội dung tìm kiếm', 'error', 7)
      return false
    }

    // check value of input 

    // call API
    fetch(`/contact/find-users/${keyword}`)
      .then(response => {
        if (!response.ok) {
          throw new Error()
        }
        return response.json()
      })
      .then(data => {
        $('#find-user .contactList').html(renderUsers(data))
        addContact()
        removeRequestContact()
      })
  }
}
function renderUsers(users) {
  let htmls = users.map(user => `
    <li class="_contactList" data-uid='${user._id}'>
      <div class="contactPanel">
          <div class="user-avatar"><img src="/images/users/${user.avatar}" alt="" /></div>
          <div class="user-name">
              <p>${user.username}</p>
          </div><br />
          <div class="user-address"><span>${user.address}</span></div>
          <div class="user-add-new-contact" data-uid='${user._id}'>Thêm vào danh sách liên lạc</div>
          <div class="user-remove-request-contact action-danger" data-uid='${user._id}'>Hủy yêu cầu</div>
      </div>
  </li>
  `)
  return htmls
}

$(document).ready(function () {
  $('#input-find-users-contact').bind('keypress', callFindUsers)

  $('#btn-find-users-contact').bind('click', callFindUsers)
})



