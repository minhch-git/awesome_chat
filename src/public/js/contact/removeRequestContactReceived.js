function removeRequestContactReceived() {
  $('.user-remove-request-contact-received')
    .unbind('click')
    .on('click', async function () {
      let targetId = $(this).data('uid');
      const dataResponse = await fetch(
        '/contact/remove-request-contact-received',
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid: targetId }),
        }
      );
      let data = await dataResponse.json();
      if (data.success) {
        /*
        *Chưc năng này chưa muốn làm =))
        $('.noti_content')
          .find(`span[data-uid=${user.id}]`)
          .remove(); // remove popup mark notif
        $('.noti_content')
          .find(`li>div[data-uid=${user.id}]`)
          .parent()
          .remove(); // remove modal notif
        decreaseNumberNotification('.noti_counter', 1);
         */

        decreaseNumberNotification('.noti_contact_counter', 1);

        decreaseNumberNotifContact(
          '.count-request-contact-received'
        );

        // Xóa kêt bạn ở modal, tab yêu cầu kết bạn
        $('#request-contact-received')
          .find(`ul li[data-uid="${targetId}"]`)
          .remove();

        // Xử lý realtime
        socket.emit('remove-request-contact-received', {
          contactId: targetId,
        });
      }
    });
}

socket.on('response-remove-request-contact-received', user => {
  console.log(user);
  $('#find-user')
    .find(
      `div.user-remove-request-contact-sent[data-uid="${user.id}"]`
    )
    .hide();
  $('#find-user')
    .find(`div.user-add-new-contact[data-uid=${user.id}]`)
    .css('display', 'inline-block');

  // Xóa kêt bạn ở modal, tab chờ kết bạn
  $('#request-contact-sent')
    .find(`ul li[data-uid="${user.id}"]`)
    .remove();

  decreaseNumberNotifContact('.count-request-contact-sent');

  decreaseNumberNotification('.noti_contact_counter', 1);
});

$(document).ready(function () {
  removeRequestContactReceived();
});
