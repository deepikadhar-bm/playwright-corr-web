import { Page, Locator } from '@playwright/test';

/**
 * Page Object: 15 - Active
 * Elements: 19
 */
export class P15ActivePage {
  constructor(private page: Page) {}

  get Chase_Value(): Locator {
    return this.page.locator("//label[text()=\"Chase Value\"]/..//button[@id=\"singleSelectDropDownWithSearch\"]");
  }

  get Below_Dropdown_Third_Company(): Locator {
    return this.page.locator("(//div[@role=\"listitem\"])[4]");
  }

  get BidEnumeraedTapeValue_3(): Locator {
    return this.page.locator("(//label[text()=\" Bid Enumerated Tape Value \"]/../../../../../..//div[contains(@class,\"flex-grow-1 text-start\")])[6]");
  }

  get Chase_Field_Name(): Locator {
    return this.page.locator("(//select[@id=\"id\"])[2]");
  }

  get Select_Add_Actions(): Locator {
    return this.page.locator("//label[text()=\"Chase Field Name\"]/../../../following-sibling::div//*[@class=\"form-select\"]");
  }

  get _16_Active(): Locator {
    return this.page.locator("//a[text()[normalize-space() = \"16 - Active\"]]");
  }

  get Add_Condition(): Locator {
    return this.page.locator("(//button[@class=\"btn bg-transparent text-primary\"])[2]");
  }

  get Bid_Map_Name(): Locator {
    return this.page.locator("//span[contains(.,'$|Create New Map|')]");
  }

  get Chase_Field_in_Enumeration_Mapping(): Locator {
    return this.page.locator("(//div[@class=\"my-2\"])[1]");
  }

  get Chase_Field_Name_2(): Locator {
    return this.page.locator("//div[contains(@class, 'header-grid-layout') and contains(@class, 'custom-header')]//select[@title=\"Amortization Type\"]");
  }

  get Checking_Enum_Value(): Locator {
    return this.page.locator("//*[text()=\"Amortization Type\"]/../..//input[@type=\"checkbox\"]");
  }

  get Checking_Enum_Values_in_Header_Mapping(): Locator {
    return this.page.locator("(//input[contains(@type,'checkbox')])[15]");
  }

  get Searched_Company_name(): Locator {
    return this.page.locator("//div[contains(@class,\"cursor-pointer py\")]/../../..//span[text()=\"$|FirstCompanyname|\"]");
  }

  get Select_Company_Names(): Locator {
    return this.page.locator("//span[@class='pl-2'][contains(.,'@|Company name 1|')]");
  }

  get Select_Chase_Field_Name(): Locator {
    return this.page.locator("(//select[@aria-label=\"Default dropdown selection\"])[5]");
  }

  get Select_Next_Business_Day(): Locator {
    return this.page.locator("//select[@class=\"form-select ng-untouched ng-pristine ng-invalid\"]");
  }

  get View_Active_Version_in_Header_Mapping(): Locator {
    return this.page.locator("//div[@class=\"gap-2 header-grid-layout\"]/..");
  }

  get When_Bid_Field(): Locator {
    return this.page.locator("(//button[@id=\"singleSelectDropDownWithSearch\"])[3]");
  }

  get When_Bid_Field_RulesAndActions(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"]/../..//button[@id=\"singleSelectDropDownWithSearch\"])[1]");
  }

}