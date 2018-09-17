import {
  func,
  integer,
  schemaFor,
  string,
  uri,
  validateOptions
} from '../support/validation'
import {
  teamPipelineResourceVersionCausalityUrl,
  teamPipelineResourceVersionInputToUrl,
  teamPipelineResourceVersionOutputOfUrl
} from '../support/urls'
import { parseJson } from '../support/http/transformers'
import camelcaseKeysDeep from 'camelcase-keys-deep'

class TeamPipelineResourceVersionClient {
  constructor (options) {
    const validatedOptions = validateOptions(
      schemaFor({
        apiUrl: uri().required(),
        httpClient: func().required(),
        teamName: string().required(),
        pipelineName: string().required(),
        resourceName: string().required(),
        versionId: integer().min(1).required()
      }), options)

    this.apiUrl = validatedOptions.apiUrl
    this.httpClient = validatedOptions.httpClient
    this.teamName = validatedOptions.teamName
    this.pipelineName = validatedOptions.pipelineName
    this.resourceName = validatedOptions.resourceName
    this.versionId = validatedOptions.versionId
  }

  async getCausality () {
    const { data: causality } = await this.httpClient
      .get(
        teamPipelineResourceVersionCausalityUrl(
          this.apiUrl,
          this.teamName,
          this.pipelineName,
          this.resourceName,
          this.versionId),
        { transformResponse: [parseJson, camelcaseKeysDeep] })

    return causality
  }

  async listBuildsWithVersionAsInput () {
    const { data: builds } = await this.httpClient
      .get(
        teamPipelineResourceVersionInputToUrl(
          this.apiUrl,
          this.teamName,
          this.pipelineName,
          this.resourceName,
          this.versionId),
        { transformResponse: [parseJson, camelcaseKeysDeep] })

    return builds
  }

  async listBuildsWithVersionAsOutput () {
    const { data: builds } = await this.httpClient
      .get(
        teamPipelineResourceVersionOutputOfUrl(
          this.apiUrl,
          this.teamName,
          this.pipelineName,
          this.resourceName,
          this.versionId),
        { transformResponse: [parseJson, camelcaseKeysDeep] })

    return builds
  }
}

export default TeamPipelineResourceVersionClient
