import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Price Offered.
 * Elements: 2
 */
export class PriceOffered2Page {
  constructor(private page: Page) {}

  get Check_Loan_NumStandard(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedLoanNumStandard|\"]/ancestor::tr//input[@type=\"checkbox\"]");
  }

  get Commited_Loan_Locked_Icon(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedLoanNumStandard|\"]//ancestor::tr//span[@aria-label=\"Committed loan\"]");
  }

}