import { Page, Locator } from '@playwright/test';

/**
 * Page Object: View Active Version Button
 * Elements: 1
 */
export class ViewActiveVersionButtonPage {
  constructor(private page: Page) {}

  get View_Active_Version_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"View Active Version\"]]");
  }

}