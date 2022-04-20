/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  RouteRef,
  getComponentData,
  BackstagePlugin,
} from '@backstage/core-plugin-api';
import { isValidElement } from 'react';
import { BackstageRouteObject } from './types';
import { createCollector } from '../extensions/traversal';
import { FeatureFlagged, FeatureFlaggedProps } from './FeatureFlagged';

// We always add a child that matches all subroutes but without any route refs. This makes
// sure that we're always able to match each route no matter how deep the navigation goes.
// The route resolver then takes care of selecting the most specific match in order to find
// mount points that are as deep in the routing tree as possible.
export const MATCH_ALL_ROUTE: BackstageRouteObject = {
  caseSensitive: false,
  path: '/*',
  element: 'match-all', // These elements aren't used, so we add in a bit of debug information
  routeRefs: new Set(),
};

interface RoutingV1CollectorContext {
  path?: string;
  routeRef?: RouteRef;
  obj?: BackstageRouteObject;
  sticky?: boolean;
}

/**
 * This is the old V1 logic for collecting the routing model.
 * It is being replaced by a new collector because this collection
 * logic does not work well beyond react-router v6 beta.
 *
 * The breaking change is that react-router now requires route
 * elements to be `Route` components, and directly renders the
 * element prop rather than the `Route` itself. This means it is
 * no longer possible to create utility route components. In order
 * to fill this gap and in general simplify the route collection
 * logic, a new route collection logic is created.
 *
 * @internal
 */
export const routingV1Collector = createCollector(
  () => ({
    paths: new Map<RouteRef, string>(),
    parents: new Map<RouteRef, RouteRef | undefined>(),
    objects: new Array<BackstageRouteObject>(),
  }),
  (acc, node, parent, ctx?: RoutingV1CollectorContext) => {
    // Ignore the top-level element within element props, since it's already been collected.
    if (parent?.props.element === node) {
      return ctx;
    }

    let currentObj = ctx?.obj;
    let currentParentRouteRef = ctx?.routeRef;
    let sticky = ctx?.sticky;

    const path: string | undefined = node.props?.path;
    const parentChildren = currentObj?.children ?? acc.objects;
    const caseSensitive: boolean = Boolean(node.props?.caseSensitive);

    // The context path is used during mount point gathering to assign the same path
    // to all discovered mount points
    let currentCtxPath = ctx?.path;

    // Start gathering mount points when we encounter a mount point gathering flag
    if (getComponentData<boolean>(node, 'core.gatherMountPoints')) {
      if (!path) {
        throw new Error('Mount point gatherer must have a path');
      }
      currentCtxPath = path;
    }

    // Route refs are discovered on the element itself, and on the top-level
    // element within the element prop if it exists.
    const element = node.props?.element;
    let routeRef = getComponentData<RouteRef>(node, 'core.mountPoint');
    if (!routeRef && isValidElement(element)) {
      routeRef = getComponentData<RouteRef>(element, 'core.mountPoint');
    }

    if (routeRef) {
      // First the path gathering

      let routePath: string | undefined = path;
      // If we're gathering mount points we use the context path as out path, unless
      // the element has its own path, in which case we use that instead and stop gathering
      if (currentCtxPath) {
        if (routePath) {
          currentCtxPath = undefined;
        } else {
          routePath = currentCtxPath;
        }
      }
      if (!routePath) {
        throw new Error('Mounted routable extension must have a path');
      }
      acc.paths.set(routeRef, routePath);

      // Then the parent gathering

      // "sticky" route ref is when we've encountered a mount point gatherer, and we want a
      // mount points beneath it to have the same parent, regardless of internal structure
      if (currentParentRouteRef && sticky) {
        acc.parents.set(routeRef, currentParentRouteRef);

        // When we encounter a mount point with an explicit path, we stop gathering
        // mount points within the children and remove the sticky state
        if (path) {
          currentParentRouteRef = routeRef;
          sticky = false;
        }
      } else {
        acc.parents.set(routeRef, currentParentRouteRef);
        currentParentRouteRef = routeRef;
      }

      // Then construct the objects

      if (path) {
        currentObj = {
          caseSensitive,
          path,
          element: 'mounted',
          routeRefs: new Set([routeRef]),
          children: [MATCH_ALL_ROUTE],
          plugin: getComponentData<BackstagePlugin>(
            node.props.element,
            'core.plugin',
          ),
        };
        parentChildren.push(currentObj);
      } else {
        currentObj?.routeRefs.add(routeRef);
      }
    }

    if (getComponentData<boolean>(node, 'core.gatherMountPoints')) {
      sticky = true;
    }

    const isGatherer = getComponentData<boolean>(
      node,
      'core.gatherMountPoints',
    );
    if (isGatherer) {
      if (!path) {
        throw new Error('Mount point gatherer must have a path');
      }
      if (!routeRef) {
        currentObj = {
          caseSensitive,
          path,
          element: 'gathered',
          routeRefs: new Set(),
          children: [MATCH_ALL_ROUTE],
          plugin: ctx?.obj?.plugin,
        };
        parentChildren.push(currentObj);
      }
    }

    return {
      obj: currentObj,
      path: currentCtxPath,
      routeRef: currentParentRouteRef,
      sticky,
    };
  },
);

export const featureFlagCollector = createCollector(
  () => new Set<string>(),
  (acc, node) => {
    if (node.type === FeatureFlagged) {
      const props = node.props as FeatureFlaggedProps;
      acc.add('with' in props ? props.with : props.without);
    }
  },
);
