// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let customerPermissionPage: CustomerPermissionPage;
  let priceOfferedPage: PriceOfferedPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    customerPermissionPage = new CustomerPermissionPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('REG_TS19_TC05_ Apply/Clear filter for a particular company and verify that the screen should display only those company bids', async ({ page }) => {
    const testData: Record<string, string> = {
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
  "StatusInFilters": "Price",
  "RequestIDCreated4rthScenario": "87145580866E"
}; // Profile: "Price Offered", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
    await priceOfferedPage.Search_In_Select_Company.click();
    await priceOfferedPage.Search_In_Select_Company.fill(testData["CompanyNameInFilters"]);
    await expect(priceOfferedPage.Selected_Company).toContainText(testData["CompanyNameInFilters"]);
    vars["CountOfCompanyBeforeClearing"] = String(await priceOfferedPage.Company_Count_In_Filters.count());
    await correspondentPortalPage.Clear_Search_Button.click();
    vars["TotalCompanyCountInFilter"] = String(await priceOfferedPage.Company_Count_In_Filters.count());
    expect(String(vars["CountOfCompanyBeforeClearing"])).toBe(vars["TotalCompanyCountInFilter"]);
    await priceOfferedPage.Check_Company.check();
    vars["CheckedCompany"] = await priceOfferedPage.Checked_Company.textContent() || '';
    await priceOfferedPage.Show_Selected.click();
    vars["numberOfItemsSelected"] = await priceOfferedPage.number_of_items_selected.textContent() || '';
    for (let i = 0; i < await priceOfferedPage.Selected_Company.count(); i++) {
      await expect(priceOfferedPage.Selected_Company.nth(i)).toHaveText(String(vars["CheckedCompany"]));
    }
    vars["SelectedCompanyCountInFilters"] = String(await priceOfferedPage.Selected_Company_Count_in_Filters.count());
    expect(String("1")).toBe(vars["SelectedCompanyCountInFilters"]);
    expect(String("1")).toBe(vars["numberOfItemsSelected"]);
    await correspondentPortalPage.Show_All_Button.click();
    vars["CountAfterSelectingAll"] = String(await priceOfferedPage.Company_Count_In_Filters.count());
    expect(String(vars["CountOfCompanyBeforeClearing"])).toBe(vars["CountAfterSelectingAll"]);
    await expect(correspondentPortalPage.Apply_Selected).toBeVisible();
    await priceOfferedPage.Select_All_In_Filters.click();
    vars["CountOfItemsSelected"] = await priceOfferedPage.Items_Selected.textContent() || '';
    expect(String(vars["CountOfCompanyBeforeClearing"])).toBe(vars["CountOfItemsSelected"]);
    await priceOfferedPage.Select_All_In_Filters.click();
    await priceOfferedPage.Check_Company.check();
    vars["CheckedName"] = await priceOfferedPage.Checked_Company.textContent() || '';
    await correspondentPortalPage.Apply_Selected.click();
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await expect(priceOfferedPage.Filtered_Company_NameChip).toBeVisible();
    vars["Ccount"] = "1";
    vars["count"] = "1";
    while (parseFloat(String(vars["Ccount"])) <= parseFloat(String("2"))) {
      vars["SelectedCompanyCount"] = String(await priceOfferedPage.Company_NamePrice_Offered.count());
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["SelectedCompanyCount"]))) {
        vars["IndividualCompany"] = await priceOfferedPage.IndividualCompany.textContent() || '';
        expect(String(vars["CheckedCompany"])).toBe(vars["IndividualCompany"]);
        vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
      }
      if (true) /* Element Go to Next Page Button is enabled */ {
        await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
        vars["count"] = (parseFloat(String(vars["count"])) - parseFloat(String("19"))).toFixed(0);
      }
      vars["Ccount"] = (parseFloat(String("1")) + parseFloat(String(vars["Ccount"]))).toFixed(0);
    }
    await priceOfferedPage.Clear_all_ButtonPrice_Offered.click();
    await expect(priceOfferedPage.Filtered_Company_NameChip).toBeVisible();
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await customerPermissionPage.CustomerPermission_Menu.click();
    await page.waitForLoadState('networkidle');
    await priceOfferedPage.Page_Selection.click();
    await priceOfferedPage.Number_50.click();
    vars["Count"] = "1";
    vars["TotalCompanyCountCustomerPermission"] = "0";
    vars["PageCount"] = await correspondentPortalPage.Pagination_Count.textContent() || '';
    vars["PageCount"] = String(vars["PageCount"]).substring(10);
    while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["PageCount"]))) {
      vars["CompanyNameCount"] = String(await statusInactivePage.Company_Names.count());
      vars["TotalCompanyCountCustomerPermission"] = (parseFloat(String(vars["TotalCompanyCountCustomerPermission"])) + parseFloat(String(vars["CompanyNameCount"]))).toFixed(0);
      if (true) /* Element Go to Next Page Button is enabled */ {
        await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
      }
      vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
    }
    expect(String(vars["TotalCompanyCountCustomerPermission"])).toBe(vars["TotalCompanyCountInFilter"]);
    expect(String(vars["TotalCompanyCountCustomerPermission"])).toBe(vars["CountOfItemsSelected"]);
  });
});
