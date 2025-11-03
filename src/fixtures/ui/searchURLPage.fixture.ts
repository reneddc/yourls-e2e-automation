import { test as base } from "@playwright/test";
import { SearchURLPage } from "../../pom/pages/searchURLPage";

export const test = base.extend<{ searchURLPage: SearchURLPage }>({
  searchURLPage: async ({ page }, use) => {
    const searchURLPage = new SearchURLPage(page);
    await use(searchURLPage);
  },
});

export { expect } from "@playwright/test";