import { request } from '@playwright/test';

export class ApiFactory {
  static async create(baseURL?: string) {
    return await request.newContext({
      baseURL: baseURL || process.env.API_BASE,
      extraHTTPHeaders: {
        'Authorization': process.env.YOURLS_SIGNATURE || '',
      },
    });
  }
}
