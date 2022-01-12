import { filter, map } from 'ramda'
import { toJob } from './Job.js'
import JobSet from './JobSet.js'

export default class Pipeline {
  static async load ({ teamName, pipelineName, client }) {
    const pipelineData = await client
      .forTeam(teamName)
      .getPipeline(pipelineName)

    return new Pipeline({ ...pipelineData, client })
  }

  constructor ({ id, name, teamName, client, ...data }) {
    this.client = client

    this.id = id
    this.name = name
    this.teamName = teamName
    this.paused = data.paused
    this.public = data.public
  }

  getId () { return this.id }

  getName () { return this.name }

  getTeamName () { return this.teamName }

  isPaused () { return this.paused }

  isPublic () { return this.public }

  async getJobs () {
    const jobsData = await this.client
      .forTeam(this.teamName)
      .forPipeline(this.name)
      .listJobs()

    return map(toJob(this.client), jobsData)
  }

  async getStartPointJobs () {
    return filter(job => !job.hasDependencyJobs(), await this.getJobs())
  }

  async getEndPointJobs () {
    const jobs = await this.getJobs()
    const jobSet = new JobSet(jobs)

    return filter(job => !job.hasDependentJobsIn(jobSet), jobs)
  }

  async getMidPointJobs () {
    const jobs = await this.getJobs()
    const jobSet = new JobSet(jobs)

    return filter(
      job => job.hasDependencyJobs() && job.hasDependentJobsIn(jobSet),
      jobs)
  }

  async getAutomaticJobs () {
    return filter(job => job.isAutomatic(), await this.getJobs())
  }

  async getManualJobs () {
    return filter(job => job.isManual(), await this.getJobs())
  }
}

// Terminology:
// - if a job has an 'upstream' job, it is 'dependent', otherwise, 'independent'
// - 'upstream' means input resources depend on an output resource with the same
//   name having passed
// - the total set of jobs that have to have passed is the set of 'dependencies'
//   or 'dependency jobs'. There is a subset of 'dependency jobs' by resource.
// - if a job has triggering enabled for a resource, it is 'automatic',
//   otherwise, it is 'manual'
// So:
// - Pipeline#getStartPointJobs() ✓
// - Pipeline#getEndPointJobs() ✓
// - Pipeline#getMidPointJobs() ✓
// - Pipeline#getManualJobs() ✓
// - Pipeline#getAutomaticJobs() ✓
//
// - Pipeline#getDependencyJobsFor(jobName, resourceName = null)
// - Pipeline#getDependentJobsFor(jobName, resourceName = null)
//
// - Job#getTriggeringResources()
//
// Problem:
// - when a manual job has not been run for a while, its input resources
//   accumulate version drift.
// - a job has a version drift for each of its input resources
// - each input resource may require many upstream jobs to have passed, the
//   value used for version drift should be the minimum across all upstream jobs
// - to determine the version drift, we need to know:
//     - the version of the input resource for the last build of the manual job
//     - the versions of the output resources for the last build of each
//       dependency job on which this job depends for that resource
//     - the version history of the resource itself
// So:
// - Job#getDependencyJobs() ✓
// - Job#getDependencyJobsFor(resourceName) ✓
// - Job#getLatestBuild() ✓
// - Job#getLatestBuildWithStatus(status) ✓
// - Build#getResourceFor(resourceName)
// - Pipeline#getResourceFor`(resourceName)
// - Resource#getVersionHistory()
