import { includes, isEmpty } from 'ramda'

export const toInput = client => inputData =>
  new Input({ ...inputData, client })

export default class Input {
  constructor ({ name, resource, passed, trigger, client }) {
    this.name = name
    this.resource = resource
    this.passed = passed
    this.trigger = trigger
    this.client = client
  }

  getName () {
    return this.name
  }

  getResourceName () {
    return this.resource
  }

  getNamesOfJobsToHavePassed () {
    return this.passed
  }

  isTrigger () {
    return !!this.trigger
  }

  requiresAnyJobsToHavePassed () {
    return !!this.passed && !isEmpty(this.passed)
  }

  requiresAtLeastJobToHavePassed (jobName) {
    return includes(jobName, this.passed || [])
  }
}
