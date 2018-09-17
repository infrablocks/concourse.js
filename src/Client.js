import camelcaseKeysDeep from 'camelcase-keys-deep'
import { reject, isNil } from 'ramda'

import TeamClient from './subclients/TeamClient'
import {
  func,
  integer,
  uri,
  schemaFor,
  validateOptions, array, string
} from './support/validation'
import {
  apiUrl as apiUrlFor,
  allBuildsUrl,
  allJobsUrl,
  allPipelinesUrl,
  allResourcesUrl,
  allTeamsUrl,
  allWorkersUrl,
  buildUrl,
  infoUrl,
  teamAuthTokenUrl,
  skyTokenUrl,
  teamUrl
} from './support/urls'
import { createHttpClient } from './support/http/factory'
import { parseJson } from './support/http/transformers'
import BuildClient from './subclients/BuildClient'
import WorkerClient from './subclients/WorkerClient'

export default class Client {
  static instanceFor (url, username, password, teamName = 'main') {
    const apiUrl = apiUrlFor(url)
    const credentials = {
      infoUrl: infoUrl(apiUrl),
      tokenUrlPreVersion4: teamAuthTokenUrl(apiUrl, teamName),
      tokenUrlPostVersion4: skyTokenUrl(url),
      username: username,
      password: password
    }
    const httpClient = createHttpClient({ credentials })

    return new Client({ apiUrl, httpClient })
  }

  constructor (options) {
    const validatedOptions = validateOptions(
      schemaFor({
        apiUrl: uri().required(),
        httpClient: func().required()
      }), options)

    this.apiUrl = validatedOptions.apiUrl
    this.httpClient = validatedOptions.httpClient
  }

  async getInfo () {
    const { data: info } = await this.httpClient
      .get(infoUrl(this.apiUrl), {
        transformResponse: [parseJson, camelcaseKeysDeep]
      })

    return info
  }

  async listTeams () {
    const { data: teams } = await this.httpClient
      .get(allTeamsUrl(this.apiUrl), {
        transformResponse: [parseJson, camelcaseKeysDeep]
      })

    return teams
  }

  async setTeam (teamName, options = {}) {
    const validatedOptions = validateOptions(
      schemaFor({
        users: array().items(string()).default([]),
        groups: array().items(string()).default([])
      }), options)

    const { data: team } = await this.httpClient
      .put(
        teamUrl(this.apiUrl, teamName),
        {
          auth: {
            users: validatedOptions.users,
            groups: validatedOptions.groups
          }
        },
        { transformResponse: [parseJson, camelcaseKeysDeep] })

    return team
  }

  forTeam (teamName) {
    return new TeamClient({
      apiUrl: this.apiUrl,
      httpClient: this.httpClient,
      teamName
    })
  }

  async listWorkers () {
    const { data: workers } = await this.httpClient
      .get(allWorkersUrl(this.apiUrl), {
        transformResponse: [parseJson, camelcaseKeysDeep]
      })

    return workers
  }

  forWorker (workerName) {
    return new WorkerClient({
      apiUrl: this.apiUrl,
      httpClient: this.httpClient,
      workerName
    })
  }

  async listPipelines () {
    const { data: pipelines } = await this.httpClient
      .get(allPipelinesUrl(this.apiUrl), {
        transformResponse: [parseJson, camelcaseKeysDeep]
      })

    return pipelines
  }

  async listJobs () {
    const { data: jobs } = await this.httpClient
      .get(allJobsUrl(this.apiUrl), {
        transformResponse: [parseJson, camelcaseKeysDeep]
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
        transformResponse: [parseJson, camelcaseKeysDeep]
      })

    return builds
  }

  async getBuild (buildId) {
    const { data: build } = await this.httpClient
      .get(buildUrl(this.apiUrl, buildId), {
        transformResponse: [parseJson, camelcaseKeysDeep]
      })

    return build
  }

  forBuild (buildId) {
    return new BuildClient({
      apiUrl: this.apiUrl,
      httpClient: this.httpClient,
      buildId
    })
  }

  async listResources () {
    const { data: resources } = await this.httpClient
      .get(allResourcesUrl(this.apiUrl), {
        transformResponse: [parseJson, camelcaseKeysDeep]
      })

    return resources
  }
}
