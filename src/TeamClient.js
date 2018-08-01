import axios from 'axios'
import camelcaseKeysDeep from 'camelcase-keys-deep'

import { func, object, schemaFor, uri, validateOptions } from './validation'
import { teamPipelinesUrl } from './urls'

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
}
