import { expect } from 'chai'

const throwsError = (Type, args) => (message) => {
  expect(() => { new Type(args) }) // eslint-disable-line no-new
    .to.throw(Error, message)
}

const withOptions = (Type) => (args) => {
  return {
    throwsError: throwsError(Type, args)
  }
}

export const onConstructionOf = (Type) => {
  return {
    withEmptyOptions: () => withOptions(Type)({}),
    withArguments: withOptions(Type)
  }
}
