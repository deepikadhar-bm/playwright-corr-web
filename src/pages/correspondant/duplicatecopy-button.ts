import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Duplicate/Copy Button
 * Elements: 2
 */
export class DuplicatecopyButtonPage {
  constructor(private page: Page) {}

  get Delete_Option_On_Duplicate_Rule_Action(): Locator {
    return this.page.locator("//select[@title=\"$|duplicate rule actions|\"]//..//..//..//..//..//..//..//span[@class=\"fas fa-trash-alt\"]");
  }

  get DuplicateCopy_Button(): Locator {
    return this.page.locator("(//span[text()[normalize-space() = \"Duplicate/Copy\"]])[1]");
  }

}