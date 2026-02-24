import { Page, Locator } from '@playwright/test';

/**
 * Page Object: American Pacific
 * Elements: 5
 */
export class AmericanPacificPage {
  constructor(private page: Page) {}

  get Status(): Locator {
    return this.page.locator("(//td[@data-title=\"Status\"])[1]");
  }

  get Apply_selected_Number(): Locator {
    return this.page.locator("//span[@class=\"counter bg-white text-primary mx-2 text-center fw-semibold small\"]");
  }

  get header_anme(): Locator {
    return this.page.locator("//div[@class=\"gap-2 header-grid-layout unidentified-header\"]");
  }

  get Select_Bid_Sample_Field_Name(): Locator {
    return this.page.locator("(//div[@class=\"gap-2 header-grid-layout\"])[7]");
  }

  get Select_First_Available_Company(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[23]");
  }

}