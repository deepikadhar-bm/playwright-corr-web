import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal.....
 * Elements: 2
 */
export class CorrespondentPortal8Page {
  constructor(private page: Page) {}

  get Bid_Enum_Value_in_Fields(): Locator {
    return this.page.locator("(//div[@class=\"input-field-name text-truncate cursor-pointer\"])[$|count|]");
  }

  get Compare_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Create\"]");
  }

}