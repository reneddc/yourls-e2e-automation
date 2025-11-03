import { Page } from '@playwright/test';
import {LogInLocators} from '../locators/LogInLocators';

export class LogInPage{
  constructor(public page: Page) {}

  async goTo() { 
    await this.page.goto('/admin');
  }

  async login(username: string, password: string) {
    await this.page.locator(LogInLocators.usernameInput).fill(username);
    await this.page.locator(LogInLocators.passwordInput).fill(password);
    await this.page.locator(LogInLocators.submitButton).click();
  }
}
