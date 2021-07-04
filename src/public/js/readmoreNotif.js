$(document).ready(function () {
  $('#link-read-more-notif').bind('click', function () {
    let skipNumber = $('ul.list-notifications').find('li').length;

    $('#link-read-more-notif').attr('class', 'd-none');
    $('.read-more-notif-loader').css('display', 'inline-block');

    $.get(
      `/notification/read-more?skipNumber=${skipNumber}`,
      (notifications) => {
        if (!notifications.length) {
          alertify.notify(
            'Bạn không còn thông báo nào để xem nữa ạ.',
            'error',
            7
          );
          $('#link-read-more-notif').attr('class', 'd-block');
          $('.read-more-notif-loader').css('display', 'none');
          return false;
        }
        notifications.forEach((notification) => {
          document
            .querySelector('ul.list-notifications')
            .insertAdjacentHTML(
              'beforeend',
              `<li>${notification}</li>`
            );
        });
        $('#link-read-more-notif').attr('class', 'd-block');
        $('.read-more-notif-loader').css('display', 'none');
      }
    );
  });
});
