# tw-home

Welcome to the tw-home plugin!

## Getting started

This plugin has been added to the app in this repository.

## Local plugin development testing steps
Change your working directory to `plugins/tw-home`

You can  run the plugin in isolation by running `yarn start` in this directory.

Access the root url [/tw-home](http://localhost:7007/tw-home)

This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.

## Setup developer system

Change your working directory to `productcore-backstage` and follow the steps below-
1.  run `yarn install`
2.  run `yarn  tsc`
3.  run `yarn build`
4.  run `yarn dev`

## Developer Guide to add a new component /card in this plugin

1.  Navigate to `plugins/tw-home/src/components` and create your component.   Example component is given for reference `CreateAppCard`
2.  Change `plugin.ts`, `index.ts` code to reference and export the new card.
3.  Change `packages/app/src/components/home/HomePage.tsx`  file to import your card and modify this file as need.
