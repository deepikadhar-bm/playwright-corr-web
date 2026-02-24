import { Page, Locator } from '@playwright/test';

/**
 * Page Object: ts-test
 * Elements: 5
 */
export class TstestPage {
  constructor(private page: Page) {}

  get TS_Upload_file(): Locator {
    return this.page.locator("(//input[@type=\"file\"])[1]");
  }

  get TSElem(): Locator {
    return this.page.locator("//div[text()='$|Individual Bid Enum Value|']/../..//div[text()='$|Bid Tape Value|']");
  }

  get TSMapping(): Locator {
    return this.page.locator("//div[normalize-space(text())='$|Individual Bid Enum Value|']/ancestor::div[contains(@class, 'col-2')]/following-sibling::div[contains(@class, 'col-4')]//div[normalize-space(text())='$|Bid Tape Value|']");
  }

  get TSoptions(): Locator {
    return this.page.locator("(//select[@aria-label='Dropdown selection']/option[not(@disabled and @hidden)])[2]");
  }

  get TSprice_dropdown(): Locator {
    return this.page.locator("//select[@aria-label='Dropdown selection']");
  }

}