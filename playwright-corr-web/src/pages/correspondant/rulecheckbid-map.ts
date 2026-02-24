import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Rule_Check_Bid Map
 * Elements: 4
 */
export class RulecheckbidMapPage {
  constructor(private page: Page) {}

  get Action_Chase_Value_1(): Locator {
    return this.page.locator("//label[text()=\"Chase Value\"]/..//div[@class=\"d-flex\"]//select");
  }

  get Action_Chase_Value1(): Locator {
    return this.page.locator("//div[@class=\"row rules-actions\"]//label[text()=\"Chase Value\"]/..//select");
  }

  get Condition_Bidfield_2(): Locator {
    return this.page.locator("(//div[@class=\"rules-conditions\"]//button//div[contains(@class,\"flex-grow-1\")])[3]");
  }

  get Rule_Check_Bid_Map(): Locator {
    return this.page.locator("(//i[text()[normalize-space() = \"map:\"]])[1]");
  }

}