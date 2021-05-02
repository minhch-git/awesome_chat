import Joi from 'joi'
import { transValidations } from './../../lang/vi'

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
        'string.empty': transValidations.string_empty,
        'any.only': transValidations.password_confirm_incorrect
      })
  }),


}

export default SchemaValidate