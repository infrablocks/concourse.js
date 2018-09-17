import {
  func,
  string,
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
        workerName: string().required()
      }), options)

    this.apiUrl = validatedOptions.apiUrl
    this.httpClient = validatedOptions.httpClient
    this.workerName = validatedOptions.workerName
  }

  async prune () {
    await this.httpClient.put(
      workerPruneUrl(
        this.apiUrl,
        this.workerName))
  }
}
