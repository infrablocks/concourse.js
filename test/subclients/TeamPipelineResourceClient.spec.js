import { onConstructionOf } from '../testsupport/dsls/construction'
import TeamPipelineResourceClient
  from '../../src/subclients/TeamPipelineResourceClient'
import data from '../testsupport/data'
import axios from 'axios'
import faker from 'faker'
import build from '../testsupport/builders'
import { bearerAuthHeader } from '../../src/support/http/headers'
import { expect } from 'chai'
import { forInstance } from '../testsupport/dsls/methods'
import MockAdapter from 'axios-mock-adapter'

const buildValidTeamPipelineResourceClient = () => {
  const apiUrl = data.randomApiUrl()
  const bearerToken = data.randomBearerToken()

  const httpClient = axios.create({
    headers: bearerAuthHeader(bearerToken)
  })
  const mock = new MockAdapter(httpClient)

  const teamName = data.randomTeamName()
  const pipelineName = data.randomPipelineName()
  const resourceName = data.randomResourceName()

  const client = new TeamPipelineResourceClient({
    apiUrl, httpClient, teamName, pipelineName, resourceName
  })

  return {
    client,
    httpClient,
    mock,
    apiUrl,
    bearerToken,
    teamName,
    pipelineName,
    resourceName
  }
}

