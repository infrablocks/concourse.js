import faker from 'faker';

export const buildAuthToken =
  ({
    type = 'Bearer',
    value = faker.random.alphaNumeric(800),
   } = {}) => ({
    type,
    value
  });

export const buildBuild =
  ({
    id = 10416,
    name = '81',
    status = 'succeeded',
    teamName = 'example-team',
    pipelineName = 'example-pipeline',
    jobName = 'example-job',
    url = '/teams/example-team/pipelines/example-pipeline/jobs/example-job/builds/81',
    apiUrl = '/api/v1/builds/10416',
    startTime = 1524830894,
    endTime = 1524831161
  } = {}) => ({
    id,
    team_name: teamName,
    name,
    status,
    job_name: jobName,
    url,
    api_url: apiUrl,
    pipeline_name: pipelineName,
    start_time: startTime,
    end_time: endTime
  });

export const buildInput =
  ({
    name = 'example-input',
    resource = 'example-resource',
    trigger = true,
  } = {}) => ({
    name,
    resource,
    trigger
  });

export const buildOutput =
  ({
     name = 'example-output',
     resource = 'example-resource'
   } = {}) => ({
    name,
    resource
  });

export const buildJob =
  ({
    id = 288,
    name = 'build',
    url = '/teams/example-team/pipelines/example-pipeline/jobs/build',
    nextBuild = null,
    finishedBuild = buildBuild(),
    inputs = [buildInput()],
    outputs = [buildOutput()],
    groups = [],
  } = {}) => ({
    id,
    name,
    url,
    next_build: nextBuild,
    finished_build: finishedBuild,
    inputs,
    outputs,
    groups
  });