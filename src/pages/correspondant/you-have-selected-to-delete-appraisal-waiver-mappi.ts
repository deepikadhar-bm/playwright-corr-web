import { Page, Locator } from '@playwright/test';

/**
 * Page Object: You have selected to delete "Appraisal Waiver" mappi
 * Elements: 1
 */
export class YouHaveSelectedToDeleteAppraisalWaiverMappiPage {
  constructor(private page: Page) {}

  get Delete_Message_In_HeaderMapping(): Locator {
    return this.page.locator("//div[text()[normalize-space() = 'You have selected to delete \"$|DeleteHederMapping|\" mapping. Do you want to proceed?']]");
  }

}