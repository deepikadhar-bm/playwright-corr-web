// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidrequestCreationPage } from '../../../src/pages/correspondant/bidrequest-creation';
import { BidrequestPage } from '../../../src/pages/correspondant/bidrequest';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { UploadNewBidRequestButtonPage } from '../../../src/pages/correspondant/upload-new-bid-request-button';
import { runPrereq_896 } from '../../../src/helpers/prereqs/BidRequests/prereq-896';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';
import { CorrPortalPage } from '@pages/correspondant/CorrPortalPage';
import { testDataManager } from 'testdata/TestDataManager';
//import { SpinnerPage } from '@pages/correspondant';

const TC_ID = 'REG_TS01_TC10.1';
const TC_TITLE = 'Update the pricing return time values for today and verify that the same should be displayed in the dropdown list for today.';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidrequestCreationPage: BidrequestCreationPage;
  let bidrequestPage: BidrequestPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;
  let uploadNewBidRequestButtonPage: UploadNewBidRequestButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_896(page, vars);
    bidrequestCreationPage = new BidrequestCreationPage(page);
    bidrequestPage = new BidrequestPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
    uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);
  });

  test('REG_TS01_TC10.1_Update the pricing return time values for today and verify that the same should be displayed in the dropdown list for today.', async ({ page }) => {

    // ─── TC Start ────────────────────────────────────────────────────────
    log.tcStart(TC_ID, TC_TITLE);

    try {

      //"batch time": "",

      // ── Navigate to Bid Requests and open Upload New Bid Request ─────────
      log.step('Navigating to Bid Requests and opening Upload New Bid Request');
      try {
        await correspondentPortalPage.Bid_Requests.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText("Bid Requests").first()).toBeVisible();
        log.info('Bid Requests page is visible');

        await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText("Bid Request Details").first()).toBeVisible();
        log.info('Bid Request Details page is visible');

        log.stepPass('Navigation to Bid Request Details successful');
      } catch (e) {
        await log.stepFail(page, 'Navigation to Bid Request Details failed');
        throw e;
      }

      // ── Open pricing return time dropdown and count options ───────────────
      log.step('Opening pricing return time dropdown and counting options');
      try {
        vars["space"] = "Key_blank";
        vars["BatchNum"] = "1";
        //await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click();
        await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.hover();
        await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click({ force: true });

        vars["OptionsCountInPricingDropdown"] = String(await bidrequestPage.OptionsCountInPricingDropdown.count());
        log.info(`Options count in pricing dropdown: ${vars["OptionsCountInPricingDropdown"]}`);

        log.stepPass('Pricing return time dropdown opened and options counted successfully');
      } catch (e) {
        await log.stepFail(page, 'Opening pricing return time dropdown or counting options failed');
        throw e;
      }

      // ── Verify each dropdown option against TDP batch time per iteration ──
      log.step('Verifying each dropdown option against TDP batch time');
      try {
        //while (parseFloat(String(vars["BatchNum"])) <= parseFloat(String(vars["OptionsCountInPricingDropdown"]))) {
          for (let dataIdx = parseInt(vars["BatchNum"]); dataIdx <= parseInt(vars["OptionsCountInPricingDropdown"]); dataIdx++) {
            // if (!await chaseFieldNamePage.Option_in_PricingReturn_Dropdown(vars["BatchTime"]).isVisible()) {
            //   await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.hover();
            //   await bidrequestCreationPage.Pricing_ReturnTime_Dropdown.click({ force: true });
            // }
            //await expect(correspondentPortalPage.Pricing_Return_Time.locator(`option[value="${vars["BatchTime"]}"]`)).toBeAttached();
            //await expect(chaseFieldNamePage.Option_in_PricingReturn_Dropdown(vars["BatchTime"])).toBeVisible();
            // Read 'batch time' per iteration from TDP 'bulk batch to bid request'
            // dataIdx is 1-based → data[dataIdx - 1] matches exactly what the prereq wrote via updatePartialProfileDataByDataIndex
            const profileName = 'bulk batch to bid request';
            const profile = testDataManager.getProfileByName(profileName);
            if (profile && profile.data) {
              const batchTime = profile.data[dataIdx - 1]['batch time'];
              vars["batch time"] = batchTime;
              log.info(`Loaded batch time: ${vars["batch time"]}`);
            }

            vars["BatchTime"] = vars["batch time"];
            await expect(correspondentPortalPage.Pricing_Return_Time.locator(`option[value="${vars["BatchTime"]}"]`)).toBeAttached();
            //await expect(chaseFieldNamePage.Option_in_PricingReturn_Dropdown(vars["BatchTime"])).toBeVisible();
            log.info(`Dropdown option ${dataIdx} verified against batch time: ${vars["BatchTime"]}`);
            vars["BatchNum"] = (parseFloat(String("1")) + parseFloat(String(vars["BatchNum"]))).toFixed(0);
          }
       // }
          
        log.stepPass('All dropdown options verified against TDP batch times successfully');
      } catch (e) {
        await log.stepFail(page, 'Verifying dropdown options against TDP batch times failed');
        throw e;
      }

      // ─── TC End: PASS ─────────────────────────────────────────────────────
      log.tcEnd('PASS');

    } catch (e) {
      // ─── TC End: FAIL ─────────────────────────────────────────────────────
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});