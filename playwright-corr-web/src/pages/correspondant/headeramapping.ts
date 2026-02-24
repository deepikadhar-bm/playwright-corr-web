import { Page, Locator } from '@playwright/test';

/**
 * Page Object: HeaderaMapping
 * Elements: 3
 */
export class HeaderamappingPage {
  constructor(private page: Page) {}

  get Header_Mapping_Title(): Locator {
    return this.page.locator("//h1[text()=' Header Mapping / ']");
  }

  get Delete_In_HeaderMapping(): Locator {
    return this.page.locator("(//i[contains(@class,'fas fa-trash-alt text-danger')])[2]");
  }

  get Disabled_Headers(): Locator {
    return this.page.locator("//fieldset[@disabled]");
  }

}