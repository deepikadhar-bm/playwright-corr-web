import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Appraised Value
 * Elements: 1
 */
export class AppraisedValuePage {
  constructor(private page: Page) {}

  get Bid_Sample_Field_In_Alert_Pop_Up(): Locator {
    return this.page.locator("//td[text()[normalize-space() = \"Appraised Value\"]]/following-sibling::td//div[text()[normalize-space() = \"Appraised Value\"]]");
  }

}