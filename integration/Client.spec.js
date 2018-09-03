import { expect } from 'chai'

import Client from '../src/Client'

const apiUrl = process.env.CONCOURSE_JS_INTEGRATION_API_URL
const teamName = process.env.CONCOURSE_JS_INTEGRATION_TEAM_NAME
const username = process.env.CONCOURSE_JS_INTEGRATION_USERNAME
const password = process.env.CONCOURSE_JS_INTEGRATION_PASSWORD

const client = Client.instanceFor(apiUrl, teamName, username, password)

describe('Client', () => {
  it('fetches all pipelines', async () => {
    const pipelines = await client.listPipelines()

    expect(pipelines).to.be.an.instanceof(Array)
    expect(pipelines.length).to.be.greaterThan(0)
  })

  it('fetches all teams', async () => {
    const teams = await client.listTeams()

    expect(teams).to.be.an.instanceof(Array)
    expect(teams.length).to.be.greaterThan(0)
  })

  it('fetches all workers', async () => {
    const workers = await client.listWorkers()

    expect(workers).to.be.an.instanceof(Array)
    expect(workers.length).to.be.greaterThan(0)
  })

  it('fetches all jobs', async () => {
    const jobs = await client.listJobs()

    expect(jobs).to.be.an.instanceof(Array)
    expect(jobs.length).to.be.greaterThan(0)
  })

  it('fetches all resources', async () => {
    const resources = await client.listResources()

    expect(resources).to.be.an.instanceof(Array)
    expect(resources.length).to.be.greaterThan(0)
  })

  it('fetches a page of builds', async () => {
    const builds = await client.listBuilds({limit: 10})

    expect(builds).to.be.an.instanceof(Array)
    expect(builds.length).to.eql(10)
  })

  it('fetches a specific build', async () => {
    const builds = await client.listBuilds({limit: 1})
    const build = await client.getBuild(builds[0].id)

    expect(build).to.eql(builds[0])
  });
})
