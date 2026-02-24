import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Apply button for Filters........
 * Elements: 1
 */
export class ApplyButtonForFilters2Page {
  constructor(private page: Page) {}

  get This_action_will_save_the_changes_and_Move_to_Next_Page_Success_Message(): Locator {
    return this.page.locator("//*[text()[normalize-space() = \"This action will save the changes and Move to Next Page\"]]");
  }

}