import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS19_TC03';
const TC_TITLE = 'Verify the Apply/Clear filter for current day and verify the list should display the records from current day only';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Login to CORR Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Logged in to CORR Portal successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to login to CORR Portal');
        throw e;
      }

      log.step('Navigate to Price Offered via Commitments side menu');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'visible', timeout: 20000 });
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 20000 });
        log.stepPass('Navigated to Price Offered successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Price Offered via Commitments side menu');
        throw e;
      }

      // ── Feature 1: Apply current date filter → verify data → remove via cross symbol → verify chip gone → verify record count ──

      log.step('[Feature 1] Apply current day date filter and verify date filter chip');
      try {
        await priceOfferedPage.Filter_Dropdown1.click();
        await correspondentPortalPage.Select_Date_Range_Dropdown.click();
        await correspondentPortalPage.Current_Date_On_Filters.click();
        Methods.getCurrentTimestamp(appconstants.DATE_FORMAT_DMYYYY, 'CurrentDate', appconstants.AMERICA_NEW_YORK);
        log.info('CurrentDate: ' + vars['CurrentDate']);
        await correspondentPortalPage.Select_Current_DateAdd_Config(vars["CurrentDate"]).click();
        await expect(correspondentPortalPage.Apply_Button).toBeEnabled();
        await correspondentPortalPage.Apply_Button.click();
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
        Methods.convertDateFormat(vars['CurrentDate'], appconstants.DATE_FORMAT_DMYYYY, appconstants.DATE_FORMAT_YYYYMMDD, 'ExpectedDateChip');
        Methods.concatenateWithSpace('Date:', vars["ExpectedDateChip"], 'ExpectedDateChip');
        log.info('ExpectedDateChip: ' + vars['ExpectedDateChip']);
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars["ExpectedDateChip"]);
        log.stepPass('[Feature 1] Current day date filter applied and chip verified: ' + vars['ExpectedDateChip']);
      } catch (e) {
        await log.stepFail(page, '[Feature 1] Failed to apply current day filter or chip not showing expected date: ' + vars['ExpectedDateChip']);
        throw e;
      }

      log.step('[Feature 1] Verify all Price Offered records display current date only');
      try {
        Methods.convertDateFormat(vars['CurrentDate'], appconstants.DATE_FORMAT_DMYYYY, appconstants.DATE_FORMAT_MMDDYYYY, 'ExpectedDate');
        log.info('ExpectedDate: ' + vars['ExpectedDate']);
        const NextButton = correspondentPortalPage.Go_to_Next_Page_Button;
        if (await NextButton.isVisible()) {
          vars["CountofPages"] = appconstants.TWO;
        } else {
          vars["CountofPages"] = appconstants.ONE;
        }
        vars["count"] = appconstants.ONE;
        log.info('CountofPages: ' + vars['CountofPages']);

        while (parseFloat(vars["count"]) <= parseFloat(vars["CountofPages"])) {
          log.info('Verifying Page: ' + vars['count']);
          await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Date_VErification, vars["ExpectedDate"]);
          if (await NextButton.isVisible() && await NextButton.isEnabled()) {
            await correspondentPortalPage.Go_to_Next_Page_Button.click();
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          }
          Methods.MathematicalOperation(vars["count"], '+', 1, 'count');
        }
        log.stepPass('[Feature 1] All records verified against current date: ' + vars['ExpectedDate']);
      } catch (e) {
        await log.stepFail(page, '[Feature 1] Record date mismatch — expected all records to show date: ' + vars['ExpectedDate']);
        throw e;
      }

      log.step('[Feature 1] Capture export count with filter, remove filter via cross symbol, verify chip is removed and record count increases');
      try {
        await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
        vars["ExportSelectedCountAfterApplyingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
        Methods.removeMultipleSpecialChars(['(', ')'], vars["ExportSelectedCountAfterApplyingFilters"], "ExportSelectedCountAfterApplyingFilters");
        log.info('[Feature 1] Export count with date filter applied: ' + vars['ExportSelectedCountAfterApplyingFilters']);

        await priceOfferedPage.Remove_Date_FilterCross_Symbol.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).not.toBeVisible();
        log.info('[Feature 1] Date filter chip removed successfully via cross symbol');

        await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
        await priceOfferedPage.Export_Selected_Count.waitFor({ state: 'visible' });
        vars["ExportSelectedCountAfterRemovingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
        Methods.removeMultipleSpecialChars(['(', ')', '[', ']'], vars["ExportSelectedCountAfterRemovingFilters"], "ExportSelectedCountAfterRemovingFilters");
        log.info('[Feature 1] Export count after cross symbol removal: ' + vars['ExportSelectedCountAfterRemovingFilters']);

        Methods.verifyComparison(vars["ExportSelectedCountAfterRemovingFilters"], '>', vars["ExportSelectedCountAfterApplyingFilters"]);
        log.stepPass('[Feature 1] Filter removed via cross symbol and record count increased after clearing the filter');
      } catch (e) {
        await log.stepFail(page, '[Feature 1] Failed to remove filter via cross symbol or record count did not increase after clearing the filter');
        throw e;
      }

      // ── Feature 2: Apply current date filter → verify data → remove via clear all → verify chip gone → verify record count ──

      log.step('[Feature 2] Re-apply current day date filter and verify date filter chip shows correct date');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Filter_Dropdown1.click();
        await correspondentPortalPage.Select_Date_Range_Dropdown.click();
        await correspondentPortalPage.Current_Date_On_Filters.click();
        await correspondentPortalPage.Select_Current_DateAdd_Config(vars["CurrentDate"]).click();
        await expect(correspondentPortalPage.Apply_Button).toBeEnabled();
        await correspondentPortalPage.Apply_Button.click();
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars["ExpectedDateChip"]);
        log.stepPass('[Feature 2] Current day date filter re-applied and chip verified: ' + vars['ExpectedDateChip']);
      } catch (e) {
        await log.stepFail(page, '[Feature 2] Failed to re-apply current day filter or chip not showing expected date: ' + vars['ExpectedDateChip']);
        throw e;
      }

      log.step('[Feature 2] Verify all Price Offered records display current date only');
      try {
        const NextButton = correspondentPortalPage.Go_to_Next_Page_Button;
        if (await NextButton.isVisible()) {
          vars["CountofPages"] = appconstants.TWO;
        } else {
          vars["CountofPages"] = appconstants.ONE;
        }
        vars["count"] = appconstants.ONE;
        log.info('CountofPages: ' + vars['CountofPages']);

        while (parseFloat(vars["count"]) <= parseFloat(vars["CountofPages"])) {
          log.info('Verifying Page: ' + vars['count']);
          await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Date_VErification, vars["ExpectedDate"]);
          if (await NextButton.isVisible() && await NextButton.isEnabled()) {
            await correspondentPortalPage.Go_to_Next_Page_Button.click();
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          }
          Methods.MathematicalOperation(vars["count"], '+', 1, 'count');
        }
        log.stepPass('[Feature 2] All records verified against current date: ' + vars['ExpectedDate']);
      } catch (e) {
        await log.stepFail(page, '[Feature 2] Record date mismatch — expected all records to show date: ' + vars['ExpectedDate']);
        throw e;
      }

      log.step('[Feature 2] Capture export count with filter, remove filter via Clear All, verify chip is removed and record count increases');
      try {
        await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
        await priceOfferedPage.Export_Selected_Count.waitFor({ state: 'visible' });
        vars["ExportSelectedCountAfterApplyingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
        vars["ExportSelectedCountAfterApplyingFilters"] = String(vars["ExportSelectedCountAfterApplyingFilters"]).replace(/[^\d]/g, '');
        Methods.removeMultipleSpecialChars([' ', ',', '-', ':', '(', ')', '[', ']'], vars["ExportSelectedCountAfterApplyingFilters"], "ExportSelectedCountAfterApplyingFilters");
        log.info('[Feature 2] Export count with date filter applied: ' + vars['ExportSelectedCountAfterApplyingFilters']);

        await priceOfferedPage.Clear_all_ButtonPrice_Offered.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).not.toBeVisible();
        log.info('[Feature 2] Date filter chip removed successfully via Clear All');

        await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
        vars["ExportSelectedCountAfterRemovingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
        vars["ExportSelectedCountAfterRemovingFilters"] = String(vars["ExportSelectedCountAfterRemovingFilters"]).replace(/[^\d]/g, '');
        log.info('[Feature 2] Export count after Clear All: ' + vars['ExportSelectedCountAfterRemovingFilters']);

        Methods.verifyComparison(vars["ExportSelectedCountAfterRemovingFilters"], '>', vars["ExportSelectedCountAfterApplyingFilters"]);
        log.stepPass('[Feature 2] Filter removed via Clear All and record count increased after clearing the filter');
      } catch (e) {
        await log.stepFail(page, '[Feature 2] Failed to remove filter via Clear All or record count did not increase after clearing the filter');
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