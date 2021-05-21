let userAvatar = null
let userInfo = {}
let originAvatarSrc = null
let originUserInfo = null

// validate userinfo at client

function updateUserInfo() {
  $('#input-change-avatar').bind('change', function () {
    let fileData = $(this).prop('files')[0]
    let math = ['image/jpg', 'image/png', 'image/jpeg']
    let limit = 1048576 //byte = 1MB

    if ($.inArray(fileData.type, math) == -1) {
      alertify.notify('Kiểu file không hơp lệ, chỉ chấp nhận ảnh png, jpg và jpeg ', 'error', 7)
      $(this).val(null)
      return false
    }

    if (fileData.size > limit) {
      alertify.notify(`Ảnh upload tối đa cho phép là ${limit}`, 'error', 7)
      $(this).val(null)
      return false
    }

    if (typeof (FileReader) !== 'undefined') {
      let imagePreview = $('#image-edit-profile')
      imagePreview.empty()

      let fileReader = new FileReader()

      fileReader.onload = function (element) {
        $('<img>', {
          'src': element.target.result,
          'class': 'avatar img-circle',
          'id': 'user-modal-avatar',
          'alt': 'avatar'
        }).appendTo(imagePreview)
      }

      imagePreview.show()
      fileReader.readAsDataURL(fileData)

      let formData = new FormData()
      formData.append('avatar', fileData)
      userAvatar = formData
    } else {
      alertify.notify('Trình duyệt của bạn không hỗ trợ FileReader', 'error', 7)
    }
  })

  $('#input-change-username').bind('change', function () {
    userInfo.username = $(this).val();
  })

  $('#input-change-gender-male').bind('click', function () {
    userInfo.gender = $(this).val();
  })

  $('#input-change-gender-female').bind('click', function () {
    userInfo.gender = $(this).val();
  })

  $('#input-change-gender-other').bind('click', function () {
    userInfo.gender = $(this).val();
  })

  $('#input-change-address').bind('change', function () {
    userInfo.address = $(this).val();
  })

  $('#input-change-phone').bind('change', function () {
    userInfo.phone = $(this).val();
  })

}

let callUpdateUserAvatar = () => {
  $.ajax({
    url: '/user/update-avatar',
    type: 'put',
    cache: false,
    contentType: false,
    processData: false,
    data: userAvatar,
    success: function (result) {

      // display success
      $('.user-modal-alert-success').find('span').text(result.messages)
      $('.user-modal-alert-success').css('display', 'block')

      // update avatar at navbar
      $('#navbar-avatar').attr('src', result.imageSrc)

      // update origin avatar src
      originAvatarSrc = result.imageSrc

      $('#input-btn-cancel-update-user').click()
    },
    error: function (error) {
      $('.user-modal-alert-error').find('span').text(error.responseText)
      $('.user-modal-alert-error').css('display', 'block')

      // reset all
      $('#input-btn-cancel-update-user').click()
    },
  })
}

let callUpdateUserInfo = () => {

  let options = {
    url: '/user/update-info',
    type: 'put',
    data: userInfo,
    success: (result)=>{
      // update Origin user info
      originUserInfo = Object.assign(originUserInfo, userInfo)
      // update username at navbar
      $('#navbar-username').text(originUserInfo.username)

      $('.user-modal-alert-success').find('span').text(result.messages)
      $('.user-modal-alert-success').css('display', 'block')

      // reset all
    },
    error: (error) => {
      console.log(error)
      $('.user-modal-alert-error').find('span').text(error.responseText)
      $('.user-modal-alert-error').css('display', 'block')

      // reset all
      $('#input-btn-cancel-update-user').click()
    }
  }

  $.ajax(options)
}

$(document).ready(function () {
  originAvatarSrc = $('#user-modal-avatar').attr('src')
  originUserInfo = {
    username: $('#input-change-username').val(),
    gender: $('#input-change-gender-male').is(':checked') ? $('#input-change-gender-male').val() :
      $('#input-change-gender-female').is(':checked') ? $('#input-change-gender-female').val() : $('#input-change-gender-other').val(),
    address: $('#input-change-address').val(),
    phone: $('#input-change-phone').val()
  }

  // update user info after change value to update
  updateUserInfo()

  $('#input-btn-update-user').bind('click', function () {

    if ($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify('Bạn phải thay đổi thông tin trước khi cập nhập dữ liệu', 'error', 7)
      return false
    }

    if (userAvatar) {
      callUpdateUserAvatar()
    }else {
      callUpdateUserInfo()
    }
  })

  // reset avatar and info
  $('#input-btn-cancel-update-user').bind('click', function () {
    userAvatar = null
    userInfo = {}
    $('#user-modal-avatar').attr('src', originAvatarSrc)
    $('#input-change-username').val(originUserInfo.username)
    $('#input-change-address').val(originUserInfo.address)
    $('#input-change-phone').val(originUserInfo.phone)

  })
})