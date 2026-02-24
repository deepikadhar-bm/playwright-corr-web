// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
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

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS19_TC06_Apply/Clear filter for a particular Status field and verify the apply filter functionality', async ({ page }) => {
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

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_Commitments_Status_Dropdown.click();
    await correspondentPortalPage.Dropdown_Search_In_Commitments_Status.click();
    await correspondentPortalPage.Dropdown_Search_In_Commitments_Status.fill(testData["StatusInFilters"]);
    await page.waitForTimeout(5000);
    await expect(priceOfferedPage.Selected_Status).toContainText(testData["StatusInFilters"]);
    vars["CountOfSelectedStatusBeforeClearing"] = String(await priceOfferedPage.Selected_Status.count());
    await correspondentPortalPage.Clear_Search_Button.click();
    vars["StatusCountInFilters"] = String(await priceOfferedPage.Status_Count_In_Filters.count());
    expect(String(vars["CountOfSelectedStatusBeforeClearing"])).toBe(vars["StatusCountInFilters"]);
    await priceOfferedPage.Status_Checkbox.check();
    vars["CheckedStatus"] = await priceOfferedPage.Checked_Status.textContent() || '';
    await correspondentPortalPage.Dropdown_Show_Selected_In_Status.click();
    vars["CountOfstatusChecked"] = await priceOfferedPage.number_of_items_selected.textContent() || '';
    expect(String("1")).toBe(vars["CountOfstatusChecked"]);
    vars["SelectedstatusInFilterCount"] = String(await priceOfferedPage.Selected_Company_Count_in_Filters.count());
    expect(String("1")).toBe(vars["SelectedstatusInFilterCount"]);
    await correspondentPortalPage.Show_All_Button.click();
    vars["TotalStatusCountInFilters"] = String(await priceOfferedPage.Status_Count_In_Filters.count());
    expect(String(vars["CountOfSelectedStatusBeforeClearing"])).toBe(vars["TotalStatusCountInFilters"]);
    await expect(priceOfferedPage.Apply_Selected_In_Status).toBeVisible();
    await priceOfferedPage.Select_All_In_Status.click();
    vars["CountOfItemsSelected"] = await priceOfferedPage.Items_Selected.textContent() || '';
    expect(String(vars["CountOfSelectedStatusBeforeClearing"])).toBe(vars["CountOfItemsSelected"]);
    await priceOfferedPage.Select_All_In_Status.click();
    await priceOfferedPage.Filter_Dropdown1.click();
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalStatusCountInFilters"]))) {
      await priceOfferedPage.Filter_Dropdown1.click();
      await correspondentPortalPage.Select_Commitments_Status_Dropdown.waitFor({ state: 'visible' });
      await correspondentPortalPage.Select_Commitments_Status_Dropdown.click();
      vars["IndividualStatusInFilters"] = await priceOfferedPage.Individual_Status_In_Filters.textContent() || '';
      vars["IndividualStatusInFilters"] = String(vars["IndividualStatusInFilters"]).trim();
      await priceOfferedPage.Individual_Status_In_Filters.click();
      await priceOfferedPage.Apply_Selected_In_Status.click();
      await applyFiltersButtonPage.Apply_Filters_Button.click();
      await page.waitForLoadState('networkidle');
      await expect(priceOfferedPage.Filtered_In_Status).toBeVisible();
      vars["RowCount"] = String(await priceOfferedPage.Row_Count.count());
      vars["Count"] = "1";
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      if (String(vars["IndividualStatusInFilters"]) === String("Commitment in Progress")) {
        while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["RowCount"]))) {
          await priceOfferedPage.Loans_Header_Text.click();
          if (true) /* Element Status Individual is visible */ {
            vars["IndividualStatusInScreen"] = await priceOfferedPage.Status_Individual.textContent() || '';
            vars["IndividualStatusInScreen"] = String(vars["IndividualStatusInScreen"]).trim();
            expect(String(vars["IndividualStatusInFilters"]).toLowerCase()).toContain(String(vars["IndividualStatusInScreen"]).toLowerCase());
          } else {
            await expect(page.getByText("No result")).toBeVisible();
          }
          vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
        }
      } else {
        for (let i = 0; i < await priceOfferedPage.Status_Individual_In_Screen.count(); i++) {
          await expect(priceOfferedPage.Status_Individual_In_Screen.nth(i)).toHaveText(String(vars["IndividualStatusInFilters"]));
        }
      }
      if (true) /* Element Go to Next Page Button is enabled */ {
        await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
        vars["RowCount2"] = String(await priceOfferedPage.Row_Count.count());
        vars["CCount"] = "1";
        if (String(vars["IndividualStatusInFilters"]) === String("Commitment in Progress")) {
          while (parseFloat(String(vars["CCount"])) <= parseFloat(String(vars["RowCount2"]))) {
            vars["IndividualStatusInScreen2"] = await priceOfferedPage.Status_Individual_2.textContent() || '';
            vars["IndividualStatusInScreen2"] = String(vars["IndividualStatusInScreen2"]).trim();
            vars["IndividualStatusInScreen2"] = String(vars["IndividualStatusInScreen2"]).trim();
            if (true) /* Verify if IndividualStatusInFilters contains ignore-case wit */ {
            } else {
              await expect(page.getByText("No result")).toBeVisible();
            }
            vars["CCount"] = (parseFloat(String("1")) + parseFloat(String(vars["CCount"]))).toFixed(0);
          }
        } else {
          for (let i = 0; i < await priceOfferedPage.Status_Individual_In_Screen.count(); i++) {
            await expect(priceOfferedPage.Status_Individual_In_Screen.nth(i)).toHaveText(String(vars["IndividualStatusInFilters"]));
          }
        }
      }
      await priceOfferedPage.Filter_Dropdown1.click();
      await priceOfferedPage.Clear_All_In_Filter.click();
      await expect(priceOfferedPage.Filtered_In_Status).toBeVisible();
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
  });
});
