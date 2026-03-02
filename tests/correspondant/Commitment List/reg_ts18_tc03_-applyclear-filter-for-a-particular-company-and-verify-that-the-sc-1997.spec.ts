// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { testDataManager } from 'testdata/TestDataManager';
import { AddonHelpers } from '@helpers/AddonHelpers';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let customerPermissionPage: CustomerPermissionPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    customerPermissionPage = new CustomerPermissionPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    Methods = new AddonHelpers(page, vars);
  });
  const profileName = 'Price Offered';
  const profile = testDataManager.getProfileByName(profileName);


  test('REG_TS18_TC03_ Apply/Clear filter for a particular company and verify that the screen should display only those company bids', async ({ page }) => {
    if (profile && profile.data) {
      const companyName = profile.data[0]['CompanyNameInFilters'];
      console.log("company name from tdp:", companyName);
      vars["CompanyNameInFilters"] = companyName;
    }
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
    await priceOfferedPage.Search_In_Select_Company.click();
    await priceOfferedPage.Search_In_Select_Company.waitFor({ state: 'visible' });
    await priceOfferedPage.Search_In_Select_Company.fill(vars["CompanyNameInFilters"]);
    await expect(priceOfferedPage.Selected_Company.first()).toContainText(vars["CompanyNameInFilters"]);
    console.log("CompanyNameInFilters:", vars["CompanyNameInFilters"]);
    vars["CountOfCompanyBeforeClearing"] = String(await priceOfferedPage.Company_Count_In_Filters.count());
    await correspondentPortalPage.Clear_Search_Button.click();
    await correspondentPortalPage.Clear_Search_Button.waitFor({ state: 'hidden' });
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["TotalCompanyCountInFilter"] = String(await priceOfferedPage.Company_Count_In_Filters.count());
    // expect(String(vars["CountOfCompanyBeforeClearing"])).toBe(vars["TotalCompanyCountInFilter"]);
    expect(Methods.verifyComparison(vars["CountOfCompanyBeforeClearing"], '<', vars["TotalCompanyCountInFilter"]));
    await priceOfferedPage.Check_Company.first().check();
    vars["SelectedCompanyName"] = await priceOfferedPage.Checked_Company.first().textContent() || '';
    Methods.splitBySpecialChar(vars["SelectedCompanyName"], "(", "0", "SelectedCompanyName");
    Methods.trimtestdata(vars["SelectedCompanyName"], "SelectedCompany");
    await priceOfferedPage.Show_Selected.click();
    vars["numberOfItemsSelected"] = await priceOfferedPage.number_of_items_selected.textContent() || '';
    Methods.trimtestdata(vars["numberOfItemsSelected"], "numberOfItemsSelected");
    await expect(priceOfferedPage.Selected_Company).toContainText(vars["SelectedCompanyName"]);
    await correspondentPortalPage.Apply_Selected.isEnabled();
    vars["SelectedCompanyCountInFilters"] = String(await priceOfferedPage.Selected_Company_Count_in_Filters.count());
    expect(Methods.verifyComparison(vars["SelectedCompanyCountInFilters"], "==", "1"));
    expect(Methods.verifyComparison(vars["numberOfItemsSelected"], "==", "1"));
    console.log('verification of count of selected company in filters and number of items selected in filters is passed');
    // expect(String("1")).toBe(vars["SelectedCompanyCountInFilters"]);
    // expect(String("1")).toBe(vars["numberOfItemsSelected"]);
    await correspondentPortalPage.Show_All_Button.click();
    vars["CountAfterSelectingAll"] = String(await priceOfferedPage.Company_Count_In_Filters.count());
    // expect(String(vars["CountOfCompanyBeforeClearing"])).toBe(vars["CountAfterSelectingAll"]);
    expect(Methods.verifyComparison(vars["CountOfCompanyBeforeClearing"], "<", vars["CountAfterSelectingAll"]));

    await expect(correspondentPortalPage.Apply_Selected).toBeVisible();
    await priceOfferedPage.Select_All_In_Filters.click();
    await priceOfferedPage.SelectAllCheckBox.isChecked();
    vars["CountOfItemsSelected"] = await priceOfferedPage.Items_Selected.textContent() || '';
    Methods.trimtestdata(vars["CountOfItemsSelected"], "CountOfItemsSelected");
    // expect(String(vars["CountOfCompanyBeforeClearing"])).toBe(vars["CountOfItemsSelected"]);
    expect(Methods.verifyComparison(vars["CountOfCompanyBeforeClearing"], "<", vars["CountOfItemsSelected"]));
    await priceOfferedPage.Select_All_In_Filters.click();
    await priceOfferedPage.Check_Company.first().check();
    vars["CheckedName"] = await priceOfferedPage.Checked_Company.first().textContent() || '';
    Methods.trimtestdata(vars["CheckedName"], "CheckedName");
    await correspondentPortalPage.Apply_Selected.click();
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await expect(priceOfferedPage.Filtered_Company_NameChip).toBeVisible();
    // vars["SelectedCompany"] = "Company:" + "key_blank" + vars["SelectedCompanyName"];
    Methods.concatenateWithSpace("Company:", vars["SelectedCompanyName"], "SelectedCompany");
    await expect(priceOfferedPage.Filtered_Company_NameChip).toContainText(vars["SelectedCompany"]);
    const NextButton = correspondentPortalPage.Go_to_Next_Page_Button;
    console.log("isDisabled:", await NextButton.getAttribute('aria-disabled'));
    vars["Ccount"] = "1";
    while (parseFloat(String(vars["Ccount"])) <= parseFloat(String("2"))) {
      await priceOfferedPage.Price_Offered_Company_Name_Column_Data.first().waitFor({ state: 'visible' });
      await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Price_Offered_Company_Name_Column_Data, vars["SelectedCompanyName"]);
      const isDisabled = await NextButton.getAttribute('aria-disabled');
      if (isDisabled === 'false') {
        await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      }
      Methods.MathematicalOperation(vars["Ccount"], '+', 1, "Ccount");
    }
    await commitmentListPage.Clear_all_ButtonCommitment_List.click();
    await expect(priceOfferedPage.Filtered_Company_NameChip).not.toBeVisible();

    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.waitFor({ state: 'visible' });
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await customerPermissionPage.CustomerPermission_Menu.waitFor({ state: 'visible' });
    await customerPermissionPage.CustomerPermission_Menu.click();
    await page.waitForLoadState('networkidle');
    await expect(customerPermissionPage.CustomerPermission_Menu_Active).toBeVisible();
    await priceOfferedPage.Page_Selection.click();
    await priceOfferedPage.Number_50.waitFor({ state: 'visible' });
    await priceOfferedPage.Number_50.click();

    vars["Count"] = "1";
    const NextButton1 = correspondentPortalPage.Go_to_Next_Page_Button;
    vars["TotalCompanyCountCustomerPermission"] = "0";
    vars["PageCount"] = await correspondentPortalPage.Pagination_Count.textContent() || '';
    Methods.removeCharactersFromPosition(vars["PageCount"], "0", "10", "PageCount");

    while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["PageCount"]))) {
      vars["CompanyNameCount"] = String(await statusInactivePage.Company_Names.count());
      Methods.MathematicalOperation(vars["TotalCompanyCountCustomerPermission"], '+', vars["CompanyNameCount"], "TotalCompanyCountCustomerPermission");
      const isDisabled1 = await NextButton1.getAttribute('aria-disabled');
      if (isDisabled1 === 'false') {
        await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
        await page.waitForLoadState('networkidle');
      }
      Methods.MathematicalOperation(vars["Count"], '+', 1, "Count");
    }
    expect(Methods.verifyComparison(vars["TotalCompanyCountCustomerPermission"], "==", vars["CountOfItemsSelected"]));
    expect(Methods.verifyComparison(vars["TotalCompanyCountCustomerPermission"], "==", vars["TotalCompanyCountInFilter"]));
    
  });
});