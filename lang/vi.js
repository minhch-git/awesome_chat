let transValidations = {
  string_empty: `Vui lòng nhập trường này`,
  email_incorrect: `Email phải có dạng example@gmail.com`,
  gender_incorrect: `Trường giới tính không chính xác`,
  password_incorrect: `Mật khẩu phải chứa ít nhất 6 ký tự`,
  password_confirm_incorrect: `Mật khẩu nhập lại không chính xác`
}

let transErrors = {
  account_in_use: `Email này đã được sử dụng!`,
  account_removed: `Tài khoản của này đã bị gỡ khỏi hệ thống, nếu tin rằng điều này là hiểu nhầm, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi `,
  account_not_active: `Email đã đăng ký chưa active tài khoản, vui lòng kiểm tra email của bạn hoặc liên hệ với bộ phận hỗ trợ của chúng tôi`
}

let tranSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoản ${userEmail} đã được tạo, vui lòng kiểm tra email của bạn để active tài khoản trước khi đăng nhập.`
  }
}
export {
  transValidations,
  transErrors,
  tranSuccess,
}
