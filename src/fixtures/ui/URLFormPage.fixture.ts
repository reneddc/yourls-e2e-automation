import { test as base } from "@playwright/test";
import { URLFormPage } from "../../pom/pages/URLFormPage";

export const test = base.extend<{ urlFormPage: URLFormPage }>({
  urlFormPage: async ({ page }, use) => {
    const urlFormPage = new URLFormPage(page);
    await use(urlFormPage);
  },
});

export { expect } from "@playwright/test";