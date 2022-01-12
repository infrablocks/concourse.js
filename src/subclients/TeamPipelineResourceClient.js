import {
  func,
  integer,
  schemaFor,
  string,
  uri,
  validateOptions
} from '../support/validation.js'
import { isNil, reject } from 'ramda'
import {
  teamPipelineResourcePauseUrl,
  teamPipelineResourceUnpauseUrl,
  teamPipelineResourceVersionsUrl,
  teamPipelineResourceVersionUrl
} from '../support/urls.js'
import { parseJson } from '../support/http/transformers.js'
import camelcaseKeysDeep from 'camelcase-keys-deep'
import TeamPipelineResourceVersionClient
  from './TeamPipelineResourceVersionClient.js'

class TeamPipelineResourceClient {
  constructor (options) {
    const validatedOptions = validateOptions(
      schemaFor({
        apiUrl: uri().required(),
        httpClient: func().required(),
        teamName: string().required(),
        pipelineName: string().required(),
        resourceName: string().required()
      }), options)

    this.apiUrl = validatedOptions.apiUrl
    this.httpClient = validatedOptions.httpClient
    this.teamName = validatedOptions.teamName
    this.pipelineName = validatedOptions.pipelineName
    this.resourceName = validatedOptions.resourceName
  }

  async pause () {
    await this.httpClient.put(
      teamPipelineResourcePauseUrl(
        this.apiUrl,
        this.teamName,
        this.pipelineName,
        this.resourceName))
  }

  async unpause () {
    await this.httpClient.put(
      teamPipelineResourceUnpauseUrl(
        this.apiUrl,
        this.teamName,
        this.pipelineName,
        this.resourceName))
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
        this.apiUrl, this.teamName, this.pipelineName, this.resourceName),
      { params, transformResponse: [parseJson, camelcaseKeysDeep] })

    return builds
  }

  async getVersion (versionId) {
    const validatedOptions = validateOptions(
      schemaFor({
        versionId: integer().min(1).required()
      }), { versionId })

    const { data: version } = await this.httpClient
      .get(
        teamPipelineResourceVersionUrl(
          this.apiUrl,
          this.teamName,
          this.pipelineName,
          this.resourceName,
          validatedOptions.versionId),
        { transformResponse: [parseJson, camelcaseKeysDeep] })

    return version
  }

  forVersion (versionId) {
    return new TeamPipelineResourceVersionClient({
      apiUrl: this.apiUrl,
      httpClient: this.httpClient,
      teamName: this.teamName,
      pipelineName: this.pipelineName,
      resourceName: this.resourceName,
      versionId
    })
  }
}

export default TeamPipelineResourceClient
