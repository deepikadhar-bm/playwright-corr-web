// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS11_TC01_Verify the Export action ', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    vars["FirstCommitmentId"] = await commitmentListPage.First_Commitment_IDCommitment_List.textContent() || '';
    vars["FirstCommitmentId"] = String(vars["FirstCommitmentId"]).trim();
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["FirstCommitmentId"]);
    await priceOfferedPage.Commitment_Id_DropdownCommitment_List_Page.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["RowCount"] = String(await priceOfferedPage.Total_Rows_Count_UIDetails.count());
    vars["RowCountUI"] = "1";
    vars["RowCountExcel"] = "1";
    await priceOfferedPage.Select_All_Loan_Num.click();
    await correspondentPortalPage.Export_Selected_1_Button.waitFor({ state: 'visible' });
    await correspondentPortalPage.Export_Selected_1_Button.click();
    // Wait for download - handled by Playwright download events
    await page.waitForTimeout(2000);
    await stepGroups.stepGroup_Headers_Verification(page, vars);
    // [DISABLED] Verification of Data from Excel to UI - Excluding Headers(Commitments)
    // await stepGroups.stepGroup_Verification_of_Data_from_Excel_to_UI_Excluding_HeadersCommi(page, vars);
    // [DISABLED] Verification of Data from Excel to UI - Excluding Headers (Commitments) - 2
    // await stepGroups.stepGroup_Verification_of_Data_from_Excel_to_UI_Excluding_Headers_Comm(page, vars);
    await stepGroups.stepGroup_Verification_of_Data_from_Excel_to_UI_Excluding_Headers_Comm(page, vars);
  });
});
