import { PluginDatabaseManager, useHotCleanup } from '@backstage/backend-common';
import { createRouter } from '@backstage/plugin-search-backend';
import {
  IndexBuilder,
  LunrSearchEngine,
  SearchEngine
} from '@backstage/plugin-search-backend-node';
import { PluginEnvironment } from '../types';
import { DefaultCatalogCollator } from '@backstage/plugin-catalog-backend';
import { DefaultTechDocsCollator } from '@backstage/plugin-techdocs-backend';
import { ApiCollator } from '@internal/plugin-api-collator-backend';
import { PgSearchEngine } from '@backstage/plugin-search-backend-module-pg';
import { Config } from '@backstage/config';
import { Logger } from 'winston';

async function createSearchEngine({
  logger,
  database,
}: {
  logger: Logger;
  database: PluginDatabaseManager;
  config: Config;
}): Promise<SearchEngine> {

  if (await PgSearchEngine.supported(database)) {
    return await PgSearchEngine.from({ database });
  }

  return new LunrSearchEngine({ logger });
}

export default async function createPlugin({
  logger,
  permissions,
  discovery,
  config,
  database,
  tokenManager
}: PluginEnvironment) {

  // Initialize a connection to a search engine.
  //const searchEngine = new LunrSearchEngine({ logger });
  const searchEngine = await createSearchEngine({ config, logger, database });
  const indexBuilder = new IndexBuilder({ logger, searchEngine });

  // Collators are responsible for gathering documents known to plugins. This
  // particular collator gathers entities from the software catalog.
  indexBuilder.addCollator({
    defaultRefreshIntervalSeconds: 600,
    collator: DefaultCatalogCollator.fromConfig(config, { 
      discovery,
      tokenManager,
      filter: {
          kind: ['API', 'Component', 'Domain', 'Group', 'System', 'User'],
      },
     }),
   });

  indexBuilder.addCollator({
    defaultRefreshIntervalSeconds: 600,
    collator: DefaultTechDocsCollator.fromConfig(config, {
      discovery,
      tokenManager,
      logger,
    }),
  });

  indexBuilder.addCollator({
    defaultRefreshIntervalSeconds: 600,
    collator: ApiCollator.fromConfig({discovery, logger})
  });

  // The scheduler controls when documents are gathered from collators and sent
  // to the search engine for indexing.
  const { scheduler } = await indexBuilder.build();

  // A 3 second delay gives the backend server a chance to initialize before
  // any collators are executed, which may attempt requests against the API.
  setTimeout(() => scheduler.start(), 3000);
  useHotCleanup(module, () => scheduler.stop());

  return await createRouter({
    engine: indexBuilder.getSearchEngine(),
    types: indexBuilder.getDocumentTypes(),
    permissions,
    config,
    logger,
  });
}
