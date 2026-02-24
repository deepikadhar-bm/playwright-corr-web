import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Enum Filter
 * Elements: 3
 */
export class EnumFilterPage {
  constructor(private page: Page) {}

  get Bid_Field_Name_Text(): Locator {
    return this.page.locator("((//div[@class=\"mapping-card rounded-3 unchecked\"])[1]//*[@class=\"col-2\"])[1]//div");
  }

  get Bid_Tape_Value_Field_Added_in_Enumeration_Mapping_Disabled(): Locator {
    return this.page.locator("(//div[@class=\"input-field-name text-truncate cursor-pointer\"])[1]");
  }

  get First_Checkbox_Element(): Locator {
    return this.page.locator("//div[text()=\"$|BidFieldName|\"]/ancestor::div[@class=\"mapping-card rounded-3 unchecked\"]//input[@type=\"checkbox\"]");
  }

}