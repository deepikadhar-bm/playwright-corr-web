// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments'
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';

const TC_ID = "REG_TS19_TC03";
const TC_TITLE = "Verify the Apply/Clear filter for current day and verify the list should display the records from current day only";

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let helpers: AddonHelpers;
  const credentials = ENV.getCredentials('internal');


  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    helpers = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step(`Step 1: Login to CORR Portal`);
      try {
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass(`Step 1 passed: Logged in to CORR Portal successfully`);

      } catch (error) {
        log.stepFail(page, `Step 1 failed: Failed to login to CORR Portal`);
        throw error; // Rethrow to fail the test
      }

      log.step(`Step 2: Click to expand Commitments side menu`);
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();

      } catch (error) {
        log.stepFail(page, `Step 2 failed: Failed to click and expand Commitments side menu `);
        throw error;
      }

      log.step("Step 3: Select Price Offered from dropdown");
      try {
        await spinnerPage.Spinner.waitFor({ state: 'visible', timeout: 10000 });
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 10000 });
        log.stepPass(`Step 3 passed: Price Offered selected from dropdown successfully`);
      } catch (error) {
        log.stepFail(page, `Step 3 failed: Failed to select Price Offered from dropdown`);
        throw error;
      }

      log.step("Step 4: Apply current date filter from filter dropdown");
      try {
        await priceOfferedPage.Filter_Dropdown1.click();
        await correspondentPortalPage.Select_Date_Range_Dropdown.click();
        await correspondentPortalPage.Current_Date_On_Filters.click();
        helpers.getCurrentTimestamp(appconstants.DATE_FORMAT, 'CurrentDate', appconstants.UTC);

        await correspondentPortalPage.Select_Current_DateAdd_Config(vars["CurrentDate"]).click();
        await correspondentPortalPage.Apply_Button.click();
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        // await spinnerPage.Spinner.waitFor({ state: 'visible' });
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass(`Step 4 passed: Applied current date filter from filter dropdown successfully`);

      } catch (error) {
        log.stepFail(page, `Step 4 failed: Failed to click on Filter dropdown`);
        throw error;
      }

      log.step("Step 5: Verify that after applying current date filter, the list should display the records from current day only");
      try {
        await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
        helpers.getCurrentTimestamp(appconstants.DATE_FORMAT_YYYYMMDD, 'TodayDate');
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars["TodayDate"]);
        if (await correspondentPortalPage.Go_to_Next_Page_Button.isVisible()) /* Element Go to Next Page Button is enabled */ {
          vars["CountofPages"] = appconstants.TWO;
        } else {
          vars["CountofPages"] = appconstants.ONE;
        }
        vars["count"] = appconstants.ONE;
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofPages"]))) {
          helpers.getCurrentTimestamp(appconstants.DATE_FORMATE_, 'CurrentDate');
          await helpers.verifyMultipleElementsHaveSameText(priceOfferedPage.Date_VErification, vars["CurrentDate"]);
          if (await correspondentPortalPage.Go_to_Next_Page_Button.isVisible()) /* Element Go to Next Page Button is enabled */ {
            await correspondentPortalPage.Go_to_Next_Page_Button.click();
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          }
          vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        }

      } catch (error) {
        log.stepFail(page, `Step 5 failed: Failed to verify that after applying current date filter, the list should display the records from current day only`);
        throw error;
      }

      log.step("Step 6: Check Select All checkbox ")
      try {
        await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
      } catch (error) {
        log.error("Error occurred while checking Select All checkbox");
        throw error;
      }
      await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
      vars["ExportSelectedCountAfterApplyingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
     helpers.removeMultipleSpecialChars(["Export Selected", "(", ")", " "], vars["ExportSelectedCountAfterApplyingFilters"], "ExportSelectedCountAfterApplyingFilters");

      await priceOfferedPage.Remove_Date_FilterCross_Symbol.click();

      await spinnerPage.Spinner.waitFor({ state: 'visible' });
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toBeHidden();
      await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
      vars["ExportSelectedCountAfterRemovingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
      helpers.removeMultipleSpecialChars([' ', ',', '-', ':', '(', ')', '[', ']'], vars["ExportSelectedCountAfterRemovingFilters"], "ExportSelectedCountAfterRemovingFilters");

      expect(parseInt(String(vars["ExportSelectedCountAfterRemovingFilters"]))).toBeGreaterThan(parseInt(vars["ExportSelectedCountAfterApplyingFilters"]));
      await priceOfferedPage.Filter_Dropdown1.click();
      await correspondentPortalPage.Select_Date_Range_Dropdown.click();
      await correspondentPortalPage.Current_Date_On_Filters.click();
      helpers.getCurrentTimestamp(appconstants.DATE_FORMAT, 'CurrentDate', appconstants.UTC);
      await correspondentPortalPage.Select_Current_DateAdd_Config(vars["CurrentDate"]).click();
      await correspondentPortalPage.Apply_Button.click();
      await applyFiltersButtonPage.Apply_Filters_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'visible' });
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });

      helpers.getCurrentTimestamp(appconstants. DATE_FORMAT_YYYYMMDD, 'currentDate');
      helpers.concatenateWithSpace('Date:', vars["currentDate"], 'CurrentDateWithTextDate');
      await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars["CurrentDateWithTextDate"]);

      if (await correspondentPortalPage.Go_to_Next_Page_Button.isVisible()) /* Element Go to Next Page Button is enabled */ {
        vars["CountofPages"] = appconstants.TWO;
      } else {
        vars["CountofPages"] = appconstants.ONE;
      }
      vars["count"] = appconstants.ONE;
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofPages"]))) {
        helpers.getCurrentTimestamp(appconstants.DATE_FORMATE_, 'dateFormattedSecond');
        await helpers.verifyMultipleElementsHaveSameText(priceOfferedPage.Date_VErification, vars["dateFormattedSecond"]);
        if (await correspondentPortalPage.Go_to_Next_Page_Button.isVisible()) /* Element Go to Next Page Button is enabled */ {
          await correspondentPortalPage.Go_to_Next_Page_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        }
        vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
      }
      await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
      vars["ExportSelectedCountAfterApplyingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
      vars["ExportSelectedCountAfterApplyingFilters"] = String(vars["ExportSelectedCountAfterApplyingFilters"]).replace(/[^\d]/g, '');
      helpers.removeMultipleSpecialChars([' ', ',', '-', ':', '(', ')', '[', ']'], vars["ExportSelectedCountAfterApplyingFilters"], "ExportSelectedCountAfterApplyingFilters");

      await priceOfferedPage.Clear_all_ButtonPrice_Offered.click();

      await spinnerPage.Spinner.waitFor({ state: 'visible' });
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toBeHidden();
      await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
      vars["ExportSelectedCountAfterRemovingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
      vars["ExportSelectedCountAfterRemovingFilters"] = String(vars["ExportSelectedCountAfterRemovingFilters"]).replace(/[^\d]/g, '');

      expect(parseInt(String(vars["ExportSelectedCountAfterRemovingFilters"]))).toBeGreaterThan(parseInt(vars["ExportSelectedCountAfterApplyingFilters"]));

      log.tcEnd('PASS');
    } catch (error) {
      log.captureOnFailure(page, TC_ID, error);
      log.tcEnd('FAIL');
      throw error;
    }

  });

});
