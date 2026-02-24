import { Page, Locator } from '@playwright/test';

/**
 * Page Object: BACK Button
 * Elements: 5
 */
export class BackButtonPage {
  constructor(private page: Page) {}

  get Add_Conditions(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Add Conditions\"]]");
  }

  get BACK_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"BACK\"]]");
  }

  get Bid_Enumerated_Tape_Values_for_DTI(): Locator {
    return this.page.locator("(//button[contains(@class, 'dropdown-item') and contains(@class, 'd-flex')])[184]");
  }

  get Company_Added(): Locator {
    return this.page.locator("(//button[@class=\"more-clients custom-bg-primary text-white fs-xs border-0\"])[1]");
  }

  get Delete_Draft(): Locator {
    return this.page.locator("//div[contains(@class, 'modal-header')]");
  }

}