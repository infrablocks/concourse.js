import { expect } from 'chai'

import data from '../testsupport/data'
import Job from '../../src/model/Job'
import JobSet from '../../src/model/JobSet'

describe('JobSet', () => {
  it('determines the set of jobs having each resource as input', () => {
    const firstResourceName = data.randomResourceName()
    const secondResourceName = data.randomResourceName()
    const thirdResourceName = data.randomResourceName()

    const job1Data = data.randomJob({
      inputs: data.randomJobInputs({
        inputs: [
          data.randomInput({ resource: firstResourceName }),
          data.randomInput({ resource: secondResourceName })
        ]
      })
    })
    const job1 = new Job({ ...job1Data })

    const job2Data = data.randomJob({
      inputs: data.randomJobInputs({
        inputs: [
          data.randomInput({
            resource: firstResourceName,
            passed: job1.getName()
          }),
          data.randomInput({ resource: thirdResourceName })
        ]
      })
    })
    const job2 = new Job({ ...job2Data })

    const jobSet = new JobSet([job1, job2])

    expect(jobSet.getJobsByInputResource())
      .to.eql(
        {
          [firstResourceName]: [job1, job2],
          [secondResourceName]: [job1],
          [thirdResourceName]: [job2]
        })
  })
})
