import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Actions
 * Elements: 19
 */
export class ActionsPage {
  constructor(private page: Page) {}

  get Bid_Enumerated_Tape_Value(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[5]");
  }

  get Actions(): Locator {
    return this.page.locator("(//*[text()[normalize-space() = \"Actions\"]])[2]");
  }

  get Add_Actions_Last_Field_Delete_Button(): Locator {
    return this.page.locator("(((//button[text()=\" Add Action \"])[1]/preceding-sibling::div)[2]//*[text()=\" Select \"]/ancestor::div[@class=\"d-flex\"])[1]//button[contains(@class,\"text-danger\")]");
  }

  get Add_Conditions_Last_Field_Delete_Button_1(): Locator {
    return this.page.locator("(//button[text()=\" Add Condition \"])[1]/../preceding-sibling::div//*[text()=\" Select \"]/ancestor::div[@class=\"d-flex\"]//button[contains(@class,\"text-danger\")]");
  }

  get Chase_Direct_ON_button(): Locator {
    return this.page.locator("(//label[normalize-space(text())='Chase Direct']/parent::div//input)[1]");
  }

  get ChaseDirect_Off_Button(): Locator {
    return this.page.locator("(//label[normalize-space(text())='Chase Direct']/parent::div//input)[2]");
  }

  get Close_Model_Button(): Locator {
    return this.page.locator("//button[@data-dismiss='modal']");
  }

  get Company_Name_ChaseDirect_FirstRow(): Locator {
    return this.page.locator("//div[@id='common-table-results']/table//tr[1]//td[@data-title=\"Company Name\"]");
  }

  get CompanyName_ActionButton_FirstRow(): Locator {
    return this.page.locator("//div[@id='common-table-results']/table//tr[1]//td[@data-title=\"Actions\"]");
  }

  get CompanyName_Below_Dropdown(): Locator {
    return this.page.locator("//div[contains(@class,'pill rounded-pill')]//span[contains(text(),'$|CompanyNamePartial|')]");
  }

  get CompanyName_BidMaps(): Locator {
    return this.page.locator("//div[@id='common-table-pagination']/following-sibling::div[1]//td[@data-title=\"Map Name\"][contains(.,'$|Create New Map|')]");
  }

  get CompanyName_ChaseDirect_SecondRow(): Locator {
    return this.page.locator("//div[@id='common-table-results']/table//tr[2]//td[@data-title=\"Company Name\"]");
  }

  get Edit_Permissions(): Locator {
    return this.page.locator("//h5[contains(.,'Edit Permissions')]");
  }

  get Save_Draft_Exit(): Locator {
    return this.page.locator("(//button[contains(.,'Save Draft & Exit')])[1]");
  }

  get search_guyf(): Locator {
    return this.page.locator("(//input[@type=\"search\"])[2]");
  }

  get SecondCompanyName_Below_Dropdown(): Locator {
    return this.page.locator("//div[contains(@class,'pill rounded-pill')]//span[normalize-space(text())='$|SecondCompanyName|']");
  }

  get Standard_Dropdown(): Locator {
    return this.page.locator("//select[@aria-label=\"Dropdown selection\"]");
  }

  get Standard_Flow_On_Button(): Locator {
    return this.page.locator("(//label[normalize-space(text())='Standard']/parent::div//input)[1]");
  }

  get Update_Permissions_Button(): Locator {
    return this.page.locator("//button[contains(.,'Update Permissions')]");
  }

}