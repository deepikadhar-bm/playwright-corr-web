import { Page, Locator } from '@playwright/test';

/**
 * Page Object: AmiX4 MoSNa CovDA - A4189 Checkbox
 * Elements: 2
 */
export class Amix4MosnaCovdaA4189CheckboxPage {
  constructor(private page: Page) {}

  get Delete_icon_in_Enumeration_Mapping(): Locator {
    return this.page.locator("/html/body/app-root/div/div/div/div/div/div/div/app-mapping-wizard-container/main/app-enumeration-mapping-container/section[2]/app-enumeration-mapping/fieldset/div/div/div[2]/div/div[3]/div[4]/div/div/div");
  }

  get SixthCompany_Checkbox(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[7]");
  }

}