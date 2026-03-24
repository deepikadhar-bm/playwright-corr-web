import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { ENV } from '@config/environments';


const TC_ID = 'REG_TS21_TC07';
const TC_TITLE = 'Perform clear search button action in open list for one of the filter applied, and then verify that the filter is cleared in both the closed and open list sections';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
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

      log.step('Navigate to Open List and apply date and company filters');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Filter_Dropdown1.click();
        await correspondentPortalPage.Select_Date_Range_Dropdown.waitFor({ state: 'visible' });
        await correspondentPortalPage.Select_Date_Range_Dropdown.click();
        await correspondentPortalPage.Last_One_Month_Button.click();
        await correspondentPortalPage.Select_CompanyCCode_Dropdown1.waitFor({ state: 'visible' });
        await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
        await priceOfferedPage.Check_Company.first().check();
        await expect(priceOfferedPage.Check_Company.first()).toBeChecked();
        await correspondentPortalPage.Apply_Selected.waitFor({ state: 'visible' });
        await correspondentPortalPage.Apply_Selected.click();
        await applyFiltersButtonPage.Apply_Filters_Button.waitFor({ state: 'visible' });
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toBeVisible();
        await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();
        log.stepPass('Navigated to Open List and applied date and company filters');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Open List or apply filters');
        throw e;
      }

      log.step('Capture export count with filter on Open List');
      try {
        const noResultsOpenList = page.getByText('No result', { exact: true });
        await page.waitForTimeout(2000);
        if (await noResultsOpenList.isVisible()) {
          vars['RecordsCountWithFilterOpenList'] = appconstants.ZERO;
          log.info('No results on Open List - RecordsCountWithFilterOpenList: 0');
        } else {
          await priceOfferedPage.Select_all_for_Checkbox.check();
          vars['RecordsCountWithFilterOpenList'] = await commitmentListPage.Export_Selected.textContent() || '';
          Methods.removeMultipleSpecialChars(['(', ')', ' '], vars['RecordsCountWithFilterOpenList'], 'RecordsCountWithFilterOpenList');
          Methods.trimtestdata(vars['RecordsCountWithFilterOpenList'], 'RecordsCountWithFilterOpenList');
          log.info('RecordsCountWithFilterOpenList: ' + vars['RecordsCountWithFilterOpenList']);
        }
        log.stepPass('Export count captured with filter on Open List: ' + vars['RecordsCountWithFilterOpenList']);
      } catch (e) {
        await log.stepFail(page, 'Failed to capture export count on Open List');
        throw e;
      }

      log.step('Switch to Closed List and verify filters retained, capture export count');
      try {
        await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
        await commitmentListPage.Closed_List_Tab.evaluate((el: HTMLElement) => {
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          el.click();
        });
        await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toBeVisible();
        await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();
        const noResultsClosedList = page.getByText('No result', { exact: true });
        await page.waitForTimeout(2000);
        if (await noResultsClosedList.isVisible()) {
          vars['RecordsCountWithFilterClosedList'] = appconstants.ZERO;
          log.info('No results on Closed List - RecordsCountWithFilterClosedList: 0');
        } else {
          await priceOfferedPage.Select_all_for_Checkbox.check();
          vars['RecordsCountWithFilterClosedList'] = await commitmentListPage.Export_Selected.textContent() || '';
          Methods.removeMultipleSpecialChars(['(', ')', ' '], vars['RecordsCountWithFilterClosedList'], 'RecordsCountWithFilterClosedList');
          Methods.trimtestdata(vars['RecordsCountWithFilterClosedList'], 'RecordsCountWithFilterClosedList');
          log.info('RecordsCountWithFilterClosedList: ' + vars['RecordsCountWithFilterClosedList']);
        }
        log.stepPass('Filters retained on Closed List. Export count captured: ' + vars['RecordsCountWithFilterClosedList']);
      } catch (e) {
        await log.stepFail(page, 'Filters not retained on Closed List or failed to capture export count');
        throw e;
      }

      log.step('Clear all filters on Open List and verify both filter chips removed, verify count increases');
      try {
        await commitmentListPage.Open_List_Tab.click();
        await commitmentListPage.Clear_all_ButtonCommitment_List.waitFor({ state: 'visible' });
        await commitmentListPage.Clear_all_ButtonCommitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).not.toBeVisible();
        await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).not.toBeVisible();
        log.info('Date and company filter chips removed on Open List');
        await page.waitForTimeout(2000);
        if (!(await priceOfferedPage.Select_all_for_Checkbox.isChecked())) {
          await priceOfferedPage.Select_all_for_Checkbox.check();
        }
        vars['RecordsCountWithoutFilterOpenList'] = await commitmentListPage.Export_Selected.textContent() || '';
        Methods.removeMultipleSpecialChars(['(', ')', ' '], vars['RecordsCountWithoutFilterOpenList'], 'RecordsCountWithoutFilterOpenList');
        log.info('RecordsCountWithFilterOpenList: ' + vars['RecordsCountWithFilterOpenList']);
        log.info('RecordsCountWithoutFilterOpenList: ' + vars['RecordsCountWithoutFilterOpenList']);
        Methods.verifyComparison(vars['RecordsCountWithFilterOpenList'], '<', vars['RecordsCountWithoutFilterOpenList']);
        log.stepPass('Filters cleared on Open List - count increased from ' + vars['RecordsCountWithFilterOpenList'] + ' to ' + vars['RecordsCountWithoutFilterOpenList']);
      } catch (e) {
        await log.stepFail(page, 'Clear all failed on Open List or count did not increase');
        throw e;
      }

      log.step('Switch to Closed List and verify filters also cleared, verify count increases');
      try {
        await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
        await commitmentListPage.Closed_List_Tab.evaluate((el: HTMLElement) => {
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          el.click();
        });
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).not.toBeVisible();
        await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).not.toBeVisible();
        log.info('Date and company filter chips not visible on Closed List after clear all on Open List');
        await page.waitForTimeout(2000);
        if (!(await priceOfferedPage.Select_all_for_Checkbox.isChecked())) {
          await priceOfferedPage.Select_all_for_Checkbox.check();
        }
        vars['RecordsCountWithoutFilterClosedList'] = await commitmentListPage.Export_Selected.textContent() || '';
        Methods.removeMultipleSpecialChars(['(', ')', ' '], vars['RecordsCountWithoutFilterClosedList'], 'RecordsCountWithoutFilterClosedList');
        Methods.trimtestdata(vars['RecordsCountWithoutFilterClosedList'], 'RecordsCountWithoutFilterClosedList');
        log.info('RecordsCountWithFilterClosedList: ' + vars['RecordsCountWithFilterClosedList']);
        log.info('RecordsCountWithoutFilterClosedList: ' + vars['RecordsCountWithoutFilterClosedList']);
        Methods.verifyComparison(vars['RecordsCountWithFilterClosedList'], '<', vars['RecordsCountWithoutFilterClosedList']);
        log.stepPass('Filters also cleared on Closed List - count increased from ' + vars['RecordsCountWithFilterClosedList'] + ' to ' + vars['RecordsCountWithoutFilterClosedList']);
      } catch (e) {
        await log.stepFail(page, 'Filters not cleared on Closed List or count did not increase');
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