import nodemailer from 'nodemailer'

let adminEmail = process.env.MAIL_USER
let adminPassword = process.env.MAIL_PASSWORD
let mailHost = process.env.MAIL_HOST
let mailPort = process.env.MAIL_PORT

const sendMail = (to, subject, htmlContent) => {
  let transporter = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false,
    auth: {
      user: adminEmail,
      pass: adminPassword,
    }
  })

  let info = transporter.sendMail({
    from: adminEmail,
    to: to,
    subject: subject,
    html: htmlContent,
  }) // return a promise

  return info
}

export default sendMail
