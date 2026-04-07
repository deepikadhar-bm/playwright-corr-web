import { test, expect } from '@playwright/test';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { runPrereq_1455 } from '../../../src/helpers/prereqs/prereq-1455';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS10_TC01.1';
const TC_TITLE = 'Perform selecting a unique loan Verify the bid, loan value, and selected loan count displayed in the Commit Selected Loans popup';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let priceOfferedPage: PriceOfferedPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1455(page, vars);
    priceOfferedPage = new PriceOfferedPage(page);
    Methods = new AddonHelpers(page, vars);
  });
  const profileName = 'All Loans Tab - Committed Loans Tab(Price offered)';
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step('Verifying loan details against test data for each row');
      try {

        vars["count"] = appconstants.ONE;
        const dataList = profile?.data as Record<string, any>[];
        for (let i = 0; i < Number(2); i++) {
          log.info('verification of row data:' + vars['count'])
          vars['CommitOrder'] = dataList[i]['CommitOrder'];
          vars['CorrLoan'] = dataList[i]['Corr Loan'];
          vars['LastName'] = dataList[i]['Last Name'];
          vars['LoanAmount'] = dataList[i]['Loan Amount'];
          vars['InterestRate'] = dataList[i]['Int Rate'];
          vars['RefSecProd'] = dataList[i]['Ref Sec Prod'];
          vars['RefSecPrice'] = dataList[i]['Ref Sec Price'];
          vars['GrossPrice'] = dataList[i]['Gross Price'];
          vars['HedgeRatio'] = dataList[i]['Hedge Ratio'];
          vars['MarkAdj'] = dataList[i]['Mark Adj'];
          vars['CurrentGrossPrice'] = dataList[i]['Curr Gross'];
          await expect(priceOfferedPage.Locked_Loan_CommitOrder(vars['count'])).toContainText(vars["CommitOrder"]);
          await expect(priceOfferedPage.Corr_Loan_price_offered_table(vars['count'])).toContainText(vars["CorrLoan"]);
          await expect(priceOfferedPage.Last_Nameprice_offered_table(vars['count'])).toContainText(vars["LastName"]);
          await expect(priceOfferedPage.Loan_Amountprice_offered_table(vars['count'])).toContainText(vars["LoanAmount"]);
          await expect(priceOfferedPage.Int_Rateprice_offered_table(vars['count'])).toContainText(vars["InterestRate"]);
          await expect(priceOfferedPage.Ref_Sec_Prodprice_offered_table(vars['count'])).toContainText(vars["RefSecProd"]);
          await expect(priceOfferedPage.Ref_Sec_Priceprice_offered_table(vars['count'])).toContainText(vars["RefSecPrice"]);
          await expect(priceOfferedPage.Gross_Priceprice_offered_table(vars['count'])).toContainText(vars["GrossPrice"]);
          await expect(priceOfferedPage.Hedge_Ratioprice_offered_table(vars['count'])).toContainText(vars["HedgeRatio"]);
          await expect(priceOfferedPage.Mark_Adjprice_offered_table(vars['count'])).toContainText(vars["MarkAdj"]);
          await expect(priceOfferedPage.Curr_Grossprice_offered_table(vars['count'])).toContainText(vars["CurrentGrossPrice"]);
          log.info('Locked loans data verified successfully row:' + vars['count']);
          Methods.MathematicalOperation(vars['count'], '+', 1, 'count');
          
        }
        log.stepPass('All loan details verified successfully against test data');
      } catch (e) {
        await log.stepFail(page, 'Total loans data verification failed row: ' + vars['count']);
        throw e;
      }
       log.step('Verifying Auth values after commiting loans');
      try {
      await expect(priceOfferedPage.LockedCommitted_Loans_Count).toContainText(vars["CountOfCommittedLoans"]);
      expect(Methods.verifyString(vars['ActualOpenAuthLimit'], 'equals', vars['ExpectedOpenAuthLimit']));
      expect(Methods.verifyString(vars['ActualOpenAuthLimitPercentage'], 'equals', vars['ExpectedOpenAuthLimitPercentage']));
      await expect(priceOfferedPage.Auth_Limit).toContainText(vars["ActualAuthLimit"]);
      expect(Methods.verifyString(vars['LastCommittedBidTimeAndDate'], 'equals', vars['BidCommittedDateAndTime']));
      expect(Methods.verifyString(vars['LastCommittedBidLoanLoanAmount'], 'equals', vars['TotalLoanAmountSelectedBids']));
      log.stepPass('Auth values verified successfully after commit');
      } catch (e) {
        await log.stepFail(page, 'Auth values verification is failed after commit');
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