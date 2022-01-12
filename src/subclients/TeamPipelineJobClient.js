import {
  func,
  schemaFor,
  string,
  uri,
  validateOptions
} from '../support/validation.js'
import {
  teamPipelineJobBuildsUrl,
  teamPipelineJobBuildUrl,
  teamPipelineJobInputsUrl,
  teamPipelineJobPauseUrl,
  teamPipelineJobUnpauseUrl
} from '../support/urls.js'
import { parseJson } from '../support/http/transformers.js'
import camelcaseKeysDeep from 'camelcase-keys-deep'

class TeamPipelineJobClient {
  constructor (options) {
    const validatedOptions = validateOptions(
      schemaFor({
        apiUrl: uri().required(),
        httpClient: func().required(),
        teamName: string().required(),
        pipelineName: string().required(),
        jobName: string().required()
      }), options)

    this.apiUrl = validatedOptions.apiUrl
    this.httpClient = validatedOptions.httpClient
    this.teamName = validatedOptions.teamName
    this.pipelineName = validatedOptions.pipelineName
    this.jobName = validatedOptions.jobName
  }

  async pause () {
    await this.httpClient.put(
      teamPipelineJobPauseUrl(
        this.apiUrl,
        this.teamName,
        this.pipelineName,
        this.jobName))
  }

  async unpause () {
    await this.httpClient.put(
      teamPipelineJobUnpauseUrl(
        this.apiUrl,
        this.teamName,
        this.pipelineName,
        this.jobName))
  }

  async listBuilds () {
    const { data: builds } = await this.httpClient
      .get(
        teamPipelineJobBuildsUrl(
          this.apiUrl, this.teamName, this.pipelineName, this.jobName),
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
          this.teamName,
          this.pipelineName,
          this.jobName,
          validatedOptions.buildName),
        { transformResponse: [parseJson, camelcaseKeysDeep] })

    return build
  }

  async createJobBuild () {
    const { data: build } = await this.httpClient
      .post(
        teamPipelineJobBuildsUrl(
          this.apiUrl,
          this.teamName,
          this.pipelineName,
          this.jobName),
        undefined,
        { transformResponse: [parseJson, camelcaseKeysDeep] }
      )

    return build
  }

  async listInputs () {
    const { data: inputs } = await this.httpClient
      .get(
        teamPipelineJobInputsUrl(
          this.apiUrl, this.teamName, this.pipelineName, this.jobName),
        { transformResponse: [parseJson, camelcaseKeysDeep] })

    return inputs
  }
}

export default TeamPipelineJobClient
