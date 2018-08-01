import faker from 'faker'

import { toUnixTime, randomLowerHex } from './helpers'

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

const randomResourceTypeType = () => faker.random.arrayElement(
  ['git', 'docker-image', 'slack-notification'])
const randomResourceTypeImage = () =>
  `/concourse-work-dir/3.14.1/assets/resource-images/${faker.random.word()}` +
  `/rootfs`
const randomResourceTypeVersion = () => randomLowerHex(40)
const randomResourceTypeIsPrivileged = () => faker.random.boolean()

const randomResourceType = (overrides = {}) => ({
  type: randomResourceTypeType(),
  image: randomResourceTypeImage(),
  version: randomResourceTypeVersion(),
  privileged: randomResourceTypeIsPrivileged(),
  ...overrides
})

const randomResourceName = () => faker.random.word()
const randomResourceLastCheckedTime = () => toUnixTime(faker.date.past())

const randomPlatform = () => faker.random.arrayElement(
  ['linux', 'darwin'])

const randomWorkerAddress = () => `${faker.internet.ip()}:45821`
const randomWorkerBaggageclaimUrl = () => `http://${faker.internet.ip()}:45995`
const randomWorkerActiveContainersCount = () => faker.random.number()
const randomWorkerActiveVolumesCount = () => faker.random.number()
const randomWorkerTags = () => null
const randomWorkerName = () => randomLowerHex(12)
const randomWorkerStartTime = () => toUnixTime(faker.date.past())
const randomWorkerState = () => faker.random.arrayElement(
  ['running', 'stalled'])
const randomWorkerVersion = () => '2.1'

const randomResourceTypes = () => [randomResourceType()]

const randomWorker = (overrides = {}) => ({
  addr: randomWorkerAddress(),
  baggageclaimUrl: randomWorkerBaggageclaimUrl(),
  activeContainers: randomWorkerActiveContainersCount(),
  activeVolumes: randomWorkerActiveVolumesCount(),
  resourceTypes: randomResourceTypes(),
  platform: randomPlatform(),
  tags: randomWorkerTags(),
  team: randomTeamName(),
  name: randomWorkerName(),
  startTime: randomWorkerStartTime(),
  state: randomWorkerState(),
  version: randomWorkerVersion(),
  ...overrides
})

const randomTeam = (overrides = {}) => ({
  id: randomId(),
  name: randomTeamName(),
  ...overrides
})

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

const randomResource = (overrides = {}) => ({
  name: randomResourceName(),
  pipelineName: randomPipelineName(),
  teamName: randomTeamName(),
  type: randomResourceTypeType(),
  lastChecked: randomResourceLastCheckedTime(),
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

  randomTeam,
  randomTeamName,

  randomBuild,

  randomPipelineName,
  randomPipeline,

  randomJobName,
  randomJob,

  randomInput,
  randomOutput,

  randomResource,

  randomResourceType,

  randomWorker
}
