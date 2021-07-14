$(document).ready(function () {
  $('#link-read-more-contacts').bind('click', function () {
    let skipNumber = $('#contacts').find('li').length;

    $('#link-read-more-contacts').attr('class', 'd-none');
    $('.read-more-contacts-loader').css('display', 'inline-block');

    $.get(
      `/contact/read-more-contacts?skipNumber=${skipNumber}`,
      newContactUsers => {
        if (!newContactUsers.length) {
          alertify.notify(
            'Bạn không còn bạn bè nào để xem nữa ạ.',
            'error',
            7
          );
          $('#link-read-more-contacts').attr('class', 'd-block');
          $('.read-more-contacts-loader').css('display', 'none');
          return false;
        }
        newContactUsers.forEach(user => {
          document
            .querySelector('#contacts ul.contactList')
            .insertAdjacentHTML(
              'beforeend',
              `<li class="_contactList" data-uid="${user._id}">
                <div class="contactPanel">
                  <div class="user-avatar"><img src="/images/users/${
                    user.avatar
                  }" alt="" /></div>
                  <div class="user-name">
                    <p>${user.username}</p>
                  </div>
                  <br />
                  <div class="user-address">
                    <span>${user.address ? user.address : ''}</span>
                  </div>
                  <div class="user-talk" data-uid="${
                    user._id
                  }">Trò chuyện</div>
                  <div class="user-remove-contact action-danger" data-uid="${
                    user._id
                  }">
                    Xóa liên hệ
                  </div>
                </div>
              </li>`
            );
        });

        removeContact();
        $('#link-read-more-contacts').attr('class', 'd-block');
        $('.read-more-contacts-loader').css('display', 'none');
      }
    );
  });
});
