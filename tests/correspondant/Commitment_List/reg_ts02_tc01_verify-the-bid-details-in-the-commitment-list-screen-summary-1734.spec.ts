// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CommitmentDetailsPage } from '../../../src/pages/correspondant/commitment-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let commitmentDetailsPage: CommitmentDetailsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestsPage = new BidRequestsPage(page);
    commitmentDetailsPage = new CommitmentDetailsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS02_TC01_Verify the Bid details in the commitment List screen summary', async ({ page }) => {
    const testData: Record<string, string> = {
  "RequestIDFromPRE_PR_1-1": "87YTD25F4356",
  "Requestidfrom4-2": "873O84593BB5",
  "RequestIdfrom6-1.1": "57HK54C5AE2A",
  "RequestIDfrom14-1": "876U855F6483",
  "CommitmentIdfrom8-8": "87JU2DDD",
  "RequestIdFrom5-1": "876YA587E147",
  "RequestIdFrom5-5": "87CKA7D37EB6",
  "RequestIdFrom6-4": "87MWF9C278BC",
  "CommitmentIDfrom8-10": "87JU2DDD",
  "RequestIdFrom8-8": "87BI08DD054F"
}; // Profile: "Commitment List", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    vars["BidReqId"] = testData["RequestIDFromPRE_PR_1-1"];
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqId"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidRequestIDPrice_Offered_New.click();
    vars["BidReqIdPriceOfferedDetails"] = await priceOfferedPage.BidRequestIDTextDetails.textContent() || '';
    vars["ExecutionTypePriceOfferedDetails"] = await priceOfferedPage.Execution_TypeDetails.textContent() || '';
    vars["CCodeInPriceOfferedDetails"] = await priceOfferedPage.CCode_In_UI.textContent() || '';
    vars["CompanyNamePriceOfferedDetails"] = await commitmentDetailsPage.Company_Name_Details_Commitments.textContent() || '';
    vars["ProductPriceOfferedDetails"] = await priceOfferedPage.Product_NameDetails.textContent() || '';
    vars["CouponPriceOffereddetails"] = await priceOfferedPage.Ref_Sec_CouponDetails.textContent() || '';
    vars["CurrentMarketPriceOfferedDetails"] = await priceOfferedPage.Current_Market_ValueDetails_Screen.textContent() || '';
    vars["MinMaxThresholdPriceOfferedDetails"] = await priceOfferedPage.MinMax_ThresholdDetails.textContent() || '';
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
    await priceOfferedPage.Dropdown_Commitment_ID_Bid_Request_ID.click();
    await priceOfferedPage.Commitment_IDCommitment_List_Page_New.click();
    vars["BidReqIdCommitmentListDetails"] = await priceOfferedPage.BidRequestIDTextDetails.textContent() || '';
    vars["ExecutionTypeCommitmentListDetails"] = await priceOfferedPage.Execution_TypeDetails.textContent() || '';
    vars["CCodeInCommitmentListDetails"] = await priceOfferedPage.CCode_In_UI.textContent() || '';
    vars["CompanyNameCommitmentListDetails"] = await commitmentDetailsPage.Company_Name_Details_Commitments.textContent() || '';
    vars["ProductCommitmentListDetails"] = await priceOfferedPage.Product_NameDetails.textContent() || '';
    vars["CouponCommitmentListdetails"] = await priceOfferedPage.Ref_Sec_CouponDetails.textContent() || '';
    vars["CurrentMarketCommitmentListDetails"] = await priceOfferedPage.Current_Market_ValueDetails_Screen.textContent() || '';
    vars["MinMaxThresholdCommitmentListDetails"] = await priceOfferedPage.MinMax_ThresholdDetails.textContent() || '';
    expect(String(vars["BidReqIdPriceOfferedDetails"])).toBe(vars["BidReqIdCommitmentListDetails"]);
    expect(String(vars["ExecutionTypePriceOfferedDetails"])).toBe(vars["ExecutionTypeCommitmentListDetails"]);
    expect(String(vars["CCodeInPriceOfferedDetails"])).toBe(vars["CCodeInCommitmentListDetails"]);
    expect(String(vars["CompanyNamePriceOfferedDetails"])).toBe(vars["CompanyNameCommitmentListDetails"]);
    expect(String(vars["ProductPriceOfferedDetails"])).toBe(vars["ProductCommitmentListDetails"]);
    expect(String(vars["MinMaxThresholdPriceOfferedDetails"])).toBe(vars["MinMaxThresholdCommitmentListDetails"]);
    expect(String(vars["CouponPriceOffereddetails"])).toBe(vars["CouponCommitmentListdetails"]);
  });
});
