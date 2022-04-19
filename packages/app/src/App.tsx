import React from 'react';
import { Route } from 'react-router';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { customImportPage } from './components/ImportPage/CustomImportPage';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
import {
  DefaultTechDocsHome,
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { LighthousePage } from '@backstage/plugin-lighthouse';

import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { searchPage } from './components/search/SearchPage';
import { Root } from './components/Root';

import { AlertDisplay, OAuthRequestDialog } from '@backstage/core-components';
import { FlatRoutes } from '@backstage/core-app-api';
import { createApp } from '@backstage/app-defaults';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import {
  TWHomePage,
} from '@internal/plugin-tw-home';
import { IconComponent } from '@backstage/core-plugin-api';
import { TechRadartwFrontendPage } from '@internal/plugin-tech-radar-tw-frontend';
import { CoreTechDocs } from './components/TechDocs/CoreTechDocs';
import { TemplateCard } from './components/ScaffolderTemplateCard';

const app = createApp({
  apis,
  icons : {
    next : NavigateNextIcon as IconComponent,
  },
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(apiDocsPlugin.externalRoutes, {
      registerApi: catalogImportPlugin.routes.importPage,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
  },
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();

const routes = (
  <FlatRoutes>

    <Route path="/" element={<TWHomePage/>} />
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route path="/getting-started" element={<TechDocsIndexPage />}>
    <CoreTechDocs />
    </Route>
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/group" element={<CatalogIndexPage />} />
    <Route
      path="/group/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      { entityPage}
    </Route>
    <Route path="/domain" element={<CatalogIndexPage />} />
    <Route
      path="/domain/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      { entityPage}
    </Route>
    <Route path="/docs" element={<TechDocsIndexPage />}>
      <DefaultTechDocsHome />
    </Route>
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    />
    <Route path="/create" element={<ScaffolderPage TemplateCardComponent={TemplateCard}/>} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route path="/lighthouse" element={<LighthousePage />} />
    <Route
      path="/tech-radar"
      element={<TechRadartwFrontendPage width={1500} height={800}/>}
    />
    <Route path="/catalog-import" element={<CatalogImportPage />} >
        { customImportPage }
    </Route>
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
  </FlatRoutes>
);

const App = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </AppProvider>
);

export default App;
