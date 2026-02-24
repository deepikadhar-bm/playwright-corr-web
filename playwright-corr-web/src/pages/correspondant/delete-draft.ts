import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Delete Draft
 * Elements: 2
 */
export class DeleteDraftPage {
  constructor(private page: Page) {}

  get Text_In_Delete_Draft(): Locator {
    return this.page.locator(" //div[normalize-space(text())='You have selected to delete this draft map which will be permanently deleted and cannot be recovered. Do you want to proceed?']");
  }

  get Yes_proceed_On_Delete_Draft(): Locator {
    return this.page.locator("//span[normalize-space(text())='Yes, proceed']");
  }

}