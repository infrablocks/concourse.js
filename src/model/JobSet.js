import { pathOr, reduce } from 'ramda'

export default class JobSet {
  constructor (jobs) {
    this.jobs = jobs
    this.jobsByInputResource = reduce((outer, job) => ({
      ...outer,
      ...reduce((inner, input) => ({
        ...inner,
        [input.resource]: [...pathOr([], [input.resource], outer), job]
      }),
      {}, job.getInputs())
    }),
    {}, jobs)
  }

  getJobsByInputResource () {
    return this.jobsByInputResource
  }
}
