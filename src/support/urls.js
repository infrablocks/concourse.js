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

export const buildUrl = (url, buildId) =>
  `${url}/builds/${buildId}`

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
