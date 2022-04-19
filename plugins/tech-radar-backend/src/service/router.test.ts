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

import { getVoidLogger } from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';
import fetch from 'node-fetch';
import { createRouter } from './router';
import { Config } from '@backstage/config';
import { MockedFunction } from 'ts-jest';
import { Base64 } from 'js-base64';

jest.mock('node-fetch', () => jest.fn())

const { Response } = jest.requireActual('node-fetch');
const getString = jest.fn();
const config = {
  getString
} as unknown as Config

describe('createRouter', () => {
  let app: express.Express;

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      config
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /radar-data', () => {
    it('return ok', async () => {
      getString
      .mockReturnValueOnce('testUser')
      .mockReturnValueOnce('testPassword')
      .mockReturnValueOnce('testUrl');
      const expectedResponse = {
        tech: 'data'
      };
      const f = fetch as MockedFunction<typeof fetch>
      const res = new Response(JSON.stringify(expectedResponse));
      f.mockResolvedValueOnce(res);

      const response = await request(app).get('/radar-data')

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expectedResponse);
      expect(f.mock.calls[0][0]).toEqual('testUrl');
      expect(f.mock.calls[0][1]!.method).toEqual('GET');
      expect(f.mock.calls[0][1]!.headers).toEqual({'Authorization': `Basic ${Base64.encode('testUser:testPassword')}`});
    })
  })
});
