import { Page, Locator } from '@playwright/test';

/**
 * Page Object: DeepikaAugBidQA1csv button div
 * Elements: 1
 */
export class MappingCreationWizard {
  constructor(private page: Page) {}

  get Delete_Button_in_Bid_Maps(): Locator {
    return this.page.locator("//i[@class=\"fas fa-trash-alt text-danger\"]/../..//button[@type=\"button\"]");
  }

  get Error_Message_in_Creation_Of_Bid_Maps(): Locator {
    return this.page.locator("//div[@class=\"error-message\"]");
  }

}