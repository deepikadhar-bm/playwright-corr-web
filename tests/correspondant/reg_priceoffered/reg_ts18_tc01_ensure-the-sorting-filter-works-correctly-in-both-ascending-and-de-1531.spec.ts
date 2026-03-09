import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments'
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = "REG_TS18_TC01";
const TC_TITLE = " Ensure the sorting filter works correctly in both ascending and descending order - Verify for the list screen and the detail screen";

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
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
      log.step('Verification of list screen screen sorting order both ascending and descending');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        vars["CountOfColumnHeaders"] = String(await priceOfferedPage.Columns_Headers.count());
        vars["HeadersUI"] = appconstants.HeadersUi;
        vars["count"] = "1";
        while (parseFloat(String(vars["count"])) <= parseFloat(String("8"))) {
          vars["IndividualHeaderUI"] = await priceOfferedPage.Individual_Column_Header_UI(vars["count"]).textContent() || '';
          Methods.trimtestdata(vars["IndividualHeaderUI"], "IndividualHeaderUI");
          if (String(vars["HeadersUI"]).includes(String(vars["IndividualHeaderUI"]))) {
            log.info("if condition passed");
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          } else {
            log.info("else condition is passed");
            log.info("Ascending order -" + vars["IndividualHeaderUI"]);
            await priceOfferedPage.Individual_Column_Header_UI(vars["count"]).click();
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });
            await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
            await priceOfferedPage.First_Column_Data_UI(vars["IndividualHeaderUI"]).first().waitFor({ state: 'visible' });
            await Methods.verifyStringOrder(priceOfferedPage.Column_Data_UI_Commom_xpath(vars["IndividualHeaderUI"]), undefined, 'ascending');
            log.info("Descending order -" + vars["IndividualHeaderUI"]);
            await priceOfferedPage.Individual_Column_Header_UI(vars["count"]).click();
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });
            await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
            await priceOfferedPage.First_Column_Data_UI(vars["IndividualHeaderUI"]).waitFor({ state: 'visible' });
            await page.waitForTimeout(4000);
            await Methods.verifyStringOrder(priceOfferedPage.Column_Data_UI_Commom_xpath(vars["IndividualHeaderUI"]), undefined, 'descending');
          }
          Methods.MathematicalOperation(vars["count"], "+", "1", "count");
        }
        log.stepPass("Verification of list screen screen sorting order both ascending and descending is successful");
      }
      catch (e) {
        log.stepFail(page, 'Fail to Verify list screen screen sorting order');
        throw e;
      }
      log.step('Verification of list screen screen sorting order both ascending and descending for bid value');
      try {
        vars["BidValue"] = await priceOfferedPage.BidValue.textContent() || '';
        log.info("Ascending order for Bid value");
        await priceOfferedPage.BidValue.click();
        await page.waitForLoadState('networkidle');
        await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidValue_Column.first().waitFor({ state: 'visible' });
        await Methods.verifyNumericOrder(priceOfferedPage.BidValue_Column, undefined, 'ascending');
        log.info("Descending order for Bid value");
        await priceOfferedPage.BidValue.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
        await priceOfferedPage.BidValue_Column.first().waitFor({ state: 'visible' });
        await page.waitForTimeout(4000);
        await Methods.verifyNumericOrder(priceOfferedPage.BidValue_Column, undefined, 'descending');
        log.stepPass("Verification of list screen screen sorting order both ascending and descending for bid value is successful");
      }
      catch (e) {
        log.stepFail(page, 'Fail to verify list screen screen sorting order both ascending and descending for bid value');
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
