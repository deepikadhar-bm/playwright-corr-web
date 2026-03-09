import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments'


const TC_ID = "REG_TS22_TC02";
const TC_TITLE = "Closed List : Ensure the sorting filter works correctly in both ascending and descending order - Verify for the detail screen";

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;
    log.tcStart(TC_ID, TC_TITLE);
    try {
      log.step('Login to application');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to corr appication successful');
      }
      catch (e) {
        log.stepFail(page, 'Login to corr appication Failed');
        throw e;
      }
      log.step('Navigating to Commitment closed list and click on required loan number');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
        await page.waitForTimeout(1000);
        await commitmentListPage.Closed_List_Tab.scrollIntoViewIfNeeded();
        await commitmentListPage.Closed_List_Tab.dispatchEvent('click');
        await page.waitForLoadState('networkidle');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commitment_List_Text.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Commitment_List_Text).toBeVisible();
        await commitmentListPage.Closed_Date.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Closed_Date).toBeVisible();
        await commitmentListPage.Commitment_IDMore_Than_one_Commited_Loan.first().waitFor({ state: 'visible' });
        await page.waitForLoadState('networkidle');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commitment_IDMore_Than_one_Commited_Loan.first().scrollIntoViewIfNeeded();
        await commitmentListPage.Commitment_IDMore_Than_one_Commited_Loan.first().click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForLoadState('networkidle');
        log.stepPass("Navigating to Commitment closed list and click on required loan number is successful");
      }
      catch (e) {
        log.stepFail(page, 'failed to click required loan number');
        throw e;
      }
      log.step('Verifying sort order in Total Committed Loans Tab');
      try {
        await expect(commitmentListPage.Total_LoansCommitment_List).toBeVisible();
        await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
        await commitmentListPage.Total_Committed_Loans_Tab.dispatchEvent('click');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForLoadState('networkidle');
        await priceOfferedPage.Column_Headers_Details_ScreenUI.first().waitFor({ state: 'visible' });
        vars["IndividualHeadersCommitmentList"] = "Loan Amount and Ref Sec Price and Gross Price and Hedge Ratio and Curr Market Value and Curr Gross and Chase Loan# and Mark Adj";
        vars["ColumnHeadersDetailsScreenUI"] = String(await priceOfferedPage.Column_Headers_Details_ScreenUI.count());
        console.log("First loop header count: " + vars["ColumnHeadersDetailsScreenUI"]);
        vars["count"] = "1";
        while (parseFloat(vars["count"]) <= parseFloat(vars["ColumnHeadersDetailsScreenUI"])) {
          vars["IndividualHeaderScreenDetails"] = await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List(vars["count"]).textContent() || '';
          Methods.trimtestdata(vars["IndividualHeaderScreenDetails"], "IndividualHeaderScreenDetails");
          log.info('verifying ascending order for headername:' + vars["IndividualHeaderScreenDetails"]);
          await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List(vars["count"]).click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await page.waitForLoadState('networkidle');
          await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
          await priceOfferedPage.Column_Header_Data(vars["IndividualHeaderScreenDetails"]).waitFor({ state: 'visible' });

          if (vars["IndividualHeadersCommitmentList"].includes(vars["IndividualHeaderScreenDetails"])) {
            log.info("Ascending order -"+"if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'ascending');
          } else {
            log.info("Ascending order -"+"else condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyStringOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'ascending');
          }

          log.info('verifying Descending sort order for headername:' + vars["IndividualHeaderScreenDetails"]);
          await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List(vars["count"]).click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
          await priceOfferedPage.Column_Header_Data(vars["IndividualHeaderScreenDetails"]).waitFor({ state: 'visible' });
          if (vars["IndividualHeadersCommitmentList"].includes(vars["IndividualHeaderScreenDetails"])) {
            log.info("Descending order -"+"if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'descending');
          } else {
            log.info("Descending order -"+"else condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyStringOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'descending');
          }

          Methods.MathematicalOperation(vars["count"], "+", "1", "count");
        }
        log.stepPass('Verifying sort order in Total Committed Loans Tab is successful');
      }
      catch (e) {
        log.stepFail(page, 'Fail to verify sort order in total committed loans tab');
        throw e;
      }

      log.step('Verifying sort order in Total Loans Tab');
      try {
        await commitmentListPage.Total_LoansCommitment_List.scrollIntoViewIfNeeded();
        await commitmentListPage.Total_LoansCommitment_List.dispatchEvent('click');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForLoadState('networkidle');
        await priceOfferedPage.Open_Auth_Limit.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Open_Auth_Limit).toBeVisible();
        await priceOfferedPage.Column_Headers_Details_ScreenUI.first().waitFor({ state: 'visible' });

        vars["ColumnHeadersDetailsScreenUI"] = String(await priceOfferedPage.Column_Headers_Details_ScreenUI.count());
        console.log("Second loop header count: " + vars["ColumnHeadersDetailsScreenUI"]);
        vars["count"] = "1";

        while (parseFloat(vars["count"]) <= parseFloat(vars["ColumnHeadersDetailsScreenUI"])) {
          vars["IndividualHeaderScreenDetails"] = await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List(vars["count"]).textContent() || '';
          Methods.trimtestdata(vars["IndividualHeaderScreenDetails"], "IndividualHeaderScreenDetails");

          log.info('verifying ascending order for headername:' + vars["IndividualHeaderScreenDetails"]);
          await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List(vars["count"]).click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await page.waitForLoadState('networkidle');
          await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
          await priceOfferedPage.Column_Header_Data(vars["IndividualHeaderScreenDetails"]).waitFor({ state: 'visible' });

          if (vars["IndividualHeadersCommitmentList"].includes(vars["IndividualHeaderScreenDetails"])) {
            log.info("Ascending order -"+"if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'ascending');
          } else {
            log.info("Ascending order -"+"else condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyStringOrder(priceOfferedPage.Column_Data_UI_DetainsScreen(vars["IndividualHeaderScreenDetails"]), undefined, 'ascending');
          }

          log.info('verifying Descending sort order for headername:' + vars["IndividualHeaderScreenDetails"]);
          await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List(vars["count"]).click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
          await priceOfferedPage.Column_Header_Data(vars["IndividualHeaderScreenDetails"]).waitFor({ state: 'visible' });

          if (vars["IndividualHeadersCommitmentList"].includes(vars["IndividualHeaderScreenDetails"])) {
            log.info("Descending order -"+"if condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'descending');
          } else {
            log.info("Descending order -"+"else condition is passed:" + vars["IndividualHeaderScreenDetails"]);
            await Methods.verifyStringOrder(priceOfferedPage.Column_Data_UI_DetainsScreen(vars["IndividualHeaderScreenDetails"]), undefined, 'descending');
          }

          Methods.MathematicalOperation(vars["count"], "+", "1", "count");
        }
        log.stepPass('Verifying sort order in Total Loans Tab is successful');
      }
      catch (e) {
        log.stepFail(page, 'Fail to verify sort order in total loans tab');
        throw e;
      }
    }
    catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});