const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const config = getDefaultConfig(__dirname);

//!! START Metro config for tmdb_api
const path = require("path");
// Add the watchFolders configuration
config.watchFolders = [
  ...(config.watchFolders || []),
  path.resolve(__dirname, "../../tmdb/tmdb_api"),
];

// If you need to modify the resolver, you can do so like this:
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    "@markmccoid/tmdb_api": path.resolve(__dirname, "../../tmdb/tmdb_api"),
  },
};
//!! END

module.exports = withNativeWind(config, { input: "./src/global.css" });
