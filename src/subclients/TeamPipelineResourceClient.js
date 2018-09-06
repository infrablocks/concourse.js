import {
  func, integer,
  object,
  schemaFor,
  uri,
  validateOptions
} from '../support/validation'
import { isNil, reject } from 'ramda'
import { teamPipelineResourceVersionsUrl } from '../support/urls'
import { parseJson } from '../support/http/transformers'
import camelcaseKeysDeep from 'camelcase-keys-deep'

class TeamPipelineResourceClient {
  constructor (options) {
    const validatedOptions = validateOptions(
      schemaFor({
        apiUrl: uri().required(),
        httpClient: func().required(),
        team: object().required(),
        pipeline: object().required(),
        resource: object().required()
      }), options)

    this.apiUrl = validatedOptions.apiUrl
    this.httpClient = validatedOptions.httpClient
    this.team = validatedOptions.team
    this.pipeline = validatedOptions.pipeline
    this.resource = validatedOptions.resource
  }

  async listVersions (options = {}) {
    const validatedOptions = validateOptions(
      schemaFor({
        limit: integer().min(1),
        since: integer().min(1),
        until: integer().min(1)
      }), options)

    const params = reject(isNil, {
      limit: validatedOptions.limit,
      since: validatedOptions.since,
      until: validatedOptions.until
    })

    const { data: builds } = await this.httpClient
      .get(teamPipelineResourceVersionsUrl(
        this.apiUrl, this.team.name, this.pipeline.name, this.resource.name),
      { params, transformResponse: [parseJson, camelcaseKeysDeep] })

    return builds
  }
}

export default TeamPipelineResourceClient
