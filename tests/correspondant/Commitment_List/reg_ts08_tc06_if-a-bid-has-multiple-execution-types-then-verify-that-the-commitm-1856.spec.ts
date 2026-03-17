import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';


const TC_ID = 'REG_TS08_TC06';
const TC_TITLE ='If a bid has multiple execution types verify that commitment details belong to respective execution type';

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
      log.step('Navigate to Commitment List and search using Bid Request ID');
      try {

        if (profile && profile.data) {
          vars['BidReqId'] = profile.data[0]['RequestIdFrom5-1'];
          log.info('BidReqId: ' + vars['BidReqId']);
        }
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated and searched using Bid Request ID');

      } catch (e) {
        await log.stepFail(page, 'Navigation to Commitment List failed');
        throw e;
      }

      log.step('Capture commitment ID for Standard execution type');
      try {
        await commitmentListPage.Commitment_IDStandard.first().click();
        await priceOfferedPage.Commit_IDCommitment_List.first().waitFor({ state: 'visible' });
        vars['CommitIDStandard'] =await priceOfferedPage.Commit_IDCommitment_List.first().textContent() || '';
        Methods.trimtestdata(vars['CommitIDStandard'], 'CommitIDStandard');
        log.info('Standard Commitment ID: ' + vars['CommitIDStandard']);
        await priceOfferedPage.Back_To_Commitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Captured Standard commitment ID');

      } catch (e) {
        await log.stepFail(page, 'Failed to capture Standard commitment ID');
        throw e;
      }
      log.step('Capture commitment ID for Chase Direct execution type');
      try {
        await commitmentListPage.Commitment_IDChase_Direct.first().click();
        await priceOfferedPage.Commit_IDCommitment_List.first().waitFor({ state: 'visible' });
        vars['CommitIDChase'] =await priceOfferedPage.Commit_IDCommitment_List.first().textContent() || '';
        Methods.trimtestdata(vars['CommitIDChase'], 'CommitIDChase');
        log.info('Chase Commitment ID: ' + vars['CommitIDChase']);
        await priceOfferedPage.Back_To_Commitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Captured Chase commitment ID');

      } catch (e) {
        await log.stepFail(page, 'Failed to capture Chase commitment ID');
        throw e;
      }

      log.step('Verify commit dropdown values when loan selected from Standard');
      try {
        await commitmentListPage.Commitment_IDStandard.first().click();
        await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
        await commitmentListPage.Total_LoansCommitment_List.click();
        await priceOfferedPage.Check_the_Loan_Num.first().waitFor({ state: 'visible' });
        await priceOfferedPage.Check_the_Loan_Num.first().click();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await expect(commitmentListPage.Commitment_ID_DropdownStandard(vars["CommitIDStandard"])).toBeVisible();
        await expect(commitmentListPage.Commitment_ID_DropdownChase(vars["CommitIDChase"])).not.toBeVisible();
        await priceOfferedPage.Back_To_Commitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Verified commit dropdown values from Standard');

      } catch (e) {
        await log.stepFail(page, 'Commit dropdown verification failed for Standard');
        throw e;
      }

      log.step('Verify commit dropdown values when loan selected from Chase Direct');

      try {
        await commitmentListPage.Commitment_IDChase_Direct.first().click();
        await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
        await commitmentListPage.Total_LoansCommitment_List.click();
        await priceOfferedPage.Check_the_Loan_Num.first().waitFor({ state: 'visible' });
        await priceOfferedPage.Check_the_Loan_Num.first().click();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await expect(commitmentListPage.Commitment_ID_DropdownChase(vars["CommitIDChase"])).toBeVisible();
        await expect(commitmentListPage.Commitment_ID_DropdownStandard(vars["CommitIDStandard"])).not.toBeVisible();
        log.stepPass('Verified commit dropdown values from Chase Direct');

      } catch (e) {
        await log.stepFail(page, 'Commit dropdown verification failed for Chase Direct');
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