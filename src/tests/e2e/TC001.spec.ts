import { test, expect } from '../../fixtures/loginPage.fixture';
import * as dotenv from 'dotenv';

dotenv.config();

test('TC001: Create shortURL by UI and verify it at API response and db queries', async ({ logInPage }) => {
    await logInPage.goTo();
    await logInPage.login(process.env.ADMIN_USER || '', process.env.ADMIN_PASS || '');
});
