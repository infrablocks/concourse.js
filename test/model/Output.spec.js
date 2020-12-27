import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { expect } from 'chai'

import data from '../testsupport/data'
import Output from '../../src/model/Output'

describe('Output', () => {
  it('exposes its attributes', () => {
    const outputData = data.randomOutput()

    const output = new Output(outputData)

    expect(output.getName()).to.eql(outputData.name)
    expect(output.getResourceName()).to.eql(outputData.resource)
  })
})
