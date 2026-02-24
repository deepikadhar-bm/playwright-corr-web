import { Page, Locator } from '@playwright/test';

/**
 * Page Object: This action will save the changes and Move to Next Page
 * Elements: 1
 */
export class ThisActionWillSaveTheChangesAndMoveToNextPagePage {
  constructor(private page: Page) {}

  get This_action_will_save_the_changes_and_Move_to_Next_Page(): Locator {
    return this.page.locator("//*[contains(text(),\"This action will save the changes and Move to Next Page\")]");
  }

}