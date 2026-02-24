import { Page, Locator } from '@playwright/test';

/**
 * Page Object: New Map
 * Elements: 5
 */
export class NewMapPage {
  constructor(private page: Page) {}

  get Company_Checkbox(): Locator {
    return this.page.locator("(//div[@class=\"dropdown-overflow\"]//input[@type=\"checkbox\"])[3]");
  }

  get Individual_Selected_Company(): Locator {
    return this.page.locator("//label[text()=\"Select Company/s\"]/..//div[@class=\"pill rounded-pill relative\"]//span");
  }

  get Map_Headers_Button_New(): Locator {
    return this.page.locator("//span[text()=\"Map Headers\"]/ancestor::button");
  }

  get New_Map(): Locator {
    return this.page.locator("//a[text()[normalize-space() = \"New Map\"]]");
  }

  get Selected_Companies(): Locator {
    return this.page.locator("//label[text()=\"Select Company/s\"]/..//div[@class=\"pill rounded-pill relative\"]");
  }

}