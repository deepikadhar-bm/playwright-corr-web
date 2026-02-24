import { Page, Locator } from '@playwright/test';

/**
 * Page Object: You have selected to delete "Amortization Type" mapp
 * Elements: 1
 */
export class YouHaveSelectedToDeleteAmortizationTypeMappPage {
  constructor(private page: Page) {}

  get Delete_Message_for_Bid_Sample_Field_Name(): Locator {
    return this.page.locator("//div[@class='p-2'][contains(.,'You have selected to delete \"Amortization Term\" mapping. Do you want to proceed?')]\" mapping. Do you want to proceed?')]");
  }

}