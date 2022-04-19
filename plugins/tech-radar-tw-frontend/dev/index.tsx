import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { techRadartwFrontendPlugin, TechRadartwFrontendPage } from '../src/plugin';

createDevApp()
  .registerPlugin(techRadartwFrontendPlugin)
  .addPage({
    element: <TechRadartwFrontendPage width={1500} height={800} />,
    title: 'Root Page',
    path: '/tech-radar'
  })
  .render();
