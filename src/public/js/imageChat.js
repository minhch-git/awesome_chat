function imageChat(divId) {
  $(`#image-chat-${divId}`)
    .unbind('change')
    .on('change', function () {
      let fileData = $(this).prop('files')[0]
      let math = ['image/jpg', 'image/png', 'image/jpeg']
      let limit = 1048576 //byte = 1MB

      if ($.inArray(fileData.type, math) == -1) {
        alertify.notify(
          'Kiểu file không hơp lệ, chỉ chấp nhận ảnh png, jpg và jpeg ',
          'error',
          7
        )
        $(this).val(null)
        return false
      }

      if (fileData.size > limit) {
        alertify.notify(`Ảnh upload tối đa cho phép là ${limit}`, 'error', 7)
        $(this).val(null)
        return false
      }

      let targetId = $(this).data('chat')
      let formData = new FormData()

      formData.append('my-image-chat', fileData)
      formData.append('uid', targetId)

      if ($(this).hasClass('chat-in-group')) {
        formData.append('isChatGroup', true)
      }

      console.log({ formData })
      $.ajax({
        url: '/message/add-new-image',
        type: 'POST',
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        success: function (data) {
          console.log(data)
        },
        error: function (error) {
          alertify.notify(error.responseText, 'error', 6)
        },
      })
    })
}
