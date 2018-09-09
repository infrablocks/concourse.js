# concourse.js 

[![NPM Version](https://img.shields.io/npm/v/@infrablocks/concourse.svg)](https://www.npmjs.com/package/@infrablocks/concourse)
[![NPM Downloads](https://img.shields.io/npm/dm/@infrablocks/concourse.svg)](http://npm-stat.com/charts.html?package=@infrablocks/concourse)
[![Dependency Status](https://david-dm.org/infrablocks/concourse.js/status.svg)](https://david-dm.org/infrablocks/concourse.js#info=dependencies)
[![devDependency Status](https://david-dm.org/infrablocks/concourse.js/dev-status.svg)](https://david-dm.org/infrablocks/concourse.js#info=devDependencies)

A JavaScript SDK for the Concourse CI API.

## Installation

```bash
npm install --save @infrablocks/concourse
```

## Usage

### Construction

`concourse` provides a client for interaction with the Concourse CI API. The 
client expects to authenticate using basic authentication credentials for a
particular team. To construct a client:

```javascript
import { Client } from '@infrablocks/concourse'

const url = 'https://concourse.example.com'
const username = 'concourse-client'
const password = 'super-secret-password'
const teamName = 'main'

const client = Client.instanceFor(url, username, password, teamName)
```

Note, `teamName` only needs to be provided for a Concourse CI instance with a 
version less than `4.0.0`.

The client does not yet have full coverage of all available API endpoints, 
(currently at 48% coverage) however that is the eventual goal. The methods 
currently supported are detailed below.

### `Client` Methods 

* `Client#getInfo()` - Returns an object with server version information.
* `Client#listTeams()` - Returns an array of all teams.
* `Client#forTeam(teamId)` - Returns a `TeamClient` for the team specified by 
  `teamId`. See below for more details of the methods supported on `TeamClient`.
* `Client#listWorkers()` - Returns an array of all workers.
* `Client#forWorker(workerName)` - Returns a `WorkerClient` for the worker
  specified by `workerName`. See below for more details of the methods 
  supported on `WorkerClient`.
* `Client#listPipelines()` - Returns an array of all pipelines across all teams.
* `Client#listJobs()` - Returns an array of all jobs across all teams.
* `Client#listResources()` - Returns an array of all resources across all teams. 
* `Client#listBuilds(options = {})` - Returns an array of all builds across all 
  teams. The `options` map can contain:
  * `limit` - the number of builds to include in the response (integral, > 1).
  * `since` - the ID of a build to fetch from (integral, > 1).
  * `id` - the ID of a build to fetch up to (integral, > 1).
* `Client#getBuild(buildId)` - Returns the build specified by `buildId`.
* `Client#forBuild(buildId)` - Returns a `BuildClient` for the build specified 
  by `buildId`. See below for more details of the methods supported on 
  `BuildClient`.
  
### `BuildClient` Methods

* `BuildClient#listResources()` - Returns an array of resources for the build.

### `WorkerClient` Methods

* `WorkerClient#prune()` - Prunes the worker.
  
### `TeamClient` Methods

* `TeamClient#rename(newTeamName)` - Renames the team to the provided 
  `newTeamName`.
* `TeamClient#listPipelines()` - Returns an array of team pipelines.
* `TeamClient#getPipeline(pipelineName)` - Returns the team pipeline specified 
  by `pipelineName`.
* `TeamClient#forPipeline(pipelineName)` - Returns a `TeamPipelineClient` for 
  the pipeline specified by `pipelineName`. See below for more details of the 
  methods supported on `TeamPipelineClient`.
* `TeamClient#listBuilds(options = {})`- Returns an array of team builds. The 
  `options` map can contain:
  * `limit` - the number of builds to include in the response (integral, > 1).
  * `since` - the ID of a build to fetch from (integral, > 1).
  * `id` - the ID of a build to fetch up to (integral, > 1).
* `TeamClient#listContainers(options = {})` - Returns an array of team
  containers matched by the specified options:
  * `type` - one of `check`, `get` or `put` determining the type of the 
    container. If `type` is `check`, `pipelineName` and `resourceName` must also
    be provided.
  * `pipelineId` - the ID of the pipeline for which to fetch containers 
    (integral, > 1).
  * `pipelineName` - the name of the pipeline for which to fetch containers 
    (string).
  * `jobId` - the ID of the job for which to fetch containers (integral, > 1).
  * `jobName` - the name of the job for which to fetch containers (string). 
  * `stepName` - the name of the step for which to fetch containers (string).
  * `resourceName` - the name of the resource for which to fetch containers 
    (string).
  * `attempt` - the attempt of the build for which to fetch containers (string).
  * `buildId` - the ID of the build for which to fetch containers 
    (integral, > 1).
  * `buildName` - the name of the build for which to fetch containers (string).
* `TeamClient#getContainer(containerId)` - Returns the container specified by 
  `containerId`.
* `TeamClient#listVolumes()` - Returns an array of team volumes.

### `TeamPipelineClient` Methods

* `TeamPipelineClient#pause()` - Pauses the team pipeline.
* `TeamPipelineClient#unpause()` - Unpauses the team pipeline.
* `TeamPipelineClient#delete()` - Deletes the pipeline.
* `TeamPipelineClient#listJobs()` - Returns an array of team pipeline jobs.
* `TeamPipelineClient#getJob(jobName)` - Returns the team pipeline job 
  specified by `jobName`.
* `TeamPipelineClient#forJob(jobName)` - Returns a `TeamPipelineJobClient` for 
  the job specified by `jobName`. See below for more details of the 
  methods supported on `TeamPipelineJobClient`.
* `TeamPipelineClient#listResources()` - Returns an array of team pipeline 
   resources.
* `TeamPipelineClient#getResource(resourceName)` - Returns the team pipeline 
  resource specified by `resourceName`.
* `TeamPipelineClient#forResource(resourceName)` - Returns a 
  `TeamPipelineResourceClient` for the resource specified by `resourceName`. 
  See below for more details of the methods supported on 
  `TeamPipelineResourceClient`.
* `TeamPipelineClient#listResourceTypes()` - Returns an array of team pipeline 
  resource types.

### `TeamPipelineJobClient` Methods

* `TeamPipelineJobClient#pause()` - Pauses the team pipeline job.
* `TeamPipelineJobClient#unpause()` - Unpauses the team pipeline job.
* `TeamPipelineJobClient#listBuilds()` - Returns an array of team pipeline job 
  builds.
* `TeamPipelineJobClient#getBuild(buildName)` - Returns the team pipeline job 
  build specified by `buildName`.
* `TeamPipelineJobClient#listInputs()` - Returns an array of team pipeline job 
  inputs.
  
### `TeamPipelineResourceClient` Methods
  
* `TeamPipelineResourceClient#pause()` - Pauses the team pipeline resource.
* `TeamPipelineResourceClient#unpause()` - Unpauses the team pipeline resource.  
* `TeamPipelineResourceClient#listVersions(options = {})` - Returns an array of 
  team pipeline resource versions. The `options` map can contain:
  * `limit` - the number of versions to include in the response (integral, > 1).
  * `since` - the ID of a version to fetch from (integral, > 1).
  * `id` - the ID of a version to fetch up to (integral, > 1).
* `TeamPipelineResourceClient#getVersion(versionId)` - Returns the team pipeline 
  resource version specified by `versionId`.
* `TeamPipelineClient#forVersion(versionId)` - Returns a 
  `TeamPipelineResourceVersionClient` for the version specified by `versionId`.
  
### `TeamPipelineResourceVersionClient` Methods

* `TeamPipelineResourceVersionClient#getCausality()` - Returns the team pipeline 
  resource version's causality.
* `TeamPipelineResourceVersionClient#listBuildsWithVersionAsInput()` - Returns 
  an array of all builds that have the resource version represented by the 
  client as an input.
* `TeamPipelineResourceVersionClient#listBuildsWithVersionAsOutput()` - Returns 
  an array of all builds that have the resource version represented by the 
  client as an output.

## Example

```javascript
const teams = await client.listTeams()
// => [{id: 1, name: "main"}] 

const teamClient = await client.forTeam(teams[0].id)
// => TeamClient {apiUrl: "https://concourse.example.com/api/v1", httpClient: ..., team: {...}

const pipelines = await teamClient.listPipelines()
// => [{id: 1, name: "test-pipeline", paused: false, public: false, teamName: "main" }]

const containers = await teamClient.listContainers({pipelineName: pipelines[0].name})
// => [{ id: "4fd6fbe8-2456-49b9-6464-4eab8f2a7ce3", workerName: "f9214ff6a574", type: "check"}]
```

## Development

After checking out the repo, run `npm install` to install dependencies. Then, 
run `npm run test` to run the tests. 

## Contributing

Bug reports and pull requests are welcome on GitHub at 
https://github.com/infrablocks/concourse. This project is intended to be a
safe, welcoming space for collaboration, and contributors are expected to adhere
to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The gem is available as open source under the terms of the 
[MIT License](http://opensource.org/licenses/MIT).
