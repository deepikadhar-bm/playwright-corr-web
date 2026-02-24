import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Heading: Delete - Testsigma_03/03/2025/08:04:14
 * Elements: 1
 */
export class HeadingDeleteTestsigma03032025080414Page {
  constructor(private page: Page) {}

  get Delete(): Locator {
    return this.page.locator("//h5[text()[normalize-space() = \"Delete - Testsigma_03/03/2025/08:04:14\"]]");
  }

}