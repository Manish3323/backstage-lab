import {
  Content,
  ContentHeader,
  Header,
  Page,
  SupportButton,
} from '@backstage/core-components';
import { Grid, Input, Link, makeStyles } from '@material-ui/core';
import React from 'react';
import { TechRadarComponent, TechRadarPageProps } from '@backstage/plugin-tech-radar';

const useStyles = makeStyles(() => ({
  overflowXScroll: {
    overflowX: 'scroll',
  },
}));

export const TechRadartwFrontend: React.FC<TechRadarPageProps> = (props: TechRadarPageProps) => {
  const {
    title = 'Tech Radar',
    subtitle = 'Pick the recommended technologies for your projects',
    pageTitle = 'Company Radar',
    ...componentProps
  } = props;
  const classes = useStyles();
  const [searchText, setSearchText] = React.useState('');

  return (
    <Page themeId="tool">
      <Header title={title} subtitle={subtitle} />
      <Content className={classes.overflowXScroll}>
        <ContentHeader title={pageTitle}>
          <Input
            id="tech-radar-filter"
            type="search"
            placeholder="Filter"
            onChange={e => setSearchText(e.target.value)}
          />
          <SupportButton>
            This is used for visualizing the official guidelines of different
            areas of software development such as languages, frameworks,
            infrastructure and processes.
            <Link href="../TRST.pdf" target="_blank" download={false} >Tech Radar Status Definitions</Link> 
          </SupportButton>
          <Link href="./TRDT.pdf" target="_blank" download={false} >Tech Radar Decision Tree</Link> 
        </ContentHeader>
        <Grid container direction="row">
          <Grid item>
            <TechRadarComponent searchText={searchText} {...componentProps} />
          </Grid>
        </Grid>
      </Content>
    </Page>
)}
