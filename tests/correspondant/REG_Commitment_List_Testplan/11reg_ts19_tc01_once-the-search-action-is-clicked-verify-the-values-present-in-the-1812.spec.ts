import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';


const TC_ID    = 'REG_TS19_TC01';
const TC_TITLE = 'Once the search action is clicked, verify the values present in the popup should be Commitment ID, Bid Request ID, Chase Loan Number and the Correspondent Loan Number';

test.describe('Commitment List - TS_1', () => {

  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    commitmentListPage      = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage        = new PriceOfferedPage(page);
    spinnerPage             = new SpinnerPage(page);
    Methods                 = new AddonHelpers(page, vars);
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

      log.step('Navigate to Commitment List');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Commitment List');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Commitment List');
        throw e;
      }

      log.step('Open search dropdown and verify search filter options');
      try {
        await priceOfferedPage.Search_Dropdown.click();
        await expect(commitmentListPage.Commitment_IDSearch_Dropdown).toContainText('Commitment ID');
        await expect(commitmentListPage.Bid_Request_IDSearch_Dropdown).toContainText('Bid Request ID');
        await expect(commitmentListPage.Chase_Loan_NumberSearch_Dropdown).toContainText('Chase Loan Number');
        await expect(correspondentPortalPage.Correspondent_Loan_NumberSearch_Dropdown).toContainText('Correspondent Loan Number');
        log.stepPass('Search dropdown contains: Commitment ID, Bid Request ID, Chase Loan Number, Correspondent Loan Number');
      } catch (e) {
        await log.stepFail(page, 'Search dropdown options verification failed');
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