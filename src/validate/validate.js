class Validator {
  body(schema) {
    return (req, res, next) => {
      let validatorResult = schema.validate(req.body)
      if(validatorResult.error) {
        console.log(validatorResult.error)
        return
      }
      console.log(req.body)
    }
  }
}

export default new Validator()