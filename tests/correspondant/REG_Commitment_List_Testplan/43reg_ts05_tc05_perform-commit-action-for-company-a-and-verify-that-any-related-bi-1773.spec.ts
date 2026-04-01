import { test, expect } from '@playwright/test';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
// import { runPrereq_1766 } from '../../../src/helpers/prereqs/prereq-1766';
import { runPrereq_1766 } from '@helpers/prereqs/Commitment_List-Pre-requites/prereq-1766';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';

const TC_ID    = 'REG_TS05_TC05';
const TC_TITLE = 'Perform commit action for Company A and verify that any related bid from that company record should display the latest value';

test.describe('Commitment List - TS_2', () => {

  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1766(page, vars);
    applyFiltersButtonPage  = new ApplyFiltersButtonPage(page);
    commitmentListPage      = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage        = new PriceOfferedPage(page);
    spinnerPage             = new SpinnerPage(page);
    Methods                 = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Navigate to Commitment List and capture auth limit for Bid Request 1');
      try {
        await priceOfferedPage.Back_To_Commitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Clear_all_ButtonCommitment_List.click();
        vars['BidReqId1'] = vars['RequestIDDetails'];
        log.info('Bid Request ID 1: ' + vars['BidReqId1']);
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqId1']);
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.First_Commitment_IDCommitment_List.click();
        await correspondentPortalPage.Open_Auth_Limit_Total_Loan.waitFor({ state: 'visible' });
        vars['OpenAuthLimitBidReq1']    = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
        Methods.trimtestdata(vars['OpenAuthLimitBidReq1'], 'OpenAuthLimitBidReq1');
        log.info('Open Auth Limit (Bid Req 1): ' + vars['OpenAuthLimitBidReq1']);
        vars['AuthLimitBidReq1']        = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
        Methods.trimtestdata(vars['AuthLimitBidReq1'], 'AuthLimitBidReq1');
        log.info('Auth Limit (Bid Req 1): ' + vars['AuthLimitBidReq1']);
        vars['LastCommitedBidBidReq1']  = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.trimtestdata(vars['LastCommitedBidBidReq1'], 'LastCommitedBidBidReq1');
        log.info('Last Committed Bid (Bid Req 1): ' + vars['LastCommitedBidBidReq1']);
        log.stepPass('Auth limit captured for Bid Request 1: ' + vars['BidReqId1']);
      } catch (e) {
        await log.stepFail(page, 'Failed to capture auth limit for Bid Request 1: ' + vars['BidReqId1']);
        throw e;
      }

      log.step('Apply Company Name filter and capture auth limit for Bid Request 2');
      try {
        await priceOfferedPage.Back_To_Commitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Search_Cancel_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Filter_Dropdown1.click();
        await correspondentPortalPage.Select_CompanyCCode_Dropdown1.waitFor({ state: 'visible' });
        await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
        await priceOfferedPage.Select_Company_Search_Field.fill(vars['CompanyName']);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Check_the_Req_Company_Name.check();
        await expect(correspondentPortalPage.Apply_Selected).toBeEnabled();
        await correspondentPortalPage.Apply_Selected.click();
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        vars['BidReqId2'] = await commitmentListPage.BidReqId2Commitment_List_Screen(vars["CompanyName"],vars["BidReqId1"]).first().textContent() || '';
        Methods.trimtestdata(vars['BidReqId2'], 'BidReqId2');
        log.info('Bid Request ID 2: ' + vars['BidReqId2']);
        await priceOfferedPage.Commitment_ID2Commitment_List_Page(vars["BidReqId2"]).first().click();
        await correspondentPortalPage.Open_Auth_Limit_Total_Loan.waitFor({ state: 'visible' });
        vars['OpenAuthLimitBidReqId2']   = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
        Methods.trimtestdata(vars['OpenAuthLimitBidReqId2'], 'OpenAuthLimitBidReqId2');
        log.info('Open Auth Limit (Bid Req 2): ' + vars['OpenAuthLimitBidReqId2']);
        vars['AuthLimitBidReqId2']       = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
        Methods.trimtestdata(vars['AuthLimitBidReqId2'], 'AuthLimitBidReqId2');
        log.info('Auth Limit (Bid Req 2): ' + vars['AuthLimitBidReqId2']);
        vars['LastCommitedBidBidReqId2'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.trimtestdata(vars['LastCommitedBidBidReqId2'], 'LastCommitedBidBidReqId2');
        log.info('Last Committed Bid (Bid Req 2): ' + vars['LastCommitedBidBidReqId2']);
        log.stepPass('Auth limit values captured for Bid Request 2: ' + vars['BidReqId2']);
      } catch (e) {
        await log.stepFail(page, 'Failed to capture auth limit values for Bid Request 2');
        throw e;
      }

      log.step('Verify auth limit values match between Bid Request 1 and Bid Request 2');
      try {
        expect(Methods.verifyString(vars['OpenAuthLimitBidReq1'], 'equals', vars['OpenAuthLimitBidReqId2']));
        expect(Methods.verifyString(vars['AuthLimitBidReq1'], 'equals', vars['AuthLimitBidReqId2']));
        expect(Methods.verifyString(vars['LastCommitedBidBidReq1'], 'equals', vars['LastCommitedBidBidReqId2']));
        testDataManager.updateProfileData('CommitmentList', { 'RequestIdFrom5-5': vars['BidReqId1'] });
        log.info('Test data updated: CommitmentList[RequestIdFrom5-5] = ' + vars['BidReqId1']);
        log.stepPass('Auth limit values match Bid Req 1 Open Auth values');
      } catch (e) {
        await log.stepFail(page, 'Auth limit values are mismatch with Bid Req1');
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