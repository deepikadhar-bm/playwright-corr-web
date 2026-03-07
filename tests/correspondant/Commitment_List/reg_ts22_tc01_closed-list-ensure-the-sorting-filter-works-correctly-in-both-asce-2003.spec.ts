// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test('REG_TS22_TC01_Closed List : Ensure the sorting filter works correctly in both ascending and descending order - Verify for the list screen', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
    await commitmentListPage.Closed_List_Tab.hover();
    await commitmentListPage.Closed_List_Tab.click();
    await page.waitForLoadState('networkidle'),
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });

    vars["CountOfColumnHeaders"] = String(await priceOfferedPage.Columns_Headers.count());
    vars["HeadersUI"] = "Comm. Loans and Comm. Amount and Amt. Delivered";
    vars["HeadersUI1"] = "Comm. Date and Closed Date and Expiration Date";
    vars["count"] = "1";

    while (parseFloat(vars["count"]) <= 11) {
      vars["IndividualHeaderUI"] = await priceOfferedPage.Individual_Column_Header_UI(vars["count"]).textContent() || '';
      Methods.trimtestdata(vars["IndividualHeaderUI"], "IndividualHeaderUI");

      if (vars["HeadersUI"].includes(vars["IndividualHeaderUI"])) {
        await page.waitForLoadState('networkidle');
        await commitmentListPage.Individual_Column_Header_UI_Commitment_List(vars["count"]).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
        await priceOfferedPage.First_Column_Data_UI(vars["IndividualHeaderUI"]).waitFor({ state: 'visible' });
        await commitmentListPage.Closed_Date.waitFor({ state: 'visible' });
        await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderUI"]), undefined, 'ascending');

        await commitmentListPage.Individual_Column_Header_UI_Commitment_List(vars["count"]).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
        await priceOfferedPage.First_Column_Data_UI(vars["IndividualHeaderUI"]).waitFor({ state: 'visible' });
        await page.waitForTimeout(4000);
        await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderUI"]), undefined, 'descending');

      } else if (vars["HeadersUI1"].includes(vars["IndividualHeaderUI"])) {
        await page.waitForLoadState('networkidle');
        await commitmentListPage.Individual_Column_Header_UI_Commitment_List(vars["count"]).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
        await priceOfferedPage.First_Column_Data_UI(vars["IndividualHeaderUI"]).waitFor({ state: 'visible' });
        // await commitmentListPage.Closed_Date.waitFor({ state: 'visible' });
        await Methods.verifyDateOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderUI"]), 'ascending', 'MM/dd/yyyy');
        await commitmentListPage.Individual_Column_Header_UI_Commitment_List(vars["count"]).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
        await priceOfferedPage.First_Column_Data_UI(vars["IndividualHeaderUI"]).waitFor({ state: 'visible' });
        await page.waitForTimeout(4000);
        await Methods.verifyDateOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderUI"]), 'descending', 'MM/dd/yyyy');

      } else {
        await commitmentListPage.Individual_Column_Header_UI_Commitment_List(vars["count"]).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
        await priceOfferedPage.First_Column_Data_UI(vars["IndividualHeaderUI"]).waitFor({ state: 'visible' });
        await commitmentListPage.Closed_Date.waitFor({ state: 'visible' });
        await Methods.verifyStringOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderUI"]), undefined, 'ascending');

        await commitmentListPage.Individual_Column_Header_UI_Commitment_List(vars["count"]).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
        await priceOfferedPage.First_Column_Data_UI(vars["IndividualHeaderUI"]).waitFor({ state: 'visible' });
        await page.waitForTimeout(4000);
        await Methods.verifyStringOrder(priceOfferedPage.Column_Data_UI(vars["IndividualHeaderUI"]), undefined, 'descending');
      }

      Methods.MathematicalOperation(vars["count"], "+", "1", "count");
    }
  });
});