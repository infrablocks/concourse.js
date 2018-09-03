import { expect } from 'chai'
import faker from 'faker'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import build from '../testsupport/builders'
import data from '../testsupport/data'
import { onConstructionOf } from '../testsupport/dsls/construction'
import { forInstance } from '../testsupport/dsls/methods'

import TeamClient from '../../src/subclients/TeamClient'
import { bearerAuthHeader } from '../../src/support/http/headers'

const buildValidTeamClient = () => {
  const apiUrl = data.randomApiUrl()
  const bearerToken = data.randomBearerToken()

  const httpClient = axios.create({
    headers: bearerAuthHeader(bearerToken)
  })
  const mock = new MockAdapter(httpClient)

  const teamId = data.randomId()
  const teamName = data.randomTeamName()
  const team = build.client.team(data.randomTeam({
    id: teamId,
    name: teamName
  }))

  const client = new TeamClient({apiUrl, httpClient, team})

  return {
    client,
    mock,
    apiUrl,
    bearerToken,
    team
  }
}

describe('TeamClient', () => {
  describe('construction', () => {
    it('throws an exception if the API URI is not provided', () => {
      onConstructionOf(TeamClient)
        .withArguments({teamId: 1})
        .throwsError('Invalid parameter(s): ["apiUrl" is required].')
    })

    it('throws an exception if the API URI is not a string', () => {
      onConstructionOf(TeamClient)
        .withArguments({teamId: 1, apiUrl: 25})
        .throwsError('Invalid parameter(s): ["apiUrl" must be a string].')
    })

    it('throws an exception if the API URI is not a valid URI', () => {
      onConstructionOf(TeamClient)
        .withArguments({teamId: 1, apiUrl: 'spinach'})
        .throwsError('Invalid parameter(s): ["apiUrl" must be a valid uri].')
    })

    it('throws an exception if the provided HTTP client is not an object',
      () => {
        onConstructionOf(TeamClient)
          .withArguments({
            teamId: 1,
            apiUrl: faker.internet.url(),
            httpClient: 35
          })
          .throwsError(
            'Invalid parameter(s): ["httpClient" must be a Function].')
      })

    it('throws an exception if the team is not provided', () => {
      onConstructionOf(TeamClient)
        .withArguments({apiUrl: faker.internet.url()})
        .throwsError('Invalid parameter(s): ["team" is required].')
    })

    it('throws an exception if the team is not an object', () => {
      onConstructionOf(TeamClient)
        .withArguments({apiUrl: faker.internet.url(), team: 'wat'})
        .throwsError('Invalid parameter(s): ["team" must be an object].')
    })
  })

  describe('listBuilds', () => {
    it('gets all builds for team',
      async () => {
        const {client, mock, apiUrl, bearerToken, team} =
          buildValidTeamClient()

        const teamName = team.name
        const buildData = data.randomBuild({teamName})

        const buildFromApi = build.api.build(buildData)
        const buildsFromApi = [buildFromApi]

        const convertedBuild = build.client.build(buildData)
        const expectedBuilds = [convertedBuild]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/builds`,
          {
            headers: {
              ...bearerAuthHeader(bearerToken)
            }
          })
          .reply(200, buildsFromApi)

        const actualBuilds = await client.listBuilds()

        expect(actualBuilds).to.eql(expectedBuilds)
      })

    it('uses provided page options when supplied',
      async () => {
        const {client, mock, apiUrl, bearerToken, team} =
          buildValidTeamClient()

        const teamName = team.name

        const buildData = data.randomBuild({teamName})

        const buildFromApi = build.api.build(buildData)
        const buildsFromApi = [buildFromApi]

        const convertedBuild = build.client.build(buildData)
        const expectedBuilds = [convertedBuild]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/builds`,
          {
            headers: {
              ...bearerAuthHeader(bearerToken)
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
        const {client} = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({limit: 'badger'})
          .throwsError('Invalid parameter(s): ["limit" must be a number].')
      })

    it('throws an exception if the value provided for limit is not an integer',
      async () => {
        const {client} = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({limit: 32.654})
          .throwsError('Invalid parameter(s): ["limit" must be an integer].')
      })

    it('throws an exception if the value provided for limit is less than 1',
      async () => {
        const {client} = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({limit: -20})
          .throwsError(
            'Invalid parameter(s): [' +
            '"limit" must be larger than or equal to 1].')
      })

    it('throws an exception if the value provided for since is not a number',
      async () => {
        const {client} = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({since: 'badger'})
          .throwsError('Invalid parameter(s): ["since" must be a number].')
      })

    it('throws an exception if the value provided for since is not an integer',
      async () => {
        const {client} = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({since: 32.654})
          .throwsError('Invalid parameter(s): ["since" must be an integer].')
      })

    it('throws an exception if the value provided for since is less than 1',
      async () => {
        const {client} = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({since: -20})
          .throwsError(
            'Invalid parameter(s): [' +
            '"since" must be larger than or equal to 1].')
      })

    it('throws an exception if the value provided for until is not a number',
      async () => {
        const {client} = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({until: 'badger'})
          .throwsError('Invalid parameter(s): ["until" must be a number].')
      })

    it('throws an exception if the value provided for until is not an integer',
      async () => {
        const {client} = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({until: 32.654})
          .throwsError('Invalid parameter(s): ["until" must be an integer].')
      })

    it('throws an exception if the value provided for until is less than 1',
      async () => {
        const {client} = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({until: -20})
          .throwsError(
            'Invalid parameter(s): [' +
            '"until" must be larger than or equal to 1].')
      })
  })

  describe('listContainers', () => {
    it('gets all containers for team',
      async () => {
        const {client, mock, apiUrl, bearerToken, team} =
          buildValidTeamClient()

        const type = 'get'
        const teamName = team.name
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
              ...bearerAuthHeader(bearerToken)
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
        const {client} = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('listContainers')
          .withArguments({type: 123})
          .throwsError(
            'Invalid parameter(s): ["type" must be a string].')
      })

    it('throws an exception if the value provided for pipeline name is ' +
      'not a string', async () => {
      const {client} = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({pipelineName: 123})
        .throwsError(
          'Invalid parameter(s): ["pipelineName" must be a string].')
    })

    it('throws an exception if the value provided for pipeline ID is ' +
      'not a number', async () => {
      const {client} = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({pipelineId: 'spinach'})
        .throwsError(
          'Invalid parameter(s): ["pipelineId" must be a number].')
    })

    it('throws an exception if the value provided for pipeline ID is ' +
      'not a integer', async () => {
      const {client} = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({pipelineId: 23.6})
        .throwsError(
          'Invalid parameter(s): ["pipelineId" must be an integer].')
    })

    it('throws an exception if the value provided for job ID is ' +
      'not a number', async () => {
      const {client} = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({jobId: 'spinach'})
        .throwsError(
          'Invalid parameter(s): ["jobId" must be a number].')
    })

    it('throws an exception if the value provided for job ID is ' +
      'not a integer', async () => {
      const {client} = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({jobId: 23.6})
        .throwsError(
          'Invalid parameter(s): ["jobId" must be an integer].')
    })

    it('throws an exception if the value provided for job name is ' +
      'not a string', async () => {
      const {client} = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({jobName: 123})
        .throwsError(
          'Invalid parameter(s): ["jobName" must be a string].')
    })

    it('throws an exception if the value provided for step name is ' +
      'not a string', async () => {
      const {client} = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({stepName: 123})
        .throwsError(
          'Invalid parameter(s): ["stepName" must be a string].')
    })

    it('throws an exception if the value provided for resource name is ' +
      'not a string', async () => {
      const {client} = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({resourceName: 123})
        .throwsError(
          'Invalid parameter(s): ["resourceName" must be a string].')
    })

    it('throws an exception if the value provided for attempt is ' +
      'not a string', async () => {
      const {client} = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({attempt: 123})
        .throwsError(
          'Invalid parameter(s): ["attempt" must be a string].')
    })

    it('throws an exception if the value provided for build ID is ' +
      'not a number', async () => {
      const {client} = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({buildId: 'spinach'})
        .throwsError(
          'Invalid parameter(s): ["buildId" must be a number].')
    })

    it('throws an exception if the value provided for build ID is ' +
      'not a integer', async () => {
      const {client} = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({buildId: 23.6})
        .throwsError(
          'Invalid parameter(s): ["buildId" must be an integer].')
    })

    it('throws an exception if the value provided for build name is ' +
      'not a string', async () => {
      const {client} = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({buildName: 123})
        .throwsError(
          'Invalid parameter(s): ["buildName" must be a string].')
    })

    it('throws an exception if type is check and pipeline name is ' +
      'not provided', async () => {
      const {client} = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({type: 'check', resourceName: 'resource'})
        .throwsError(
          'Invalid parameter(s): ["pipelineName" is required].')
    })

    it('throws an exception if type is check and resource name is ' +
      'not provided', async () => {
      const {client} = buildValidTeamClient()
      await forInstance(client)
        .onCallOf('listContainers')
        .withArguments({type: 'check', pipelineName: 'pipeline'})
        .throwsError(
          'Invalid parameter(s): ["resourceName" is required].')
    })
  })

  describe('getContainer', () => {
    it('gets the container with the specified ID', async () => {
      const {client, mock, apiUrl, bearerToken, team} =
        buildValidTeamClient()

      const teamName = team.name
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
            ...bearerAuthHeader(bearerToken)
          }
        })
        .reply(200, containerFromApi)

      const actualContainer = await client.getContainer(containerId)

      expect(actualContainer).to.eql(expectedContainer)
    });

    it('throws an exception if the container ID is not provided',
      async () => {
        const {client} = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('getContainer')
          .withNoArguments()
          .throwsError('Invalid parameter(s): ["containerId" is required].')
      })

    it('throws an exception if the container ID is not a string',
      async () => {
        const {client} = buildValidTeamClient()
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
        const {client, mock, apiUrl, bearerToken, team} =
          buildValidTeamClient()

        const teamName = team.name
        const pipelineData = data.randomPipeline({teamName})

        const pipelineFromApi = build.api.pipeline(pipelineData)
        const pipelinesFromApi = [pipelineFromApi]

        const convertedPipeline = build.client.pipeline(pipelineData)
        const expectedPipelines = [convertedPipeline]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines`,
          {
            headers: {
              ...bearerAuthHeader(bearerToken)
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
        const {client} = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('getPipeline')
          .withNoArguments()
          .throwsError('Invalid parameter(s): ["pipelineName" is required].')
      })

    it('throws an exception if the pipeline name is not a string',
      async () => {
        const {client} = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('getPipeline')
          .withArguments(12345)
          .throwsError(
            'Invalid parameter(s): ["pipelineName" must be a string].')
      })

    it('gets the pipeline with the specified name',
      async () => {
        const {client, mock, apiUrl, bearerToken, team} =
          buildValidTeamClient()

        const teamName = team.name
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
              ...bearerAuthHeader(bearerToken)
            }
          })
          .reply(200, pipelineFromApi)

        const actualPipeline = await client.getPipeline(pipelineName)

        expect(actualPipeline).to.eql(expectedPipeline)
      })
  })

  describe('deletePipeline', () => {
    it('throws an exception if the pipeline name is not provided',
      async () => {
        const {client} = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('deletePipeline')
          .withNoArguments()
          .throwsError(
            'Invalid parameter(s): ["pipelineName" is required].')
      })

    it('throws an exception if the pipeline name is not a string',
      async () => {
        const {client} = buildValidTeamClient()
        await forInstance(client)
          .onCallOf('deletePipeline')
          .withArguments(12345)
          .throwsError(
            'Invalid parameter(s): ["pipelineName" must be a string].')
      })

    it('deletes the pipeline with the specified name',
      async () => {
        const {client, mock, apiUrl, bearerToken, team} =
          buildValidTeamClient()

        const teamName = team.name
        const pipelineName = data.randomPipelineName()

        mock.onDelete(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}`,
          {
            headers: {
              ...bearerAuthHeader(bearerToken)
            }
          })
          .reply(204)

        await client.deletePipeline(pipelineName)
        expect(mock.history.delete).to.have.length(1)

        const call = mock.history.delete[0]
        expect(call.url)
          .to.eql(`${apiUrl}/teams/${teamName}/pipelines/${pipelineName}`)
        expect(call.headers)
          .to.include(bearerAuthHeader(bearerToken))
      })

    it('throws the underlying http client exception on failure',
      async () => {
        const {client, mock, apiUrl, bearerToken, team} =
          buildValidTeamClient()

        const teamName = team.name
        const pipelineName = data.randomPipelineName()

        mock.onDelete(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}`,
          {
            headers: {
              ...bearerAuthHeader(bearerToken)
            }
          })
          .networkError()

        try {
          await client.deletePipeline(pipelineName)
        } catch (e) {
          expect(e).to.be.instanceOf(Error)
          expect(e.message).to.eql('Network Error')
        }
      })
  })
})
