const transValidations = {
  string_empty: `Vui lòng nhập trường này.`,
  email_incorrect: `Email phải có dạng example@gmail.com.`,
  gender_incorrect: `Trường giới tính không chính xác.`,
  password_incorrect: `Mật khẩu phải chứa ít nhất 6 ký tự.`,
  password_confirm_incorrect: `Mật khẩu nhập lại không chính xác.`
}

const transErrors = {
  account_in_use: `Email đã được sử dụng!`,
  account_removed: `Tài khoản của này đã bị gỡ khỏi hệ thống, nếu tin rằng điều này là hiểu nhầm, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi.`,
  account_not_active: `Email đã đăng ký nhưng chưa active tài khoản, vui lòng kiểm tra email của bạn hoặc liên hệ với bộ phận hỗ trợ của chúng tôi.`,
  token_undefined: `Token không tồn tại.`,
  login_failed: `Tên đăng nhập hoặc mật khẩu không chính xác.`,
  server_error: `Có lỗi ở phía server, vui lòng liên hệ với bộ phận của chúng tôi để báo cáo lỗi này. Xin cảm ơn!`
}

const tranSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoản ${userEmail} đã được tạo, vui lòng kiểm tra email của bạn để active tài khoản trước khi đăng nhập.`
  },
  account_actived: `Kích hoạt tài khoản thành công, bạn đã có thể đăng nhập vào ứng dụng.`,
  login_success: (username) => `Xin chào ${username}. Chúc bạn một ngày tốt lành.`
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
