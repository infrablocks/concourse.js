import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { onConstructionOf } from '../testsupport/dsls/construction'
import TeamPipelineResourceVersionClient
  from '../../src/subclients/TeamPipelineResourceVersionClient'
import data from '../testsupport/data'
import axios from 'axios'
import faker from 'faker'
import build from '../testsupport/builders'
import { bearerAuthorizationHeader } from '../../src/support/http/headers'
import { expect } from 'chai'
import MockAdapter from 'axios-mock-adapter'

const buildValidTeamPipelineResourceVersionClient = () => {
  const apiUrl = data.randomApiUrl()
  const bearerToken = data.randomBearerTokenPre4()

  const httpClient = axios.create({
    headers: bearerAuthorizationHeader(bearerToken)
  })
  const mock = new MockAdapter(httpClient)

  const teamName = data.randomTeamName()
  const pipelineName = data.randomPipelineName()
  const resourceName = data.randomResourceName()
  const versionId = data.randomResourceVersionId()

  const client = new TeamPipelineResourceVersionClient({
    apiUrl, httpClient, teamName, pipelineName, resourceName, versionId
  })

  return {
    client,
    httpClient,
    mock,
    apiUrl,
    bearerToken,
    teamName,
    pipelineName,
    resourceName,
    versionId
  }
}

