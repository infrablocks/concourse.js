import {
  func,
  object,
  schemaFor,
  uri,
  validateOptions
} from '../support/validation'

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
}

export default TeamPipelineResourceVersionClient
