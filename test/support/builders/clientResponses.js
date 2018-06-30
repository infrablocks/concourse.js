export const pipeline =
  ({
     id = 53,
     name = 'example-pipeline',
     url = '/teams/example-team/pipelines/example-pipeline',
     isPaused = false,
     isPublic = false,
     teamName = 'example-team'
   } = {}) => ({
    id,
    name,
    url,
    paused: isPaused,
    'public': isPublic,
    teamName
  });

export const input =
  ({
     name = 'example-input',
     resource = 'example-resource',
     trigger = true,
   } = {}) => ({
    name,
    resource,
    trigger
  });

export const output =
  ({
     name = 'example-output',
     resource = 'example-resource'
   } = {}) => ({
    name,
    resource
  });

export const build =
  ({
     id = 10416,
     name = '81',
     status = 'succeeded',
     teamName = 'example-teamName',
     pipelineName = 'example-pipeline',
     jobName = 'example-job',
     url = '/teams/example-teamName/pipelines/example-pipeline/jobs/example-job/builds/81',
     apiUrl = '/api/v1/builds/10416',
     startTime = 1524830894,
     endTime = 1524831161
   } = {}) => ({
    id,
    teamName,
    name,
    status,
    jobName,
    url,
    apiUrl,
    pipelineName,
    startTime,
    endTime
  });

export const job =
  ({
     id = 288,
     name = 'build',
     url = '/teams/example-teamName/pipelines/example-pipeline/jobs/build',
     nextBuild = null,
     finishedBuild = build(),
     inputs = [input()],
     outputs = [output()],
     groups = [],
   } = {}) => ({
    id,
    name,
    url,
    nextBuild,
    finishedBuild,
    inputs,
    outputs,
    groups
  });