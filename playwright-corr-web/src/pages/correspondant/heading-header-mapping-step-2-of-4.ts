import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Heading: Header Mapping / Step 2 of 4
 * Elements: 1
 */
export class HeadingHeaderMappingStep2Of4Page {
  constructor(private page: Page) {}

  get Header_Mapping_Step_2_of_4(): Locator {
    return this.page.locator("//h1[@class=\"fw-semibold py-3\"]");
  }

}