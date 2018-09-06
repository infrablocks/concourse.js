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

  const team = build.client.team(data.randomTeam())
  const pipeline = build.client.pipeline(data.randomPipeline())
  const resource = build.client.resource(data.randomResource())

  const client = new TeamPipelineResourceClient({
    apiUrl, httpClient, team, pipeline, resource
  })

  return {
    client,
    httpClient,
    mock,
    apiUrl,
    bearerToken,
    team,
    pipeline,
    resource
  }
}

describe('TeamPipelineResourceClient', () => {
  describe('construction', () => {
    it('throws an exception if the API URI is not provided', () => {
      onConstructionOf(TeamPipelineResourceClient)
        .withArguments({
          team: data.randomTeam(),
          pipeline: data.randomPipeline(),
          resource: data.randomResource(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" is required].')
    })

    it('throws an exception if the API URI is not a string', () => {
      onConstructionOf(TeamPipelineResourceClient)
        .withArguments({
          apiUrl: 25,
          team: data.randomTeam(),
          pipeline: data.randomPipeline(),
          resource: data.randomResource(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a string].')
    })

    it('throws an exception if the API URI is not a valid URI', () => {
      onConstructionOf(TeamPipelineResourceClient)
        .withArguments({
          apiUrl: 'spinach',
          team: data.randomTeam(),
          pipeline: data.randomPipeline(),
          resource: data.randomResource(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a valid uri].')
    })

    it('throws an exception if the provided HTTP client is not an object',
      () => {
        onConstructionOf(TeamPipelineResourceClient)
          .withArguments({
            httpClient: 35,
            team: data.randomTeam(),
            pipeline: data.randomPipeline(),
            resource: data.randomResource(),
            apiUrl: faker.internet.url()
          })
          .throwsError(
            'Invalid parameter(s): ["httpClient" must be a Function].')
      })

    it('throws an exception if the team is not provided', () => {
      onConstructionOf(TeamPipelineResourceClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          pipeline: data.randomPipeline(),
          resource: data.randomResource()
        })
        .throwsError('Invalid parameter(s): ["team" is required].')
    })

    it('throws an exception if the team is not an object', () => {
      onConstructionOf(TeamPipelineResourceClient)
        .withArguments({
          team: 'wat',
          apiUrl: faker.internet.url(),
          httpClient: axios,
          pipeline: data.randomPipeline(),
          resource: data.randomResource()
        })
        .throwsError('Invalid parameter(s): ["team" must be an object].')
    })

    it('throws an exception if the pipeline is not provided', () => {
      onConstructionOf(TeamPipelineResourceClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam(),
          resource: data.randomResource()
        })
        .throwsError('Invalid parameter(s): ["pipeline" is required].')
    })

    it('throws an exception if the pipeline is not an object', () => {
      onConstructionOf(TeamPipelineResourceClient)
        .withArguments({
          pipeline: 'wat',
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam(),
          resource: data.randomResource()
        })
        .throwsError('Invalid parameter(s): ["pipeline" must be an object].')
    })

    it('throws an exception if the resource is not provided', () => {
      onConstructionOf(TeamPipelineResourceClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam(),
          pipeline: data.randomPipeline()
        })
        .throwsError('Invalid parameter(s): ["resource" is required].')
    })

    it('throws an exception if the pipeline is not an object', () => {
      onConstructionOf(TeamPipelineResourceClient)
        .withArguments({
          resource: 'wat',
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam(),
          pipeline: data.randomPipeline()
        })
        .throwsError('Invalid parameter(s): ["resource" must be an object].')
    })
  })

  describe('listVersions', () => {
    it('gets all versions for team',
      async () => {
        const { client, mock, apiUrl, bearerToken, team, pipeline, resource } =
          buildValidTeamPipelineResourceClient()

        const versionData = data.randomResourceVersion()

        const versionFromApi = build.api.resourceVersion(versionData)
        const versionsFromApi = [versionFromApi]

        const convertedVersion = build.client.resourceVersion(versionData)
        const expectedVersions = [convertedVersion]

        mock.onGet(
          `${apiUrl}/teams/${team.name}/pipelines/${pipeline.name}` +
          `/resources/${resource.name}/versions`,
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
        const { client, mock, apiUrl, bearerToken, team, pipeline, resource } =
          buildValidTeamPipelineResourceClient()

        const teamName = team.name

        const versionData = data.randomResourceVersion({ teamName })

        const versionFromApi = build.api.resourceVersion(versionData)
        const versionsFromApi = [versionFromApi]

        const convertedVersion = build.client.resourceVersion(versionData)
        const expectedVersions = [convertedVersion]

        mock.onGet(
          `${apiUrl}/teams/${team.name}/pipelines/${pipeline.name}` +
          `/resources/${resource.name}/versions`,
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
})
