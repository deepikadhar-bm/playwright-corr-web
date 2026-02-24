import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Rules and Actions Button
 * Elements: 6
 */
export class RulesAndActionsButtonPage {
  constructor(private page: Page) {}

  get Select_Category_On_Rules_and_Actions(): Locator {
    return this.page.locator("(//div[@class=\"cursor-pointer py-3 text-wrap\"])[2]");
  }

  get Added_Rule_Block(): Locator {
    return this.page.locator("//div[@class=\"block\"]");
  }

  get Condition_BidField_1(): Locator {
    return this.page.locator("(//div[@class=\"rules-conditions\"]//button//div[contains(@class,\"flex-grow-1\")])[1]");
  }

  get Condition_BidTape_2(): Locator {
    return this.page.locator("(//div[@class=\"rules-conditions\"]//button//div[contains(@class,\"flex-grow-1\")])[4]");
  }

  get Condition_BidTape1(): Locator {
    return this.page.locator("(//div[@class=\"rules-conditions\"]//button//div[contains(@class,\"flex-grow-1\")])[2]");
  }

  get Rules_and_Actions_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Rules and Actions\"]]");
  }

}