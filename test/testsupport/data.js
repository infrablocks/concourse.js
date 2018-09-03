import faker from 'faker'
import jwt from 'jsonwebtoken'
import NodeRSA from 'node-rsa'

import { randomLowerHex } from './helpers'

import { toUnixTime } from '../../src/support/date'

const randomApiUrl = () => faker.internet.url()
const randomUsername = () => faker.internet.userName(
  faker.name.firstName(),
  faker.name.lastName())
const randomPassword = () => faker.random.alphaNumeric(40)

const randomId = () => faker.random.number()

const randomCsrfToken = () => randomLowerHex(64)
const randomBearerToken = (overrides = {}, options = {}) => {
  const resolvedData = {
    csrf: randomCsrfToken(),
    teamName: randomTeamName(),
    isAdmin: true,
    ...overrides
  }
  const resolvedOptions = {
    algorithm: 'RS256',
    expiresIn: '1 day',
    ...options
  }
  const rsaPrivateKey = new NodeRSA({ b: 512 })
    .exportKey('pkcs8-private-pem')

  return jwt.sign(resolvedData, rsaPrivateKey, resolvedOptions)
}

const randomBuildName = () => faker.random.word()
const randomBuildStatus = () => faker.random.arrayElement(
  ['succeeded', 'failed'])
const randomBuildApiUrl = () => faker.internet.url()
const randomBuildStartTime = () => toUnixTime(faker.date.past())
const randomBuildEndTime = () => toUnixTime(faker.date.recent())

const randomContainerId = () =>
  `${randomLowerHex(8)}-${randomLowerHex(4)}-${randomLowerHex(4)}-` +
  `${randomLowerHex(4)}-${randomLowerHex(12)}`
const randomContainerType = () => faker.random.arrayElement(
  ['check', 'put', 'get'])

const randomStepName = () => faker.random.word()

const randomWorkingDirectory = () =>
  `/tmp/${randomStepName()}/${randomContainerType()}`

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

const randomContainer = (overrides = {}) => ({
  id: randomContainerId(),
  workerName: randomWorkerName(),
  type: randomContainerType(),
  stepName: randomStepName(),
  pipelineId: randomId(),
  jobId: randomId(),
  buildId: randomId(),
  pipelineName: randomPipelineName(),
  jobName: randomJobName(),
  buildName: randomBuildName(),
  workingDirectory: randomWorkingDirectory(),
  ...overrides
})

export default {
  randomApiUrl,
  randomUsername,
  randomPassword,

  randomId,

  randomCsrfToken,
  randomBearerToken,

  randomTeam,
  randomTeamName,

  randomBuildName,
  randomBuild,

  randomPipelineName,
  randomPipeline,

  randomJobName,
  randomJob,

  randomInput,
  randomOutput,

  randomResource,
  randomResourceType,
  randomResourceName,

  randomWorker,

  randomContainer,
  randomContainerId
}
