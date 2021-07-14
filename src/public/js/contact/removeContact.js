function removeContact() {
  $('.user-remove-contact')
    .unbind('click')
    .on('click', async function () {
      let targetId = $(this).data('uid');
      let username = $(this)
        .parent()
        .find('div.user-name p')
        .text();
      // Thêm modal xác nhận xóa
      Swal.fire({
        title: 'Are you sure?',
        text: `Bạn chắc chắn muốn xóa ${username}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then(result => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          );
        }
        return new Promise((resolve, reject) => {
          result.value && resolve();
        }).then(async () => {
          console.log('Success');
          // call API
          const dataResponse = await fetch(
            '/contact/remove-contact',
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
            $('#contacts')
              .find(`ul li[data-uid=${targetId}]`)
              .remove();
            decreaseNumberNotifContact('.count-contacts');
            // Sau nay làm chức năng chat sẽ xóa tiếp user ơ phần chat

            socket.emit('remove-contact', {
              contactId: targetId,
            });
          }
        });
      });
    });
}

socket.on('response-remove-contact', user => {
  $('#contacts').find(`ul li[data-uid=${user.id}]`).remove();
  decreaseNumberNotifContact('.count-contacts');
  // Sau nay làm chức năng chat sẽ xóa tiếp user ơ phần chat
});

$(document).ready(function () {
  removeContact();
});
