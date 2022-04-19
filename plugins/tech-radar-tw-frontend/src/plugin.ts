import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const techRadartwFrontendPlugin = createPlugin({
  id: 'tech-radar-tw-frontend',
  routes: {
    root: rootRouteRef,
  },
});

export const TechRadartwFrontendPage = techRadartwFrontendPlugin.provide(
  createRoutableExtension({
    name: 'TechRadartwFrontendPage',
    component: () =>
      import('./components/TechRadartwFrontend').then(m => m.TechRadartwFrontend),
    mountPoint: rootRouteRef,
  }),
);
