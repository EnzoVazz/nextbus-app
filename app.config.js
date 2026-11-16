const { execSync } = require('node:child_process');

function commitAtual() {
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
