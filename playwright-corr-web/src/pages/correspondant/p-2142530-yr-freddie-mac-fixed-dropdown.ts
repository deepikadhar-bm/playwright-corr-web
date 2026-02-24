import { Page, Locator } from '@playwright/test';

/**
 * Page Object: 214_25/30 Yr Freddie Mac Fixed Dropdown
 * Elements: 12
 */
export class P2142530YrFreddieMacFixedDropdownPage {
  constructor(private page: Page) {}

  get Map_Name(): Locator {
    return this.page.locator("(//td[@data-title=\"Map Name\"])[1]");
  }

  get Delete_Rule_Button(): Locator {
    return this.page.locator("(//span[text()[normalize-space() = \"Delete Rule\"]])[1]");
  }

  get Bid_Maps_Name(): Locator {
    return this.page.locator("//span[contains(.,' $|Create New Map|')]");
  }

  get Bid_Tape_Value_In_EnumerationMapping(): Locator {
    return this.page.locator("(//div[text()=\"Loan Purpose\"]/../../..//div[@class=\"input-field-name text-truncate cursor-pointer\"])[2]");
  }

  get Chase_Value(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[6]");
  }

  get Company_Name_ChaseDirect(): Locator {
    return this.page.locator("//td[contains(.,\"Allowed\") and @data-title=\"Chase Direct\"]/../td[@data-title=\"Company Name\"]");
  }

  get Error_Message_in_Header_Mapping(): Locator {
    return this.page.locator("//p[text()[normalize-space() = \"Multiple client headers are mapped to the same Chase Field name. Please review and make changes.\"]]/..");
  }

  get Product_Name_Dropdown(): Locator {
    return this.page.locator("//button[@title=\"214_25/30 Yr Freddie Mac Fixed\"]//div[text()[normalize-space() = \"214_25/30 Yr Freddie Mac Fixed\"]]");
  }

  get Select_CompanyNames(): Locator {
    return this.page.locator("//button[@class='dropdown-item d-flex'][contains(.,'@|CompanyName3|')]");
  }

  get SelectDropdown_in_Chase_Value(): Locator {
    return this.page.locator("(//label[text()=\"If Chase Field\"]/../..//select[@class=\"form-select ng-untouched ng-pristine ng-valid\"])");
  }

  get TextField_for_Actions(): Locator {
    return this.page.locator("(//label[text()=\"If Chase Field\"]/../../../..//input)[2]");
  }

  get Version_Number(): Locator {
    return this.page.locator("(//td[@data-title=\"Version Number\"])[1]");
  }

}