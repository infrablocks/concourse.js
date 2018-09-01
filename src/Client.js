import axios from 'axios'
import camelcaseKeysDeep from 'camelcase-keys-deep'
import { find, propEq, reject, isNil } from 'ramda'

import TeamClient from './subclients/TeamClient'
import {
  func,
  integer,
  uri,
  schemaFor,
  validateOptions
} from './support/validation'
import {
  allBuildsUrl,
  allJobsUrl,
  allPipelinesUrl,
  allResourcesUrl,
  allTeamsUrl,
  allWorkersUrl,
  buildUrl
} from './support/urls'

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

  async forTeam (teamId) {
    const teams = await this.listTeams()
    const team = find(propEq('id', teamId), teams)

    if (!team) {
      throw new Error(`No team for ID: ${teamId}`)
    }

    return new TeamClient({
      apiUrl: this.apiUrl,
      httpClient: this.httpClient,
      team
    })
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

    const params = reject(isNil, {
      limit: validatedOptions.limit,
      since: validatedOptions.since,
      until: validatedOptions.until
    })

    const { data: builds } = await this.httpClient
      .get(allBuildsUrl(this.apiUrl), {
        params,
        transformResponse: [camelcaseKeysDeep]
      })

    return builds
  }

  async getBuild (buildId) {
    const { data: build } = await this.httpClient
      .get(buildUrl(this.apiUrl, buildId), {
        transformResponse: [camelcaseKeysDeep]
      })

    return build
  }

  async listResources () {
    const { data: resources } = await this.httpClient
      .get(allResourcesUrl(this.apiUrl), {
        transformResponse: [camelcaseKeysDeep]
      })

    return resources
  }
}
