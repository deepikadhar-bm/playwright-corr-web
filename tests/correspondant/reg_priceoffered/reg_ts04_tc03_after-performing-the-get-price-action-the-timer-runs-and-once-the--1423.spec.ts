import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1426 } from '../../../src/helpers/prereqs/prereq-1426';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS04_TC03';
const TC_TITLE = 'After performing the "Get Price" action, the timer runs, and once the timer finishes then the screen should reset to normal and user should be restricted to perform commit action';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1426(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Navigate to General Settings and update Chase Users Commitment Timer');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await generalSettingPage.General_Settings.click();
        await generalSettingPage.Commitment_Timer_General_Settings.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Editing_the_Chase_Users_Time_Under_General_Settings(page, vars);
        vars["ExtractedTimeFromChaseUserBox"] = await priceOfferedPage.Chase_Usercommitment_timer.inputValue() || '';
        Methods.trimtestdata(vars["ExtractedTimeFromChaseUserBox"], 'ExtractedTimeFromChaseUserBox');
        log.info('ExtractedTimeFromChaseUserBox: ' + vars['ExtractedTimeFromChaseUserBox']);
        await correspondentPortalPage.Save_Changes_Button.waitFor({ state: 'visible' });
        await page.waitForTimeout(2000);
        await correspondentPortalPage.Save_Changes_Button.click();
         await page.waitForTimeout(2000);
        log.stepPass('Chase Users Commitment Timer updated and saved successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to update Chase Users Commitment Timer in General Settings');
        throw e;
      }

      log.step('Navigate to Price Offered and search by Bid Request ID');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
         await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.First_bid_id.click();
        await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.waitFor({ state: 'visible' });
        log.stepPass('Navigated to Price Offered and Bid Request ID found successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to navigate to Price Offered or search by Bid Request ID');
        throw e;
      }

      log.step('Trigger Get Price action and verify Remaining Time is visible');
      try {
        await expect(priceOfferedPage.Remaining_Timeprice_offered).not.toBeVisible();
        await correspondentPortalPage.Get_Price_Button.click();
        await priceOfferedPage.First_Check_Boxprice_offered_screen.first().waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Remaining_Timeprice_offered).toBeVisible();
        await expect(priceOfferedPage.Remaining_Timeprice_offered).toContainText(appconstants.REMAINING_TIME_TEXT);
        vars["ExtractedTimeFromTimer"] = await priceOfferedPage.Text_from_Remaining_Timeprice_offered.textContent() || '';
        Methods.trimtestdata(vars["ExtractedTimeFromTimer"], 'ExtractedTimeFromTimer');
        log.info('ExtractedTimeFromTimer: ' + vars['ExtractedTimeFromTimer']);
        log.stepPass('Get Price action triggered and Remaining Time is visible');
      } catch (e) {
        log.stepFail(page, 'Failed to trigger Get Price action or Remaining Time is not visible');
        throw e;
      }

      log.step('Calculate wait time and wait for timer to expire');
      try {
        Methods.performArithmetic("60", "MULTIPLICATION", vars["ExtractedTimeFromChaseUserBox"], "WaitingTimeInterval", 0);
        log.info('WaitingTimeInterval (seconds): ' + vars['WaitingTimeInterval']);
        Methods.performArithmetic( vars['WaitingTimeInterval'], "MULTIPLICATION", "1000", "WaitingTimeInterval", 0);
        log.info('Waiting for timer to expire — duration ms: ' + vars['WaitingTimeInterval']);
        await page.waitForTimeout(Number(vars['WaitingTimeInterval']));
        log.stepPass('Timer wait completed successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to calculate wait time or timer wait was interrupted');
        throw e;
      }

      log.step('Verify screen state after timer expires and commit action is restricted');
      try {
        await expect(priceOfferedPage.Remaining_Timeprice_offered).not.toBeVisible();
        await expect(priceOfferedPage.First_Check_Boxprice_offered_screen.first()).toBeVisible();
        await priceOfferedPage.First_Check_Boxprice_offered_screen.first().check();
        await expect(priceOfferedPage.First_Check_Boxprice_offered_screen.first()).toBeChecked();
        await expect(priceOfferedPage.Commit_Selected_Button_Disabledprice_offered).toBeDisabled();
        log.stepPass('Screen reset verified — Commit Selected button is disabled after timer expiry');
      } catch (e) {
        log.stepFail(page, 'Screen state verification failed — Commit button state is incorrect after timer expiry');
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