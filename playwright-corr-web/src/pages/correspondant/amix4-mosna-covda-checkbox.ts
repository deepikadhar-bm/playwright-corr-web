import { Page, Locator } from '@playwright/test';

/**
 * Page Object: AmiX4 MoSNa CovDA Checkbox
 * Elements: 1
 */
export class Amix4MosnaCovdaCheckboxPage {
  constructor(private page: Page) {}

  get Select_Second_Available_Company(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[24]");
  }

}