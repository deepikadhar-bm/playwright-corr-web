import { Page, Locator } from '@playwright/test';

/**
 * Page Object: commitments
 * Elements: 3
 */
export class CommitmentsPage {
  constructor(private page: Page) {}

  get Required_Date_Filters(): Locator {
    return this.page.locator("//div[@role=\"gridcell\" and @aria-label=\"$|DateFormatFilter|\"]");
  }

  get Select_month_Dropdownfilters(): Locator {
    return this.page.locator("//select[@aria-label=\"Select month\"]");
  }

  get Select_year_Dropdownfilters(): Locator {
    return this.page.locator("//select[@aria-label=\"Select year\"]");
  }

}