import { Page, Locator } from '@playwright/test';

/**
 * Page Object: bid request creation
 * Elements: 13
 */
export class BidRequestCreationPage {
  constructor(private page: Page) {}

  get Bid_Mapping_Id_Selected_Text(): Locator {
    return this.page.locator("//*[@id=\"selectBidMappingIdDropdown\"]");
  }

  get Bid_Upload_Date(): Locator {
    return this.page.locator("(//div[@class=\"col-6\" and contains(text(),\"$|CurrentDate|\")])[1]");
  }

  get Enabled_Time_New(): Locator {
    return this.page.locator("(//option[@aria-disabled=\"false\"])");
  }

  get Fourth_Enabled_Time(): Locator {
    return this.page.locator("(//option[@aria-disabled=\"false\"])[4]");
  }

  get Lock_days_2_lock_expiration(): Locator {
    return this.page.locator("(//div[contains(text(),\"Lock Terms\")]/..//div[contains(text(),\":\")])[2]");
  }

  get Lock_Term_Days_Lock_Expiration(): Locator {
    return this.page.locator("//div[contains(text(),\"Lock Terms\")]/..//div");
  }

  get Lock_term_days_1lock_expiration(): Locator {
    return this.page.locator("(//div[contains(text(),\"Lock Terms\")]/..//div[contains(text(),\":\")])[1]");
  }

  get Lock_Term_Days_Text_1(): Locator {
    return this.page.locator("(//div[contains(text(),\"Lock Terms\")])[1]");
  }

  get Lock_Term_Days_text_2(): Locator {
    return this.page.locator("(//div[contains(text(),\"Lock Terms\")])[2]");
  }

  get Second_Enabled_Time(): Locator {
    return this.page.locator("(//option[@aria-disabled=\"false\"])[2]");
  }

  get Select_Company_Search_Input(): Locator {
    return this.page.locator("//div[text()=\" Select \"]/../../../following-sibling::div//input[@placeholder=\"Search\"]");
  }

  get Selected_Company_from_Dropdown(): Locator {
    return this.page.locator("(//*[@id=\"selectCompanyDropdown\"]//button)[1]");
  }

  get Third_Enabled_Time(): Locator {
    return this.page.locator("(//option[@aria-disabled=\"false\"])[3]");
  }

}