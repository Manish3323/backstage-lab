import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { twHomePlugin, TWHomePage } from '../src/plugin';

createDevApp()
  .registerPlugin(twHomePlugin)
  .addPage({
    element: <TWHomePage/>,
    title: 'Root Page',
    path: '/tw-home'
  })
  .render();
