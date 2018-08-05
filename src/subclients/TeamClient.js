import axios from 'axios'
import camelcaseKeysDeep from 'camelcase-keys-deep'

import { func, object, schemaFor, uri, validateOptions } from '../support/validation'
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
    const { data: pipelines } = await this.httpClient
      .get(teamPipelinesUrl(this.apiUrl, this.team.name), {
        transformResponse: [camelcaseKeysDeep]
      })

    return pipelines
  }

  async getPipeline (pipelineName) {
    const { data: pipeline } = await this.httpClient
      .get(teamPipelineUrl(this.apiUrl, this.team.name, pipelineName), {
        transformResponse: [camelcaseKeysDeep]
      })

    return pipeline
  }
}
