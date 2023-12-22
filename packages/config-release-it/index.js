const version = '${version}';
const packageName = process.env.npm_package_name;
const scope = packageName.split('/')[1];

module.exports = {
  hooks: {
    "after:bump": "npm install && git add package-lock.json",
  },
  plugins: {
    '@release-it/conventional-changelog': {
      path: '.',
      infile: 'CHANGELOG.md',
      preset: 'conventionalcommits',
      gitRawCommitsOpts: {
        path: '.',
      },
    },
  },
  git: {
    push: true,
    tagName: `${packageName}@${version}`,
    pushRepo: 'git@github.com:samuelarbibe/dnd-timeline.git',
    commitsPath: '.',
    commitMessage: `feat: released version v${version} [no ci]`,
    requireCommits: true,
    requireCommitsFail: false,
    requireCleanWorkingDir: true
  },
  npm: {
    publish: true,
    versionArgs: ['--workspaces false'],
  },
  github: {
    release: true,
    releaseName: `${packageName}-v${version}`,
  }
};