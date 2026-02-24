import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Heading: Header Mapping
 * Elements: 1
 */
export class HeadingHeaderMappingPage {
  constructor(private page: Page) {}

  get Heading_Header_Mapping(): Locator {
    return this.page.locator("//h5[contains(normalize-space(),\"Header Mapping / Step 2 of 4\")]");
  }

}