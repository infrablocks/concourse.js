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

export const teamAuthTokenUrl = (url, team) =>
  `${url}/teams/${team}/auth/token`

export const teamPipelinesUrl = (url, team) =>
  `${url}/teams/${team}/pipelines`
export const teamBuildsUrl = (url, team) =>
  `${url}/teams/${team}/builds`

export const teamPipelineBuildsUrl = (url, team, pipeline) =>
  `${url}/teams/${team}/pipelines/${pipeline}/builds`

export const teamPipelineJobsUrl = (url, team, pipeline) =>
  `${url}/teams/${team}/pipelines/${pipeline}/jobs`
export const teamPipelineJobBuildsUrl = (url, team, pipeline, job) =>
  `${url}/teams/${team}/pipelines/${pipeline}/jobs/${job}/builds`
