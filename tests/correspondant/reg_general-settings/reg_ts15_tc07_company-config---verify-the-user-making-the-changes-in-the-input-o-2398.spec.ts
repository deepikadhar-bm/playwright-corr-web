import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { runPrereq_2396 } from '../../../src/helpers/prereqs/prereq-2396';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '@helpers/log-helper';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS15_TC07';
const TC_TITLE = 'Company Config - Verify the User making the Changes, in the Input of the Internal User Username Replacement, whether it is get Reflected in the Commitment letter';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let REG_TS15_TC07testFailed = false;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_2396(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Set up download handler and load test data profiles');
      try {
        vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
        const profileName1 = 'Bid Requests';
        const profile = testDataManager.getProfileByName(profileName1);
        if (profile && profile.data) {
          vars['CompanyName'] = profile.data[0]['Company Name'];
          vars['BidMappingID'] = profile.data[0]['BidMappingID'];
          log.info('CompanyName: ' + vars['CompanyName']);
          log.info('BidMappingID: ' + vars['BidMappingID']);
        }
        const profileName2 = 'Administration_Bulk Batch Timing';
        const profile2 = testDataManager.getProfileByName(profileName2);
        if (profile2 && profile2.data) {
          vars['Time Interval'] = profile2.data[0]['Time Interval'];
          vars['NO of Batches'] = profile2.data[0]['NO of Batches'];
          log.info('Time Interval: ' + vars['Time Interval']);
          log.info('NO of Batches: ' + vars['NO of Batches']);
        }
        log.stepPass('Download handler set up and test data profiles loaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to set up download handler or load test data profiles');
        throw e;
      }

      log.step('Create new bid for Price Offered status');
      try {
        await page.reload();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Dashboard_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Creating_a_new_bid_for_price_offered_status_with_freedom_com(page, vars);
        log.info('RequestIDDetails: ' + vars['RequestIDDetails']);
        log.stepPass('New bid created with Price Offered status successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to create new bid for Price Offered status');
        throw e;
      }

      log.step('Navigate to Price Offered list and search for bid request');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['RequestIDDetails']);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidReqIdPrice_Offered(vars['RequestIDDetails']).click();
        log.stepPass('Navigated to Price Offered list and bid request opened successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Price Offered list or open bid request');
        throw e;
      }

      log.step('Commit all loans in price offered screen');
      try {
        await stepGroups.stepGroup_Commit_All_Loans_Standard(page, vars);
        log.stepPass('All loans committed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to commit all loans');
        throw e;
      }

      log.step('Navigate to Commitment List and download Commitment Letter');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['RequestIDDetails']);
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commitment_Letter.first().click()
        Methods.getCurrentTimestamp(appconstants.PATH_DATEFORMAT, 'CurrentTimeStamp', appconstants.ASIA_KOLKATA);
        const [download] = await Promise.all([page.waitForEvent('download'), commitmentListPage.First_Commitment_Letter.first().click()]);
        Methods.concatenateWithSpecialChar(vars['CurrentTimeStamp'], download.suggestedFilename(), '_', 'SavedFileName');
        vars['FilePath'] = path.join(vars['DownloadDir'], vars['SavedFileName']);
        await download.saveAs(vars['FilePath']);
        log.info('FilePath: ' + vars['FilePath']);
        log.stepPass('Navigated to Commitment List and Commitment Letter downloaded successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Commitment List or download Commitment Letter');
        throw e;
      }

      log.step('Verify cover letter username matches updated username');
      try {
        vars['CoverLetterUserName'] = excelHelper.readCellByColAndRowIndex(vars['FilePath'], 0, 3, 4);
        log.info('CoverLetterUserName: ' + vars['CoverLetterUserName']);
        log.info('UsernameUpdated: ' + vars['UsernameUpdated']);
        expect(Methods.verifyString(vars['CoverLetterUserName'], 'equals', vars['UsernameUpdated']));
        await correspondentPortalPage.Close_ButtonCommitment_List.click();
        log.stepPass('Cover letter username verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify cover letter username');
        throw e;
      }

      log.step('Restore original username in Company Config');
      try {
        await stepGroups.stepGroup_Updating_Back_Username_in_Company_Config(page, vars);
        log.stepPass('Original username restored in Company Config successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to restore original username in Company Config');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      REG_TS15_TC07testFailed = true;
      log.tcEnd('FAIL');
      throw e;
    }
  });

  test.afterEach(async ({ page }) => {
    log.afterTestSteps(TC_ID, REG_TS15_TC07testFailed);
    try {
      log.step('Executing after-test steps: Restore original username in Company Config');
      if (REG_TS15_TC07testFailed) {
        await stepGroups.stepGroup_Updating_Back_Username_in_Company_Config(page, vars);
      }
      log.stepPass('After-test steps executed successfully. Original username restored in Company Config');
    } catch (e) {
      await log.stepFail(page, 'Failed to restore original username in Company Config in after-test steps');
      throw e;
    }
  });
});