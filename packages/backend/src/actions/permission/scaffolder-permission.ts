/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BitbucketIntegrationConfig, ScmIntegrations } from '@backstage/integration';
import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import { InputError } from '@backstage/errors';
import fetch from "node-fetch";

export function createRepoPermissionAction(options: {
  integrations: ScmIntegrations;
}) {
  const { integrations } = options;

  return createTemplateAction<{
     owner: string;
     repoUrl: object;
     appName: string;
  }>({
    id: 'add:permission',
    description:
      'Adds permission to the group owner of the repo',
    schema: {
      input: {
        type: 'object',
        required: ['owner','repoUrl'],
        properties: {
          owner: {
            title: 'Owner of the repo',
            type: 'string',
          },
          repoUrl: {
            title: 'Repository Url which includes repository name and workspace and project key',
            type: 'object',
          },
          appName: {
            title: 'App Name of the Starter Kit',
            type: 'string',
          }
        },
      },
      output: {
        type: 'object',
        properties: {
          nextStepsUrl: {
            title: 'Next Steps Documentation Link for Starter Kit',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const {
        owner,
        repoUrl,
        appName,
        } = ctx.input;

      const [hostName, repoName, workspaceName] = getValues(repoUrl);    
      const integrationConfig = integrations.bitbucket.byHost(hostName);

      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${hostName}, please check your integrations config`,
        );
      }
       
      const authorizationHeader = getAuthorizationHeader(integrationConfig.config);
      const accessLevel = 'admin';
      const groupOwner = owner.trim().toLowerCase().replace(/\s+/g,"-");
      const nextStepsUrl = getNextStepsUrl(appName);
      
      const response = await fetch(`https://api.bitbucket.org/1.0/group-privileges/${workspaceName}/${repoName}/${workspaceName}/${groupOwner}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'text/plain',
          'Authorization': authorizationHeader
        },
        body: accessLevel
      });
        
      // Awaiting response.json()
      await response.json();

      ctx.logger.info(owner);
      ctx.logger.info(repoName);
      ctx.logger.info(workspaceName);
      ctx.logger.info(nextStepsUrl);
      ctx.logger.info(`Adding Permission to the repo`);
      ctx.output('nextStepsUrl', nextStepsUrl);
    },
  });
}
function getAuthorizationHeader(config: BitbucketIntegrationConfig) {
  
  if (config.username && config.appPassword) {
    const buffer = Buffer.from(
      `${config.username}:${config.appPassword}`,
      'utf8',
    );
    
    return `Basic ${buffer.toString('base64')}`;
  }

  if (config.token) {
    return `Bearer ${config.token}`;
  }

  throw new Error(
    `Authorization has not been provided for Bitbucket. Please add either username + appPassword or token to the Integrations config`,
  );
}

function getValues(repoUrl: any) {

  if(repoUrl.host && repoUrl.repo && repoUrl.workspace) {
    return [repoUrl.host, repoUrl.repo, repoUrl.workspace];
  }
  
  throw new Error(
    `Error fetching values from repoUrl`
  );
}

function getNextStepsUrl(appName: string) {
  
  if(appName == null || appName.length == 0)
    return "";

  return `/docs/default/component/${appName}/next-steps/next-steps/`;
}

