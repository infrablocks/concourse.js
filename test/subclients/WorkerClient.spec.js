import { onConstructionOf } from '../testsupport/dsls/construction'
import WorkerClient from '../../src/subclients/WorkerClient'
import data from '../testsupport/data'
import axios from 'axios'
import faker from 'faker'
import { bearerAuthHeader } from '../../src/support/http/headers'
import { expect } from 'chai'
import MockAdapter from 'axios-mock-adapter'
import build from '../testsupport/builders'

const buildValidWorkerClient = () => {
  const apiUrl = data.randomApiUrl()
  const bearerToken = data.randomBearerToken()

  const httpClient = axios.create({
    headers: bearerAuthHeader(bearerToken)
  })
  const mock = new MockAdapter(httpClient)

  const worker = build.client.worker(data.randomWorker())

  const client = new WorkerClient({ apiUrl, httpClient, worker })

  return {
    client,
    httpClient,
    mock,
    apiUrl,
    bearerToken,
    worker
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
            'Invalid parameter(s): ["httpClient" must be a Function].')
      })

    it('throws an exception if the worker is not provided', () => {
      onConstructionOf(WorkerClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["worker" is required].')
    })

    it('throws an exception if the worker is not an object', () => {
      onConstructionOf(WorkerClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          worker: 'wat'
        })
        .throwsError('Invalid parameter(s): ["worker" must be an object].')
    })
  })

  describe('prune', () => {
    it('prunes the pipeline with the specified name',
      async () => {
        const { client, mock, apiUrl, bearerToken, worker } =
          buildValidWorkerClient()

        const workerName = worker.name

        mock.onPut(`${apiUrl}/workers/${workerName}/prune`)
          .reply(204)

        await client.prune()
        expect(mock.history.put).to.have.length(1)

        const call = mock.history.put[0]
        expect(call.url)
          .to.eql(`${apiUrl}/workers/${workerName}/prune`)
        expect(call.headers)
          .to.include(bearerAuthHeader(bearerToken))
      })

    it('throws the underlying http client exception on failure',
      async () => {
        const { client, mock, apiUrl, worker } =
          buildValidWorkerClient()

        const workerName = worker.name

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
