import axios from 'axios';
import { basicAuthHeader, bearerAuthHeader } from './http';
import { authTokenUri, jobsUri } from './uris';
import { schemaFor, string, uri, validateOptions } from './validation';

export default class Fly {
  constructor(options) {
    const validatedOptions = validateOptions(
      schemaFor({
        uri: uri().required(),
        team: string(),
        username: string(),
        password: string(),
      }), options);

    this.uri = validatedOptions.uri;
    this.team = validatedOptions.team;
    this.username = validatedOptions.username;
    this.password = validatedOptions.password;
  }

  async login(options) {
    const validatedOptions = validateOptions(
      schemaFor({
        username: string().required(),
        password: string().required(),
        team: string()
      }), options);

    return new Fly({
      uri: this.uri,
      team: validatedOptions.team || this.team,
      username: validatedOptions.username,
      password: validatedOptions.password,
    });
  }

  async jobs(options) {
    const validatedOptions = validateOptions(
      schemaFor({
        pipeline: string().required()
      }), options);

    const bearerAuthTokenResponse = await axios
      .get(authTokenUri(this.uri, this.team), {
        headers: basicAuthHeader(this.username, this.password)
      });
    const bearerAuthToken = bearerAuthTokenResponse.data;

    const jobsResponse = await axios
      .get(jobsUri(this.uri, this.team, validatedOptions.pipeline), {
        headers: bearerAuthHeader(bearerAuthToken.value)
      });
    const jobs = jobsResponse.data;

    return jobs;
  }
}