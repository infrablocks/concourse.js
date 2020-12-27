import { onConstructionOf } from '../testsupport/dsls/construction'
import BuildClient from '../../src/subclients/BuildClient'
import data from '../testsupport/data'
import axios from 'axios'
import faker from 'faker'
import build from '../testsupport/builders'
import { bearerAuthorizationHeader } from '../../src/support/http/headers'
import { expect } from 'chai'
import MockAdapter from 'axios-mock-adapter'

const buildValidBuildClient = () => {
  const apiUrl = data.randomApiUrl()
  const bearerToken = data.randomBearerTokenPre4()

  const httpClient = axios.create({
    headers: bearerAuthorizationHeader(bearerToken)
  })
  const mock = new MockAdapter(httpClient)

  const buildId = data.randomBuildId()

  const client = new BuildClient({ apiUrl, httpClient, buildId })

  return {
    client,
    httpClient,
    mock,
    apiUrl,
    bearerToken,
    buildId
  }
}

describe('BuildClient', () => {
  describe('construction', () => {
    it('throws an exception if the API URI is not provided', () => {
      onConstructionOf(BuildClient)
        .withArguments({
          build: data.randomBuild(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" is required].')
    })

    it('throws an exception if the API URI is not a string', () => {
      onConstructionOf(BuildClient)
        .withArguments({
          apiUrl: 25,
          build: data.randomBuild(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a string].')
    })

    it('throws an exception if the API URI is not a valid URI', () => {
      onConstructionOf(BuildClient)
        .withArguments({
          apiUrl: 'spinach',
          build: data.randomBuild(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a valid uri].')
    })

    it('throws an exception if the provided HTTP client is not an object',
      () => {
        onConstructionOf(BuildClient)
          .withArguments({
            build: data.randomBuild(),
            apiUrl: faker.internet.url(),
            httpClient: 35
          })
          .throwsError(
            'Invalid parameter(s): ["httpClient" must be of type function].')
      })

    it('throws an exception if the build ID is not provided', () => {
      onConstructionOf(BuildClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["buildId" is required].')
    })

    it('throws an exception if the build ID is not a number', () => {
      onConstructionOf(BuildClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          buildId: 'wat'
        })
        .throwsError('Invalid parameter(s): ["buildId" must be a number].')
    })

    it('throws an exception if the build ID is not an integer', () => {
      onConstructionOf(BuildClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          buildId: 1.1
        })
        .throwsError('Invalid parameter(s): ["buildId" must be an integer].')
    })

    it('throws an exception if the build ID is not positive', () => {
      onConstructionOf(BuildClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          buildId: -6
        })
        .throwsError(
          'Invalid parameter(s): ' +
          '["buildId" must be greater than or equal to 1].')
    })
  })

  describe('listResources', () => {
    it('gets all resources for build',
      async () => {
        const { client, mock, apiUrl, bearerToken, buildId } =
          buildValidBuildClient()

        const resourceData = data.randomResource()

        const resourceFromApi = build.api.resource(resourceData)
        const resourcesFromApi = [resourceFromApi]

        const convertedResource = build.client.resource(resourceData)
        const expectedResources = [convertedResource]

        mock.onGet(
          `${apiUrl}/builds/${buildId}/resources`,
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
})
