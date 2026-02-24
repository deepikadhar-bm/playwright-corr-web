import { Page, Locator } from '@playwright/test';

/**
 * Page Object: You have selected to delete "" mapping. Do you want
 * Elements: 1
 */
export class YouHaveSelectedToDeleteMappingDoYouWantPage {
  constructor(private page: Page) {}

  get You_have_selected_to_delete_mapping_Do_you_want(): Locator {
    return this.page.locator("//div[text()[normalize-space() = 'You have selected to delete \"\" mapping. Do you want to proceed?']]");
  }

}