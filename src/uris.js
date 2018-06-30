export const authTokenUri = (uri, team) =>
  `${uri}/teams/${team}/auth/token`
export const allPipelinesUri = (uri) =>
  `${uri}/pipelines`
export const pipelinesUri = (uri, team) =>
  `${uri}/teams/${team}/pipelines`
export const jobsUri = (uri, team, pipeline) =>
  `${uri}/teams/${team}/pipelines/${pipeline}/jobs`
