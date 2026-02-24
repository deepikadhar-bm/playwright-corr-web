// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1389 } from '../../../src/helpers/prereqs/prereq-1389';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1389(page, vars);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS10_TC02_Try to commit a duplicate loan and Verify the bid, loan value, and selected loan count displayed in the Commit Selected Loans popup. After a successful commitment, verify that a commitme', async ({ page }) => {

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["RequestIDDetails"]);
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Enter');
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Bid_Req_IDChase_Direct.click();
    if (true) /* Element Committed Loan is not visible */ {
      await priceOfferedPage.Check_UncommittedLoanNum1.check();
      await correspondentPortalPage.Get_Price_Button.click();
      await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
      await priceOfferedPage.Commit_Selected_1_Dropdown.click();
      await priceOfferedPage.Yes_Commit_Buttonpopup_price_offered_screen.waitFor({ state: 'visible' });
      await priceOfferedPage.Yes_Commit_Buttonpopup_price_offered_screen.click();
      await priceOfferedPage.Yes_Commit_Buttonpopup_price_offered_screen.waitFor({ state: 'hidden' });
      await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.waitFor({ state: 'visible' });
      await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.click();
    }
    await priceOfferedPage.All_Loans_PriceofferedPage.click();
    vars["CommittedLoanNumber"] = await priceOfferedPage.Committed_Loan.textContent() || '';
    await expect(priceOfferedPage.Committed_Loan_icon).toBeVisible();
    vars["OpenAuthLimit"] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
    vars["OpenAuthLimitChaseDirect"] = String('').split("(")["0"] || '';
    vars["OpenAuthLimitPercentageChaseDirect"] = String('').split("(")["1"] || '';
    vars["OpenAuthLimitPercentageChaseDirect"] = String(vars["OpenAuthLimitPercentageChaseDirect"]).replace(/\)%/g, '');
    vars["AuthLimitChaseDirect"] = await priceOfferedPage.Auth_Limit_All_Loans.textContent() || '';
    vars["LastCommittedBidChaseDirect"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    vars["LastCommittedBidChaseDirect"] = String('').split("|")["0"] || '';
    vars["LastCommittedBidChaseDirect"] = String(vars["LastCommittedBidChaseDirect"]).trim();
    vars["LastCommittedBidLoanAmountChaseDirect"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
    vars["LastCommittedBidLoanAmountChaseDirect"] = String(vars["LastCommittedBidLoanAmountChaseDirect"]).substring(3);
    await priceOfferedPage.BackTo_PriceofferedPage.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Bid_Req_IDStandard.click();
    await priceOfferedPage.Select_Loan_which_is_committed_in_Chase_Direct.waitFor({ state: 'visible' });
    await priceOfferedPage.Select_Loan_which_is_committed_in_Chase_Direct.check();
    vars["LoanCount(Screen)"] = String(await priceOfferedPage.Checked_Row.count());
    vars["LoanAmountValue(Screen)"] = await priceOfferedPage.Count_of_Selected_Loans.textContent() || '';
    await correspondentPortalPage.Get_Price_Button.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    vars["BidRequestIDPopup"] = await priceOfferedPage.BidRequestIDPopupDetails.textContent() || '';
    vars["PriceofferedLoanvalue(Popup)"] = await priceOfferedPage.Price_Offered_Loan_Value.textContent() || '';
    vars["CountofSelectedLoans(Popup)"] = await priceOfferedPage.Selected_Loans_Number.textContent() || '';
    expect(String(vars["RequestIDDetails"])).toBe(vars["BidRequestIDPopup"]);
    expect(String(vars["LoanAmountValue(Screen)"])).toBe(vars["PriceofferedLoanvalue(Popup)"]);
    expect(String(vars["LoanCount(Screen)"])).toBe(vars["CountofSelectedLoans(Popup)"]);
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    await correspondentPortalPage.Okay_Button1.waitFor({ state: 'visible' });
    vars["CommitmentUpdatedNumber"] = await priceOfferedPage.Commitment_ID.textContent() || '';
    vars["CommitmentUpdatedValue"] = String(vars["CommitmentUpdatedNumber"]).length.toString();
    expect(String(vars["CommitmentUpdatedValue"])).toBe("8");
    vars["Loansfailed(Popup)"] = await priceOfferedPage.Loans_added_successfullyPopup.textContent() || '';
    expect(String(vars["Loansfailed(Popup)"])).toBe("Loans failed to be added to commitment");
    vars["space"] = "key_blank";
    vars["DuplicateLoan(Popup)"] = "Loan" + vars["space"] + vars["CommittedLoanNumber"] + vars["space"] + "is a Duplicate loan. It is already committed";
    await expect(priceOfferedPage.Commit_Loan_TextPopup).toContainText(vars["DuplicateLoan(Popup)"]);
    await correspondentPortalPage.Okay_Button1.click();
    await priceOfferedPage.LockedCommitted_Loans.waitFor({ state: 'visible' });
    vars["OpenAuthLimit"] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
    vars["OpenAuthLimitStandard"] = String('').split("(")["0"] || '';
    vars["OpenAuthLimitPercentageStandard"] = String('').split("(")["1"] || '';
    vars["OpenAuthLimitPercentageStandard"] = String(vars["OpenAuthLimitPercentageStandard"]).replace(/\)%/g, '');
    vars["AuthLimitStandard"] = await priceOfferedPage.Auth_Limit_All_Loans.textContent() || '';
    vars["LastCommitedBidStandard"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    vars["LastCommitedBidStandard"] = String('').split("|")["0"] || '';
    vars["LastCommitedBidStandard"] = String(vars["LastCommitedBidStandard"]).trim();
    vars["LastCommittedBidLoanAmountStandard"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
    vars["LastCommittedBidLoanAmountStandard"] = String(vars["LastCommittedBidLoanAmountStandard"]).substring(3);
    await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
    await page.waitForLoadState('networkidle');
    await expect(priceOfferedPage.Committed_Loan_icon).toBeVisible();
    expect(String(vars["OpenAuthLimitStandard"])).toBe(vars["OpenAuthLimitChaseDirect"]);
    expect(String(vars["OpenAuthLimitPercentageStandard"])).toBe(vars["OpenAuthLimitPercentageChaseDirect"]);
    expect(String(vars["AuthLimitStandard"])).toBe(vars["AuthLimitChaseDirect"]);
    expect(String(vars["LastCommitedBidStandard"])).toBe(vars["LastCommittedBidChaseDirect"]);
    expect(String(vars["LastCommittedBidLoanAmountStandard"])).toBe(vars["LastCommittedBidLoanAmountChaseDirect"]);
    // Write to test data profile: "RequestIDfrom10-2" = vars["RequestIDDetails"]
  });
});
