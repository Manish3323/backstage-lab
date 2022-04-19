# Catalog Import Plugin QuickStart Guide

Guide detailing how to use catalog import plugin in backstage.

## Catalog Import Plugin

The catalog import plugin provides a wizard to onboard projects with existing catalog-info.yaml files.

## How to build the catalog info file

The catalog info file contains the information about project description, tags, metadata and annotations. It is 
recommended to name this file as catalog-info.yaml.

Here is an example of catalog-info.yaml file 

```
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: Node-Quick-Start
  description: This template will set up a Node project that includes mocha and chai. Running this
    template will register and publish the project to Bitbucket. This will allow for a
    deployment pipeline to be setup in CircleCI and deploy into the k8s cluster.
  annotations:
    backstage.io/techdocs-ref: dir:.
    circleci.com/project-slug: bitbucket/wwgrainger/template-me-nodejs
    sonarqube.org/project-key: template-me-nodejs
  tags:
    - nodejs
    - javascript
    - mocha
    - chai

spec:
  type: experience
  system: grainger-backstage-dev
  owner: productcore
  lifecycle: production

```
The root fields apiVersion, kind, metadata, and spec are part of the envelope, defining the overall structure of all kinds of entity. 
Likewise, some metadata fields like name, labels, and annotations are of special significance and have reserved purposes and 
distinct shapes

## Important Fields in catalog info file and what they mean
    
    apiVersion (required):

        1. API version is the version of specification format for that particular entity that the specification is made against.
        2. Early versions of the catalog will be using alpha/beta versions, e.g. backstage.io/v1alpha1, to signal 
        that the format may still change. After that, we will be using backstage.io/v1 and up.
    
    Kind (required):
        
        1. The kind is the high level entity type being described
        2. The perhaps most central kind of entity, that the catalog focuses on in the initial phase, is Component.
    
    metadata (required):
        
        1. A structure that contains metadata about the entity, i.e. things that aren't directly part of the entity 
        specification itself. 
        2. "name" is required sub-field with in metadata. Names must be unique per kind and it defines the name of the entity.
        3. "title" is optional sub-field with in metadata. Title is display name of the entity, to be presented in user 
        interfaces instead of the name property above, when available.
        4. "description" is optional sub-field with in metadata. A human readable description of the entity, to be shown in Backstage.
        5. "annotations" is optional sub-field with in metadata. Their purpose is mainly, but not limited, to reference into external systems. 
        This could for example be a reference to the circleci ref the entity was ingested from, to show all the builds etc
        6. "tags" is optional sub-field with in metadata. Tags are a list of single-valued strings, for example to classify catalog entities 
        in various ways.
        7. "links" is optional sub-field with in metadata. Links define a list of external hyperlinks related to the entity. URL is required field in a link.

    spec (varies):
        
        1. The actual specification data that describes the entity.
        2. The precise structure of the spec depends on the apiVersion and kind combination, and some kinds may not even 
        have a spec at all.
        3. "type" is a required sub-field with in spec field. The type of component can be following
            i. website -> a website
           ii. service -> a backend service, typically exposing an API
          iii. library -> a software library, such as an npm module or a Java library
           iv. experience -> a template experience
            v. API -> an api, such as api.yaml file
       4. "lifecycle" is a required sub-field with in spec field. This defines the lifecycle state of the component. For example:
            i. production -> an established, owned, maintained component
           ii. experimental -> an experiment or early, non-production component
          iii. deprecated -> a component that is at the end of its lifecycle, and may disappear at a later point in time
       5. "owner" is a required sub-field with in spec field. This defines an entity reference to the owner of the component.
       6. "system" is a optional sub-field with in spec field. This is an entity reference to the system that the component belongs to. 


## What you should expect when your project is configured properly

Register the catalog-info.yaml file of the project in "Register Exisiting Component" section.

![](../images/register-existing-component.png)

Import the component and complete registering the component.

![](../images/import-component.png)

After successfully registering your component in backstage, the component should be available in the components section.

![](../images/registered-component.png)

![](../images/components.png)

Click the component to view more info and see how catalog-info file filled in the details of the project

![](../images/component-view.png)

## Where to register your components in backstage

You can register your project as a component in backstage here: https://backstage.internal.graingercloud.com/catalog-import

## References

https://backstage.io/docs/features/software-catalog/descriptor-format
https://backstage.io/docs/features/software-catalog/well-known-annotations

