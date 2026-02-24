import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal..
 * Elements: 1
 */
export class CorrespondentPortal16Page {
  constructor(private page: Page) {}

  get File_Field(): Locator {
    return this.page.locator("//div[@class=\"card\"]");
  }

}