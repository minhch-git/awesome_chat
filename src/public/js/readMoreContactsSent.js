$(document).ready(function () {
  $('#link-read-more-contacts-sent').bind('click', function () {
    let skipNumber = $('#request-contact-sent').find('li').length;

    $('#link-read-more-contacts-sent').attr('class', 'd-none');
    $('.read-more-contacts-sent-loader').css(
      'display',
      'inline-block'
    );

    $.get(
      `/contact/read-more-contacts-sent?skipNumber=${skipNumber}`,
      newContactUsers => {
        if (!newContactUsers.length) {
          alertify.notify(
            'Đã hết yêu cầu gửi đi để xem nữa ạ.',
            'error',
            7
          );
          $('#link-read-more-contacts-sent').attr(
            'class',
            'd-block'
          );
          $('.read-more-contacts-sent-loader').css(
            'display',
            'none'
          );
          return false;
        }
        newContactUsers.forEach(user => {
          document
            .querySelector('#request-contact-sent ul.contactList')
            .insertAdjacentHTML(
              'beforeend',
              `<li class="_contactList" data-uid="${user._id}">
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
                <div class="user-remove-request-contact-sent action-danger d-inline-block" data-uid="${
                  user._id
                }">
                  Hủy yêu cầu
                </div>
              </div>
            </li>`
            );
        });
        removeRequestContactSent(); //js/removeRequestContactSent.js
        $('#link-read-more-contacts-sent').attr('class', 'd-block');
        $('.read-more-contacts-loader').css('display', 'none');
      }
    );
  });
});
