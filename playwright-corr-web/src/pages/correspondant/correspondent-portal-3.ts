import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal/////////////
 * Elements: 1
 */
export class CorrespondentPortal3Page {
  constructor(private page: Page) {}

  get Create_New_Map_Field(): Locator {
    return this.page.locator("//input[@id='mappingName']");
  }

}