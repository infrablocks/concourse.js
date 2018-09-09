import {
  func, integer,
  object,
  schemaFor,
  string,
  uri,
  validateOptions
} from '../support/validation'
import {
  teamPipelineBuildsUrl,
  teamPipelineJobsUrl,
  teamPipelineJobUrl,
  teamPipelinePauseUrl, teamPipelineRenameUrl,
  teamPipelineResourcesUrl,
  teamPipelineResourceTypesUrl,
  teamPipelineResourceUrl,
  teamPipelineUnpauseUrl,
  teamPipelineUrl
} from '../support/urls'
import { parseJson } from '../support/http/transformers'
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
        team: object().required(),
        pipeline: object().required()
      }), options)

    this.apiUrl = validatedOptions.apiUrl
    this.httpClient = validatedOptions.httpClient
    this.team = validatedOptions.team
    this.pipeline = validatedOptions.pipeline
  }

  async pause () {
    await this.httpClient.put(
      teamPipelinePauseUrl(
        this.apiUrl,
        this.team.name,
        this.pipeline.name))
  }

  async unpause () {
    await this.httpClient.put(
      teamPipelineUnpauseUrl(
        this.apiUrl,
        this.team.name,
        this.pipeline.name))
  }

  async rename (newPipelineName) {
    const validatedOptions = validateOptions(
      schemaFor({
        newPipelineName: string().required()
      }), { newPipelineName })

    await this.httpClient
      .put(
        teamPipelineRenameUrl(this.apiUrl, this.team.name, this.pipeline.name),
        { name: validatedOptions.newPipelineName })

    this.pipeline.name = newPipelineName
  }

  async delete () {
    await this.httpClient.delete(
      teamPipelineUrl(
        this.apiUrl,
        this.team.name,
        this.pipeline.name))
  }

  async listJobs () {
    const { data: jobs } = await this.httpClient
      .get(
        teamPipelineJobsUrl(this.apiUrl, this.team.name, this.pipeline.name),
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
          this.team.name,
          this.pipeline.name,
          validatedOptions.jobName),
        { transformResponse: [parseJson, camelcaseKeysDeep] })

    return job
  }

  async forJob (jobName) {
    let job
    try {
      job = await this.getJob(jobName)
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new Error(`No job with name: ${jobName}`)
      } else {
        throw e
      }
    }

    return new TeamPipelineJobClient({
      apiUrl: this.apiUrl,
      httpClient: this.httpClient,
      team: this.team,
      pipeline: this.pipeline,
      job
    })
  }

  async listResources () {
    const { data: resources } = await this.httpClient
      .get(
        teamPipelineResourcesUrl(this.apiUrl, this.team.name, this.pipeline.name),
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
          this.team.name,
          this.pipeline.name,
          validatedOptions.resourceName),
        { transformResponse: [parseJson, camelcaseKeysDeep] })

    return resource
  }

  async forResource (resourceName) {
    let resource
    try {
      resource = await this.getResource(resourceName)
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new Error(`No resource with name: ${resourceName}`)
      } else {
        throw e
      }
    }

    return new TeamPipelineResourceClient({
      apiUrl: this.apiUrl,
      httpClient: this.httpClient,
      team: this.team,
      pipeline: this.pipeline,
      resource
    })
  }

  async listResourceTypes () {
    const { data: resourceTypes } = await this.httpClient
      .get(
        teamPipelineResourceTypesUrl(
          this.apiUrl, this.team.name, this.pipeline.name),
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
          this.apiUrl, this.team.name, this.pipeline.name),
        {
          params,
          transformResponse: [parseJson, camelcaseKeysDeep]
        })

    return builds
  }
}

export default TeamPipelineClient
