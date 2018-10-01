import {
  any,
  filter,
  find,
  flatten,
  isEmpty,
  map,
  none,
  pathOr,
  propEq,
  uniq
} from 'ramda'
import { toInput } from './Input'
import { toOutput } from './Output'
import Build from './Build'

export const toJob = client => jobData => new Job({ ...jobData, client })

const getJobsByNames = async (jobNames, pipelineName, teamName, client) => {
  const pipelineClient = client
    .forTeam(teamName)
    .forPipeline(pipelineName)

  return Promise.all(map(
    async jobName =>
      new Job({
        ...(await pipelineClient.getJob(jobName)),
        client
      }),
    jobNames))
}

export default class Job {
  static async load ({ teamName, pipelineName, jobName, client }) {
    const jobData = await client
      .forTeam(teamName)
      .forPipeline(pipelineName)
      .getJob(jobName)

    return new Job({ ...jobData, client })
  }

  constructor (
    {
      id,
      name,
      pipelineName,
      teamName,
      inputs,
      outputs,
      groups,
      client
    }
  ) {
    this.id = id
    this.name = name
    this.pipelineName = pipelineName
    this.teamName = teamName
    this.inputs = map(toInput(client), inputs)
    this.outputs = map(toOutput(client), outputs)
    this.groups = groups
    this.client = client
  }

  getId () {
    return this.id
  }

  getName () {
    return this.name
  }

  getPipelineName () {
    return this.pipelineName
  }

  getTeamName () {
    return this.teamName
  }

  getInputs () {
    return this.inputs
  }

  getInputForResource (resourceName) {
    return find(propEq('resource', resourceName), this.inputs)
  }

  getOutputs () {
    return this.outputs
  }

  getOutputForResource (resourceName) {
    return find(propEq('resource', resourceName), this.outputs)
  }

  getGroups () {
    return this.groups
  }

  hasDependencyJobs () {
    return any(input => input.requiresAnyJobsToHavePassed(), this.getInputs())
  }

  async getDependencyJobs () {
    const dependencyJobNames =
      uniq(flatten(map(
        input => input.getNamesOfJobsToHavePassed(),
        this.getInputs())))

    if (isEmpty(dependencyJobNames)) {
      return []
    }

    return getJobsByNames(
      dependencyJobNames,
      this.getPipelineName(),
      this.getTeamName(),
      this.client)
  }

  async getDependencyJobsFor (resourceName) {
    const input = this.getInputForResource(resourceName)

    if (!input) {
      throw new Error(`No input found for resource name: ${resourceName}`)
    }

    const dependencyJobNames = input.getNamesOfJobsToHavePassed()

    if (isEmpty(dependencyJobNames)) {
      return []
    }

    return getJobsByNames(
      dependencyJobNames,
      this.getPipelineName(),
      this.getTeamName(),
      this.client)
  }

  hasDependentJobsIn (jobSet) {
    const jobsByInputResource = jobSet.getJobsByInputResource()

    return any(
      output => {
        const jobsForOutputResource =
          pathOr([], [output.resource], jobsByInputResource)
        const jobsDependingOnThis =
          filter(
            job => job
              .getInputForResource(output.resource)
              .requiresAtLeastJobToHavePassed(this.getName()),
            jobsForOutputResource)

        return !isEmpty(jobsDependingOnThis)
      },
      this.getOutputs())
  }

  isAutomatic () {
    return any(input => input.isTrigger(), this.getInputs())
  }

  isManual () {
    return none(input => input.isTrigger(), this.getInputs())
  }

  async getLatestBuild () {
    const buildsData = await this.client
      .forTeam(this.getTeamName())
      .forPipeline(this.getPipelineName())
      .listBuilds({ limit: 1 })

    if (isEmpty(buildsData)) {
      return null
    }

    const buildData = buildsData[0]

    return new Build({ ...buildData, client: this.client })
  }
}
