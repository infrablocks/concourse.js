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

export const teamPipelineBuildsUrl = (url, teamName, pipelineName) =>
  `${url}/teams/${teamName}/pipelines/${pipelineName}/builds`

export const teamPipelineJobsUrl = (url, teamName, pipelineName) =>
  `${url}/teams/${teamName}/pipelines/${pipelineName}/jobs`
export const teamPipelineJobBuildsUrl =
  (url, teamName, pipelineName, jobName) =>
    `${url}/teams/${teamName}/pipelines/${pipelineName}/jobs/${jobName}/builds`
