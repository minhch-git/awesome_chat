function removeContact() {
  $('.user-remove-contact')
    .unbind('click')
    .on('click', async function () {
      let targetId = $(this).data('uid')
      let username = $(this).parent().find('div.user-name p').text()
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
          Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
        }
        return new Promise((resolve, reject) => {
          result.value && resolve()
        }).then(async () => {
          console.log('Success')
          // call API
          const dataResponse = await fetch('/contact/remove-contact', {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid: targetId }),
          })
          let data = await dataResponse.json()
          if (data.success) {
            $('#contacts').find(`ul li[data-uid=${targetId}]`).remove()
            decreaseNumberNotifContact('.count-contacts')

            socket.emit('remove-contact', {
              contactId: targetId,
            })

            // All steps handle chat after remove contact
            // Step 0: check active
            let checkActive = $(`#all-chat`)
              .find(`li[data-chat="${targetId}"]`)
              .hasClass('active')

            // Step 01: Remove leftSide.ejs
            $('#all-chat').find(`ul a[href="#uid_${targetId}"]`).remove()
            $('#user-chat').find(`ul a[href="#uid_${targetId}"]`).remove()

            // Step 02: Remove rightSide.ejs
            $('#screen-chat').find(`div#to_${targetId}`)

            // Step 03: Remove imageModal.ejs
            $('body').find(`div#imagesModal_${targetId}`)
            // Step 04: Remove attachmentsModal.ejs
            $('body').find(`div#attachmentsModal_${targetId}`)

            // Step 05: Click first conversation
            if (checkActive) {
              $('ul.people').find('a')[0].click()
            }
          }
        })
      })
    })
}

socket.on('response-remove-contact', user => {
  $('#contacts').find(`ul li[data-uid=${user.id}]`).remove()
  decreaseNumberNotifContact('.count-contacts')

  // All steps handle chat after remove contact
  // Step 0: check active
  let checkActive = $(`#all-chat`)
    .find(`li[data-chat="${user.id}}"]`)
    .hasClass('active')

  // Step 01: Remove leftSide.ejs
  $('#all-chat').find(`ul a[href="#uid_${user.id}"]`).remove()
  $('#user-chat').find(`ul a[href="#uid_${user.id}"]`).remove()

  // Step 02: Remove rightSide.ejs
  $('#screen-chat').find(`div#to_${user.id}`)

  // Step 03: Remove imageModal.ejs
  $('body').find(`div#imagesModal_${user.id}`)
  // Step 04: Remove attachmentsModal.ejs
  $('body').find(`div#attachmentsModal_${user.id}`)

  // Step 05: Click first conversation
  if (checkActive) {
    $('ul.people').find('a')[0].click()
  }
})

$(document).ready(function () {
  removeContact()
})
