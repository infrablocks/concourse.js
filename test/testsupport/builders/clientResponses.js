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
    teamName
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
    pipelineName,
    teamName,
    type,
    lastChecked
  })

export const resourceTypeSource =
  ({
    repository = 'cfcommunity/slack-notification-resource',
    tag = 'latest'
  } = {}) => ({
    repository,
    tag
  })

export const resourceType =
  ({
    name = 'example-resource-type',
    type = 'example-type',
    source = resourceTypeSource(),
    version = 'ffc6f68716afa5ad585e6ec90922ff3233fd077f',
    privileged = false,
    tags = null,
    params = null
  } = {}) => ({
    name,
    type,
    source,
    version,
    privileged,
    tags,
    params
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
    workingDirectory = '/tmp/notify/get'
  } = {}) => ({
    id,
    workerName,
    type,
    stepName,
    pipelineId,
    jobId,
    buildId,
    pipelineName,
    jobName,
    buildName,
    workingDirectory
  })

export const workerResourceType =
  ({
    type = 'bosh-deployment',
    image = '/concourse-work-dir/3.14.1/assets/resource-images/bosh-deployment/rootfs',
    version = 'ffc6f68716afa5ad585e6ec90922ff3233fd077f',
    privileged = false
  } = {}) => ({
    type,
    image,
    version,
    privileged
  })

export const worker =
  ({
    addr = '10.240.3.194:45821',
    baggageclaimUrl = 'http://10.240.3.194:45995',
    activeContainers = 3,
    activeVolumes = 0,
    resourceTypes = [workerResourceType()],
    platform = 'linux',
    tags = null,
    team = '',
    name = '9aa6920cfc41',
    startTime = 1532162932,
    state = 'running',
    version = '2.1'
  } = {}) => ({
    addr,
    baggageclaimUrl,
    activeContainers,
    activeVolumes,
    resourceTypes,
    platform,
    tags,
    team,
    name,
    version,
    startTime,
    state
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
