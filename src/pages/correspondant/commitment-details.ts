import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Commitment details
 * Elements: 8
 */
export class CommitmentDetailsPage {
  constructor(private page: Page) {}

  get Bid_ReqID_TextPrice_Offered_Details(): Locator {
    return this.page.locator("//div[text()=\"Bid Req. ID\"]");
  }

  get Chase_Loan_NumberCommitments_Details(): Locator {
    return this.page.locator("//td[@data-title=\"Chase Loan#\"]");
  }

  get Checked_Loan_Numbercommitments_new(): Locator {
    return this.page.locator("//button[contains(text(),\"$|CommittedCorrLoan|\")]/../../following-sibling::td[@data-title=\"Loan Amount\"]");
  }

  get Company_Name_Details_Commitments(): Locator {
    return this.page.locator("//div[text()=\"Customer\" or text()=\"Company\"]//following-sibling::h5");
  }

  get First_Comm_Date_Commiment_list(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Committed Date:\")]");
  }

  get First_Corr_Loan_Numbercommitments(): Locator {
    return this.page.locator("//td[@data-title=\"Corr. Loan#\"]//button[1]");
  }

  get First_Locked_Corr_Loan_Commitments(): Locator {
    return this.page.locator("(//td[@data-title=\"Corr. Loan#\"][1]//button)[1]");
  }

  get First_Locked_Loan_NumCommitments_Details(): Locator {
    return this.page.locator("(//span[contains(@class,\"lock-icon\")]/../..//td[@data-title='Corr. Loan#']//button)[1]");
  }

}