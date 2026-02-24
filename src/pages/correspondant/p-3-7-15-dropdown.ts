import { Page, Locator } from '@playwright/test';

/**
 * Page Object: 3 7 15 Dropdown
 * Elements: 5
 */
export class P3715DropdownPage {
  constructor(private page: Page) {}

  get When_Bid_Field(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[6]");
  }

  get Attachment_Type_in_Enumeration_Mapping(): Locator {
    return this.page.locator("(//div[text()='Attachment Type']/../..//select[@id=\"id\"])");
  }

  get Select_Chase_Value_Actions(): Locator {
    return this.page.locator("//label[text()=\"If Chase Field\"]/../..//input[@class=\"form-control ng-pristine ng-valid ng-touched\"]");
  }

  get StandardExecution_Dropdown(): Locator {
    return this.page.locator("(//select[contains(normalize-space(),\"Select 3 7 15\")])[1]");
  }

  get UnMapped_HeaderMapping(): Locator {
    return this.page.locator("//div[@class=\"gap-2 header-grid-layout unidentified-header\"]");
  }

}