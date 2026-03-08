// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);

  });

  test('REG_TS19_TC03_Verify the Apply/Clear filter for current day and verify the list should display the records from current day only', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_Date_Range_Dropdown.click();
    await correspondentPortalPage.Current_Date_On_Filters.click();
    // vars["CurrentDate"] = (() => {
    //   const d = new Date();
    //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
    //   const fmt = "d-M-yyyy";
    //   // Map Java date format to Intl parts
    //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    // })();
    Methods.getCurrentTimestamp('d-M-yyyy', 'CurrentDate', 'UTC');
    await correspondentPortalPage.Select_Current_DateAdd_Config(vars["CurrentDate"]).click();
    await correspondentPortalPage.Apply_Button.click();
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });

    // // Format date as YYYY/MM/DD to match the UI format
    // const today = new Date();
    // const formattedDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
    Methods.getCurrentTimestamp('yyyy/MM/dd', 'TodayDate');
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars["TodayDate"]);
    if (await correspondentPortalPage.Go_to_Next_Page_Button.isEnabled()) /* Element Go to Next Page Button is enabled */ {
      vars["CountofPages"] = "2";
    } else {
      vars["CountofPages"] = "1";
    }
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofPages"]))) {
      // Format date as MM/DD/YYYY with zero-padding to match UI format
      // const dateFormatted = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
      Methods.getCurrentTimestamp('MM/dd/yyyy', 'CurrentDate');
      await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Date_VErification, vars["CurrentDate"]);
      if (await correspondentPortalPage.Go_to_Next_Page_Button.isEnabled()) /* Element Go to Next Page Button is enabled */ {
        await correspondentPortalPage.Go_to_Next_Page_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
    vars["ExportSelectedCountAfterApplyingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
    // Extract only the number from text like "Export Selected (5)"
    // vars["ExportSelectedCountAfterApplyingFilters"] = String(vars["ExportSelectedCountAfterApplyingFilters"]).replace(/[^\d]/g, '');
    Methods.removeMultipleSpecialChars(["Export Selected", "(", ")", " "], vars["ExportSelectedCountAfterApplyingFilters"], "ExportSelectedCountAfterApplyingFilters");

    await priceOfferedPage.Remove_Date_FilterCross_Symbol.click();

    await spinnerPage.Spinner.waitFor({ state: 'visible' });
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toBeVisible({visible:false});
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toBeHidden();
    await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
    vars["ExportSelectedCountAfterRemovingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
    // Extract only the number from text like "Export Selected (5)"
    // vars["ExportSelectedCountAfterRemovingFilters"] = String(vars["ExportSelectedCountAfterRemovingFilters"]).replace(/[^\d]/g, '');
    Methods.removeMultipleSpecialChars([' ', ',', '-', ':', '(', ')', '[', ']'], vars["ExportSelectedCountAfterRemovingFilters"], "ExportSelectedCountAfterRemovingFilters");

    expect(parseInt(String(vars["ExportSelectedCountAfterRemovingFilters"]))).toBeGreaterThan(parseInt(vars["ExportSelectedCountAfterApplyingFilters"]));
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_Date_Range_Dropdown.click();
    await correspondentPortalPage.Current_Date_On_Filters.click();
    Methods.getCurrentTimestamp('d-M-yyyy', 'CurrentDate', 'UTC');
    await correspondentPortalPage.Select_Current_DateAdd_Config(vars["CurrentDate"]).click();
    await correspondentPortalPage.Apply_Button.click();
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });

    // Format date as YYYY/MM/DD to match UI format
    // const today2 = new Date();
    // vars["CurrentDate"] = `${today2.getFullYear()}/${String(today2.getMonth() + 1).padStart(2, '0')}/${String(today2.getDate()).padStart(2, '0')}`;
    // vars["Space"] = " "; // actual space, not "key_blank"
    // vars["CurrentDateWithTextDate"] = "Date:" + vars["Space"] + vars["CurrentDate"];
    Methods.getCurrentTimestamp('yyyy/MM/dd', 'currentDate');
    Methods.concatenateWithSpace('Date:', vars["currentDate"], 'CurrentDateWithTextDate');
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars["CurrentDateWithTextDate"]);
    // await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars["CurrentDateWithTextDate"]);

    if (await correspondentPortalPage.Go_to_Next_Page_Button.isEnabled()) /* Element Go to Next Page Button is enabled */ {
      vars["CountofPages"] = "2";
    } else {
      vars["CountofPages"] = "1";
    }
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofPages"]))) {
      // Format date as MM/DD/YYYY with zero-padding to match UI format
      // const dateFormattedSecond = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
      Methods.getCurrentTimestamp('MM/dd/yyyy', 'dateFormattedSecond');
      await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Date_VErification, vars["dateFormattedSecond"]);
      if (await correspondentPortalPage.Go_to_Next_Page_Button.isEnabled()) /* Element Go to Next Page Button is enabled */ {
        await correspondentPortalPage.Go_to_Next_Page_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
    vars["ExportSelectedCountAfterApplyingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
    // Extract only the number from text like "Export Selected (5)"
    vars["ExportSelectedCountAfterApplyingFilters"] = String(vars["ExportSelectedCountAfterApplyingFilters"]).replace(/[^\d]/g, '');
    Methods.removeMultipleSpecialChars([' ', ',', '-', ':', '(', ')', '[', ']'], vars["ExportSelectedCountAfterApplyingFilters"], "ExportSelectedCountAfterApplyingFilters");

    await priceOfferedPage.Clear_all_ButtonPrice_Offered.click();

    await spinnerPage.Spinner.waitFor({ state: 'visible' });
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toBeHidden();
    await priceOfferedPage.Select_All_CheckboxPrice_Offred_Page.check();
    vars["ExportSelectedCountAfterRemovingFilters"] = await priceOfferedPage.Export_Selected_Count.textContent() || '';
    // Extract only the number from text like "Export Selected (5)"
    vars["ExportSelectedCountAfterRemovingFilters"] = String(vars["ExportSelectedCountAfterRemovingFilters"]).replace(/[^\d]/g, '');

    expect(parseInt(String(vars["ExportSelectedCountAfterRemovingFilters"]))).toBeGreaterThan(parseInt(vars["ExportSelectedCountAfterApplyingFilters"]));
  });
});
