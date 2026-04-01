import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ENV } from '@config/environments';
import { Logger as log } from '@helpers/log-helper';


const TC_ID = 'REG_TS21_TC02';
const TC_TITLE = 'Apply filter for current day/particular day and verify the Export functionality';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Login to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Logged in to Correspondent Portal');
      } catch (e) {
        await log.stepFail(page, 'Failed to login to Correspondent Portal');
        throw e;
      }

      log.step('Navigate to Commitment Closed List tab');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
        await commitmentListPage.Closed_List_Tab.evaluate((el: HTMLElement) => {
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          el.click();
        });
        await commitmentListPage.Commitment_List_Text.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Commitment_List_Text).toBeVisible();
        await commitmentListPage.Closed_Date.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Closed_Date).toBeVisible();
        log.stepPass('Navigated to Commitment Closed List tab');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Commitment Closed List tab');
        throw e;
      }

      log.step('Apply date filter on Commitment Closed List');
      try {
        await stepGroups.stepGroup_Selecting_Date_from_the_filters_by_fetching_the_first_comm_d(page, vars);
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Date filter applied successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to apply date filter');
        throw e;
      }

      log.step('Verify number of rows in UI matches number of rows in exported Excel');
      try {
        await stepGroups.stepGroup_Verification_of_Total_noof_rows_from_UI_to_Excel_and_Export_(page, vars);
        log.stepPass('UI row count matches Excel row count');
      } catch (e) {
        await log.stepFail(page, 'UI row count does not match Excel row count');
        throw e;
      }

      log.step('Verify Excel column headers match UI headers');
      try {
        await stepGroups.stepGroup_Headers_Verification_Closed_List(page, vars);
        log.stepPass('Excel headers match UI headers');
      } catch (e) {
        await log.stepFail(page, 'Excel headers do not match UI headers');
        throw e;
      }

      log.step('Verify Excel data matches UI data excluding headers');
      try {
        await stepGroups.stepGroup_Verification_of_Data_from_Excel_to_UI_Excluding_HeadersCommi(page, vars);
        log.stepPass('Excel data matches UI data');
      } catch (e) {
        await log.stepFail(page, 'Excel data does not match UI data');
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