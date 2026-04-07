import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CommitmentDetailsPage } from '../../../src/pages/correspondant/commitment-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';


const TC_ID = 'REG_TS02_TC01';
const TC_TITLE = 'Verify the Bid details in the commitment List screen summary';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let commitmentDetailsPage: CommitmentDetailsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const crederntials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestsPage = new BidRequestsPage(page);
    commitmentDetailsPage = new CommitmentDetailsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });
  const profileName = 'CommitmentList';
  const profile = testDataManager.getProfileByName(profileName);
  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    if (profile && profile.data) {
      const BidReqId = profile.data[0]['RequestIDFromPRE_PR_1-1'];
      log.info("Bid ID from TDP:" + BidReqId);
      vars["BidReqId"] = BidReqId;
    }
    vars["Username"] = crederntials.username;
    vars["Password"] = crederntials.password;
    log.tcStart(TC_ID, TC_TITLE);
    try {
      log.step('Login to corr application');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to corr application successful');
      } catch (e) {
        log.stepFail(page, 'Failed to login corr application');
        throw e;
      }
      log.step('Navigating to price offered details screen and store the required bid request id details');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.type(vars["BidReqId"]);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        expect(await spinnerPage.Spinner).not.toBeVisible();
        await page.waitForTimeout(2000);
        await priceOfferedPage.BidRequestIDPrice_Offered_New(vars["BidReqId"]).click();

        vars["BidReqIdPriceOfferedDetails"] = await priceOfferedPage.BidRequestIDTextDetails.textContent() || '';
        vars["ExecutionTypePriceOfferedDetails"] = await priceOfferedPage.Execution_TypeDetails.textContent() || '';
        vars["CCodeInPriceOfferedDetails"] = await priceOfferedPage.CCode_In_UI.textContent() || '';
        vars["CompanyNamePriceOfferedDetails"] = await commitmentDetailsPage.Company_Name_Details_Commitments.textContent() || '';
        vars["ProductPriceOfferedDetails"] = await priceOfferedPage.Product_NameDetails.textContent() || '';
        vars["CouponPriceOffereddetails"] = await priceOfferedPage.Ref_Sec_CouponDetails.textContent() || '';
        vars["CurrentMarketPriceOfferedDetails"] = await priceOfferedPage.Current_Market_ValueDetails_Screen.first().textContent() || '';
        vars["MinMaxThresholdPriceOfferedDetails"] = await priceOfferedPage.MinMax_ThresholdDetails.textContent() || '';
        log.stepPass('Successfully stored the required details of particular bid request id in price offered screen');
      } catch (e) {
        log.stepFail(page, 'Failed to store the details of particular bid request id in price offered screen');
        throw e;
      }
      log.step('Navigating to commitment open list tab and store the required details');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await commitmentListPage.Commitment_List_Text.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Commitment_List_Text).toBeVisible();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.type(vars["BidReqId"]);
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Dropdown_Commitment_ID_Bid_Request_ID.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForTimeout(4000);
        await priceOfferedPage.Commitment_IDCommitment_List_Page_New(vars["BidReqId"]).first().click();
        vars["BidReqIdCommitmentListDetails"] = await priceOfferedPage.BidRequestIDTextDetails.textContent() || '';
        vars["ExecutionTypeCommitmentListDetails"] = await priceOfferedPage.Execution_TypeDetails.textContent() || '';
        vars["CCodeInCommitmentListDetails"] = await priceOfferedPage.CCode_In_UI.textContent() || '';
        vars["CompanyNameCommitmentListDetails"] = await commitmentDetailsPage.Company_Name_Details_Commitments.textContent() || '';
        vars["ProductCommitmentListDetails"] = await priceOfferedPage.Product_NameDetails.textContent() || '';
        vars["CouponCommitmentListdetails"] = await priceOfferedPage.Ref_Sec_CouponDetails.textContent() || '';
        vars["CurrentMarketCommitmentListDetails"] = await priceOfferedPage.Current_Market_ValueDetails_Screen.first().textContent() || '';
        vars["MinMaxThresholdCommitmentListDetails"] = await priceOfferedPage.MinMax_ThresholdDetails.textContent() || '';
        log.stepPass('Successfully stored the required details in commitment list details screen');
      } catch (e) {
        log.stepFail(page, 'Failed to stored the required details in commitment list details screen');
        throw e;
      }
      log.step('compare the price offred details with commiment details');
      try {
        expect(Methods.verifyString(vars["BidReqIdPriceOfferedDetails"], "equals", vars["BidReqIdCommitmentListDetails"]));
        expect(Methods.verifyString(vars["ExecutionTypePriceOfferedDetails"], "equals", vars["ExecutionTypeCommitmentListDetails"]));
        expect(Methods.verifyString(vars["CCodeInPriceOfferedDetails"], "equals", vars["CCodeInCommitmentListDetails"]));
        expect(Methods.verifyString(vars["CompanyNamePriceOfferedDetails"], "equals", vars["CompanyNameCommitmentListDetails"]));
        expect(Methods.verifyString(vars["ProductPriceOfferedDetails"], "equals", vars["ProductCommitmentListDetails"]));
        expect(Methods.verifyString(vars["MinMaxThresholdPriceOfferedDetails"], "equals", vars["MinMaxThresholdCommitmentListDetails"]));
        expect(Methods.verifyString(vars["CouponPriceOffereddetails"], "equals", vars["CouponCommitmentListdetails"]));
        log.stepPass('Successfully verified the both details are matching');
      } catch (e) {
        log.stepFail(page, 'Failed to verify the bid request id details');
        throw e;
      }
      log.tcEnd('PASS');
    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});
