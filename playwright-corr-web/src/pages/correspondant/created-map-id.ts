import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Created Map Id
 * Elements: 2
 */
export class CreatedMapIdPage {
  constructor(private page: Page) {}

  get Edited_Map_Name(): Locator {
    return this.page.locator("//button[normalize-space(text())='$|EditedMapName|']");
  }

  get Map_Id(): Locator {
    return this.page.locator("//button[normalize-space(text())='@|Created Map Id|']");
  }

}