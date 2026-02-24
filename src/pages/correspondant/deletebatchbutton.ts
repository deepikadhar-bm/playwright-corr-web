import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Delete_batch_Button
 * Elements: 1
 */
export class DeletebatchbuttonPage {
  constructor(private page: Page) {}

  get Delete_batch_Button(): Locator {
    return this.page.locator("//span[normalize-space(text())=\"Delete batch\"]//parent::button");
  }

}