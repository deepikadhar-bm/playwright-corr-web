import { Page, Locator } from '@playwright/test';

/**
 * Page Object: price offered details
 * Elements: 9
 */
export class PriceOfferedDetailsPage {
  constructor(private page: Page) {}

  get First_Loan_NumberCommited_or_Uncommitted(): Locator {
    return this.page.locator("(//button[contains(@aria-label,\"View loan details\")])[1]");
  }

  get First_PQ_Button_Committed_or_Uncommited(): Locator {
    return this.page.locator("(//button[contains(@aria-label,\"Download PQ file\")])[1]");
  }

  get Individual_Mark_Adjust_ValueFresh_Loans(): Locator {
    return this.page.locator("(//*[contains(@aria-label,\"Select loan\")]/../..//td[@data-title=\"Mark Adj\"])[$|count|]");
  }

  get Locked_Loan_Num_Price_Offered_details(): Locator {
    return this.page.locator("//div[@aria-label=\"Locked loan\"]/../..//td[@data-title=\"Corr. Loan#\"]");
  }

  get Market_Adjust_Valuenew(): Locator {
    return this.page.locator("//td[@data-title=\"Mark Adj\"]");
  }

  get Reference_Security_PricePrice_Offered(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Reference security price\")]");
  }

  get Required_Loan_Check_boxprice_offered_details(): Locator {
    return this.page.locator("//td[@data-title=\"Corr. Loan#\"]//button[contains(@aria-label,\"View loan\") and not(contains(text(),\"$|CommittedLoanNumChaseDirect|\"))]/../../..//input[@type=\"checkbox\"]");
  }

  get Second_loan_Check_Box_price_offered_details(): Locator {
    return this.page.locator("//tr[2]//input[@type=\"checkbox\"]");
  }

  get Total_Loans_Count(): Locator {
    return this.page.locator("//td[@data-title=\"Corr. Loan#\"]");
  }

}