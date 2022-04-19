/*
 * Copyright 2020 The Backstage Authors
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

import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import fetch from 'node-fetch';
import { Base64 } from 'js-base64';
import { Config } from '@backstage/config';

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });

  router.get('/radar-data', (_, response) => {
    const username = options.config.getString('techradar.username');
    const password = options.config.getString('techradar.password');
    const radarDataUrl = options.config.getString('techradar.radarDataUrl');
    const headers = { 'Authorization': `Basic ${Base64.encode(username + ":" + password)}` }

    fetch(radarDataUrl, {
      method: 'GET',
      headers
    })
    .then(res => res.json())
    .then(data => {
      response.send(data);
    });
  });

  router.use(errorHandler());

  return router;
}
