import 'core-js/stable'
import 'regenerator-runtime/runtime'
import sinon from 'sinon'
import { expect } from 'chai'
import data from '../testsupport/data'
import Build from '../../src/model/Build'

describe('Build', () => {
  it('exposes its attributes', async () => {
    const teamName = data.randomTeamName()
    const pipelineName = data.randomPipelineName()
    const jobName = data.randomJobName()
    const buildName = data.randomBuildName()

    const buildData = data.randomBuild({
      name: buildName
    })

    const getBuild = sinon.stub()
      .withArgs(buildName)
      .resolves(buildData)
    const jobClient = { getBuild }

    const forJob = sinon.stub()
      .withArgs(jobName)
      .returns(jobClient)
    const pipelineClient = { forJob }

    const forPipeline = sinon.stub()
      .withArgs(pipelineName)
      .returns(pipelineClient)
    const teamClient = { forPipeline }

    const forTeam = sinon.stub()
      .withArgs(teamName)
      .returns(teamClient)
    const client = { forTeam }

    const pipeline = await Build.load({
      teamName, pipelineName, jobName, buildName, client
    })

    expect(pipeline.getId()).to.eql(buildData.id)
    expect(pipeline.getName()).to.eql(buildName)
    expect(pipeline.getTeamName()).to.eql(buildData.teamName)
  })
})
