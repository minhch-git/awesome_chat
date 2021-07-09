$(document).ready(function () {
  $('#link-read-more-contacts-received').bind('click', function () {
    let skipNumber = $('#request-contact-received').find(
      'li'
    ).length;

    $('#link-read-more-contacts-received').attr('class', 'd-none');
    $('.read-more-contacts-received-loader').css(
      'display',
      'inline-block'
    );

    $.get(
      `/contact/read-more-contacts-received?skipNumber=${skipNumber}`,
      newContactUsers => {
        if (!newContactUsers.length) {
          alertify.notify(
            'Bạn không còn yêu cầu nào để xem nữa ạ.',
            'error',
            7
          );
          $('#link-read-more-contacts-received').attr(
            'class',
            'd-block'
          );
          $('.read-more-contacts-received-loader').css(
            'display',
            'none'
          );
          return false;
        }
        newContactUsers.forEach(user => {
          document
            .querySelector(
              '#request-contact-received ul.contactList'
            )
            .insertAdjacentHTML(
              'beforeend',
              `
            <li class="_contactList" data-uid="${user._id}">
              <div class="contactPanel">
                <div class="user-avatar"><img src="/images/users/${
                  user.avatar
                }" alt="" /></div>
                <div class="user-name">
                  <p>${user.username}</p>
                </div><br />
                <div class="user-address">
                  <span>${user.address ? user.address : ''}</span>
                </div>
                <div class="user-approve-request-contact-received" data-uid="${
                  user._id
                }">
                  Chấp nhận
                </div>
                <div class="user-remove-request-contact-received action-danger" data-uid="${
                  user._id
                }">
                  Xóa yêu cầu
                </div>
              </div>
            </li>
          `
            );
        });
        $('#link-read-more-contacts-received').attr(
          'class',
          'd-block'
        );
        $('.read-more-contacts-received-loader').css(
          'display',
          'none'
        );
        removeRequestContactReceived();
        approveRequestContactReceived();
      }
    );
  });
});
