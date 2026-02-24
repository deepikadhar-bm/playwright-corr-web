import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal....................
 * Elements: 3
 */
export class CorrespondentPortal18Page {
  constructor(private page: Page) {}

  get Header_Mapping_Dropdowns(): Locator {
    return this.page.locator("//select[contains(normalize-space(),\"Select Show All Headers Show Unidentified Headers (10) Show Unused Headers Show Used Headers\")]");
  }

  get Search_field_in_Rules_and_Actions(): Locator {
    return this.page.locator("(//input[@type=\"search\"])[7]");
  }

  get Yes_Proceed_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Yes, Proceed\"]]");
  }

}