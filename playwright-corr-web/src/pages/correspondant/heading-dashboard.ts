import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Heading: Dashboard
 * Elements: 2
 */
export class HeadingDashboardPage {
  constructor(private page: Page) {}

  get Dashboard(): Locator {
    return this.page.locator("//h3[text()[normalize-space() = \"Dashboard\"]]");
  }

  get Harp_Indicator_Field(): Locator {
    return this.page.locator("(//select[contains(@class,'form-select')])[15]");
  }

}