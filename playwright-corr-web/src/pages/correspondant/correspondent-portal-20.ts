import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal.................
 * Elements: 1
 */
export class CorrespondentPortal20Page {
  constructor(private page: Page) {}

  get Property_Type_In_EnumerationMapping(): Locator {
    return this.page.locator("(//div[text()=\"Property Type\"]/../..//select[@id=\"id\"])[1]");
  }

}