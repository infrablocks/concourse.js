import { expect } from 'chai'
import faker from 'faker'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import build from './support/builders'
import data from './support/data'

import Concourse from '../src/Concourse'

const newConcourse =
  ({
    uri = faker.internet.url(),
    teamName = 'main',
    username = 'some-username',
    password = 'some-password'
  } = {}) => new Concourse({
    uri,
    teamName,
    username,
    password
  })

describe('Concourse', () => {
  const mock = new MockAdapter(axios)

  beforeEach(() => {
    mock.reset()
  })

  after(() => {
    mock.restore()
  })

  describe('construction', () => {
    it('throws an exception if the URI is not provided', () => {
      expect(() => {
        new Concourse({}) // eslint-disable-line no-new
      })
        .to.throw(Error, 'Invalid parameter(s): ["uri" is required].')
    })

    it('throws an exception if the URI is not a string', () => {
      expect(() => {
        new Concourse({ uri: 25 }) // eslint-disable-line no-new
      })
        .to.throw(Error, 'Invalid parameter(s): ["uri" must be a string].')
    })

    it('throws an exception if the URI is not a valid URI', () => {
      expect(() => {
        new Concourse({ uri: 'spinach' }) // eslint-disable-line no-new
      })
        .to.throw(Error, 'Invalid parameter(s): ["uri" must be a valid uri].')
    })

    it('throws an exception if the provided team name is not a string', () => {
      expect(
        () => {
          // eslint-disable-next-line no-new
          new Concourse({
            uri: faker.internet.url(),
            teamName: 35
          })
        })
        .to.throw(Error, 'Invalid parameter(s): ["teamName" must be a string].')
    })

    it('throws an exception if the provided username is not a string', () => {
      expect(
        () => {
          // eslint-disable-next-line no-new
          new Concourse({
            uri: faker.internet.url(),
            username: 35
          })
        })
        .to.throw(Error, 'Invalid parameter(s): ["username" must be a string].')
    })

    it('throws an exception if the provided password is not a string', () => {
      expect(
        () => {
          // eslint-disable-next-line no-new
          new Concourse({
            uri: faker.internet.url(),
            password: 35
          })
        })
        .to.throw(Error, 'Invalid parameter(s): ["password" must be a string].')
    })
  })

  describe('login', () => {
    it('throws an exception if the username is not provided',
      async () => {
        try {
          await newConcourse()
            .login({ password: 'some-password' })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql('Invalid parameter(s): ["username" is required].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('throws an exception if the provided username is not a string',
      async () => {
        try {
          await newConcourse()
            .login({ username: 25, password: 'some-password' })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql('Invalid parameter(s): ["username" must be a string].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('throws an exception if the password is not provided',
      async () => {
        try {
          await newConcourse()
            .login({ username: 'some-username' })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql('Invalid parameter(s): ["password" is required].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('throws an exception if the provided password is not a string',
      async () => {
        try {
          await newConcourse()
            .login({ username: 'some-username', password: 25 })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql('Invalid parameter(s): ["password" must be a string].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('throws an exception if the provided team name is not a string',
      async () => {
        try {
          await newConcourse()
            .login({
              username: 'some-username',
              password: 'some-password',
              teamName: 25
            })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql('Invalid parameter(s): ["teamName" must be a string].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('uses the provided team name instead of that provided at construction',
      async () => {
        const fly = await newConcourse({ teamName: 'initial' })
          .login({
            username: 'some-username',
            password: 'some-password',
            teamName: 'overridden'
          })

        expect(fly.teamName).to.eql('overridden')
      })
  })

  describe('jobs', () => {
    it('throws an exception if no pipeline is provided',
      async () => {
        try {
          await newConcourse().jobs({})
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql('Invalid parameter(s): ["pipeline" is required].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('throws an exception if the provided pipeline is not a string',
      async () => {
        try {
          await newConcourse().jobs({ pipeline: 25 })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql('Invalid parameter(s): ["pipeline" must be a string].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('gets jobs for the supplied team and pipeline',
      async () => {
        const uri = 'https://concourse.example.com'

        const username = 'some-username'
        const password = 'some-password'
        const authentication = 'Basic c29tZS11c2VybmFtZTpzb21lLXBhc3N3b3Jk'

        const bearerToken = data.randomBearerToken()
        const authToken = build.api.authToken({ value: bearerToken })

        const jobName = data.randomJobName()
        const teamName = data.randomTeamName()
        const pipelineName = data.randomPipelineName()

        const jobData = data.randomJob({
          name: jobName,
          pipelineName,
          teamName,
          nextBuild: null
        })

        const buildData = data.randomBuild({
          teamName,
          jobName,
          pipelineName
        })

        const inputData = data.randomInput()
        const outputData = data.randomOutput()

        const jobFromApi = build.api.job({
          ...jobData,
          finishedBuild: build.api.build(buildData),
          inputs: [build.api.input(inputData)],
          outputs: [build.api.output(outputData)]
        })
        const jobsFromApi = [jobFromApi]

        const convertedJob = build.client.job({
          ...jobData,
          finishedBuild: build.client.build(buildData),
          inputs: [build.client.input(inputData)],
          outputs: [build.client.output(outputData)]
        })

        const expectedJobs = [convertedJob]

        mock.onGet(
          `${uri}/teams/${teamName}/auth/token`,
          {
            headers: {
              'Authorization': authentication
            }
          })
          .reply(200, authToken)

        mock.onGet(
          `${uri}/teams/${teamName}/pipelines/${pipelineName}/jobs`,
          {
            headers: {
              'Authorization': `Bearer ${bearerToken}`
            }
          })
          .reply(200, jobsFromApi)

        const fly = await new Concourse({ uri, teamName })
          .login({ username, password })

        const actualJobs = await fly.jobs({ pipeline: pipelineName })

        expect(actualJobs).to.eql(expectedJobs)
      })
  })

  describe('pipelines', () => {
    it('throws an exception if the value provided for all is not a boolean',
      async () => {
        try {
          await newConcourse().pipelines({ all: 25 })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql('Invalid parameter(s): ["all" must be a boolean].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('gets pipelines for the supplied team by default',
      async () => {
        const uri = 'https://concourse.example.com'

        const username = 'some-username'
        const password = 'some-password'
        const authentication = 'Basic c29tZS11c2VybmFtZTpzb21lLXBhc3N3b3Jk'

        const bearerToken = data.randomBearerToken()
        const authToken = build.api.authToken({ value: bearerToken })

        const teamName = data.randomTeamName()

        const pipelineData = data.randomPipeline({
          teamName
        })

        const pipelineFromApi = build.api.pipeline(pipelineData)
        const pipelinesFromApi = [pipelineFromApi]

        const convertedPipeline = build.client.pipeline(pipelineData)

        const expectedPipelines = [convertedPipeline]

        mock.onGet(
          `${uri}/teams/${teamName}/auth/token`,
          {
            headers: {
              'Authorization': authentication
            }
          })
          .reply(200, authToken)

        mock.onGet(
          `${uri}/teams/${teamName}/pipelines`,
          {
            headers: {
              'Authorization': `Bearer ${bearerToken}`
            }
          })
          .reply(200, pipelinesFromApi)

        const fly = await new Concourse({ uri, teamName })
          .login({ username, password })

        const actualPipelines = await fly.pipelines()

        expect(actualPipelines).to.eql(expectedPipelines)
      })

    it('gets all pipelines if all is true',
      async () => {
        const uri = 'https://concourse.example.com'

        const username = 'some-username'
        const password = 'some-password'
        const authentication = 'Basic c29tZS11c2VybmFtZTpzb21lLXBhc3N3b3Jk'

        const bearerToken = data.randomBearerToken()
        const authToken = build.api.authToken({ value: bearerToken })

        const teamName = data.randomTeamName()

        const pipelineData = data.randomPipeline({
          teamName
        })

        const pipelineFromApi = build.api.pipeline(pipelineData)
        const pipelinesFromApi = [pipelineFromApi]

        const convertedPipeline = build.client.pipeline(pipelineData)

        const expectedPipelines = [convertedPipeline]

        mock.onGet(
          `${uri}/teams/${teamName}/auth/token`,
          {
            headers: {
              'Authorization': authentication
            }
          })
          .reply(200, authToken)

        mock.onGet(
          `${uri}/pipelines`,
          {
            headers: {
              'Authorization': `Bearer ${bearerToken}`
            }
          })
          .reply(200, pipelinesFromApi)

        const fly = await new Concourse({ uri, teamName })
          .login({ username, password })

        const actualPipelines = await fly.pipelines({ all: true })

        expect(actualPipelines).to.eql(expectedPipelines)
      })

    it('gets pipelines for the supplied team when all is false',
      async () => {
        const uri = 'https://concourse.example.com'

        const username = 'some-username'
        const password = 'some-password'
        const authentication = 'Basic c29tZS11c2VybmFtZTpzb21lLXBhc3N3b3Jk'

        const bearerToken = data.randomBearerToken()
        const authToken = build.api.authToken({ value: bearerToken })

        const teamName = data.randomTeamName()

        const pipelineData = data.randomPipeline({
          teamName
        })

        const pipelineFromApi = build.api.pipeline(pipelineData)
        const pipelinesFromApi = [pipelineFromApi]

        const convertedPipeline = build.client.pipeline(pipelineData)

        const expectedPipelines = [convertedPipeline]

        mock.onGet(
          `${uri}/teams/${teamName}/auth/token`,
          {
            headers: {
              'Authorization': authentication
            }
          })
          .reply(200, authToken)

        mock.onGet(
          `${uri}/teams/${teamName}/pipelines`,
          {
            headers: {
              'Authorization': `Bearer ${bearerToken}`
            }
          })
          .reply(200, pipelinesFromApi)

        const fly = await new Concourse({ uri, teamName })
          .login({ username, password })

        const actualPipelines = await fly.pipelines({ all: false })

        expect(actualPipelines).to.eql(expectedPipelines)
      })
  })

  describe('builds', () => {
    it('throws an exception if the value provided for count is not a number',
      async () => {
        try {
          await newConcourse().builds({ count: 'badger' })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql('Invalid parameter(s): ["count" must be a number].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('throws an exception if the value provided for count is not an integer',
      async () => {
        try {
          await newConcourse().builds({ count: 32.654 })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql('Invalid parameter(s): ["count" must be an integer].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('throws an exception if the value provided for count is less than 1',
      async () => {
        try {
          await newConcourse().builds({ count: -20 })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql(
              'Invalid parameter(s): [' +
            '"count" must be larger than or equal to 1].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('throws an exception if the provided job is not a string',
      async () => {
        try {
          await newConcourse().builds({ job: 30 })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql(
              'Invalid parameter(s): [' +
            '"job" must be a string].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it(
      'throws an exception if the provided job is not in the format ' +
      'pipeline/job',
      async () => {
        try {
          await newConcourse().builds({ job: 'something-weird' })
        } catch (e) {
          expect(e instanceof Error).to.eql(true)
          expect(e.message)
            .to.eql(
              'Invalid parameter(s): [' +
            '"job" with value "something-weird" fails to match ' +
            'the required pattern: /^(.*)\\/(.*)$/].')
          return
        }
        expect.fail(null, null, 'Expected exception but none was thrown.')
      })

    it('gets all builds with a limit of 50 by default',
      async () => {
        const uri = 'https://concourse.example.com'

        const username = 'some-username'
        const password = 'some-password'
        const authentication = 'Basic c29tZS11c2VybmFtZTpzb21lLXBhc3N3b3Jk'

        const bearerToken = data.randomBearerToken()
        const authToken = build.api.authToken({ value: bearerToken })

        const teamName = data.randomTeamName()

        const buildData = data.randomBuild({
          teamName
        })

        const buildFromApi = build.api.build(buildData)
        const buildsFromApi = [buildFromApi]

        const convertedBuild = build.client.build(buildData)

        const expectedBuilds = [convertedBuild]

        mock.onGet(
          `${uri}/teams/${teamName}/auth/token`,
          {
            headers: {
              'Authorization': authentication
            }
          })
          .reply(200, authToken)

        mock.onGet(
          `${uri}/builds`,
          {
            headers: {
              'Authorization': `Bearer ${bearerToken}`
            },
            params: {
              limit: 50
            }
          })
          .reply(200, buildsFromApi)

        const fly = await new Concourse({ uri, teamName })
          .login({ username, password })

        const actualBuilds = await fly.builds()

        expect(actualBuilds).to.eql(expectedBuilds)
      })

    it('gets all builds limited by count when specified',
      async () => {
        const uri = 'https://concourse.example.com'

        const username = 'some-username'
        const password = 'some-password'
        const authentication = 'Basic c29tZS11c2VybmFtZTpzb21lLXBhc3N3b3Jk'

        const bearerToken = data.randomBearerToken()
        const authToken = build.api.authToken({ value: bearerToken })

        const teamName = data.randomTeamName()

        const count = 10

        const buildData = data.randomBuild({
          teamName
        })

        const buildFromApi = build.api.build(buildData)
        const buildsFromApi = [buildFromApi]

        const convertedBuild = build.client.build(buildData)

        const expectedBuilds = [convertedBuild]

        mock.onGet(
          `${uri}/teams/${teamName}/auth/token`,
          {
            headers: {
              'Authorization': authentication
            }
          })
          .reply(200, authToken)

        mock.onGet(
          `${uri}/builds`,
          {
            headers: {
              'Authorization': `Bearer ${bearerToken}`
            },
            params: {
              limit: count
            }
          })
          .reply(200, buildsFromApi)

        const fly = await new Concourse({ uri, teamName })
          .login({ username, password })

        const actualBuilds = await fly.builds({ count })

        expect(actualBuilds).to.eql(expectedBuilds)
      })

    it('passes no limit when count is null',
      async () => {
        const uri = 'https://concourse.example.com'

        const username = 'some-username'
        const password = 'some-password'
        const authentication = 'Basic c29tZS11c2VybmFtZTpzb21lLXBhc3N3b3Jk'

        const bearerToken = data.randomBearerToken()
        const authToken = build.api.authToken({ value: bearerToken })

        const teamName = data.randomTeamName()

        const buildData = data.randomBuild({
          teamName
        })

        const buildFromApi = build.api.build(buildData)
        const buildsFromApi = [buildFromApi]

        const convertedBuild = build.client.build(buildData)

        const expectedBuilds = [convertedBuild]

        mock.onGet(
          `${uri}/teams/${teamName}/auth/token`,
          {
            headers: {
              'Authorization': authentication
            }
          })
          .reply(200, authToken)

        mock.onGet(
          `${uri}/builds`,
          {
            headers: {
              'Authorization': `Bearer ${bearerToken}`
            },
            params: {}
          })
          .reply(200, buildsFromApi)

        const fly = await new Concourse({ uri, teamName })
          .login({ username, password })

        const actualBuilds = await fly.builds({ count: null })

        expect(actualBuilds).to.eql(expectedBuilds)
      })

    it('gets builds for job when provided',
      async () => {
        const uri = 'https://concourse.example.com'

        const username = 'some-username'
        const password = 'some-password'
        const authentication = 'Basic c29tZS11c2VybmFtZTpzb21lLXBhc3N3b3Jk'

        const bearerToken = data.randomBearerToken()
        const authToken = build.api.authToken({ value: bearerToken })

        const teamName = data.randomTeamName()
        const pipelineName = data.randomPipelineName()
        const jobName = data.randomJobName()

        const buildData = data.randomBuild({
          teamName,
          pipelineName,
          jobName
        })

        const buildFromApi = build.api.build(buildData)
        const buildsFromApi = [buildFromApi]

        const convertedBuild = build.client.build(buildData)

        const expectedBuilds = [convertedBuild]

        mock.onGet(
          `${uri}/teams/${teamName}/auth/token`,
          {
            headers: {
              'Authorization': authentication
            }
          })
          .reply(200, authToken)

        mock.onGet(
          `${uri}/teams/${teamName}/pipelines/${pipelineName}/` +
            `jobs/${jobName}/builds`,
          {
            headers: {
              'Authorization': `Bearer ${bearerToken}`
            },
            params: {
              limit: 50
            }
          })
          .reply(200, buildsFromApi)

        const fly = await new Concourse({ uri, teamName })
          .login({ username, password })

        const actualBuilds = await fly.builds({
          job: `${pipelineName}/${jobName}`
        })

        expect(actualBuilds).to.eql(expectedBuilds)
      })
  })
})
