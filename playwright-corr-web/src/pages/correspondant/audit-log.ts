import { Page, Locator } from '@playwright/test';

/**
 * Page Object: audit log
 * Elements: 4
 */
export class AuditLogPage {
  constructor(private page: Page) {}

  get Chase_Previous_Data_pop_up(): Locator {
    return this.page.locator("//td[@class=\"d2h-del d2h-change\"]//span[contains(text(),\"executionTypeFastPath\" )]");
  }

  get Company_Name_Previous_Data(): Locator {
    return this.page.locator("((//td[@class=\"d2h-del d2h-change\"]//span[contains(text(),\"name\" )])//del)[1]");
  }

  get Internal_User_Name_Previous_Data(): Locator {
    return this.page.locator("(//td[@class=\"d2h-del d2h-change\"]//span[contains(text(),\"internalUser\" )])//del");
  }

  get Standard_Previous_Datapop_up(): Locator {
    return this.page.locator("//td[@class=\"d2h-del d2h-change\"]//span[contains(text(),\"dynamicPricing\" )]");
  }

}