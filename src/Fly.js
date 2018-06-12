import axios from 'axios';
import { Base64 } from 'js-base64';

const authorizationHeaderName = 'Authorization';

const basicAuthToken = (username, password) =>
  Base64.encode(`${username}:${password}`);

const basicAuthHeaderValue = (username, password) =>
  `Basic ${basicAuthToken(username, password)}`;
const bearerAuthHeaderValue = (token) =>
  `Bearer ${token}`;

const basicAuthHeader = (username, password) => ({
  [authorizationHeaderName]: basicAuthHeaderValue(username, password)
});
const bearerAuthHeader = (token) => ({
  [authorizationHeaderName]: bearerAuthHeaderValue(token)
});

const authTokenUri = (uri, team) =>
  `${uri}/teams/${team}/auth/token`;
const jobsUri = (uri, team, pipeline) =>
  `${uri}/teams/${team}/pipelines/${pipeline}/jobs`;

export default class Fly {
  constructor(options) {
    this.uri = options.uri;
    this.team = options.team;
    this.username = options.username;
    this.password = options.password;
  }

  async login(options) {
    return new Fly({
      uri: this.uri,
      team: options.team || this.team,
      username: options.username,
      password: options.password,
    });
  }

  async jobs(options) {
    const bearerAuthTokenResponse = await axios
      .get(authTokenUri(this.uri, this.team), {
        headers: basicAuthHeader(this.username, this.password)
      });
    const bearerAuthToken = bearerAuthTokenResponse.data;

    const jobsResponse = await axios
      .get(jobsUri(this.uri, this.team, options.pipeline), {
        headers: bearerAuthHeader(bearerAuthToken.value)
      });
    const jobs = jobsResponse.data;

    return jobs;
  }
}