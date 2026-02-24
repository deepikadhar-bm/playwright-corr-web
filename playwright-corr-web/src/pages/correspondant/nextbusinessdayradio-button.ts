import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Next_Business_Day_Radio _Button
 * Elements: 1
 */
export class NextbusinessdayradioButtonPage {
  constructor(private page: Page) {}

  get Next_Business_Day_Radio_Button(): Locator {
    return this.page.locator("//div[contains(@class, 'scrollable-page')]/div[1]/app-new-bid-request-container[1]/app-execution-details-container[1]/app-execution-details[1]/div[1]/div[1]/form[1]/div[4]/div[1]/div[2]/input[1]");
  }

}