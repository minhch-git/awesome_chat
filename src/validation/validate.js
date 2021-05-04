class Validator {
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
export default new Validator()
