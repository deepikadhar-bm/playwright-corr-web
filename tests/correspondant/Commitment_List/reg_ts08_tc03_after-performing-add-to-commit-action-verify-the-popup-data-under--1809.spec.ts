import { test, expect } from '@playwright/test';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
// import { runPrereq_1833 } from '../../../src/helpers/prereqs/prereq-1833';
import { runPrereq_1833 } from '@helpers/prereqs/Commitment_List-Pre-requites/prereq-1833';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';




const TC_ID = 'REG_TS08_TC03';
const TC_TITLE = 'After performing add to commit action, verify the popup data under the total commitment details section';

test.describe('Unassigned', () => {

  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1833(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Navigate to Commitment List and open commitment');
      try {
        await priceOfferedPage.Back_To_Commitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        if (await commitmentListPage.Search_Cancel_Button.isVisible()) {
          await commitmentListPage.Search_Cancel_Button.click();
        }
        
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commitment_IDCommitment_List_Page(vars['BidReqId']).first().click();
        await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
        await commitmentListPage.Total_LoansCommitment_List.click();
        log.stepPass('Commitment opened and Total Loans tab clicked');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Commitment List or open commitment');
        throw e;
      }

      log.step('Open committed loan popup and capture bid request ID, loan number and error check');
      try {
        await priceOfferedPage.Committed_CorrLoan(vars['CommittedCorrLoan']).click();
        await priceOfferedPage.BidReqIdLoan_Details_Popup.waitFor({ state: 'visible' });
        vars['BidReqIDTotalLoansPopup'] = await priceOfferedPage.BidReqIdLoan_Details_Popup.textContent() || '';
        Methods.trimtestdata(vars['BidReqIDTotalLoansPopup'], 'BidReqIDTotalLoansPopup');
        vars['BidLoanNumTotalLoansPopup'] = await priceOfferedPage.Bid_Loan_NumLoan_Details_Popup.textContent() || '';
        Methods.trimtestdata(vars['BidLoanNumTotalLoansPopup'], 'BidLoanNumTotalLoansPopup');
        vars['ErorsCheckTotalLoansPopup'] = await priceOfferedPage.Errors_CheckLoan_Details_Popup.textContent() || '';
        Methods.trimtestdata(vars['ErorsCheckTotalLoansPopup'], 'ErorsCheckTotalLoansPopup');
        log.info('BidReqIDTotalLoansPopup: ' + vars['BidReqIDTotalLoansPopup']);
        log.info('BidLoanNumTotalLoansPopup: ' + vars['BidLoanNumTotalLoansPopup']);
        log.info('ErorsCheckTotalLoansPopup: ' + vars['ErorsCheckTotalLoansPopup']);
        log.stepPass('Loan popup data captured successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture loan popup data');
        throw e;
      }

      log.step('Iterate through all Chase fields in popup and store to test data profile');
      try {
        vars['ChaseFieldCountPopup'] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
        log.info('Chase field count: ' + vars['ChaseFieldCountPopup']);
        vars['count'] = appconstants.ONE;
        const profileName = 'Loan popup Details(Commitment List)';
        while (parseFloat(String(vars['count'])) <= parseFloat(String(vars['ChaseFieldCountPopup']))) {
          log.info('Iteration: '+vars['count']);
          await commitmentListPage.Loan_Details_Text_Popup.click();
          await bidRequestDetailsPage.Individual_Chase_Field_Name_Popup(vars['count']).scrollIntoViewIfNeeded();
          vars['ChaseFieldNamePopupTotalLoans'] = await bidRequestDetailsPage.Individual_Chase_Field_Name_Popup(vars['count']).textContent() || '';
          Methods.trimtestdata(vars['ChaseFieldNamePopupTotalLoans'], 'ChaseFieldNamePopupTotalLoans');
          await commitmentListPage.Individual_Chase_Value_Total_LoansPopup(vars['ChaseFieldNamePopupTotalLoans']).scrollIntoViewIfNeeded();
          vars['ChaseValuePopupTotalLoans'] = await commitmentListPage.Individual_Chase_Value_Total_LoansPopup(vars['ChaseFieldNamePopupTotalLoans']).textContent() || '';
          Methods.trimtestdata(vars['ChaseValuePopupTotalLoans'], 'ChaseValuePopupTotalLoans');
          if (String(vars['ChaseValuePopupTotalLoans']).trim() === '') {
            vars['ChaseValuePopupTotalLoans'] = 'Null';
          }
          log.info('Chase Field Name: ' + vars['ChaseFieldNamePopupTotalLoans']);
          log.info('Chase Field Value: ' + vars['ChaseValuePopupTotalLoans']);
          testDataManager.updatePartialProfileDataByDataIndex(profileName, {
            'Chase Field Name':  vars['ChaseFieldNamePopupTotalLoans'],
            'Chase Field Value': vars['ChaseValuePopupTotalLoans'],
          }, vars['count']);
          Methods.performArithmetic('1', 'ADDITION', vars['count'], 'count', 0);
        }
        log.stepPass('All Chase field data captured and stored to test data profile');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture Chase field data at row: ' + vars['count']);
        throw e;
      }

      log.step('Close the loan details popup');
      try {
        await correspondentPortalPage.Close_Buttonemail_config.click();
        log.stepPass('Loan details popup closed successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to close loan details popup');
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