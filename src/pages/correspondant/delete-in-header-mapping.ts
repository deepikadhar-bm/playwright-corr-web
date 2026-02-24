import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Delete in Header Mapping
 * Elements: 2
 */
export class DeleteInHeaderMappingPage {
  constructor(private page: Page) {}

  get CCode_Checkbox(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[2]");
  }

  get Delete_in_Header_Mapping(): Locator {
    return this.page.locator("//div[text()='$|deletedEnumerationValue|']//..//..//button[@aria-label=\"Delete Header\"]");
  }

}