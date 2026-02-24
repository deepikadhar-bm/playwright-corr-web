import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Company Name
 * Elements: 1
 */
export class CompanyNamePage {
  constructor(private page: Page) {}

  get Selected_Company_NameCustomer_Permissions(): Locator {
    return this.page.locator("//td[@data-title=\"Company Name\" and text()=\" @|CompanyName(CustomerPermissions)| \"]");
  }

}