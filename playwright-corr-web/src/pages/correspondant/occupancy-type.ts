import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Occupancy Type
 * Elements: 1
 */
export class OccupancyTypePage {
  constructor(private page: Page) {}

  get Occupancy_Type(): Locator {
    return this.page.locator("(//div[text()[normalize-space() = \"Occupancy Type\"]])[1]");
  }

}