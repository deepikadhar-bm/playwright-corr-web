// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';


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

  test('REG_TS24_TC01_Closed List: Verify the pagination flows', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await commitmentListPage.Closed_List_Tab.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Change_Page_Size_Dropdown.click();
    vars["CountOfSetPageSize"] = String(await commitmentListPage.Set_page_size_to_Dropdown.count());
    await correspondentPortalPage.Change_Page_Size_Dropdown.click();
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountOfSetPageSize"]))) {
      await correspondentPortalPage.Change_Page_Size_Dropdown.click();
      vars["IndividualSetPageSize"] = await commitmentListPage.IndividualSetPageSize(vars["count"]).textContent() || '';
      Methods.trimtestdata(vars["IndividualSetPageSize"],"IndividualSetPageSize");
      await commitmentListPage.IndividualSetPageSize(vars["count"]).click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      vars["RowsCount"] = String(await priceOfferedPage.Total_Rows_Count_UIDetails.count());
      expect(Methods.verifyComparison(vars["IndividualSetPageSize"],"==",vars["RowsCount"]));
      Methods.MathematicalOperation(vars["count"], "+", "1", "count");
    }
    log.info("Successfully completed testcase-TS25_TC01")
  });
});
