import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ENV } from '@config/environments';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = 'REG_TS01_TC04';
const TC_TITLE = 'Audit log - Verify the pagination of the page';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  const crederntials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    vars["Username"] = crederntials.username;
    vars["Password"] = crederntials.password;
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Logging in to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Successfully logged in to Correspondent Portal');
      } catch (e) {
        await log.stepFail(page, 'Failed to log in to Correspondent Portal');
        throw e;
      }

      log.step('Navigating to Administration > General Settings');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.waitFor({ state: 'visible' });
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Successfully navigated to General Settings page');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to General Settings');
        throw e;
      }

      log.step('Capturing total count of page size options from dropdown');
      try {
        await correspondentPortalPage.Change_Page_Size_Dropdown.click();
        vars["CountOfSetPageSize"] = String(await commitmentListPage.Set_page_size_to_Dropdown.count());
        await correspondentPortalPage.Change_Page_Size_Dropdown.click();
        log.info('CountOfSetPageSize: ' + vars["CountOfSetPageSize"]);
        log.stepPass('Page size options count captured: ' + vars["CountOfSetPageSize"]);
      } catch (e) {
        await log.stepFail(page, 'Failed to capture page size options count');
        throw e;
      }

      log.step('Iterating through each page size option and verifying row count matches selected page size');
      try {
        vars["count"] = "1";
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountOfSetPageSize"]))) {
          await correspondentPortalPage.Change_Page_Size_Dropdown.click();
          vars["IndividualSetPageSize"] = await commitmentListPage.IndividualSetPageSize((vars["count"])).textContent() || '';
          vars["IndividualSetPageSize"] = vars["IndividualSetPageSize"].trim();
          log.info('IndividualSetPageSize: ' + vars["IndividualSetPageSize"]);
          await commitmentListPage.IndividualSetPageSize((vars["count"])).click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          vars["RowsCount"] = String(await priceOfferedPage.Total_Rows_Count_UIDetails.count()).trim();
          log.info('RowsCount: ' + vars["RowsCount"]);
          expect(String(vars["IndividualSetPageSize"])).toBe(vars["RowsCount"]);
          vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        }
        log.stepPass('All page size options verified — row counts match selected page size for each option');
      } catch (e) {
        await log.stepFail(page, 'Row count verification failed for page size: ' + vars["IndividualSetPageSize"]);
        throw e;
      }

      log.tcEnd('PASS');
    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});