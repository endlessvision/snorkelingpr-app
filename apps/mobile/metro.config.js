const { getDefaultConfig } = require("expo/metro-config");

// Expo's default config auto-detects the pnpm workspace root (via
// pnpm-workspace.yaml) and configures watchFolders/resolver accordingly —
// no manual overrides needed for packages/shared to resolve.
module.exports = getDefaultConfig(__dirname);
