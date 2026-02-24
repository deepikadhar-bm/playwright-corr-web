import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Investment (NOO) Dropdown
 * Elements: 1
 */
export class InvestmentNooDropdownPage {
  constructor(private page: Page) {}

  get Investment_NOO_Dropdown(): Locator {
    return this.page.locator("(//div[text()=\"Occupancy Type\"]/../..//select)[1]");
  }

}