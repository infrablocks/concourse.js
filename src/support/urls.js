export const apiUrl = (concourseUrl) =>
  `${concourseUrl}/api/v1`

export const skyTokenUrl = (concourseUrl) =>
  `${concourseUrl}/sky/token`

export const infoUrl = (apiUrl) =>
  `${apiUrl}/info`

export const allTeamsUrl = (apiUrl) =>
  `${apiUrl}/teams`
export const allWorkersUrl = (apiUrl) =>
  `${apiUrl}/workers`
export const allPipelinesUrl = (apiUrl) =>
  `${apiUrl}/pipelines`
export const allJobsUrl = (apiUrl) =>
  `${apiUrl}/jobs`
export const allBuildsUrl = (apiUrl) =>
  `${apiUrl}/builds`
export const allResourcesUrl = (apiUrl) =>
  `${apiUrl}/resources`

export const workerPruneUrl = (apiUrl, workerName) =>
  `${apiUrl}/workers/${workerName}/prune`

export const buildUrl = (apiUrl, buildId) =>
  `${apiUrl}/builds/${buildId}`
export const buildResourcesUrl = (apiUrl, buildId) =>
  `${apiUrl}/builds/${buildId}/resources`

export const teamAuthTokenUrl = (apiUrl, teamName) =>
  `${apiUrl}/teams/${teamName}/auth/token`

export const teamUrl = (apiUrl, teamName) =>
  `${apiUrl}/teams/${teamName}`
export const teamRenameUrl = (apiUrl, teamName) =>
  `${apiUrl}/teams/${teamName}/rename`

export const teamPipelinesUrl = (apiUrl, teamName) =>
  `${apiUrl}/teams/${teamName}/pipelines`
export const teamPipelineUrl = (apiUrl, teamName, pipelineName) =>
  `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}`
export const teamPipelinePauseUrl = (apiUrl, teamName, pipelineName) =>
  `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/pause`
export const teamPipelineUnpauseUrl = (apiUrl, teamName, pipelineName) =>
  `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/unpause`

export const teamBuildsUrl = (apiUrl, teamName) =>
  `${apiUrl}/teams/${teamName}/builds`

export const teamContainersUrl = (apiUrl, teamName) =>
  `${apiUrl}/teams/${teamName}/containers`
export const teamContainerUrl = (apiUrl, teamName, containerId) =>
  `${apiUrl}/teams/${teamName}/containers/${containerId}`

export const teamVolumesUrl = (apiUrl, teamName) =>
  `${apiUrl}/teams/${teamName}/volumes`

export const teamPipelineBuildsUrl = (apiUrl, teamName, pipelineName) =>
  `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/builds`

export const teamPipelineJobsUrl = (apiUrl, teamName, pipelineName) =>
  `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/jobs`
export const teamPipelineJobUrl = (apiUrl, teamName, pipelineName, jobName) =>
  `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/jobs/${jobName}`
export const teamPipelineJobPauseUrl =
  (apiUrl, teamName, pipelineName, jobName) =>
    `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
    `/jobs/${jobName}/pause`
export const teamPipelineJobUnpauseUrl =
  (apiUrl, teamName, pipelineName, jobName) =>
    `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/` +
    `jobs/${jobName}/unpause`

export const teamPipelineJobBuildsUrl =
  (apiUrl, teamName, pipelineName, jobName) =>
    `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/jobs/${jobName}` +
    '/builds'
export const teamPipelineJobBuildUrl =
  (apiUrl, teamName, pipelineName, jobName, buildName) =>
    `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/jobs/${jobName}` +
    `/builds/${buildName}`
export const teamPipelineJobInputsUrl =
  (apiUrl, teamName, pipelineName, jobName) =>
    `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/jobs/${jobName}` +
    '/inputs'

export const teamPipelineResourcesUrl = (apiUrl, teamName, pipelineName) =>
  `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/resources`
export const teamPipelineResourceUrl =
  (apiUrl, teamName, pipelineName, resourceName) =>
    `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
    `/resources/${resourceName}`
export const teamPipelineResourcePauseUrl =
  (apiUrl, teamName, pipelineName, resourceName) =>
    `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
    `/resources/${resourceName}/pause`
export const teamPipelineResourceUnpauseUrl =
  (apiUrl, teamName, pipelineName, resourceName) =>
    `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/` +
    `resources/${resourceName}/unpause`

export const teamPipelineResourceTypesUrl = (apiUrl, teamName, pipelineName) =>
  `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}/resource-types`

export const teamPipelineResourceVersionsUrl =
  (apiUrl, teamName, pipelineName, resourceName) =>
    `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
    `/resources/${resourceName}/versions`
export const teamPipelineResourceVersionUrl =
  (apiUrl, teamName, pipelineName, resourceName, versionId) =>
    `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
    `/resources/${resourceName}/versions/${versionId}`

export const teamPipelineResourceVersionCausalityUrl =
  (apiUrl, teamName, pipelineName, resourceName, versionId) =>
    `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
    `/resources/${resourceName}/versions/${versionId}/causality`
export const teamPipelineResourceVersionInputToUrl =
  (apiUrl, teamName, pipelineName, resourceName, versionId) =>
    `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
    `/resources/${resourceName}/versions/${versionId}/input_to`
export const teamPipelineResourceVersionOutputOfUrl =
  (apiUrl, teamName, pipelineName, resourceName, versionId) =>
    `${apiUrl}/teams/${teamName}/pipelines/${pipelineName}` +
    `/resources/${resourceName}/versions/${versionId}/output_of`
