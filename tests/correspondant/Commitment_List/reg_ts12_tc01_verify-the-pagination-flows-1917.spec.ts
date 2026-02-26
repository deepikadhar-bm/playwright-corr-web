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

  test('REG_TS12_TC01_Verify the pagination flows', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await correspondentPortalPage.Change_Page_Size_Dropdown.click();
    vars["CountOfSetPageSize"] = String(await commitmentListPage.Set_page_size_to_Dropdown.count());
    await correspondentPortalPage.Change_Page_Size_Dropdown.click();
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountOfSetPageSize"]))) {
      await correspondentPortalPage.Change_Page_Size_Dropdown.click();
      vars["IndividualSetPageSize"] = await commitmentListPage.Individual_Set_Page_Size.textContent() || '';
      await commitmentListPage.Individual_Set_Page_Size.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars["RowsCount"] = String(await priceOfferedPage.Total_Rows_Count_UIDetails.count());
      expect(String(vars["IndividualSetPageSize"])).toBe(vars["RowsCount"]);
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
  });
});
