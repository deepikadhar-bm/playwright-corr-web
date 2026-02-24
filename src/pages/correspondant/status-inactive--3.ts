import { Page, Locator } from '@playwright/test';

/**
 * Page Object: "status": " INACTIVE ",............................................................
 * Elements: 3
 */
export class StatusInactive3Page {
  constructor(private page: Page) {}

  get Search_Filter_Input_in_Customer_Permission(): Locator {
    return this.page.locator("//input[@placeholder=\"Search / Filter\"]");
  }

  get Searched_Company_Name(): Locator {
    return this.page.locator("//div[contains(@class,\"cursor-pointer py\")]/../../..//span[text()=\"$|Companyname|\"]");
  }

  get Selected1_Companys_Dropdown(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Selected (1)\"]]");
  }

}