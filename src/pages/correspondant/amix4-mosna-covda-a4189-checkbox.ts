import { Page, Locator } from '@playwright/test';

/**
 * Page Object: AmiX4 MoSNa CovDA - A4189 Checkbox
 * Elements: 2
 */
export class Amix4MosnaCovdaA4189CheckboxPage {
  constructor(private page: Page) {}

  

  get SixthCompany_Checkbox(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[7]");
  }

}