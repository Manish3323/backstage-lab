---
id: techdocs-overview
title: TechDocs Documentation
sidebar_label: Overview
# prettier-ignore
description: TechDocs is Spotify’s homegrown docs-like-code solution built directly into Backstage
---

## What is it?

<!-- Intro, backstory, etc.: -->

TechDocs is Spotify’s homegrown docs-like-code solution built directly into Backstage. Engineers write their documentation in Markdown files which live together with their code - and with little configuration get a nice-looking doc site in Backstage.

Today, it is one of the core products in Spotify’s developer experience offering with 5000+ documentation sites and around 10000 average daily hits. Read more about TechDocs in its
[announcement blog post](https://backstage.io/blog/2020/09/08/announcing-tech-docs).
🎉

## Features

- Deploy TechDocs no matter how your software environment is set up.
- Discover your Service's technical documentation from the Service's page in Backstage Catalog.
- Create documentation-only sites for any purpose by just writing Markdown.
- Explore and take advantage of the large ecosystem of
  [MkDocs plugins](https://www.mkdocs.org/user-guide/plugins/) to create a rich reading experience.
- Search for and find docs.

## Platforms supported

See [TechDocs Architecture](architecture.md) to get an overview of where these
providers are used.

| Source Code Hosting Provider | Support Status |
| ---------------------------- | -------------- |
| GitHub                       | Yes ✅         |
| GitHub Enterprise            | Yes ✅         |
| Bitbucket                    | Yes ✅         |
| Azure DevOps                 | Yes ✅         |
| GitLab                       | Yes ✅         |
| GitLab Enterprise            | Yes ✅         |

| File Storage Provider             | Support Status |
| --------------------------------- | -------------- |
| Local Filesystem of Backstage app | Yes ✅         |
| Google Cloud Storage (GCS)        | Yes ✅         |
| Amazon Web Services (AWS) S3      | Yes ✅         |
| Azure Blob Storage                | Yes ✅         |
| OpenStack Swift                   | Community ✅   |

[Reach out to us](#feedback) if you want to request more platforms.

## Project roadmap

### **Published versions**

**Alpha release** ✅ -
[Milestone](https://github.com/backstage/backstage/milestone/16)

- Alpha of TechDocs that you can use end to end - and contribute to.

**Beta release** ✅ -
[Milestone](https://github.com/backstage/backstage/milestone/29)

- TechDocs' recommended setup supports most environments (CI systems, cloud
  storage solutions, source control systems).
- [Instructions for upgrading from Alpha to Beta](how-to-guides.md#how-to-migrate-from-techdocs-alpha-to-beta)

**v1** ✅

TechDocs packages:

- '@backstage/plugin-techdocs'
- '@backstage/plugin-techdocs-backend'
- '@backstage/plugin-techdocs-node'
- '@techdocs/cli'

TechDocs promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### **Future work 🔮**

Some of the following items are coming soon and some are potential ideas.

- [TechDocs Addon Framework](https://github.com/backstage/backstage/issues/9636)
- Contribute to and deploy from a marketplace of TechDocs Addons
- Addon: Highlight text and raise an Issue to create a feedback loop to drive up documentation quality
- Addon: MDX (allows you to use JSX in your Markdown content)
- Better integration with
  [Scaffolder V2](https://github.com/backstage/backstage/issues/2771) (e.g. easy to choose and plug documentation template with Software Templates)
- Static site generator agnostic
- Possible to configure several aspects about TechDocs (e.g. URL, homepage,
  theme)

## Tech stack

| Stack                                           | Location                                                        |
| ----------------------------------------------- | --------------------------------------------------------------- |
| Frontend Plugin                                 | [`@backstage/plugin-techdocs`][techdocs/frontend]               |
| Frontend Plugin Library                         | [`@backstage/plugin-techdocs-react`][techdocs/frontend-library] |
| Backend Plugin                                  | [`@backstage/plugin-techdocs-backend`][techdocs/backend]        |
| CLI (for local development and generating docs) | [`@techdocs/cli`][techdocs/cli]                                 |
| Docker Container (for generating docs)          | [`techdocs-container`][techdocs/container]                      |

[techdocs/frontend]: https://github.com/backstage/backstage/blob/master/plugins/techdocs
[techdocs/frontend-library]: https://github.com/backstage/backstage/blob/master/plugins/techdocs-react
[techdocs/backend]: https://github.com/backstage/backstage/blob/master/plugins/techdocs-backend
[techdocs/container]: https://github.com/backstage/techdocs-container
[techdocs/cli]: https://github.com/backstage/techdocs-cli

## Contact us

Reach out to us in the `#docs-like-code` channel of our
[Discord chatroom](https://github.com/backstage/backstage#community).
