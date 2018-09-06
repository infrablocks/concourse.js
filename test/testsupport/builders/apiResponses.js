export const authToken =
  ({
    type = 'Bearer',
    value = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjc3JmIjoiOWI2OWE0Y2VhNm' +
    'FhNTIwNGJkMmFiZGNhMTZmZWU2OWQzYjliYTZkNGE4ODliYTQyOWJjMGJhYWFlMDhkNTYwO' +
    'SIsImV4cCI6MTUzNTk3NTQ0MSwiaXNBZG1pbiI6dHJ1ZSwidGVhbU5hbWUiOiJtYWluIn0.' +
    'QFx9M1dq9SVcxVjqjcjFNhKhZLwXfYiY2v-r1G7kPESz5F_Lw0cRawBqihm14MokJwFquzE' +
    'kdpKitf2Lwj0lwSd5vMwEycCBuan-eLksekFvdu3TNg4beXr4Y27QV-i7FhUNq21-ZLwNcz' +
    'IHFSJ9IHdnDHOmX8-40Tw_L4P5x8okkdVWlsSWs3tt4b9TE2YN08oekJKifAnEIwg8Kb2mV' +
    'ubTeOxNxopC3HEhmu0xOMpjRNSTV9vtiyXw0oR6Lk50HHZmX4gD1Z0XKAz-pUK1GutTjDn2' +
    'WU9RYM4l0Q5MML-_7OwuMFG86nJ7qwITyv0PTLdRFLgOPykuyYAtcSWXEDOTaHwFqTxwoe_' +
    'uwbZG4BxtDrHEgJ0yPBxjnf5YVHMgkTNe9FdDRlYx9XEzt62-Kaf1BvGhXFC-NEFI-jUOZg' +
    'gI7XTTWtaTuYUWqTCsFirX5iZqph-m_9A7EOIHfpjZpzWB0nxTkCzp-VsB9jfKErf4wjSH8' +
    'LzAH4PP88sNe83IGonqgRa4bLmM-P-MW60Tkd2HllpZdHPsLLQkFNmkzZtgl3vGKf_gm19z' +
    'v9waOSTg-0PjMzrFtU930tHKwJHyRCfY5YDLXQmXHXm96osn0ViircSCFAOFQH8mY0gyoz2' +
    'iUpLnB7TMUOQvsTuHMPPSXans5LkZTxoBz__P0LQVo0Y'
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

export const resourceVersionMetadata =
  ({
    name = 'version',
    value = '1.2.3'
  } = {}) => ({
    name,
    value
  })

export const resourceVersionVersion =
  ({
    ref = 'cbc6ccd3c257fe3ac17d98eb258b1c5b70ee660c'
  } = {}) => ({
    ref
  })

export const resourceVersion =
  ({
    id = 29963,
    type = 'git',
    metadata = resourceVersionMetadata(),
    resource = 'example-resource',
    enabled = true,
    version = resourceVersionVersion()
  } = {}) => ({
    id,
    type,
    metadata,
    resource,
    enabled,
    version
  })

export const resourceVersionCause =
  ({
    versionedResourceId = '123',
    buildId = '456'
  } = {}) => ({
    versioned_resource_id: versionedResourceId,
    build_id: buildId
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
