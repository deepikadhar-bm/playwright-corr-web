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
import { runPrereq_1766 } from '../../../src/helpers/prereqs/prereq-1766';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1766(page, vars);
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS05_TC05_Perform commit action for Company A and verify that any related bid. from that company record should display the latest value', async ({ page }) => {

    await priceOfferedPage.Back_To_Commitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Clear_all_ButtonCommitment_List.click();
    vars["BidReqId1"] = vars["RequestIDDetails"];
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId1"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.First_Commitment_IDCommitment_List.click();
    await correspondentPortalPage.Open_Auth_Limit_Total_Loan.waitFor({ state: 'visible' });
    vars["OpenAuthLimitBidReq1"] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
    vars["AuthLimitBidReq1"] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
    vars["LastCommitedBidBidReq1"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    await priceOfferedPage.Back_To_Commitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Search_Cancel_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_CompanyCCode_Dropdown1.waitFor({ state: 'visible' });
    await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
    await priceOfferedPage.Select_Company_Search_Field.fill(vars["CompanyName"]);
    await commitmentListPage.Check_the_Req_Company_Name.check();
    await correspondentPortalPage.Apply_Selected.waitFor({ state: 'visible' });
    await correspondentPortalPage.Apply_Selected.click();
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    vars["BidReqId2"] = await commitmentListPage.BidReqId2Commitment_List_Screen.textContent() || '';
    vars["BidReqId2"] = String(vars["BidReqId2"]).trim();
    await priceOfferedPage.Commitment_ID2Commitment_List_Page.click();
    await correspondentPortalPage.Open_Auth_Limit_Total_Loan.waitFor({ state: 'visible' });
    vars["OpenAuthLimitBidReqId2"] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
    vars["AuthLimitBidReqId2"] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
    vars["LastCommitedBidBidReqId2"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    expect(String(vars["OpenAuthLimitBidReq1"])).toBe(vars["OpenAuthLimitBidReqId2"]);
    expect(String(vars["AuthLimitBidReq1"])).toBe(vars["AuthLimitBidReqId2"]);
    expect(String(vars["LastCommitedBidBidReq1"])).toBe(vars["LastCommitedBidBidReqId2"]);
    // Write to test data profile: "RequestIdFrom5-5" = vars["BidReqId1"]
  });
});
