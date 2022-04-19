import {
    PluginEndpointDiscovery,
  } from '@backstage/backend-common';
  import { Entity } from '@backstage/catalog-model';
  import { DocumentCollator, IndexableDocument } from '@backstage/search-common';
  import { Logger } from 'winston';
  import { CatalogApi, CatalogClient } from '@backstage/catalog-client';

  export interface ApiEntityDocument extends IndexableDocument {
    componentType: string;
    namespace: string;
    kind: string;
    owner: string;
    text: string;
    title: string;
    location: string;
    name: string;
    lifecycle: string;
  }
  
  export type ApiCollatorOptions = {
    discovery: PluginEndpointDiscovery;
    logger: Logger;
    locationTemplate?: string;
    catalogClient?: CatalogApi;
    legacyPathCasing?: boolean;
  };
  
  export class ApiCollator implements DocumentCollator {
    protected discovery: PluginEndpointDiscovery;
    protected locationTemplate: string;
    private readonly logger: Logger;
    private readonly catalogClient: CatalogApi;
    public readonly type: string = 'api';


    constructor({
      discovery,
      locationTemplate,
      logger,
      catalogClient,
    }: ApiCollatorOptions) {
      this.discovery = discovery;
      this.locationTemplate =
        locationTemplate || '/catalog/:namespace/:kind/:name/:path';
      this.logger = logger;
      this.catalogClient =
        catalogClient || new CatalogClient({ discoveryApi: discovery });
    }
  
    static fromConfig(options: ApiCollatorOptions) {

      return new ApiCollator({ ...options });
    }
  
    async execute() {
      const entities = await this.catalogClient.getEntities(
        {
          fields: [
            'kind',
            'namespace',
            'metadata.annotations',
            'metadata.name',
            'metadata.title',
            'metadata.namespace',
            'spec.type',
            'spec.lifecycle',
            'spec.definition',
            'relations',
            'spec.owner',
          ],
        }
      );

      const filteredEntities = entities.items.filter(it => (it?.kind == 'API'));
      this.logger.info(`Entities ${JSON.stringify(entities.items)}`);
      
      return filteredEntities.map((entity: Entity): ApiEntityDocument => {
        return {
          title: entity.metadata.name,
          location: this.applyArgsToFormat(this.locationTemplate, {
            namespace: entity.metadata.namespace || 'default',
            kind: entity.kind,
            name: entity.metadata.name,
            path: 'definition'
          }),
          text: JSON.stringify(entity?.spec?.definition).replace(/\\n/g,''),
          name: entity.metadata.name,
          componentType: entity.spec?.type?.toString() || 'other',
          namespace: entity.metadata.namespace || 'default',
          kind: entity.kind,
          owner: entity.spec?.owner as string || '',
          lifecycle: entity.spec?.lifecycle as string || ''
        };
      });  
    }

    protected applyArgsToFormat(
      format: string,
      args: Record<string, string>,
    ): string {
      let formatted = format;
      for (const [key, value] of Object.entries(args)) {
        formatted = formatted.replace(`:${key}`, value);
      }
      return formatted;
    }
}
  