import { expect } from 'chai'
import faker from 'faker'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import build from './support/builders'
import data from './support/data'

import Client from '../src/Client'
import { bearerAuthHeader } from '../src/http'

describe('Client', () => {
  describe('construction', () => {
    it('throws an exception if the API URI is not provided', () => {
      expect(() => {
        new Client({}) // eslint-disable-line no-new
      })
        .to.throw(
          Error, 'Invalid parameter(s): ["apiUrl" is required].')
    })

    it('throws an exception if the API URI is not a string', () => {
      expect(() => {
        new Client({ apiUrl: 25 }) // eslint-disable-line no-new
      })
        .to.throw(
          Error, 'Invalid parameter(s): ["apiUrl" must be a string].')
    })

    it('throws an exception if the API URI is not a valid URI', () => {
      expect(() => {
        new Client({ apiUrl: 'spinach' }) // eslint-disable-line no-new
      })
        .to.throw(
          Error, 'Invalid parameter(s): ["apiUrl" must be a valid uri].')
    })

    it('throws an exception if the provided HTTP client is not an object',
      () => {
        expect(
          () => {
            // eslint-disable-next-line no-new
            new Client({
              apiUrl: faker.internet.url(),
              httpClient: 35
            })
          })
          .to.throw(
            Error, 'Invalid parameter(s): ["httpClient" must be a Function].')
      })
  })

  describe('listTeams', () => {
    it('gets all teams',
      async () => {
        const bearerToken = data.randomBearerToken()

        const apiUrl = 'https://concourse.example.com'
        const httpClient = axios.create({
          headers: bearerAuthHeader(bearerToken)
        })
        const mock = new MockAdapter(httpClient)

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

        const client = new Client({ apiUrl, httpClient })

        const actualTeams = await client.listTeams()

        expect(actualTeams).to.eql(expectedTeams)
      })
  })

  describe('listWorkers', () => {
    it('gets all workers',
      async () => {
        const bearerToken = data.randomBearerToken()

        const apiUrl = 'https://concourse.example.com'
        const httpClient = axios.create({
          headers: bearerAuthHeader(bearerToken)
        })
        const mock = new MockAdapter(httpClient)

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

        const client = new Client({ apiUrl, httpClient })

        const actualWorkers = await client.listWorkers()

        expect(actualWorkers).to.eql(expectedWorkers)
      })
  })

  describe('listPipelines', () => {
    it('gets all pipelines',
      async () => {
        const bearerToken = data.randomBearerToken()

        const apiUrl = 'https://concourse.example.com'
        const httpClient = axios.create({
          headers: bearerAuthHeader(bearerToken)
        })
        const mock = new MockAdapter(httpClient)

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

        const client = new Client({ apiUrl, httpClient })

        const actualPipelines = await client.listPipelines()

        expect(actualPipelines).to.eql(expectedPipelines)
      })
  })

  describe('listJobs', () => {
    it('gets all jobs',
      async () => {
        const bearerToken = data.randomBearerToken()

        const apiUrl = 'https://concourse.example.com'
        const httpClient = axios.create({
          headers: bearerAuthHeader(bearerToken)
        })
        const mock = new MockAdapter(httpClient)

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

        const client = new Client({ apiUrl, httpClient })

        const actualJobs = await client.listJobs()

        expect(actualJobs).to.eql(expectedJobs)
      })
  })

  describe('listBuilds', () => {
    it('gets all builds',
      async () => {
        const bearerToken = data.randomBearerToken()

        const apiUrl = 'https://concourse.example.com'
        const httpClient = axios.create({
          headers: bearerAuthHeader(bearerToken)
        })
        const mock = new MockAdapter(httpClient)

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

        const client = new Client({ apiUrl, httpClient })

        const actualBuilds = await client.listBuilds()

        expect(actualBuilds).to.eql(expectedBuilds)
      })

    it('uses provided page options when supplied',
      async () => {
        const bearerToken = data.randomBearerToken()

        const apiUrl = 'https://concourse.example.com'
        const httpClient = axios.create({
          headers: bearerAuthHeader(bearerToken)
        })
        const mock = new MockAdapter(httpClient)

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

        const client = new Client({ apiUrl, httpClient })

        const actualBuilds = await client.listBuilds({
          limit: 20,
          since: 123,
          until: 456
        })

        expect(actualBuilds).to.eql(expectedBuilds)
      })

    it('throws an exception if the value provided for limit is not a number',
      async () => {
        try {
          const bearerToken = data.randomBearerToken()

          const apiUrl = 'https://concourse.example.com'
          const httpClient = axios.create({
            headers: bearerAuthHeader(bearerToken)
          })

          await new Client({ apiUrl, httpClient })
            .listBuilds({ limit: 'badger' })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql('Invalid parameter(s): ["limit" must be a number].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('throws an exception if the value provided for limit is not an integer',
      async () => {
        try {
          const bearerToken = data.randomBearerToken()

          const apiUrl = 'https://concourse.example.com'
          const httpClient = axios.create({
            headers: bearerAuthHeader(bearerToken)
          })

          await new Client({ apiUrl, httpClient })
            .listBuilds({ limit: 32.654 })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql('Invalid parameter(s): ["limit" must be an integer].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('throws an exception if the value provided for limit is less than 1',
      async () => {
        try {
          const bearerToken = data.randomBearerToken()

          const apiUrl = 'https://concourse.example.com'
          const httpClient = axios.create({
            headers: bearerAuthHeader(bearerToken)
          })

          await new Client({ apiUrl, httpClient })
            .listBuilds({ limit: -20 })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql(
              'Invalid parameter(s): [' +
            '"limit" must be larger than or equal to 1].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('throws an exception if the value provided for since is not a number',
      async () => {
        try {
          const bearerToken = data.randomBearerToken()

          const apiUrl = 'https://concourse.example.com'
          const httpClient = axios.create({
            headers: bearerAuthHeader(bearerToken)
          })

          await new Client({ apiUrl, httpClient })
            .listBuilds({ since: 'badger' })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql('Invalid parameter(s): ["since" must be a number].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('throws an exception if the value provided for since is not an integer',
      async () => {
        try {
          const bearerToken = data.randomBearerToken()

          const apiUrl = 'https://concourse.example.com'
          const httpClient = axios.create({
            headers: bearerAuthHeader(bearerToken)
          })

          await new Client({ apiUrl, httpClient })
            .listBuilds({ since: 32.654 })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql('Invalid parameter(s): ["since" must be an integer].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('throws an exception if the value provided for since is less than 1',
      async () => {
        try {
          const bearerToken = data.randomBearerToken()

          const apiUrl = 'https://concourse.example.com'
          const httpClient = axios.create({
            headers: bearerAuthHeader(bearerToken)
          })

          await new Client({ apiUrl, httpClient })
            .listBuilds({ since: -20 })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql(
              'Invalid parameter(s): [' +
            '"since" must be larger than or equal to 1].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('throws an exception if the value provided for until is not a number',
      async () => {
        try {
          const bearerToken = data.randomBearerToken()

          const apiUrl = 'https://concourse.example.com'
          const httpClient = axios.create({
            headers: bearerAuthHeader(bearerToken)
          })

          await new Client({ apiUrl, httpClient })
            .listBuilds({ until: 'badger' })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql('Invalid parameter(s): ["until" must be a number].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('throws an exception if the value provided for until is not an integer',
      async () => {
        try {
          const bearerToken = data.randomBearerToken()

          const apiUrl = 'https://concourse.example.com'
          const httpClient = axios.create({
            headers: bearerAuthHeader(bearerToken)
          })

          await new Client({ apiUrl, httpClient })
            .listBuilds({ until: 32.654 })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql('Invalid parameter(s): ["until" must be an integer].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('throws an exception if the value provided for until is less than 1',
      async () => {
        try {
          const bearerToken = data.randomBearerToken()

          const apiUrl = 'https://concourse.example.com'
          const httpClient = axios.create({
            headers: bearerAuthHeader(bearerToken)
          })

          await new Client({ apiUrl, httpClient })
            .listBuilds({ until: -20 })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql(
              'Invalid parameter(s): [' +
            '"until" must be larger than or equal to 1].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })
  })

  describe('listResources', () => {
    it('gets all resources',
      async () => {
        const bearerToken = data.randomBearerToken()

        const apiUrl = 'https://concourse.example.com'
        const httpClient = axios.create({
          headers: bearerAuthHeader(bearerToken)
        })
        const mock = new MockAdapter(httpClient)

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

        const client = new Client({ apiUrl, httpClient })

        const actualResources = await client.listResources()

        expect(actualResources).to.eql(expectedResources)
      })
  })
})
