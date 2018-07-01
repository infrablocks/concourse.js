import faker from 'faker'

export const authToken =
  ({
    type = 'Bearer',
    value = faker.random.alphaNumeric(800)
  } = {}) => ({
    type,
    value
  })

export const pipeline =
  ({
    id = 53,
    name = 'example-pipeline',
    isPaused = false,
    isPublic = false,
    teamName = 'example-team'
  } = {}) => ({
    id,
    name,
    paused: isPaused,
    'public': isPublic,
    team_name: teamName
  })

export const build =
  ({
    id = 10416,
    name = '81',
    status = 'succeeded',
    teamName = 'example-teamName',
    pipelineName = 'example-pipeline',
    jobName = 'example-job',
    apiUrl = '/api/v1/builds/10416',
    startTime = 1524830894,
    endTime = 1524831161
  } = {}) => ({
    id,
    team_name: teamName,
    name,
    status,
    job_name: jobName,
    api_url: apiUrl,
    pipeline_name: pipelineName,
    start_time: startTime,
    end_time: endTime
  })

export const input =
  ({
    name = 'example-input',
    resource = 'example-resource',
    trigger = true
  } = {}) => ({
    name,
    resource,
    trigger
  })

export const output =
  ({
    name = 'example-output',
    resource = 'example-resource'
  } = {}) => ({
    name,
    resource
  })

export const job =
  ({
    id = 288,
    name = 'build',
    pipelineName = 'example-pipeline',
    teamName = 'example-team-name',
    nextBuild = null,
    finishedBuild = build(),
    inputs = [input()],
    outputs = [output()],
    groups = null
  } = {}) => ({
    id,
    name,
    pipeline_name: pipelineName,
    team_name: teamName,
    next_build: nextBuild,
    finished_build: finishedBuild,
    inputs,
    outputs,
    groups
  })
