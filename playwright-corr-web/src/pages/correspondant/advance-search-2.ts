import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Advance search............,...............
 * Elements: 1
 */
export class AdvanceSearch2Page {
  constructor(private page: Page) {}

  get Yes_Proceed_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Yes, Proceed\"]");
  }

}