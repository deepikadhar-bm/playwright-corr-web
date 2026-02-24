import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal;;;;;;;;;;;;;;
 * Elements: 1
 */
export class CorrespondentPortal17Page {
  constructor(private page: Page) {}

  get Freedom_A4187_A4187_Dropdown(): Locator {
    return this.page.locator("//input[@aria-label=\"Select Freedom A4187 (A4187)\"]");
  }

}