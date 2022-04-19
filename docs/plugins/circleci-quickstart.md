# CircleCI QuickStart Guide

Guide detailing how to use circleci plugin for your project.

## Circleci Plugin

Backstage has made available to expose any kind of infrastructure or software development tool as a plugin.

Circleci Plugin (@backstage/plugin-circleci) is a plugin that integrates towards circleci.
Configuring this plugin gives the user of backstage an ability to view the circleci builds of a project when the project is registered in
backstage.

## How to setup your app/project to utilize the circleci plugin

It is pretty simple to setup an app to utilize the circleci plugin.
Add the following annotation to the catalog-info.yaml of an app:
``
circleci.com/project-slug: {vcs-type}/{workspace}/{repoName}
``
For example, adding the above annotation to a repo named test-skeleton
````
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
    name: Java-Quick-Start
    description: Some description
    annotations:
        circleci.com/project-slug: bitbucket/wwgrainger/test-skeleton
````

## Where to find your CircleCI output within Backstage

After adding the circleci annotation to catalog-info yaml file of a project, register the project as
component in backstage. To register a project, click the "REGISTER EXISTING COMPONENT" and provide catalog-info.yaml
file path of the project be registered.

Once the component is registered, find it in the components section of backstage catalog and view your component.

The CI/CD tab should show the builds of the respective component, following is an example of Java QuickStart component:

![](../images/builds-using-circleci-plugin.png)

## Where to view pipeline failures within Backstage

The status of a build Success/Failed is shown in the status column of the component's CI/CD tab.
The reasons for a build failure can be found within the logs. Logs can be viewed by clicking on the build commit message.

![](../images/build-logs-circleci-plugin.png)

## Where to view the top 50 builds for your component

This plugin gives the ability to view the top 50 builds of a component.Builds can be viewed by clicking on next
page icon in the bottom right corner of the page.

![](../images/navigating-builds-circleci-plugin.png)

## How to retry a build from Backstage

A build can be restarted from backstage by clicking the "restart build" icon in the actions
column and then click the refresh icon next to filter to see your build triggered.The restart will not be shown
until the refresh button has been clicked.

![](../images/retry-build-circleci-plugin.png)
