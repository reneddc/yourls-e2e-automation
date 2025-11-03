import { test as base } from '@playwright/test';
import { DbFactory } from '../../factories/db.factory';
import { ApiFactory } from '../../factories/apiClient.factory';
import type { Connection } from 'mysql2/promise';
import type { APIRequestContext } from '@playwright/test';

export const test = base.extend<{
  db: Connection;
  api: APIRequestContext;
}>({
  db: async ({}, use) => {
    const connection = await DbFactory.createConnection();
    await use(connection);
    await connection.end();
  },
  api: async ({}, use) => {
    const apiClient = await ApiFactory.create();
    await use(apiClient);
  }
});

export { expect } from '@playwright/test';
