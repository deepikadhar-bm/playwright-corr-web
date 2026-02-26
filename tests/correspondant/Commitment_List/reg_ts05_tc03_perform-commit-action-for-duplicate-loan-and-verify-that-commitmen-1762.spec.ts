// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS05_TC03_Perform commit action for duplicate loan and verify that commitment should be created and no loans should be displayed and that commitment record should not be dispalyed on list screen b', async ({ page }) => {
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
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.click();
    vars["BidReqIdPriceOffered"] = testData["RequestIdFrom5-1"];
    vars["BidReqIdCommitmentList"] = testData["RequestIdFrom5-1"];
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdPriceOffered"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Bid_Req_IDStandard.click();
    await priceOfferedPage.All_Loans_PriceofferedPage.click();
    vars["CommittedLoanNumber"] = await priceOfferedPage.Committed_Loan.textContent() || '';
    await expect(priceOfferedPage.Committed_Loan_icon).toBeVisible();
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
    await priceOfferedPage.BackTo_PriceofferedPage.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Bid_Req_IDChase_Direct.click();
    await priceOfferedPage.Select_Loan_which_is_committed_in_Chase_Direct.waitFor({ state: 'visible' });
    await priceOfferedPage.Select_Loan_which_is_committed_in_Chase_Direct.check();
    await priceOfferedPage.Get_Price_Button.waitFor({ state: 'visible' });
    await priceOfferedPage.Get_Price_Button.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    await correspondentPortalPage.Okay_Button1.waitFor({ state: 'visible' });
    vars["CommitmentID"] = await priceOfferedPage.Commitment_IdPrice_Offered.textContent() || '';
    await correspondentPortalPage.Okay_Button1.click();
    await priceOfferedPage.All_Loans_Tabprice_offered_screen.waitFor({ state: 'visible' });
    await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
    await page.waitForLoadState('networkidle');
    await expect(priceOfferedPage.Committed_Loan_icon).toBeVisible();
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["CommitmentID"]);
    await expect(priceOfferedPage.Commitment_IdCommitment_List_Screen).toBeVisible();
    await commitmentListPage.Search_Cancel_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqIdCommitmentList"]);
    await priceOfferedPage.Dropdown_Commitment_ID_Bid_Request_ID.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Commitment_IDChase_Direct.click();
    await expect(page.getByText(vars["CommitmentID"])).not.toBeVisible();
    await commitmentListPage.Total_LoansCommitment_List.click();
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.waitFor({ state: 'visible' });
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await expect(commitmentListPage.Commitment_IdAdd_To_Commit_Dropdown).toBeVisible();
    vars["CommitmentOredrCommitmentList"] = await commitmentListPage.Commitment_OrderAdd_To_Commit_Dropdown.textContent() || '';
    vars["CommitmentOredrCommitmentList"] = String(vars["CommitmentOredrCommitmentList"]).slice(-1);
    expect(String(vars["CommitmentOredrCommitmentList"])).toBe("2");
    vars["OpenAuthLimit"] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
    vars["OpenAuthLimitCommitmentList"] = String('').split("(")["0"] || '';
    vars["OpenAuthLimitPercentageCommitmentList"] = String('').split("(")["1"] || '';
    vars["OpenAuthLimitPercentageCommitmentList"] = String(vars["OpenAuthLimitPercentageCommitmentList"]).replace(/\)%/g, '');
    vars["AuthLimitCommitmentList"] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
    vars["LastCommittedBidCommitmentList"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    vars["LastCommittedBidCommitmentList"] = String('').split("|")["0"] || '';
    vars["LastCommittedBidCommitmentList"] = String(vars["LastCommittedBidCommitmentList"]).trim();
    vars["LastCommittedBidLoanAmountCommitmentList"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
    vars["LastCommittedBidLoanAmountCommitmentList"] = String(vars["LastCommittedBidLoanAmountCommitmentList"]).substring(3);
    expect(String(vars["OpenAuthLimitStandard"])).toBe(vars["OpenAuthLimitCommitmentList"]);
    expect(String(vars["OpenAuthLimitPercentageStandard"])).toBe(vars["OpenAuthLimitPercentageCommitmentList"]);
    expect(String(vars["AuthLimitStandard"])).toBe(vars["AuthLimitCommitmentList"]);
    expect(String(vars["LastCommitedBidStandard"])).toBe(vars["LastCommittedBidCommitmentList"]);
    expect(String(vars["LastCommittedBidLoanAmountStandard"])).toBe(vars["LastCommittedBidLoanAmountCommitmentList"]);
  });
});
