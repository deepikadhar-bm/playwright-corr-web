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

  test('REG_TS22_TC02_Closed List : Ensure the sorting filter works correctly in both ascending and descending order - Verify for the detail screen', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
    await commitmentListPage.Closed_List_Tab.hover();
    await commitmentListPage.Closed_List_Tab.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await page.waitForLoadState('networkidle');
    vars["IndividualHeadersCommitmentList"] = "Loan Amount and Ref Sec Price and Gross Price and Hedge Ratio and Curr Market Value and Curr Gross and Chase Loan# and Mark Adj";
    await commitmentListPage.Commitment_IDMore_Than_one_Commited_Loan.first().scrollIntoViewIfNeeded();
    await commitmentListPage.Commitment_IDMore_Than_one_Commited_Loan.first().click();
    await expect(commitmentListPage.Total_LoansCommitment_List).toBeVisible();
    vars["ColumnHeadersDetailsScreenUI"] = String(await priceOfferedPage.Column_Headers_Details_ScreenUI.count());
    vars["count"] = "1";
    while (parseFloat(vars["count"]) <= parseFloat(vars["ColumnHeadersDetailsScreenUI"])) {
      vars["IndividualHeaderScreenDetails"] = await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List(vars["count"]).textContent() || '';
      console.log("IndividualHeaderScreenDetails:", vars["IndividualHeaderScreenDetails"]);
      Methods.trimtestdata(vars["IndividualHeaderScreenDetails"], "IndividualHeaderScreenDetails");

      await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List(vars["count"]).click();
      await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
      await priceOfferedPage.Column_Header_Data(vars["IndividualHeaderScreenDetails"]).waitFor({ state: 'visible' });

      if (vars["IndividualHeadersCommitmentList"].includes(vars["IndividualHeaderScreenDetails"])) {
        await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'ascending');
      } else {
        await Methods.verifyStringOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'ascending');
      }

      await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List(vars["count"]).click();
      await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
      await priceOfferedPage.Column_Header_Data(vars["IndividualHeaderScreenDetails"]).waitFor({ state: 'visible' });
      await page.waitForTimeout(4000);

      if (vars["IndividualHeadersCommitmentList"].includes(vars["IndividualHeaderScreenDetails"])) {
        await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'descending');
      } else {
        await Methods.verifyStringOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'descending');
      }

      Methods.MathematicalOperation(vars["count"], "+", "1", "count");
    }
    vars["count"] = "1";
    await commitmentListPage.Total_LoansCommitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["ColumnHeadersDetailsScreenUI"] = String(await priceOfferedPage.Column_Headers_Details_ScreenUI.count());

    while (parseFloat(vars["count"]) <= parseFloat(vars["ColumnHeadersDetailsScreenUI"])) {
      vars["IndividualHeaderScreenDetails"] = await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List(vars["count"]).textContent() || '';
      Methods.trimtestdata(vars["IndividualHeaderScreenDetails"], "IndividualHeaderScreenDetails");

      await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List(vars["count"]).click();
      await expect(correspondentPortalPage.Header_Sort_Down).toBeVisible();
      await priceOfferedPage.Column_Header_Data("IndividualHeaderScreenDetails").waitFor({ state: 'visible' });

      if (vars["IndividualHeadersCommitmentList"].includes(vars["IndividualHeaderScreenDetails"])) {
        await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'ascending');
      } else {
        await Methods.verifyStringOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'ascending');
      }

      await commitmentListPage.Individual_Column_Header_Details_Screen_Commitment_List(vars["count"]).click();
      await expect(priceOfferedPage.Header_Sort_Up_Symbol).toBeVisible();
      await priceOfferedPage.Column_Header_Data("IndividualHeaderScreenDetails").waitFor({ state: 'visible' });
      await page.waitForTimeout(4000);

      if (vars["IndividualHeadersCommitmentList"].includes(vars["IndividualHeaderScreenDetails"])) {
        await Methods.verifyNumericOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'descending');
      } else {
        await Methods.verifyStringOrder(priceOfferedPage.Column_Data_Details_Screen(vars["IndividualHeaderScreenDetails"]), undefined, 'descending');
      }

      Methods.MathematicalOperation(vars["count"], "+", "1", "count");
    }
  });
});