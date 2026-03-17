import { test, expect } from '@playwright/test';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID    = 'REG_TS05_TC04';
const TC_TITLE = "Perform commit action for Company A and verify that Company B's auth limit is not impacted";

test.describe('Unassigned', () => {

  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
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

      log.step('Navigate to Price Offered list and commit a loan for Company A');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.click();
        vars['BidReqIdCompanyA'] = vars['RequestIDDetails'];
        await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars['BidReqIdCompanyA']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['CompanyName'] = await priceOfferedPage.Company_NamePrice_Offered.textContent() || '';
        Methods.trimtestdata(vars['CompanyName'], 'CompanyName');
        log.info('Bid Request ID (Company A): ' + vars['BidReqIdCompanyA']);
        log.info('Company Name: ' + vars['CompanyName']);
        await correspondentPortalPage.First_Bid_Request_ID.click();
        await priceOfferedPage.Check_the_Loan_Num.first().waitFor({ state: 'visible' });
        await priceOfferedPage.Check_the_Loan_Num.first().check();
        await priceOfferedPage.Get_Price_Button.click();
        await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        await priceOfferedPage.Okay_ButtonPopup.click();
        log.stepPass('Loan committed for Company A. Bid Request ID: ' + vars['BidReqIdCompanyA']);
      } catch (e) {
        await log.stepFail(page, 'Failed to commit loan for Company A. Bid Request ID: ' + vars['BidReqIdCompanyA']);
        throw e;
      }

      log.step('Navigate to Commitment List and capture Company A auth limit details');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqIdCompanyA']);
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.First_Commitment_IDCommitment_List.first().click();
        await correspondentPortalPage.Open_Auth_Limit_Total_Loan.waitFor({ state: 'visible' });
        vars['OpenAuthLimitCompanyA']    = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
        vars['AuthLimitCompanyA']        = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
        vars['LastCommittedBidCompanyA'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        Methods.trimtestdata(vars['OpenAuthLimitCompanyA'], 'OpenAuthLimitCompanyA');
        Methods.trimtestdata(vars['AuthLimitCompanyA'], 'AuthLimitCompanyA');
        Methods.trimtestdata(vars['LastCommittedBidCompanyA'], 'LastCommittedBidCompanyA');
        log.info('Open Auth Limit (Company A): ' + vars['OpenAuthLimitCompanyA']);
        log.info('Auth Limit (Company A): ' + vars['AuthLimitCompanyA']);
        log.info('Last Committed Bid (Company A): ' + vars['LastCommittedBidCompanyA']);
        log.stepPass('Company A auth limit details captured');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture Company A auth limit details');
        throw e;
      }

      log.step('Navigate back and apply Company B filter');
      try {
        await priceOfferedPage.Back_To_Commitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Search_Cancel_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Filter_Dropdown1.click();
        await correspondentPortalPage.Select_CompanyCCode_Dropdown1.waitFor({ state: 'visible' });
        await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
        await priceOfferedPage.Select_Company_Search_Field.fill(appconstants.FILTER_COMPANY_NAME_AMERICA);
        await priceOfferedPage.Select_Company.first().check();
        await expect(correspondentPortalPage.Apply_Selected).toBeEnabled();
        await correspondentPortalPage.Apply_Selected.click();
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Company B filter applied successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to apply Company B filter');
        throw e;
      }

      log.step('Capture Company B auth limit details and verify not impacted by Company A commit');
      try {
        vars['BidReqIdCompanyB'] = await commitmentListPage.First_Bid_Req_IDCommitment_List.first().textContent() || '';
        Methods.trimtestdata(vars['BidReqIdCompanyB'], 'BidReqIdCompanyB');
        log.info('Bid Request ID (Company B): ' + vars['BidReqIdCompanyB']);
        await commitmentListPage.First_Commitment_IDCommitment_List.first().click();
        await correspondentPortalPage.Open_Auth_Limit_Total_Loan.waitFor({ state: 'visible' });
        vars['OpenAuthLimitCompanyB']   = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
        Methods.trimtestdata(vars['OpenAuthLimitCompanyB'], 'OpenAuthLimitCompanyB');
        vars['AuthLimitCompanyB']       = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
        vars['LastCommitedBidCompanyB'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
        
        Methods.trimtestdata(vars['AuthLimitCompanyB'], 'AuthLimitCompanyB');
        Methods.trimtestdata(vars['LastCommitedBidCompanyB'], 'LastCommitedBidCompanyB');
        log.info('Open Auth Limit (Company B): ' + vars['OpenAuthLimitCompanyB']);
        log.info('Auth Limit (Company B): ' + vars['AuthLimitCompanyB']);
        log.info('Last Committed Bid (Company B): ' + vars['LastCommitedBidCompanyB']);
        expect(Methods.verifyString(vars['OpenAuthLimitCompanyA'], 'notContains', vars['OpenAuthLimitCompanyB']));
        expect(Methods.verifyString(vars['AuthLimitCompanyA'], 'notContains', vars['AuthLimitCompanyB']));
        expect(Methods.verifyString(vars['LastCommittedBidCompanyA'], 'notContains', vars['LastCommitedBidCompanyB']));
        log.stepPass('Company B auth limit verified — not impacted by Company A commit');
      } catch (e) {
        await log.stepFail(page, 'Company B auth limit verification failed. Company A: ' + vars['OpenAuthLimitCompanyA'] + ' | Company B: ' + vars['OpenAuthLimitCompanyB']);
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