import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS06_TC01';
const TC_TITLE = 'Verify that when the loans is selected for commitment, then we should be able to see the selected loan amount value and commit selected button should have that selected loan count displayed';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  const profileName = 'Price Offered';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  ``

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {
      if (profile && profile.data) {
        vars['RequestIDCreated1stScenario'] = profile.data[0]['RequestIDCreated1stScenario'];
        log.info('RequestIDCreated1stScenario: ' + vars['RequestIDCreated1stScenario']);
      }
      log.step('Login to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to Correspondent Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to Correspondent Portal failed');
        throw e;
      }
      log.step('Navigate to Price Offered screen and verify elements are visible');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.waitFor({ state: 'visible' });
        await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDCreated1stScenario"]);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.First_bid_id.click();
        await expect(correspondentPortalPage.Get_Price_Button).toBeVisible();
        await expect(priceOfferedPage.Select_all_for_Checkboxprice_offered_screen).toBeVisible();
        await expect(priceOfferedPage.First_Check_Boxprice_offered_screen.first()).toBeVisible();
        log.stepPass('Navigated to Price Offered and verified elements successfully');
      } catch (e) {
        log.stepFail(page, 'Failed to Navigate to Price Offered screen or verify its elements');
        throw e;
      }

      log.step('Select first loan and verify loan amount and count match between table and footer');
      try {
        await priceOfferedPage.First_Check_Boxprice_offered_screen.first().check();
        vars["LoanAmount(table)"] = await priceOfferedPage.Loan_amount_For_First_Selected_Check_Boxprice_offered_screen.first().textContent() || '';
        vars["TotalLoanAmountCount(table)"] = String(await priceOfferedPage.Loan_amount_For_First_Selected_Check_Boxprice_offered_screen.count());
        log.info('LoanAmount(table): ' + vars['LoanAmount(table)']);
        log.info('TotalLoanAmountCount(table): ' + vars['TotalLoanAmountCount(table)']);

        Methods.removeMultipleSpecialChars(['$', ','], vars["LoanAmount(table)"], 'TotalLoanAmount(table)');
        Methods.trimtestdata(vars["TotalLoanAmount(table)"], 'TotalLoanAmount(table)');

        vars["LoanAmount(footer)"] = await priceOfferedPage.Selected_Loan_Amount_Footer_Displayprice_offered.textContent() || '';
        Methods.removeMultipleSpecialChars(['$', ','], vars["LoanAmount(footer)"], 'TotalLoanAmount(footer)');
        log.info('TotalLoanAmount(table): ' + vars['TotalLoanAmount(table)']);
        log.info('TotalLoanAmount(footer): ' + vars['TotalLoanAmount(footer)']);
        expect(Methods.verifyString(vars["TotalLoanAmount(table)"], 'equals', vars["TotalLoanAmount(footer)"]));

        vars["LoanAmountCount(footer)"] = await priceOfferedPage.Commit_Selected_Count_Footer_Displayprice_offered.textContent() || '';
        Methods.removeMultipleSpecialChars(['(', ')'], vars["LoanAmountCount(footer)"], 'TotalLoanAmountCount(footer)');
        Methods.trimtestdata(vars["TotalLoanAmountCount(footer)"], 'TotalLoanAmountCount(footer)');
        log.info('TotalLoanAmountCount(table): ' + vars['TotalLoanAmountCount(table)']);
        log.info('TotalLoanAmountCount(footer): ' + vars['TotalLoanAmountCount(footer)']);
        expect(Methods.verifyString(vars["TotalLoanAmountCount(table)"], 'equals', vars["TotalLoanAmountCount(footer)"]));

        await expect(priceOfferedPage.Selected_Loan_Amt_Footer_Textprice_offered).toContainText("Selected Loan Amt");
        log.stepPass('First loan amount and count verified successfully between table and footer');
      } catch (e) {
        log.stepFail(page, 'Loan amount or count mismatch between table and footer for first loan selection');
        throw e;
      }

      log.step('Uncheck first loan and verify footer elements are still visible');
      try {
        await priceOfferedPage.First_Check_Boxprice_offered_screen.first().uncheck();
        await expect(priceOfferedPage.First_Check_Boxprice_offered_screen.first()).not.toBeChecked();
        await expect(priceOfferedPage.Select_all_for_Checkboxprice_offered_screen).not.toBeChecked();
        await expect(priceOfferedPage.Commit_Selected_Count_Footer_Displayprice_offered).not.toBeVisible();
        await expect(priceOfferedPage.Selected_Loan_Amount_Footer_Displayprice_offered).not.toBeVisible();
        await expect(priceOfferedPage.Selected_Loan_Amt_Footer_Textprice_offered).not.toBeVisible();
        log.stepPass('First loan unchecked and footer elements verified visible successfully');
      } catch (e) {
        log.stepFail(page, 'Footer elements not visible after unchecking first loan');
        throw e;
      }

      log.step('Select all unchecked loans and verify cumulative loan amount and count match footer');
      try {
        vars["checkedboxcount(table)"] = appconstants.ZERO;
        vars["total"] = appconstants.ZERO;
        vars["count1"] = appconstants.ONE;
        vars["UncheckedCheckBoxCount(table)"] = String(await priceOfferedPage.All_UnChecked_Check_Boxprice_offered_screen.count());
        log.info('UncheckedCheckBoxCount(table): ' + vars['UncheckedCheckBoxCount(table)']);

        while (parseFloat(vars["count1"]) <= parseFloat(vars["UncheckedCheckBoxCount(table)"])) {
          log.info('Selecting Row: ' + vars['count1']);
          await priceOfferedPage.All_Unchecked_Check_box2price_offered_screen(vars['count1']).check();
          await expect(priceOfferedPage.All_Unchecked_Check_box2price_offered_screen(vars['count1'])).toBeChecked();
          vars["SelectedLoanAmount(table)"] = await priceOfferedPage.Loan_Amount_Only_Selected_Check_Boxprice_offered_screen(vars['count1']).textContent() || '';
          Methods.removeMultipleSpecialChars(['$', ','], vars["SelectedLoanAmount(table)"], 'SelectedLoanAmountValue(table)');
          Methods.MathematicalOperation(vars["checkedboxcount(table)"], '+', 1, 'checkedboxcount(table)');
          Methods.MathematicalOperation(vars["total"], '+', vars["SelectedLoanAmountValue(table)"], 'total');
          Methods.MathematicalOperation(vars["count1"], '+', 1, 'count1');
        }

        vars["totalcheckedboxcount(table)"] = vars["checkedboxcount(table)"];
        vars["TotalSelectedLoanAmountValue(table)"] = vars["total"];
        Methods.trimtestdata(vars["TotalSelectedLoanAmountValue(table)"], 'TotalSelectedLoanAmountValue(table)');
        log.info('totalcheckedboxcount(table): ' + vars['totalcheckedboxcount(table)']);
        log.info('TotalSelectedLoanAmountValue(table): ' + vars['TotalSelectedLoanAmountValue(table)']);

        vars["LoanAmount(footer)"] = await priceOfferedPage.Selected_Loan_Amount_Footer_Displayprice_offered.textContent() || '';
        Methods.removeMultipleSpecialChars(['$', ','], vars["LoanAmount(footer)"], 'TotalLoanAmount(footer)');
        log.info('TotalLoanAmount(footer): ' + vars['TotalLoanAmount(footer)']);
        Methods.verifyString(vars["TotalSelectedLoanAmountValue(table)"], 'equals', vars["TotalLoanAmount(footer)"]);

        await expect(priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered).toBeVisible();

        vars["LoanCount(footer)"] = await priceOfferedPage.Commit_Selected_Count_Footer_Displayprice_offered.textContent() || '';
        Methods.removeMultipleSpecialChars(['(', ')'], vars["LoanCount(footer)"], 'TotalLoanCount(footer)');
        Methods.trimtestdata(vars["TotalLoanCount(footer)"], 'TotalLoanCount(footer)');
        log.info('TotalLoanCount(footer): ' + vars['TotalLoanCount(footer)']);
        expect(Methods.verifyString(vars["totalcheckedboxcount(table)"], 'equals', vars["TotalLoanCount(footer)"]));

        await expect(priceOfferedPage.Selected_Loan_Amt_Footer_Textprice_offered).toContainText(appconstants.SELECTED_LOAN_AMOUNT_TEXT);
        log.stepPass('All unchecked loans selected — cumulative loan amount and count verified successfully against footer');
      } catch (e) {
        log.stepFail(page, 'Cumulative loan amount or count mismatch between table and footer after selecting all loans');
        throw e;
      }

      log.step('Uncheck first loan and verify remaining selected loans amount and count match footer');
      try {
        await expect(priceOfferedPage.First_Check_Boxprice_offered_screen.first()).toBeVisible();
        await expect(priceOfferedPage.First_Check_Boxprice_offered_screen).toBeChecked();
        await priceOfferedPage.First_Check_Boxprice_offered_screen.first().uncheck();
        await expect(priceOfferedPage.First_Check_Boxprice_offered_screen).not.toBeChecked();

        vars["total"] = appconstants.ZERO;
        vars["count1"] = appconstants.ONE;
        vars["TotalCheckedCount(from second checkbox)"] = String(await priceOfferedPage.Checked_Checkbox_Count_From_Second_Checkboxprice_offered_screen.count());
        log.info('TotalCheckedCount(from second checkbox): ' + vars['TotalCheckedCount(from second checkbox)']);

        while (parseFloat(vars["count1"]) <= parseFloat(vars["TotalCheckedCount(from second checkbox)"])) {
          log.info('Processing Row: ' + vars['count1']);
          await expect(priceOfferedPage.Checked_Checkbox_Count_From_Second_Checkbox2price_offered_screen(vars['count1'])).toBeVisible();
          vars["LoanAmount"] = await priceOfferedPage.Loan_Amount_From_Second_Checked_Checkboxprice_offered(vars["count1"]).textContent() || '';
          Methods.removeMultipleSpecialChars(['$', ','], vars["LoanAmount"], 'LoanAmountValue');
          Methods.MathematicalOperation(vars["total"], '+', vars["LoanAmountValue"], 'total');
          Methods.MathematicalOperation(vars["count1"], '+', 1, 'count1');
        }

        vars["TotalDisplayedLoanAmount(table)"] = vars["total"];
        Methods.trimtestdata(vars["TotalDisplayedLoanAmount(table)"], 'TotalDisplayedLoanAmount(table)');
        log.info('TotalDisplayedLoanAmount(table): ' + vars['TotalDisplayedLoanAmount(table)']);

        await expect(priceOfferedPage.Selected_Loan_Amount_Footer_Displayprice_offered).toBeVisible();
        vars["DisplayedLoanAmount(footer)"] = await priceOfferedPage.Selected_Loan_Amount_Footer_Displayprice_offered.textContent() || '';
        Methods.removeMultipleSpecialChars(['$', ','], vars["DisplayedLoanAmount(footer)"], 'TotalDisplayedLoanAmount(footer)');
        log.info('TotalDisplayedLoanAmount(footer): ' + vars['TotalDisplayedLoanAmount(footer)']);
        Methods.verifyString(vars["TotalDisplayedLoanAmount(table)"], 'equals', vars["TotalDisplayedLoanAmount(footer)"]);

        await expect(priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered).toBeVisible();

        vars["DisplayedLoanCount(footer)"] = await priceOfferedPage.Commit_Selected_Count_Footer_Displayprice_offered.textContent() || '';
        Methods.removeMultipleSpecialChars(['(', ')'], vars["DisplayedLoanCount(footer)"], 'TotalDisplayedLoanCount(footer)');
        expect(Methods.trimtestdata(vars["TotalDisplayedLoanCount(footer)"], 'TotalDisplayedLoanCount(footer)'));
        log.info('TotalDisplayedLoanCount(footer): ' + vars['TotalDisplayedLoanCount(footer)']);
        Methods.verifyString(vars["TotalCheckedCount(from second checkbox)"], 'equals', vars["TotalDisplayedLoanCount(footer)"]);

        await expect(priceOfferedPage.Selected_Loan_Amt_Footer_Textprice_offered).toContainText("Selected Loan Amt");
        log.stepPass('Remaining selected loans amount and count verified successfully against footer after unchecking first loan');
      } catch (e) {
        log.stepFail(page, 'Loan amount or count mismatch after unchecking first loan from all selected loans');
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