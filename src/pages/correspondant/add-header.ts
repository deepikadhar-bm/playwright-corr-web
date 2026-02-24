import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Add Header
 * Elements: 6
 */
export class AddHeaderPage {
  constructor(private page: Page) {}

  get UpdatingChaseValue_1(): Locator {
    return this.page.locator("((//*[text()=\"Chase Value\"]/..//select)[1]/../..//option)[2]");
  }

  get Apply_Selected_1_Button_in_Rules_and_Action_Screen(): Locator {
    return this.page.locator("//div[contains(@class, 'shadow') and contains(@class, 'dropdown-menu') and contains(@class, 'show')]//button[@aria-label=\"Apply selected items\"]");
  }

  get CLM_Field_Name_Drop_Down(): Locator {
    return this.page.locator("//div[text()='CLM Field Name']/../..//select");
  }

  get Custom_Header_Input(): Locator {
    return this.page.locator("//div[text()='Custom Header']/../..//input");
  }

  get Individual_Company_NameBidrequest_Dropdown(): Locator {
    return this.page.locator("//span[contains(text(),\"$|IndividualCompanyname|\")]");
  }

  get Mapping_Between_Customised_Bid_Sample_Field_Name_and_Chase_Field_Name(): Locator {
    return this.page.locator("//div[text()='$|SearchHeaderName|']/..//select//option[contains(text(),'$|Option For CLM Field|')]");
  }

}