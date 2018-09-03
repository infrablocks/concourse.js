import {
  func,
  object,
  schemaFor, string,
  uri,
  validateOptions
} from '../support/validation'
import {
  teamPipelineJobBuildsUrl,
  teamPipelineJobBuildUrl,
} from '../support/urls'
import { parseJson } from '../support/http/transformers'
import camelcaseKeysDeep from 'camelcase-keys-deep'

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

  async listBuilds () {
    const { data: builds } = await this.httpClient
      .get(
        teamPipelineJobBuildsUrl(
          this.apiUrl, this.team.name, this.pipeline.name, this.job.name),
        { transformResponse: [parseJson, camelcaseKeysDeep] })

    return builds
  }

  async getBuild (buildName) {
    const validatedOptions = validateOptions(
      schemaFor({
        buildName: string().required()
      }), { buildName })

    const { data: build } = await this.httpClient
      .get(
        teamPipelineJobBuildUrl(
          this.apiUrl,
          this.team.name,
          this.pipeline.name,
          this.job.name,
          validatedOptions.buildName),
        { transformResponse: [parseJson, camelcaseKeysDeep] })

    return build
  }
}

export default TeamPipelineJobClient
