import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CommitmentDetailsPage } from '../../../src/pages/correspondant/commitment-details';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS04_TC01';
const TC_TITLE = 'Verify the Total loans section, It should display the list of all the loans present in Price offered module';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestsPage: BidRequestsPage;
  let commitmentDetailsPage: CommitmentDetailsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestsPage = new BidRequestsPage(page);
    commitmentDetailsPage = new CommitmentDetailsPage(page);
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

        if (profile && profile.data) {
          vars['BidReqId'] = profile.data[0]['RequestIDFromPRE_PR_1-1'];
          log.info('BidReqId: ' + vars['BidReqId']);
        }
      log.step('Login to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Logged in to Correspondent Portal');
      } catch (e) {
        await log.stepFail(page, 'Failed to login to Correspondent Portal');
        throw e;
      }

      log.step('Navigate to Price Offered List and open bid request');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqId']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidRequestIDPrice_Offered_New(vars['BidReqId']).click();
        await priceOfferedPage.All_Loans_Tabprice_offered_screen.waitFor({ state: 'visible' });
        await bidRequestDetailsPage.Last_Name_Sort_Button.click();
        await priceOfferedPage.Last_Name_Down_ArrowDetails.waitFor({ state: 'visible' });
        vars['TotalLoans'] = String(await priceOfferedPage.Total_LoansDetails_Screen.count());
        log.info('TotalLoans: ' + vars['TotalLoans']);
        log.stepPass('Opened bid request and sorted by last name. TotalLoans: ' + vars['TotalLoans']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Price Offered or open bid: ' + vars['BidReqId']);
        throw e;
      }

      log.step('Iterate through all loans and capture loan details, store to test data profile');
      try {
        vars['count'] = appconstants.ONE;
        const ProfileName='Store All Loans Tab Data from Price Offered to Verify the Commitment List';
       while (parseFloat(String(vars['count'])) <= parseFloat(String(vars['TotalLoans']))) {
          log.info('Processing loan row: ' + vars['count']);
          await commitmentDetailsPage.Bid_ReqID_TextPrice_Offered_Details.click();

          vars['CorrLoanNumAllLoans'] = await priceOfferedPage.Corr_Loan_NumDetails_Screen(vars['count']).textContent() || '';
          // Methods.trimtestdata(vars['CorrLoanNumAllLoans'], 'CorrLoanNumAllLoans');

          vars['LastNameAllLoans'] = await priceOfferedPage.Last_NameDetails_Screen(vars['count']).textContent() || '';
          // Methods.trimtestdata(vars['LastNameAllLoans'], 'LastNameAllLoans');

          vars['LoanAmountAllLoans'] = await priceOfferedPage.Loan_AmountDetails_Screen(vars['count']).textContent() || '';
          // Methods.trimtestdata(vars['LoanAmountAllLoans'], 'LoanAmountAllLoans');

          vars['InterestRateAllLoans'] = await priceOfferedPage.Interest_rateDetails_Screen(vars['count']).textContent() || '';
          // Methods.trimtestdata(vars['InterestRateAllLoans'], 'InterestRateAllLoans');

          vars['ReferenceSecurityAllLoans'] = await priceOfferedPage.Reference_SecurityDetails_Screen(vars['count']).textContent() || '';
          // Methods.trimtestdata(vars['ReferenceSecurityAllLoans'], 'ReferenceSecurityAllLoans');

          vars['ReferenceSecurityPriceAllLoans'] = await priceOfferedPage.Reference_security_priceDetails_Screen(vars['count']).textContent() || '';
          // Methods.trimtestdata(vars['ReferenceSecurityPriceAllLoans'], 'ReferenceSecurityPriceAllLoans');

          vars['GrossPriceAllLoans'] = await priceOfferedPage.Gross_PriceDetails_Screen(vars['count']).textContent() || '';
          // Methods.trimtestdata(vars['GrossPriceAllLoans'], 'GrossPriceAllLoans');

          vars['HedgeRatioAllLoans'] = await priceOfferedPage.Hedge_RatioDetails_Screen(vars['count']).textContent() || '';
          // Methods.trimtestdata(vars['HedgeRatioAllLoans'], 'HedgeRatioAllLoans');

          vars['MarketAdjustmentAllLoans'] = await priceOfferedPage.Market_AdjustmentDetails_Screen(vars['count']).textContent() || '';
          // Methods.trimtestdata(vars['MarketAdjustmentAllLoans'], 'MarketAdjustmentAllLoans');

          vars['CurrentGrossPriceAllLoans'] = await priceOfferedPage.Current_Gross_PriceDetails_Screen(vars['count']).textContent() || '';
          // Methods.trimtestdata(vars['CurrentGrossPriceAllLoans'], 'CurrentGrossPriceAllLoans');

          log.info('Successfully stored the row data:'+vars['count']);

          testDataManager.updatePartialProfileDataByDataIndex(ProfileName, {
            'Corr Loan Num':        vars['CorrLoanNumAllLoans'],
            'Last Name':            vars['LastNameAllLoans'],
            'Loan Amount':          vars['LoanAmountAllLoans'],
            'Interest Rate':        vars['InterestRateAllLoans'],
            'Ref Sec Prod':         vars['ReferenceSecurityAllLoans'],
            'Ref Sec Price':        vars['ReferenceSecurityPriceAllLoans'],
            'Gross Price':          vars['GrossPriceAllLoans'],
            'Hedge Ratio':          vars['HedgeRatioAllLoans'],
            'Mark Adj':             vars['MarketAdjustmentAllLoans'],
            'Current Gross Price':  vars['CurrentGrossPriceAllLoans'],
          },vars['count']);

          // const isLocked = await priceOfferedPage.Committed_Loan_Lock_iconDetail_Screen(vars['CorrLoanNumAllLoans']).isVisible();
          if (await priceOfferedPage.Committed_Loan_Lock_iconDetail_Screen(vars['CorrLoanNumAllLoans']).isVisible()) {
            vars['CommitmentOderAllLoans'] = await priceOfferedPage.Commitment_OrderDetails_Screen(vars['CorrLoanNumAllLoans']).textContent() || '';
            Methods.trimtestdata(vars['CommitmentOderAllLoans'], 'CommitmentOderAllLoans');
            log.info('Loan is locked CommitmentOrder: ' + vars['CommitmentOderAllLoans']);
            testDataManager.updatePartialProfileDataByDataIndex(ProfileName, {
              'Locked Loan':      'Yes',
              'Commitment Order': vars['CommitmentOderAllLoans'],
          },vars['count']);
          } else {
            log.info('Loan is not locked');
            testDataManager.updatePartialProfileDataByDataIndex(ProfileName, {
              'Locked Loan':      'None',
              'Commitment Order': 'None',
            },vars['count']);
          }

          Methods.MathematicalOperation(vars['count'], '+', 1, 'count');
        }
        log.stepPass('loan details captured and stored to test data profile for row:'+vars['count']);
      } catch (e) {
        await log.stepFail(page, 'Failed to capture loan details at row: ' + vars['count']);
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