import { createRouter } from '@internal/plugin-tech-radar-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger, 
  config
}: PluginEnvironment) {

  // The env contains a lot of goodies, but our router currently only
  // needs a logger
  return await createRouter({
    logger,
    config,
  });
}
