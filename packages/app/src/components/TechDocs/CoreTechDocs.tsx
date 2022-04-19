import React from 'react';
import {
  Content,
  ContentHeader,
  SupportButton,
  TableColumn,
  TableProps,
} from '@backstage/core-components';
import {
  EntityListContainer,
  FilterContainer,
  FilteredEntityLayout,
} from '@backstage/plugin-catalog';
import {
  EntityListProvider,
  UserListFilterKind,
  UserListPicker,
} from '@backstage/plugin-catalog-react';
import { 
    EntityListDocsTable,
    TechDocsPageWrapper,
    TechDocsPicker,
    DocsTableRow
} from '@backstage/plugin-techdocs';
import { CustomeEntityTagPicker } from './CustomEntityTagPicker';

export const CoreTechDocs = ({
  initialFilter = 'all',
  columns,
  actions,
}: {
  initialFilter?: UserListFilterKind;
  columns?: TableColumn<DocsTableRow>[];
  actions?: TableProps<DocsTableRow>['actions'];
}) => {
  return (
    <TechDocsPageWrapper>
      <Content>
        <ContentHeader title="Getting Started">
          <SupportButton>
            Discover documentation in your ecosystem.
          </SupportButton>
        </ContentHeader>
        <EntityListProvider>
          <FilteredEntityLayout>
            <FilterContainer>
              <TechDocsPicker />
              <UserListPicker 
                initialFilter={initialFilter}
                availableFilters={['all' ,'starred']} 
              />
              <CustomeEntityTagPicker initialFilter="core-doc" hidden/>
            </FilterContainer>
            <EntityListContainer>
              <EntityListDocsTable actions={actions} columns={columns} />
            </EntityListContainer>
          </FilteredEntityLayout>
        </EntityListProvider>
      </Content>
    </TechDocsPageWrapper>
  );
};
