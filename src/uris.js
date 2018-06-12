export const authTokenUri = (uri, team) =>
  `${uri}/teams/${team}/auth/token`;
export const jobsUri = (uri, team, pipeline) =>
  `${uri}/teams/${team}/pipelines/${pipeline}/jobs`;
