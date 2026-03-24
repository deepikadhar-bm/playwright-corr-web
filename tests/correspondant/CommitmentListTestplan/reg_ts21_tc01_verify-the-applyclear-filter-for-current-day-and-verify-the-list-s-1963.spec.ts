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


const TC_ID = 'REG_TS21_TC01';
const TC_TITLE = 'Verify the Apply/Clear filter for current day and Verify the list should display the records from current day only';

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
      log.step('Login to CORR portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login successful');
      } catch (e) {
        await log.stepFail(page, 'Login failed');
        throw e;
      }
      log.step('Navigate to commitment closed list tab');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
        // await commitmentListPage.Closed_List_Tab.click();
        
        await commitmentListPage.Closed_List_Tab.evaluate((el: HTMLElement) => {
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          el.click();
        });
        await commitmentListPage.Commitment_List_Text.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Commitment_List_Text).toBeVisible();
        await commitmentListPage.Closed_Date.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Closed_Date).toBeVisible();
        log.stepPass('Successfully navigated to commitment closed list tab');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate commitment closed list');
        throw e;
      }

      log.step('Apply date filter and verify all records match the expected commitment date');
      try {
        await stepGroups.stepGroup_Selecting_Date_from_the_filters_by_fetching_the_first_comm_d(page, vars);
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        const NextButton = correspondentPortalPage.Go_to_Next_Page_Button;
        if (await NextButton.isVisible()) {
          vars['CountofPages'] = appconstants.TWO;
        } else {
          vars['CountofPages'] = appconstants.ONE;
        }
        log.info('CountofPages: ' + vars['CountofPages']);
        vars['count'] = appconstants.ONE;
        while (parseFloat(String(vars['count'])) <= parseFloat(String(vars['CountofPages']))) {
          await commitmentListPage.Comm_Date_column.first().waitFor({ state: 'visible' });
          vars['ActualCommDate'] = await commitmentListPage.Comm_Date_column.first().textContent() || '';
          Methods.trimtestdata(vars['ExpectedCommDate'], 'ExpectedCommDate');
          log.info('ExpectedCommDate: ' + vars['ExpectedCommDate']);
          await Methods.verifyMultipleElementsHaveSameText(commitmentListPage.Comm_Date_column, vars['ExpectedCommDate']);
          if (await NextButton.isVisible() && await NextButton.isEnabled()) {
            await correspondentPortalPage.Go_to_Next_Page_Button.click();
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          }
          Methods.MathematicalOperation(vars['count'], '+', 1, 'count');
        }
        log.stepPass('All records verified against expected commitment date: ' + vars['ExpectedCommDate']);
      } catch (e) {
        await log.stepFail(page, 'Record date mismatch. Expected: ' + vars['ExpectedCommDate']);
        throw e;
      }

      log.step('Capture export count with filter, remove via cross symbol and verify count increases');
      try {
        await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
        await expect(correspondentPortalPage.Export_Selected_1_Button).toBeEnabled();
        vars['ExportSelectedCountAfterApplyingFilters'] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
        Methods.removeMultipleSpecialChars(['(', ')', ' '], vars['ExportSelectedCountAfterApplyingFilters'], 'ExportSelectedCountAfterApplyingFilters');
        log.info('ExportSelectedCountAfterApplyingFilters: ' + vars['ExportSelectedCountAfterApplyingFilters']);
        await priceOfferedPage.Remove_Date_FilterCross_Symbol.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).not.toBeVisible();
        log.info('Date filter chip removed via cross symbol');
        await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
        await expect(correspondentPortalPage.Export_Selected_1_Button).toBeEnabled();
        vars['ExportSelectedCountAfterRemovingFilters'] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
        Methods.removeMultipleSpecialChars(['(', ')', ' '], vars['ExportSelectedCountAfterRemovingFilters'], 'ExportSelectedCountAfterRemovingFilters');
        log.info('ExportSelectedCountAfterRemovingFilters: ' + vars['ExportSelectedCountAfterRemovingFilters']);
        Methods.verifyComparison(vars['ExportSelectedCountAfterRemovingFilters'], '>', vars['ExportSelectedCountAfterApplyingFilters']);
        log.stepPass('Cross symbol filter removal verified - count increased from ' + vars['ExportSelectedCountAfterApplyingFilters'] + ' to ' + vars['ExportSelectedCountAfterRemovingFilters']);
      } catch (e) {
        await log.stepFail(page, 'Cross symbol filter removal failed - filter: ' + vars['ExportSelectedCountAfterApplyingFilters'] + ' | unfiltered: ' + vars['ExportSelectedCountAfterRemovingFilters']);
        throw e;
      }

      log.step('Re-apply date filter, capture export count, clear all and verify count increases');
      try {
        await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.uncheck();
        await stepGroups.stepGroup_Selecting_Date_from_the_filters_by_fetching_the_first_comm_d(page, vars);
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
        await expect(correspondentPortalPage.Export_Selected_1_Button).toBeEnabled();
        vars['ExportSelectedCountAfterApplyingFilters'] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
        Methods.removeMultipleSpecialChars(['(', ')', ' '], vars['ExportSelectedCountAfterApplyingFilters'], 'ExportSelectedCountAfterApplyingFilters');
        log.info('ExportSelectedCountAfterApplyingFilters (re-apply): ' + vars['ExportSelectedCountAfterApplyingFilters']);
        await commitmentListPage.Clear_all_ButtonCommitment_List.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).not.toBeVisible();
        log.info('Date filter chip removed via clear all');
        await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
        await expect(correspondentPortalPage.Export_Selected_1_Button).toBeEnabled();
        await page.waitForTimeout(3000);
        vars['ExportSelectedCountAfterRemovingFilters'] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
        Methods.removeMultipleSpecialChars(['(', ')', ' '], vars['ExportSelectedCountAfterRemovingFilters'], 'ExportSelectedCountAfterRemovingFilters');
        log.info('ExportSelectedCountAfterRemovingFilters (after clear all): ' + vars['ExportSelectedCountAfterRemovingFilters']);
        Methods.verifyComparison(vars['ExportSelectedCountAfterRemovingFilters'], '>', vars['ExportSelectedCountAfterApplyingFilters']);
        log.stepPass('Clear all filter removal verified - count increased from ' + vars['ExportSelectedCountAfterApplyingFilters'] + ' to ' + vars['ExportSelectedCountAfterRemovingFilters']);
      } catch (e) {
        await log.stepFail(page, 'Clear all filter removal failed - filter: ' + vars['ExportSelectedCountAfterApplyingFilters'] + ' | unfiltered: ' + vars['ExportSelectedCountAfterRemovingFilters']);
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