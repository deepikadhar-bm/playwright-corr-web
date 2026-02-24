import { Page, Locator } from '@playwright/test';

/**
 * Page Object: When Bid Field
 * Elements: 8
 */
export class WhenBidFieldPage {
  constructor(private page: Page) {}

  get When_Bid_Field_Dropdown(): Locator {
    return this.page.locator("//label[text()=' When Bid Field ']/..//button[@id=\"singleSelectDropDownWithSearch\"]");
  }

  get When_Bid_Field_Dropdown_Red_Color(): Locator {
    return this.page.locator("//button[@id=\"singleSelectDropDownWithSearch\"]/parent::div[contains(@class,\"form-control p-0 danger\")]");
  }

  get Common_Xpath_for_Options_Under_When_Bid_Field(): Locator {
    return this.page.locator("//button[@class=\"dropdown-item d-flex\" and not(@aria-label=\"Select text option\")]//span[@class=\"pl-2\"]");
  }

  get Data_iIn_When_Bid_Field(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[2]");
  }

  get Duplicate_When_Bid_Field(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[5]");
  }

  get Duplicate_When_Bid_Field1(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"]/../../../../..//button[@id=\"singleSelectDropDownWithSearch\"]//div[normalize-space(text())='Property Type'])[1]");
  }

  get Duplicate_When_Bid_Field2(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"]/../../../../..//button[@id=\"singleSelectDropDownWithSearch\"]//div[normalize-space(text())='Property Type'])[2]");
  }

  get Option_under_When_Bid_Field(): Locator {
    return this.page.locator("(//button[@class=\"dropdown-item d-flex\" and not(@aria-label=\"Select text option\")]//span[@class=\"pl-2\"])[$|total|]");
  }

}