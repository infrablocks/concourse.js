import faker from 'faker'

export const authToken =
  ({
    type = 'Bearer',
    value = faker.random.alphaNumeric(800)
  } = {}) => ({
    type,
    value
  })

export const team =
  ({
    id = 1,
    name = 'example-team'
  } = {}) => ({
    id,
    name
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

export const resource =
  ({
    name = 'example-resource',
    pipelineName = 'example-pipeline',
    teamName = 'example-team',
    type = 'git',
    lastChecked = 1524830894
  } = {}) => ({
    name,
    pipeline_name: pipelineName,
    team_name: teamName,
    type,
    last_checked: lastChecked
  })

export const resourceType =
  ({
    type = 'example-type',
    image = '/concourse-work-dir/3.14.1/assets/resource-images/example/rootfs',
    version = 'ffc6f68716afa5ad585e6ec90922ff3233fd077f',
    privileged = false
  } = {}) => ({
    type,
    image,
    version,
    privileged
  })

export const container =
  ({
    id = '663c9baf-f6e8-4abd-7fcd-fabf51d3b7de',
    workerName = '7f3b5c6591bc',
    type = 'get',
    stepName = 'notify',
    pipelineId = 47,
    jobId = 347,
    buildId = 18331,
    pipelineName = 'webapp',
    jobName = 'publish',
    buildName = '78',
    workingDirectory = '/tmp/notify/get',
  } = {}) => ({
    id,
    worker_name: workerName,
    type,
    step_name: stepName,
    pipeline_id: pipelineId,
    job_id: jobId,
    build_id: buildId,
    pipeline_name: pipelineName,
    job_name: jobName,
    build_name: buildName,
    working_directory: workingDirectory
  })

export const worker =
  ({
    addr = '10.240.3.194:45821',
    baggageclaimUrl = 'http://10.240.3.194:45995',
    activeContainers = 3,
    activeVolumes = 0,
    resourceTypes = [resourceType()],
    platform = 'linux',
    tags = null,
    team = '',
    name = '9aa6920cfc41',
    startTime = 1532162932,
    state = 'running',
    version = '2.1'
  } = {}) => ({
    addr,
    baggageclaim_url: baggageclaimUrl,
    active_containers: activeContainers,
    active_volumes: activeVolumes,
    resource_types: resourceTypes,
    platform,
    tags,
    team,
    name,
    version,
    start_time: startTime,
    state
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
