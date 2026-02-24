import { Page, Locator } from '@playwright/test';

/**
 * Page Object: bid maps company dropdown
 * Elements: 4
 */
export class BidMapsCompanyDropdownPage {
  constructor(private page: Page) {}

  get Remove_First_Selected_Company_ButtonBid_map_creation(): Locator {
    return this.page.locator("(//*[contains(@aria-label,\"Remove\")]//i[contains(@class , 'fas fa-times-circle text-primary')])[1]");
  }

  get Remove_second_Selected_Company_buttonBid_Map_Creation(): Locator {
    return this.page.locator("(//*[contains(@aria-label,\"Remove\")]//i[contains(@class , 'fas fa-times-circle text-primary')])[2]");
  }

  get Required_CompanyBidmap_company_dropdown(): Locator {
    return this.page.locator("//label//span[contains(text(),\"$|NotSelectedCompanyName|\")]");
  }

  get Third_Company_Checkbox(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[4]");
  }

}