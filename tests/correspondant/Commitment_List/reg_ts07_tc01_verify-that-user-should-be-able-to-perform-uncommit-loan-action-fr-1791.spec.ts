import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS07_TC01';
const TC_TITLE = 'Verify that user should be able to perform uncommit loan action from one commitment ID and should be restricted to perform uncommit actions from multiple commitment IDs';

test.describe('Commitment List - TS_2', () => {

  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');
  const profileName = 'CommitmentList';
  const profile = testDataManager.getProfileByName(profileName);

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

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Login to CORR portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login successful');
      } catch (e) {
        await log.stepFail(page, 'Login failed');
        throw e;
      }

      log.step('Navigate to Commitment List and search by Bid Request ID');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        if (profile && profile.data) {
          vars['BidReqId'] = profile.data[0]['RequestIdFrom5-5'];
          log.info('Bid Request ID: ' + vars['BidReqId']);
        }
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.waitFor({ state: 'visible' });
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Commitment List and searched by Bid Request ID: ' + vars['BidReqId']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Commitment List or search by Bid Request ID: ' + vars['BidReqId']);
        throw e;
      }

      log.step('Open commitment and navigate to Total Committed Loans tab');
      try {
        await commitmentListPage.Commitment_IDCommitment_List_Page(vars["BidReqId"]).first().click();
        await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
        await commitmentListPage.Total_Committed_Loans_Tab.click();
        log.stepPass('Opened commitment and navigated to Total Committed Loans tab');
      } catch (e) {
        await log.stepFail(page, 'Failed to open commitment or navigate to Total Committed Loans tab');
        throw e;
      }

      log.step('Select all loans in a commitment and verify remaining commitment checkboxes are  disabled state');
      try {
        await priceOfferedPage.Select_All_Loan_Num.first().check();
        expect(priceOfferedPage.Select_All_Loan_Num.first()).toBeChecked();
        await Methods.verifyMultipleElementsState(commitmentListPage.Commit_Check_Boxes, 'disabled');
        log.stepPass('Remaining checkboxes are disabled after selecting all loans in another commitment');
      } catch (e) {
        await log.stepFail(page, 'Checkbox disabled state verification failed after selecting all loans in  another commitment');
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