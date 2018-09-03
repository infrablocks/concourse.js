import { expect } from 'chai'

const throwsError = (type, args) => (message) => {
  expect(() => {new type(args)}) // eslint-disable-line no-new
    .to.throw(Error, message)
}

const withOptions = (type) => (args) => {
  return {
    throwsError: throwsError(type, args)
  }
}

export const onConstructionOf = (type) => {
  return {
    withEmptyOptions: () => withOptions(type)({}),
    withArguments: withOptions(type)
  }
}
