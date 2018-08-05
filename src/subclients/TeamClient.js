import axios from 'axios'
import camelcaseKeysDeep from 'camelcase-keys-deep'

import {
  func,
  object,
  schemaFor,
  string,
  uri,
  validateOptions
} from '../support/validation'
import { teamPipelinesUrl, teamPipelineUrl } from '../support/urls'

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
}
