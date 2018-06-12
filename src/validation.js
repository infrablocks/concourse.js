import Joi from 'joi';

export const string = () => Joi.string();
export const uri = () => string().uri();

export const schemaFor = (config) =>
  Joi.object().keys(config);

export const validateOptions = (schema, options) => {
  const { error, value } = schema.validate(options);

  if (error) {
    const errorDetails = error.details
      .map(detail => detail.message)
      .join(', ');
    throw new Error(`Invalid parameter(s): [${errorDetails}].`);
  }

  return value;
};
