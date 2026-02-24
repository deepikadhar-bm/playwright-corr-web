import { Page, Locator } from '@playwright/test';

/**
 * Page Object: This action cannot be undone
 * Elements: 1
 */
export class ThisActionCannotBeUndonePage {
  constructor(private page: Page) {}

  get This_action_cannot_be_undone(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"This action cannot be undone\"]]");
  }

}