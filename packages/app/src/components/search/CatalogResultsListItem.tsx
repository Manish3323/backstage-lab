import React from 'react';
import {
  Box,
  Chip,
  Divider,
  ListItem,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { Link } from '@backstage/core-components';
import TextTruncate from 'react-text-truncate';

const useStyles = makeStyles({
  flexContainer: {
    flexWrap: 'wrap',
  },
  itemText: {
    width: '100%',
    wordBreak: 'break-all',
    marginBottom: '1rem',
  },
});

export const CatalogResultsListItem = ({ result }: any) => {
  const classes = useStyles();
  return (
    <Link to={result.location}>
      <ListItem alignItems="flex-start" className={classes.flexContainer}>
        <ListItemText
          className={classes.itemText}
          primaryTypographyProps={{ variant: 'h6' }}
          primary={result.title}
          secondary={
            <TextTruncate
              line={3}
              text={result.text}
            />
          }
        />
        <Box>
          {result.kind && <Chip label={`Kind: ${result.kind}`} size="small" />}
          {result.owner && <Chip label={`Owner: ${result.owner}`} size="small" />}
          {result.lifecycle && (
            <Chip label={`Lifecycle: ${result.lifecycle}`} size="small" />
          )}
        </Box>
      </ListItem>
      <Divider component="li" />
    </Link>
  );
};
