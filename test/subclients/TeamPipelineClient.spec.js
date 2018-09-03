import axios from 'axios'
import faker from 'faker'
import MockAdapter from 'axios-mock-adapter'

import data from '../testsupport/data'
import build from '../testsupport/builders'

import { onConstructionOf } from '../testsupport/dsls/construction'

import { bearerAuthHeader } from '../../src/support/http/headers'
import TeamPipelineClient from '../../src/subclients/TeamPipelineClient'
import { expect } from 'chai'

const buildValidTeamPipelineClient = () => {
  const apiUrl = data.randomApiUrl()
  const bearerToken = data.randomBearerToken()

  const httpClient = axios.create({
    headers: bearerAuthHeader(bearerToken)
  })
  const mock = new MockAdapter(httpClient)

  const team = build.client.team(data.randomTeam())
  const pipeline = build.client.pipeline(data.randomPipeline())

  const client = new TeamPipelineClient({apiUrl, httpClient, team, pipeline})

  return {
    client,
    httpClient,
    mock,
    apiUrl,
    bearerToken,
    team,
    pipeline
  }
}

describe('TeamPipelineClient', () => {
  describe('construction', () => {
    it('throws an exception if the API URI is not provided', () => {
      onConstructionOf(TeamPipelineClient)
        .withArguments({
          team: data.randomTeam(),
          pipeline: data.randomPipeline(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" is required].')
    })

    it('throws an exception if the API URI is not a string', () => {
      onConstructionOf(TeamPipelineClient)
        .withArguments({
          apiUrl: 25,
          team: data.randomTeam(),
          pipeline: data.randomPipeline(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a string].')
    })

    it('throws an exception if the API URI is not a valid URI', () => {
      onConstructionOf(TeamPipelineClient)
        .withArguments({
          apiUrl: 'spinach',
          team: data.randomTeam(),
          pipeline: data.randomPipeline(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a valid uri].')
    })

    it('throws an exception if the provided HTTP client is not an object',
      () => {
        onConstructionOf(TeamPipelineClient)
          .withArguments({
            httpClient: 35,
            team: data.randomTeam(),
            pipeline: data.randomPipeline(),
            apiUrl: faker.internet.url()
          })
          .throwsError(
            'Invalid parameter(s): ["httpClient" must be a Function].')
      })

    it('throws an exception if the team is not provided', () => {
      onConstructionOf(TeamPipelineClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          pipeline: data.randomPipeline()
        })
        .throwsError('Invalid parameter(s): ["team" is required].')
    })

    it('throws an exception if the team is not an object', () => {
      onConstructionOf(TeamPipelineClient)
        .withArguments({
          team: 'wat',
          apiUrl: faker.internet.url(),
          httpClient: axios,
          pipeline: data.randomPipeline()
        })
        .throwsError('Invalid parameter(s): ["team" must be an object].')
    })

    it('throws an exception if the pipeline is not provided', () => {
      onConstructionOf(TeamPipelineClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam()
        })
        .throwsError('Invalid parameter(s): ["pipeline" is required].')
    })

    it('throws an exception if the pipeline is not an object', () => {
      onConstructionOf(TeamPipelineClient)
        .withArguments({
          pipeline: 'wat',
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam()
        })
        .throwsError('Invalid parameter(s): ["pipeline" must be an object].')
    })
  })

  describe('listJobs', () => {
    it('gets all jobs for team pipeline',
      async () => {
        const {client, mock, apiUrl, bearerToken, team, pipeline} =
          buildValidTeamPipelineClient()

        const teamName = team.name
        const pipelineName = pipeline.name
        const jobData = data.randomJob({teamName, pipelineName})

        const jobFromApi = build.api.job(jobData)
        const jobsFromApi = [jobFromApi]

        const convertedJob = build.client.job(jobData)
        const expectedJobs = [convertedJob]

        mock.onGet(
          `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/jobs`,
          {
            headers: {
              ...bearerAuthHeader(bearerToken)
            }
          })
          .reply(200, jobsFromApi)

        const actualJobs = await client.listJobs()

        expect(actualJobs).to.eql(expectedJobs)
      })
  })
})