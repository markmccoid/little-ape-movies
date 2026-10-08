# Expo upgrade assessment

Reviewed October 7, 2026. Scope: iOS only. Replace Zeego with Expo Router context menus and remove Moti, recreating its animations directly in Reanimated. These are required migration decisions. This is an assessment; application code and dependency versions have not been changed.

## Recommendation

Target **SDK 57**, using the latest 57 patch. npm release metadata checked during this review reports `latest` and `sdk-57` as **57.0.27**, and `next` as **58.0.6**. The numeric `next` version does not establish stable-release status: Expo still describes SDK 58 as a beta, using React Native 0.88 RC. SDK 57 uses React Native 0.86 and React 19.2. [SDK 57 release notes](https://expo.dev/changelog/sdk-57), [SDK 58 beta release notes](https://expo.dev/changelog/sdk-58-beta).

This app starts at SDK 52 and already needs substantial navigation and animation migration. SDK 58 adds another navigation migration and stricter React Native types. Nothing found in this app requires those changes immediately. Expo Router's iOS context menus are already available in SDK 57. [SDK 57 Link API](https://docs.expo.dev/versions/v57.0.0/sdk/router/link/).

The installed Xcode is **27.0**. For SDK 57 builds using Xcode 27, enable `ios.enableSceneSupport` in the `expo-build-properties` plugin. Expo requires `expo@57.0.23` or newer and an updated build-properties package for this opt-in. SDK 58 supplies scene support by default. [Expo scene lifecycle guide](https://github.com/expo/fyi/blob/main/ios-scene-lifecycle.md#staying-on-sdk-57-with-xcode-27).

## Current state and verified baseline

| Item | Installed / observed |
| --- | --- |
| Expo | 52.0.46 |
| React Native | 0.76.9 |
| React / React DOM | 18.3.1 |
| Expo Router | 4.0.20 |
| Reanimated | 3.16.7 |
| NativeWind / CSS interop | 4.1.23 / 0.1.22 |
| Moti | 0.29.0 |
| MMKV | 3.2.0 |
| Node / npm | 26.8.1 / 11.19.0 |
| New Architecture | Enabled in app config and generated native properties |
| Native workflow | `ios/` exists but is ignored and untracked; configuration suggests CNG |

Checks performed:

- **iOS production export passed**, including Hermes bundle generation. This verifies bundling, not native compilation or device behavior.
- **TypeScript failed with 127 diagnostics across 30 files** using the existing compiler and dependencies.
- **Expo Doctor passed 16/18 checks**. Version validation recommends SDK 52 patches: `expo ~52.0.49`, `expo-router ~4.0.22`, `expo-build-properties ~0.13.3`, and `@expo/vector-icons ~14.0.4` (installed 14.1.0). The other failed check reports React Native Directory maintenance/metadata warnings; those alone do not establish incompatibility.
- **Dependency inspection found an invalid peer pairing**: Zeego 2.0.4 requires iOS context-menu `~2.5.1`, while 3.1.1 is installed. `.npmrc` enables `legacy-peer-deps=true`, so install success does not mean the graph is compatible.
- An initial combined iOS/Android export failed on Zeego's missing Android menu peer. Android is outside the confirmed product scope, so this is not an upgrade prerequisite.

Existing working changes to `package.json`, `package-lock.json`, and `.vscode/settings.json` were preserved. The package change updates the user's TMDB wrapper from `^0.3.3` to `^0.4.7`.

## Work to do before changing SDK versions

### 1. Establish a trustworthy baseline

Resolve existing TypeScript errors in shipping code and remove or isolate obsolete prototypes from the application typecheck. Examples:

- `src/components/common/Icons.tsx` repeatedly accepts `ViewStyle` where icon text expects `TextStyle`.
- `src/store/query.search.ts` contains an obsolete search hook referencing store fields/actions that no longer exist.
- Route layouts read possibly undefined `params`; person-search navigation uses a concrete dynamic pathname that does not satisfy the generated route types. Use pathname templates and parameter objects.
- Watch-provider components have mismatched response types, and several TMDB result fields are optional.
- `Temp.tsx`, `TagTest.tsx`, and `ActionBarContainerMINMAX.tsx` contribute prototype errors.

Add a `typecheck` script. Fix the baseline in a separate change so React 19 and newer Router errors are distinguishable. The TMDB wrapper has already changed in the working tree; stabilize its response types before combining it with the SDK migration.

### 2. Remove Moti and recreate its animations in Reanimated

Moti imports occur in **22 source files**, including unused imports/prototypes. Active usage includes movie action bars, search controls, expandable panels, drag indicators, tags, and the drawer's `MotiPressable`.

**Decision: remove Moti completely.** Recreate its existing animation behavior directly in Reanimated before the SDK upgrade. Implement against the installed Reanimated 3 APIs that carry forward to Reanimated 4: shared values, animated styles, timing/springs, and entering/exiting animations. Avoid introducing Reanimated 4-only CSS animation APIs while still on SDK 52. Preserve exit animations and interactions rather than deleting animation behavior.

| Behavior / components | Direct Reanimated replacement and behavior to preserve |
| --- | --- |
| Search clear buttons, search results, conditional filters, saved-filter controls | `Animated.View` / `Animated.Text` with entering/exiting fades for mounted content; shared-value opacity for content that stays mounted. Keep existing explicit timing, including the 500 ms search-clear fade. |
| Search input accessory | Animate the measured selection highlight's position/width and selected-label opacity. Preserve layout measurement updates and the 300 ms label transition. |
| Movie action bars | Animate persistent visibility with shared-value opacity, preserving the 700 ms fade; use entering/exiting animation for the conditionally mounted delete button, preserving its 600 ms transition. Retain existing gestures. |
| Expandable panels / watch providers | Animate height and chevron rotation with shared values, and fade the content. Preserve the explicit 500 ms height transition where configured. Coordinate content unmounting with the fade/collapse so closing does not remove content prematurely. |
| Favorite / watched icons | Recreate keyed spring scale/opacity swaps, including the current stiffness 200, damping 15, and selected scale targets. Keep the reserved layout space and watched-date long-press action. |
| Tags | Recreate add-button rotation, conditional tag/control fades, and state-based opacity. Preserve the existing Reanimated height animation instead of adding a second animation system for it. |
| Sort editor | Recreate direction-arrow rotation (600 ms) and active/direction label opacity (750 ms). Preserve disabled interaction behavior. |
| Drag indicators | Recreate directional spring entrance/exit, the 100 ms entrance and 500 ms exit delays, and the position-number scale animation (2.25 to 1.5 over 500 ms). Keep drag auto-scroll, haptics, and gesture cancellation behavior. |
| Drawer saved filters / quick sorts | Replace `MotiPressable` with `Pressable` and an animated visual child or compatible animated pressable. Preserve press-state feedback, disabled state, activation callbacks, and drawer closing. |
| Animated icon/button helpers | Replace `motify(Feather)` with `Animated.createAnimatedComponent(Feather)` and recreate state-based background-color transitions. Preserve existing direct Reanimated animations. |

Implementation checks:

- Remove `AnimatePresence` only after its exit behavior is represented in Reanimated. Keep necessary native parents mounted until child exit animations complete; verify repeated rapid toggles and keyed icon replacement.
- Use explicit spring configuration when behavior depends on it, since Reanimated 4 changes default spring behavior. Capture the current implicit defaults before migration where needed.
- Keep animation-owned opacity/transforms in animated styles; avoid conflicting NativeWind classes or overwriting other transforms.
- Respect reduced-motion settings, and verify the regular and reduced-motion paths on iOS.
- Remove unused Moti imports in `SearchContainer.tsx` and `AnimDetailImage.tsx`. Convert or deliberately remove obsolete prototype components so they do not retain a dependency on Moti.
- Finish with no imports from `moti` or `moti/interactions`, no `motify` or `AnimatePresence` usage, and no Moti dependency in the manifest or regenerated lockfile.
- Compare the current iOS typecheck diagnostics with the migration result, export the iOS production bundle, and visually exercise every animation group on a development build before changing SDKs. Repeat key animation checks after adopting Reanimated 4.

The upstream Reanimated 4 migration PR remains open, but completing this removal eliminates Moti compatibility as an SDK upgrade dependency. [Moti migration PR](https://github.com/nandorojo/moti/pull/389), [Reanimated migration guide](https://docs.swmansion.com/react-native-reanimated/docs/guides/migration-from-3.x/).

`src/components/common/DragAndSort/MoveableItem.tsx` is the only source import of Redash, for `clamp`. Replace it with Reanimated's exported `clamp` and remove Redash after confirming no other usage. Redash's barrel also imports legacy animation code; retaining the package for one helper adds avoidable risk. This is cleanup, not a demonstrated failure on SDK 57.

### 3. Prepare storage and startup checks

Preserve an existing installation containing several users, saved movies, tags, ratings, watched dates, saved filters, and quick sorts. Test an in-place app upgrade without uninstalling it.

Storage identities that must remain stable:

- Default MMKV storage: `users` and `currentUser`.
- User MMKV instances: `${currentUser.id}.storage`.
- Zustand persisted keys: `movie-storage` and `settings-storage`.
- Logged-out instance: `loggedout.placeholder`.

`StorageAdapter` presents asynchronous methods even though MMKV is synchronous. `AuthProvider` starts rehydration and marks initialization complete without awaiting it. The root layout also redirects without checking the provider's initialization flag. Prepare an explicit hydration/initialization boundary before routing; test fast cold starts and user switching. This is an existing ordering risk, not a reproduced SDK regression.

Root initialization in `src/app/_layout.tsx` does not catch `initTMDB` failures. A failed initialization leaves the splash hide condition false. Add an error path and make event registration safe across repeated mounts, with subscription cleanup or an idempotent setup.

### 4. Preserve native configuration

The ignored iOS directory contains SDK 52 templates, including an Objective-C AppDelegate and iOS 15.1 Podfile default. Before regenerating, preserve any intentional native edits and express them through config plugins. The inspected AppDelegate looks like a generated template; that is not an exhaustive comparison of every native file.

Do not reuse these native files or old Pods as the SDK 57 project. Regenerate iOS after dependency/config alignment. SDK 57's `expo prebuild` now cleans by default; make the backup before invoking it. [SDK 57 prebuild notes](https://expo.dev/changelog/sdk-57).

## Changes required during the SDK migration

| Area | Required change and affected code |
| --- | --- |
| React and native packages | Let `expo install --fix` align React, RN, React types, screens, safe area, gestures, SVG, images, symbols, fonts, splash, dev client, and other Expo modules for each SDK. Independently review libraries outside Expo's compatibility map. |
| Router imports | Application imports from `@react-navigation/*` are unsupported from SDK 56 onward. Move theme/focus exports to `expo-router/react-navigation` and bottom-tab exports to `expo-router/js-tabs`. Manually resolve native-stack option types and drawer exports against the target Router APIs, then remove unused direct navigation dependencies. |
| Router state and linking | Preserve nested drawer/tabs/stacks and both detail routes. Audit the root's manual `getInitialURL` + replace + delayed push, which can compete with Router's link handling. Test cold/warm links, logged-out links, not-found handling, and modal dismissal. |
| NativeWind | Update within v4 to **4.2.7** (CSS interop 0.2.7), which documents SDK 57 support. Keep Tailwind 3 and the current NativeWind Babel/Metro integrations. A v5/RC migration is a separate project. |
| Reanimated | Upgrade to Expo's supported Reanimated 4 and install the matching `react-native-worklets`. Keep Expo's Babel preset handling; avoid duplicate worklet transforms. Review spring timing/defaults and test drag reorder, auto-scroll, expansion heights, exit animations, and animated posters. |
| Lucide | The installed 0.454.0 declares React support only through 18. Choose a release with React 19 support rather than suppressing the mismatch. |
| MMKV | Treat native compatibility of the current v3 as a build gate. V4 is a possible resolution, not an Expo-mandated upgrade: it requires Nitro Modules, `createMMKV()` instead of `new MMKV()`, and `.remove()` instead of `.delete()`. If adopted, change both storage files and verify all old data in place. |
| Native controls | Align and build-test the date picker and segmented control. Exercise watched-date confirmation/cancellation and filter selection. |
| Image colors | Validate the native image-colors module and its return shape on iOS. Replace the deep type import `react-native-image-colors/build/types` with a supported public export where available; Metro package exports change across the upgrade. |

Sources: [Router SDK 56 migration](https://docs.expo.dev/router/migrate/sdk-55-to-56/), [NativeWind v4 installation](https://www.nativewind.dev/docs/getting-started/installation), [Reanimated 4 migration](https://docs.swmansion.com/react-native-reanimated/docs/guides/migration-from-3.x/), [MMKV V4 migration](https://github.com/margelo/react-native-mmkv/blob/main/docs/V4_UPGRADE_GUIDE.md).

### Replace Zeego with Expo Router menus

Only `src/components/movies/details/MDDetailContextMenu.tsx` imports Zeego. Its only caller is `MDImageDescRow.tsx`.

At the SDK 57 stage, replace the wrapper with Router's `Link.Trigger`, `Link.Menu`, and `Link.MenuAction` composition, using the supported trigger/tap behavior. Keep:

- Share with `square.and.arrow.up`, existing native share behavior, and the app deep link.
- Pick Image with `photo`, shown only for saved movies, opening the correct current-tab image modal.
- Favorite and watched overlay presses.
- The current poster's primary tap behavior. `Link` has a navigation destination; explicitly control this integration so adding a context menu does not accidentally introduce navigation.

Guard undefined movie IDs/URLs and use typed modal pathnames. After the replacement, remove **Zeego**, **react-native-ios-context-menu**, and **react-native-ios-utilities**; there are no other direct source consumers. This resolves the existing Zeego peer conflict without adding its Android peer. Rebuild the iOS client after removal. [Link menu documentation](https://docs.expo.dev/router/reference/link-preview/).

### Configuration and support floor

- Set `platforms: ["ios"]` to make the confirmed product scope explicit. Do not add Android/web migration work solely because old config/scripts remain.
- SDK 56 raises minimum iOS to **16.4** and requires Xcode **26.4**; SDK 57 inherits this floor. This drops older iOS devices supported by the current build. Installed Xcode 27 is sufficiently new. [SDK 56 tooling requirements](https://expo.dev/changelog/sdk-56).
- On Xcode 27, add `ios.enableSceneSupport: true` to the build-properties plugin once the SDK 57 packages are installed and regenerate the native project. Check cold-launch linking and foreground/background transitions.
- Remove redundant New Architecture flags after the relevant SDK transition; do not change architecture mid-baseline.
- Replace placeholder Router origin `https://n` or remove it if unused; it is not evidence of a configured universal-link host.
- Consolidate splash configuration into the plugin. The full-screen legacy flag is still documented on SDK 57, so its removal is not a prerequisite; plan a later visual migration and verify a release build. [Splash configuration](https://docs.expo.dev/versions/v57.0.0/sdk/splash-screen/).
- Keep `expo-constants`: `CustomDrawer.tsx` reads the app version from it. Keep Babel and Metro config: both contain required NativeWind integration.
- Check apparently unused AsyncStorage, NetInfo, Lottie, legacy `react-native-vector-icons`, secure-store, and random-values packages before removal. Secure-store also appears in config, so remove its plugin if the feature is truly unused. Do not change the storage backend as incidental cleanup.
- `@expo/vector-icons` is explicitly installed and still usable. Migrating to scoped icon packages is optional cleanup, not a blocker. Existing SF Symbols usage does not replace all icon families.
- Reassess `.npmrc` peer bypass after resolving incompatible libraries. Commit matching package/lockfile changes and verify a clean install. Avoid unexplained exclusions/overrides as a way to hide failures.
- Rebuild development and production iOS binaries. MMKV and other custom native dependencies mean Expo Go is not the acceptance environment.
- Leave React Compiler and any switch to native tabs for separate changes after migration behavior is stable.

## Additional SDK 58 work if chosen later

The beta removes `InteractionManager`. This app uses it in:

- `src/components/movies/details/MovieDetailsContainer.tsx:93`
- `src/components/movies/details/MDButtonDelete.tsx:35`
- `src/components/movies/movieitem/actionbar/ActionBarDelete.tsx:32`

Replace with appropriate scheduling; `requestIdleCallback` does not inherently preserve the old wait-for-interactions semantics. Verify streaming-provider refresh and search-result retagging after deletion. SDK 58's strict React Native API also changes instance/ref types, affecting `TextInput`, list refs, UI primitive types, and animated scroll refs. [SDK 58 breaking changes](https://expo.dev/changelog/sdk-58-beta).

Router has a separate 57-to-58 migration, including navigation-state changes. The root layout reads internal navigation state, so review it even if import conversion succeeded on 57. [Router SDK 58 migration](https://docs.expo.dev/router/migrate/sdk-57-to-58/).

## Suggested execution order

1. Preserve existing working changes and native configuration; establish representative persisted data and a baseline iOS release build.
2. Fix/isolate baseline TypeScript failures, stabilize TMDB types and startup/hydration, remove Redash, and fully remove Moti by recreating its animations directly in Reanimated. Validate this as a separate change before the SDK upgrade.
3. Upgrade incrementally **52 → 53 → 54 → 55 → 56 → 57**, aligning dependencies and checking typecheck/Doctor/bundling at each checkpoint. Intermediate SDKs are migration checkpoints, not production releases. [Expo's incremental upgrade guidance](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/).
4. At the relevant checkpoints, adopt React 19, NativeWind 4.2.7 and Reanimated/Worklets, new Router import paths, Router menus, and any necessary MMKV migration.
5. On SDK 57, enable scenes for Xcode 27, regenerate iOS from preserved configuration, and build a new development client and Release app.
6. Validate cold launch, every user switch, persisted data, shared deep links, nested navigation, context-menu actions, image-modal dismissal, movie add/delete, tags/ratings/watched dates, quick-sort drag/scroll, saved filters, light/dark themes, fonts, and splash appearance. Include on-device release testing on iOS 27 and the oldest iOS version being supported.

No native build or device run was performed in this assessment. Native compatibility of MMKV, image colors, date picker, and other third-party modules remains a validation requirement, not a confirmed failure.
