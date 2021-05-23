import Joi from 'joi'
import { transValidations } from '../../lang/vi'

class Validate {
  body(schema) {
    return (req, res, next) => {
      if (!req.body.valueChecked) {
        req.body.valueChecked = new Promise(async (resolve, reject) => {
          try {
            let validatorResult = await schema.validateAsync(req.body, { abortEarly: false })
            resolve(validatorResult)
          } catch (error) {
            reject(error)
          }
        })
        next()
      }
    }
  }
}

const SchemaValidate = {
  register: Joi.object({
    email: Joi.string().email().trim().required().messages({
      'string.empty': transValidations.string_empty,
      'string.email': transValidations.email_incorrect,
    }),
    gender: Joi.string().valid('male', 'female', 'other').messages({
      'any.only': transValidations.gender_incorrect,
    }),
    password: Joi.string().min(6).messages({
      'string.min': transValidations.password_incorrect,
      'string.empty': transValidations.string_empty
    }),
    password_confirmation: Joi.string().valid(Joi.ref('password'))
      .messages({
        'any.only': transValidations.password_confirm_incorrect
      })
  }),

  updateInfo: Joi.object({
    username: Joi.string()
      .pattern(new RegExp('[A-Za-z]')).message(transValidations.update_username),
    gender: Joi.string()
      .valid('male', 'female', 'other').messages({
        'any.only': transValidations.update_gender
      }),
    address: Joi.string()
      .min(3).message(transValidations.update_address)
      .max(30).message(transValidations.update_address),
    phone: Joi.string()
      .pattern(new RegExp('^(0)[0-9]{9,10}')).message(transValidations.update_phone)
  }),

  updatePassword: Joi.object({
    currentPassword: Joi.string().min(6).messages({
      'string.min': transValidations.password_incorrect,
      'string.empty': transValidations.string_empty,
    }),
    newPassword: Joi.string().min(6).messages({
      'string.min': transValidations.password_incorrect,
      'string.empty': transValidations.string_empty,
    }),
    confirmNewPassword: Joi.string().valid(Joi.ref('password'))
      .messages({
      'string.empty': transValidations.string_empty,
      'any.only': transValidations.password_confirm_incorrect
      })
  })
}

export {
  SchemaValidate
}
export default new Validate()
