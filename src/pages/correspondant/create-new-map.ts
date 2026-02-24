import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Create New Map
 * Elements: 7
 */
export class CreateNewMapPage {
  constructor(private page: Page) {}

  get Active_Status(): Locator {
    return this.page.locator("//button[normalize-space(text())='$|EditedMapName|']//..//..//span[text()='ACTIVE']");
  }

  get Company_Dropdown(): Locator {
    return this.page.locator("//button[@id=\"multiSelectDropDown\"]");
  }

  get First_Company_Name(): Locator {
    return this.page.locator("(//label[text()=\"Select Company/s\"]/..//div[@class=\"pill rounded-pill relative\"]//span)[1]");
  }

  get Search_Input_Box(): Locator {
    return this.page.locator("//input[@placeholder=\"Search\"]");
  }

  get Selected_Company_Name(): Locator {
    return this.page.locator("//div[@class=\"pill rounded-pill relative\"]");
  }

  get Selected_Company_Name1(): Locator {
    return this.page.locator("//span[text()='$|Selected Company|' and @placement=\"bottom\"]");
  }

  get Upload_File_Input_Box(): Locator {
    return this.page.locator("(//input[@type=\"file\"])[1]/..");
  }

}