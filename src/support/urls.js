export const infoUrl = (url) =>
  `${url}/info`

export const allTeamsUrl = (url) =>
  `${url}/teams`
export const allWorkersUrl = (url) =>
  `${url}/workers`
export const allPipelinesUrl = (url) =>
  `${url}/pipelines`
export const allJobsUrl = (url) =>
  `${url}/jobs`
export const allBuildsUrl = (url) =>
  `${url}/builds`
export const allResourcesUrl = (url) =>
  `${url}/resources`

export const workerPruneUrl = (url, workerName) =>
  `${url}/workers/${workerName}/prune`

export const buildUrl = (url, buildId) =>
  `${url}/builds/${buildId}`
export const buildResourcesUrl = (url, buildId) =>
  `${url}/builds/${buildId}/resources`

export const teamAuthTokenUrl = (url, teamName) =>
  `${url}/teams/${teamName}/auth/token`

export const teamPipelinesUrl = (url, teamName) =>
  `${url}/teams/${teamName}/pipelines`
export const teamPipelineUrl = (url, teamName, pipelineName) =>
  `${url}/teams/${teamName}/pipelines/${pipelineName}`

export const teamBuildsUrl = (url, teamName) =>
  `${url}/teams/${teamName}/builds`

export const teamContainersUrl = (url, teamName) =>
  `${url}/teams/${teamName}/containers`
export const teamContainerUrl = (url, teamName, containerId) =>
  `${url}/teams/${teamName}/containers/${containerId}`

export const teamVolumesUrl = (url, teamName) =>
  `${url}/teams/${teamName}/volumes`

export const teamPipelineBuildsUrl = (url, teamName, pipelineName) =>
  `${url}/teams/${teamName}/pipelines/${pipelineName}/builds`

export const teamPipelineJobsUrl = (url, teamName, pipelineName) =>
  `${url}/teams/${teamName}/pipelines/${pipelineName}/jobs`
export const teamPipelineJobUrl = (url, teamName, pipelineName, jobName) =>
  `${url}/teams/${teamName}/pipelines/${pipelineName}/jobs/${jobName}`

export const teamPipelineJobBuildsUrl =
  (url, teamName, pipelineName, jobName) =>
    `${url}/teams/${teamName}/pipelines/${pipelineName}/jobs/${jobName}/builds`
export const teamPipelineJobBuildUrl =
  (url, teamName, pipelineName, jobName, buildName) =>
    `${url}/teams/${teamName}/pipelines/${pipelineName}/jobs/${jobName}` +
    `/builds/${buildName}`
export const teamPipelineJobInputsUrl =
  (url, teamName, pipelineName, jobName) =>
    `${url}/teams/${teamName}/pipelines/${pipelineName}/jobs/${jobName}/inputs`

export const teamPipelineResourcesUrl = (url, teamName, pipelineName) =>
  `${url}/teams/${teamName}/pipelines/${pipelineName}/resources`
export const teamPipelineResourceUrl =
  (url, teamName, pipelineName, resourceName) =>
    `${url}/teams/${teamName}/pipelines/${pipelineName}` +
    `/resources/${resourceName}`

export const teamPipelineResourceTypesUrl = (url, teamName, pipelineName) =>
  `${url}/teams/${teamName}/pipelines/${pipelineName}/resource-types`

export const teamPipelineResourceVersionsUrl =
  (url, teamName, pipelineName, resourceName) =>
    `${url}/teams/${teamName}/pipelines/${pipelineName}` +
    `/resources/${resourceName}/versions`
export const teamPipelineResourceVersionUrl =
  (url, teamName, pipelineName, resourceName, versionId) =>
    `${url}/teams/${teamName}/pipelines/${pipelineName}` +
    `/resources/${resourceName}/versions/${versionId}`

export const teamPipelineResourceVersionCausalityUrl =
  (url, teamName, pipelineName, resourceName, versionId) =>
    `${url}/teams/${teamName}/pipelines/${pipelineName}` +
    `/resources/${resourceName}/versions/${versionId}/causality`
export const teamPipelineResourceVersionInputToUrl =
  (url, teamName, pipelineName, resourceName, versionId) =>
    `${url}/teams/${teamName}/pipelines/${pipelineName}` +
    `/resources/${resourceName}/versions/${versionId}/input_to`
export const teamPipelineResourceVersionOutputOfUrl =
  (url, teamName, pipelineName, resourceName, versionId) =>
    `${url}/teams/${teamName}/pipelines/${pipelineName}` +
    `/resources/${resourceName}/versions/${versionId}/output_of`
