import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Save Clients Button
 * Elements: 1
 */
export class SaveClientsButtonPage {
  constructor(private page: Page) {}

  get Save_Clients_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Save Clients\"]]");
  }

}