import { Page, Locator } from '@playwright/test';

/**
 * Page Object: list screen
 * Elements: 2
 */
export class ListScreenPage {
  constructor(private page: Page) {}

  get Individual_Cell_ValueUI(): Locator {
    return this.page.locator("(//tbody//tr[$|RowCountUI|]//td)[$|ColumnCountUI|]");
  }

  get Mapping_of_Header_and_BidMap_Data(): Locator {
    return this.page.locator("//div[contains(text(),'$|TableHeadersFromFile|')]/ancestor::table[@aria-label=\"Data Table\"]//*[contains(text(),\"$|RowDataFromBidMap|\")]");
  }

}