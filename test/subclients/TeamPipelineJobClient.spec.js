import { onConstructionOf } from '../testsupport/dsls/construction'
import TeamPipelineJobClient from '../../src/subclients/TeamPipelineJobClient'
import data from '../testsupport/data'
import axios from 'axios'
import faker from 'faker'

describe('TeamPipelineJobClient', () => {
  describe('construction', () => {
    it('throws an exception if the API URI is not provided', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          team: data.randomTeam(),
          pipeline: data.randomPipeline(),
          job: data.randomJob(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" is required].')
    })

    it('throws an exception if the API URI is not a string', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          apiUrl: 25,
          team: data.randomTeam(),
          pipeline: data.randomPipeline(),
          job: data.randomJob(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a string].')
    })

    it('throws an exception if the API URI is not a valid URI', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          apiUrl: 'spinach',
          team: data.randomTeam(),
          pipeline: data.randomPipeline(),
          job: data.randomJob(),
          httpClient: axios
        })
        .throwsError('Invalid parameter(s): ["apiUrl" must be a valid uri].')
    })

    it('throws an exception if the provided HTTP client is not an object',
      () => {
        onConstructionOf(TeamPipelineJobClient)
          .withArguments({
            httpClient: 35,
            team: data.randomTeam(),
            pipeline: data.randomPipeline(),
            job: data.randomJob(),
            apiUrl: faker.internet.url()
          })
          .throwsError(
            'Invalid parameter(s): ["httpClient" must be a Function].')
      })

    it('throws an exception if the team is not provided', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          pipeline: data.randomPipeline(),
          job: data.randomJob()
        })
        .throwsError('Invalid parameter(s): ["team" is required].')
    })

    it('throws an exception if the team is not an object', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          team: 'wat',
          apiUrl: faker.internet.url(),
          httpClient: axios,
          pipeline: data.randomPipeline(),
          job: data.randomJob()
        })
        .throwsError('Invalid parameter(s): ["team" must be an object].')
    })

    it('throws an exception if the pipeline is not provided', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam(),
          job: data.randomJob()
        })
        .throwsError('Invalid parameter(s): ["pipeline" is required].')
    })

    it('throws an exception if the pipeline is not an object', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          pipeline: 'wat',
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam(),
          job: data.randomJob()
        })
        .throwsError('Invalid parameter(s): ["pipeline" must be an object].')
    })

    it('throws an exception if the job is not provided', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam(),
          pipeline: data.randomPipeline()
        })
        .throwsError('Invalid parameter(s): ["job" is required].')
    })

    it('throws an exception if the pipeline is not an object', () => {
      onConstructionOf(TeamPipelineJobClient)
        .withArguments({
          job: 'wat',
          apiUrl: faker.internet.url(),
          httpClient: axios,
          team: data.randomTeam(),
          pipeline: data.randomPipeline()
        })
        .throwsError('Invalid parameter(s): ["job" must be an object].')
    })
  })
})
