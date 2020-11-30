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

  const teamName = data.randomTeamName()
  const pipelineName = data.randomPipelineName()
  const jobName = data.randomJobName()

  const client = new TeamPipelineJobClient({
    apiUrl, httpClient, teamName, pipelineName, jobName
  })

  return {
    client,
    httpClient,
    mock,
    apiUrl,
    bearerToken,
    teamName,
    pipelineName,
    jobName
  }
}

describe('TeamPipelineJobClient', () => {
  describe('construction', () => {
    it('throws an exception if the API URI is not provided', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName(),
          jobName: data.randomJobName(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" is required].')
    })

    it('throws an exception if the API URI is not a string', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          apiUrl: 25,
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName(),
          jobName: data.randomJobName(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a string].')
    })

    it('throws an exception if the API URI is not a valid URI', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          apiUrl: 'spinach',
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName(),
          jobName: data.randomJobName(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a valid uri].')
    })

    it('throws an exception if the provided HTTP client is not an object',
      () => {
        onConstructionOf(TeamPipelineJobClient)
          .withArguments({
            httpClient: 35,
            teamName: data.randomTeamName(),
            pipelineName: data.randomPipelineName(),
            jobName: data.randomJobName(),
            apiUrl: faker.internet.url()
          })
          .throwsError(
            'Invalid parameter(s): ["httpClient" must be a Function].')
      })

    it('throws an exception if the team name is not provided', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          pipelineName: data.randomPipelineName(),
          jobName: data.randomJobName()
        })
        .throwsError('Invalid parameter(s): ["teamName" is required].')
    })

    it('throws an exception if the team name is not a string', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          teamName: 123,
          apiUrl: faker.internet.url(),
          httpClient: axios,
          pipelineName: data.randomPipelineName(),
          jobName: data.randomJobName()
        })
        .throwsError('Invalid parameter(s): ["teamName" must be a string].')
    })

    it('throws an exception if the pipeline name is not provided', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          teamName: data.randomTeamName(),
          jobName: data.randomJobName()
        })
        .throwsError('Invalid parameter(s): ["pipelineName" is required].')
    })

    it('throws an exception if the pipeline name is not a string', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          pipelineName: 123,
          apiUrl: faker.internet.url(),
          httpClient: axios,
          teamName: data.randomTeamName(),
          jobName: data.randomJobName()
        })
        .throwsError('Invalid parameter(s): ["pipelineName" must be a string].')
    })

    it('throws an exception if the job name is not provided', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName()
        })
        .throwsError('Invalid parameter(s): ["jobName" is required].')
    })

    it('throws an exception if the job name is not an string', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          jobName: 123,
          apiUrl: faker.internet.url(),
          httpClient: axios,
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName()
        })
        .throwsError('Invalid parameter(s): ["jobName" must be a string].')
    })
  })

  describe('pause', () => {
    it('pauses the job',
      async () => {
        const {
          client, mock, apiUrl, bearerToken, teamName, pipelineName, jobName
        } = buildValidTeamPipelineJobClient()

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
        const { client, mock, apiUrl, teamName, pipelineName, jobName } =
          buildValidTeamPipelineJobClient()

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
    it('unpauses the job',
      async () => {
        const { client, mock, apiUrl, bearerToken, teamName, pipelineName, jobName } =
          buildValidTeamPipelineJobClient()

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
        const { client, mock, apiUrl, teamName, pipelineName, jobName } =
          buildValidTeamPipelineJobClient()

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
        const {
          client, mock, apiUrl, bearerToken, teamName, pipelineName, jobName
        } = buildValidTeamPipelineJobClient()

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
        const {
          client, mock, apiUrl, bearerToken, teamName, pipelineName, jobName
        } = buildValidTeamPipelineJobClient()

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

  describe('createJobBuild', () => {
    it('create a build for team pipeline job',
      async () => {
        const {
          client, mock, apiUrl, bearerToken, teamName, pipelineName, jobName
        } = buildValidTeamPipelineJobClient()
        const createBuildUrl = `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
          `/jobs/${jobName}/builds`
        const buildName = data.randomBuildName()
        const buildData = data.randomBuild({
          teamName,
          pipelineName,
          jobName,
          name: buildName
        })
        const buildFromApi = build.api.build(buildData)
        const expectedBuild = build.client.build(buildData)
        mock.onPost(createBuildUrl)
          .reply(200, buildFromApi)

        const actualBuild = await client.createJobBuild()

        expect(mock.history.post).to.have.length(1)
        const call = mock.history.post[0]
        expect(call.url).to.eql(createBuildUrl)
        expect(call.headers).to.include(bearerAuthHeader(bearerToken))
        expect(actualBuild).to.eql(expectedBuild)
      })
  })

  describe('listInputs', () => {
    it('gets all inputs for team pipeline job',
      async () => {
        const {
          client, mock, apiUrl, bearerToken, teamName, pipelineName, jobName
        } = buildValidTeamPipelineJobClient()

        const inputData = data.randomInput()

        const inputFromApi = build.api.input(inputData)
        const inputsFromApi = [inputFromApi]

        const convertedInput = build.client.input(inputData)
        const expectedInputs = [convertedInput]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
          `/jobs/${jobName}/inputs`,
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
