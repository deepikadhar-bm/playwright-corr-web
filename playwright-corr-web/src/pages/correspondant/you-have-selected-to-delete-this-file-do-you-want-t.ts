import { Page, Locator } from '@playwright/test';

/**
 * Page Object: You have selected to delete this file. Do you want t
 * Elements: 1
 */
export class YouHaveSelectedToDeleteThisFileDoYouWantTPage {
  constructor(private page: Page) {}

  get You_have_selected_to_delete_this_file_Do_you_want_to_proceed(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"This action cannot be undone\"]]/..");
  }

}