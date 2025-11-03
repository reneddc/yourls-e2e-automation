// tests/e2e/create-shorturl.spec.ts
import { mergeTests } from "@playwright/test";
import { test as logInTest, expect} from '../fixtures/ui/loginPage.fixture';
import { test as urlFormTest} from '../fixtures/ui/URLFormPage.fixture';
import { test as dbApiTest } from '../fixtures/api-db/db-api.fixture';
import { randomString } from '../helpers/test-data-generator';

const test = mergeTests(logInTest, urlFormTest, dbApiTest);

test.describe.serial('Create Short URL', () => {
    const randomSuffix = randomString(5);
    const keyword = `keyword${randomSuffix}`;
    const url = `https://url-${randomSuffix}.com`;

    test('TC001-UI: Create shortURL via UI', async ({ logInPage, urlFormPage }) => {
        await logInPage.goTo();
        await logInPage.login(process.env.ADMIN_USER || '', process.env.ADMIN_PASS || '');
        await urlFormPage.fillUrlInput(url);
        await urlFormPage.fillKeywordInput(keyword);
        await urlFormPage.clickShortenURLButton();
        await urlFormPage.page.waitForTimeout(2000);
        const successMessage = urlFormPage.page.locator('.success, #new_url_form .notice');
        await expect(successMessage).toBeVisible();
    });

    test('TC001-API: Verify shortURL via API', async ({ logInPage, urlFormPage, api }) => {
        await logInPage.goTo();
        await logInPage.login(process.env.ADMIN_USER || '', process.env.ADMIN_PASS || '');
        await urlFormPage.fillUrlInput(url);
        await urlFormPage.fillKeywordInput(keyword);
        await urlFormPage.clickShortenURLButton();
        await urlFormPage.page.waitForTimeout(2000);
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
    });

    test('TC001-DB: Verify shortURL in database', async ({ logInPage, urlFormPage, db }) => {
        await logInPage.goTo();
        await logInPage.login(process.env.ADMIN_USER || '', process.env.ADMIN_PASS || '');
        await urlFormPage.fillUrlInput(url);
        await urlFormPage.fillKeywordInput(keyword);
        await urlFormPage.clickShortenURLButton();
        await urlFormPage.page.waitForTimeout(2000);
        const [rows] = await db.execute(
            'SELECT keyword, url, title FROM yourls_url WHERE keyword = ? AND url = ? AND title = ?',
            [keyword, url, url]
        );
        const result = rows as any[];
        expect(result.length).toBe(1);
        expect(result[0]).toMatchObject({ keyword, url, title: url });
    });

});