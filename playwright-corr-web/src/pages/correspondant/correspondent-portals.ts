import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portals....
 * Elements: 1
 */
export class CorrespondentPortalsPage {
  constructor(private page: Page) {}

  get CLM_Field_Names(): Locator {
    return this.page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/following-sibling::div[contains(@class, 'd-flex')]//select[contains(@class, 'form-select')]");
  }

}