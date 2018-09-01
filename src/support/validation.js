import Joi from 'joi'

export const string = () => Joi.string()
export const boolean = () => Joi.boolean()
export const integer = () => Joi.number().integer()
export const func = () => Joi.func()
export const object = () => Joi.object()
export const uri = () => string().uri()

export const required = () => Joi.required()

export const schemaFor = (config) =>
  Joi.object().keys(config)

export const validateOptions = (schema, options) => {
  const { error, value } = schema.validate(options)

  if (error) {
    const errorDetails = error.details
      .map(detail => detail.message)
      .join(', ')
    throw new Error(`Invalid parameter(s): [${errorDetails}].`)
  }

  return value
}
