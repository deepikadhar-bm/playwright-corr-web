import { Page, Locator } from '@playwright/test';

/**
 * Page Object: facebook login
 * Elements: 1
 */
export class FacebookLoginPage {
  constructor(private page: Page) {}

  get Facebook_log_in_or_sign_up(): Locator {
    return this.page.locator("//h3[text()[normalize-space() = \"Facebook - log in or sign up\"]]");
  }

}