import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal.......
 * Elements: 1
 */
export class CorrespondentPortal19Page {
  constructor(private page: Page) {}

  get On_Radio_Button(): Locator {
    return this.page.locator("//input[@id='bulk-bid-select-on']");
  }

}