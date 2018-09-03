| Name                          | Method | Path                                                                                                               | Status   |  
|-------------------------------|--------|--------------------------------------------------------------------------------------------------------------------|----------|
| ListBuilds                    | GET    | /api/v1/builds                                                                                                     | Done     |
| GetBuild                      | GET    | /api/v1/builds/:build_id                                                                                           | Done     |
| AbortBuild                    | PUT    | /api/v1/builds/:build_id/abort                                                                                     | Later    |
| BuildEvents                   | GET    | /api/v1/builds/:build_id/events                                                                                    | Later    |
| GetBuildPlan                  | GET    | /api/v1/builds/:build_id/plan                                                                                      | Later    |
| SendInputToBuildPlan          | PUT    | /api/v1/builds/:build_id/plan/:plan_id/input                                                                       | Later    |
| ReadOutputFromBuildPlan       | GET    | /api/v1/builds/:build_id/plan/:plan_id/output                                                                      | Later    |
| GetBuildPreparation           | GET    | /api/v1/builds/:build_id/preparation                                                                               | Later    |
| BuildResources                | GET    | /api/v1/builds/:build_id/resources                                                                                 | Now      |
| DownloadCLI                   | GET    | /api/v1/cli                                                                                                        | Later    |
| ListDestroyingContainers      | GET    | /api/v1/containers/destroying                                                                                      | Later    |
| ReportWorkerContainers        | PUT    | /api/v1/containers/report                                                                                          | Later    |
| GetInfo                       | GET    | /api/v1/info                                                                                                       | Now      |
| GetInfoCreds                  | GET    | /api/v1/info/creds                                                                                                 | Later    |
| ListAllJobs                   | GET    | /api/v1/jobs                                                                                                       | Done     |
| GetLogLevel                   | GET    | /api/v1/log-level                                                                                                  | Later    |
| SetLogLevel                   | PUT    | /api/v1/log-level                                                                                                  | Later    |
| ListAllPipelines              | GET    | /api/v1/pipelines                                                                                                  | Done     |
| MainJobBadge                  | GET    | /api/v1/pipelines/:pipeline_name/jobs/:job_name/badge                                                              | Later    |
| ListAllResources              | GET    | /api/v1/resources                                                                                                  | Done     |
| ListTeams                     | GET    | /api/v1/teams                                                                                                      | Done     |
| DestroyTeam                   | DELETE | /api/v1/teams/:team_name                                                                                           | Now      |
| SetTeam                       | PUT    | /api/v1/teams/:team_name                                                                                           | Now      |
| ListTeamBuilds                | GET    | /api/v1/teams/:team_name/builds                                                                                    | Done     |
| CreateBuild                   | POST   | /api/v1/teams/:team_name/builds                                                                                    | Now      |
| ListContainers                | GET    | /api/v1/teams/:team_name/containers                                                                                | Done     |
| GetContainer                  | GET    | /api/v1/teams/:team_name/containers/:id                                                                            | Done     |
| HijackContainer               | GET    | /api/v1/teams/:team_name/containers/:id/hijack                                                                     | Later    |
| ListPipelines                 | GET    | /api/v1/teams/:team_name/pipelines                                                                                 | Done     |
| DeletePipeline                | DELETE | /api/v1/teams/:team_name/pipelines/:pipeline_name                                                                  | Done     |
| GetPipeline                   | GET    | /api/v1/teams/:team_name/pipelines/:pipeline_name                                                                  | Done     |
| PipelineBadge                 | GET    | /api/v1/teams/:team_name/pipelines/:pipeline_name/badge                                                            | Later    |
| ListPipelineBuilds            | GET    | /api/v1/teams/:team_name/pipelines/:pipeline_name/builds                                                           | Now      |
| CreatePipelineBuild           | POST   | /api/v1/teams/:team_name/pipelines/:pipeline_name/builds                                                           | Now      |
| GetConfig                     | GET    | /api/v1/teams/:team_name/pipelines/:pipeline_name/config                                                           | Later    |
| SaveConfig                    | PUT    | /api/v1/teams/:team_name/pipelines/:pipeline_name/config                                                           | Later    |
| ExposePipeline                | PUT    | /api/v1/teams/:team_name/pipelines/:pipeline_name/expose                                                           | Later    |
| HidePipeline                  | PUT    | /api/v1/teams/:team_name/pipelines/:pipeline_name/hide                                                             | Later    |
| ListJobs                      | GET    | /api/v1/teams/:team_name/pipelines/:pipeline_name/jobs                                                             | Now      |
| GetJob                        | GET    | /api/v1/teams/:team_name/pipelines/:pipeline_name/jobs/:job_name                                                   | Now      |
| JobBadge                      | GET    | /api/v1/teams/:team_name/pipelines/:pipeline_name/jobs/:job_name/badge                                             | Later    |
| ListJobBuilds                 | GET    | /api/v1/teams/:team_name/pipelines/:pipeline_name/jobs/:job_name/builds                                            | Now      |
| CreateJobBuild                | POST   | /api/v1/teams/:team_name/pipelines/:pipeline_name/jobs/:job_name/builds                                            | Now      |
| GetJobBuild                   | GET    | /api/v1/teams/:team_name/pipelines/:pipeline_name/jobs/:job_name/builds/:build_name                                | Now      |
| ListJobInputs                 | GET    | /api/v1/teams/:team_name/pipelines/:pipeline_name/jobs/:job_name/inputs                                            | Now      |
| PauseJob                      | PUT    | /api/v1/teams/:team_name/pipelines/:pipeline_name/jobs/:job_name/pause                                             | Now      |
| UnpauseJob                    | PUT    | /api/v1/teams/:team_name/pipelines/:pipeline_name/jobs/:job_name/unpause                                           | Now      |
| PausePipeline                 | PUT    | /api/v1/teams/:team_name/pipelines/:pipeline_name/pause                                                            | Now      |
| RenamePipeline                | PUT    | /api/v1/teams/:team_name/pipelines/:pipeline_name/rename                                                           | Now      |
| ListResourceTypes             | GET    | /api/v1/teams/:team_name/pipelines/:pipeline_name/resource-types                                                   | Now      |
| ListResources                 | GET    | /api/v1/teams/:team_name/pipelines/:pipeline_name/resources                                                        | Now      |
| GetResource                   | GET    | /api/v1/teams/:team_name/pipelines/:pipeline_name/resources/:resource_name                                         | Now      |
| CheckResource                 | POST   | /api/v1/teams/:team_name/pipelines/:pipeline_name/resources/:resource_name/check                                   | Later    |
| CheckResourceWebHook          | POST   | /api/v1/teams/:team_name/pipelines/:pipeline_name/resources/:resource_name/check/webhook                           | Later    |
| PauseResource                 | PUT    | /api/v1/teams/:team_name/pipelines/:pipeline_name/resources/:resource_name/pause                                   | Now      |
| UnpauseResource               | PUT    | /api/v1/teams/:team_name/pipelines/:pipeline_name/resources/:resource_name/unpause                                 | Now      |
| ListResourceVersions          | GET    | /api/v1/teams/:team_name/pipelines/:pipeline_name/resources/:resource_name/versions                                | Now      |
| GetResourceVersion            | GET    | /api/v1/teams/:team_name/pipelines/:pipeline_name/resources/:resource_name/versions/:resource_version_id           | Now      |
| GetResourceCausality          | GET    | /api/v1/teams/:team_name/pipelines/:pipeline_name/resources/:resource_name/versions/:resource_version_id/causality | Later    |
| DisableResourceVersion        | PUT    | /api/v1/teams/:team_name/pipelines/:pipeline_name/resources/:resource_name/versions/:resource_version_id/disable   | Later    |
| EnableResourceVersion         | PUT    | /api/v1/teams/:team_name/pipelines/:pipeline_name/resources/:resource_name/versions/:resource_version_id/enable    | Later    |
| ListBuildsWithVersionAsInput  | GET    | /api/v1/teams/:team_name/pipelines/:pipeline_name/resources/:resource_name/versions/:resource_version_id/input_to  | Later    |
| ListBuildsWithVersionAsOutput | GET    | /api/v1/teams/:team_name/pipelines/:pipeline_name/resources/:resource_name/versions/:resource_version_id/output_of | Later    |
| UnpausePipeline               | PUT    | /api/v1/teams/:team_name/pipelines/:pipeline_name/unpause                                                          | Now      |
| GetVersionsDB                 | GET    | /api/v1/teams/:team_name/pipelines/:pipeline_name/versions-db                                                      | Later    |
| OrderPipelines                | PUT    | /api/v1/teams/:team_name/pipelines/ordering                                                                        | Later    |
| RenameTeam                    | PUT    | /api/v1/teams/:team_name/rename                                                                                    | Now      |
| ListVolumes                   | GET    | /api/v1/teams/:team_name/volumes                                                                                   | Now      |
| ListDestroyingVolumes         | GET    | /api/v1/volumes/destroying                                                                                         | Later    |
| ReportWorkerVolumes           | PUT    | /api/v1/volumes/report                                                                                             | Later    |
| ListWorkers                   | GET    | /api/v1/workers                                                                                                    | Done     |
| RegisterWorker                | POST   | /api/v1/workers                                                                                                    | Later    |
| DeleteWorker                  | DELETE | /api/v1/workers/:worker_name                                                                                       | Later    |
| HeartbeatWorker               | PUT    | /api/v1/workers/:worker_name/heartbeat                                                                             | Later    |
| LandWorker                    | PUT    | /api/v1/workers/:worker_name/land                                                                                  | Later    |
| PruneWorker                   | PUT    | /api/v1/workers/:worker_name/prune                                                                                 | Now      |
| RetireWorker                  | PUT    | /api/v1/workers/:worker_name/retire                                                                                | Later    |