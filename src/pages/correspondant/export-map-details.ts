import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Export Map Details
 * Elements: 3
 */
export class ExportMapDetailsPage {
  constructor(private page: Page) {}

  get Export_Map_Details(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Export Map Details\"]]");
  }

  get selectAllCheckbox(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[1]");
  }

  get Version_of_Header_and_BidMap_Data(): Locator {
    return this.page.locator("//div[contains(text(),'Version')]/ancestor::table[@aria-label=\"Data Table\"]/..//span[text()='DRAFT']/../../..//*[contains(text(),\"$|RowDataFromBidMap|\")]");
  }

}