import {
  func,
  object,
  schemaFor,
  uri,
  validateOptions
} from '../support/validation'
import {
  teamPipelineResourceVersionCausalityUrl
} from '../support/urls'
import { parseJson } from '../support/http/transformers'
import camelcaseKeysDeep from 'camelcase-keys-deep'

class TeamPipelineResourceVersionClient {
  constructor (options) {
    const validatedOptions = validateOptions(
      schemaFor({
        apiUrl: uri().required(),
        httpClient: func().required(),
        team: object().required(),
        pipeline: object().required(),
        resource: object().required(),
        version: object().required()
      }), options)

    this.apiUrl = validatedOptions.apiUrl
    this.httpClient = validatedOptions.httpClient
    this.team = validatedOptions.team
    this.pipeline = validatedOptions.pipeline
    this.resource = validatedOptions.resource
    this.version = validatedOptions.version
  }

  async getCausality () {
    const { data: causality } = await this.httpClient
      .get(
        teamPipelineResourceVersionCausalityUrl(
          this.apiUrl,
          this.team.name,
          this.pipeline.name,
          this.resource.name,
          this.version.id),
        { transformResponse: [parseJson, camelcaseKeysDeep] })

    return causality
  }
}

export default TeamPipelineResourceVersionClient
