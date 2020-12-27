import 'core-js/stable'
import 'regenerator-runtime/runtime'
import axios from 'axios'
import faker from 'faker'
import MockAdapter from 'axios-mock-adapter'

import data from '../testsupport/data'
import build from '../testsupport/builders'

import { onConstructionOf } from '../testsupport/dsls/construction'

import {
  bearerAuthorizationHeader,
  contentTypeHeader, contentTypes
} from '../../src/support/http/headers'
import TeamPipelineClient from '../../src/subclients/TeamPipelineClient'
import { expect } from 'chai'
import { forInstance } from '../testsupport/dsls/methods'

const buildValidTeamPipelineClient = () => {
  const apiUrl = data.randomApiUrl()
  const bearerToken = data.randomBearerTokenPre4()

  const httpClient = axios.create({
    headers: bearerAuthorizationHeader(bearerToken)
  })
  const mock = new MockAdapter(httpClient)

  const teamName = data.randomTeamName()
  const pipelineName = data.randomPipelineName()

  const client = new TeamPipelineClient({
    apiUrl, httpClient, teamName, pipelineName
  })

  return {
    client,
    httpClient,
    mock,
    apiUrl,
    bearerToken,
    teamName,
    pipelineName
  }
}

describe('TeamPipelineClient', () => {
  describe('construction', () => {
    it('throws an exception if the API URI is not provided', () => {
      onConstructionOf(TeamPipelineClient)
        .withArguments({
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" is required].')
    })

    it('throws an exception if the API URI is not a string', () => {
      onConstructionOf(TeamPipelineClient)
        .withArguments({
          apiUrl: 25,
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a string].')
    })

    it('throws an exception if the API URI is not a valid URI', () => {
      onConstructionOf(TeamPipelineClient)
        .withArguments({
          apiUrl: 'spinach',
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a valid uri].')
    })

    it('throws an exception if the provided HTTP client is not an object',
      () => {
        onConstructionOf(TeamPipelineClient)
          .withArguments({
            httpClient: 35,
            teamName: data.randomTeamName(),
            pipelineName: data.randomPipelineName(),
            apiUrl: faker.internet.url()
          })
          .throwsError(
            'Invalid parameter(s): ["httpClient" must be of type function].')
      })

    it('throws an exception if the team name is not provided', () => {
      onConstructionOf(TeamPipelineClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          pipelineName: data.randomPipelineName()
        })
        .throwsError('Invalid parameter(s): ["teamName" is required].')
    })

    it('throws an exception if the team name is not a string', () => {
      onConstructionOf(TeamPipelineClient)
        .withArguments({
          teamName: 123,
          apiUrl: faker.internet.url(),
          httpClient: axios,
          pipelineName: data.randomPipelineName()
        })
        .throwsError('Invalid parameter(s): ["teamName" must be a string].')
    })

    it('throws an exception if the pipeline name is not provided', () => {
      onConstructionOf(TeamPipelineClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          teamName: data.randomTeamName()
        })
        .throwsError('Invalid parameter(s): ["pipelineName" is required].')
    })

    it('throws an exception if the pipeline name is not a string', () => {
      onConstructionOf(TeamPipelineClient)
        .withArguments({
          pipelineName: 123,
          apiUrl: faker.internet.url(),
          httpClient: axios,
          teamName: data.randomTeamName()
        })
        .throwsError('Invalid parameter(s): ["pipelineName" must be a string].')
    })
  })

  describe('pause', () => {
    it('pauses the pipeline',
      async () => {
        const { client, mock, apiUrl, bearerToken, teamName, pipelineName } =
          buildValidTeamPipelineClient()

        mock.onPut(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/pause`)
          .reply(200)

        await client.pause()
        expect(mock.history.put).to.have.length(1)

        const call = mock.history.put[0]
        expect(call.url)
          .to.eql(`${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/pause`)
        expect(call.headers)
          .to.include(bearerAuthorizationHeader(bearerToken))
      })

    it('throws the underlying http client exception on failure',
      async () => {
        const { client, mock, apiUrl, teamName, pipelineName } =
          buildValidTeamPipelineClient()

        mock.onPut(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/pause`)
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
        const { client, mock, apiUrl, bearerToken, teamName, pipelineName } =
          buildValidTeamPipelineClient()

        mock.onPut(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/unpause`)
          .reply(200)

        await client.unpause()
        expect(mock.history.put).to.have.length(1)

        const call = mock.history.put[0]
        expect(call.url)
          .to.eql(
            `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/unpause`)
        expect(call.headers)
          .to.include(bearerAuthorizationHeader(bearerToken))
      })

    it('throws the underlying http client exception on failure',
      async () => {
        const { client, mock, apiUrl, teamName, pipelineName } =
          buildValidTeamPipelineClient()

        mock.onPut(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/unpause`)
          .networkError()

        try {
          await client.unpause()
        } catch (e) {
          expect(e).to.be.instanceOf(Error)
          expect(e.message).to.eql('Network Error')
        }
      })
  })

  describe('rename', () => {
    it('renames the pipeline', async () => {
      const { client, mock, apiUrl, bearerToken, teamName, pipelineName } =
        buildValidTeamPipelineClient()

      const originalPipelineName = pipelineName
      const newPipelineName = data.randomTeamName()

      mock.onPut(
        `${apiUrl}/teams/${teamName}/pipelines/${originalPipelineName}/rename`,
        {
          name: newPipelineName
        })
        .reply(204)

      await client.rename(newPipelineName)
      expect(mock.history.put).to.have.length(1)

      const call = mock.history.put[0]
      expect(call.url)
        .to.eql(
          `${apiUrl}/teams/${teamName}/pipelines/${originalPipelineName}` +
          '/rename')
      expect(call.data).to.eql(`{"name":"${newPipelineName}"}`)
      expect(call.headers)
        .to.include(bearerAuthorizationHeader(bearerToken))
    })

    it('throws the underlying http client exception on failure',
      async () => {
        const { client, mock, apiUrl, teamName, pipelineName } =
          buildValidTeamPipelineClient()

        const newTeamName = data.randomTeamName()

        mock.onPut(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
          '/rename',
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

    it('throws an exception if the new pipeline name is not a string',
      async () => {
        const { client } = buildValidTeamPipelineClient()
        await forInstance(client)
          .onCallOf('rename')
          .withArguments(12345)
          .throwsError(
            'Invalid parameter(s): ["newPipelineName" must be a string].')
      })

    it('throws an exception if the new pipeline name is not provided',
      async () => {
        const { client } = buildValidTeamPipelineClient()
        await forInstance(client)
          .onCallOf('rename')
          .withArguments()
          .throwsError(
            'Invalid parameter(s): ["newPipelineName" is required].')
      })
  })
  describe('saveConfig', () => {
    it('saves the config', async () => {
      const { client, mock, apiUrl, bearerToken, teamName, pipelineName } =
        buildValidTeamPipelineClient()
      const pipelineConfig = data.randomPipelineConfig()
      const saveConfigUrl = `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/config`
      mock.onPut(saveConfigUrl, pipelineConfig)
        .reply(201)

      await client.saveConfig(pipelineConfig)

      expect(mock.history.put).to.have.length(1)
      const call = mock.history.put[0]
      expect(call.url).to.eql(saveConfigUrl)
      expect(call.data).to.eql(pipelineConfig)
      expect(call.headers).to.include({
        ...contentTypeHeader(contentTypes.yaml),
        ...bearerAuthorizationHeader(bearerToken)
      })
    })

    it('throws the underlying http client exception on failure',
      async () => {
        const { client, mock, apiUrl, teamName, pipelineName } =
          buildValidTeamPipelineClient()
        const pipelineConfig = data.randomPipelineConfig()

        mock.onPut(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
          '/config',
          pipelineConfig
        )
          .networkError()

        let actualError = null

        try {
          await client.saveConfig(pipelineConfig)
        } catch (e) {
          actualError = e
        }

        expect(actualError).to.be.instanceOf(Error)
        expect(actualError.message).to.eql('Network Error')
      })

    it('throws an exception if the pipeline config is not a string',
      async () => {
        const { client } = buildValidTeamPipelineClient()
        await forInstance(client)
          .onCallOf('saveConfig')
          .withArguments(12345)
          .throwsError(
            'Invalid parameter(s): ["pipelineConfig" must be a string].')
      })

    it('throws an exception if the pipeline config is not provided',
      async () => {
        const { client } = buildValidTeamPipelineClient()
        await forInstance(client)
          .onCallOf('saveConfig')
          .withArguments()
          .throwsError(
            'Invalid parameter(s): ["pipelineConfig" is required].')
      })
  })

  describe('delete', () => {
    it('deletes the pipeline',
      async () => {
        const { client, mock, apiUrl, bearerToken, teamName, pipelineName } =
          buildValidTeamPipelineClient()

        mock.onDelete(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}`,
          {
            headers: {
              ...bearerAuthorizationHeader(bearerToken)
            }
          })
          .reply(204)

        await client.delete()
        expect(mock.history.delete).to.have.length(1)

        const call = mock.history.delete[0]
        expect(call.url)
          .to.eql(`${apiUrl}/teams/${teamName}/pipelines/${pipelineName}`)
        expect(call.headers)
          .to.include(bearerAuthorizationHeader(bearerToken))
      })

    it('throws the underlying http client exception on failure',
      async () => {
        const { client, mock, apiUrl, bearerToken, teamName, pipelineName } =
          buildValidTeamPipelineClient()

        mock.onDelete(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}`,
          {
            headers: {
              ...bearerAuthorizationHeader(bearerToken)
            }
          })
          .networkError()

        try {
          await client.delete()
        } catch (e) {
          expect(e).to.be.instanceOf(Error)
          expect(e.message).to.eql('Network Error')
        }
      })
  })

  describe('listJobs', () => {
    it('gets all jobs for team pipeline',
      async () => {
        const { client, mock, apiUrl, bearerToken, teamName, pipelineName } =
          buildValidTeamPipelineClient()

        const jobData = data.randomJob({ teamName, pipelineName })

        const jobFromApi = build.api.job(jobData)
        const jobsFromApi = [jobFromApi]

        const convertedJob = build.client.job(jobData)
        const expectedJobs = [convertedJob]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/jobs`,
          {
            headers: {
              ...bearerAuthorizationHeader(bearerToken)
            }
          })
          .reply(200, jobsFromApi)

        const actualJobs = await client.listJobs()

        expect(actualJobs).to.eql(expectedJobs)
      })
  })

  describe('getJob', () => {
    it('throws an exception if the job name is not provided',
      async () => {
        const { client } = buildValidTeamPipelineClient()
        await forInstance(client)
          .onCallOf('getJob')
          .withNoArguments()
          .throwsError('Invalid parameter(s): ["jobName" is required].')
      })

    it('throws an exception if the job name is not a string',
      async () => {
        const { client } = buildValidTeamPipelineClient()
        await forInstance(client)
          .onCallOf('getJob')
          .withArguments(12345)
          .throwsError(
            'Invalid parameter(s): ["jobName" must be a string].')
      })

    it('gets the job with the specified name',
      async () => {
        const { client, mock, apiUrl, bearerToken, teamName, pipelineName } =
          buildValidTeamPipelineClient()

        const jobName = data.randomJobName()
        const jobData = data.randomJob({
          teamName,
          pipelineName,
          name: jobName
        })

        const jobFromApi = build.api.job(jobData)

        const expectedJob = build.client.job(jobData)

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
          `/jobs/${jobName}`,
          {
            headers: {
              ...bearerAuthorizationHeader(bearerToken)
            }
          })
          .reply(200, jobFromApi)

        const actualJob = await client.getJob(jobName)

        expect(actualJob).to.eql(expectedJob)
      })
  })

  describe('forJob', () => {
    it('returns a client for the team pipeline job with the supplied name ' +
      'when the pipeline exists for that team',
    () => {
      const {
        client, httpClient, apiUrl, teamName, pipelineName
      } = buildValidTeamPipelineClient()

      const jobName = data.randomJobName()

      const teamPipelineJobClient = client.forJob(jobName)

      expect(teamPipelineJobClient.apiUrl).to.equal(apiUrl)
      expect(teamPipelineJobClient.httpClient).to.equal(httpClient)
      expect(teamPipelineJobClient.teamName).to.eql(teamName)
      expect(teamPipelineJobClient.pipelineName).to.eql(pipelineName)
      expect(teamPipelineJobClient.jobName).to.eql(jobName)
    })
  })

  describe('listResources', () => {
    it('gets all resources for team pipeline',
      async () => {
        const { client, mock, apiUrl, bearerToken, teamName, pipelineName } =
          buildValidTeamPipelineClient()

        const resourceData = data.randomResource({ teamName, pipelineName })

        const resourceFromApi = build.api.resource(resourceData)
        const resourcesFromApi = [resourceFromApi]

        const convertedResource = build.client.resource(resourceData)
        const expectedResources = [convertedResource]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/resources`,
          {
            headers: {
              ...bearerAuthorizationHeader(bearerToken)
            }
          })
          .reply(200, resourcesFromApi)

        const actualResources = await client.listResources()

        expect(actualResources).to.eql(expectedResources)
      })
  })

  describe('getResource', () => {
    it('throws an exception if the resource name is not provided',
      async () => {
        const { client } = buildValidTeamPipelineClient()
        await forInstance(client)
          .onCallOf('getResource')
          .withNoArguments()
          .throwsError('Invalid parameter(s): ["resourceName" is required].')
      })

    it('throws an exception if the resource name is not a string',
      async () => {
        const { client } = buildValidTeamPipelineClient()
        await forInstance(client)
          .onCallOf('getResource')
          .withArguments(12345)
          .throwsError(
            'Invalid parameter(s): ["resourceName" must be a string].')
      })

    it('gets the resource with the specified name',
      async () => {
        const { client, mock, apiUrl, bearerToken, teamName, pipelineName } =
          buildValidTeamPipelineClient()

        const resourceName = data.randomResourceName()
        const resourceData = data.randomResource({
          teamName,
          pipelineName,
          name: resourceName
        })

        const resourceFromApi = build.api.resource(resourceData)

        const expectedResource = build.client.resource(resourceData)

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
          `/resources/${resourceName}`,
          {
            headers: {
              ...bearerAuthorizationHeader(bearerToken)
            }
          })
          .reply(200, resourceFromApi)

        const actualResource = await client.getResource(resourceName)

        expect(actualResource).to.eql(expectedResource)
      })
  })

  describe('forResource', () => {
    it('returns a client for the team pipeline resource with the supplied ' +
      'name when the pipeline exists for that team',
    () => {
      const {
        client, httpClient, apiUrl, teamName, pipelineName
      } = buildValidTeamPipelineClient()

      const resourceName = data.randomResourceName()

      const teamPipelineResourceClient = client.forResource(resourceName)

      expect(teamPipelineResourceClient.apiUrl).to.equal(apiUrl)
      expect(teamPipelineResourceClient.httpClient).to.equal(httpClient)
      expect(teamPipelineResourceClient.teamName).to.eql(teamName)
      expect(teamPipelineResourceClient.pipelineName).to.eql(pipelineName)
      expect(teamPipelineResourceClient.resourceName).to.eql(resourceName)
    })
  })

  describe('listResourceTypes', () => {
    it('gets all resource types for team pipeline',
      async () => {
        const { client, mock, apiUrl, bearerToken, teamName, pipelineName } =
          buildValidTeamPipelineClient()

        const resourceTypeData = data.randomResourceType({ teamName, pipelineName })

        const resourceTypeFromApi = build.api.resourceType(resourceTypeData)
        const resourceTypesFromApi = [resourceTypeFromApi]

        const convertedResourceType = build.client.resourceType(resourceTypeData)
        const expectedResourceTypes = [convertedResourceType]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/resource-types`,
          {
            headers: {
              ...bearerAuthorizationHeader(bearerToken)
            }
          })
          .reply(200, resourceTypesFromApi)

        const actualResourceTypes = await client.listResourceTypes()

        expect(actualResourceTypes).to.eql(expectedResourceTypes)
      })
  })

  describe('listBuilds', () => {
    it('gets all builds for team pipeline',
      async () => {
        const { client, mock, apiUrl, bearerToken, teamName, pipelineName } =
          buildValidTeamPipelineClient()

        const buildData = data.randomBuild({ teamName, pipelineName })

        const buildFromApi = build.api.build(buildData)
        const buildsFromApi = [buildFromApi]

        const convertedBuild = build.client.build(buildData)
        const expectedBuilds = [convertedBuild]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/builds`,
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
        const { client, mock, apiUrl, bearerToken, teamName, pipelineName } =
          buildValidTeamPipelineClient()

        const buildData = data.randomBuild({ teamName, pipelineName })

        const buildFromApi = build.api.build(buildData)
        const buildsFromApi = [buildFromApi]

        const convertedBuild = build.client.build(buildData)
        const expectedBuilds = [convertedBuild]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/builds`,
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
        const { client } = buildValidTeamPipelineClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({ limit: 'badger' })
          .throwsError('Invalid parameter(s): ["limit" must be a number].')
      })

    it('throws an exception if the value provided for limit is not an integer',
      async () => {
        const { client } = buildValidTeamPipelineClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({ limit: 32.654 })
          .throwsError('Invalid parameter(s): ["limit" must be an integer].')
      })

    it('throws an exception if the value provided for limit is less than 1',
      async () => {
        const { client } = buildValidTeamPipelineClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({ limit: -20 })
          .throwsError(
            'Invalid parameter(s): [' +
            '"limit" must be greater than or equal to 1].')
      })

    it('throws an exception if the value provided for since is not a number',
      async () => {
        const { client } = buildValidTeamPipelineClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({ since: 'badger' })
          .throwsError('Invalid parameter(s): ["since" must be a number].')
      })

    it('throws an exception if the value provided for since is not an integer',
      async () => {
        const { client } = buildValidTeamPipelineClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({ since: 32.654 })
          .throwsError('Invalid parameter(s): ["since" must be an integer].')
      })

    it('throws an exception if the value provided for since is less than 1',
      async () => {
        const { client } = buildValidTeamPipelineClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({ since: -20 })
          .throwsError(
            'Invalid parameter(s): [' +
            '"since" must be greater than or equal to 1].')
      })

    it('throws an exception if the value provided for until is not a number',
      async () => {
        const { client } = buildValidTeamPipelineClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({ until: 'badger' })
          .throwsError('Invalid parameter(s): ["until" must be a number].')
      })

    it('throws an exception if the value provided for until is not an integer',
      async () => {
        const { client } = buildValidTeamPipelineClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({ until: 32.654 })
          .throwsError('Invalid parameter(s): ["until" must be an integer].')
      })

    it('throws an exception if the value provided for until is less than 1',
      async () => {
        const { client } = buildValidTeamPipelineClient()
        await forInstance(client)
          .onCallOf('listBuilds')
          .withArguments({ until: -20 })
          .throwsError(
            'Invalid parameter(s): [' +
            '"until" must be greater than or equal to 1].')
      })
  })
})
