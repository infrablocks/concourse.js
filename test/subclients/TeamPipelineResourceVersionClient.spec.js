import { onConstructionOf } from '../testsupport/dsls/construction'
import TeamPipelineResourceVersionClient
  from '../../src/subclients/TeamPipelineResourceVersionClient'
import data from '../testsupport/data'
import axios from 'axios'
import faker from 'faker'
import build from '../testsupport/builders'
import { bearerAuthHeader } from '../../src/support/http/headers'
import { expect } from 'chai'
import MockAdapter from 'axios-mock-adapter'

const buildValidTeamPipelineResourceVersionClient = () => {
  const apiUrl = data.randomApiUrl()
  const bearerToken = data.randomBearerToken()

  const httpClient = axios.create({
    headers: bearerAuthHeader(bearerToken)
  })
  const mock = new MockAdapter(httpClient)

  const team = build.client.team(data.randomTeam())
  const pipeline = build.client.pipeline(data.randomPipeline())
  const resource = build.client.resource(data.randomResource())
  const version = build.client.resourceVersion(data.randomResourceVersion())

  const client = new TeamPipelineResourceVersionClient({
    apiUrl, httpClient, team, pipeline, resource, version
  })

  return {
    client,
    httpClient,
    mock,
    apiUrl,
    bearerToken,
    team,
    pipeline,
    resource,
    version
  }
}

describe('TeamPipelineResourceVersionClient', () => {
  describe('construction', () => {
    it('throws an exception if the API URI is not provided', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          team: data.randomTeam(),
          pipeline: data.randomPipeline(),
          resource: data.randomResource(),
          version: data.randomResourceVersion(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" is required].')
    })

    it('throws an exception if the API URI is not a string', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          apiUrl: 25,
          team: data.randomTeam(),
          pipeline: data.randomPipeline(),
          resource: data.randomResource(),
          version: data.randomResourceVersion(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a string].')
    })

    it('throws an exception if the API URI is not a valid URI', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          apiUrl: 'spinach',
          team: data.randomTeam(),
          pipeline: data.randomPipeline(),
          resource: data.randomResource(),
          version: data.randomResourceVersion(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a valid uri].')
    })

    it('throws an exception if the provided HTTP client is not an object',
      () => {
        onConstructionOf(TeamPipelineResourceVersionClient)
          .withArguments({
            httpClient: 35,
            team: data.randomTeam(),
            pipeline: data.randomPipeline(),
            resource: data.randomResource(),
            version: data.randomResourceVersion(),
            apiUrl: faker.internet.url()
          })
          .throwsError(
            'Invalid parameter(s): ["httpClient" must be a Function].')
      })

    it('throws an exception if the team is not provided', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          pipeline: data.randomPipeline(),
          resource: data.randomResource(),
          version: data.randomResourceVersion()
        })
        .throwsError('Invalid parameter(s): ["team" is required].')
    })

    it('throws an exception if the team is not an object', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          team: 'wat',
          apiUrl: faker.internet.url(),
          httpClient: axios,
          pipeline: data.randomPipeline(),
          resource: data.randomResource(),
          version: data.randomResourceVersion()
        })
        .throwsError('Invalid parameter(s): ["team" must be an object].')
    })

    it('throws an exception if the pipeline is not provided', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam(),
          resource: data.randomResource(),
          version: data.randomResourceVersion()
        })
        .throwsError('Invalid parameter(s): ["pipeline" is required].')
    })

    it('throws an exception if the pipeline is not an object', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          pipeline: 'wat',
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam(),
          resource: data.randomResource(),
          version: data.randomResourceVersion()
        })
        .throwsError('Invalid parameter(s): ["pipeline" must be an object].')
    })

    it('throws an exception if the resource is not provided', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam(),
          pipeline: data.randomPipeline(),
          version: data.randomResourceVersion()
        })
        .throwsError('Invalid parameter(s): ["resource" is required].')
    })

    it('throws an exception if the resource is not an object', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          resource: 'wat',
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam(),
          pipeline: data.randomPipeline(),
          version: data.randomResourceVersion()
        })
        .throwsError('Invalid parameter(s): ["resource" must be an object].')
    })

    it('throws an exception if the version is not provided', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam(),
          pipeline: data.randomPipeline(),
          resource: data.randomResource()
        })
        .throwsError('Invalid parameter(s): ["version" is required].')
    })

    it('throws an exception if the version is not an object', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          version: 'wat',
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam(),
          pipeline: data.randomPipeline(),
          resource: data.randomResource()
        })
        .throwsError('Invalid parameter(s): ["version" must be an object].')
    })
  })

  describe('getCausality', () => {
    it('gets the causality of the resource version',
      async () => {
        const {
          client, mock, apiUrl, bearerToken, team, pipeline, resource, version
        } = buildValidTeamPipelineResourceVersionClient()

        const teamName = team.name
        const pipelineName = pipeline.name
        const resourceName = resource.name
        const versionId = version.id

        const causeData = data.randomResourceVersionCause({
          versionedResourceId: versionId
        })

        const causeFromApi =
          build.api.resourceVersionCause(causeData)
        const causalityFromApi = [causeFromApi]

        const expectedCause =
          build.client.resourceVersionCause(causeData)
        const expectedCausality = [expectedCause]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
          `/resources/${resourceName}/versions/${versionId}/causality`,
          {
            headers: {
              ...bearerAuthHeader(bearerToken)
            }
          })
          .reply(200, causalityFromApi)

        const actualCausality = await client.getCausality()

        expect(actualCausality).to.eql(expectedCausality)
      })
  })
})
