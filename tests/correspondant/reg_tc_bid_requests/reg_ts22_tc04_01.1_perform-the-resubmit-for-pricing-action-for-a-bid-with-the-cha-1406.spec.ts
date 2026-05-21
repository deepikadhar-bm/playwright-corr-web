import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1306 } from '../../../src/helpers/prereqs/prereq-1306';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { Logger as log } from '@helpers/log-helper';


const TC_ID = 'REG_TS22_TC04_01.1';
const TC_TITLE = 'Perform the resubmit for pricing action for a bid with the Chase execution type, and validate all the values in the resubmitted record . (Target: Submit today, status :Expired)';


test.describe('REG_TC_Bid_Requests', () => {

  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const profileName = 'Administration_Bulk Batch Timing';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1306(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      if (profile && profile.data) {
        vars['Time Interval'] = profile.data[0]['Time Interval'];
        vars['NO of Batches'] = profile.data[0]['NO of Batches'];
        log.info('Time Interval: ' + vars['Time Interval']);
        log.info('NO of Batches: ' + vars['NO of Batches']);
      }

      log.step('Open loan details popup and capture Chase field names and values');
      try {
        await bidRequestDetailsPage.First_loan_Number_In_table.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['RequestIdPopupBeforeSubmit'] = await bidRequestDetailsPage.Bid_Request_ID_On_Loan_Details_Popup.textContent() || '';
        Methods.trimtestdata(vars['RequestIdPopupBeforeSubmit'], 'RequestIdPopupBeforeSubmit');
        vars['LoanNumberPopUpBeforeSubmit'] = await bidRequestDetailsPage.Bid_Loan_Number_Loan_Details_Pop_up.textContent() || '';
        Methods.trimtestdata(vars['LoanNumberPopUpBeforeSubmit'], 'LoanNumberPopUpBeforeSubmit');
        vars['ErrorsCheckPopupBeforeSubmit'] = await bidRequestDetailsPage.Errors_Check_On_Laon_Details_Popup.textContent() || '';
        Methods.trimtestdata(vars['ErrorsCheckPopupBeforeSubmit'], 'ErrorsCheckPopupBeforeSubmit');
        log.info('RequestIdPopupBeforeSubmit: ' + vars['RequestIdPopupBeforeSubmit']);
        log.info('LoanNumberPopUpBeforeSubmit: ' + vars['LoanNumberPopUpBeforeSubmit']);
        log.info('ErrorsCheckPopupBeforeSubmit: ' + vars['ErrorsCheckPopupBeforeSubmit']);
        log.stepPass('Loan details popup opened and header fields captured');
      } catch (e) {
        await log.stepFail(page, 'Failed to open loan details popup or capture header fields');
        throw e;
      }

      log.step('Iterate through Chase fields and store to test data profile');
      try {
        vars['ChaseFieldCountPopup'] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
        log.info('ChaseFieldCountPopup: ' + vars['ChaseFieldCountPopup']);
        vars['count'] = appconstants.ONE;
        const profilePopupChaseDirect = 'Chase Field Names and Values On Loan Details Popup For ChaseDirect';
        while (parseFloat(String(vars['count'])) <= parseFloat(String(vars['ChaseFieldCountPopup']))) {
          await bidRequestDetailsPage.Bid_Request_ID_On_Loan_Details_Popup.click();
          vars['ChaseFieldNameBeforeSubmit'] = await bidRequestDetailsPage.Individual_Chase_Field_Name_Popup(vars['count']).textContent() || '';
          Methods.trimtestdata(vars['ChaseFieldNameBeforeSubmit'], 'ChaseFieldNameBeforeSubmit');
          vars['ChaseValuePopupBeforeSubmit'] = await bidRequestDetailsPage.Individual_Chase_Value_Popup(vars['ChaseFieldNameBeforeSubmit']).textContent() || '';
          Methods.trimtestdata(vars['ChaseValuePopupBeforeSubmit'], 'ChaseValuePopupBeforeSubmit');
          log.info('ChaseFieldNameBeforeSubmit: ' + vars['ChaseFieldNameBeforeSubmit']);
          log.info('ChaseValuePopupBeforeSubmit: ' + vars['ChaseValuePopupBeforeSubmit']);
          if (String(vars['ChaseValuePopupBeforeSubmit']) === '') {
            log.info('Chase Value Popup is empty  writting  Null');
            vars['ChaseValuePopupBeforeSubmit'] = 'Null';
          }
          testDataManager.updatePartialProfileDataByDataIndex(profilePopupChaseDirect, {
            'ChaseFieldNameBeforeSubmit': vars['ChaseFieldNameBeforeSubmit'],
            'ChaseValueBeforeSubmit': vars['ChaseValuePopupBeforeSubmit'],
          }, vars['count']);
          Methods.performArithmetic(vars['count'], 'ADDITION', '1', 'count', 0);
        }
        log.stepPass('All Chase field data captured and stored to test data profile');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture Chase field data at count: ' + vars['count']);
        throw e;
      }

      log.step('Close popup and capture footer submission and queued dates');
      try {
        await correspondentPortalPage.Close_Buttonemail_config.click();
        vars['FooterSubmssionBeforeSubmit'] = await bidRequestDetailsPage.Footer_Submission_Date.textContent() || '';
        Methods.trimtestdata(vars['FooterSubmssionBeforeSubmit'], 'FooterSubmssionBeforeSubmit');
        vars['FooterQueuedBeforeSubmit'] = await bidRequestDetailsPage.Footer_Queued_For_Date.textContent() || '';
        Methods.trimtestdata(vars['FooterQueuedBeforeSubmit'], 'FooterQueuedBeforeSubmit');
        log.info('FooterSubmssionBeforeSubmit: ' + vars['FooterSubmssionBeforeSubmit']);
        log.info('FooterQueuedBeforeSubmit: ' + vars['FooterQueuedBeforeSubmit']);
        log.stepPass('Footer dates captured successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to close popup or capture footer dates');
        throw e;
      }

      log.step('Click Resubmit for Pricing and select batch time');
      try {
        await correspondentPortalPage.ReSubmit_For_Pricing_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(bidRequestDetailsPage.bidRequestDate_Today_Radio_Button).toBeEnabled();
        await correspondentPortalPage.Dropdown_selection_2.click();
        await page.waitForTimeout(5000);
        const optionsCount = await correspondentPortalPage.Options_Pricing_Dropdown.count();
        log.info('Total options in pricing dropdown: ' + optionsCount);
        if (await bidRequestPage.Enabled_Time.count() > 0) {
          log.info('Enabled time is present in the dropdownn');
          if (await correspondentPortalPage.Options_Pricing_Dropdown.count() > 0) {
            const optionsTexts = await correspondentPortalPage.Options_Pricing_Dropdown.allTextContents();
            log.info('Texts of all options in pricing dropdown: ' + optionsTexts);
          }

          if (await correspondentPortalPage.Enabled_Options_Pricing_Dropdown.count() > 0) {
            const enabledCount = await correspondentPortalPage.Enabled_Options_Pricing_Dropdown.count();
            log.info('Total enabled options:' + enabledCount);
            const enabledOptionsTexts = await correspondentPortalPage.Enabled_Options_Pricing_Dropdown.allTextContents();
            log.info('Texts of enabled options:' + enabledOptionsTexts);
          }

          if (await correspondentPortalPage.Disabled_Options_Pricing_Dropdown.count() > 0) {
            const count = await correspondentPortalPage.Disabled_Options_Pricing_Dropdown.count();
            log.info('Total disabled options:' + count);
            const disabledOptionsTexts = await correspondentPortalPage.Disabled_Options_Pricing_Dropdown.allTextContents();
            log.info('Texts of disabled options:' + disabledOptionsTexts);
          }
          log.info('Enabled Time is visible — selecting second enabled batch time');
          await stepGroups.stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail_BidReqDetails_Page(page, vars);
        } else {
          log.info('Enabled Time is not visible — modifying batch intervals and resubmitting');
          await correspondentPortalPage.close_pop_up_bid_request_details.click();
          await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
          await stepGroups.stepGroup_Modifying_The_Batch_Intervals_For_Next_bussiness_day_with_on(page, vars);
          await correspondentPortalPage.Bid_Requests_Side_Menu.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await correspondentPortalPage.Search_By_Bid_Request_ID_Input.type(vars['RequestIDBeforeResubmit']);
          await page.keyboard.press('Enter');
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(correspondentPortalPage.First_Bid_Request_ID).toContainText(vars['RequestIDBeforeResubmit']);
          await correspondentPortalPage.First_Bid_Request_ID.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await correspondentPortalPage.ReSubmit_For_Pricing_Button.click();
          await expect(bidRequestDetailsPage.bidRequestDate_Today_Radio_Button).toBeVisible();
          await correspondentPortalPage.Dropdown_selection_2.click();
          await page.waitForTimeout(5000);
          const optionsCount = await correspondentPortalPage.Options_Pricing_Dropdown.count();
          log.info('Total options in pricing dropdown: ' + optionsCount);
          if (await correspondentPortalPage.Options_Pricing_Dropdown.count() > 0) {
            const optionsTexts = await correspondentPortalPage.Options_Pricing_Dropdown.allTextContents();
            log.info('Texts of all options in pricing dropdown: ' + optionsTexts);
          }

          if (await correspondentPortalPage.Enabled_Options_Pricing_Dropdown.count() > 0) {
            const enabledCount = await correspondentPortalPage.Enabled_Options_Pricing_Dropdown.count();
            log.info('Total enabled options:' + enabledCount);
            const enabledOptionsTexts = await correspondentPortalPage.Enabled_Options_Pricing_Dropdown.allTextContents();
            log.info('Texts of enabled options:' + enabledOptionsTexts);
          }

          if (await correspondentPortalPage.Disabled_Options_Pricing_Dropdown.count() > 0) {
            const count = await correspondentPortalPage.Disabled_Options_Pricing_Dropdown.count();
            log.info('Total disabled options:' + count);
            const disabledOptionsTexts = await correspondentPortalPage.Disabled_Options_Pricing_Dropdown.allTextContents();
            log.info('Texts of disabled options:' + disabledOptionsTexts);
          }
          vars['FirstEnabledTimeText'] = await bidRequestPage.Enabled_Time.first().textContent() || '';
          Methods.trimtestdata(vars['FirstEnabledTimeText'], 'FirstEnabledTimeText');
          log.info('First Enabled Time Text: ' + vars['FirstEnabledTimeText']);
          await correspondentPortalPage.Pricing_Return_Time_BidReqDetails.selectOption({ value: vars['FirstEnabledTimeText'] });
        }
        Methods.getCurrentTimestamp(appconstants.DATE_FORMAT_MMDDYYYY, 'CurrentESTDate', appconstants.AMERICA_NEW_YORK);
        Methods.getCurrentTimestamp(appconstants.EST_TIME_FORMAT_HHMMA, 'CurrentEstTime', appconstants.AMERICA_NEW_YORK);
        vars['SelectedBatchTime'] = await correspondentPortalPage.Dropdown_selection_2.evaluate(el => {
          const s = el as HTMLSelectElement;
          return s.options[s.selectedIndex]?.text || '';
        });
        Methods.trimtestdata(vars['SelectedBatchTime'], 'SelectedBatchTime');
        log.info('CurrentESTDate: ' + vars['CurrentESTDate']);
        log.info('CurrentEstTime: ' + vars['CurrentEstTime']);
        log.info('SelectedBatchTime: ' + vars['SelectedBatchTime']);
        log.stepPass('Batch time selected successfully: ' + vars['SelectedBatchTime']);
      } catch (e) {
        await log.stepFail(page, 'Failed to select batch time for resubmit');
        throw e;
      }

      log.step('Submit resubmit for pricing and verify bid upload progress');
      try {
        await expect(bidRequestDetailsPage.Submit_Button_On_pop_up).toBeEnabled();
        await bidRequestDetailsPage.Submit_Button_On_pop_up.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.getByText('Bid Upload Progress').waitFor({ state: 'visible' });
        await bidRequestPage.Continue_ButtonUpload_Pop_up.waitFor({ state: 'visible' });
        await expect(bidRequestPage.Continue_ButtonUpload_Pop_up).toBeEnabled();
        await stepGroups.stepGroup_Verify_that_the_Bid_Upload_Progress_Popup_has_All_statuses_w(page, vars);
        await bidRequestPage.Continue_ButtonUpload_Pop_up.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForLoadState('load');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' }); log.stepPass('Resubmit for pricing submitted and bid upload progress verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to submit resubmit for pricing or verify bid upload progress');
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