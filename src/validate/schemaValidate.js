import Joi from 'joi'
import transValidation from './../../lang/vi'

let register = Joi.object({
  email: Joi.string().email().trim().required().messages({
    'string.any': transValidation.email_incorrect,
    'string.email': transValidation.email_incorrect
  }),
  gender: Joi.string().valid('male', 'female', 'other').messages({
    'string.any': transValidation.gender_incorrect,
  }),
  password: Joi.string().regex(/[a-zA-Z0-9]$/).min(6).messages({
    'string.any': transValidation.password_incorrect,
    'string.min': transValidation.password_incorrect,
    'string.empty': transValidation.string_empty
  }),
  password_confirm: Joi.string().valid(Joi.ref('password')).messages({
    "any.only" : transValidation.password_confirm_incorrect,
    'string.empty': transValidation.string_empty,
    'string.any': transValidation.password_confirm_incorrect

  }),
})
export {
  register
}
