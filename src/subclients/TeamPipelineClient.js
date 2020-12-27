import {
  func, integer,
  schemaFor,
  string,
  uri,
  validateOptions
} from '../support/validation'
import {
  teamPipelineBuildsUrl,
  teamPipelineJobsUrl,
  teamPipelineJobUrl,
  teamPipelinePauseUrl,
  teamPipelineRenameUrl,
  teamPipelineResourcesUrl,
  teamPipelineResourceTypesUrl,
  teamPipelineResourceUrl,
  teamPipelineConfigUrl,
  teamPipelineUnpauseUrl,
  teamPipelineUrl
} from '../support/urls'
import { parseJson } from '../support/http/transformers'
import { contentTypeHeader, contentTypes } from '../support/http/headers'
import camelcaseKeysDeep from 'camelcase-keys-deep'
import TeamPipelineJobClient from './TeamPipelineJobClient'
import TeamPipelineResourceClient from './TeamPipelineResourceClient'
import { isNil, reject } from 'ramda'

class TeamPipelineClient {
  constructor (options) {
    const validatedOptions = validateOptions(
      schemaFor({
        apiUrl: uri().required(),
        httpClient: func().required(),
        teamName: string().required(),
        pipelineName: string().required()
      }), options)

    this.apiUrl = validatedOptions.apiUrl
    this.httpClient = validatedOptions.httpClient
    this.teamName = validatedOptions.teamName
    this.pipelineName = validatedOptions.pipelineName
  }

  async pause () {
    await this.httpClient.put(
      teamPipelinePauseUrl(
        this.apiUrl,
        this.teamName,
        this.pipelineName))
  }

  async unpause () {
    await this.httpClient.put(
      teamPipelineUnpauseUrl(
        this.apiUrl,
        this.teamName,
        this.pipelineName))
  }

  async rename (newPipelineName) {
    const validatedOptions = validateOptions(
      schemaFor({
        newPipelineName: string().required()
      }), { newPipelineName })

    await this.httpClient
      .put(
        teamPipelineRenameUrl(this.apiUrl, this.teamName, this.pipelineName),
        { name: validatedOptions.newPipelineName })

    this.pipelineName = newPipelineName
  }

  async delete () {
    await this.httpClient.delete(
      teamPipelineUrl(
        this.apiUrl,
        this.teamName,
        this.pipelineName))
  }

  async listJobs () {
    const { data: jobs } = await this.httpClient
      .get(
        teamPipelineJobsUrl(this.apiUrl, this.teamName, this.pipelineName),
        { transformResponse: [parseJson, camelcaseKeysDeep] })

    return jobs
  }

  async getJob (jobName) {
    const validatedOptions = validateOptions(
      schemaFor({
        jobName: string().required()
      }), { jobName })

    const { data: job } = await this.httpClient
      .get(
        teamPipelineJobUrl(
          this.apiUrl,
          this.teamName,
          this.pipelineName,
          validatedOptions.jobName),
        { transformResponse: [parseJson, camelcaseKeysDeep] })

    return job
  }

  forJob (jobName) {
    return new TeamPipelineJobClient({
      apiUrl: this.apiUrl,
      httpClient: this.httpClient,
      teamName: this.teamName,
      pipelineName: this.pipelineName,
      jobName
    })
  }

  async listResources () {
    const { data: resources } = await this.httpClient
      .get(
        teamPipelineResourcesUrl(this.apiUrl, this.teamName, this.pipelineName),
        { transformResponse: [parseJson, camelcaseKeysDeep] })

    return resources
  }

  async getResource (resourceName) {
    const validatedOptions = validateOptions(
      schemaFor({
        resourceName: string().required()
      }), { resourceName })

    const { data: resource } = await this.httpClient
      .get(
        teamPipelineResourceUrl(
          this.apiUrl,
          this.teamName,
          this.pipelineName,
          validatedOptions.resourceName),
        { transformResponse: [parseJson, camelcaseKeysDeep] })

    return resource
  }

  forResource (resourceName) {
    return new TeamPipelineResourceClient({
      apiUrl: this.apiUrl,
      httpClient: this.httpClient,
      teamName: this.teamName,
      pipelineName: this.pipelineName,
      resourceName
    })
  }

  async listResourceTypes () {
    const { data: resourceTypes } = await this.httpClient
      .get(
        teamPipelineResourceTypesUrl(
          this.apiUrl, this.teamName, this.pipelineName),
        { transformResponse: [parseJson, camelcaseKeysDeep] })

    return resourceTypes
  }

  async listBuilds (options = {}) {
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
      .get(
        teamPipelineBuildsUrl(
          this.apiUrl, this.teamName, this.pipelineName),
        {
          params,
          transformResponse: [parseJson, camelcaseKeysDeep]
        })

    return builds
  }

  async saveConfig (pipelineConfig) {
    const validatedOptions = validateOptions(
      schemaFor({
        pipelineConfig: string().required()
      }), { pipelineConfig })

    await this.httpClient
      .put(
        teamPipelineConfigUrl(this.apiUrl, this.teamName, this.pipelineName),
        validatedOptions.pipelineConfig,
        {
          headers: contentTypeHeader(contentTypes.yaml)
        })
  }
}

export default TeamPipelineClient
