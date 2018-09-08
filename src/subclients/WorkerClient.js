import {
  func,
  object,
  schemaFor,
  uri,
  validateOptions
} from '../support/validation'
import { workerPruneUrl } from '../support/urls'

export default class WorkerClient {
  constructor (options) {
    const validatedOptions = validateOptions(
      schemaFor({
        apiUrl: uri().required(),
        httpClient: func().required(),
        worker: object().required()
      }), options)

    this.apiUrl = validatedOptions.apiUrl
    this.httpClient = validatedOptions.httpClient
    this.worker = validatedOptions.worker
  }

  async prune () {
    await this.httpClient.put(
      workerPruneUrl(
        this.apiUrl,
        this.worker.name))
  }
}
