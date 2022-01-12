import sinon from 'sinon'
import { expect } from 'chai'

import data from '../testsupport/data.js'
import Pipeline from '../../src/model/Pipeline.js'
import Job from '../../src/model/Job.js'

describe('Pipeline', () => {
  it('exposes its attributes', async () => {
    const teamName = data.randomTeamName()

    const pipelineName = data.randomPipelineName()
    const pipelineData = data.randomPipeline({ name: pipelineName })

    const getPipeline = sinon.stub()
      .withArgs(pipelineName)
      .resolves(pipelineData)
    const teamClient = { getPipeline }

    const forTeam = sinon.stub()
      .withArgs(teamName)
      .returns(teamClient)
    const client = { forTeam }

    const pipeline = await Pipeline.load({ teamName, pipelineName, client })

    expect(pipeline.getName()).to.eql(pipelineName)
    expect(pipeline.getId()).to.eql(pipelineData.id)
    expect(pipeline.getTeamName()).to.eql(pipelineData.teamName)
    expect(pipeline.isPaused()).to.eql(pipelineData.paused)
    expect(pipeline.isPublic()).to.eql(pipelineData.public)
  })

  it('knows all start point jobs in the pipeline', async () => {
    const teamName = data.randomTeamName()

    const pipelineName = data.randomPipelineName()
    const pipelineData = data.randomPipeline({ name: pipelineName })

    const resourceName = data.randomResourceName()

    const firstJobName = data.randomJobName()
    const firstJobData = data.randomIndependentJobFor({
      jobName: firstJobName,
      pipelineName,
      resourceName
    })

    const secondJobName = data.randomJobName()
    const secondJobData = data.randomDependentJobFor({
      jobName: secondJobName,
      dependencyJobName: firstJobName,
      pipelineName,
      resourceName
    })

    const thirdJobName = data.randomJobName()
    const thirdJobData = data.randomDependentJobFor({
      jobName: thirdJobName,
      dependencyJobName: secondJobName,
      pipelineName,
      resourceName
    })

    const listJobs = sinon.stub()
      .resolves([firstJobData, secondJobData, thirdJobData])
    const pipelineClient = { listJobs }

    const getPipeline = sinon.stub()
      .resolves(pipelineData)
    const forPipeline = sinon.stub()
      .withArgs(pipelineName)
      .returns(pipelineClient)
    const teamClient = { getPipeline, forPipeline }

    const forTeam = sinon.stub()
      .withArgs(teamName)
      .returns(teamClient)
    const client = { forTeam }

    const pipeline = await Pipeline.load({ pipelineName, client })

    const actualStartPointJobs = await pipeline.getStartPointJobs()

    const expectedStartPointJob = new Job({ ...firstJobData, client })

    expect(actualStartPointJobs).to.eql([expectedStartPointJob])
  })

  it('knows all end point jobs in the pipeline', async () => {
    const teamName = data.randomTeamName()

    const pipelineName = data.randomPipelineName()
    const pipelineData = data.randomPipeline({ name: pipelineName })

    const resourceName = data.randomResourceName()

    const firstJobName = data.randomJobName()
    const firstJobData = data.randomIndependentJobFor({
      jobName: firstJobName,
      pipelineName,
      resourceName
    })

    const secondJobName = data.randomJobName()
    const secondJobData = data.randomDependentJobFor({
      jobName: secondJobName,
      dependencyJobName: firstJobName,
      pipelineName,
      resourceName
    })

    const thirdJobName = data.randomJobName()
    const thirdJobData = data.randomDependentJobFor({
      jobName: thirdJobName,
      dependencyJobName: secondJobName,
      pipelineName,
      resourceName
    })

    const listJobs = sinon.stub()
      .resolves([firstJobData, secondJobData, thirdJobData])
    const pipelineClient = { listJobs }

    const getPipeline = sinon.stub()
      .resolves(pipelineData)
    const forPipeline = sinon.stub()
      .withArgs(pipelineName)
      .returns(pipelineClient)
    const teamClient = { getPipeline, forPipeline }

    const forTeam = sinon.stub()
      .withArgs(teamName)
      .returns(teamClient)
    const client = { forTeam }

    const pipeline = await Pipeline.load({ pipelineName, client })

    const actualEndPointJobs = await pipeline.getEndPointJobs()

    const expectedEndPointJob = new Job({ ...thirdJobData, client })

    expect(actualEndPointJobs).to.eql([expectedEndPointJob])
  })

  it('knows all mid point jobs in the pipeline', async () => {
    const teamName = data.randomTeamName()

    const pipelineName = data.randomPipelineName()
    const pipelineData = data.randomPipeline({ name: pipelineName })

    const resourceName = data.randomResourceName()

    const firstJobName = data.randomJobName()
    const firstJobData = data.randomIndependentJobFor({
      jobName: firstJobName,
      pipelineName,
      resourceName
    })

    const secondJobName = data.randomJobName()
    const secondJobData = data.randomDependentJobFor({
      jobName: secondJobName,
      dependencyJobName: firstJobName,
      pipelineName,
      resourceName
    })

    const thirdJobName = data.randomJobName()
    const thirdJobData = data.randomDependentJobFor({
      jobName: thirdJobName,
      dependencyJobName: secondJobName,
      pipelineName,
      resourceName
    })

    const listJobs = sinon.stub()
      .resolves([firstJobData, secondJobData, thirdJobData])
    const pipelineClient = { listJobs }

    const getPipeline = sinon.stub()
      .resolves(pipelineData)
    const forPipeline = sinon.stub()
      .withArgs(pipelineName)
      .returns(pipelineClient)
    const teamClient = { getPipeline, forPipeline }

    const forTeam = sinon.stub()
      .withArgs(teamName)
      .returns(teamClient)
    const client = { forTeam }

    const pipeline = await Pipeline.load({ pipelineName, client })

    const actualMidPointJobs = await pipeline.getMidPointJobs()

    const expectedMidPointJob = new Job({ ...secondJobData, client })

    expect(actualMidPointJobs).to.eql([expectedMidPointJob])
  })

  it('knows all automatic jobs in the pipeline', async () => {
    const teamName = data.randomTeamName()

    const pipelineName = data.randomPipelineName()
    const pipelineData = data.randomPipeline({ name: pipelineName })

    const resourceName = data.randomResourceName()

    const firstJobName = data.randomJobName()
    const firstJobData = data.randomIndependentJobFor({
      jobName: firstJobName,
      pipelineName,
      resourceName,
      automatic: true
    })

    const secondJobName = data.randomJobName()
    const secondJobData = data.randomDependentJobFor({
      jobName: secondJobName,
      dependencyJobName: firstJobName,
      pipelineName,
      resourceName,
      automatic: true
    })

    const thirdJobName = data.randomJobName()
    const thirdJobData = data.randomDependentJobFor({
      jobName: thirdJobName,
      dependencyJobName: secondJobName,
      pipelineName,
      resourceName,
      automatic: false
    })

    const listJobs = sinon.stub()
      .resolves([firstJobData, secondJobData, thirdJobData])
    const pipelineClient = { listJobs }

    const getPipeline = sinon.stub()
      .resolves(pipelineData)
    const forPipeline = sinon.stub()
      .withArgs(pipelineName)
      .returns(pipelineClient)
    const teamClient = { getPipeline, forPipeline }

    const forTeam = sinon.stub()
      .withArgs(teamName)
      .returns(teamClient)
    const client = { forTeam }

    const pipeline = await Pipeline.load({ pipelineName, client })

    const actualAutomaticJobs = await pipeline.getAutomaticJobs()

    const firstAutomaticJob = new Job({ ...firstJobData, client })
    const secondAutomaticJob = new Job({ ...secondJobData, client })
    const expectedAutomaticJobs = [firstAutomaticJob, secondAutomaticJob]

    expect(actualAutomaticJobs).to.eql(expectedAutomaticJobs)
  })

  it('knows all manual jobs in the pipeline', async () => {
    const teamName = data.randomTeamName()

    const pipelineName = data.randomPipelineName()
    const pipelineData = data.randomPipeline({ name: pipelineName })

    const resourceName = data.randomResourceName()

    const firstJobName = data.randomJobName()
    const firstJobData = data.randomIndependentJobFor({
      jobName: firstJobName,
      pipelineName,
      resourceName,
      automatic: true
    })

    const secondJobName = data.randomJobName()
    const secondJobData = data.randomDependentJobFor({
      jobName: secondJobName,
      dependencyJobName: firstJobName,
      pipelineName,
      resourceName,
      automatic: false
    })

    const thirdJobName = data.randomJobName()
    const thirdJobData = data.randomDependentJobFor({
      jobName: thirdJobName,
      dependencyJobName: secondJobName,
      pipelineName,
      resourceName,
      automatic: false
    })

    const listJobs = sinon.stub()
      .resolves([firstJobData, secondJobData, thirdJobData])
    const pipelineClient = { listJobs }

    const getPipeline = sinon.stub()
      .resolves(pipelineData)
    const forPipeline = sinon.stub()
      .withArgs(pipelineName)
      .returns(pipelineClient)
    const teamClient = { getPipeline, forPipeline }

    const forTeam = sinon.stub()
      .withArgs(teamName)
      .returns(teamClient)
    const client = { forTeam }

    const pipeline = await Pipeline.load({ pipelineName, client })

    const actualManualJobs = await pipeline.getManualJobs()

    const secondManualJob = new Job({ ...secondJobData, client })
    const thirdManualJob = new Job({ ...thirdJobData, client })
    const expectedManualJobs = [secondManualJob, thirdManualJob]

    expect(actualManualJobs).to.eql(expectedManualJobs)
  })
})
