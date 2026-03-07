// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test('REG_TS18_TC01_Ensure the sorting filter works correctly in both ascending and descending order - Verify for the list screen and the detail screen', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    vars["CountOfColumnHeaders"] = String(await priceOfferedPage.Columns_Headers.count());
    vars["HeadersUI"] = "#Loans / #Errors and Bid Value";
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String("8"))) {
      vars["IndividualHeaderUI"] = await priceOfferedPage.Individual_Column_Header_UI(vars["count"]).textContent() || '';
      Methods.trimtestdata(vars["IndividualHeaderUI"], "IndividualHeaderUI");
      if (String(vars["HeadersUI"]).includes(String(vars["IndividualHeaderUI"]))) {
        await page.waitForLoadState('networkidle');
      } else {
        await priceOfferedPage.Individual_Column_Header_UI(vars["count"]).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
        await priceOfferedPage.First_Column_Data_UI(vars["IndividualHeaderUI"]).first().waitFor({ state: 'visible' });
        await Methods.verifyStringOrder(priceOfferedPage.Column_Data_UI_Commom_xpath(vars["IndividualHeaderUI"]), undefined, 'ascending');
        await priceOfferedPage.Individual_Column_Header_UI(vars["count"]).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
        await priceOfferedPage.First_Column_Data_UI(vars["IndividualHeaderUI"]).waitFor({ state: 'visible' });
        await page.waitForTimeout(4000);
        await Methods.verifyStringOrder(priceOfferedPage.Column_Data_UI_Commom_xpath(vars["IndividualHeaderUI"]), undefined, 'descending');
      }
      Methods.MathematicalOperation(vars["count"], "+", "1", "count");
    }
    vars["BidValue"] = await priceOfferedPage.BidValue.textContent() || '';
    await priceOfferedPage.BidValue.click();
    await page.waitForLoadState('networkidle');
    await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.BidValue_Column.first().waitFor({ state: 'visible' });
    await Methods.verifyNumericOrder(priceOfferedPage.BidValue_Column, undefined, 'ascending');
    await priceOfferedPage.BidValue.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
    await priceOfferedPage.BidValue_Column.first().waitFor({ state: 'visible' });
    await page.waitForTimeout(4000);
    await Methods.verifyNumericOrder(priceOfferedPage.BidValue_Column, undefined, 'descending');
  });
});
