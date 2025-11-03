import { mergeTests } from "@playwright/test";
import { test as logInTest, expect} from '../fixtures/loginPage.fixture';
import { test as urlFormTest} from '../fixtures/URLFormPage.fixture';
import { test as dbApiTest } from '../fixtures/db-api.fixture';
import * as dotenv from 'dotenv';

const test = mergeTests(logInTest, urlFormTest, dbApiTest);

dotenv.config();

function randomString(length: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

test('TC001: Create shortURL by UI and verify it at API response and db queries', async ({ logInPage, urlFormPage, api, db }) => {
    const randomSuffix = randomString(5);
    const keyword = `keyword${randomSuffix}`;
    const url = `https://url-${randomSuffix}.com`;
    
    // UI Steps
    await logInPage.goTo();
    await logInPage.login(process.env.ADMIN_USER || '', process.env.ADMIN_PASS || '');
    await urlFormPage.fillUrlInput(url);
    await urlFormPage.fillKeywordInput(keyword);
    await urlFormPage.clickShortenURLButton();
    await urlFormPage.page.waitForTimeout(2000);

    // API Steps
    const apiUrl = '/yourls-api.php';
    const params = new URLSearchParams({
        signature: process.env.YOURLS_SIGNATURE || 'caed1384a5',
        action: 'url-stats',
        shorturl: keyword,
        format: 'json'
    });
    const response = await api.get(`${apiUrl}?${params.toString()}`);
    const data = await response.json();
    expect(data.statusCode).toBe("200");
    expect(data.link.shorturl).toBe(`http://localhost:8080/${keyword}`);
    expect(data.link.url).toBe(url);
    expect(data.link.title).toBe(url);

    // DB Steps
    const [rows] = await db.execute(
        'SELECT keyword, url, title FROM yourls_url WHERE keyword = ? AND url = ? AND title = ?',
        [keyword, url, url]
    );
    const result = rows as any[];
    expect(result.length).toBe(1);
    expect(result[0]).toMatchObject({ keyword, url, title: url });
});