describe('TeamPipelineResourceVersionClient', () => {
  describe('construction', () => {
    it('throws an exception if the API URI is not provided', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName(),
          resourceName: data.randomResourceName(),
          versionId: data.randomResourceVersionId(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" is required].')
    })

    it('throws an exception if the API URI is not a string', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          apiUrl: 25,
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName(),
          resourceName: data.randomResourceName(),
          versionId: data.randomResourceVersionId(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a string].')
    })

    it('throws an exception if the API URI is not a valid URI', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          apiUrl: 'spinach',
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName(),
          resourceName: data.randomResourceName(),
          versionId: data.randomResourceVersionId(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a valid uri].')
    })

    it('throws an exception if the provided HTTP client is not an object',
      () => {
        onConstructionOf(TeamPipelineResourceVersionClient)
          .withArguments({
            httpClient: 35,
            teamName: data.randomTeamName(),
            pipelineName: data.randomPipelineName(),
            resourceName: data.randomResourceName(),
            versionId: data.randomResourceVersionId(),
            apiUrl: faker.internet.url()
          })
          .throwsError(
            'Invalid parameter(s): ["httpClient" must be of type function].')
      })

    it('throws an exception if the team name is not provided', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          pipelineName: data.randomPipelineName(),
          resourceName: data.randomResourceName(),
          versionId: data.randomResourceVersionId()
        })
        .throwsError('Invalid parameter(s): ["teamName" is required].')
    })

    it('throws an exception if the team name is not a string', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          teamName: 123,
          apiUrl: faker.internet.url(),
          httpClient: axios,
          pipelineName: data.randomPipelineName(),
          resourceName: data.randomResourceName(),
          versionId: data.randomResourceVersionId()
        })
        .throwsError('Invalid parameter(s): ["teamName" must be a string].')
    })

    it('throws an exception if the pipeline name is not provided', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          teamName: data.randomTeamName(),
          resourceName: data.randomResourceName(),
          versionId: data.randomResourceVersionId()
        })
        .throwsError('Invalid parameter(s): ["pipelineName" is required].')
    })

    it('throws an exception if the pipeline name is not a string', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          pipelineName: 123,
          apiUrl: faker.internet.url(),
          httpClient: axios,
          teamName: data.randomTeamName(),
          resourceName: data.randomResourceName(),
          versionId: data.randomResourceVersionId()
        })
        .throwsError('Invalid parameter(s): ["pipelineName" must be a string].')
    })

    it('throws an exception if the resource name is not provided', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName(),
          versionId: data.randomResourceVersionId()
        })
        .throwsError('Invalid parameter(s): ["resourceName" is required].')
    })

    it('throws an exception if the resource name is not a string', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          resourceName: 123,
          apiUrl: faker.internet.url(),
          httpClient: axios,
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName(),
          versionId: data.randomResourceVersionId()
        })
        .throwsError('Invalid parameter(s): ["resourceName" must be a string].')
    })

    it('throws an exception if the version ID is not provided', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName(),
          resourceName: data.randomResourceName()
        })
        .throwsError('Invalid parameter(s): ["versionId" is required].')
    })

    it('throws an exception if the version ID is not a number', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          versionId: 'wat',
          apiUrl: faker.internet.url(),
          httpClient: axios,
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName(),
          resourceName: data.randomResourceName()
        })
        .throwsError('Invalid parameter(s): ["versionId" must be a number].')
    })

    it('throws an exception if the version ID is not an integer', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          versionId: 1.1,
          apiUrl: faker.internet.url(),
          httpClient: axios,
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName(),
          resourceName: data.randomResourceName()
        })
        .throwsError('Invalid parameter(s): ["versionId" must be an integer].')
    })

    it('throws an exception if the version ID is not positive', () => {
      onConstructionOf(TeamPipelineResourceVersionClient)
        .withArguments({
          versionId: -6,
          apiUrl: faker.internet.url(),
          httpClient: axios,
          teamName: data.randomTeamName(),
          pipelineName: data.randomPipelineName(),
          resourceName: data.randomResourceName()
        })
        .throwsError(
          'Invalid parameter(s): ' +
          '["versionId" must be greater than or equal to 1].')
    })
  })

  describe('getCausality', () => {
    it('gets the causality of the resource version',
      async () => {
        const {
          client, mock, apiUrl, bearerToken,
          teamName, pipelineName, resourceName, versionId
        } = buildValidTeamPipelineResourceVersionClient()

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
              ...bearerAuthorizationHeader(bearerToken)
            }
          })
          .reply(200, causalityFromApi)

        const actualCausality = await client.getCausality()

        expect(actualCausality).to.eql(expectedCausality)
      })
  })

  describe('listBuildsWithVersionAsInput', () => {
    it('lists the builds where this version is an input',
      async () => {
        const {
          client, mock, apiUrl, bearerToken,
          teamName, pipelineName, resourceName, versionId
        } = buildValidTeamPipelineResourceVersionClient()

        const buildId = data.randomBuildId()
        const buildData = data.randomBuild({
          teamName,
          pipelineName,
          id: buildId
        })

        const buildFromApi =
          build.api.build(buildData)
        const buildsFromApi = [buildFromApi]

        const expectedBuild =
          build.client.build(buildData)
        const expectedBuilds = [expectedBuild]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
          `/resources/${resourceName}/versions/${versionId}/input_to`,
          {
            headers: {
              ...bearerAuthorizationHeader(bearerToken)
            }
          })
          .reply(200, buildsFromApi)

        const actualBuilds = await client.listBuildsWithVersionAsInput()

        expect(actualBuilds).to.eql(expectedBuilds)
      })
  })

  describe('listBuildsWithVersionAsOutput', () => {
    it('lists the builds where this version is an output',
      async () => {
        const {
          client, mock, apiUrl, bearerToken,
          teamName, pipelineName, resourceName, versionId
        } = buildValidTeamPipelineResourceVersionClient()

        const buildId = data.randomBuildId()
        const buildData = data.randomBuild({
          teamName,
          pipelineName,
          id: buildId
        })

        const buildFromApi =
          build.api.build(buildData)
        const buildsFromApi = [buildFromApi]

        const expectedBuild =
          build.client.build(buildData)
        const expectedBuilds = [expectedBuild]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
          `/resources/${resourceName}/versions/${versionId}/output_of`,
          {
            headers: {
              ...bearerAuthorizationHeader(bearerToken)
            }
          })
          .reply(200, buildsFromApi)

        const actualBuilds = await client.listBuildsWithVersionAsOutput()

        expect(actualBuilds).to.eql(expectedBuilds)
      })
  })
})
