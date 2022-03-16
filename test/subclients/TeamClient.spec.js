import { expect } from 'chai'
import { faker } from '@faker-js/faker'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import build from '../testsupport/builders.js'
import data from '../testsupport/data.js'
import { onConstructionOf } from '../testsupport/dsls/construction.js'
import { forInstance } from '../testsupport/dsls/methods.js'

import TeamClient from '../../src/subclients/TeamClient.js'
import { bearerAuthorizationHeader } from '../../src/support/http/headers.js'

const buildValidTeamClient = () => {
  const apiUrl = data.randomApiUrl()
  const bearerToken = data.randomBearerTokenCurrent()

  const httpClient = axios.create({
    headers: bearerAuthorizationHeader(bearerToken)
  })
  const mock = new MockAdapter(httpClient)

  const teamName = data.randomTeamName()

  const client = new TeamClient({ apiUrl, httpClient, teamName })

  return {
    client,
    httpClient,
    mock,
    apiUrl,
    bearerToken,
    teamName
  }
}

describe('TeamClient', () => {
  describe('construction', () => {
    it('throws an exception if the API URI is not provided', () => {
      onConstructionOf(TeamClient)
        .withArguments({
          team: data.randomTeam(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" is required].')
    })

    it('throws an exception if the API URI is not a string', () => {
      onConstructionOf(TeamClient)
        .withArguments({
          apiUrl: 25,
          team: data.randomTeam(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a string].')
    })

    it('throws an exception if the API URI is not a valid URI', () => {
      onConstructionOf(TeamClient)
        .withArguments({
          apiUrl: 'spinach',
          team: data.randomTeam(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a valid uri].')
    })

    it('throws an exception if the provided HTTP client is not an object',
      () => {
        onConstructionOf(TeamClient)
          .withArguments({
            team: data.randomTeam(),
            apiUrl: faker.internet.url(),
            httpClient: 35
          })
          .throwsError(
            'Invalid parameter(s): ["httpClient" must be of type function].')
      })

    it('throws an exception if the team name is not provided', () => {
      onConstructionOf(TeamClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["teamName" is required].')
    })

    it('throws an exception if the team name is not a string', () => {
      onConstructionOf(TeamClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          teamName: 123
        })
        .throwsError('Invalid parameter(s): ["teamName" must be a string].')
    })
  })

  describe('rename', () => {
    it('renames the team', async () => {
      const { client, mock, apiUrl, bearerToken, teamName } =
        buildValidTeamClient()

      const originalTeamName = teamName
      const newTeamName = data.randomTeamName()

      mock.onPut(
        `${apiUrl}/teams/${originalTeamName}/rename`,
        {
          name: newTeamName
        })
        .reply(204)

      await client.rename(newTeamName)
      expect(mock.history.put).to.have.length(1)

      const call = mock.history.put[0]
      expect(call.url)
        .to.eql(`${apiUrl}/teams/${originalTeamName}/rename`)
      expect(call.data).to.eql(`{"name":"${newTeamName}"}`)
      expect(call.headers)
        .to.include(bearerAuthorizationHeader(bearerToken))
    })

    it('throws the underlying http client exception on failure',
      async () => {
        const { client, mock, apiUrl, teamName } =
          buildValidTeamClient()

        const newTeamName = data.randomTeamName()

        mock.onPut(
          `${apiUrl}/teams/${teamName}/rename`,
          {
            name: newTeamName
          })
          .networkError()

        try {
          await client.rename(newTeamName)
        } catch (e) {
          expect(e).to.be.instanceOf(Error)
          expect(e.message).to.eql('Network Error')
        }
      })

    it('throws an exception if the new team name is not a string',
      async () => {
        const { client } = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('rename')
          .withArguments(12345)
          .throwsError(
            'Invalid parameter(s): ["newTeamName" must be a string].')
      })

    it('throws an exception if the new team name is not provided',
      async () => {
        const { client } = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('rename')
          .withArguments()
          .throwsError(
            'Invalid parameter(s): ["newTeamName" is required].')
      })
  })

  describe('destroy', () => {
    it('destroys the team', async () => {
      const { client, mock, apiUrl, bearerToken, teamName } =
        buildValidTeamClient()

      mock.onDelete(
        `${apiUrl}/teams/${teamName}`)
        .reply(204)

      await client.destroy()
      expect(mock.history.delete).to.have.length(1)

      const call = mock.history.delete[0]
      expect(call.url)
        .to.eql(`${apiUrl}/teams/${teamName}`)
      expect(call.headers)
        .to.include(bearerAuthorizationHeader(bearerToken))
    })

    it('throws the underlying http client exception on failure',
      async () => {
        const { client, mock, apiUrl, teamName } =
          buildValidTeamClient()

        mock.onDelete(
          `${apiUrl}/teams/${teamName}`)
          .networkError()

        try {
          await client.destroy()
        } catch (e) {
          expect(e).to.be.instanceOf(Error)
          expect(e.message).to.eql('Network Error')
        }
      })
  })

  describe('listBuilds', () => {
    it('gets all builds for team',
      async () => {
        const { client, mock, apiUrl, bearerToken, teamName } =
          buildValidTeamClient()

        const buildData = data.randomBuild({ teamName })

        const buildFromApi = build.api.build(buildData)
        const buildsFromApi = [buildFromApi]

        const convertedBuild = build.client.build(buildData)
        const expectedBuilds = [convertedBuild]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/builds`,
          {
            headers: {
              ...bearerAuthorizationHeader(bearerToken)
            }
          })
          .reply(200, buildsFromApi)

        const actualBuilds = await client.listBuilds()

        expect(actualBuilds).to.eql(expectedBuilds)
      })

    it('uses provided page options when supplied',
      async () => {
        const { client, mock, apiUrl, bearerToken, teamName } =
          buildValidTeamClient()

        const buildData = data.randomBuild({ teamName })

        const buildFromApi = build.api.build(buildData)
        const buildsFromApi = [buildFromApi]

        const convertedBuild = build.client.build(buildData)
        const expectedBuilds = [convertedBuild]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/builds`,
          {
            headers: {
              ...bearerAuthorizationHeader(bearerToken)
            },
            params: {
              limit: 20,
              since: 123,
              until: 456
            }
          })
          .reply(200, buildsFromApi)

        const actualBuilds = await client.listBuilds({
          limit: 20,
          since: 123,
          until: 456
        })

        expect(actualBuilds).to.eql(expectedBuilds)
      })

    it('throws an exception if the value provided for limit is not a number',
      async () => {
        const { client } = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({ limit: 'badger' })
          .throwsError('Invalid parameter(s): ["limit" must be a number].')
      })

    it('throws an exception if the value provided for limit is not an integer',
      async () => {
        const { client } = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({ limit: 32.654 })
          .throwsError('Invalid parameter(s): ["limit" must be an integer].')
      })

    it('throws an exception if the value provided for limit is less than 1',
      async () => {
        const { client } = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({ limit: -20 })
          .throwsError(
            'Invalid parameter(s): [' +
            '"limit" must be greater than or equal to 1].')
      })

    it('throws an exception if the value provided for since is not a number',
      async () => {
        const { client } = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({ since: 'badger' })
          .throwsError('Invalid parameter(s): ["since" must be a number].')
      })

    it('throws an exception if the value provided for since is not an integer',
      async () => {
        const { client } = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({ since: 32.654 })
          .throwsError('Invalid parameter(s): ["since" must be an integer].')
      })

    it('throws an exception if the value provided for since is less than 1',
      async () => {
        const { client } = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({ since: -20 })
          .throwsError(
            'Invalid parameter(s): [' +
            '"since" must be greater than or equal to 1].')
      })

    it('throws an exception if the value provided for until is not a number',
      async () => {
        const { client } = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({ until: 'badger' })
          .throwsError('Invalid parameter(s): ["until" must be a number].')
      })

    it('throws an exception if the value provided for until is not an integer',
      async () => {
        const { client } = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({ until: 32.654 })
          .throwsError('Invalid parameter(s): ["until" must be an integer].')
      })

    it('throws an exception if the value provided for until is less than 1',
      async () => {
        const { client } = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({ until: -20 })
          .throwsError(
            'Invalid parameter(s): [' +
            '"until" must be greater than or equal to 1].')
      })
  })

  describe('listContainers', () => {
    it('gets all containers for team',
      async () => {
        const { client, mock, apiUrl, bearerToken, teamName } =
          buildValidTeamClient()

        const type = 'get'
        const pipelineName = data.randomPipelineName()
        const resourceName = data.randomResourceName()

        const containerData = data.randomContainer({
          teamName,
          pipelineName
        })

        const containerFromApi = build.api.container(containerData)
        const containersFromApi = [containerFromApi]

        const convertedContainer = build.client.container(containerData)
        const expectedContainers = [convertedContainer]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/containers`,
          {
            headers: {
              ...bearerAuthorizationHeader(bearerToken)
            },
            params: {
              type,
              pipeline_name: pipelineName,
              resource_name: resourceName
            }
          })
          .reply(200, containersFromApi)

        const actualContainers = await client.listContainers({
          type,
          pipelineName,
          resourceName
        })

        expect(actualContainers).to.eql(expectedContainers)
      })

    it('throws an exception if the value provided for type is not a string',
      async () => {
        const { client } = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listContainers')
          .withArguments({ type: 123 })
          .throwsError(
            'Invalid parameter(s): ["type" must be a string].')
      })

    it('throws an exception if the value provided for pipeline name is ' +
      'not a string', async () => {
      const { client } = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({ pipelineName: 123 })
        .throwsError(
          'Invalid parameter(s): ["pipelineName" must be a string].')
    })

    it('throws an exception if the value provided for pipeline ID is ' +
      'not a number', async () => {
      const { client } = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({ pipelineId: 'spinach' })
        .throwsError(
          'Invalid parameter(s): ["pipelineId" must be a number].')
    })

    it('throws an exception if the value provided for pipeline ID is ' +
      'not a integer', async () => {
      const { client } = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({ pipelineId: 23.6 })
        .throwsError(
          'Invalid parameter(s): ["pipelineId" must be an integer].')
    })

    it('throws an exception if the value provided for job ID is ' +
      'not a number', async () => {
      const { client } = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({ jobId: 'spinach' })
        .throwsError(
          'Invalid parameter(s): ["jobId" must be a number].')
    })

    it('throws an exception if the value provided for job ID is ' +
      'not a integer', async () => {
      const { client } = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({ jobId: 23.6 })
        .throwsError(
          'Invalid parameter(s): ["jobId" must be an integer].')
    })

    it('throws an exception if the value provided for job name is ' +
      'not a string', async () => {
      const { client } = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({ jobName: 123 })
        .throwsError(
          'Invalid parameter(s): ["jobName" must be a string].')
    })

    it('throws an exception if the value provided for step name is ' +
      'not a string', async () => {
      const { client } = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({ stepName: 123 })
        .throwsError(
          'Invalid parameter(s): ["stepName" must be a string].')
    })

    it('throws an exception if the value provided for resource name is ' +
      'not a string', async () => {
      const { client } = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({ resourceName: 123 })
        .throwsError(
          'Invalid parameter(s): ["resourceName" must be a string].')
    })

    it('throws an exception if the value provided for attempt is ' +
      'not a string', async () => {
      const { client } = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({ attempt: 123 })
        .throwsError(
          'Invalid parameter(s): ["attempt" must be a string].')
    })

    it('throws an exception if the value provided for build ID is ' +
      'not a number', async () => {
      const { client } = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({ buildId: 'spinach' })
        .throwsError(
          'Invalid parameter(s): ["buildId" must be a number].')
    })

    it('throws an exception if the value provided for build ID is ' +
      'not a integer', async () => {
      const { client } = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({ buildId: 23.6 })
        .throwsError(
          'Invalid parameter(s): ["buildId" must be an integer].')
    })

    it('throws an exception if the value provided for build name is ' +
      'not a string', async () => {
      const { client } = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({ buildName: 123 })
        .throwsError(
          'Invalid parameter(s): ["buildName" must be a string].')
    })

    it('throws an exception if type is check and pipeline name is ' +
      'not provided', async () => {
      const { client } = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({ type: 'check', resourceName: 'resource' })
        .throwsError(
          'Invalid parameter(s): ["pipelineName" is required].')
    })

    it('throws an exception if type is check and resource name is ' +
      'not provided', async () => {
      const { client } = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({ type: 'check', pipelineName: 'pipeline' })
        .throwsError(
          'Invalid parameter(s): ["resourceName" is required].')
    })
  })

  describe('listVolumes', () => {
    it('gets all volumes for team',
      async () => {
        const { client, mock, apiUrl, bearerToken, teamName } =
          buildValidTeamClient()

        const volumeData = data.randomVolume()

        const volumeFromApi = build.api.volume(volumeData)
        const volumesFromApi = [volumeFromApi]

        const convertedVolume = build.client.volume(volumeData)
        const expectedVolumes = [convertedVolume]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/volumes`,
          {
            headers: {
              ...bearerAuthorizationHeader(bearerToken)
            }
          })
          .reply(200, volumesFromApi)

        const actualVolumes = await client.listVolumes()

        expect(actualVolumes).to.eql(expectedVolumes)
      })
  })

  describe('getContainer', () => {
    it('gets the container with the specified ID', async () => {
      const { client, mock, apiUrl, bearerToken, teamName } =
        buildValidTeamClient()

      const containerId = data.randomContainerId()
      const containerData = data.randomContainer({
        id: containerId
      })

      const containerFromApi = build.api.container(containerData)

      const expectedContainer = build.client.container(containerData)

      mock.onGet(
        `${apiUrl}/teams/${teamName}/containers/${containerId}`,
        {
          headers: {
            ...bearerAuthorizationHeader(bearerToken)
          }
        })
        .reply(200, containerFromApi)

      const actualContainer = await client.getContainer(containerId)

      expect(actualContainer).to.eql(expectedContainer)
    })

    it('throws an exception if the container ID is not provided',
      async () => {
        const { client } = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('getContainer')
          .withNoArguments()
          .throwsError('Invalid parameter(s): ["containerId" is required].')
      })

    it('throws an exception if the container ID is not a string',
      async () => {
        const { client } = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('getContainer')
          .withArguments(12345)
          .throwsError(
            'Invalid parameter(s): ["containerId" must be a string].')
      })
  })

  describe('listPipelines', () => {
    it('gets all pipelines for team',
      async () => {
        const { client, mock, apiUrl, bearerToken, teamName } =
          buildValidTeamClient()

        const pipelineData = data.randomPipeline({ teamName })

        const pipelineFromApi = build.api.pipeline(pipelineData)
        const pipelinesFromApi = [pipelineFromApi]

        const convertedPipeline = build.client.pipeline(pipelineData)
        const expectedPipelines = [convertedPipeline]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines`,
          {
            headers: {
              ...bearerAuthorizationHeader(bearerToken)
            }
          })
          .reply(200, pipelinesFromApi)

        const actualPipelines = await client.listPipelines()

        expect(actualPipelines).to.eql(expectedPipelines)
      })
  })

  describe('getPipeline', () => {
    it('throws an exception if the pipeline name is not provided',
      async () => {
        const { client } = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('getPipeline')
          .withNoArguments()
          .throwsError('Invalid parameter(s): ["pipelineName" is required].')
      })

    it('throws an exception if the pipeline name is not a string',
      async () => {
        const { client } = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('getPipeline')
          .withArguments(12345)
          .throwsError(
            'Invalid parameter(s): ["pipelineName" must be a string].')
      })

    it('gets the pipeline with the specified name',
      async () => {
        const { client, mock, apiUrl, bearerToken, teamName } =
          buildValidTeamClient()

        const pipelineName = data.randomPipelineName()
        const pipelineData = data.randomPipeline({
          teamName,
          name: pipelineName
        })

        const pipelineFromApi = build.api.pipeline(pipelineData)

        const expectedPipeline = build.client.pipeline(pipelineData)

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}`,
          {
            headers: {
              ...bearerAuthorizationHeader(bearerToken)
            }
          })
          .reply(200, pipelineFromApi)

        const actualPipeline = await client.getPipeline(pipelineName)

        expect(actualPipeline).to.eql(expectedPipeline)
      })
  })

  describe('forPipeline', () => {
    it('returns a client for the team pipeline with the supplied name when ' +
      'the pipeline exists for that team',
    () => {
      const { client, httpClient, apiUrl, teamName } =
          buildValidTeamClient()

      const pipelineName = data.randomPipelineName()

      const teamPipelineClient = client.forPipeline(pipelineName)

      expect(teamPipelineClient.apiUrl).to.equal(apiUrl)
      expect(teamPipelineClient.httpClient).to.equal(httpClient)
      expect(teamPipelineClient.teamName).to.eql(teamName)
      expect(teamPipelineClient.pipelineName).to.eql(pipelineName)
    })
  })
})
