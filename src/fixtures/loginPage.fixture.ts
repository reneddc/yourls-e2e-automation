import { test as base } from "@playwright/test";
import { LogInPage } from "../pom/pages/LogInPage";

export const test = base.extend<{ logInPage: LogInPage }>({
  logInPage: async ({ page }, use) => {
    const logInPage = new LogInPage(page);
    await use(logInPage);
  },
});

export { expect } from "@playwright/test";