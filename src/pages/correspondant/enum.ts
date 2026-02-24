import { Page, Locator } from '@playwright/test';

/**
 * Page Object: enum
 * Elements: 1
 */
export class EnumPage {
  constructor(private page: Page) {}

  get enum_Header_Rule(): Locator {
    return this.page.locator("(//*[@aria-label=\"Bid Map Search and Filter\"]//*[text()=\"Enum\"]/../following-sibling::div//i)[1]");
  }

}