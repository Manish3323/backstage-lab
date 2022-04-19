import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';

export const twHomePlugin = createPlugin({
  id: 'tw-home',
  routes: {
    root: rootRouteRef,
  },
});

export const TWHomePage = twHomePlugin.provide(
    createRoutableExtension({
        name: 'TWHomePage',
        component: () =>
            import('./components/home').then(m => m.HomePage),
        mountPoint: rootRouteRef,
    }),
);
