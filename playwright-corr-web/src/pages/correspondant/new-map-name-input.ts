import { Page, Locator } from '@playwright/test';

/**
 * Page Object: New Map Name Input
 * Elements: 1
 */
export class NewMapNameInputPage {
  constructor(private page: Page) {}

  get New_Map_Name_Input(): Locator {
    return this.page.locator("//input[contains(@id,\"mappingName\")]");
  }

}