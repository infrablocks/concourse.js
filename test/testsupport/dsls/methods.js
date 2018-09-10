import { expect } from 'chai'

const throwsError = (instance, method, args) => async (message) => {
  try {
    await instance[method](...args)
  } catch (e) {
    expect(e instanceof Error).to.eql(true)
    expect(e.message)
      .to.eql(message)
    return
  }
  expect.fail(null, null, 'Expected exception but none was thrown.')
}

const withArguments = (instance, method) => (...args) => {
  return { throwsError: throwsError(instance, method, args) }
}

const onCallOf = (instance) => (method) => {
  return {
    withNoArguments: () => withArguments(instance, method)(),
    withArguments: withArguments(instance, method)
  }
}

export const forInstance = (instance) => {
  return { onCallOf: onCallOf(instance) }
}
