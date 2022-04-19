# Sonarqube Plugin
Sonarqube Quickstart Guide

## What is Sonarqube?

Sonarqube is a platform that performs automated scans on code to detect bugs, code smells, security vulnerabilities and hotspots. 
Sonarqube currently supports more than 20 languages including both Java and Javascript.

## Where to view Sonarqube scan results within Backstage?

Results from the latest Sonarqube scan can be seen within Backstage in the component page overview tab.

![sq-card](../images/card.png)

Going to the "view more" on the card, it will take you to the Sonarqube profile, where you can see more details on the issues the analysis picked up.


## How to setup the Sonarqube plugin for a project?

The following annotation will need to be added:

```yaml
annotations:
    sonarqube.org/project-key: [insert project name]
```
Here is a code snippet from the Java starterkit as an example

![](../images/java-catalog-snip.png)
