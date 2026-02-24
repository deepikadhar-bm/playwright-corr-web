import { Page, Locator } from '@playwright/test';

/**
 * Page Object: AppraisedValueSelectAm div div
 * Elements: 2
 */
export class AppraisedvalueselectamDivDivPage {
  constructor(private page: Page) {}

  get All_Select_in_header(): Locator {
    return this.page.locator("//div[contains(@class,\"gap-2 header-grid-layout\")]/..//select[@title=\"\"]");
  }

  get Check_box_in_Header_Mapping(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[2]");
  }

}