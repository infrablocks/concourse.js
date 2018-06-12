import axios from 'axios';
import Joi from 'joi';
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

const string = () => Joi.string();
const uri = () => string().uri();

const schemaFor = (config) =>
  Joi.object().keys(config);

const validateOptions = (schema, options) => {
  const { error, value } = schema.validate(options);

  if (error) {
    const errorDetails = error.details
      .map(detail => detail.message)
      .join(', ');
    throw new Error(`Invalid parameter(s): [${errorDetails}].`);
  }

  return value;
};

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