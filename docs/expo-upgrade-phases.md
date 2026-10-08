# Expo SDK 57 phased plan

Decisions locked October 7, 2026:

- Target SDK 57. SDK 58 stays out of this plan.
- iOS only. Minimum iOS becomes 16.4 at the SDK 56 checkpoint.
- This implementation pass stops after the Moti removal for a human visual pass. Later phases stay blocked until the previous human stop passes.
- SQLite, after SDK 57, receives movie data only: shows, tags, ratings, watched dates, and the saved-movie fields currently in the `movie-storage` Zustand key. Users, `currentUser`, and settings stay on MMKV.
- Prototype files stay on disk and are excluded from the app typecheck: `Temp.tsx`, `TagTest.tsx`, `ActionBarContainerMINMAX.tsx`, `SortEditorNOTUSED.tsx`.
- No git commits unless explicitly requested. Each stop leaves a reviewable diff.

Agent checks (typecheck, bundle, code review) are not a substitute for the human stops below.

## Phase 0 — Trustworthy baseline

Still on SDK 52. No animation or dependency-behavior changes.

- Add a `typecheck` script.
- Exclude the four prototype files. Drop the unused `TagTest` import so TypeScript does not pull that file back in.
- Fix TypeScript errors in shipping code, including route `params`, icon style types, watch-provider types, and the live TanStack Query hooks.
- Delete the unused `useSearchResults__Depricated` hook inside `src/store/query.search.ts`. It references search-store fields that no longer exist. Leave the live search hooks in place.
- Do not bump Expo, React, NativeWind, Reanimated, or MMKV.

**Agent gate:** `npm run typecheck` passes, and an iOS production export still bundles.

## Phase 1 — Moti to Reanimated

Still on SDK 52 and Reanimated 3. Recreate current animation behavior with shared values, animated styles, timing, springs, and entering/exiting animations. Do not introduce Reanimated 4 CSS animation APIs.

Preserve the timings and interactions in `docs/expo-upgrade-assessment.md` (search fades, action-bar opacity, expandable panels, favorite/watched springs, tags, sort editor, drag indicators, drawer pressables). Remove the `moti` dependency and replace the single Redash `clamp` import with Reanimated's `clamp`.

Excluded prototype files may still mention Moti. They are outside the bundle. Shipping code must not import `moti`.

**Agent gate:** no shipping `moti` imports, typecheck still passes, iOS export still bundles.

### Human stop 1 — animation pass

Run the current SDK 52 development build. Do not continue to Phase 2 until this looks right.

- Search: clear button fade, results and filter enter/exit, selection highlight moving across the search accessory.
- Movie action bar: show/hide fade, delete button enter/exit, gestures still work.
- Expandable panels and watch providers: height, chevron, content still visible until the collapse finishes. Toggle rapidly.
- Favorite and watched icons: spring swap, layout does not jump, watched-date long press still opens.
- Tags: add-button rotation and fade.
- Sort editor: arrow rotation and label fade, disabled state does not activate.
- Drag reorder: indicator entrance/exit, position-number scale, auto-scroll, haptics, cancel.
- Drawer saved filters and quick sorts: press feedback, disabled rows, drawer still closes.
- Reduced motion on and off, if the device setting is available.

Reply that the pass is good, or name the screen that looks wrong.

## Phase 2 — Startup and hydration

Still on SDK 52. Build the gate while MMKV is still the store, so the later SQLite swap does not invent a second startup path.

- Await user and movie rehydration before the root layout redirects.
- Give `initTMDB` a visible error path so a failed init cannot leave the splash up forever.
- Make root event registration safe across repeated mounts.

**Agent gate:** typecheck and iOS export pass. Code review confirms the redirect cannot run before rehydration.

### Human stop 2 — cold start

- Cold launch while logged in, and while logged out.
- Force-quit and relaunch immediately.
- Switch users and confirm the other user's movies do not flash.
- Launch with the network disabled and confirm the app does not stay on the splash screen.

## Phase 3 — SDK 52 through 54

Upgrade one SDK at a time: 53, then 54. Align Expo packages with `expo install --fix` at each step. Adopt React 19 and Reanimated 4 plus `react-native-worklets` when SDK 54 requires them. Keep NativeWind on v4. Keep Tailwind 3.

Agent-only checks at SDK 53: Doctor, typecheck, iOS bundle. No human stop unless the app will not boot.

### Human stop 3 — SDK 54 boot

Install a new iOS development build.

- App reaches the home list.
- Open a movie, go back, open search.
- One action-bar animation and one drag-reorder still run.
- Light and dark theme both render.

## Phase 4 — SDK 55 through 57

Continue 55, then 56, then 57.

- At SDK 56, move navigation imports off `@react-navigation/*` onto the Expo Router entry points required by that SDK. Keep the nested drawer, tabs, stacks, and both detail routes.
- At SDK 57, replace the Zeego context menu with `Link.Trigger`, `Link.Menu`, and `Link.MenuAction`. Then remove Zeego, `react-native-ios-context-menu`, and `react-native-ios-utilities`.
- Set `platforms: ["ios"]`.
- On Xcode 27, set `ios.enableSceneSupport: true` and regenerate the iOS project from config plugins. Do not reuse the ignored SDK 52 `ios/` tree.
- Leave MMKV v3 in place if it compiles. If it does not, apply only the v4 API shim (`createMMKV()`, `.remove()`) and stop. Do not redesign storage.
- Bump `@tanstack/react-query` only if React 19 peers require it. Do not rewrite fetching.
- Leave the React Compiler and native tabs for a later change.

### Human stop 4 — SDK 57 acceptance

Development client and a Release build, on iOS 27 and the oldest iOS version you still support.

- Cold launch, user switch, and a deep link into a movie.
- Context menu: share, pick image for a saved movie, favorite, watched. Poster tap does not navigate by accident.
- Add and delete a movie. Tags, ratings, watched dates.
- Quick-sort drag and saved filters.
- Image modal opens and dismisses.
- Fonts, splash, light and dark theme.

## Phase 5 — Movie data to SQLite

After stop 4. Users, `currentUser`, and settings remain in MMKV.

- Add a SQLite database for shows, tags, and the fields on a saved movie.
- On first launch, copy the existing `movie-storage` JSON into SQLite. Keep MMKV installed until that copy has been checked.
- Leave the action-bar pending-change buffer in memory.

### Human stop 5 — in-place upgrade

Use an install that already has several users, movies, tags, ratings, and watched dates. Do not reinstall first.

- Movie counts, tags, ratings, and watched dates match the pre-migration app.
- Switch users. Each user still sees only their movies.
- Add, edit, and delete a movie, then force-quit and confirm the change is still there.

## Phase 6 — TanStack Query for remote data

Query owns TMDB and OMDB responses. SQLite owns saved movies. Search results should learn "already saved" from SQLite rather than from a persisted Zustand array.

### Human stop 6 — fetching

- Title search, person search, and person movies.
- Movie details, recommendations, videos, and watch providers.
- Airplane mode: a failed fetch shows an error or empty state and does not wipe saved movies.

## Phase 7 — SwiftUI where it helps

Use `@expo/ui` SwiftUI for settings, filters, and form controls such as the date picker and segmented control. Leave lists, posters, drag-and-sort, and the poster context menu on the existing React Native and Expo Router implementations.

### Human stop 7 — native controls

- Watched-date confirm and cancel.
- Filter and settings controls that moved to SwiftUI.
- Light and dark appearance on those screens.
