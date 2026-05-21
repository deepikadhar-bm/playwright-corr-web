import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1307 } from '../../../src/helpers/prereqs/prereq-1307';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS22_TC04_02.1';
const TC_TITLE = 'Perform the resubmit for pricing action for a bid with the Chase execution type, and validate all the values in the resubmitted record . (Target: Submit today, status :Expired)';


test.describe('REG_TC_Bid_Requests', () => {

  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const profilePopupChaseDirect = 'Chase Field Names and Values On Loan Details Popup For ChaseDirect';
  const profile = testDataManager.getProfileByName(profilePopupChaseDirect);
  const dataList = profile?.data as Record<string, any>[];

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1307(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Open loan details popup and verify header fields after resubmit');
      try {
        await bidRequestDetailsPage.First_loan_Number_In_table.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(bidRequestDetailsPage.Bid_Request_ID_On_Loan_Details_Popup).not.toContainText(vars['RequestIdPopupBeforeSubmit']);
        await expect(bidRequestDetailsPage.Bid_Loan_Number_Loan_Details_Pop_up).toContainText(vars['LoanNumberPopUpBeforeSubmit']);
        await expect(bidRequestDetailsPage.Errors_Check_On_Laon_Details_Popup).toContainText(vars['ErrorsCheckPopupBeforeSubmit']);
        log.info('RequestIdPopupBeforeSubmit (should not match): ' + vars['RequestIdPopupBeforeSubmit']);
        log.info('LoanNumberPopUpBeforeSubmit: ' + vars['LoanNumberPopUpBeforeSubmit']);
        log.info('ErrorsCheckPopupBeforeSubmit: ' + vars['ErrorsCheckPopupBeforeSubmit']);
        log.stepPass('Loan details popup header fields verified after resubmit');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify loan details popup header fields after resubmit');
        throw e;
      }

      log.step('Iterate through Chase fields and verify values match pre-resubmit data');
      try {
        vars['ChaseFieldCountPopup'] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
        log.info('ChaseFieldCountPopup: ' + vars['ChaseFieldCountPopup']);
        vars['count'] = appconstants.ONE;
        vars['tdpcount'] = appconstants.ZERO;
        while (parseFloat(String(vars['count'])) <= parseFloat(String(vars['ChaseFieldCountPopup']))) {
          await bidRequestDetailsPage.Bid_Request_ID_On_Loan_Details_Popup.click();
          vars['ChaseFieldPopupAfterSubmit'] = await bidRequestDetailsPage.Individual_Chase_Field_Name_Popup(vars['count']).textContent() || '';
          Methods.trimtestdata(vars['ChaseFieldPopupAfterSubmit'], 'ChaseFieldPopupAfterSubmit');
          vars['ChaseValuePopupAfterSubmit'] = await bidRequestDetailsPage.Individual_Chase_Value_popup2(vars['ChaseFieldPopupAfterSubmit']).textContent() || '';
          Methods.trimtestdata(vars['ChaseValuePopupAfterSubmit'], 'ChaseValuePopupAfterSubmit');
          vars['ChaseValueBeforeSubmit'] = dataList[Number(vars['tdpcount'])]['ChaseValueBeforeSubmit'];
          vars['ChaseFieldNameBeforeSubmit'] = dataList[Number(vars['tdpcount'])]['ChaseFieldNameBeforeSubmit'];
          log.info('ChaseFieldPopupAfterSubmit: ' + vars['ChaseFieldPopupAfterSubmit']);
          log.info('ChaseValuePopupAfterSubmit: ' + vars['ChaseValuePopupAfterSubmit']);
          log.info('ChaseFieldNameBeforeSubmit: ' + vars['ChaseFieldNameBeforeSubmit']);
          log.info('ChaseValueBeforeSubmit: ' + vars['ChaseValueBeforeSubmit']);
          await expect(bidRequestDetailsPage.Individual_Chase_Field_Name_Popup(vars['count'])).toContainText(vars['ChaseFieldNameBeforeSubmit']);
          if (String(vars['ChaseValuePopupAfterSubmit']).trim() === '') {
            Methods.verifyString(vars['ChaseValueBeforeSubmit'], 'equals', 'Null');
          } else {
            await expect(bidRequestDetailsPage.Individual_Chase_Value_popup2(vars['ChaseFieldPopupAfterSubmit'])).toContainText(vars['ChaseValueBeforeSubmit']);
          }
          Methods.performArithmetic('1', 'ADDITION', vars['count'], 'count', 0);
          Methods.performArithmetic('1', 'ADDITION', vars['tdpcount'], 'tdpcount', 0);
        }
        log.stepPass('All Chase field values verified successfully against pre-resubmit data');
      } catch (e) {
        await log.stepFail(page, 'Chase field verification failed at count: ' + vars['count']);
        throw e;
      }

      log.step('Close popup and verify footer submission and queued dates have changed');
      try {
        await correspondentPortalPage.Close_Buttonemail_config.click();
        await expect(bidRequestDetailsPage.Footer_Submission_Date).not.toContainText(vars['FooterSubmssionBeforeSubmit']);
        await expect(bidRequestDetailsPage.Footer_Queued_For_Date).not.toContainText(vars['FooterQueuedBeforeSubmit']);
        log.info('FooterSubmssionBeforeSubmit (should not match): ' + vars['FooterSubmssionBeforeSubmit']);
        log.info('FooterQueuedBeforeSubmit (should not match): ' + vars['FooterQueuedBeforeSubmit']);
        log.stepPass('Footer dates verified as changed after resubmit');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify footer dates after resubmit');
        throw e;
      }

      log.step('Verify footer submission and queued date for today');
      try {
        await stepGroups.stepGroup_Verify_Footer_Submission_and_Queued_Date_For_Today_in_Bid_Re(page, vars);
        log.stepPass('Footer submission and queued date verified for today successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify footer submission and queued date for today');
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