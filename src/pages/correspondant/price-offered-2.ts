import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Price Offered.
 * Elements: 2
 */
export class PriceOffered2Page {
  constructor(private page: Page) {}

  Check_Loan_NumStandard(CommittedLoanNumStandard:string): Locator {
    return this.page.locator(`//button[text()=\"${CommittedLoanNumStandard}\"]/ancestor::tr//input[@type=\"checkbox\"]`);
  }

  Commited_Loan_Locked_Icon(CommittedLoanNumStandard:string): Locator {
    return this.page.locator(`//button[text()=\"${CommittedLoanNumStandard}\"]//ancestor::tr//span[@aria-label=\"Committed loan\"]`);
  }

}