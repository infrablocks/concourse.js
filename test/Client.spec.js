import { expect } from 'chai'
import faker from 'faker'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import build from './testsupport/builders'
import data from './testsupport/data'
import { onConstructionOf } from './testsupport/dsls/construction'
import { forInstance } from './testsupport/dsls/methods'

import Client from '../src/Client'
import { bearerAuthHeader } from '../src/support/http/headers'

const buildValidClient = () => {
  const apiUrl = data.randomApiUrl()
  const bearerToken = data.randomBearerToken()

  const httpClient = axios.create({
    headers: bearerAuthHeader(bearerToken)
  })
  const mock = new MockAdapter(httpClient)

  const client = new Client({apiUrl, httpClient})

  return {
    client,
    mock,
    httpClient,
    apiUrl,
    bearerToken
  }
}

describe('Client', () => {
  describe('construction', () => {
    it('throws an exception if the API URI is not provided', () => {
      onConstructionOf(Client)
        .withEmptyOptions()
        .throwsError('Invalid parameter(s): ["apiUrl" is required].')
    })

    it('throws an exception if the API URI is not a string', () => {
      onConstructionOf(Client)
        .withArguments({apiUrl: 25})
        .throwsError('Invalid parameter(s): ["apiUrl" must be a string].')
    })

    it('throws an exception if the API URI is not a valid URI', () => {
      onConstructionOf(Client)
        .withArguments({apiUrl: 'spinach'})
        .throwsError('Invalid parameter(s): ["apiUrl" must be a valid uri].')
    })

    it('throws an exception if the provided HTTP client is not an object',
      () => {
        onConstructionOf(Client)
          .withArguments({apiUrl: faker.internet.url(), httpClient: 35})
          .throwsError(
            'Invalid parameter(s): ["httpClient" must be a Function].')
      })
  })

  describe('listTeams', () => {
    it('gets all teams',
      async () => {
        const {client, mock, apiUrl, bearerToken} = buildValidClient()

        const teamData = data.randomTeam()

        const teamFromApi = build.api.team(teamData)
        const teamsFromApi = [teamFromApi]

        const convertedTeam = build.client.team(teamData)

        const expectedTeams = [convertedTeam]

        mock.onGet(
          `${apiUrl}/teams`,
          {
            headers: {
              ...bearerAuthHeader(bearerToken)
            }
          })
          .reply(200, teamsFromApi)

        const actualTeams = await client.listTeams()

        expect(actualTeams).to.eql(expectedTeams)
      })
  })

  describe('forTeam', () => {
    it('returns a client for the team with the supplied ID when the team ' +
      'exists',
      async () => {
        const {client, mock, apiUrl, bearerToken, httpClient} =
          buildValidClient()

        const teamId = data.randomId()

        const teamData = data.randomTeam({
          id: teamId
        })

        const firstTeamFromApi = build.api.team(teamData)
        const secondTeamFromApi = build.api.team(data.randomTeam())
        const teamsFromApi = [secondTeamFromApi, firstTeamFromApi]

        const expectedTeam = build.client.team(teamData)

        mock.onGet(
          `${apiUrl}/teams`,
          {
            headers: {
              ...bearerAuthHeader(bearerToken)
            }
          })
          .reply(200, teamsFromApi)

        const teamClient = await client.forTeam(teamId)

        expect(teamClient.apiUrl).to.equal(apiUrl)
        expect(teamClient.httpClient).to.equal(httpClient)
        expect(teamClient.team).to.eql(expectedTeam)
      })

    it('throws an exception if no team exists for the supplied ID',
      async () => {
        const {client, mock, apiUrl, bearerToken} = buildValidClient()

        const teamId = data.randomId()

        const firstTeamFromApi = build.api.team(data.randomTeam())
        const secondTeamFromApi = build.api.team(data.randomTeam())
        const teamsFromApi = [secondTeamFromApi, firstTeamFromApi]

        mock.onGet(
          `${apiUrl}/teams`,
          {
            headers: {
              ...bearerAuthHeader(bearerToken)
            }
          })
          .reply(200, teamsFromApi)

        try {
          await client.forTeam(teamId)
          expect.fail('Expected exception but none was thrown.')
        } catch (e) {
          expect(e).to.be.an.instanceof(Error)
          expect(e.message).to.eql(`No team for ID: ${teamId}`)
        }
      })
  })

  describe('listWorkers', () => {
    it('gets all workers',
      async () => {
        const {client, mock, apiUrl, bearerToken} = buildValidClient()

        const workerData = data.randomWorker()

        const resourceTypeData = data.randomResourceType()

        const workerFromApi = build.api.worker({
          ...workerData,
          resourceTypes: [build.api.resourceType(resourceTypeData)]
        })
        const workersFromApi = [workerFromApi]

        const convertedWorker = build.client.worker({
          ...workerData,
          resourceTypes: [build.client.resourceType(resourceTypeData)]
        })

        const expectedWorkers = [convertedWorker]

        mock.onGet(
          `${apiUrl}/workers`,
          {
            headers: {
              ...bearerAuthHeader(bearerToken)
            }
          })
          .reply(200, workersFromApi)

        const actualWorkers = await client.listWorkers()

        expect(actualWorkers).to.eql(expectedWorkers)
      })
  })

  describe('listPipelines', () => {
    it('gets all pipelines',
      async () => {
        const {client, mock, apiUrl, bearerToken} = buildValidClient()

        const pipelineData = data.randomPipeline()

        const pipelineFromApi = build.api.pipeline(pipelineData)
        const pipelinesFromApi = [pipelineFromApi]

        const convertedPipeline = build.client.pipeline(pipelineData)

        const expectedPipelines = [convertedPipeline]

        mock.onGet(
          `${apiUrl}/pipelines`,
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

  describe('listJobs', () => {
    it('gets all jobs',
      async () => {
        const {client, mock, apiUrl, bearerToken} = buildValidClient()

        const jobName = data.randomJobName()
        const teamName = data.randomTeamName()
        const pipelineName = data.randomPipelineName()

        const jobData = data.randomJob({
          name: jobName,
          pipelineName,
          teamName,
          nextBuild: null
        })

        const buildData = data.randomBuild({
          teamName,
          jobName,
          pipelineName
        })

        const inputData = data.randomInput()
        const outputData = data.randomOutput()

        const jobFromApi = build.api.job({
          ...jobData,
          finishedBuild: build.api.build(buildData),
          inputs: [build.api.input(inputData)],
          outputs: [build.api.output(outputData)]
        })
        const jobsFromApi = [jobFromApi]

        const convertedJob = build.client.job({
          ...jobData,
          finishedBuild: build.client.build(buildData),
          inputs: [build.client.input(inputData)],
          outputs: [build.client.output(outputData)]
        })

        const expectedJobs = [convertedJob]

        mock.onGet(
          `${apiUrl}/jobs`,
          {
            headers: {
              ...bearerAuthHeader(bearerToken)
            }
          })
          .reply(200, jobsFromApi)

        const actualJobs = await client.listJobs()

        expect(actualJobs).to.eql(expectedJobs)
      })
  })

  describe('listBuilds', () => {
    it('gets all builds',
      async () => {
        const {client, mock, apiUrl, bearerToken} = buildValidClient()

        const teamName = data.randomTeamName()
        const pipelineName = data.randomPipelineName()
        const jobName = data.randomJobName()

        const buildData = data.randomBuild({
          teamName,
          pipelineName,
          jobName
        })

        const buildFromApi = build.api.build(buildData)
        const buildsFromApi = [buildFromApi]

        const convertedBuild = build.client.build(buildData)

        const expectedBuilds = [convertedBuild]

        mock.onGet(
          `${apiUrl}/builds`,
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
        const {client, mock, apiUrl, bearerToken} = buildValidClient()

        const teamName = data.randomTeamName()
        const pipelineName = data.randomPipelineName()
        const jobName = data.randomJobName()

        const buildData = data.randomBuild({
          teamName,
          pipelineName,
          jobName
        })

        const buildFromApi = build.api.build(buildData)
        const buildsFromApi = [buildFromApi]

        const convertedBuild = build.client.build(buildData)

        const expectedBuilds = [convertedBuild]

        mock.onGet(
          `${apiUrl}/builds`,
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
        const {client} = buildValidClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({limit: 'badger'})
          .throwsError('Invalid parameter(s): ["limit" must be a number].')
      })

    it('throws an exception if the value provided for limit is not an integer',
      async () => {
        const {client} = buildValidClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({limit: 32.654})
          .throwsError('Invalid parameter(s): ["limit" must be an integer].')
      })

    it('throws an exception if the value provided for limit is less than 1',
      async () => {
        const {client} = buildValidClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({limit: -20})
          .throwsError(
            'Invalid parameter(s): [' +
            '"limit" must be larger than or equal to 1].')
      })

    it('throws an exception if the value provided for since is not a number',
      async () => {
        const {client} = buildValidClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({since: 'badger'})
          .throwsError('Invalid parameter(s): ["since" must be a number].')
      })

    it('throws an exception if the value provided for since is not an integer',
      async () => {
        const {client} = buildValidClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({since: 32.654})
          .throwsError('Invalid parameter(s): ["since" must be an integer].')
      })

    it('throws an exception if the value provided for since is less than 1',
      async () => {
        const {client} = buildValidClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({since: -20})
          .throwsError(
            'Invalid parameter(s): [' +
            '"since" must be larger than or equal to 1].')
      })

    it('throws an exception if the value provided for until is not a number',
      async () => {
        const {client} = buildValidClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({until: 'badger'})
          .throwsError('Invalid parameter(s): ["until" must be a number].')
      })

    it('throws an exception if the value provided for until is not an integer',
      async () => {
        const {client} = buildValidClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({until: 32.654})
          .throwsError('Invalid parameter(s): ["until" must be an integer].')
      })

    it('throws an exception if the value provided for until is less than 1',
      async () => {
        const {client} = buildValidClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({until: -20})
          .throwsError(
            'Invalid parameter(s): [' +
            '"until" must be larger than or equal to 1].')
      })
  })

  describe('getBuild', () => {
    it('gets the build with the provided ID',
      async () => {
        const {client, mock, apiUrl, bearerToken} = buildValidClient()

        const buildId = data.randomId()

        const teamName = data.randomTeamName()
        const pipelineName = data.randomPipelineName()
        const jobName = data.randomJobName()

        const buildData = data.randomBuild({
          id: buildId,
          teamName,
          pipelineName,
          jobName
        })

        const buildFromApi = build.api.build(buildData)
        const expectedBuild = build.client.build(buildData)

        mock.onGet(
          `${apiUrl}/builds/${buildId}`,
          {
            headers: {
              ...bearerAuthHeader(bearerToken)
            }
          })
          .reply(200, buildFromApi)

        const actualBuild = await client.getBuild(buildId)

        expect(actualBuild).to.eql(expectedBuild)
      })
  })

  describe('listResources', () => {
    it('gets all resources',
      async () => {
        const {client, mock, apiUrl, bearerToken} = buildValidClient()

        const teamName = data.randomTeamName()
        const pipelineName = data.randomPipelineName()

        const resourceData = data.randomResource({
          teamName,
          pipelineName
        })

        const resourceFromApi = build.api.resource(resourceData)
        const resourcesFromApi = [resourceFromApi]

        const convertedResource = build.client.resource(resourceData)

        const expectedResources = [convertedResource]

        mock.onGet(
          `${apiUrl}/resources`,
          {
            headers: {
              ...bearerAuthHeader(bearerToken)
            }
          })
          .reply(200, resourcesFromApi)

        const actualResources = await client.listResources()

        expect(actualResources).to.eql(expectedResources)
      })
  })
})
