import {
  func,
  object,
  schemaFor,
  uri,
  validateOptions
} from '../support/validation'

class TeamPipelineJobClient {
  constructor (options) {
    const validatedOptions = validateOptions(
      schemaFor({
        apiUrl: uri().required(),
        httpClient: func().required(),
        team: object().required(),
        pipeline: object().required(),
        job: object().required()
      }), options)

    this.apiUrl = validatedOptions.apiUrl
    this.httpClient = validatedOptions.httpClient
    this.team = validatedOptions.team
    this.pipeline = validatedOptions.pipeline
    this.job = validatedOptions.job
  }
}

export default TeamPipelineJobClient
