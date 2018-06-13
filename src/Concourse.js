import axios from 'axios';
import { basicAuthHeader, bearerAuthHeader } from './http';
import { allPipelinesUri, authTokenUri, jobsUri, pipelinesUri } from './uris';
import { boolean, schemaFor, string, uri, validateOptions } from './validation';

export default class Concourse {
  constructor(options) {
    const validatedOptions = validateOptions(
      schemaFor({
        uri: uri().required(),
        teamName: string(),
        username: string(),
        password: string(),
      }), options);

    this.uri = validatedOptions.uri;
    this.teamName = validatedOptions.teamName;
    this.username = validatedOptions.username;
    this.password = validatedOptions.password;
  }

  async login(options) {
    const validatedOptions = validateOptions(
      schemaFor({
        username: string().required(),
        password: string().required(),
        teamName: string()
      }), options);

    return new Concourse({
      uri: this.uri,
      teamName: validatedOptions.teamName || this.teamName,
      username: validatedOptions.username,
      password: validatedOptions.password,
    });
  }

  async jobs(options) {
    const validatedOptions = validateOptions(
      schemaFor({
        pipeline: string().required()
      }), options);

    const { data: bearerAuthToken } = await axios
      .get(authTokenUri(this.uri, this.teamName), {
        headers: basicAuthHeader(this.username, this.password)
      });

    const { data: jobs } = await axios
      .get(jobsUri(this.uri, this.teamName, validatedOptions.pipeline), {
        headers: bearerAuthHeader(bearerAuthToken.value)
      });

    return jobs;
  }

  async pipelines(options = {}) {
    const validatedOptions = validateOptions(
      schemaFor({
        all: boolean()
      }), options);

    const { data: bearerAuthToken }= await axios
      .get(authTokenUri(this.uri, this.teamName), {
        headers: basicAuthHeader(this.username, this.password)
      });

    const uri = validatedOptions.all ?
      allPipelinesUri(this.uri) :
      pipelinesUri(this.uri, this.teamName);

    const { data: pipelines } = await axios
      .get(uri, {
        headers: bearerAuthHeader(bearerAuthToken.value)
      });

    return pipelines;
  }
}