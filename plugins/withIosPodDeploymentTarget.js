const { withPodfile } = require("expo/config-plugins");

const MARKER = "# Raise pod deployment targets for Xcode 27";

const deploymentTargetSnippet = `
    ${MARKER}
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |build_config|
        current = build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
        if current.nil? || current.to_f < 15.1
          build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '15.1'
        end
      end
    end
`;

const insertAfterCall = (contents, callName, snippet) => {
  const start = contents.indexOf(`${callName}(`);
  if (start === -1) {
    return null;
  }

  let depth = 0;
  for (let index = start; index < contents.length; index += 1) {
    const character = contents[index];
    if (character === "(") {
      depth += 1;
    } else if (character === ")") {
      depth -= 1;
      if (depth === 0) {
        const end = index + 1;
        return `${contents.slice(0, end)}\n${snippet}${contents.slice(end)}`;
      }
    }
  }

  return null;
};

/** Xcode 27 rejects pod targets below iOS 15. Resource bundles keep their own older settings. */
const withIosPodDeploymentTarget = (config) => {
  return withPodfile(config, (podfileConfig) => {
    const contents = podfileConfig.modResults.contents;
    if (contents.includes(MARKER)) {
      return podfileConfig;
    }

    const updated = insertAfterCall(contents, "react_native_post_install", deploymentTargetSnippet);
    if (!updated) {
      throw new Error("Could not find react_native_post_install in the Podfile");
    }

    podfileConfig.modResults.contents = updated;
    return podfileConfig;
  });
};

module.exports = withIosPodDeploymentTarget;
