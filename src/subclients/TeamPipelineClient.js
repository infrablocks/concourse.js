import {
  func,
  object,
  schemaFor,
  uri,
  validateOptions
} from '../support/validation'
import { teamPipelineJobsUrl } from '../support/urls'
import { parseJson } from '../support/http/transformers'
import camelcaseKeysDeep from 'camelcase-keys-deep'

class TeamPipelineClient {
  constructor (options) {
    const validatedOptions = validateOptions(
      schemaFor({
        apiUrl: uri().required(),
        httpClient: func().required(),
        team: object().required(),
        pipeline: object().required()
      }), options)

    this.apiUrl = validatedOptions.apiUrl
    this.httpClient = validatedOptions.httpClient
    this.team = validatedOptions.team
    this.pipeline = validatedOptions.pipeline
  }

  async listJobs () {
    const {data: jobs} = await this.httpClient
      .get(
        teamPipelineJobsUrl(this.apiUrl, this.team.name, this.pipeline.name),
        {transformResponse: [parseJson, camelcaseKeysDeep]})

    return jobs
  }
}

export default TeamPipelineClient
