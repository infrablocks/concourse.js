import { expect } from 'chai'

const throwsError = (instance, method, args) => async (message) => {
  try {
    await instance[method](args)
  } catch (e) {
    expect(e instanceof Error).to.eql(true)
    expect(e.message)
      .to.eql(message)
    return
  }
  expect.fail(null, null, 'Expected exception but none was thrown.')
}

const withOptions = (instance, method) => (options) => {
  return {throwsError: throwsError(instance, method, options)}
}

const onCallOf = (instance) => (method) => {
  return {withOptions: withOptions(instance, method)}
}

export const forInstance = (instance) => {
  return {onCallOf: onCallOf(instance)}
}
