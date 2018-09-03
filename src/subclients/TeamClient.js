import { reject, isNil, find, propEq } from 'ramda'
import camelcaseKeysDeep from 'camelcase-keys-deep'

import {
  func,
  integer,
  object,
  schemaFor,
  string,
  uri,
  required,
  validateOptions
} from '../support/validation'
import {
  teamBuildsUrl,
  teamContainersUrl,
  teamContainerUrl,
  teamPipelinesUrl,
  teamPipelineUrl
} from '../support/urls'
import { parseJson } from '../support/http/transformers'
import TeamPipelineClient from './TeamPipelineClient'

export default class TeamClient {
  constructor (options) {
    const validatedOptions = validateOptions(
      schemaFor({
        apiUrl: uri().required(),
        httpClient: func().required(),
        team: object().required()
      }), options)

    this.apiUrl = validatedOptions.apiUrl
    this.httpClient = validatedOptions.httpClient
    this.team = validatedOptions.team
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

    const {data: builds} = await this.httpClient
      .get(teamBuildsUrl(this.apiUrl, this.team.name), {
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

    const {data: containers} = await this.httpClient
      .get(teamContainersUrl(this.apiUrl, this.team.name), {
        params,
        transformResponse: [parseJson, camelcaseKeysDeep]
      })

    return containers
  }

  async getContainer (containerId) {
    const validatedOptions = validateOptions(
      schemaFor({
        containerId: string().required()
      }), {containerId})

    const {data: container} = await this.httpClient
      .get(teamContainerUrl(
        this.apiUrl,
        this.team.name,
        validatedOptions.containerId), {
        transformResponse: [parseJson, camelcaseKeysDeep]
      })

    return container
  }

  async listPipelines () {
    const {data: pipelines} = await this.httpClient
      .get(teamPipelinesUrl(this.apiUrl, this.team.name), {
        transformResponse: [parseJson, camelcaseKeysDeep]
      })

    return pipelines
  }

  async getPipeline (pipelineName) {
    const validatedOptions = validateOptions(
      schemaFor({
        pipelineName: string().required()
      }), {pipelineName})

    const {data: pipeline} = await this.httpClient
      .get(teamPipelineUrl(
        this.apiUrl, this.team.name, validatedOptions.pipelineName), {
        transformResponse: [parseJson, camelcaseKeysDeep]
      })

    return pipeline
  }

  async deletePipeline (pipelineName) {
    const validatedOptions = validateOptions(schemaFor({
      pipelineName: string().required()
    }), {pipelineName})

    await this.httpClient.delete(
      teamPipelineUrl(
        this.apiUrl,
        this.team.name,
        validatedOptions.pipelineName))
  }

  async forPipeline (pipelineName) {
    let pipeline
    try {
      pipeline = await this.getPipeline(pipelineName)
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new Error(`No pipeline for name: ${pipelineName}`)
      } else {
        throw e
      }
    }

    return new TeamPipelineClient({
      apiUrl: this.apiUrl,
      httpClient: this.httpClient,
      team: this.team,
      pipeline
    })
  }
}
