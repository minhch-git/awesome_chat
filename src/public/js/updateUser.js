let userAvatar = null
let userInfo = {}
let originAvatarSrc = null
let originUserInfo = {}
let userUpdatePassword = {}

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

  // // handle password
  // $('#input-change-current-password').bind('change', function () {
  //   let currentPassword = $(this).val()
  //   // let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/)
  //   let msgError = `Mật khẩu chứa ít nhất 8 ký tự, bao gồm chữ in hoa, chữ thường, chữ số và ký tự đặc biệt`
  //   if (currentPassword.length < 8) {
  //     alertify.notify(msgError, 'error', 7)

  //     $(this).val(null)
  //     delete userUpdatePassword.currentPassword
  //     return false
  //   }
  //   userUpdatePassword.currentPassword = currentPassword
  // })
  // $('#input-change-new-password').bind('change', function () {
  //   let newPassword = $(this).val()
  //   // let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/)
  //   let msgError = `Mật khẩu chứa ít nhất 8 ký tự, bao gồm chữ in hoa, chữ thường, chữ số và ký tự đặc biệt`
  //   if (newPassword.length < 8) {
  //     alertify.notify(msgError, 'error', 7)

  //     $(this).val(null)
  //     delete userUpdatePassword.newPassword
  //     return false
  //   }
  //   userUpdatePassword.newPassword = newPassword
  // })
  // $('#input-confirm-new-password').bind('change', function () {
  //   let confirmNewPassword = $(this).val()

  //   if (!userUpdatePassword.newPassword) {
  //     alertify.notify('Bạn chưa nhập mật khẩu mới', 'error', 7)

  //     $(this).val(null)
  //     delete userUpdatePassword.confirmNewPassword
  //     return false
  //   }

  //   if (confirmNewPassword != userUpdatePassword.newPassword) {
  //     alertify.notify('Mật khẩu nhập lại chưa chính xác', 'error', 7)

  //     $(this).val(null)
  //     delete userUpdatePassword.confirmNewPassword
  //     return false
  //   }
  //   userUpdatePassword.confirmNewPassword = confirmNewPassword
  // })

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
    success: (result) => {
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

let callUpdateUserPassword = async () => {
  try {
    let response = await fetch('/user/update-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userUpdatePassword)
    })
    let data = await response.json()
    if (!response.ok) {
      throw new Error(data.msg)
    }
    $('.user-modal-password-alert-success').find('span').text(data.msg)
    $('.user-modal-password-alert-success').css('display', 'block')

    $('#input-btn-cancel-update-user-password').click()
  } catch (error) {
    $('.user-modal-password-alert-error').find('span').text(error)
    $('.user-modal-password-alert-error').css('display', 'block')

    // reset all
    $('#input-btn-cancel-update-user-password').click()
  }
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

    // if ($.isEmptyObject(userInfo) && !userAvatar) {
    //   alertify.notify('Bạn phải thay đổi thông tin trước khi cập nhập dữ liệu', 'error', 7)
    //   return false
    // }

    if (userAvatar) {
      callUpdateUserAvatar()
    } else {
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


  $('#input-btn-update-user-password').bind('click', function () {
    // if (!userUpdatePassword?.currentPassword || !userUpdatePassword?.newPassword || !userUpdatePassword?.confirmNewPassword) {
    //   alertify.notify('Bạn phải thay đổi đầy đủ thông tin', 'error', 7)
    //   return false
    // }
    callUpdateUserPassword()

  })
  $('#input-btn-cancel-update-user-password').bind('click', function () {
    userUpdatePassword = {}
    $('#input-change-current-password').val(null)
    $('#input-change-new-password').val(null)
    $('#input-confirm-new-password').val(null)
  })
})