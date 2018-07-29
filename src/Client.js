import axios from 'axios'
import camelcaseKeysDeep from 'camelcase-keys-deep'

import { func, integer, schemaFor, uri, validateOptions } from './validation'
import {
  allBuildsUrl,
  allJobsUrl,
  allPipelinesUrl,
  allResourcesUrl,
  allTeamsUrl, allWorkersUrl
} from './urls'

export default class Client {
  constructor (options) {
    const validatedOptions = validateOptions(
      schemaFor({
        apiUrl: uri().required(),
        httpClient: func().default(() => axios, 'Global axios instance.')
      }), options)

    this.apiUrl = validatedOptions.apiUrl
    this.httpClient = validatedOptions.httpClient
  }

  async listTeams () {
    const { data: teams } = await this.httpClient
      .get(allTeamsUrl(this.apiUrl), {
        transformResponse: [camelcaseKeysDeep]
      })

    return teams
  }

  async listWorkers () {
    const { data: workers } = await this.httpClient
      .get(allWorkersUrl(this.apiUrl), {
        transformResponse: [camelcaseKeysDeep]
      })

    return workers
  }

  async listPipelines () {
    const { data: pipelines } = await this.httpClient
      .get(allPipelinesUrl(this.apiUrl), {
        transformResponse: [camelcaseKeysDeep]
      })

    return pipelines
  }

  async listJobs () {
    const { data: jobs } = await this.httpClient
      .get(allJobsUrl(this.apiUrl), {
        transformResponse: [camelcaseKeysDeep]
      })

    return jobs
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
      .get(allBuildsUrl(this.apiUrl), {
        params,
        transformResponse: [camelcaseKeysDeep]
      })

    return builds
  }

  async listResources () {
    const { data: resources } = await this.httpClient
      .get(allResourcesUrl(this.apiUrl), {
        transformResponse: [camelcaseKeysDeep]
      })

    return resources
  }
}
