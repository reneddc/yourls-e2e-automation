import { test, expect } from '@playwright/test';
import { LogInPage } from '../../pom/pages/LogInPage';

test('Login fallido muestra mensaje de error', async ({ page }) => {
  const login = new LogInPage(page);
  await page.goto('/admin');
  await login.login('wronguser', 'wrongpass');
  const error = page.locator('#error-message');
  await expect(error).toHaveText('Invalid username or password');
});
