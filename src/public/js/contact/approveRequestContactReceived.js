function approveRequestContactReceived() {
  $('.user-approve-request-contact-received')
    .unbind('click')
    .on('click', async function () {
      let targetId = $(this).data('uid');

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
      );
      let data = await dataResponse.json();
      if (data.success) {
        let userInfo = $('#request-contact-received').find(
          `ul.contactList li[data-uid="${targetId}"]`
        );
        $(userInfo)
          .find('div.user-approve-request-contact-received')
          .remove();
        $(userInfo)
          .find('div.user-remove-request-contact-received')
          .remove();
        $(userInfo).find('.contactPanel').append(`
            <div class="user-talk" data-uid="${targetId}">Trò chuyện</div>
            <div class="user-remove-contact action-danger" data-uid="${targetId}">
              Xóa liên hệ
            </div>
        `);
        let userInfoHtml = userInfo.get(0).outerHTML;
        $('#contacts').find('ul.contactList').prepend(userInfoHtml);
        $(userInfo).remove();

        decreaseNumberNotifContact(
          '.count-request-contact-received'
        );
        increaseNumberNotifContact('.count-contacts');
        decreaseNumberNotification('.noti_contact_counter', 1);

        socket.emit('approve-request-contact-received', {
          contactId: targetId,
        });

        // Sau nay làm chức năng chat sẽ thêm tiếp user ơ phần chat

      }
    });
}

socket.on('response-approve-request-contact-received', user => {
  console.log(user);
  let notif = `
  <span class="d-block " data-uid="${user.id}">
    <img class="avatar-small" src="images/users/${user.avatar}" alt="" />
    <strong>${user.username}</strong> Đã chấp nhận lời mời kết bạn của bạn!
  </span>
`;

  $('.noti_content').prepend(notif);
  $('.list-notifications').prepend(`<li>${notif}</li>`);

  decreaseNumberNotification('.noti_contact_counter', 1);
  increaseNumberNotification('.noti_counter', 1);

  decreaseNumberNotifContact('.count-request-contact-sent');
  increaseNumberNotifContact('.count-contacts');

  $('#request-contact-sent')
    .find(`ul li[data-uid="${user.id}"]`)
    .remove();
  $('#find-user')
    .find(`ul li[data-uid="${user.id}"]`)
    .remove();

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
  `;
  $('#contacts').find('ul.contactList').prepend(userInfoHtml);
  removeContact();
});

$(document).ready(function () {
  approveRequestContactReceived();
});