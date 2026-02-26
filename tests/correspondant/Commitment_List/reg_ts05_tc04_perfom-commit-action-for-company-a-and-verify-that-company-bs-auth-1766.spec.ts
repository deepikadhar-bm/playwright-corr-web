// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS05_TC04_Perfom commit action for Company A and verify that Company B\\\'s auth limit is not impacted', async ({ page }) => {

    // [DISABLED] Login to CORR Portal
    // await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    // [DISABLED] Store test data1 in RequestIDDetails
    // vars["RequestIDDetails"] = "test data1";
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.click();
    vars["BidReqIdCompanyA"] = vars["RequestIDDetails"];
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["BidReqIdCompanyA"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["CompanyName"] = await priceOfferedPage.Company_NamePrice_Offered.textContent() || '';
    vars["CompanyName"] = String(vars["CompanyName"]).trim();
    await correspondentPortalPage.First_Bid_Request_ID.click();
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.waitFor({ state: 'visible' });
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.check();
    await priceOfferedPage.Get_Price_Button.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    await priceOfferedPage.Okay_ButtonPopup.click();
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqIdCompanyA"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.First_Commitment_IDCommitment_List.click();
    await correspondentPortalPage.Open_Auth_Limit_Total_Loan.waitFor({ state: 'visible' });
    vars["OpenAuthLimitCompanyA"] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
    vars["AuthLimitCompanyA"] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
    vars["LastCommittedBidCompanyA"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    await priceOfferedPage.Back_To_Commitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Search_Cancel_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_CompanyCCode_Dropdown1.waitFor({ state: 'visible' });
    await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
    await priceOfferedPage.Select_Company_Search_Field.fill("American");
    await priceOfferedPage.Freedom_Checkbox.check();
    await correspondentPortalPage.Apply_Selected.waitFor({ state: 'visible' });
    await correspondentPortalPage.Apply_Selected.click();
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["BidReqIdCompanyB"] = await commitmentListPage.First_Bid_Req_IDCommitment_List.textContent() || '';
    await commitmentListPage.First_Commitment_IDCommitment_List.click();
    await correspondentPortalPage.Open_Auth_Limit_Total_Loan.waitFor({ state: 'visible' });
    vars["OpenAuthLimitCompanyB"] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
    vars["AuthLimitCompanyB"] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
    vars["LastCommitedBidCompanyB"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    expect(String(vars["OpenAuthLimitCompanyA"])).toBe(vars["OpenAuthLimitCompanyB"]);
    expect(String(vars["AuthLimitCompanyA"])).toBe(vars["AuthLimitCompanyB"]);
    expect(String(vars["LastCommittedBidCompanyA"])).toBe(vars["LastCommitedBidCompanyB"]);
  });
});
