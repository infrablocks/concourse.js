export default class Build {
  static async load ({ teamName, pipelineName, jobName, buildName, client }) {
    const buildData = await client
      .forTeam(teamName)
      .forPipeline(pipelineName)
      .forJob(jobName)
      .getBuild(buildName)

    return new Build({ ...buildData, client })
  }

  constructor (
    {
      id,
      name,
      status,
      teamName,
      jobName,
      pipelineName,
      apiUrl,
      startTime,
      endTime,
      client
    }) {
    this.id = id
    this.name = name
    this.status = status
    this.teamName = teamName
    this.jobName = jobName
    this.pipelineName = pipelineName
    this.apiUrl = apiUrl
    this.startTime = startTime
    this.endTime = endTime
    this.client = client
  }

  getId () {
    return this.id
  }

  getName () {
    return this.name
  }

  getTeamName () {
    return this.teamName
  }
}
