import { test, expect } from '@playwright/test';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1739 } from '../../../src/helpers/prereqs/Commitment_List-Pre-requites/prereq-1739';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS04_TC01.1';
const TC_TITLE = 'Verify the Total loans section, It should display the list of all the loans present in Price offered module';

test.describe('Commitment List - TS_2', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1739(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  const profileName = 'Store All Loans Tab Data from Price Offered to Verify the Commitment List';
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Navigate to Commitment List and open Total Loans tab');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commitment_IDCommitment_List_Page(vars['BidReqId']).first().click();
        await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
        await commitmentListPage.Total_LoansCommitment_List.click();
        await bidRequestDetailsPage.Last_Name_Sort_Button.waitFor({ state: 'visible' });
        await bidRequestDetailsPage.Last_Name_Sort_Button.click();
        await priceOfferedPage.Last_Name_Down_ArrowDetails.waitFor({ state: 'visible' });
        vars['TotalLoans'] = String(await priceOfferedPage.Total_LoansDetails_Screen.count());
        log.info('TotalLoans: ' + vars['TotalLoans']);
        log.stepPass('Navigated to Total Loans tab for BidReqId: ' + vars['BidReqId'] + ' | TotalLoans: ' + vars['TotalLoans']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Commitment List or open Total Loans tab');
        throw e;
      }

      log.step('Verifying loan details against test data for each row');
      try {
        vars['count'] = appconstants.ONE;
        const dataList = profile?.data as Record<string, any>[];
        for (let i = 0; i < Number(vars['TotalLoans']); i++) {
          log.info('verification of row data:' + vars['count']);
          vars['CorrLoanNum'] = dataList[i]['Corr Loan Num'];
          vars['LockedLoan'] = dataList[i]['Locked Loan'];
          vars['CommitmentOrder'] = dataList[i]['Commitment Order'];
          vars['LastName'] = dataList[i]['Last Name'];
          vars['LoanAmount'] = dataList[i]['Loan Amount'];
          vars['InterestRate'] = dataList[i]['Interest Rate'];
          vars['RefSecProd'] = dataList[i]['Ref Sec Prod'];
          vars['RefSecPrice'] = dataList[i]['Ref Sec Price'];
          vars['GrossPrice'] = dataList[i]['Gross Price'];
          vars['HedgeRatio'] = dataList[i]['Hedge Ratio'];
          vars['MarkAdj'] = dataList[i]['Mark Adj'];
          vars['CurrentGrossPrice'] = dataList[i]['Current Gross Price'];
          if (String(vars['LockedLoan']) === 'Yes') {
            await expect(commitmentListPage.Committed_Loan_Locked_iconCommitment_List(vars['CorrLoanNum'])).toBeVisible();
            await expect(commitmentListPage.Commitment_OrderCommitment_List_Details(vars['CorrLoanNum'])).toContainText(vars['CommitmentOrder']);
            log.info('Locked loan verified — CommitmentOrder: ' + vars['CommitmentOrder']);
          }

          await expect(priceOfferedPage.Corr_Loan_NumDetails_Screen(vars['count'])).toContainText(vars['CorrLoanNum']);
          await expect(priceOfferedPage.Last_NameDetails_Screen(vars['count'])).toContainText(vars['LastName']);
          await expect(priceOfferedPage.Loan_AmountDetails_Screen(vars['count'])).toContainText(vars['LoanAmount']);
          await expect(priceOfferedPage.Interest_rateDetails_Screen(vars['count'])).toContainText(vars['InterestRate']);
          await expect(priceOfferedPage.Reference_SecurityDetails_Screen(vars['count'])).toContainText(vars['RefSecProd']);
          await expect(priceOfferedPage.Reference_security_priceDetails_Screen(vars['count'])).toContainText(vars['RefSecPrice']);
          await expect(priceOfferedPage.Gross_PriceDetails_Screen(vars['count'])).toContainText(vars['GrossPrice']);
          await expect(priceOfferedPage.Hedge_RatioDetails_Screen(vars['count'])).toContainText(vars['HedgeRatio']);
          await expect(priceOfferedPage.Market_AdjustmentDetails_Screen(vars['count'])).toContainText(vars['MarkAdj']);
          await expect(priceOfferedPage.Current_Gross_PriceDetails_Screen(vars['count'])).toContainText(vars['CurrentGrossPrice']);
          Methods.MathematicalOperation(vars['count'], '+', 1, 'count');
          log.info('Total loans data verified successfully row:' + vars['count']);
        }
        log.stepPass('All loan details verified successfully against test data');
      } catch (e) {
        await log.stepFail(page, 'Total loans data verification failed row: ' + vars['count']);
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