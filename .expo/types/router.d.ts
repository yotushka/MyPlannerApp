/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/explore` | `/_sitemap` | `/explore` | `/goals` | `/goals/addGoal` | `/notes` | `/notes/addNote` | `/settings` | `/settings/appearance` | `/settings/notifications` | `/styles`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
