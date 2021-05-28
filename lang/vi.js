const transValidations = {
  string_empty: `Vui lòng nhập trường này.`,
  email_incorrect: `Email phải có dạng example@gmail.com.`,
  gender_incorrect: `Trường giới tính không chính xác.`,
  password_incorrect: `Mật khẩu phải chứa ít nhất 6 ký tự.`,
  password_confirm_incorrect: `Mật khẩu nhập lại không chính xác.`,
  update_username: 'Username giới hạn trong khoảng 3-17 ký tự và không được phép chứa ký tự đặc biệt.',
  update_gender: 'Giới liệu dữ tích có vấn đề, bạn là Hacker phải chăng? ',
  update_address: 'Địa chỉ giới hạn 3-30 ký tự',
  update_phone: 'Số điện thoại Việt Nam bắt đầu số 0, giới hạn trong khoảng 10-11 ký tự. ',
}

const transErrors = {
  account_in_use: `Email đã được sử dụng!`,
  account_undefined: `Tài khoản không tồn tại!`,
  account_removed: `Tài khoản của này đã bị gỡ khỏi hệ thống, nếu tin rằng điều này là hiểu nhầm, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi.`,
  account_not_active: `Email đã đăng ký nhưng chưa active tài khoản, vui lòng kiểm tra email của bạn hoặc liên hệ với bộ phận hỗ trợ của chúng tôi.`,
  token_undefined: `Bạn đã xác minh tài khoản trước đó.`,
  login_failed: `Tên đăng nhập hoặc mật khẩu không chính xác.`,
  server_error: `Có lỗi ở phía server, vui lòng liên hệ với bộ phận của chúng tôi để báo cáo lỗi này. Xin cảm ơn!`,
  avatar_type: `Kiểu file không hơp lệ, chỉ chấp nhận ảnh png, jpg và jpeg`,
  user_current_password_failed: 'Nhập mật khẩu cũ không chính xác'
}

const tranSuccess = {
  userCreated: (userEmail) => `Tài khoản ${userEmail} đã được tạo, vui lòng kiểm tra email của bạn để active tài khoản trước khi đăng nhập.`,
  account_actived: `Kích hoạt tài khoản thành công, bạn đã có thể đăng nhập vào ứng dụng.`,
  login_success: (username) => `Xin chào ${username}. Chúc bạn một ngày tốt lành.`,
  logout_success: `Đăng xuất tài khoản thành công. Hẹn gặp lại bạn!`,
  avatar_update: `Cập nhập ảnh đại diện thành công`,
  user_info_update: `Cập nhập thông tin cá nhân thành công`,
  user_password_update: 'Cập nhập mật khẩu thành công'
}

const transEmail = {
  subject: `Awesome Chat: Xác nhận kích hoạt tài khoản.`,
  template: (linkVerify) => {
    return `
      <h2>Bạn nhập được email này vì đã đăng ký tài khoản trên ứng dụng awesome chat.</h2>
      <h3>Vui lòng click vào liên kết bên dưới để xác nhận kích hoạt tài khoản.</h3>
      <h3><a href="${linkVerify}" target="_blank">${linkVerify}</a></h3>
      <h4>Nếu tin rằng email này là nhầm lẫn, hãy bỏ qua nó. Trân trọng</h4>
    `
  },
  send_failed: `Có lỗi trong quá trình gửi email, vui lòng liên hệ với bộ phận của chúng tôi.`
}

export {
  transValidations,
  transErrors,
  tranSuccess,
  transEmail,
}
