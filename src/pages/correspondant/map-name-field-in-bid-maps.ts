import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Map Name Field in Bid Maps
 * Elements: 2
 */
export class MapNameFieldInBidMapsPage {
  constructor(private page: Page) {}

  get_Bid_Map_Name_Field_In_Row(CreateNewMap: string): Locator {
  return this.page.locator(`//td[@data-title="Map Name"]//button[normalize-space(text())="${CreateNewMap}"]`);
}

  get Map_Name_Field_in_Bid_Maps(): Locator {
    return this.page.locator("//input[@id='mapName']");
  }

}