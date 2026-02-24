import { Page, Locator } from '@playwright/test';

/**
 * Page Object: View Draft Button
 * Elements: 1
 */
export class ViewDraftButtonPage {
  constructor(private page: Page) {}

  get View_Draft_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"View Draft\"]]");
  }

}