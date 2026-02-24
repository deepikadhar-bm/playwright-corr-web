import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Mapping.
 * Elements: 2
 */
export class MappingPage {
  constructor(private page: Page) {}

  get Checking_Enum_Values_in_Header_Mapping1(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"]/../../..//div[contains(@class,\"flex-grow\")])[14]");
  }

  get Checking_Enum_Values_in_Header_Mapping2(): Locator {
    return this.page.locator("//*[text()=\"$|EnumValues|\"]/../..//input[@type=\"checkbox\"]");
  }

}