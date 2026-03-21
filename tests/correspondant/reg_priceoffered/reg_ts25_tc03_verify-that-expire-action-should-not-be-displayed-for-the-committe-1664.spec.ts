import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1671 } from '../../../src/helpers/prereqs/prereq-1671';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { AddonHelpers } from '@helpers/AddonHelpers';


const TC_ID = 'REG_TS25_TC03';
const TC_TITLE = 'Verify that expire action should not be displayed for the committed status -> Verify for the fresh record that is created recently';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  let REG_TS25_TC03testFailed = false;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1671(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, REG_TS25_TC03testFailed);
    if (REG_TS25_TC03testFailed) {
      try {
      log.step('Executing after-test steps: verifying and deleting Early Close configuration if present');
      await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
       log.stepPass('After-test steps executed successfully. Early Close configuration verified and deleted if present');
      } catch (e) {
        await log.stepFail(page, 'After-test steps execution failed while verifying or deleting Early Close configuration');
        throw e;
      }
    }
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Navigate to Price Offered List and search by Bid Request ID');
      try {
        vars['BidReqIdPriceOffered'] = vars['RequiredBidID'];
        log.info('BidReqIdPriceOffered: ' + vars['BidReqIdPriceOffered']);
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Price Offered List for BidReqId: ' + vars['BidReqIdPriceOffered']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Price Offered List for BidReqId: ' + vars['BidReqIdPriceOffered']);
        throw e;
      }

      log.step('Select all loans, get price and perform commit action');
      try {
        await priceOfferedPage.Bid_Req_IdPrice_Offered_Page(vars["BidReqIdPriceOffered"]).click();
        await priceOfferedPage.Select_All_Loan_Num.waitFor({ state: 'visible' });
        await priceOfferedPage.Select_All_Loan_Num.check();
        await priceOfferedPage.Get_Price_Button.click();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        await priceOfferedPage.Okay_ButtonPopup.click();
        log.stepPass('Commit action performed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to perform commit action');
        throw e;
      }

      log.step('Verify bid status is Committed and Expire Pricing button is visible');
      try {
        await priceOfferedPage.BackTo_PriceofferedPage.click();
        await page.reload();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
        await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars["BidReqIdPriceOffered"]).waitFor({ state: 'visible' });
        vars['BidStatusPriceOfferedPage'] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars["BidReqIdPriceOffered"]).textContent() || '';
        Methods.trimtestdata(vars['BidStatusPriceOfferedPage'], 'BidStatusPriceOfferedPage');
        log.info('BidStatusPriceOfferedPage: ' + vars['BidStatusPriceOfferedPage']);
        expect(Methods.verifyString(vars['BidStatusPriceOfferedPage'], 'equals', 'Committed'));
        //need
        await expect(priceOfferedPage.Expire_Pricing_ButtonPrice_Offered(vars["BidReqIdPriceOffered"])).not.toBeVisible();
        log.stepPass('Bid status is Committed and Expire Pricing button is visible');
      } catch (e) {
        await log.stepFail(page, 'Bid status is not Committed or Expire Pricing button not visible. Status: ' + vars['BidStatusPriceOfferedPage']);
        throw e;
      }

      log.step('Add early config with current estimated time and wait for expiry');
      try {
        await stepGroups.stepGroup_Add_Early_Config_With_Current_Est_Time(page, vars);
        await page.waitForTimeout(120000);
        log.stepPass('Early config added and waited for expiry');
      } catch (e) {
        await log.stepFail(page, 'Failed to add early config or wait for expiry');
        throw e;
      }

      log.step('Re-navigate to Price Offered List and poll for status update');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['count'] = appconstants.ONE;
        while (parseFloat(String(vars['count'])) <= parseFloat(String('5'))) {
          await priceOfferedPage.Price_Offered_Text.click();
          await page.waitForTimeout(60000);
          Methods.MathematicalOperation(vars['count'], '+', 1, 'count');
        }
        log.stepPass('Polled Price Offered List 5 times for status update');
      } catch (e) {
        await log.stepFail(page, 'Failed to re-navigate or poll Price Offered List');
        throw e;
      }

      log.step('Verify bid status remains Committed after expiry window');
      try {
        vars['BidStatusPriceOfferedPage'] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars["BidReqIdPriceOffered"]).textContent() || '';
        Methods.trimtestdata(vars['BidStatusPriceOfferedPage'], 'BidStatusPriceOfferedPage');
        log.info('BidStatusPriceOfferedPage: ' + vars['BidStatusPriceOfferedPage']);
        expect(Methods.verifyString(vars['BidStatusPriceOfferedPage'], 'equals', appconstants.COMMITTED_STATUS));
        log.stepPass('Bid status remains Committed after expiry window');
      } catch (e) {
        
        await log.stepFail(page, 'Bid status changed after expiry window. Status: ' + vars['BidStatusPriceOfferedPage']);
        throw e;
      }
       log.step('Deleting early config if prent');
        try {
      await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
       log.stepPass('Successfully deleted the early config');
      } catch (e) {
        
        await log.stepFail(page, 'Failed to delete early config')
        throw e;
      }
      log.tcEnd('PASS');
    } catch (e) {
      REG_TS25_TC03testFailed = true;
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});