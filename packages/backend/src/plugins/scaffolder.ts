import { DockerContainerRunner } from '@backstage/backend-common';
import { CatalogClient } from '@backstage/catalog-client';
import { createRouter } from '@backstage/plugin-scaffolder-backend';
import Docker from 'dockerode';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
import { createBuiltinActions } from '@backstage/plugin-scaffolder-backend';
import { createRepoPermissionAction } from '../actions/permission/scaffolder-permission';

export default async function createPlugin({
  logger,
  config,
  database,
  reader,
  discovery,
}: PluginEnvironment): Promise<Router> {
  const dockerClient = new Docker();
  const containerRunner = new DockerContainerRunner({ dockerClient });
  const catalogClient = new CatalogClient({ discoveryApi: discovery });
  const integration = require('@backstage/integration');
  const integrations = integration.ScmIntegrations.fromConfig(config);
  const builtInActions = createBuiltinActions({
    reader,
    integrations,
    catalogClient,
    containerRunner,
    config,
});

  const actions = [...builtInActions, createRepoPermissionAction({integrations})];

  return await createRouter({
    containerRunner,
    logger,
    config,
    database,
    catalogClient,
    reader,
    actions
  });
}
