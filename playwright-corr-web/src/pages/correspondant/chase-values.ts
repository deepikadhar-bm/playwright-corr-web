import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Chase Values.
 * Elements: 1
 */
export class ChaseValuesPage {
  constructor(private page: Page) {}

  get Chase_Values(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Actions\"]]/preceding-sibling::div[contains(@class, 'd-flex') and contains(@class, 'flex-column')]//input[contains(@class, 'form-control')]");
  }

}