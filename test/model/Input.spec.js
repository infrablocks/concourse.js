import { expect } from 'chai'

import data from '../testsupport/data.js'
import Input from '../../src/model/Input.js'

describe('Input', () => {
  it('exposes its attributes', () => {
    const inputData = data.randomInput({ passed: [data.randomJobName()] })

    const input = new Input(inputData)

    expect(input.getName()).to.eql(inputData.name)
    expect(input.getResourceName()).to.eql(inputData.resource)
    expect(input.getNamesOfJobsToHavePassed()).to.eql(inputData.passed)
    expect(input.isTrigger()).to.eql(inputData.trigger)
  })

  describe('requiresAtLeastJobToHavePassed', () => {
    it('returns true if the input requires the job with the supplied name to ' +
      'have passed', () => {
      const job1Name = data.randomJobName()
      const job2Name = data.randomJobName()

      const input = new Input(data.randomInput({ passed: [job1Name, job2Name] }))

      expect(input.requiresAtLeastJobToHavePassed(job1Name)).to.eql(true)
    })

    it('returns false if the input does not require the job with the supplied ' +
      'name to have passed', () => {
      const job1Name = data.randomJobName()
      const job2Name = data.randomJobName()
      const otherJobName = data.randomJobName()

      const input = new Input(data.randomInput({ passed: [job1Name, job2Name] }))

      expect(input.requiresAtLeastJobToHavePassed(otherJobName)).to.eql(false)
    })
  })

  describe('requiresAnyJobToHavePassed', () => {
    it('returns true if the input has a passed attribute containing one ' +
      'or more elements', () => {
      const job1Name = data.randomJobName()
      const job2Name = data.randomJobName()

      const input = new Input(data.randomInput({ passed: [job1Name, job2Name] }))

      expect(input.requiresAnyJobsToHavePassed()).to.eql(true)
    })

    it('returns false if the input has a passed attribute containing no' +
      'elements', () => {
      const input = new Input(data.randomInput({ passed: [] }))

      expect(input.requiresAnyJobsToHavePassed()).to.eql(false)
    })

    it('returns false if the input has no passed attribute', () => {
      const input = new Input(data.randomInput({ passed: null }))

      expect(input.requiresAnyJobsToHavePassed()).to.eql(false)
    })
  })
})
