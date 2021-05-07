import jwt from 'jsonwebtoken'
class JwtHelper {
  encoded(user, secretOrPrivateKey, tokenLife) {
    let payload = {
      iss: 'minhchiu',
      sub: user._id,
      email: user.local.email
    }
    return jwt.sign(payload, secretOrPrivateKey, {
      expiresIn: tokenLife
    })
  }

  // [ POST ] /login
  async login(req, res) {
    try {
      const { email, password } = req.body

      let user = await User.findByEmail(email)
      if (!user) {
        console.log('Tên đăng nhập hoặc mật khẩu không chính xác')
        return
      }
      if (!user.comparePassword(password)) {
        console.log('Tên đăng nhập hoặc mật khẩu không chính xác')
        return
      }
      if (!user.local.isActive) {
        console.log('Tài khoản của bạn chưa active, Vui lòng active tài khoản trước khi đăng nhập')
        return
      }

      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
      const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || '1h'
      const accessToken = jwtHelper.encoded(user, accessTokenSecret, accessTokenLife)

      const refreshTokenSecret = process.env.REFESH_TOKEN_SECRET
      const refreshTokenLife = process.env.REFESH_TOKEN_LIFE || '1d'
      const refreshToken = jwtHelper.encoded(user, refreshTokenSecret, refreshTokenLife)
    } catch (error) {
      console.log(error)
    }
  }
}

export default new JwtHelper()
