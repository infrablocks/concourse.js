import { onConstructionOf } from '../testsupport/dsls/construction'
import TeamPipelineJobClient from '../../src/subclients/TeamPipelineJobClient'
import data from '../testsupport/data'
import axios from 'axios'
import faker from 'faker'
import build from '../testsupport/builders'
import { bearerAuthHeader } from '../../src/support/http/headers'
import { expect } from 'chai'
import MockAdapter from 'axios-mock-adapter'
import { forInstance } from '../testsupport/dsls/methods'

const buildValidTeamPipelineJobClient = () => {
  const apiUrl = data.randomApiUrl()
  const bearerToken = data.randomBearerToken()

  const httpClient = axios.create({
    headers: bearerAuthHeader(bearerToken)
  })
  const mock = new MockAdapter(httpClient)

  const team = build.client.team(data.randomTeam())
  const pipeline = build.client.pipeline(data.randomPipeline())
  const job = build.client.job(data.randomJob())

  const client = new TeamPipelineJobClient({
    apiUrl, httpClient, team, pipeline, job
  })

  return {
    client,
    httpClient,
    mock,
    apiUrl,
    bearerToken,
    team,
    pipeline,
    job
  }
}

describe('TeamPipelineJobClient', () => {
  describe('construction', () => {
    it('throws an exception if the API URI is not provided', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          team: data.randomTeam(),
          pipeline: data.randomPipeline(),
          job: data.randomJob(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" is required].')
    })

    it('throws an exception if the API URI is not a string', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          apiUrl: 25,
          team: data.randomTeam(),
          pipeline: data.randomPipeline(),
          job: data.randomJob(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a string].')
    })

    it('throws an exception if the API URI is not a valid URI', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          apiUrl: 'spinach',
          team: data.randomTeam(),
          pipeline: data.randomPipeline(),
          job: data.randomJob(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a valid uri].')
    })

    it('throws an exception if the provided HTTP client is not an object',
      () => {
        onConstructionOf(TeamPipelineJobClient)
          .withArguments({
            httpClient: 35,
            team: data.randomTeam(),
            pipeline: data.randomPipeline(),
            job: data.randomJob(),
            apiUrl: faker.internet.url()
          })
          .throwsError(
            'Invalid parameter(s): ["httpClient" must be a Function].')
      })

    it('throws an exception if the team is not provided', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          pipeline: data.randomPipeline(),
          job: data.randomJob()
        })
        .throwsError('Invalid parameter(s): ["team" is required].')
    })

    it('throws an exception if the team is not an object', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          team: 'wat',
          apiUrl: faker.internet.url(),
          httpClient: axios,
          pipeline: data.randomPipeline(),
          job: data.randomJob()
        })
        .throwsError('Invalid parameter(s): ["team" must be an object].')
    })

    it('throws an exception if the pipeline is not provided', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam(),
          job: data.randomJob()
        })
        .throwsError('Invalid parameter(s): ["pipeline" is required].')
    })

    it('throws an exception if the pipeline is not an object', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          pipeline: 'wat',
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam(),
          job: data.randomJob()
        })
        .throwsError('Invalid parameter(s): ["pipeline" must be an object].')
    })

    it('throws an exception if the job is not provided', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam(),
          pipeline: data.randomPipeline()
        })
        .throwsError('Invalid parameter(s): ["job" is required].')
    })

    it('throws an exception if the pipeline is not an object', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          job: 'wat',
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam(),
          pipeline: data.randomPipeline()
        })
        .throwsError('Invalid parameter(s): ["job" must be an object].')
    })
  })

  describe('pause', () => {
    it('pauses the pipeline',
      async () => {
        const { client, mock, apiUrl, bearerToken, team, pipeline, job } =
          buildValidTeamPipelineJobClient()

        const teamName = team.name
        const pipelineName = pipeline.name
        const jobName = job.name

        mock.onPut(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
          `/jobs/${jobName}/pause`)
          .reply(200)

        await client.pause()
        expect(mock.history.put).to.have.length(1)

        const call = mock.history.put[0]
        expect(call.url)
          .to.eql(
            `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
            `/jobs/${jobName}/pause`)
        expect(call.headers)
          .to.include(bearerAuthHeader(bearerToken))
      })

    it('throws the underlying http client exception on failure',
      async () => {
        const { client, mock, apiUrl, team, pipeline, job } =
          buildValidTeamPipelineJobClient()

        const teamName = team.name
        const pipelineName = pipeline.name
        const jobName = job.name

        mock.onPut(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/` +
          `jobs/${jobName}/pause`)
          .networkError()

        try {
          await client.pause()
        } catch (e) {
          expect(e).to.be.instanceOf(Error)
          expect(e.message).to.eql('Network Error')
        }
      })
  })

  describe('unpause', () => {
    it('unpauses the pipeline',
      async () => {
        const { client, mock, apiUrl, bearerToken, team, pipeline, job } =
          buildValidTeamPipelineJobClient()

        const teamName = team.name
        const pipelineName = pipeline.name
        const jobName = job.name

        mock.onPut(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/` +
          `jobs/${jobName}/unpause`)
          .reply(200)

        await client.unpause()
        expect(mock.history.put).to.have.length(1)

        const call = mock.history.put[0]
        expect(call.url)
          .to.eql(
            `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/` +
            `jobs/${jobName}/unpause`)
        expect(call.headers)
          .to.include(bearerAuthHeader(bearerToken))
      })

    it('throws the underlying http client exception on failure',
      async () => {
        const { client, mock, apiUrl, team, pipeline, job } =
          buildValidTeamPipelineJobClient()

        const teamName = team.name
        const pipelineName = pipeline.name
        const jobName = job.name

        mock.onPut(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
          `/jobs/${jobName}/unpause`)
          .networkError()

        try {
          await client.unpause()
        } catch (e) {
          expect(e).to.be.instanceOf(Error)
          expect(e.message).to.eql('Network Error')
        }
      })
  })

  describe('listBuilds', () => {
    it('gets all builds for team pipeline job',
      async () => {
        const { client, mock, apiUrl, bearerToken, team, pipeline, job } =
          buildValidTeamPipelineJobClient()

        const teamName = team.name
        const pipelineName = pipeline.name
        const jobName = job.name
        const buildData = data.randomBuild({ teamName, pipelineName, jobName })

        const buildFromApi = build.api.build(buildData)
        const buildsFromApi = [buildFromApi]

        const convertedBuild = build.client.build(buildData)
        const expectedBuilds = [convertedBuild]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
          `/jobs/${jobName}/builds`,
          {
            headers: {
              ...bearerAuthHeader(bearerToken)
            }
          })
          .reply(200, buildsFromApi)

        const actualBuilds = await client.listBuilds()

        expect(actualBuilds).to.eql(expectedBuilds)
      })
  })

  describe('getBuild', () => {
    it('throws an exception if the build name is not provided',
      async () => {
        const { client } = buildValidTeamPipelineJobClient()
        await forInstance(client)
          .onCallOf('getBuild')
          .withNoArguments()
          .throwsError('Invalid parameter(s): ["buildName" is required].')
      })

    it('throws an exception if the build name is not a string',
      async () => {
        const { client } = buildValidTeamPipelineJobClient()
        await forInstance(client)
          .onCallOf('getBuild')
          .withArguments(12345)
          .throwsError(
            'Invalid parameter(s): ["buildName" must be a string].')
      })

    it('gets the build with the specified name',
      async () => {
        const { client, mock, apiUrl, bearerToken, team, pipeline, job } =
          buildValidTeamPipelineJobClient()

        const teamName = team.name
        const pipelineName = pipeline.name
        const jobName = job.name

        const buildName = data.randomBuildName()
        const buildData = data.randomBuild({
          teamName,
          pipelineName,
          jobName,
          name: buildName
        })

        const buildFromApi = build.api.build(buildData)

        const expectedBuild = build.client.build(buildData)

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
          `/jobs/${jobName}/builds/${buildName}`,
          {
            headers: {
              ...bearerAuthHeader(bearerToken)
            }
          })
          .reply(200, buildFromApi)

        const actualBuild = await client.getBuild(buildName)

        expect(actualBuild).to.eql(expectedBuild)
      })
  })

  describe('listInputs', () => {
    it('gets all inputs for team pipeline job',
      async () => {
        const { client, mock, apiUrl, bearerToken, team, pipeline, job } =
          buildValidTeamPipelineJobClient()

        const inputData = data.randomInput()

        const inputFromApi = build.api.input(inputData)
        const inputsFromApi = [inputFromApi]

        const convertedInput = build.client.input(inputData)
        const expectedInputs = [convertedInput]

        mock.onGet(
          `${apiUrl}/teams/${team.name}/pipelines/${pipeline.name}` +
          `/jobs/${job.name}/inputs`,
          {
            headers: {
              ...bearerAuthHeader(bearerToken)
            }
          })
          .reply(200, inputsFromApi)

        const actualInputs = await client.listInputs()

        expect(actualInputs).to.eql(expectedInputs)
      })
  })
})
