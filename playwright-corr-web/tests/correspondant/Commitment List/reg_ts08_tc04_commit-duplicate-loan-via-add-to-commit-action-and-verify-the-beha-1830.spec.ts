// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentDetailsPage } from '../../../src/pages/correspondant/commitment-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let commitmentDetailsPage: CommitmentDetailsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentDetailsPage = new CommitmentDetailsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS08_TC04_Commit duplicate loan via add to commit action and verify the behaviour', async ({ page }) => {
    const testData: Record<string, string> = {
  "RequestIdFrom5-1": "876YA587E147",
  "Requestidfrom4-2": "873O84593BB5",
  "RequestIdfrom6-1.1": "57HK54C5AE2A",
  "RequestIDfrom14-1": "876U855F6483",
  "CommitmentIdfrom8-8": "87JU2DDD",
  "RequestIdFrom5-5": "87CKA7D37EB6",
  "RequestIdFrom6-4": "87MWF9C278BC",
  "RequestIDFromPRE_PR_1-1": "87YTD25F4356",
  "CommitmentIDfrom8-10": "87JU2DDD",
  "RequestIdFrom8-8": "87BI08DD054F"
}; // Profile: "Commitment List", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.click();
    vars["BidReqId"] = testData["RequestIdFrom5-1"];
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await commitmentListPage.Commitment_IDStandard.click();
    await commitmentListPage.Total_LoansCommitment_List.click();
    vars["CommittedCorrLoan"] = await commitmentListPage.Committed_Loan_NumStandard_Commitment_List.textContent() || '';
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
    await stepGroups.stepGroup_Storing_Required_Loan_Number_Details(page, vars);
    await priceOfferedPage.Back_To_Commitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Commitment_IDChase_Direct.click();
    await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
    vars["NoOfLoansBeforeCommit"] = await commitmentListPage.No_ofLoansCommitment_List_Details.textContent() || '';
    vars["CommitID"] = await priceOfferedPage.Commit_IDCommitment_List.textContent() || '';
    await commitmentListPage.Total_LoansCommitment_List.click();
    await commitmentListPage.Check_Duplicate_Loan_Num.waitFor({ state: 'visible' });
    await commitmentListPage.Check_Duplicate_Loan_Num.check();
    vars["LoanCountScreen"] = String(await priceOfferedPage.Checked_Row.count());
    vars["SelectedLoanValueScreen"] = await commitmentDetailsPage.Checked_Loan_Numbercommitments_new.textContent() || '';
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await correspondentPortalPage.Commitment_OrderCommitment_List.click();
    vars["BidRequestIDPopup"] = await priceOfferedPage.BidRequestIDPopupDetails.textContent() || '';
    vars["LoanValuePopup"] = await priceOfferedPage.Loan_ValuePopup.textContent() || '';
    vars["SelectedLoansCountPopup"] = await priceOfferedPage.Selected_LoansPopup.textContent() || '';
    expect(String(vars["BidReqId"])).toBe(vars["BidRequestIDPopup"]);
    expect(String(vars["SelectedLoanValueScreen"])).toBe(vars["LoanValuePopup"]);
    expect(String(vars["LoanCountScreen"])).toBe(vars["SelectedLoansCountPopup"]);
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    vars["space"] = "key_blank";
    vars["CommitmentUpdateText"] = "Commitment" + vars["space"] + vars["CommitID"] + vars["space"] + "is" + vars["space"] + "updated.";
    await expect(commitmentListPage.Commitment_UpdatePopup).toContainText(vars["CommitmentUpdateText"]);
    await expect(priceOfferedPage.Loans_added_successfullyPopup).toContainText("Loans failed to be added to commitment");
    vars["LoanDuplicateText"] = "Loan" + vars["space"] + vars["CommittedCorrLoan"] + vars["space"] + "is a Duplicate loan. It is already committed";
    await expect(priceOfferedPage.Commit_Loan_TextPopup).toContainText(vars["LoanDuplicateText"]);
    await priceOfferedPage.Okay_ButtonPopup.click();
    await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
    await commitmentListPage.Total_Committed_Loans_Tab.click();
    await expect(priceOfferedPage.Committed_CorrLoan).toBeVisible();
    vars["NoOfLoansAfterCommit"] = await commitmentListPage.No_ofLoansCommitment_List_Details.textContent() || '';
    expect(String(vars["NoOfLoansBeforeCommit"])).toBe(vars["NoOfLoansAfterCommit"]);
    await commitmentListPage.Total_LoansCommitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Committed_CorrLoan).toBeVisible();
    await stepGroups.stepGroup_Verifying_Loan_Details(page, vars);
    await correspondentPortalPage.Open_Auth_Limit_Total_Loan.scrollIntoViewIfNeeded();
    vars["OpenAuthLimit"] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
    vars["OpenAuthLimitChaseDirect"] = String('').split("(")["0"] || '';
    vars["OpenAuthLimitPercentageChaseDirect"] = String('').split("(")["1"] || '';
    vars["OpenAuthLimitPercentageChaseDirect"] = String(vars["OpenAuthLimitPercentageChaseDirect"]).replace(/\)%/g, '');
    vars["AuthLimitChaseDirect"] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
    vars["LastCommittedBidChaseDirect"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    vars["LastCommittedBidChaseDirect"] = String('').split("|")["0"] || '';
    vars["LastCommittedBidChaseDirect"] = String(vars["LastCommittedBidChaseDirect"]).trim();
    vars["LastCommittedBidLoanAmountChaseDirect"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
    vars["LastCommittedBidLoanAmountChaseDirect"] = String(vars["LastCommittedBidLoanAmountChaseDirect"]).substring(3);
    expect(String(vars["OpenAuthLimitStandard"])).toBe(vars["OpenAuthLimitChaseDirect"]);
    expect(String(vars["OpenAuthLimitPercentageStandard"])).toBe(vars["OpenAuthLimitPercentageChaseDirect"]);
    expect(String(vars["AuthLimitStandard"])).toBe(vars["AuthLimitChaseDirect"]);
    expect(String(vars["LastCommitedBidStandard"])).toBe(vars["LastCommittedBidChaseDirect"]);
    expect(String(vars["LastCommittedBidLoanAmountStandard"])).toBe(vars["LastCommittedBidLoanAmountChaseDirect"]);
  });
});
