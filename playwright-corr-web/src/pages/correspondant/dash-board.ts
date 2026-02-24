import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Dash board
 * Elements: 4
 */
export class DashBoardPage {
  constructor(private page: Page) {}

  get Bid_Tape_Status_Text(): Locator {
    return this.page.locator("//h5[text()[normalize-space() = \"Bid Tape Status\"]]");
  }

  get Current_Day_Dropdown(): Locator {
    return this.page.locator("//a[@role=\"button\" and contains(@class, 'd-flex')]");
  }

  get SLA_Accuracy_Text(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"SLA Accuracy\"]]");
  }

  get Total_loan_value_Text(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Total # loan value\"]]");
  }

}