import { reject, isNil } from 'ramda'
import camelcaseKeysDeep from 'camelcase-keys-deep'

import {
  func,
  integer,
  schemaFor,
  string,
  uri,
  required,
  validateOptions
} from '../support/validation.js'
import {
  teamBuildsUrl,
  teamContainersUrl,
  teamContainerUrl,
  teamPipelinesUrl,
  teamPipelineUrl, teamRenameUrl, teamUrl,
  teamVolumesUrl
} from '../support/urls.js'
import { parseJson } from '../support/http/transformers.js'
import TeamPipelineClient from './TeamPipelineClient.js'

export default class TeamClient {
  constructor (options) {
    const validatedOptions = validateOptions(
      schemaFor({
        apiUrl: uri().required(),
        httpClient: func().required(),
        teamName: string().required()
      }), options)

    this.apiUrl = validatedOptions.apiUrl
    this.httpClient = validatedOptions.httpClient
    this.teamName = validatedOptions.teamName
  }

  async rename (newTeamName) {
    const validatedOptions = validateOptions(
      schemaFor({
        newTeamName: string().required()
      }), { newTeamName })

    await this.httpClient
      .put(teamRenameUrl(this.apiUrl, this.teamName), {
        name: validatedOptions.newTeamName
      })

    this.teamName = newTeamName
  }

  async destroy () {
    await this.httpClient
      .delete(teamUrl(this.apiUrl, this.teamName))
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
      .get(teamBuildsUrl(this.apiUrl, this.teamName), {
        params,
        transformResponse: [parseJson, camelcaseKeysDeep]
      })

    return builds
  }

  async listContainers (options = {}) {
    const validatedOptions = validateOptions(
      schemaFor({
        type: string(),
        pipelineId: integer(),
        pipelineName: string()
          .when('type', { is: 'check', then: required() }),
        jobId: integer(),
        jobName: string(),
        stepName: string(),
        resourceName: string()
          .when('type', { is: 'check', then: required() }),
        attempt: string(),
        buildId: integer(),
        buildName: string()
      }), options)

    const params = reject(isNil, {
      type: validatedOptions.type,
      pipeline_id: validatedOptions.pipelineId,
      pipeline_name: validatedOptions.pipelineName,
      job_id: validatedOptions.jobId,
      job_name: validatedOptions.jobName,
      step_name: validatedOptions.stepName,
      resource_name: validatedOptions.resourceName,
      attempt: validatedOptions.attempt,
      build_id: validatedOptions.buildId,
      build_name: validatedOptions.buildName
    })

    const { data: containers } = await this.httpClient
      .get(teamContainersUrl(this.apiUrl, this.teamName), {
        params,
        transformResponse: [parseJson, camelcaseKeysDeep]
      })

    return containers
  }

  async getContainer (containerId) {
    const validatedOptions = validateOptions(
      schemaFor({
        containerId: string().required()
      }), { containerId })

    const { data: container } = await this.httpClient
      .get(teamContainerUrl(
        this.apiUrl,
        this.teamName,
        validatedOptions.containerId), {
        transformResponse: [parseJson, camelcaseKeysDeep]
      })

    return container
  }

  async listVolumes () {
    const { data: volumes } = await this.httpClient
      .get(teamVolumesUrl(this.apiUrl, this.teamName), {
        transformResponse: [parseJson, camelcaseKeysDeep]
      })

    return volumes
  }

  async listPipelines () {
    const { data: pipelines } = await this.httpClient
      .get(teamPipelinesUrl(this.apiUrl, this.teamName), {
        transformResponse: [parseJson, camelcaseKeysDeep]
      })

    return pipelines
  }

  async getPipeline (pipelineName) {
    const validatedOptions = validateOptions(
      schemaFor({
        pipelineName: string().required()
      }), { pipelineName })

    const { data: pipeline } = await this.httpClient
      .get(teamPipelineUrl(
        this.apiUrl, this.teamName, validatedOptions.pipelineName), {
        transformResponse: [parseJson, camelcaseKeysDeep]
      })

    return pipeline
  }

  forPipeline (pipelineName) {
    return new TeamPipelineClient({
      apiUrl: this.apiUrl,
      httpClient: this.httpClient,
      teamName: this.teamName,
      pipelineName
    })
  }
}
