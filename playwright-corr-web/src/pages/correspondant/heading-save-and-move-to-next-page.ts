import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Heading: Save and Move to Next Page
 * Elements: 1
 */
export class HeadingSaveAndMoveToNextPagePage {
  constructor(private page: Page) {}

  get Save_and_Move_to_Next_Page(): Locator {
    return this.page.locator("//h5[text()[normalize-space() = \"Save and Move to Next Page\"]]");
  }

}