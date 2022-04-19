import { createRouter } from '@internal/plugin-api-collator-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin(env: PluginEnvironment) {
  // Here is where you will add all of the required initialization code that
  // your backend plugin needs to be able to start!

  return await createRouter({
    logger: env.logger,
  });
}