import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal...............................
 * Elements: 1
 */
export class CorrespondentPortal6Page {
  constructor(private page: Page) {}

  get Select_Date_Range_Dropdown(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Select Date Range\"]]");
  }

}