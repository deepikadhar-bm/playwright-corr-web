import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Heading: Create New Map
 * Elements: 2
 */
export class HeadingCreateNewMapPage {
  constructor(private page: Page) {}

  get Checked_Company_Name(): Locator {
    return this.page.locator("(//div[@class=\"dropdown-overflow\"]//input[@type=\"checkbox\"])[3]/..//span");
  }

  get Create_New_Map(): Locator {
    return this.page.locator("//h5[text()[normalize-space() = \"Create New Map\"]]");
  }

}