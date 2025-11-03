import { Page } from '@playwright/test';
import { searchURLLocators } from '../locators/SearchURLLocators';

export class SearchURLPage{
  constructor(public page: Page) {}

  async fillSearchInput(keyword: string) {
    const searchForInput = this.page.getByLabel(searchURLLocators.searchForInput);
    await searchForInput.waitFor({state:'visible', timeout:3000} );
    searchForInput.fill(keyword);
  }

  async clickSubmitButton() {
    const submitButton = this.page.locator(searchURLLocators.submitSortButton);
    await submitButton.waitFor({state:'visible', timeout:3000} );
    submitButton.click();
  }

  async waitForTableResults(): Promise<any> {
    const keywordRow1 = this.page.locator(searchURLLocators.originalURLRow1);
    await keywordRow1.waitFor({state:'visible', timeout:3000} );
    return keywordRow1;
  }

  async getKeywordTextFromRow1(): Promise<any> {
    const keywordRow1 = this.page.locator(searchURLLocators.keywordRow1);
    return await keywordRow1.textContent();
  }

  async getTitleTextFromRow1(originalURLRow1:any): Promise<any> {
    const titleRow1 = originalURLRow1.locator(searchURLLocators.titleRow1);
    return await titleRow1.textContent();
  }

  async getURLTextFromRow1(originalURLRow1:any): Promise<any> {
    const urlRow1 = originalURLRow1.locator(searchURLLocators.urlRow1);
    return await urlRow1.textContent();
  }
}
