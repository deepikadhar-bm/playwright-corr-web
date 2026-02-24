import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal...........
 * Elements: 10
 */
export class CorrespondentPortal7Page {
  constructor(private page: Page) {}

  get Apply_Selected_for_the_Bid_Maps(): Locator {
    return this.page.locator("//span[contains(@class,\"counter bg-white text-primary mx-2 text-center fw-semibold small\")]");
  }

  get Chase_Value_for_the_Actions(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"=\"]]/following-sibling::app-lp-fieldtype-input-selection//input[contains(@class, 'form-control')]");
  }

  get Execution_Type_and_Lock_Term_for_chase_in_Bid_Request(): Locator {
    return this.page.locator("(//select[@class=\"form-select ng-untouched ng-pristine\"])[2]");
  }

  get Execution_Type_and_Lock_Term_in_Bid_Request(): Locator {
    return this.page.locator("(//select[@class=\"form-select ng-untouched ng-pristine\"])[1]");
  }

  get Header_Mapping_Checkbox(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[2]");
  }

  get Header_Mapping_checkbox(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[3]");
  }

  get Header_Mapping_Show_Unidentified_Header(): Locator {
    return this.page.locator("//select[@class=\"form-select\"]/../..//option[@value=\"Show Unidentified Headers\"]/..//span[text()=\"(10)\"]");
  }

  get Products_Dropdown(): Locator {
    return this.page.locator("(//label[contains(@class, 'dropdown-item') and contains(@class, 'd-flex')])[2]");
  }

  get Search_Field_in_Enumeration_Mapping(): Locator {
    return this.page.locator("(//input[contains(@placeholder,'Search')])[3]");
  }

  get Select_Button_in_Enumeration_Mapping(): Locator {
    return this.page.locator("//a[text()[normalize-space() = \"Select\"]]");
  }

}