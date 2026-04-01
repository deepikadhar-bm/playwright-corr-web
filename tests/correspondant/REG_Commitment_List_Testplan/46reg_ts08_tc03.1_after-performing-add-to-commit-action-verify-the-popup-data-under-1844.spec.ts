import { test, expect } from '@playwright/test';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
// import { runPrereq_1809 } from '../../../src/helpers/prereqs/prereq-1809';
import { runPrereq_1809 } from '@helpers/prereqs/Commitment_List-Pre-requites/prereq-1809';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS08_TC03.1';
const TC_TITLE = 'After performing add to commit action, verify the popup data under the total commitment details section';


test.describe('Commitment List - TS_2', () => {

  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1809(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  const profileName = 'Loan popup Details(Commitment List)';
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Navigate to Total Committed Loans tab and open committed loan popup');
      try {
        await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
        await commitmentListPage.Total_Committed_Loans_Tab.click();
        await priceOfferedPage.Committed_CorrLoan(vars['CommittedCorrLoan']).scrollIntoViewIfNeeded();
        await priceOfferedPage.Committed_CorrLoan(vars['CommittedCorrLoan']).click();
        await priceOfferedPage.BidReqIdLoan_Details_Popup.waitFor({ state: 'visible' });
        log.stepPass('Committed loan popup opened successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to open committed loan popup');
        throw e;
      }

      log.step('Verify popup header fields — Bid Request ID, Loan Number and Errors Check');
      try {
        await expect(priceOfferedPage.BidReqIdLoan_Details_Popup).toContainText(vars['BidReqIDTotalLoansPopup']);
        await expect(priceOfferedPage.Bid_Loan_NumLoan_Details_Popup).toContainText(vars['BidLoanNumTotalLoansPopup']);
        await expect(priceOfferedPage.Errors_CheckLoan_Details_Popup).toContainText(vars['ErorsCheckTotalLoansPopup']);
        log.info('BidReqIDTotalLoansPopup: ' + vars['BidReqIDTotalLoansPopup']);
        log.info('BidLoanNumTotalLoansPopup: ' + vars['BidLoanNumTotalLoansPopup']);
        log.info('ErorsCheckTotalLoansPopup: ' + vars['ErorsCheckTotalLoansPopup']);
        log.stepPass('Popup header fields verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Popup header fields verification failed');
        throw e;
      }

      log.step('Iterate through Chase fields and verify against test data profile');
      try {
        vars['ChaseFieldCountPopup'] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
        log.info('Chase field count: ' + vars['ChaseFieldCountPopup']);
        vars['count'] = appconstants.ONE;
        const dataList = profile?.data as Record<string, any>[];
        for (let i = 0; i < Number(vars['ChaseFieldCountPopup']); i++) {
          log.info('Verifying Chase field row: ' + vars['count']);
          await commitmentListPage.Loan_Details_Text_Popup.click();
          vars['ChaseFieldNamePopupTotalCommittedLoans'] = await bidRequestDetailsPage.Individual_Chase_Field_Name_Popup(vars['count']).textContent() || '';
          Methods.trimtestdata(vars['ChaseFieldNamePopupTotalCommittedLoans'], 'ChaseFieldNamePopupTotalCommittedLoans');
          vars['ChaseValuePopupTotalCommittedLoans'] = await commitmentListPage.Individual_Chase_ValueTotal_Committed_Loans_Popup(vars['ChaseFieldNamePopupTotalCommittedLoans']).textContent() || '';
          Methods.trimtestdata(vars['ChaseValuePopupTotalCommittedLoans'], 'ChaseValuePopupTotalCommittedLoans');
          vars['ChaseFieldName'] = dataList[i]['Chase Field Name'];
          vars['ChaseFieldValue'] = dataList[i]['Chase Field Value'];
          log.info('Expected Chase Field Name: ' + vars['ChaseFieldName']);
          log.info('Expected Chase Field Value: ' + vars['ChaseFieldValue']);
          log.info('Actual Chase Field Name: ' + vars['ChaseFieldNamePopupTotalCommittedLoans']);
          log.info('Actual Chase Field Value: ' + vars['ChaseValuePopupTotalCommittedLoans']);
          await expect(bidRequestDetailsPage.Individual_Chase_Field_Name_Popup(vars['count'])).toContainText(vars['ChaseFieldName']);
          if (String(vars['ChaseValuePopupTotalCommittedLoans']).trim() === '') {
            Methods.verifyString( vars['ChaseFieldValue'], 'equals', 'Null');
          } else {
            await expect(commitmentListPage.Individual_Chase_ValueTotal_Committed_Loans_Popup(vars['ChaseFieldNamePopupTotalCommittedLoans'])).toContainText(vars['ChaseFieldValue']);
          }
          Methods.MathematicalOperation(vars['count'], '+', 1, 'count');
        }
        log.stepPass('All Chase field data verified successfully against test data profile');
      } catch (e) {
        await log.stepFail(page, 'Chase field verification failed at row: ' + vars['count']);
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