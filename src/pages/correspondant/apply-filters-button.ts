import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Apply Filters Button
 * Elements: 2
 */
export class ApplyFiltersButtonPage {
  constructor(private page: Page) {}

  get Search_Field(): Locator {
    return this.page.locator("(//input[@type=\"search\"])[1]");
  }

  get Apply_Filters_Button(): Locator {
    return this.page.locator("//div[contains(@class, \"justify-content-end\")]//button[text()=\"Apply Filters\"]");
  }

}