import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal........
 * Elements: 2
 */
export class CorrespondentPortal13Page {
  constructor(private page: Page) {}

  get Custome_Date(): Locator {
    return this.page.locator("//div[@class=\"ngb-dp-day ngb-dp-today\"]");
  }

  get First_Selected_Company_Checkbox(): Locator {
    return this.page.locator("//span[@class='pl-2'][contains(.,'$|Companyname|')]");
  }

}