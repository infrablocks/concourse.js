import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { onConstructionOf } from '../testsupport/dsls/construction'
import WorkerClient from '../../src/subclients/WorkerClient'
import data from '../testsupport/data'
import axios from 'axios'
import faker from 'faker'
import { bearerAuthorizationHeader } from '../../src/support/http/headers'
import { expect } from 'chai'
import MockAdapter from 'axios-mock-adapter'

const buildValidWorkerClient = () => {
  const apiUrl = data.randomApiUrl()
  const bearerToken = data.randomBearerTokenPre4()

  const httpClient = axios.create({
    headers: bearerAuthorizationHeader(bearerToken)
  })
  const mock = new MockAdapter(httpClient)

  const workerName = data.randomWorkerName()

  const client = new WorkerClient({ apiUrl, httpClient, workerName })

  return {
    client,
    httpClient,
    mock,
    apiUrl,
    bearerToken,
    workerName
  }
}

describe('WorkerClient', () => {
  describe('construction', () => {
    it('throws an exception if the API URI is not provided', () => {
      onConstructionOf(WorkerClient)
        .withArguments({
          worker: data.randomWorker(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" is required].')
    })

    it('throws an exception if the API URI is not a string', () => {
      onConstructionOf(WorkerClient)
        .withArguments({
          apiUrl: 25,
          worker: data.randomWorker(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a string].')
    })

    it('throws an exception if the API URI is not a valid URI', () => {
      onConstructionOf(WorkerClient)
        .withArguments({
          apiUrl: 'spinach',
          worker: data.randomWorker(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a valid uri].')
    })

    it('throws an exception if the provided HTTP client is not an object',
      () => {
        onConstructionOf(WorkerClient)
          .withArguments({
            worker: data.randomWorker(),
            apiUrl: faker.internet.url(),
            httpClient: 35
          })
          .throwsError(
            'Invalid parameter(s): ["httpClient" must be of type function].')
      })

    it('throws an exception if the worker name is not provided', () => {
      onConstructionOf(WorkerClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["workerName" is required].')
    })

    it('throws an exception if the worker name is not a string', () => {
      onConstructionOf(WorkerClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          workerName: 123
        })
        .throwsError('Invalid parameter(s): ["workerName" must be a string].')
    })
  })

  describe('prune', () => {
    it('prunes the pipeline with the specified name',
      async () => {
        const { client, mock, apiUrl, bearerToken, workerName } =
          buildValidWorkerClient()

        mock.onPut(`${apiUrl}/workers/${workerName}/prune`)
          .reply(204)

        await client.prune()
        expect(mock.history.put).to.have.length(1)

        const call = mock.history.put[0]
        expect(call.url)
          .to.eql(`${apiUrl}/workers/${workerName}/prune`)
        expect(call.headers)
          .to.include(bearerAuthorizationHeader(bearerToken))
      })

    it('throws the underlying http client exception on failure',
      async () => {
        const { client, mock, apiUrl, workerName } =
          buildValidWorkerClient()

        mock.onPut(`${apiUrl}/workers/${workerName}/prune`)
          .networkError()

        try {
          await client.prune()
        } catch (e) {
          expect(e).to.be.instanceOf(Error)
          expect(e.message).to.eql('Network Error')
        }
      })
  })
})
