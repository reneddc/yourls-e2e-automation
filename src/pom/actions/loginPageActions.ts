import { Page, expect } from '@playwright/test';
import LoginPageObjects from '../objects/loginPageObjects';

export default class LoginPageActions extends LoginPageObjects {
  page: Page;

  constructor(page: Page) {
    super();
    this.page = page;
  }

  async login(username: string, password: string) {
    await this.page.fill(LoginPageObjects.usernameInput(), username);
    await this.page.fill(LoginPageObjects.passwordInput(), password);
    await this.page.click(LoginPageObjects.submitButton());
  }
}
