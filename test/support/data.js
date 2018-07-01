import faker from 'faker'

import { toUnixTime } from './helpers'

const randomId = () => faker.random.number()

const randomBearerToken = () => faker.random.alphaNumeric(800)

const randomBuildName = () => faker.random.word()
const randomBuildStatus = () => faker.random.arrayElement(
  ['succeeded', 'failed'])
const randomBuildApiUrl = () => faker.internet.url()
const randomBuildStartTime = () => toUnixTime(faker.date.past())
const randomBuildEndTime = () => toUnixTime(faker.date.recent())

const randomTeamName = () => faker.random.word()

const randomPipelineName = () => faker.random.word()
const randomPipelineIsPaused = () => faker.random.boolean()
const randomPipelineIsPublic = () => faker.random.boolean()

const randomJobName = () => faker.random.word()
const randomJobGroups = () => []

const randomInputName = () => faker.random.word()
const randomInputResource = () => faker.random.word()
const randomInputTrigger = () => faker.random.boolean()

const randomOutputName = () => faker.random.word()
const randomOutputResource = () => faker.random.word()

const randomPipeline = (overrides = {}) => ({
  id: randomId(),
  name: randomPipelineName(),
  paused: randomPipelineIsPaused(),
  'public': randomPipelineIsPublic(),
  teamName: randomTeamName(),
  ...overrides
})

const randomInput = (overrides = {}) => ({
  name: randomInputName(),
  resource: randomInputResource(),
  trigger: randomInputTrigger(),
  ...overrides
})

const randomOutput = (overrides = {}) => ({
  name: randomOutputName(),
  resource: randomOutputResource(),
  ...overrides
})

const randomJobInputs = () => [randomInput()]
const randomJobOutputs = () => [randomOutput()]

const randomBuild = (overrides = {}) => ({
  id: randomId(),
  name: randomBuildName(),
  status: randomBuildStatus(),
  teamName: randomTeamName(),
  jobName: randomJobName(),
  pipelineName: randomPipelineName(),
  apiUrl: randomBuildApiUrl(),
  startTime: randomBuildStartTime(),
  endTime: randomBuildEndTime(),
  ...overrides
})

const randomJob = (overrides = {}) => ({
  id: randomId(),
  name: randomJobName(),
  pipelineName: randomPipelineName(),
  teamName: randomTeamName(),
  nextBuild: randomBuild(),
  finishedBuild: randomBuild(),
  inputs: randomJobInputs(),
  outputs: randomJobOutputs(),
  groups: randomJobGroups(),
  ...overrides
})

export default {
  randomId,

  randomBearerToken,

  randomBuildName,
  randomBuildStatus,
  randomBuildApiUrl,
  randomBuildStartTime,
  randomBuildEndTime,

  randomBuild,

  randomTeamName,

  randomPipelineName,
  randomPipelineIsPaused,
  randomPipelineIsPublic,

  randomPipeline,

  randomJobName,
  randomJobGroups,

  randomJob,

  randomInputName,
  randomInputResource,
  randomInputTrigger,

  randomInput,

  randomOutputName,
  randomOutputResource,

  randomOutput
}
