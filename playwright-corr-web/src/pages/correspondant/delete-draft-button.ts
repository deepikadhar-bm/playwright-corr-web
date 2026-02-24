import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Delete Draft Button
 * Elements: 1
 */
export class DeleteDraftButtonPage {
  constructor(private page: Page) {}

  get Delete_Draft_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Delete Draft\"]]");
  }

}