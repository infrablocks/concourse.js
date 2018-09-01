import axios from 'axios'
import camelcaseKeysDeep from 'camelcase-keys-deep'

import {
  func, integer,
  object,
  schemaFor,
  string,
  uri,
  validateOptions
} from '../support/validation'
import {
  teamBuildsUrl,
  teamPipelinesUrl,
  teamPipelineUrl
} from '../support/urls'

export default class TeamClient {
  constructor (options) {
    const validatedOptions = validateOptions(
      schemaFor({
        apiUrl: uri().required(),
        httpClient: func().default(() => axios, 'Global axios instance.'),
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

    const params = {
      limit: validatedOptions.limit,
      since: validatedOptions.since,
      until: validatedOptions.until
    }

    const { data: builds } = await this.httpClient
      .get(teamBuildsUrl(this.apiUrl, this.team.name), {
        params,
        transformResponse: [camelcaseKeysDeep]
      })

    return builds
  }

  async listPipelines () {
    const {data: pipelines} = await this.httpClient
      .get(teamPipelinesUrl(this.apiUrl, this.team.name), {
        transformResponse: [camelcaseKeysDeep]
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
        transformResponse: [camelcaseKeysDeep]
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
}
