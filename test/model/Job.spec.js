import "core-js/stable";
import "regenerator-runtime/runtime";
import sinon from 'sinon'
import { expect } from 'chai'
import { map, times } from 'ramda'

import data from '../testsupport/data'
import Job from '../../src/model/Job'
import Input, { toInput } from '../../src/model/Input'
import Output, { toOutput } from '../../src/model/Output'
import JobSet from '../../src/model/JobSet'
import Build from '../../src/model/Build'
import BuildStatus from '../../src/model/BuildStatus'

describe('Job', () => {
  it('exposes its attributes', () => {
    const jobData = data.randomJob()

    const job = new Job(jobData)

    expect(job.getId()).to.eql(jobData.id)
    expect(job.getName()).to.eql(jobData.name)
    expect(job.getPipelineName()).to.eql(jobData.pipelineName)
    expect(job.getTeamName()).to.eql(jobData.teamName)
    expect(job.getInputs()).to.eql(map(toInput(undefined), jobData.inputs))
    expect(job.getOutputs()).to.eql(map(toOutput(undefined), jobData.outputs))
    expect(job.getGroups()).to.eql(jobData.groups)
  })

  describe('getInputForResource', () => {
    it('finds input by resource name', () => {
      const firstResourceName = data.randomResourceName()
      const secondResourceName = data.randomResourceName()

      const firstInputData = data.randomInput({ resource: firstResourceName })
      const secondInputData = data.randomInput({ resource: secondResourceName })

      const jobData = data.randomJob({
        inputs: data.randomJobInputs({
          inputs: [firstInputData, secondInputData]
        })
      })
      const job = new Job(jobData)

      expect(job.getInputForResource(firstResourceName))
        .to.eql(new Input(firstInputData))
      expect(job.getInputForResource(secondResourceName))
        .to.eql(new Input(secondInputData))
    })

    it('returns undefined when no input exists for resource name', () => {
      const resourceName = data.randomResourceName()

      const jobData = data.randomJob()
      const job = new Job(jobData)

      expect(job.getInputForResource(resourceName))
        .to.eql(undefined)
    })
  })

  describe('getOutputForResource', () => {
    it('finds output by resource name', () => {
      const firstResourceName = data.randomResourceName()
      const secondResourceName = data.randomResourceName()

      const firstOutputData = data.randomOutput({ resource: firstResourceName })
      const secondOutputData = data.randomOutput({ resource: secondResourceName })

      const jobData = data.randomJob({
        outputs: data.randomJobOutputs({
          outputs: [firstOutputData, secondOutputData]
        })
      })
      const job = new Job(jobData)

      expect(job.getOutputForResource(firstResourceName))
        .to.eql(new Output(firstOutputData))
      expect(job.getOutputForResource(secondResourceName))
        .to.eql(new Output(secondOutputData))
    })
  })

  describe('hasDependencyJobs', () => {
    it('returns true when the job has an input that requires other jobs to ' +
      'have passed', () => {
      const otherInput = data.randomInput()
      const inputRequiringOtherJobsToHavePassed = data.randomInput({
        passed: [data.randomJobName()]
      })

      const jobData = data.randomJob({
        inputs: data.randomJobInputs({
          inputs: [otherInput, inputRequiringOtherJobsToHavePassed]
        })
      })

      const job = new Job(jobData)

      expect(job.hasDependencyJobs()).to.eql(true)
    })

    it('returns false when the job has inputs that do not require other', () => {
      const firstInput = data.randomInput()
      const secondInput = data.randomInput()

      const jobData = data.randomJob({
        inputs: data.randomJobInputs({
          inputs: [firstInput, secondInput]
        })
      })

      const job = new Job(jobData)

      expect(job.hasDependencyJobs()).to.eql(false)
    })
  })

  describe('getDependencyJobs', () => {
    it('returns the set of jobs that the input resource requires to have ' +
      'passed for this job to be run when there is a single input ' +
      'resource', async () => {
      const teamName = data.randomTeamName()
      const pipelineName = data.randomPipelineName()

      const firstDependencyJobName = data.randomJobName()
      const secondDependencyJobName = data.randomJobName()

      const inputRequiringOtherJobsToHavePassed = data.randomInput({
        passed: [firstDependencyJobName, secondDependencyJobName]
      })

      const firstDependencyJobData = data.randomJob({
        name: firstDependencyJobName
      })
      const secondDependencyJobData = data.randomJob({
        name: secondDependencyJobName
      })
      const dependentJobData = data.randomJob({
        inputs: data.randomJobInputs({
          inputs: [inputRequiringOtherJobsToHavePassed]
        })
      })

      const getJob = sinon.stub()
      const pipelineClient = { getJob }

      const forPipeline = sinon.stub()
        .withArgs(pipelineName)
        .returns(pipelineClient)
      const teamClient = { forPipeline }

      const forTeam = sinon.stub()
        .withArgs(teamName)
        .returns(teamClient)
      const client = { forTeam }

      const firstDependencyJob = new Job({ ...firstDependencyJobData, client })
      const secondDependencyJob = new Job({
        ...secondDependencyJobData,
        client
      })

      getJob.withArgs(firstDependencyJobName).resolves(firstDependencyJobData)
      getJob.withArgs(secondDependencyJobName).resolves(secondDependencyJobData)

      const job = new Job({ ...dependentJobData, client })

      const dependencyJobs = await job.getDependencyJobs()

      expect(dependencyJobs)
        .to.eql([firstDependencyJob, secondDependencyJob])
    })

    it('returns the set of jobs that must have passed for all input ' +
      'resources for this job to be run when there are many input ' +
      'resources', async () => {
      const teamName = data.randomTeamName()
      const pipelineName = data.randomPipelineName()

      const firstDependencyJobName = data.randomJobName()
      const secondDependencyJobName = data.randomJobName()
      const thirdDependencyJobName = data.randomJobName()

      const firstInputRequiringOtherJobsToHavePassed = data.randomInput({
        passed: [firstDependencyJobName, secondDependencyJobName]
      })
      const secondInputRequiringOtherJobsToHavePassed = data.randomInput({
        passed: [secondDependencyJobName, thirdDependencyJobName]
      })

      const firstDependencyJobData = data.randomJob({
        name: firstDependencyJobName
      })
      const secondDependencyJobData = data.randomJob({
        name: secondDependencyJobName
      })
      const thirdDependencyJobData = data.randomJob({
        name: thirdDependencyJobName
      })
      const dependentJobData = data.randomJob({
        inputs: data.randomJobInputs({
          inputs: [
            firstInputRequiringOtherJobsToHavePassed,
            secondInputRequiringOtherJobsToHavePassed
          ]
        })
      })

      const getJob = sinon.stub()
      const pipelineClient = { getJob }

      const forPipeline = sinon.stub()
        .withArgs(pipelineName)
        .returns(pipelineClient)
      const teamClient = { forPipeline }

      const forTeam = sinon.stub()
        .withArgs(teamName)
        .returns(teamClient)
      const client = { forTeam }

      const firstDependencyJob = new Job({ ...firstDependencyJobData, client })
      const secondDependencyJob = new Job({
        ...secondDependencyJobData,
        client
      })
      const thirdDependencyJob = new Job({ ...thirdDependencyJobData, client })

      getJob.withArgs(firstDependencyJobName).resolves(firstDependencyJobData)
      getJob.withArgs(secondDependencyJobName).resolves(secondDependencyJobData)
      getJob.withArgs(thirdDependencyJobName).resolves(thirdDependencyJobData)

      const job = new Job({ ...dependentJobData, client })

      const dependencyJobs = await job.getDependencyJobs()

      expect(dependencyJobs)
        .to.eql([firstDependencyJob, secondDependencyJob, thirdDependencyJob])
    })

    it('returns no jobs when no input resources require jobs to have ' +
      'passed', async () => {
      const dependentJobData = data.randomJob({
        inputs: data.randomJobInputs({
          inputs: [
            data.randomInput({
              passed: []
            }),
            data.randomInput({
              passed: []
            })
          ]
        })
      })

      const job = new Job(dependentJobData)

      const dependencyJobs = await job.getDependencyJobs()

      expect(dependencyJobs).to.eql([])
    })
  })

  describe('getDependencyJobsFor', () => {
    it('returns the set of jobs that the specified input resource requires ' +
      'to have passed for this job to be run', async () => {
      const teamName = data.randomTeamName()
      const pipelineName = data.randomPipelineName()

      const firstDependencyJobName = data.randomJobName()
      const secondDependencyJobName = data.randomJobName()
      const thirdDependencyJobName = data.randomJobName()

      const firstResourceName = data.randomResourceName()
      const secondResourceName = data.randomResourceName()

      const firstInputRequiringOtherJobsToHavePassed = data.randomInput({
        resource: firstResourceName,
        passed: [firstDependencyJobName, secondDependencyJobName]
      })
      const secondInputRequiringOtherJobsToHavePassed = data.randomInput({
        resource: secondResourceName,
        passed: [secondDependencyJobName, thirdDependencyJobName]
      })

      const firstDependencyJobData = data.randomJob({
        name: firstDependencyJobName
      })
      const secondDependencyJobData = data.randomJob({
        name: secondDependencyJobName
      })
      const dependentJobData = data.randomJob({
        inputs: data.randomJobInputs({
          inputs: [
            firstInputRequiringOtherJobsToHavePassed,
            secondInputRequiringOtherJobsToHavePassed
          ]
        })
      })

      const getJob = sinon.stub()
      const pipelineClient = { getJob }

      const forPipeline = sinon.stub()
        .withArgs(pipelineName)
        .returns(pipelineClient)
      const teamClient = { forPipeline }

      const forTeam = sinon.stub()
        .withArgs(teamName)
        .returns(teamClient)
      const client = { forTeam }

      const firstDependencyJob = new Job({ ...firstDependencyJobData, client })
      const secondDependencyJob = new Job({
        ...secondDependencyJobData,
        client
      })

      getJob.withArgs(firstDependencyJobName).resolves(firstDependencyJobData)
      getJob.withArgs(secondDependencyJobName).resolves(secondDependencyJobData)

      const job = new Job({ ...dependentJobData, client })

      const dependencyJobs = await job.getDependencyJobsFor(firstResourceName)

      expect(dependencyJobs)
        .to.eql([firstDependencyJob, secondDependencyJob])
    })

    it('returns no jobs when the specified input resource does not require ' +
      'any jobs to have passed for this job to be run', async () => {
      const firstDependencyJobName = data.randomJobName()
      const secondDependencyJobName = data.randomJobName()

      const firstResourceName = data.randomResourceName()
      const secondResourceName = data.randomResourceName()

      const firstInputRequiringOtherJobsToHavePassed = data.randomInput({
        resource: firstResourceName,
        passed: [firstDependencyJobName, secondDependencyJobName]
      })
      const secondInputRequiringOtherJobsToHavePassed = data.randomInput({
        resource: secondResourceName,
        passed: []
      })

      const dependentJobData = data.randomJob({
        inputs: data.randomJobInputs({
          inputs: [
            firstInputRequiringOtherJobsToHavePassed,
            secondInputRequiringOtherJobsToHavePassed
          ]
        })
      })

      const client = {}

      const job = new Job({ ...dependentJobData, client })

      const dependencyJobs = await job.getDependencyJobsFor(secondResourceName)

      expect(dependencyJobs)
        .to.eql([])
    })

    it('throws an exception when the specified input resource does not exist',
      async () => {
        const matchingResourceName = data.randomResourceName()
        const otherResourceName = data.randomResourceName()

        const matchingInput = data.randomInput({
          resource: matchingResourceName,
          passed: []
        })

        const dependentJobData = data.randomJob({
          inputs: data.randomJobInputs({
            inputs: [matchingInput]
          })
        })

        const client = {}

        const job = new Job({ ...dependentJobData, client })

        try {
          await job.getDependencyJobsFor(otherResourceName)
          expect.fail('Expected an exception to be thrown but none was.')
        } catch (e) {
          expect(e.message)
            .to.eql(`No input found for resource name: ${otherResourceName}`)
        }
      })
  })

  describe('hasDependentJobsIn', () => {
    it('returns true when any job in the job set requires the job to ' +
      'have passed', () => {
      const jobName = data.randomJobName()
      const resourceName = data.randomResourceName()

      const dependentJobData = data.randomJob({
        inputs: data.randomJobInputs({
          inputs: [data.randomInput({
            resource: resourceName,
            passed: [jobName]
          })]
        })
      })
      const otherJobData = data.randomJob()
      const thisJobData = data.randomJob({
        name: jobName,
        outputs: data.randomJobOutputs({
          outputs: [data.randomOutput({
            resource: resourceName
          })]
        })
      })

      const dependentJob = new Job(dependentJobData)
      const otherJob = new Job(otherJobData)

      const thisJob = new Job(thisJobData)

      const jobSet = new JobSet([dependentJob, otherJob, thisJob])

      expect(thisJob.hasDependentJobsIn(jobSet)).to.eql(true)
    })

    it('returns false when no job in the job set requires the job to ' +
      'have passed', () => {
      const jobName = data.randomJobName()

      const firstJobData = data.randomJob()
      const secondJobData = data.randomJob()
      const thisJobData = data.randomJob({
        name: jobName
      })

      const dependentJob = new Job(firstJobData)
      const otherJob = new Job(secondJobData)

      const thisJob = new Job(thisJobData)

      const jobSet = new JobSet([dependentJob, otherJob, thisJob])

      expect(thisJob.hasDependentJobsIn(jobSet)).to.eql(false)
    })
  })

  describe('isAutomatic', () => {
    it('returns true if any of the job inputs cause the job to trigger', () => {
      const jobData = data.randomJob({
        inputs: data.randomJobInputs({
          inputs: [
            data.randomInput({
              trigger: true
            }),
            data.randomInput({
              trigger: false
            })
          ]
        })
      })

      const job = new Job(jobData)

      expect(job.isAutomatic()).to.eql(true)
    })

    it('returns true if all of the job inputs cause the job to trigger', () => {
      const jobData = data.randomJob({
        inputs: data.randomJobInputs({
          inputs: [
            data.randomInput({
              trigger: true
            }),
            data.randomInput({
              trigger: true
            })
          ]
        })
      })

      const job = new Job(jobData)

      expect(job.isAutomatic()).to.eql(true)
    })

    it('returns false if none of the job inputs cause the job to trigger', () => {
      const jobData = data.randomJob({
        inputs: data.randomJobInputs({
          inputs: [
            data.randomInput({
              trigger: false
            }),
            data.randomInput({
              trigger: false
            })
          ]
        })
      })

      const job = new Job(jobData)

      expect(job.isAutomatic()).to.eql(false)
    })
  })

  describe('isManual', () => {
    it('returns false if any of the job inputs cause the job to trigger', () => {
      const jobData = data.randomJob({
        inputs: data.randomJobInputs({
          inputs: [
            data.randomInput({
              trigger: true
            }),
            data.randomInput({
              trigger: false
            })
          ]
        })
      })

      const job = new Job(jobData)

      expect(job.isManual()).to.eql(false)
    })

    it('returns false if all of the job inputs cause the job to trigger', () => {
      const jobData = data.randomJob({
        inputs: data.randomJobInputs({
          inputs: [
            data.randomInput({
              trigger: true
            }),
            data.randomInput({
              trigger: true
            })
          ]
        })
      })

      const job = new Job(jobData)

      expect(job.isManual()).to.eql(false)
    })

    it('returns true if none of the job inputs cause the job to trigger', () => {
      const jobData = data.randomJob({
        inputs: data.randomJobInputs({
          inputs: [
            data.randomInput({
              trigger: false
            }),
            data.randomInput({
              trigger: false
            })
          ]
        })
      })

      const job = new Job(jobData)

      expect(job.isManual()).to.eql(true)
    })
  })

  describe('getLatestBuild', () => {
    it('returns the latest build (i.e., first build result) for the job',
      async () => {
        const pipelineName = data.randomPipelineName()
        const teamName = data.randomTeamName()

        const jobData = data.randomJob({
          pipelineName
        })

        const buildData = data.randomBuild({
          pipelineName
        })

        const listBuilds = sinon.stub()
        listBuilds.withArgs({ limit: 1 }).resolves([buildData])
        const pipelineClient = { listBuilds }

        const forPipeline = sinon.stub()
          .withArgs(pipelineName)
          .returns(pipelineClient)
        const teamClient = { forPipeline }

        const forTeam = sinon.stub()
          .withArgs(teamName)
          .returns(teamClient)
        const client = { forTeam }

        const job = new Job({ ...jobData, client })

        const expectedBuild = new Build({ ...buildData, client })

        const actualBuild = await job.getLatestBuild()

        expect(actualBuild).to.eql(expectedBuild)
      })

    it('returns null when the job has no builds', async () => {
      const pipelineName = data.randomPipelineName()
      const teamName = data.randomTeamName()

      const jobData = data.randomJob({
        pipelineName
      })

      const listBuilds = sinon.stub()
      listBuilds.withArgs({ limit: 1 }).resolves([])
      const pipelineClient = { listBuilds }

      const forPipeline = sinon.stub()
        .withArgs(pipelineName)
        .returns(pipelineClient)
      const teamClient = { forPipeline }

      const forTeam = sinon.stub()
        .withArgs(teamName)
        .returns(teamClient)
      const client = { forTeam }

      const job = new Job({ ...jobData, client })

      const actualBuild = await job.getLatestBuild()

      expect(actualBuild).to.eql(null)
    })
  })

  describe('getLatestBuildWithStatus', () => {
    it('returns the first build with the provided status', async () => {
      const pipelineName = data.randomPipelineName()
      const teamName = data.randomTeamName()

      const jobData = data.randomJob({
        pipelineName
      })

      const firstBuildData = data.randomBuild({
        pipelineName,
        status: BuildStatus.pending
      })
      const secondBuildData = data.randomBuild({
        pipelineName,
        status: BuildStatus.succeeded
      })
      const thirdBuildData = data.randomBuild({
        pipelineName,
        status: BuildStatus.failed
      })

      const listBuilds = sinon.stub()
      listBuilds
        .withArgs({ limit: 10 })
        .resolves([firstBuildData, secondBuildData, thirdBuildData])
      const pipelineClient = { listBuilds }

      const forPipeline = sinon.stub()
        .withArgs(pipelineName)
        .returns(pipelineClient)
      const teamClient = { forPipeline }

      const forTeam = sinon.stub()
        .withArgs(teamName)
        .returns(teamClient)
      const client = { forTeam }

      const job = new Job({ ...jobData, client })

      const expectedBuild = new Build({ ...thirdBuildData, client })

      const actualBuild = await job.getLatestBuildWithStatus(BuildStatus.failed)

      expect(actualBuild).to.eql(expectedBuild)
    })

    it('returns the first build with the provided status ' +
      'across pages', async () => {
      const pipelineName = data.randomPipelineName()
      const teamName = data.randomTeamName()

      const jobData = data.randomJob({
        pipelineName
      })

      const firstTenBuildsData = times(() => data.randomBuild({
        status: BuildStatus.succeeded
      }), 10)
      const firstSecondPageBuildData = data.randomBuild({
        status: BuildStatus.succeeded
      })
      const secondSecondPageBuildData = data.randomBuild({
        status: BuildStatus.failed
      })

      const listBuilds = sinon.stub()
      listBuilds
        .withArgs({ limit: 10 }).resolves(firstTenBuildsData)
        .withArgs({ limit: 10, since: firstTenBuildsData[9].id }).resolves(
          [firstSecondPageBuildData, secondSecondPageBuildData])
      const pipelineClient = { listBuilds }

      const forPipeline = sinon.stub()
        .withArgs(pipelineName)
        .returns(pipelineClient)
      const teamClient = { forPipeline }

      const forTeam = sinon.stub()
        .withArgs(teamName)
        .returns(teamClient)
      const client = { forTeam }

      const job = new Job({ ...jobData, client })

      const expectedBuild = new Build({ ...secondSecondPageBuildData, client })

      const actualBuild = await job.getLatestBuildWithStatus(BuildStatus.failed)

      expect(actualBuild).to.eql(expectedBuild)
    })

    it('returns null when the job has no builds', async () => {
      const pipelineName = data.randomPipelineName()
      const teamName = data.randomTeamName()

      const jobData = data.randomJob({
        pipelineName
      })

      const listBuilds = sinon.stub()
      listBuilds.withArgs({ limit: 10 }).resolves([])
      const pipelineClient = { listBuilds }

      const forPipeline = sinon.stub()
        .withArgs(pipelineName)
        .returns(pipelineClient)
      const teamClient = { forPipeline }

      const forTeam = sinon.stub()
        .withArgs(teamName)
        .returns(teamClient)
      const client = { forTeam }

      const job = new Job({ ...jobData, client })

      const actualBuild =
        await job.getLatestBuildWithStatus(BuildStatus.pending)

      expect(actualBuild).to.eql(null)
    })

    it('returns null when the job has no builds with the ' +
      'provided status', async () => {
      const pipelineName = data.randomPipelineName()
      const teamName = data.randomTeamName()

      const jobData = data.randomJob({
        pipelineName
      })

      const firstBuildData = data.randomBuild({
        pipelineName,
        status: BuildStatus.pending
      })
      const secondBuildData = data.randomBuild({
        pipelineName,
        status: BuildStatus.succeeded
      })
      const thirdBuildData = data.randomBuild({
        pipelineName,
        status: BuildStatus.failed
      })

      const listBuilds = sinon.stub()
      listBuilds
        .withArgs({ limit: 10 })
        .resolves([firstBuildData, secondBuildData, thirdBuildData])
      const pipelineClient = { listBuilds }

      const forPipeline = sinon.stub()
        .withArgs(pipelineName)
        .returns(pipelineClient)
      const teamClient = { forPipeline }

      const forTeam = sinon.stub()
        .withArgs(teamName)
        .returns(teamClient)
      const client = { forTeam }

      const job = new Job({ ...jobData, client })

      const actualBuild =
        await job.getLatestBuildWithStatus(BuildStatus.aborted)

      expect(actualBuild).to.eql(null)
    })
  })
})
