// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { Logger as log } from '../../../src/helpers/log-helper';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

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

  const TC_ID = 'REG_TS19_TC06';
  const TC_TITLE = 'Apply/Clear filter for a particular Status field and verify the apply filter functionality';

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    const testData: Record<string, string> = {
      "StatusInFilters": "Price",
      "CompanyNameInFilters": "Fre",
      "RequestIdfor22-2.1": "87BQ7DB5C69B",
      "RequestIDCreated3rdScenario": "87YK9A2E0311",
      "BidMappingID": "Deepika Aug1",
      "RequestIdfor22-2.2": "87TS8C74F49F",
      "RequestIDfrom13-1": "87RS88D43BB6",
      "RequestIDfrom13-2": "578FE9EDEC6C",
      "RequestIDfrom22-1.2": "874KBED58307",
      "RequestIDfrom10-2": "872V960789CD",
      "RequestIDfrom11-1": "87ZB36778D61",
      "EditedChaseUsersTime": "3",
      "RequestIDCreated1stScenario": "87P80EB790BD",
      "RequestIDfrom10-3": "874WDCCDC3CE",
      "RequestIDfrom22-3.1": "877V3BF90360",
      "Expected Product(price offered)": "FN30",
      "RequestIDfrom22-1.1": "877V3BF90360",
      "RequestIDCreated2ndScenario": "87462B751677",
      "Expected Coupon(price offered)": "3.5",
      "Static Last Name(Pop Up Verfication)": "LN_Deepika_JULY_16_13",
      "RequestIDfrom24-1": "87E42DCFAFE8",
      "Company Name": "Freedom - A4187",
      "RequestIDfrom29-1": "57EFC2170915",
      "RequestIDfrom28-1": "87E15439E568",
      "NO of Batches": "5",
      "RequestIDfrom27-1": "87DEF1EBA5BD",
      "RequestIDFrom28-2": "878S25D7D52F",
      "RequestIDCreated4rthScenario": "87145580866E"
    }; // Profile: "Price Offered", row: 0

    log.tcStart(TC_ID, TC_TITLE);
    try {
      log.step(`Step 1: Login to CORR Portal`);
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass(`Step 1 passed: Logged in to CORR Portal successfully`);
      } catch (error) {
        log.stepFail(page, `Step 1 failed: Failed to login to CORR Portal`);
        throw error;
      }

      log.step(`Step 2: Open Price Offered and filters`);
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForTimeout(3000);
        await priceOfferedPage.Filter_Dropdown1.click();
        log.stepPass(`Step 2 passed: Price Offered opened and filters visible`);
      } catch (error) {
        log.stepFail(page, `Step 2 failed: Failed to open Price Offered and filters`);
        throw error;
      }

      log.step(`Step 3: Search Status in filters`);
      try {
        await correspondentPortalPage.Select_Commitments_Status_Dropdown.click();
        await correspondentPortalPage.Dropdown_Search_In_Commitments_Status.click();
        await Methods.clearAndEnterText(correspondentPortalPage.Dropdown_Search_In_Commitments_Status, undefined, testData["StatusInFilters"]);
        await page.waitForTimeout(1200);
        await Methods.verifyElementTextContainsCaseInsensitive(priceOfferedPage.Selected_Status, undefined, testData["StatusInFilters"]);
        vars["CountOfSelectedStatusBeforeClearing"] = String(await priceOfferedPage.Selected_Status.count());
        log.stepPass(`Step 3 passed: Status search applied and selection visible`);
      } catch (error) {
        log.stepFail(page, `Step 3 failed: Failed to search status in filters`);
        throw error;
      }

      log.step(`Step 4: Clear search and verify counts`);
      try {
        await correspondentPortalPage.Clear_Search_Button.click();
        vars["StatusCountInFilters"] = String(await priceOfferedPage.Status_Count_In_Filters.count());
        expect(parseFloat(vars["CountOfSelectedStatusBeforeClearing"])).toBeLessThanOrEqual(parseFloat(vars["StatusCountInFilters"]));
        log.stepPass(`Step 4 passed: Search cleared and counts verified`);
      } catch (error) {
        log.stepFail(page, `Step 4 failed: Failed to clear search or verify counts`);
        throw error;
      }

      log.step(`Step 5: Select a status and verify selection count`);
      try {
        await priceOfferedPage.Status_Checkbox.nth(0).check();
        vars["CheckedStatus"] = await priceOfferedPage.Checked_Status.nth(0).textContent() || '';
        await correspondentPortalPage.Dropdown_Show_Selected_In_Status.click();
        vars["CountOfstatusChecked"] = (await priceOfferedPage.number_of_items_selected.textContent() || '').trim();
        expect(String("1")).toBe(vars["CountOfstatusChecked"]);
        vars["SelectedstatusInFilterCount"] = String(await priceOfferedPage.Selected_Company_Count_in_Filters.count());
        expect(String("1")).toBe(vars["SelectedstatusInFilterCount"]);
        log.stepPass(`Step 5 passed: Status selected and counts are correct`);
      } catch (error) {
        log.stepFail(page, `Step 5 failed: Failed to select status or verify selection count`);
        throw error;
      }

      log.step(`Step 6: Show all and validate total status count`);
      try {
        await correspondentPortalPage.Show_All_Button.click();
        vars["TotalStatusCountInFilters"] = String(await priceOfferedPage.Status_Count_In_Filters.count());
        expect(parseFloat(vars["CountOfSelectedStatusBeforeClearing"])).toBeLessThanOrEqual(parseFloat(vars["TotalStatusCountInFilters"]));
        await expect(priceOfferedPage.Apply_Selected_In_Status).toBeVisible();
        await priceOfferedPage.Select_All_In_Status.click();
        vars["CountOfItemsSelected"] = await priceOfferedPage.Items_Selected.textContent() || '';
        expect(parseFloat(vars["CountOfSelectedStatusBeforeClearing"])).toBeLessThan(parseFloat(vars["CountOfItemsSelected"]));
        await priceOfferedPage.Select_All_In_Status.click();
        log.stepPass(`Step 6 passed: Show all and select-all validated`);
      } catch (error) {
        log.stepFail(page, `Step 6 failed: Show all or select-all failed`);
        throw error;
      }

      await priceOfferedPage.Filter_Dropdown1.click();
      await page.waitForTimeout(3000);
      // await priceOfferedPage.Filter_Dropdown1.click();
      vars["count"] = "1";
      log.step(`Step 7: Iterate each status option and verify rows`);
      try {
        // await page.pause();
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalStatusCountInFilters"]))) {
          await priceOfferedPage.Filter_Dropdown1.click();
          await correspondentPortalPage.Select_Commitments_Status_Dropdown.waitFor({ state: 'visible' });
          await correspondentPortalPage.Select_Commitments_Status_Dropdown.click();
          vars["IndividualStatusInFilters"] = await priceOfferedPage.Individual_Status_In_Filters(vars["count"]).textContent() || '';
          vars["IndividualStatusInFilters"] = String(vars["IndividualStatusInFilters"]).trim();
          await priceOfferedPage.Individual_Status_In_Filters(vars["count"]).click();
          await priceOfferedPage.Apply_Selected_In_Status.click();
          await applyFiltersButtonPage.Apply_Filters_Button.click();////Apply_filters_button
          await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 10000 });
          await expect(priceOfferedPage.Filtered_In_Status).toBeVisible();
          vars["RowCount"] = String(await priceOfferedPage.Row_Count.count());
          vars["Count"] = "1";
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });

          if (String(vars["IndividualStatusInFilters"]) === String("Commitment in Progress")) {
            while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["RowCount"]))) {
              await priceOfferedPage.Loans_Header_Text.click();
              if (await priceOfferedPage.Status_Individual(vars["Count"]).isVisible()) /* Element Status Individual is visible */ {
                await Methods.verifyElementTextContainsCaseInsensitive(priceOfferedPage.Status_Individual(vars["Count"]), undefined, vars["IndividualStatusInFilters"]);
                vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
              } else {
                await expect(page.getByText("No result")).toBeVisible();
              }
            }
          } else {
            await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Status_Individual_In_Screen, vars["IndividualStatusInFilters"]);
          }

          const nextBtn = correspondentPortalPage.Go_to_Next_Page_Button_2;
          const hasNextPage = (await nextBtn.count()) > 0 && await nextBtn.isVisible() && await nextBtn.isEnabled();

          if (hasNextPage) {
            await Promise.all([nextBtn.click(), spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 15000 })]);
            vars["RowCount2"] = String(await priceOfferedPage.Row_Count.count());
            vars["CCount"] = "1";
            if (String(vars["IndividualStatusInFilters"]) === String("Commitment in Progress")) {
              while (parseFloat(String(vars["CCount"])) <= parseFloat(String(vars["RowCount2"]))) {
                if (await priceOfferedPage.Status_Individual(vars["CCount"]).isVisible()) /* Element Status Individual is visible */ {
                  await Methods.verifyElementTextContainsCaseInsensitive(priceOfferedPage.Status_Individual(vars["CCount"]), undefined, vars["IndividualStatusInFilters"]);
                  vars["CCount"] = (parseFloat(String("1")) + parseFloat(String(vars["CCount"]))).toFixed(0);
                } else {
                  await expect(page.getByText("No result")).toBeVisible();
                }
              }
            } else {
              await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Status_Individual_In_Screen, vars["IndividualStatusInFilters"]);
            }
          }

          await page.waitForTimeout(3000);
          await priceOfferedPage.Filter_Dropdown1.click();
          await priceOfferedPage.Clear_All_In_Filter.click();
          await expect(priceOfferedPage.Filtered_In_Status).not.toBeVisible();
          vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        }
        log.stepPass(`Step 7 passed: Verified status rows across pages`);
      } catch (error) {
        log.stepFail(page, `Step 7 failed: Error while verifying status rows`);
        throw error;
      }
    } catch (error) {
      log.captureOnFailure(page, TC_ID, error);
      log.tcEnd('FAIL');
      throw error;
    }
  });
});  
