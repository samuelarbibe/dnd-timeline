const version = '${version}';
const packageName = process.env.npm_package_name;
const scope = packageName.split('/')[1];

module.exports = {
  hooks: {
    "after:bump": "npm install",
  },
  plugins: {
    '@release-it/conventional-changelog': {
      path: '.',
      infile: 'CHANGELOG.md',
      preset: 'conventionalcommits',
    },
  },
  git: {
    push: true,
    tagName: `${packageName}@${version}`,
    pushRepo: 'git@github.com:samuelarbibe/dnd-timeline.git',
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