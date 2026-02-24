import { Page, Locator } from '@playwright/test';

/**
 * Page Object: bid request config
 * Elements: 13
 */
export class BidRequestConfigPage {
  constructor(private page: Page) {}

  get Deffered_Off_Radio_Button(): Locator {
    return this.page.locator("//input[@id=\"pricingMode-1-off\"]");
  }

  get Delete_Button_pos(): Locator {
    return this.page.locator("//div[contains(@class, 'scrollable-page')]/div[1]/app-general-settings-container[1]/div[2]/div[1]/div[2]/app-bid-request-config-container[1]/app-bid-request-config[1]/div[1]/form[2]/div[1]/div[5]/button[1]/i[1]");
  }

  get Delete_Lock_Days(): Locator {
    return this.page.locator("(//button)[1]");
  }

  get Delete_Lock_Days_Icon_Config(): Locator {
    return this.page.locator("//div[@formarrayname=\"inputs\"]//button");
  }

  get Individual_Delete_Icon(): Locator {
    return this.page.locator("((//*[contains(text(),\"Lock Days :\")]/following-sibling::form[1])//button//i)[1]");
  }

  get Loan_Duplicate_Toggle(): Locator {
    return this.page.locator("(//*[@class=\"slider round\"])[2]");
  }

  get Lock_Days_Input(): Locator {
    return this.page.locator("(//input[@type=\"number\"])[$|count|]");
  }

  get Lock_Days_Input1(): Locator {
    return this.page.locator("(//input[@type=\"number\"])[1]");
  }

  get Lock_days_Input2(): Locator {
    return this.page.locator("(//input[@type=\"number\"])[2]");
  }

  get Newly_Added_Dropdown_InputPOS(): Locator {
    return this.page.locator("(//select[@aria-label=\"Dropdown selection\"])[5]");
  }

  get Newly_Added_Inputpos(): Locator {
    return this.page.locator("(//input[@formcontrolname=\"customFieldName\"])[5]");
  }

  get Real_Time_Off_Radio_Button(): Locator {
    return this.page.locator("//input[@id=\"pricingMode-0-off\"]");
  }

  get Save_Changes_Button(): Locator {
    return this.page.locator("//button[text()=\"Save Changes\"]");
  }

}