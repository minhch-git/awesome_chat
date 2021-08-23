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

function callCreateGroupChat() {
  let usersElement = $('ul#friends-added').find('li')

  if (usersElement.length < 2) {
    alertify.notify(
      'Vui lòng chọn bạn bè để thêm vào nhóm, tối thiểu 2 người',
      'error',
      8
    )
    return false
  }

  let groupChatName = $('input#name-group-chat').val()
  if (groupChatName.length < 5 || groupChatName.length > 20) {
    alertify.notify(
      'Vui lòng nhập tên cuộc trò chuyện giới hạn 5 - 20 kí tự',
      'error',
      8
    )
    return false
  }

  let arrayId = []
  $('ul#friends-added')
    .find('li')
    .each((index, item) => {
      arrayId.push({ userId: $(item).data('uid') })
    })

  Swal.fire({
    title: `Bạn có chắc chắn muốn tạo nhóm ${groupChatName}`,
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Xác nhận',
  }).then(result => {
    if (!result.value) return false

    fetch('/group-chat/add-new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ arrayId, groupChatName }),
    })
      .then(res => {
        if (!res.ok) {
          throw res.json()
        }

        return res.json()
      })
      .then(groupChat => {
        // Step 01: hide modal
        $('#cancel-group-chat').click()
        $('#input-search-friends-to-add-group-chat').val('')
        $('#groupChatModal').modal('hide')

        // Step 02: handle leftSide.ejs
        let subGroupChatName = groupChat.name
        if (subGroupChatName.length > 13)
          subGroupChatName = subGroupChatName.slice(0, 12)

        let leftSideData = `
          <a class="room-chat" href="#uid_${groupChat._id}" data-target="#to_${groupChat._id}">
            <li class="person group-chat" data-chat="${groupChat._id}">
              <div class="left-avatar">
                <img src="images/users/group-avatar-trungquandev.png" alt="" />
              </div>
            <span class="name">
              <span class="group-chat-name">
                ${subGroupChatName}<span>...</span>
              </span>
            </span>
              <span class="time"></span>
              <span class="preview"></span>
           </li>
          </a>
        `

        $('#all-chat').find('ul').prepend(leftSideData)
        $('#group-chat').find('ul').prepend(leftSideData)

        // Step 03: handle rightSide.ejs
        let rightSideData = `
        <div class="right tab-pane" id="to_${groupChat._id}" data-chat="${groupChat._id}">
          <div class="top">
            <span>To: <span class="name">${groupChat.name}</span></span>
            <span class="chat-menu-right">
              <a class="show-attachments" href="#attachmentsModal_${groupChat._id}" data-toggle="modal">
                Tệp đính kèm
                <i class="fa fa-paperclip"></i>
              </a>
            </span>
            <span class="chat-menu-right">
              <a href="javascript:void(0)">&nbsp;</a>
            </span>
            <span class="chat-menu-right">
              <a class="show-images" href="#imagesModal_${groupChat._id}" data-toggle="modal">
                Hình ảnh
                <i class="fa fa-photo"></i>
              </a>
            </span>
            <!-- number members in group -->
            <span class="chat-menu-right">
              <a href="javascript:void(0)">&nbsp;</a>
            </span>
            <span class="chat-menu-right">
              <a class="number-members" href="javascript:void(0)" data-toggle="modal">
              <span class="show-number-members"> ${groupChat.usersAmount}</span>
              <i class="fa fa-users"></i>
              </a>
            </span>

            <!-- number messages -->
            <span class="chat-menu-right">
              <a href="javascript:void(0)">&nbsp;</a>
            </span>
            <span class="chat-menu-right">
              <a class="number-messages" href="javascript:void(0)" data-toggle="modal">
              <span class="show-number-messages"> ${groupChat.messagesAnount}</span>
              <i class="fa fa-comment"></i>
              </a>
            </span>

          </div>
          
          <div class="content-chat">
            <div class="chat" 
            data-chat="${groupChat._id}"></div>
          </div>

          <div class="write" data-chat="${groupChat._id}">
            <input class="write-chat chat-in-group" type="text" id="write-chat-${groupChat._id}"  data-chat="${groupChat._id}" />
            <div class="icons">
              <a class="icon-chat" href="#" data-chat="${groupChat._id}"><i class="fa fa-smile-o"></i></a>
              <label for="image-chat-${groupChat._id}">
                <input class="image-chat chat-in-group" id="image-chat-${groupChat._id}" type="file" name="my-image-chat" data-chat="${groupChat._id}" />
                <i class="fa fa-photo"></i>
              </label>
              <label for="attachment-chat-${groupChat._id}">
                <input class="attachment-chat chat-in-group" id="attachment-chat-${groupChat._id}" type="file" name="my-attachment-chat" data-chat="${groupChat._id}" />
                <i class="fa fa-paperclip"></i>
              </label>
              <a id="video-chat-group" href="javascript:void(0)" >
                <i class="fa fa-video-camera"></i>
              </a> 
              <input id="peer-id" type="hidden" value="" /></div>
          </div>

      </div>
        `
        $('#screen-chat').prepend(rightSideData)

        // Step 04: Call function changeScreenChat
        changeScreenChat()

        // Step 05: Handle imageModal.ejs
        let imageModalData = `
        <div class="modal fade" id="imagesModal_${groupChat._id}" role="dialog">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header"><button class="close" type="button" data-dismiss="modal">&times;</button>
                      <h4 class="modal-title">Những hình ảnh trong cuộc trò chuyện</h4>
                  </div>
                  <div class="modal-body">
                      <div class="all-images" style="visibility: hidden;"></div>
                  </div>
              </div>
          </div>
        </div>
        `
        $('body').append(imageModalData)

        // Step 06: Call function gridPhotos
        gridPhotos(5)

        // Step 07: Handle attachmentChat.ejs
        let attachmentModalData = `
        <div class="modal fade" id="attachmentsModal_${groupChat._id}" role="dialog">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header"><button class="close" type="button" data-dismiss="modal">&times;</button>
                      <h4 class="modal-title">Những tệp đính kèm trong cuộc trò chuyện.</h4>
                  </div>
                  <div class="modal-body">
                      <ul class="list-attachments">
                      </ul>
                  </div>
              </div>
          </div>
        </div>
        `
        $('body').append(attachmentModalData)

        // Step 08: Emit new group created
        socket.emit('new-group-created', groupChat)

        // Step 09: Emit when member received a group chat: nothing to code :))

        // Step 10: update online
        socket.emit('check-status')
      })
      .catch(async ex => {
        const errors = await ex
        alertify.notify(errors.message, 'error', 8)
      })
  })
}

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
  $('input#name-group-chat').on('keydown', function (e) {
    if (e.which == 13) {
      callCreateGroupChat()
    }
  })
  $('#btn-search-friends-to-add-group-chat').bind('click', callSearchFriends)
  $('#create-group-chat').bind('click', callCreateGroupChat)

  socket.on('response-new-group-created', response => {
    // Step 01: hide modal: nothing to code :))

    // Step 02: handle leftSide.ejs
    let subGroupChatName = response.groupChat.name
    if (subGroupChatName.length > 13)
      subGroupChatName = subGroupChatName.slice(0, 12)

    let leftSideData = `
       <a class="room-chat" href="#uid_${response.groupChat._id}" data-target="#to_${response.groupChat._id}">
         <li class="person group-chat" data-chat="${response.groupChat._id}">
           <div class="left-avatar">
             <img src="images/users/group-avatar-trungquandev.png" alt="" />
           </div>
         <span class="name">
           <span class="group-chat-name">
             ${subGroupChatName}<span>...</span>
           </span>
         </span>
           <span class="time"></span>
           <span class="preview"></span>
        </li>
       </a>
     `

    $('#all-chat').find('ul').prepend(leftSideData)
    $('#group-chat').find('ul').prepend(leftSideData)

    // Step 03: handle rightSide.ejs
    let rightSideData = `
     <div class="right tab-pane" id="to_${response.groupChat._id}" data-chat="${response.groupChat._id}">
       <div class="top">
         <span>To: <span class="name">${response.groupChat.name}</span></span>
         <span class="chat-menu-right">
           <a class="show-attachments" href="#attachmentsModal_${response.groupChat._id}" data-toggle="modal">
             Tệp đính kèm
             <i class="fa fa-paperclip"></i>
           </a>
         </span>
         <span class="chat-menu-right">
           <a href="javascript:void(0)">&nbsp;</a>
         </span>
         <span class="chat-menu-right">
           <a class="show-images" href="#imagesModal_${response.groupChat._id}" data-toggle="modal">
             Hình ảnh
             <i class="fa fa-photo"></i>
           </a>
         </span>
         <!-- number members in group -->
         <span class="chat-menu-right">
           <a href="javascript:void(0)">&nbsp;</a>
         </span>
         <span class="chat-menu-right">
           <a class="number-members" href="javascript:void(0)" data-toggle="modal">
           <span class="show-number-members"> ${response.groupChat.usersAmount}</span>
           <i class="fa fa-users"></i>
           </a>
         </span>

         <!-- number messages -->
         <span class="chat-menu-right">
           <a href="javascript:void(0)">&nbsp;</a>
         </span>
         <span class="chat-menu-right">
           <a class="number-messages" href="javascript:void(0)" data-toggle="modal">
           <span class="show-number-messages"> ${response.groupChat.messagesAnount}</span>
           <i class="fa fa-comment"></i>
           </a>
         </span>

       </div>
       
       <div class="content-chat">
         <div class="chat" 
         data-chat="${response.groupChat._id}"></div>
       </div>

       <div class="write" data-chat="${response.groupChat._id}">
         <input class="write-chat chat-in-group" type="text" id="write-chat-${response.groupChat._id}"  data-chat="${response.groupChat._id}" />
         <div class="icons">
           <a class="icon-chat" href="#" data-chat="${response.groupChat._id}"><i class="fa fa-smile-o"></i></a>
           <label for="image-chat-${response.groupChat._id}">
             <input class="image-chat chat-in-group" id="image-chat-${response.groupChat._id}" type="file" name="my-image-chat" data-chat="${response.groupChat._id}" />
             <i class="fa fa-photo"></i>
           </label>
           <label for="attachment-chat-${response.groupChat._id}">
             <input class="attachment-chat chat-in-group" id="attachment-chat-${response.groupChat._id}" type="file" name="my-attachment-chat" data-chat="${response.groupChat._id}" />
             <i class="fa fa-paperclip"></i>
           </label>
           <a id="video-chat-group" href="javascript:void(0)" >
             <i class="fa fa-video-camera"></i>
           </a> 
           <input id="peer-id" type="hidden" value="" /></div>
       </div>

   </div>
     `
    $('#screen-chat').prepend(rightSideData)

    // Step 04: Call function changeScreenChat
    changeScreenChat()

    // Step 05: Handle imageModal.ejs
    let imageModalData = `
     <div class="modal fade" id="imagesModal_${response.groupChat._id}" role="dialog">
       <div class="modal-dialog modal-lg">
           <div class="modal-content">
               <div class="modal-header"><button class="close" type="button" data-dismiss="modal">&times;</button>
                   <h4 class="modal-title">Những hình ảnh trong cuộc trò chuyện</h4>
               </div>
               <div class="modal-body">
                   <div class="all-images" style="visibility: hidden;"></div>
               </div>
           </div>
       </div>
     </div>
     `
    $('body').append(imageModalData)

    // Step 06: Call function gridPhotos
    gridPhotos(5)

    // Step 07: Handle attachmentChat.ejs
    let attachmentModalData = `
    <div class="modal fade" id="attachmentsModal_${response.groupChat._id}" role="dialog">
      <div class="modal-dialog modal-lg">
          <div class="modal-content">
              <div class="modal-header"><button class="close" type="button" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Những tệp đính kèm trong cuộc trò chuyện.</h4>
              </div>
              <div class="modal-body">
                  <ul class="list-attachments">
                  </ul>
              </div>
          </div>
      </div>
    </div>
   `
    $('body').append(attachmentModalData)
    // Step 08: Emit new group created: nothing to code :)))

    // Step 09: Emit when member received a group chat
    socket.emit('member-received-group-chat', {
      groupChatId: response.groupChat._id,
    })

    // Step 10: update online
    socket.emit('check-status')
  })
})
