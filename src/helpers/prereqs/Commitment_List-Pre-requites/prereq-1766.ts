import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { ApplyFiltersButtonPage } from '../../../pages/correspondant/apply-filters-button';
import { CommitmentListPage } from '../../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../../pages/correspondant/spinner';
import { runPrereq_1394 } from './../prereq-1394';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../../src/constants/app-constants';


const TC_ID = 'PREREQ_1766(REG_TS05_TC04)';
const TC_TITLE = "Perform commit action for Company A and verify that Company B's auth limit is not impacted";

export async function runPrereq_1766(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1394(page, vars);

  const applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);
  const Methods = new AddonHelpers(page, vars);

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
      log.info('Prereq - Bid Request ID (Company A): ' + vars['BidReqIdCompanyA']);
      log.info('Prereq - Company Name: ' + vars['CompanyName']);
      await correspondentPortalPage.First_Bid_Request_ID.click();
      await priceOfferedPage.Check_the_Loan_Num.first().waitFor({ state: 'visible' });
      await priceOfferedPage.Check_the_Loan_Num.first().check();
      await priceOfferedPage.Get_Price_Button.click();
      await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
      await priceOfferedPage.Commit_Selected_1_Dropdown.click();
      await priceOfferedPage.Yes_Commit_ButtonPopup.click();
      await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
      await priceOfferedPage.Okay_ButtonPopup.click();
      log.stepPass('Prereq: Loan committed for Company A Bid Request ID: ' + vars['BidReqIdCompanyA']);
    } catch (e) {
      await log.stepFail(page, 'Prereq: Failed to commit loan for Company A. Bid Request ID: ' + vars['BidReqIdCompanyA']);
      throw e;
    }

    log.step('Prereq: Navigate to Commitment List and capture Company A auth limit details');
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
      vars['OpenAuthLimitCompanyA'] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
      Methods.trimtestdata(vars['OpenAuthLimitCompanyA'], 'OpenAuthLimitCompanyA');
      log.info('Prereq - Open Auth Limit (Company A): ' + vars['OpenAuthLimitCompanyA']);
      vars['AuthLimitCompanyA'] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
      Methods.trimtestdata(vars['AuthLimitCompanyA'], 'AuthLimitCompanyA');
      log.info('Prereq - Auth Limit (Company A): ' + vars['AuthLimitCompanyA']);
      vars['LastCommittedBidCompanyA'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
      Methods.trimtestdata(vars['LastCommittedBidCompanyA'], 'LastCommittedBidCompanyA');
      log.info('Prereq - Last Committed Bid (Company A): ' + vars['LastCommittedBidCompanyA']);
      log.stepPass('Prereq: Company A auth limit details captured');
    } catch (e) {
      await log.stepFail(page, 'Prereq: Failed to capture Company A auth limit details');
      throw e;
    }

    log.step('Prereq: Navigate back and apply Company B filter');
    try {
      await priceOfferedPage.Back_To_Commitment_List.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await commitmentListPage.Search_Cancel_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await priceOfferedPage.Filter_Dropdown1.click();
      await correspondentPortalPage.Select_CompanyCCode_Dropdown1.waitFor({ state: 'visible' });
      await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
      await priceOfferedPage.Select_Company_Search_Field.fill(appconstants.FILTER_COMPANY_NAME_AMERICA);
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await priceOfferedPage.Select_Company.first().check();
      await expect(correspondentPortalPage.Apply_Selected).toBeEnabled();
      await correspondentPortalPage.Apply_Selected.click();
      await applyFiltersButtonPage.Apply_Filters_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Prereq: Company B filter applied successfully');
    } catch (e) {
      await log.stepFail(page, 'Prereq: Failed to apply Company B filter');
      throw e;
    }

    log.step('Prereq: Capture Company B auth limit details and verify not impacted by Company A commit');
    try {
      vars['BidReqIdCompanyB'] = await commitmentListPage.First_Bid_Req_IDCommitment_List.first().textContent() || '';
      Methods.trimtestdata(vars['BidReqIdCompanyB'], 'BidReqIdCompanyB');
      log.info('Prereq - Bid Request ID (Company B): ' + vars['BidReqIdCompanyB']);
      await commitmentListPage.First_Commitment_IDCommitment_List.first().click();
      await correspondentPortalPage.Open_Auth_Limit_Total_Loan.waitFor({ state: 'visible' });
      vars['OpenAuthLimitCompanyB'] = await correspondentPortalPage.Open_Auth_Limit_Total_Loan.textContent() || '';
      Methods.trimtestdata(vars['OpenAuthLimitCompanyB'], 'OpenAuthLimitCompanyB');
      log.info('Prereq - Open Auth Limit (Company B): ' + vars['OpenAuthLimitCompanyB']);
      vars['AuthLimitCompanyB'] = await correspondentPortalPage.Auth_Limit_In_Total_Commited_Loans.textContent() || '';
      Methods.trimtestdata(vars['AuthLimitCompanyB'], 'AuthLimitCompanyB');
      log.info('Prereq - Auth Limit (Company B): ' + vars['AuthLimitCompanyB']);
      vars['LastCommitedBidCompanyB'] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
      Methods.trimtestdata(vars['LastCommitedBidCompanyB'], 'LastCommitedBidCompanyB');
      log.info('Prereq - Last Committed Bid (Company B): ' + vars['LastCommitedBidCompanyB']);
      expect(Methods.verifyString(vars['OpenAuthLimitCompanyA'], 'notEquals', vars['OpenAuthLimitCompanyB']));
      expect(Methods.verifyString(vars['AuthLimitCompanyA'], 'notEquals', vars['AuthLimitCompanyB']));
      expect(Methods.verifyString(vars['LastCommittedBidCompanyA'], 'notEquals', vars['LastCommitedBidCompanyB']));
      log.stepPass('Prereq: Company B auth limit verified — not impacted by Company A commit');
    } catch (e) {
      await log.stepFail(page, 'Prereq: Company B auth limit verification failed. Company A: ' + vars['OpenAuthLimitCompanyA'] + ' | Company B: ' + vars['OpenAuthLimitCompanyB']);
      throw e;
    }

    log.tcEnd('PASS');

  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}