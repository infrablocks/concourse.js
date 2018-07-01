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
    teamName
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
    teamName,
    name,
    status,
    jobName,
    apiUrl,
    pipelineName,
    startTime,
    endTime
  })

export const job =
  ({
    id = 288,
    name = 'build',
    pipelineName = 'example-pipeline',
    teamName = 'example-teamName',
    nextBuild = null,
    finishedBuild = build(),
    inputs = [input()],
    outputs = [output()],
    groups = null
  } = {}) => ({
    id,
    name,
    pipelineName,
    teamName,
    nextBuild,
    finishedBuild,
    inputs,
    outputs,
    groups
  })
