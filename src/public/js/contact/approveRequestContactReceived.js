function approveRequestContactReceived() {
  $('.user-approve-request-contact-received')
    .unbind('click')
    .on('click', async function () {
      let targetId = $(this).data('uid')
      let targetName = $(this).parent().find('div.user-name>p').text().trim()
      let targetAvatar = $(this)
        .parent()
        .find('div.user-avatar>img')
        .attr('src')

      const dataResponse = await fetch(
        '/contact/approve-request-contact-received',
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid: targetId }),
        }
      )
      let data = await dataResponse.json()
      if (data.success) {
        let userInfo = $('#request-contact-received').find(
          `ul.contactList li[data-uid="${targetId}"]`
        )
        $(userInfo).find('div.user-approve-request-contact-received').remove()
        $(userInfo).find('div.user-remove-request-contact-received').remove()
        $(userInfo).find('.contactPanel').append(`
            <div class="user-talk" data-uid="${targetId}">Trò chuyện</div>
            <div class="user-remove-contact action-danger" data-uid="${targetId}">
              Xóa liên hệ
            </div>
        `)
        let userInfoHtml = userInfo.get(0).outerHTML
        $('#contacts').find('ul.contactList').prepend(userInfoHtml)
        $(userInfo).remove()

        decreaseNumberNotifContact('.count-request-contact-received')
        increaseNumberNotifContact('.count-contacts')
        decreaseNumberNotification('.noti_contact_counter', 1)

        socket.emit('approve-request-contact-received', {
          contactId: targetId,
        })

        // All steps handle chat after approve contact
        // Step 01: hide modal
        // $('#contactsModal').modal('hide')

        // Step 02: handle leftSide.ejs
        let subUserName = targetName
        if (subUserName.length > 13) subUserName = subUserName.slice(0, 12)

        let leftSideData = `
          <a class="room-chat" data-target="#to_${targetId}" href="#uid_${targetId}">
            <li class="person" data-chat="${targetId}">
              <div class="left-avatar">
                <div class="dot"></div>
                <img src="${targetAvatar}" alt="" />
              </div>
              <span class="name">
                ${subUserName}
              </span>
              <span class="time"></span>
              <span class="preview"></span>
            </li>
          </a>
         `
        $('#all-chat').find('ul').prepend(leftSideData)
        $('#user-chat').find('ul').prepend(leftSideData)

        // Step 03: handle rightSide.ejs
        let rightSideData = `
        <div class="right tab-pane " id="to_${targetId}" data-chat="${targetId}">
          <div class="top">
            <span>To: <span class="name">${targetName}</span></span>
            <span class="chat-menu-right">
              <a class="show-attachments" href="#attachmentsModal_${targetId}" data-toggle="modal">
                Tệp đính kèm
                <i class="fa fa-paperclip"></i>
              </a>
            </span>
            <span class="chat-menu-right">
              <a href="javascript:void(0)">&nbsp;</a>
            </span>
            <span class="chat-menu-right">
              <a class="show-images" href="#imagesModal_${targetId}" data-toggle="modal">
                Hình ảnh
                <i class="fa fa-photo"></i>
              </a>
            </span>
          </div>
          <div class="content-chat">
            <div class="chat" data-chat="${targetId}"></div>
          </div>

          <div class="write" data-chat="${targetId}">
            <input class="write-chat" type="text" id="write-chat-${targetId}"  data-chat="${targetId}" />
            <div class="icons">
              <a class="icon-chat" href="#" data-chat="${targetId}"><i class="fa fa-smile-o"></i></a>
              
              <label for="image-chat-${targetId}">
                <input class="image-chat" id="image-chat-${targetId}" type="file" name="my-image-chat" data-chat="${targetId}" />
                <i class="fa fa-photo"></i>
              </label>
              
              <label for="attachment-chat-${targetId}">
                <input class="attachment-chat" 
                id="attachment-chat-${targetId}" 
                type="file" name="my-attachment-chat" 
                data-chat="${targetId}" />
                <i class="fa fa-paperclip"></i>
              </label>
              <a class="video-chat" 
              id="video-chat-${targetId}" 
              href="javascript:void(0)" 
              data-chat="${targetId}">
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
        <div class="modal fade" id="imagesModal_${targetId}" role="dialog">
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
        <div class="modal fade" id="attachmentsModal_${targetId}" role="dialog">
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

        // Step 8: update online
        socket.emit('check-status')
      }
    })
}

socket.on('response-approve-request-contact-received', user => {
  let notif = `
  <span class="d-block " data-uid="${user.id}">
    <img class="avatar-small" src="images/users/${user.avatar}" alt="" />
    <strong>${user.username}</strong> Đã chấp nhận lời mời kết bạn của bạn!
  </span>
`

  $('.noti_content').prepend(notif)
  $('.list-notifications').prepend(`<li>${notif}</li>`)

  decreaseNumberNotification('.noti_contact_counter', 1)
  increaseNumberNotification('.noti_counter', 1)

  decreaseNumberNotifContact('.count-request-contact-sent')
  increaseNumberNotifContact('.count-contacts')

  $('#request-contact-sent').find(`ul li[data-uid="${user.id}"]`).remove()
  $('#find-user').find(`ul li[data-uid="${user.id}"]`).remove()

  let userInfoHtml = `
    <li class="_contactList" data-uid="${user.id}">
      <div class="contactPanel">
        <div class="user-avatar"><img src="/images/users/${user.avatar}" alt="" /></div>
        <div class="user-name">
          <p>${user.username}</p>
        </div>
        <br />
        <div class="user-address">
          <span>${user.address}</span>
        </div>
        <div class="user-talk" data-uid="${user.id}">Trò chuyện</div>
        <div class="user-remove-contact action-danger" data-uid="${user.id}">
          Xóa liên hệ
        </div>
      </div>
    </li>
  `
  $('#contacts').find('ul.contactList').prepend(userInfoHtml)
  removeContact()

  // All steps handle chat after approve contact
  // Step 01: hide modal: nothing to code

  // Step 02: handle leftSide.ejs
  let subUserName = user.username
  if (subUserName.length > 13) subUserName = subUserName.slice(0, 12)

  let leftSideData = `
          <a class="room-chat" data-target="#to_${user._id}" href="#uid_${user._id}">
            <li class="person" data-chat="${user._id}">
              <div class="left-avatar">
                <div class="dot"></div>
                <img src="images/users/${user.avatar}" alt="" />
              </div>
              <span class="name">
                ${subUserName}
              </span>
              <span class="time"></span>
              <span class="preview"></span>
            </li>
          </a>
         `
  $('#all-chat').find('ul').prepend(leftSideData)
  $('#user-chat').find('ul').prepend(leftSideData)

  // Step 03: handle rightSide.ejs
  let rightSideData = `
      <div class="right tab-pane " id="to_${user._id}" data-chat="${user._id}">
        <div class="top">
          <span>To: <span class="name">${user.username}</span></span>
          <span class="chat-menu-right">
            <a class="show-attachments" href="#attachmentsModal_${user._id}" data-toggle="modal">
              Tệp đính kèm
              <i class="fa fa-paperclip"></i>
            </a>
          </span>
          <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
          </span>
          <span class="chat-menu-right">
            <a class="show-images" href="#imagesModal_${user._id}" data-toggle="modal">
              Hình ảnh
              <i class="fa fa-photo"></i>
            </a>
          </span>
        </div>
        <div class="content-chat">
          <div class="chat" data-chat="${user._id}"></div>
        </div>

        <div class="write" data-chat="${user._id}">
          <input class="write-chat" type="text" id="write-chat-${user._id}"  data-chat="${user._id}" />
          <div class="icons">
            <a class="icon-chat" href="#" data-chat="${user._id}"><i class="fa fa-smile-o"></i></a>
            
            <label for="image-chat-${user._id}">
              <input class="image-chat" id="image-chat-${user._id}" type="file" name="my-image-chat" data-chat="${user._id}" />
              <i class="fa fa-photo"></i>
            </label>
            
            <label for="attachment-chat-${user._id}">
              <input class="attachment-chat" 
              id="attachment-chat-${user._id}" 
              type="file" name="my-attachment-chat" 
              data-chat="${user._id}" />
              <i class="fa fa-paperclip"></i>
            </label>
            <a class="video-chat" 
            id="video-chat-${user._id}" 
            href="javascript:void(0)" 
            data-chat="${user._id}">
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
        <div class="modal fade" id="imagesModal_${user._id}" role="dialog">
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
        <div class="modal fade" id="attachmentsModal_${user._id}" role="dialog">
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

  // Step 8: update online
  socket.emit('check-status')
})

$(document).ready(function () {
  approveRequestContactReceived()
})
