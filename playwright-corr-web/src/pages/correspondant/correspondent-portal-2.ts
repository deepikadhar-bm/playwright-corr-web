import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal,;,;;;;;;;;
 * Elements: 1
 */
export class CorrespondentPortal2Page {
  constructor(private page: Page) {}

  get Select_CompanyCCode_Dropdown(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Select Company/CCode\"]]");
  }

}