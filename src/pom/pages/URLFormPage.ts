import { Page } from '@playwright/test';
import { URLFormLocators } from '../locators/URLFormLocators';

export class URLFormPage{
  constructor(public page: Page) {}

  async fillUrlInput(url: string) {
    const urlInput = this.page.locator(URLFormLocators.urlInput);
    await urlInput.waitFor({state:'visible', timeout:3000} );
    urlInput.fill(url);
  }

  async fillKeywordInput(keyword: string) {
    const keywordInput = this.page.locator(URLFormLocators.keywordInput);
    await keywordInput.waitFor({state:'visible', timeout:3000} );
    keywordInput.fill(keyword);
  }

  async clickShortenURLButton() {
    const shortenURLButton = this.page.locator(URLFormLocators.shortenURLButton);
    await shortenURLButton.waitFor({state:'visible', timeout:3000} );
    shortenURLButton.click();
  }
}
