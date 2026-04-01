import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS08_TC07';
const TC_TITLE = 'Verify that user should not be able to add the loans to the existing commitment after the time limit is exceeded';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  let REG_TS08_TC07testFailed = false;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  const profileName = 'CommitmentList';
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step('Login to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Logged in to Correspondent Portal');
      } catch (e) {
        await log.stepFail(page, 'Failed to login to Correspondent Portal');
        throw e;
      }

      log.step('Navigate to Other Config and set Correction Cut Off to 1 hour if not already set');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await priceOfferedPage.Other_Config.click();
        vars['CommitCorrectionCutOffBefore'] = await commitmentListPage.Correction_Cut_Off.inputValue() || '';
        log.info('CommitCorrectionCutOffBefore: ' + vars['CommitCorrectionCutOffBefore']);
        await commitmentListPage.Correction_Cut_Off.click();
        if (String(vars['CommitCorrectionCutOffBefore']) === appconstants.ONE) {
          await priceOfferedPage.Commit_Creation_Cut_Off.click();
          log.info('Cut off already set to 1 no change needed');
        } else {
          await commitmentListPage.Correction_Cut_Off.click();
          await commitmentListPage.Correction_Cut_Off.clear();
          await commitmentListPage.Correction_Cut_Off.fill(appconstants.ONE);
          await correspondentPortalPage.Save_Changes_Button.waitFor({ state: 'visible' });
          await correspondentPortalPage.Save_Changes_Button.click();
          log.info('Correction Cut Off updated to 1');
        }
        log.stepPass('Correction Cut Off confirmed as 1 hour');
      } catch (e) {
        await log.stepFail(page, 'Failed to set Correction Cut Off to 1 hour');
        throw e;
      }

      log.step('Navigate to Commitment List and open commitment for BidReqId');
      try {
        if (profile && profile.data) {
          vars['BidReqId'] = profile.data[0]['RequestIdFrom5-1'];
          log.info('BidReqId: ' + vars['BidReqId']);
        }
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.waitFor({ state: 'visible' });
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commitment_IDCommitment_List_Page(vars['BidReqId']).first().click();
        vars['CommitTime'] = await commitmentListPage.Commit_TimeCommitment_Screen.first().textContent() || '';
        Methods.trimtestdata(vars['CommitTime'], 'CommitTime');
        log.info('Commit Time: ' + vars['CommitTime']);
        vars['CommitID'] = await priceOfferedPage.Commit_IDCommitment_List.first().textContent() || '';
        Methods.trimtestdata(vars['CommitID'], 'CommitID');
        log.info('Commit ID: ' + vars['CommitID']);
        log.stepPass('Successfully navigate to commitment details screen and stored the commitment id ');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Commitment List or open commitment for BidReqId: ' + vars['BidReqId']);
        throw e;
      }

      log.step('Calculate time difference and verify Add to Commitment is disabled if time exceeded');
      try {
        Methods.getCurrentTimestamp(appconstants.TIME_FORMAT1_HHMMA, 'CurrentTime', appconstants.UTC);
        log.info('CurrentTime: ' + vars['CurrentTime']);
        Methods.calculateTimeDifference(vars['CommitTime'], vars['CurrentTime'], 'HOURS', 'TimeDiff');
        log.info('TimeDiff (hours): ' + vars['TimeDiff']);
        if (parseFloat(String(vars['TimeDiff'])) > parseFloat(appconstants.ONE)) {
          await commitmentListPage.Total_LoansCommitment_List.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await priceOfferedPage.Required_Loan_Num.first().check();
          await priceOfferedPage.Commit_Selected_1_Dropdown.click();
          await expect(commitmentListPage.Commitment_OrderCommitment_List_New(vars['CommitID'])).toContainClass('disabled');
          log.info('Time exceeded 1 hour Commitment Order is disabled as expected');
          log.stepPass('Add to commitment is disabled after time limit exceeded. TimeDiff: ' + vars['TimeDiff'] + ' hours');
        } 
      } catch (e) {
        await log.stepFail(page, 'Time difference check or disabled verification failed. CommitTime: ' + vars['CommitTime'] + ' | CurrentTime: ' + vars['CurrentTime']);
        throw e;
      }

      log.step('Navigate back to Other Config and restore Correction Cut Off to original value');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await priceOfferedPage.Other_Config.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['CommitCorrectionCutOffAfter'] = await commitmentListPage.Correction_Cut_Off.inputValue() || '';
        log.info('CommitCorrectionCutOffAfter: ' + vars['CommitCorrectionCutOffAfter']);
        if (String(vars['CommitCorrectionCutOffBefore']) !== String(vars['CommitCorrectionCutOffAfter'])) {
          await commitmentListPage.Correction_Cut_Off.click();
          await commitmentListPage.Correction_Cut_Off.clear();
          await commitmentListPage.Correction_Cut_Off.type(vars['CommitCorrectionCutOffBefore']);
          await expect(correspondentPortalPage.Save_Changes_Button).toBeEnabled();
          await correspondentPortalPage.Save_Changes_Button.click();
          log.info('Correction Cut Off restored to: ' + vars['CommitCorrectionCutOffBefore']);
        } 
        log.stepPass('Correction Cut Off restored to original value: ' + vars['CommitCorrectionCutOffBefore']);
      } catch (e) {
        await log.stepFail(page, 'Failed to restore Correction Cut Off to original value: ' + vars['CommitCorrectionCutOffBefore']);
        throw e;
      }
      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      REG_TS08_TC07testFailed = true;
      throw e;
    }
  });
  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, REG_TS08_TC07testFailed);
    if (REG_TS08_TC07testFailed) {
      try {
      log.step('Executing after-test steps: Navigate back to Other Config and restore Correction Cut Off to original value');
      await correspondentPortalPage.Administration_Menu.click();
      await correspondentPortalPage.GeneralSettings_Menu.click();
      await priceOfferedPage.Other_Config.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars['CommitCorrectionCutOffAfter'] = await commitmentListPage.Correction_Cut_Off.inputValue() || '';
      log.info('CommitCorrectionCutOffAfter: ' + vars['CommitCorrectionCutOffAfter']);
      if (String(vars["CommitCorrectionCutOffBefore"]) !== String(vars["CommitCorrectionCutOffAfter"])) {
        await commitmentListPage.Correction_Cut_Off.clear();
        await commitmentListPage.Correction_Cut_Off.click();
        await commitmentListPage.Correction_Cut_Off.type(vars["CommitCorrectionCutOffBefore"]);
        await expect(correspondentPortalPage.Save_Changes_Button).toBeEnabled();
        await correspondentPortalPage.Save_Changes_Button.click();
        log.info('Correction Cut Off restored to: ' + vars['CommitCorrectionCutOffBefore']);
      }
       log.stepPass('After-test steps executed successfully. Correction Cut Off restored to original value: ' + vars['CommitCorrectionCutOffBefore']);
      } catch (e) {
        await log.stepFail(page, 'Failed to restore Correction Cut Off to original value: ' + vars['CommitCorrectionCutOffBefore']);
        throw e;
      }
    }
  });
});
