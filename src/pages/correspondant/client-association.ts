import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Client Association
 * Elements: 1
 */
export class ClientAssociationPage {
  constructor(private page: Page) {}

  get Client_Association(): Locator {
    return this.page.locator("(//span[contains(@class, 'fa-landmark')])[1]");
  }

}