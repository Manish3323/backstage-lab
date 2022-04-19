## Backstage Search

Backstage search provides an interface between the backstage instance and search engine of choice. Currently backstage supports 3 search engines by default: Lunr, Postgres and Elastic search.

### Advantages of Using Postgres search Engine:

**Lunr** is a *NodeJS* based in-memory search engine and is best for local development. Some of the downsides of Lunr Search Engine include:

* Because search documents are indexed during application boot, this slows the backstage startup time.

* It will increase the memory consumption of Backstage since it runs in-process.

* The indexing procedure blocks NodeJS execution, potentially causing other Backstage activities to hang.

**Postgres** search is better for small scale production usage. It is easy to setup, provides decent results even with thousands of documents indexed and is scalable. Because postgres is backed by real database, documents are not indexed for every application boot.

Note: PostgreSQL search requires at least PostgreSQL 12

**Elastic** search is a better option for large scale production usage and is not necessary at this time.

### Configuring Backstage to use Postgres Search Engine:

To configure Postgres search, add the following changes to packages/backend/plugins/search.ts :

```
import { PgSearchEngine } from '@backstage/plugin-search-backend-module-pg'; 

async function createSearchEngine({
logger,
database,
config,
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
```

### Collators and Indexing:

Backstage utilizes collators to define what can be searched. Collators are responsible for gathering documents/entities from different plugins and later they are indexed by the search engine. Backstage Search provides a scheduler which is responsible for configuring the intervals for Collators to collect documents and forward them to search engine for indexing.

For something to be searchable in backstage, the component/plugin should be defined as collator with the following basic fields : `document title`, `location` and `text fields`. As backstage comes with 'DefaultCatalogCollator', any entity defined under Software catalog is searchable. For other entities/plugins like APIs and Techdocs to be searchable, a custom collator should be defined and submitted for indexing.

### Adding Collator for new Plugins:

1. If a collator is not defined, create a backend plugin and add class which implements the 'DocumentCollator' interface from '@backstage/search-common'.

2. Define the 'type' of the collator and implement 'execute()' method exposing IndexableDocument.

3. In package/backend/src/plugins/search.ts, import add the collator using the 'IndexBuilder' :

4. SearchEngine handles indexing the exposed collator.

Example: 
```
import { ApiCollator } from '../plugins/apicollator-backend/src/search/ApiCollator';

indexBuilder.addCollator({
    defaultRefreshIntervalSeconds: 600,
    collator: DefaultTechDocsCollator.fromConfig(config, {
      discovery,
      logger,
    }),
  });
```