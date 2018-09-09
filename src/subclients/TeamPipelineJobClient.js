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
  teamPipelineJobInputsUrl,
  teamPipelineJobPauseUrl,
  teamPipelineJobUnpauseUrl
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

  async pause () {
    await this.httpClient.put(
      teamPipelineJobPauseUrl(
        this.apiUrl,
        this.team.name,
        this.pipeline.name,
        this.job.name))
  }

  async unpause () {
    await this.httpClient.put(
      teamPipelineJobUnpauseUrl(
        this.apiUrl,
        this.team.name,
        this.pipeline.name,
        this.job.name))
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

  async listInputs () {
    const { data: inputs } = await this.httpClient
      .get(
        teamPipelineJobInputsUrl(
          this.apiUrl, this.team.name, this.pipeline.name, this.job.name),
        { transformResponse: [parseJson, camelcaseKeysDeep] })

    return inputs
  }
}

export default TeamPipelineJobClient
