import { expect } from 'chai'

import data from '../testsupport/data.js'
import Output from '../../src/model/Output.js'

describe('Output', () => {
  it('exposes its attributes', () => {
    const outputData = data.randomOutput()

    const output = new Output(outputData)

    expect(output.getName()).to.eql(outputData.name)
    expect(output.getResourceName()).to.eql(outputData.resource)
  })
})
