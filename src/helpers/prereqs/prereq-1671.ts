import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1669 } from './prereq-1669';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../constants/app-constants';


const TC_ID = 'PREREQ_1671(REG_TS25_TC02)';
const TC_TITLE = 'Setup: Commit fresh loan, expire bid and restore to Partially Committed status';

export async function runPrereq_1671(page: Page, vars: Record<string, string>): Promise<void> {
 
  await runPrereq_1669(page, vars);

  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const bidRequestsPage = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);
  const Methods = new AddonHelpers(page, vars);
 log.tcStart(TC_ID, TC_TITLE);
  log.step('Prereq 1671: Navigate to Price Offered, commit a fresh loan and verify Partially Committed status');
  try {
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['RequiredBidID']);
    await page.keyboard.press('Enter');
    await priceOfferedPage.Bid_Req_IdPrice_Offered_Page(vars['RequiredBidID']).waitFor({ state: 'visible' });
    await stepGroups.stepGroup_Commits_an_Fresh_Loan_Num(page, vars);
    await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['RequiredBidID']);
    await priceOfferedPage.Bid_Req_IdPrice_Offered_Page(vars['RequiredBidID']).waitFor({ state: 'visible' });
    vars['BidStatusPriceOffered'] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars['RequiredBidID']).textContent() || '';
    Methods.trimtestdata(vars['BidStatusPriceOffered'], 'BidStatusPriceOffered');
    log.info('BidStatusPriceOffered: ' + vars['BidStatusPriceOffered']);
    Methods.verifyString(vars['BidStatusPriceOffered'], 'equals', appconstants.PARTIALLYCOMMITTED);
    log.stepPass('Prereq 1671: Loan committed and bid status confirmed as Partially Committed');
  } catch (e) {
    await log.stepFail(page, 'Prereq 1671: Failed to commit loan or verify Partially Committed status');
    throw e;
  }

  log.step('Prereq 1671: Capture company name and calculate total unlocked loan amount');
  try {
    await priceOfferedPage.Bid_Req_IdPrice_Offered_Page(vars['RequiredBidID']).click();
    vars['CompanyNameDetails'] = await priceOfferedPage.Company_NameDetails.textContent() || '';
    log.info('CompanyNameDetails: ' + vars['CompanyNameDetails']);
    vars['count'] = appconstants.ONE;
    vars['TotalLoanAmount'] = appconstants.ZERO;
    vars['CountOfUnlockedLoans'] = String(await priceOfferedPage.Count_Of_Unlocked_Loans.count());
    log.info('CountOfUnlockedLoans: ' + vars['CountOfUnlockedLoans']);
    while (parseFloat(vars['count']) <= parseFloat(vars['CountOfUnlockedLoans'])) {
      vars['UncommittedLoanAmount'] = await priceOfferedPage.Individual_Loans_AmountPrice_Offered_Details(vars['count']).textContent() || '';
      Methods.performArithmetic(vars['TotalLoanAmount'], 'ADDITION', vars['UncommittedLoanAmount'], 'TotalLoanAmount', 0);
      Methods.MathematicalOperation(vars['count'], '+', '1', 'count');
    }
    Methods.trimtestdata(vars['TotalLoanAmount'], 'TotalLoanAmount');
    log.info('TotalLoanAmount: ' + vars['TotalLoanAmount']);
    log.stepPass('Prereq 1671: Total unlocked loan amount calculated: ' + vars['TotalLoanAmount']);
  } catch (e) {
    await log.stepFail(page, 'Prereq 1671: Failed to calculate total unlocked loan amount');
    throw e;
  }

  log.step('Prereq 1671: Perform expire action and verify expire popup data');
  try {
    await priceOfferedPage.BackTo_PriceofferedPage.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Expire_Pricing_ButtonPrice_Offered(vars['RequiredBidID']).click();
    await priceOfferedPage.Bid_Req_IdExpire_Popup.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Bid_Req_IdExpire_Popup).toContainText(vars['RequiredBidID']);
    await expect(priceOfferedPage.Company_NameActions_Popup).toContainText(vars['CompanyNameDetails']);
    vars['BidValuePopUp'] = await priceOfferedPage.Bid_ValueActions_Popup.textContent() || '';
    Methods.removeMultipleSpecialChars(['$', ','], vars['BidValuePopUp'], 'BidValuePopUp');
    Methods.verifyString(vars['TotalLoanAmount'], 'equals', vars['BidValuePopUp']);
    await expect(priceOfferedPage.Total_LoansActions_Popup).toContainText(vars['CountOfUnlockedLoans']);
    await priceOfferedPage.Yes_Expire_Button.click();
    log.stepPass('Prereq 1671: Expire action performed and popup data verified');
  } catch (e) {
    await log.stepFail(page, 'Prereq 1671: Failed to perform expire action or verify expire popup data');
    throw e;
  }

  log.step('Prereq 1671: Reload page and verify bid status is Expired');
  try {
    await page.reload();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
    await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars['BidReqIdPriceOffered']).waitFor({ state: 'visible' });
    vars['BidStatusPriceOffered'] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars['BidReqIdPriceOffered']).textContent() || '';
    Methods.trimtestdata(vars['BidStatusPriceOffered'], 'BidStatusPriceOffered');
    log.info('BidStatusPriceOffered after expire: ' + vars['BidStatusPriceOffered']);
    Methods.verifyString(vars['BidStatusPriceOffered'], 'equals', appconstants.EXPIRED);
    log.stepPass('Prereq 1671: Bid status confirmed as Expired');
  } catch (e) {
    await log.stepFail(page, 'Prereq 1671: Failed to verify bid status as Expired');
    throw e;
  }

  log.step('Prereq 1671: Open expired bid, verify Get Price button and calculate total loan amount');
  try {
    await priceOfferedPage.Bid_Req_IdPrice_Offered_Page(vars['BidReqIdPriceOffered']).click();
    await correspondentPortalPage.Get_Price_Button.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Get_Price_Button).toBeVisible();
    vars['TotalCountofLoans'] = String(await priceOfferedPage.Total_LoansDetails_Screen.count());
    log.info('TotalCountofLoans: ' + vars['TotalCountofLoans']);
    vars['count'] = appconstants.ONE;
    vars['TotalLoanAmount'] = appconstants.ZERO;
    while (parseFloat(vars['count']) <= parseFloat(vars['TotalCountofLoans'])) {
      vars['IndividualLoanAmount'] = await bidRequestDetailsPage.Individual_Loan_Amount(vars['count']).textContent() || '';
      Methods.performArithmetic(vars['TotalLoanAmount'], 'ADDITION', vars['IndividualLoanAmount'], 'TotalLoanAmount', 0);
      Methods.MathematicalOperation(vars['count'], '+', '1', 'count');
    }
    log.info('TotalLoanAmount from details screen: ' + vars['TotalLoanAmount']);
    log.stepPass('Prereq 1671: Get Price button verified and total loan amount calculated: ' + vars['TotalLoanAmount']);
  } catch (e) {
    await log.stepFail(page, 'Prereq 1671: Failed to verify Get Price button or calculate total loan amount');
    throw e;
  }

  log.step('Prereq 1671: Perform change status action and verify change status popup data');
  try {
    await priceOfferedPage.BackTo_PriceofferedPage.click();
    await priceOfferedPage.Change_StatusPrice_Offered(vars['BidReqIdPriceOffered']).waitFor({ state: 'visible' });
    await priceOfferedPage.Change_StatusPrice_Offered(vars['BidReqIdPriceOffered']).click();
    await priceOfferedPage.Change_Status_ButtonPopup.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.BidReqIdChange_Status_Popoup).toContainText(vars['RequiredBidID']);
    await expect(priceOfferedPage.Company_NameActions_Popup).toContainText(vars['CompanyNameDetails']);
    vars['BidValuePopup'] = await priceOfferedPage.Bid_ValueActions_Popup.textContent() || '';
    Methods.removeMultipleSpecialChars(['$', ','], vars['BidValuePopup'], 'BidValuePopup');
    Methods.verifyString(vars['TotalLoanAmount'], 'equals', vars['BidValuePopup']);
    await expect(priceOfferedPage.Total_LoansActions_Popup).toContainText(vars['TotalCountofLoans']);
    await priceOfferedPage.Change_Status_ButtonPopup.click();
    log.stepPass('Prereq 1671: Change status popup data verified and status change confirmed');
  } catch (e) {
    await log.stepFail(page, 'Prereq 1671: Failed to verify change status popup data or perform status change');
    throw e;
  }

  log.step('Prereq 1671: Reload page and verify bid status is back to Partially Committed');
  try {
    await page.reload();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqIdPriceOffered']);
    await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars['BidReqIdPriceOffered']).waitFor({ state: 'visible' });
    vars['BidStatusPriceOffered'] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1(vars['BidReqIdPriceOffered']).textContent() || '';
    Methods.trimtestdata(vars['BidStatusPriceOffered'], 'BidStatusPriceOffered');
    log.info('BidStatusPriceOffered after change: ' + vars['BidStatusPriceOffered']);
    Methods.verifyString(vars['BidStatusPriceOffered'], 'equals', appconstants.PARTIALLYCOMMITTED);
    log.stepPass('Prereq 1671: Bid status successfully restored to Partially Committed');
    log.tcEnd('PASS');
  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}