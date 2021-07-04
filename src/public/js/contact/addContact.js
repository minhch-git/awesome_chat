function addContact() {
  $('.user-add-new-contact').bind('click', async function () {
    let targetId = $(this).data('uid');

    const dataResponse = await fetch('/contact/add-new', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid: targetId }),
    });
    let data = await dataResponse.json();
    if (data.success) {
      $('#find-user')
        .find(`div.user-add-new-contact[data-uid=${targetId}]`)
        .hide();
      $('#find-user')
        .find(
          `div.user-remove-request-contact-sent[data-uid=${targetId}]`
        )
        .css('display', 'inline-block');

      increaseNumberNotification('.noti_contact_counter', 1);
      increaseNumberNotifContact('.count-request-contact-sent');

      const userInfoHTML = $('#find-user')
        .find(`ul li[data-uid="${targetId}"]`)
        .get(0).outerHTML;
      // Thêm kêt bạn ở modal, tab chờ kết bạn
      $('#request-contact-sent').find('ul').prepend(userInfoHTML);

      removeRequestContactSent(); //js/removeRequestContactSent.js

      socket.emit('add-new-contact', { contactId: targetId });
    }
  });
}

socket.on('response-add-new-contact', user => {
  let notif = `
    <span class="d-block " data-uid="${user.id}">
      <img class="avatar-small" src="images/users/${user.avatar}" alt="" />
      <strong>${user.username}</strong> Đã gửi cho bạn một lời mời kết bạn!
    </span>
  `;

  $('.noti_content').prepend(notif);
  $('.list-notifications').prepend(`<li>${notif}</li>`);

  increaseNumberNotifContact('.count-request-contact-received');

  increaseNumberNotification('.noti_contact_counter', 1);
  increaseNumberNotification('.noti_counter', 1);

  const userInfoHTML = `
    <li class="_contactList" data-uid="${user.id}">
      <div class="contactPanel">
        <div class="user-avatar"><img src="/images/users/${user.avatar}" alt="" /></div>
        <div class="user-name">
          <p>${user.username}</p>
        </div><br />
        <div class="user-address">
          <span>${user.address}</span>
        </div>
        <div class="user-acccept-contact-received" data-uid="${user.id}">
          Chấp nhận
        </div>
        <div class="user-remove-request-contact-received action-danger" data-uid="${user.id}">
          Xóa yêu cầu
        </div>
      </div>
    </li>
  `;
  // Thêm kêt bạn ở modal, tab yêu câu kết bạn
  $('#request-contact-received').find('ul').prepend(userInfoHTML);
  removeRequestContactReceived();
});
