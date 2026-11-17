const { execSync } = require('node:child_process');

function commitAtual() {
  const remoto = process.env.EAS_BUILD_GIT_COMMIT_HASH;
  if (remoto) {
    return remoto.slice(0, 7);
  }
  try {
    return execSync('git rev-parse --short HEAD', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return 'sem commit ainda';
  }
}

/** @param {{ config: import('expo/config').ExpoConfig }} contexto */
module.exports = ({ config }) => ({
  ...config,
  name: 'NextBus',
  slug: 'nextbus',
  scheme: 'nextbus',
  userInterfaceStyle: 'light',
  extra: {
    ...config.extra,
    commit: commitAtual(),
  },
});
