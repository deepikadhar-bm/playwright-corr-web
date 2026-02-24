import { Page, Locator } from '@playwright/test';

/**
 * Page Object: maplist
 * Elements: 2
 */
export class MaplistPage {
  constructor(private page: Page) {}

  get Active_StatusNew(): Locator {
    return this.page.locator("//button[normalize-space(text())='$|Create New Map|']//..//..//span[text()='ACTIVE']");
  }

  get Advanced_Search_Bidmaps_Delete_Button(): Locator {
    return this.page.locator("//tbody//td[@data-title=\"Map Name\"]//*[contains(text(),\"$|Common KeyWord|\")]/../..//button[@aria-label=\"Delete Map\"]");
  }

}