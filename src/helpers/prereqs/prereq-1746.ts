import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1748 } from './prereq-1748';
import { AddonHelpers } from '../AddonHelpers';
import { Logger as log } from '../log-helper';
import { APP_CONSTANTS as appconstants } from '../../constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';
//REG_TS04_TC02
export async function runPrereq_1746(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1748(page, vars);

  const bidRequestsPage = new BidRequestsPage(page);
  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);
  const Methods = new AddonHelpers(page, vars);
  const profile = testDataManager.getProfileByName('Commitment List');

  if (profile && profile.data) {
    vars['BidReqId'] = profile.data[0]['RequestIDFromPRE_PR_1-1'];
    log.info('Bid ID from TDP: ' + vars['BidReqId']);
  }
  log.info('REG_TS04_TC02 BidReqId: ' + vars['BidReqId']);
  log.tcStart('REG_TS04_TC02', 'Pre-requisite setup for test REG_TS04_TC03');
  try {

    log.step('Navigating to Price Offered and committing selected loan');
    try {
      await correspondentPortalPage.Commitments_Side_Menu.click();
      await correspondentPortalPage.Price_Offered_List_Dropdown.click();
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqId']);
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await priceOfferedPage.BidRequestIDPrice_Offered_New(vars["BidReqId"]).click();
      await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.first().waitFor({ state: 'visible' });
      await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.first().check();
      await priceOfferedPage.Get_Price_Button.click();
      await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
      await priceOfferedPage.Commit_Selected_1_Dropdown.click();
      await priceOfferedPage.Yes_Commit_ButtonPopup.click();
      await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
      Methods.getCurrentTimestamp(appconstants.TIME_FORMATE, 'CommittedTime', appconstants.UTC);
      vars['CommitmentIDPriceOffered'] = await priceOfferedPage.Commitment_IdPrice_Offered.textContent() || '';
      await priceOfferedPage.Okay_ButtonPopup.click();
      log.stepPass('Loan committed. Commitment ID: ' + vars['CommitmentIDPriceOffered']);
    } catch (e) {
      log.stepFail(page, 'Failed to commit selected loan from Price Offered');
      throw e;
    }

    log.step('[prereq-1746] Navigating to Commitment List and verifying new commitment entry');
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
      await expect(commitmentListPage.Commitment_ID_Same_Loan_Num(vars["BidReqId"], vars["CommitmentIDPriceOffered"])).toBeVisible();
      expect(Methods.verifyComparison(vars['TotalCommitmentIDs'], ">", "1"));
      testDataManager.updateProfileData('CommitmentList', { 'Requestidfrom4-2': vars['BidReqId'] });
      log.stepPass('New commitment verified. Total commitments: ' + vars['TotalCommitmentIDs']);
    } catch (e) {
      log.stepFail(page, 'Failed to verify new commitment entry in Commitment List');
      throw e;
    }

    log.tcEnd('PASS');
  } catch (e) {
    await log.captureOnFailure(page, 'REG_TS04_TC02', e);
    log.tcEnd('FAIL');
    throw e;
  }
}