// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments'
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = "REG_TS22_TC01";
const TC_TITLE = " Closed List : Ensure the sorting filter works correctly in both ascending and descending order - Verify for the list screen";

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
      log.step('Navigating to Commitment closed list');
      try {
      await correspondentPortalPage.Commitments_Side_Menu.click();
      await commitmentListPage.Committed_List_Dropdown.click();
      await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
      await commitmentListPage.Closed_List_Tab.hover();
      await commitmentListPage.Closed_List_Tab.click();
      await page.waitForLoadState('networkidle');
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await commitmentListPage.Commitment_List_Text.waitFor({ state: 'visible' });
      await expect(commitmentListPage.Commitment_List_Text).toBeVisible();
      await commitmentListPage.Closed_Date.waitFor({ state: 'visible' });
      await expect(commitmentListPage.Closed_Date).toBeVisible();
      log.stepPass("Navigating to Commitment closed list is successful");
      }
      catch (e) {
        log.stepFail(page, 'Fail to navigate closed list');
        throw e;
      }
      log.step('Verification of list screen screen sorting order both ascending and descending');
      try {
      vars["CountOfColumnHeaders"] = String(await priceOfferedPage.Columns_Headers.count());
      vars["HeadersUI"] = appconstants.HeadersUI;
      vars["HeadersUI1"] = appconstants.HeadersUI1;
      vars["count"] = "1";
      while (parseFloat(vars["count"]) <= 11) {
        vars["IndividualHeaderUI"] = await priceOfferedPage.Individual_Column_Header_UI(vars["count"]).textContent() || '';
        Methods.trimtestdata(vars["IndividualHeaderUI"], "IndividualHeaderUI");
        if (vars["HeadersUI"].includes(vars["IndividualHeaderUI"])) {
          log.info("if condition passed:" + vars["IndividualHeaderUI"]);
          await page.waitForLoadState('networkidle');
          await commitmentListPage.Individual_Column_Header_UI_Commitment_List(vars["count"]).click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
          await priceOfferedPage.First_Column_Data_UI(vars["IndividualHeaderUI"]).waitFor({ state: 'visible' });
          await commitmentListPage.Closed_Date.waitFor({ state: 'visible' });
          log.info("Ascending order -"+ vars["IndividualHeaderUI"]);
          await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderUI"]), undefined, 'ascending');
          await commitmentListPage.Individual_Column_Header_UI_Commitment_List(vars["count"]).click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
          await priceOfferedPage.First_Column_Data_UI(vars["IndividualHeaderUI"]).waitFor({ state: 'visible' });
          await page.waitForTimeout(4000);
          log.info("Descending order -"+ vars["IndividualHeaderUI"]);
          await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderUI"]), undefined, 'descending');

        } else if (vars["HeadersUI1"].includes(vars["IndividualHeaderUI"])) {
          log.info("else if condition passed:" + vars["IndividualHeaderUI"]);
          await page.waitForLoadState('networkidle');
          await commitmentListPage.Individual_Column_Header_UI_Commitment_List(vars["count"]).click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
          await priceOfferedPage.First_Column_Data_UI(vars["IndividualHeaderUI"]).waitFor({ state: 'visible' });
          log.info("Ascending order -"+ vars["IndividualHeaderUI"]);
          await Methods.verifyDateOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderUI"]), 'ascending', 'MM/dd/yyyy');
          await commitmentListPage.Individual_Column_Header_UI_Commitment_List(vars["count"]).click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
          await priceOfferedPage.First_Column_Data_UI(vars["IndividualHeaderUI"]).waitFor({ state: 'visible' });
          await page.waitForTimeout(4000);
          log.info("Descending order -"+vars["IndividualHeaderUI"]);
          await Methods.verifyDateOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderUI"]), 'descending', 'MM/dd/yyyy');

        } else {
          log.info("else condition passed:" + vars["IndividualHeaderUI"]);
          await commitmentListPage.Individual_Column_Header_UI_Commitment_List(vars["count"]).click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
          await priceOfferedPage.First_Column_Data_UI(vars["IndividualHeaderUI"]).waitFor({ state: 'visible' });
          await commitmentListPage.Closed_Date.waitFor({ state: 'visible' });
          log.info("Ascending order -"+ vars["IndividualHeaderUI"]);
          await Methods.verifyStringOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderUI"]), undefined, 'ascending');
          await commitmentListPage.Individual_Column_Header_UI_Commitment_List(vars["count"]).click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
          await priceOfferedPage.First_Column_Data_UI(vars["IndividualHeaderUI"]).waitFor({ state: 'visible' });
          await page.waitForTimeout(4000);
          log.info("Descending order -"+vars["IndividualHeaderUI"]);
          await Methods.verifyStringOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderUI"]), undefined, 'descending');
        }
        Methods.MathematicalOperation(vars["count"], "+", "1", "count");
      }
        log.stepPass("Verification of list screen screen sorting order both ascending and descending is successful");
      }
      catch (e) {
        log.stepFail(page, 'Fail to Verify list screen screen sorting order');
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