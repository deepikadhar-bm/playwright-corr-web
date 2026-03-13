import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1748 } from '../../../src/helpers/prereqs/prereq-1748';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';

const TC_ID = 'REG_TS04_TC02';
const TC_TITLE = 'Create a new commitment for a bid that already has an existing commitment, and verify that an new commitment entry is added and visible in the list screen';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1748(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
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

      log.step('Reading Bid Request ID from test data profile');
      try {
        if (profile && profile.data) {
          vars['BidReqId'] = profile.data[0]['RequestIDFromPRE_PR_1-1'];
          log.info('Bid ID from TDP: ' + vars['BidReqId']);
        }
        log.stepPass('Bid Request ID retrieved: ' + vars['BidReqId']);
      } catch (e) {
        log.stepFail(page, 'Failed to read Bid Request ID from test data profile');
        throw e;
      }

      log.step('Navigating to Price Offered and committing selected loan');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        vars['BidReqId'] = vars['RequestIDFromPRE_PR_1-1'];
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqId']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidRequestIDPrice_Offered_New(vars["BidReqId"]).click();
        await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.waitFor({ state: 'visible' });
        await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.check();
        await priceOfferedPage.Get_Price_Button.click();
        await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        Methods.getCurrentTimestamp(appconstants.TIME_FORMATE, 'CommittedTime', appconstants.UTC);
        vars['CommitmentIDPriceOffered'] = await priceOfferedPage.Commitment_IdPrice_Offered.textContent() || '';
        await priceOfferedPage.Okay_ButtonPopup.click();
        log.stepPass('Loan committed successfully. Commitment ID: ' + vars['CommitmentIDPriceOffered']);
      } catch (e) {
        log.stepFail(page, 'Failed to commit selected loan from Price Offered');
        throw e;
      }

      log.step('Navigating to Commitment List and verifying new commitment entry');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.waitFor({ state: 'visible' });
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars['CommitmentIDPriceOffered'])).toBeVisible();
        vars['TotalCommitmentIDs'] = String(await commitmentListPage.Commitment_IDCommitment_List_Page(vars["BidReqId"]).count());
        await expect(commitmentListPage.Commitment_ID_Same_Loan_Num(vars["BidReqId"],vars["CommitmentIDPriceOffered"])).toBeVisible();
        expect(Methods.verifyComparison(vars['TotalCommitmentIDs'],">","1"));
        testDataManager.updateProfileData('CommitmentList', { 'RequestIDFromPRE_PR_1-1': vars['BidReqId'] });
        log.stepPass('New commitment verified in Commitment List Total commitments: ' + vars['TotalCommitmentIDs']);
      } catch (e) {
        log.stepFail(page, 'Failed to verify new commitment entry in Commitment List');
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