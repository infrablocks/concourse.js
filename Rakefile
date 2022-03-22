# frozen_string_literal: true

require 'yaml'
require 'rake_circle_ci'
require 'rake_github'
require 'rake_ssh'
require 'rake_gpg'
require 'securerandom'
require 'rubocop/rake_task'

task default: :'checks:all'

namespace :encryption do
  namespace :passphrase do
    desc 'Generate encryption passphrase for CI GPG key'
    task :generate do
      File.write('config/secrets/ci/encryption.passphrase',
                 SecureRandom.base64(36))
    end
  end
end

namespace :keys do
  namespace :deploy do
    RakeSSH.define_key_tasks(
      path: 'config/secrets/ci/',
      comment: 'maintainers@infrablocks.io'
    )
  end

  namespace :gpg do
    RakeGPG.define_generate_key_task(
      output_directory: 'config/secrets/ci',
      name_prefix: 'gpg',
      owner_name: 'InfraBlocks Maintainers',
      owner_email: 'maintainers@infrablocks.io',
      owner_comment: 'concourse.js CI Key'
    )
  end
end

RuboCop::RakeTask.new

namespace :build do
  desc 'Run all checks of the library'
  task check: [:rubocop]

  desc 'Attempt to automatically fix issues with the library'
  task fix: [:'rubocop:auto_correct']
end

RakeCircleCI.define_project_tasks(
  namespace: :circle_ci,
  project_slug: 'github/infrablocks/concourse.js'
) do |t|
  circle_ci_config =
    YAML.load_file('config/secrets/circle_ci/config.yaml')

  t.api_token = circle_ci_config['circle_ci_api_token']
  t.environment_variables = {
    ENCRYPTION_PASSPHRASE:
        File.read('config/secrets/ci/encryption.passphrase')
            .chomp
  }
  t.checkout_keys = []
  t.ssh_keys = [
    {
      hostname: 'github.com',
      private_key: File.read('config/secrets/ci/ssh.private')
    }
  ]
end

RakeGithub.define_repository_tasks(
  namespace: :github,
  repository: 'infrablocks/concourse.js'
) do |t, args|
  github_config =
    YAML.load_file('config/secrets/github/config.yaml')

  t.access_token = github_config['github_personal_access_token']
  t.deploy_keys = [
    {
      title: 'CircleCI',
      public_key: File.read('config/secrets/ci/ssh.public')
    }
  ]
  t.branch_name = args.branch_name
  t.commit_message = args.commit_message
end

namespace :pipeline do
  desc 'Prepare CircleCI Pipeline'
  task prepare: %i[
    circle_ci:project:follow
    circle_ci:env_vars:ensure
    circle_ci:checkout_keys:ensure
    circle_ci:ssh_keys:ensure
    github:deploy_keys:ensure
  ]
end

namespace :checks do
  task all: %i[
    build:fix
    library:lintFix
    library:build
    test:unit
  ]
end

namespace :dependencies do
  desc 'Install library dependencies'
  task :install do
    sh 'npm install'
  end
end

namespace :test do
  desc 'Run unit tests'
  task unit: [:'dependencies:install'] do
    sh 'npm run test'
  end
end

namespace :library do
  desc 'Check for lint issues'
  task lint: [:'dependencies:install'] do
    sh 'npm run lint'
  end

  desc 'Fix lint issues'
  task lintFix: [:'dependencies:install'] do
    sh 'npm run lintFix'
  end

  desc 'Build library'
  task build: [:'dependencies:install'] do
    sh 'npm run build'
  end

  desc 'Publish library'
  task release: %i[dependencies:install library:build] do
    sh 'npm publish'
  end
end

namespace :version do
  desc 'Bump version for specified type (pre, minor, next)'
  task :bump, [:type] => [:'dependencies:install'] do |_, args|
    sh "npm run version:bump:#{args.type}" \
       '&& export LAST_MESSAGE="$(git log -1 --pretty=%B)" ' \
       '&& git commit -a --amend -m "${LAST_MESSAGE} [ci skip]"'
  end
end
