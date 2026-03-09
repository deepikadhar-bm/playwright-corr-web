import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments'


const TC_ID = "REG_TS24_TC01";
const TC_TITLE = "Closed List: Verify the pagination flows";

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
      log.step('Login to corr application');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to corr appication successful');
      }
      catch (e) {
        log.stepFail(page, 'Fail to Login corr appication Failed');
        throw e;
      }
      log.step('Verifying the pagination flow in commitment closed list page');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
        await commitmentListPage.Closed_List_Tab.scrollIntoViewIfNeeded();
        await commitmentListPage.Closed_List_Tab.click();
        await page.waitForLoadState('networkidle');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commitment_List_Text.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Commitment_List_Text).toBeVisible();
        await commitmentListPage.Closed_Date.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Closed_Date).toBeVisible();
        await correspondentPortalPage.Change_Page_Size_Dropdown.click();
        vars["CountOfSetPageSize"] = String(await commitmentListPage.Set_page_size_to_Dropdown.count());
        await correspondentPortalPage.Change_Page_Size_Dropdown.click();
        vars["count"] = "1";
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountOfSetPageSize"]))) {
          await correspondentPortalPage.Change_Page_Size_Dropdown.click();
          vars["IndividualSetPageSize"] = await commitmentListPage.IndividualSetPageSize(vars["count"]).textContent() || '';
          Methods.trimtestdata(vars["IndividualSetPageSize"], "IndividualSetPageSize");
          await commitmentListPage.IndividualSetPageSize(vars["count"]).click();
          log.info("Selected page size:" + vars["IndividualSetPageSize"]);
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          vars["RowsCount"] = String(await priceOfferedPage.Total_Rows_Count_UIDetails.count());
          expect(Methods.verifyComparison(vars["IndividualSetPageSize"], "==", vars["RowsCount"]));
          Methods.MathematicalOperation(vars["count"], "+", "1", "count");
        }
        log.stepPass('Verifying the pagination flow in commitment closed list page successful');
      }
      catch (e) {
        log.stepFail(page, 'Fail to Verifying the pagination flow in commitment closed list page');
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
