import { mergeTests } from "@playwright/test";
import { test as logInTest, expect} from '../fixtures/ui/loginPage.fixture';
import { test as urlFormTest} from '../fixtures/ui/URLFormPage.fixture';
import { test as dbApiTest } from '../fixtures/api-db/db-api.fixture';
import { test as searchURLTest} from '../fixtures/ui/searchURLPage.fixture';
import { randomString } from '../helpers/test-data-generator';

const test = mergeTests(logInTest, urlFormTest, searchURLTest, dbApiTest);

test.describe.serial('Create Short URL via API', () => {
    const randomSuffix = randomString(5);
    const keyword = `keyword${randomSuffix}`;
    const url = `https://url-${randomSuffix}.com`;
    const title = randomSuffix;

    test('TC002-API: Create shortURL via API', async ({ api }) => {
        const apiUrl = '/yourls-api.php';
        const params = new URLSearchParams({
            signature: process.env.YOURLS_SIGNATURE || 'caed1384a5',
            action: 'shorturl',
            url: url,
            keyword: keyword,
            title: title,
            format: 'json'
        });
        const response = await api.get(`${apiUrl}?${params.toString()}`);
        const data = await response.json();
        expect(data.status).toBe('success');
        expect(data.shorturl).toContain(keyword);
    });

    test('TC002-UI: Verify shortURL via UI search', async ({ logInPage, searchURLPage }) => {
        await logInPage.goTo();
        await logInPage.login(process.env.ADMIN_USER || '', process.env.ADMIN_PASS || '');
        await searchURLPage.fillSearchInput(keyword);
        await searchURLPage.clickSubmitButton(); 
        const originalURLRow1 = await searchURLPage.waitForTableResults();
        const titleRow1 = await searchURLPage.getTitleTextFromRow1(originalURLRow1);
        const urlRow1 = await searchURLPage.getURLTextFromRow1(originalURLRow1);
        const keywordRow1 = await searchURLPage.getKeywordTextFromRow1();
        expect(titleRow1).toBe(title);
        expect(urlRow1).toBe(url);
        expect(keywordRow1).toBe(keyword);
    });

    test('TC002-DB: Verify shortURL in database', async ({ db }) => {
        const [rows] = await db.execute(
            'SELECT keyword, url, title FROM yourls_url WHERE keyword = ? AND url = ? AND title = ?',
            [keyword, url, title]
        );
        const result = rows as any[];
        expect(result.length).toBe(1);
        expect(result[0]).toMatchObject({ keyword, url, title });
    });
});