describe('TeamPipelineResourceClient', () => {
  describe('construction', () => {
    it('throws an exception if the API URI is not provided', () => {
      onConstructionOf(TeamPipelineResourceClient)
        .withArguments({
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName(),
          resourceName: data.randomResourceName(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" is required].')
    })

    it('throws an exception if the API URI is not a string', () => {
      onConstructionOf(TeamPipelineResourceClient)
        .withArguments({
          apiUrl: 25,
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName(),
          resourceName: data.randomResourceName(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a string].')
    })

    it('throws an exception if the API URI is not a valid URI', () => {
      onConstructionOf(TeamPipelineResourceClient)
        .withArguments({
          apiUrl: 'spinach',
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName(),
          resourceName: data.randomResourceName(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a valid uri].')
    })

    it('throws an exception if the provided HTTP client is not an object',
      () => {
        onConstructionOf(TeamPipelineResourceClient)
          .withArguments({
            httpClient: 35,
            teamName: data.randomTeamName(),
            pipelineName: data.randomPipelineName(),
            resourceName: data.randomResourceName(),
            apiUrl: faker.internet.url()
          })
          .throwsError(
            'Invalid parameter(s): ["httpClient" must be a Function].')
      })

    it('throws an exception if the team name is not provided', () => {
      onConstructionOf(TeamPipelineResourceClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          pipelineName: data.randomPipelineName(),
          resourceName: data.randomResourceName()
        })
        .throwsError('Invalid parameter(s): ["teamName" is required].')
    })

    it('throws an exception if the team name is not a string', () => {
      onConstructionOf(TeamPipelineResourceClient)
        .withArguments({
          teamName: 123,
          apiUrl: faker.internet.url(),
          httpClient: axios,
          pipelineName: data.randomPipelineName(),
          resourceName: data.randomResourceName()
        })
        .throwsError('Invalid parameter(s): ["teamName" must be a string].')
    })

    it('throws an exception if the pipeline name is not provided', () => {
      onConstructionOf(TeamPipelineResourceClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          teamName: data.randomTeamName(),
          resource: data.randomResource()
        })
        .throwsError('Invalid parameter(s): ["pipelineName" is required].')
    })

    it('throws an exception if the pipeline name is not a string', () => {
      onConstructionOf(TeamPipelineResourceClient)
        .withArguments({
          pipelineName: 123,
          apiUrl: faker.internet.url(),
          httpClient: axios,
          teamName: data.randomTeamName(),
          resource: data.randomResource()
        })
        .throwsError('Invalid parameter(s): ["pipelineName" must be a string].')
    })

    it('throws an exception if the resource name is not provided', () => {
      onConstructionOf(TeamPipelineResourceClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName()
        })
        .throwsError('Invalid parameter(s): ["resourceName" is required].')
    })

    it('throws an exception if the pipeline name is not a string', () => {
      onConstructionOf(TeamPipelineResourceClient)
        .withArguments({
          resourceName: 123,
          apiUrl: faker.internet.url(),
          httpClient: axios,
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName()
        })
        .throwsError('Invalid parameter(s): ["resourceName" must be a string].')
    })
  })

  describe('pause', () => {
    it('pauses the resource',
      async () => {
        const {
          client, mock, apiUrl, bearerToken,
          teamName, pipelineName, resourceName
        } = buildValidTeamPipelineResourceClient()

        mock.onPut(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
          `/resources/${resourceName}/pause`)
          .reply(200)

        await client.pause()
        expect(mock.history.put).to.have.length(1)

        const call = mock.history.put[0]
        expect(call.url)
          .to.eql(
            `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
            `/resources/${resourceName}/pause`)
        expect(call.headers)
          .to.include(bearerAuthHeader(bearerToken))
      })

    it('throws the underlying http client exception on failure',
      async () => {
        const { client, mock, apiUrl, teamName, pipelineName, resourceName } =
          buildValidTeamPipelineResourceClient()

        mock.onPut(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/` +
          `resources/${resourceName}/pause`)
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
    it('unpauses the resource',
      async () => {
        const {
          client, mock, apiUrl, bearerToken,
          teamName, pipelineName, resourceName
        } = buildValidTeamPipelineResourceClient()

        mock.onPut(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/` +
          `resources/${resourceName}/unpause`)
          .reply(200)

        await client.unpause()
        expect(mock.history.put).to.have.length(1)

        const call = mock.history.put[0]
        expect(call.url)
          .to.eql(
            `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/` +
          `resources/${resourceName}/unpause`)
        expect(call.headers)
          .to.include(bearerAuthHeader(bearerToken))
      })

    it('throws the underlying http client exception on failure',
      async () => {
        const { client, mock, apiUrl, teamName, pipelineName, resourceName } =
          buildValidTeamPipelineResourceClient()

        mock.onPut(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
          `/resources/${resourceName}/unpause`)
          .networkError()

        try {
          await client.unpause()
        } catch (e) {
          expect(e).to.be.instanceOf(Error)
          expect(e.message).to.eql('Network Error')
        }
      })
  })

  describe('listVersions', () => {
    it('gets all versions for team',
      async () => {
        const {
          client, mock, apiUrl, bearerToken,
          teamName, pipelineName, resourceName
        } = buildValidTeamPipelineResourceClient()

        const versionData = data.randomResourceVersion()

        const versionFromApi = build.api.resourceVersion(versionData)
        const versionsFromApi = [versionFromApi]

        const convertedVersion = build.client.resourceVersion(versionData)
        const expectedVersions = [convertedVersion]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
          `/resources/${resourceName}/versions`,
          {
            headers: {
              ...bearerAuthHeader(bearerToken)
            }
          })
          .reply(200, versionsFromApi)

        const actualVersions = await client.listVersions()

        expect(actualVersions).to.eql(expectedVersions)
      })

    it('uses provided page options when supplied',
      async () => {
        const {
          client, mock, apiUrl, bearerToken,
          teamName, pipelineName, resourceName
        } = buildValidTeamPipelineResourceClient()

        const versionData = data.randomResourceVersion({ teamName })

        const versionFromApi = build.api.resourceVersion(versionData)
        const versionsFromApi = [versionFromApi]

        const convertedVersion = build.client.resourceVersion(versionData)
        const expectedVersions = [convertedVersion]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
          `/resources/${resourceName}/versions`,
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
          .reply(200, versionsFromApi)

        const actualVersions = await client.listVersions({
          limit: 20,
          since: 123,
          until: 456
        })

        expect(actualVersions).to.eql(expectedVersions)
      })

    it('throws an exception if the value provided for limit is not a number',
      async () => {
        const { client } = buildValidTeamPipelineResourceClient()
        await forInstance(client)
          .onCallOf('listVersions')
          .withArguments({ limit: 'badger' })
          .throwsError('Invalid parameter(s): ["limit" must be a number].')
      })

    it('throws an exception if the value provided for limit is not an integer',
      async () => {
        const { client } = buildValidTeamPipelineResourceClient()
        await forInstance(client)
          .onCallOf('listVersions')
          .withArguments({ limit: 32.654 })
          .throwsError('Invalid parameter(s): ["limit" must be an integer].')
      })

    it('throws an exception if the value provided for limit is less than 1',
      async () => {
        const { client } = buildValidTeamPipelineResourceClient()
        await forInstance(client)
          .onCallOf('listVersions')
          .withArguments({ limit: -20 })
          .throwsError(
            'Invalid parameter(s): [' +
            '"limit" must be larger than or equal to 1].')
      })

    it('throws an exception if the value provided for since is not a number',
      async () => {
        const { client } = buildValidTeamPipelineResourceClient()
        await forInstance(client)
          .onCallOf('listVersions')
          .withArguments({ since: 'badger' })
          .throwsError('Invalid parameter(s): ["since" must be a number].')
      })

    it('throws an exception if the value provided for since is not an integer',
      async () => {
        const { client } = buildValidTeamPipelineResourceClient()
        await forInstance(client)
          .onCallOf('listVersions')
          .withArguments({ since: 32.654 })
          .throwsError('Invalid parameter(s): ["since" must be an integer].')
      })

    it('throws an exception if the value provided for since is less than 1',
      async () => {
        const { client } = buildValidTeamPipelineResourceClient()
        await forInstance(client)
          .onCallOf('listVersions')
          .withArguments({ since: -20 })
          .throwsError(
            'Invalid parameter(s): [' +
            '"since" must be larger than or equal to 1].')
      })

    it('throws an exception if the value provided for until is not a number',
      async () => {
        const { client } = buildValidTeamPipelineResourceClient()
        await forInstance(client)
          .onCallOf('listVersions')
          .withArguments({ until: 'badger' })
          .throwsError('Invalid parameter(s): ["until" must be a number].')
      })

    it('throws an exception if the value provided for until is not an integer',
      async () => {
        const { client } = buildValidTeamPipelineResourceClient()
        await forInstance(client)
          .onCallOf('listVersions')
          .withArguments({ until: 32.654 })
          .throwsError('Invalid parameter(s): ["until" must be an integer].')
      })

    it('throws an exception if the value provided for until is less than 1',
      async () => {
        const { client } = buildValidTeamPipelineResourceClient()
        await forInstance(client)
          .onCallOf('listVersions')
          .withArguments({ until: -20 })
          .throwsError(
            'Invalid parameter(s): [' +
            '"until" must be larger than or equal to 1].')
      })
  })

  describe('getVersion', () => {
    it('throws an exception if the version ID is not provided',
      async () => {
        const { client } = buildValidTeamPipelineResourceClient()
        await forInstance(client)
          .onCallOf('getVersion')
          .withNoArguments()
          .throwsError('Invalid parameter(s): ["versionId" is required].')
      })

    it('throws an exception if the version ID is not an integer',
      async () => {
        const { client } = buildValidTeamPipelineResourceClient()
        await forInstance(client)
          .onCallOf('getVersion')
          .withArguments('wat')
          .throwsError(
            'Invalid parameter(s): ["versionId" must be a number].')
      })

    it('throws an exception if the version ID is negative',
      async () => {
        const { client } = buildValidTeamPipelineResourceClient()
        await forInstance(client)
          .onCallOf('getVersion')
          .withArguments(-21)
          .throwsError(
            'Invalid parameter(s): ' +
            '["versionId" must be larger than or equal to 1].')
      })

    it('gets the resource version with the specified ID',
      async () => {
        const {
          client, mock, apiUrl, bearerToken,
          teamName, pipelineName, resourceName
        } = buildValidTeamPipelineResourceClient()

        const versionId = data.randomId()
        const versionData = data.randomResourceVersion({
          id: versionId
        })

        const versionFromApi = build.api.resourceVersion(versionData)

        const expectedVersion = build.client.resourceVersion(versionData)

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
          `/resources/${resourceName}/versions/${versionId}`,
          {
            headers: {
              ...bearerAuthHeader(bearerToken)
            }
          })
          .reply(200, versionFromApi)

        const actualVersion = await client.getVersion(versionId)

        expect(actualVersion).to.eql(expectedVersion)
      })
  })

  describe('forVersion', () => {
    it('returns a client for the team pipeline resource version with the ' +
      'supplied ID when the version exists',
    () => {
      const {
        client, httpClient, apiUrl,
        teamName, pipelineName, resourceName
      } = buildValidTeamPipelineResourceClient()

      const versionId = data.randomId()

      const teamPipelineResourceClient = client.forVersion(versionId)

      expect(teamPipelineResourceClient.apiUrl).to.equal(apiUrl)
      expect(teamPipelineResourceClient.httpClient).to.equal(httpClient)
      expect(teamPipelineResourceClient.teamName).to.eql(teamName)
      expect(teamPipelineResourceClient.pipelineName).to.eql(pipelineName)
      expect(teamPipelineResourceClient.resourceName).to.eql(resourceName)
      expect(teamPipelineResourceClient.versionId).to.eql(versionId)
    })
  })
})
