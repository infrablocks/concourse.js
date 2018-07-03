export const authTokenUri = (uri, team) =>
  `${uri}/teams/${team}/auth/token`

export const allPipelinesUri = (uri) =>
  `${uri}/pipelines`
export const allBuildsUri = (uri) =>
  `${uri}/builds`

export const pipelinesUri = (uri, team) =>
  `${uri}/teams/${team}/pipelines`
export const buildsUri = (uri, team) =>
  `${uri}/teams/${team}/builds`

export const pipelineBuildsUri = (uri, team, pipeline) =>
  `${uri}/teams/${team}/pipelines/${pipeline}/builds`

export const jobsUri = (uri, team, pipeline) =>
  `${uri}/teams/${team}/pipelines/${pipeline}/jobs`
export const jobBuildsUri = (uri, team, pipeline, job) =>
  `${uri}/teams/${team}/pipelines/${pipeline}/jobs/${job}/builds`
