import React, { useEffect, useState } from 'react';
import { useEntityListProvider } from '@backstage/plugin-catalog-react';
import { EntityTagFilter } from '@backstage/plugin-catalog-react';
import { Alert } from '@material-ui/lab';

type EntityTagFilterProps = {
  initialFilter?: string;
  hidden: boolean;
};

export const CustomeEntityTagPicker = ({
  initialFilter,
  hidden,
}:EntityTagFilterProps) => {

  const { updateFilters, queryParameters } = useEntityListProvider();
  const [selectedTag] = useState(
    [queryParameters.tags].flat()[0] ?? initialFilter,
  );

  useEffect(() => {
    updateFilters({
      tags: selectedTag ? new EntityTagFilter([selectedTag]) : undefined,
    });
  }, [selectedTag, updateFilters]);

  if (hidden) return null;
  
  return <Alert severity="warning">Tag filter not yet available</Alert>;

};