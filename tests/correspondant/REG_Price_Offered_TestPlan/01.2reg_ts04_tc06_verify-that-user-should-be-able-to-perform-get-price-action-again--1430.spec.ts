import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1429 } from '../../../src/helpers/prereqs/prereq-1429';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';


const TC_ID = 'REG_TS04_TC06';
const TC_TITLE = 'Verify that user should be able to perform get price action again, when the timer is active';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1429(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Navigate to General Settings and capture Commitment Timer minutes');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await generalSettingPage.Commitment_Timer_General_Settings.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars["MinutesSettings"] = await correspondentPortalPage.Internal_User_Minutes_Input.inputValue() || '';
        Methods.trimtestdata(vars["MinutesSettings"], 'MinutesSettings');
        log.info('MinutesSettings: ' + vars['MinutesSettings']);
        Methods.performArithmetic(vars["MinutesSettings"], "SUBTRACTION", "1", "startMin", 0);
        log.info('startMin: ' + vars['startMin']);
        log.stepPass('Commitment Timer minutes captured from General Settings successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to capture Commitment Timer minutes from General Settings');
        throw e;
      }

      log.step('Navigate to Price Offered and search by Bid Request ID');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.First_Bid_Request_ID.click();
        await page.waitForTimeout(2000);
        log.stepPass('Navigated to Price Offered and Bid Request ID found successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to navigate to Price Offered or search by Bid Request ID');
        throw e;
      }

      log.step('Trigger Get Price action and capture Remaining Time');
      try {
        await correspondentPortalPage.Get_Price_Button.click();
        await correspondentPortalPage.Remaining_Time_Price_Offered.waitFor({ state: 'visible' });
        vars["RemainingTime"] = await correspondentPortalPage.Remaining_Time_Price_Offered.textContent() || '';
        Methods.trimtestdata(vars["RemainingTime"], 'RemainingTime');
        log.info('RemainingTime: ' + vars['RemainingTime']);
        log.stepPass('Get Price action triggered and Remaining Time captured successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to trigger Get Price action or capture Remaining Time');
        throw e;
      }

      log.step('Parse Remaining Time and build expected timer values');
      try {
        vars["MinSettings"] = vars["MinutesSettings"];
        Methods.performArithmetic(vars["MinSettings"], "SUBTRACTION", "1", "startMin", 0);

        // Split "Xm:YYs" by ":" → position 0 = "Xm", position 1 = "YYs"
        Methods.splitBySpecialChar(vars["RemainingTime"], ':', '0', 'MinTimePriceOffered');
        Methods.splitBySpecialChar(vars["RemainingTime"], ':', '1', 'SecondsTimePriceOffered');

        // Build expected minute strings e.g. "5m" and "4m"
        Methods.concatenate(vars["MinSettings"], 'm', 'ExpectedMinTime');
        Methods.concatenate(vars["startMin"], 'm', 'ExpectedMinTimeMinus1');

        // Extract first and second digit from seconds part e.g. "59s" → "5", "9"
        Methods.splitRangeOfCharacters(vars["SecondsTimePriceOffered"], 0, 1, 'FirstDigitSeconds');
        Methods.splitRangeOfCharacters(vars["SecondsTimePriceOffered"], 1, 2, 'SecondDigitSeconds');

        log.info('MinTimePriceOffered: ' + vars['MinTimePriceOffered']);
        log.info('ExpectedMinTime: ' + vars['ExpectedMinTime']);
        log.info('ExpectedMinTimeMinus1: ' + vars['ExpectedMinTimeMinus1']);
        log.info('SecondsTimePriceOffered: ' + vars['SecondsTimePriceOffered']);
        log.info('FirstDigitSeconds: ' + vars['FirstDigitSeconds']);
        log.info('SecondDigitSeconds: ' + vars['SecondDigitSeconds']);
        log.stepPass('Remaining Time parsed and expected timer values built successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to parse Remaining Time or build expected timer values');
        throw e;
      }

      log.step('Verify Remaining Time matches expected timer values from General Settings');
      try {
        if (vars["MinTimePriceOffered"] === vars["ExpectedMinTime"]) {
          log.info('Timer is at full minute — verifying seconds are 00');
          Methods.verifyString(vars["FirstDigitSeconds"], 'equals', '0');
          Methods.verifyString(vars["SecondDigitSeconds"], 'equals', '0');
        } else {
          log.info('Timer has ticked — verifying minute is one less and seconds start with 5');
          Methods.verifyString(vars["MinTimePriceOffered"], 'equals', vars["ExpectedMinTimeMinus1"]);
          Methods.verifyString(vars["FirstDigitSeconds"], 'equals', '5');
        }
        await Methods.verifyTextMatchesPattern(vars["RemainingTime"], '^\\d+m:\\d{2}s$');
        log.stepPass('Remaining Time verified successfully — timer matches General Settings config');
      } catch (e) {
        log.stepFail(page, 'Remaining Time verification failed — timer does not match General Settings config');
        throw e;
      }

      log.step('Verify timer countdown behaviour via step group');
      try {
        await stepGroups.stepGroup_Verifying_the_Time_Count_Down_In_Price_Offered_Details_Scree(page, vars);
        log.stepPass('Timer countdown behaviour verified successfully');
      } catch (e) {
        log.stepFail(page, 'Timer countdown behaviour verification failed');
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