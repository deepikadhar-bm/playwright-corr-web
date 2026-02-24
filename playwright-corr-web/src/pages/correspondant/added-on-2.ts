import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Added On
 * Elements: 3
 */
export class AddedOn2Page {
  constructor(private page: Page) {}

  get Company_Name_Default_in_Mapping_File(): Locator {
    return this.page.locator("//div[contains(@class,\"cursor-pointer py\")]/../../..//span");
  }

  get company_4(): Locator {
    return this.page.locator("//td[@data-title=\"Company\" and contains(text(),\"$|fourthCompanySelected|\")]");
  }

  get Select_Rule_1(): Locator {
    return this.page.locator("(//span[@class='ngb-highlight'][contains(.,'@|Search Map Input|')])[1]");
  }

}