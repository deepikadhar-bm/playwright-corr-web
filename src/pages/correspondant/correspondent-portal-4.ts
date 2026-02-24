import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal...................................
 * Elements: 3
 */
export class CorrespondentPortal4Page {
  constructor(private page: Page) {}

  get Last_One_Month_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Last One Month\"]]");
  }

  get Custom_Header(): Locator {
    return this.page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/following-sibling::div[contains(@class, 'd-flex')]//input[contains(@class, 'form-control')]");
  }

  get Mapping_Creation_Wizard(): Locator {
    return this.page.locator("//h3[contains(normalize-space(),\"Mapping Creation Wizard - $|\"Create New Map\"|\")]");
  }

}