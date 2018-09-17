import {
  func,
  integer,
  schemaFor,
  uri,
  validateOptions
} from '../support/validation'
import { buildResourcesUrl } from '../support/urls'
import { parseJson } from '../support/http/transformers'
import camelcaseKeysDeep from 'camelcase-keys-deep'

export default class BuildClient {
  constructor (options) {
    const validatedOptions = validateOptions(
      schemaFor({
        apiUrl: uri().required(),
        httpClient: func().required(),
        buildId: integer().min(1).required()
      }), options)

    this.apiUrl = validatedOptions.apiUrl
    this.httpClient = validatedOptions.httpClient
    this.buildId = validatedOptions.buildId
  }

  async listResources () {
    const { data: resources } = await this.httpClient
      .get(
        buildResourcesUrl(this.apiUrl, this.buildId),
        { transformResponse: [parseJson, camelcaseKeysDeep] })

    return resources
  }
}
