import { Page, Locator } from '@playwright/test';

/**
 * Page Object: +1more
 * Elements: 13
 */
export class P1morePage {
  constructor(private page: Page) {}

  get _1more(): Locator {
    return this.page.locator("//a[text()[normalize-space() = \"+1\"]]");
  }

  get Add_0R_Block(): Locator {
    return this.page.locator("(//button[@class=\"btn bg-transparent text-primary\"])[3]");
  }

  get Bid_Enumerated_Tape_Dropdown(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[5]");
  }

  get Bid_Sample_Field_Name_For_Header_Mapping(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1\"])[7]");
  }

  get Chase_Field_Name_Rule(): Locator {
    return this.page.locator("((//*[text()=\"Chase Field Name\"]/..//select)[2]/../..//option)[4]");
  }

  get Chase_Field_name_in_header_Mapping(): Locator {
    return this.page.locator("((//div[@class=\"flex-grow-1\"]/../..//select)[2]/..//option)[4]");
  }

  get Created_On_Import_Rule(): Locator {
    return this.page.locator("(//td[@data-title=\"Created on\"])[1]");
  }

  get Custom_Header_In_Enumeration_Mapping(): Locator {
    return this.page.locator("(//div[@class=\"col-2\"])[3]");
  }

  get Loan_Term_Chase_Value(): Locator {
    return this.page.locator("//div[@class='flex-grow-1 text-start text-truncate'][contains(.,'hey')]");
  }

  get Loan_Term_Select(): Locator {
    return this.page.locator("//a[@role='button'][contains(.,'Select')]");
  }

  get Next_Business_Day_Radio_Button(): Locator {
    return this.page.locator("(//input[@type=\"radio\"])[2]");
  }

  get Operator_Block_2(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/../../../..//select)[4]");
  }

  get When_Bid_Field(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[8]");
  }

}