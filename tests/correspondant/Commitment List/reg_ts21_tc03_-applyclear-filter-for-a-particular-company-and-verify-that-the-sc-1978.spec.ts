import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments'


const TC_ID = "REG_TS21_TC03";
const TC_TITLE = "Apply/Clear filter for a particular company and verify that the screen should display only those company bids";

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
  const credentials = ENV.getCredentials('internal');

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

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;

    if (profile && profile.data) {
      const companyName = profile.data[0]['CompanyNameInFilters'];
      console.log("company name from tdp:", companyName);
      vars["CompanyNameInFilters"] = companyName;
    }
    log.tcStart(TC_ID, TC_TITLE);
    try {
      log.step('Login to corr application');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to corr appication successful');
      }
      catch (e) {
        log.stepFail(page, 'Fail to Login corr appication Failed');
        throw e;
      }
      log.step('Navigating to commitment closed list tab');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
        await commitmentListPage.Closed_List_Tab.evaluate((el) => {
          el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });
        await page.waitForLoadState('networkidle'),
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Commitment_List_Text.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Commitment_List_Text).toBeVisible();
        await commitmentListPage.Closed_Date.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Closed_Date).toBeVisible();
        log.stepPass('Successsfully Navigate to closed list tab');
      }
      catch (e) {
        log.stepFail(page, 'Fail to navigate closed list tab');
        throw e;
      }
      log.step('Apply the particular company in filter dropdown and after applying filter screen should display only that company related bids and clear filter verify not present');
      try {
        log.info("search the company name and clear verify the dropdown options count");
      await priceOfferedPage.Filter_Dropdown1.click();
      await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
      await priceOfferedPage.Search_In_Select_Company.click();
      await priceOfferedPage.Search_In_Select_Company.fill(vars["CompanyNameInFilters"]);
      await expect(priceOfferedPage.Selected_Company.first()).toContainText(vars["CompanyNameInFilters"]);
      vars["CountOfCompanyBeforeClearing"] = String(await priceOfferedPage.Company_Count_In_Filters.count());
      await correspondentPortalPage.Clear_Search_Button.click();
      vars["TotalCompanyCountInFilter"] = String(await priceOfferedPage.Company_Count_In_Filters.count());
      expect(Methods.verifyComparison(vars["CountOfCompanyBeforeClearing"],"==",vars["TotalCompanyCountInFilter"]));

      log.info("selected the company and click on show clicked verify the difference of dropdown options count");
      await priceOfferedPage.Check_Company.first().check();
      vars["SelectedCompanyName"] = await priceOfferedPage.Checked_Company.first().textContent() || '';
      Methods.splitBySpecialChar(vars["SelectedCompanyName"], "(", "0", "SelectedCompanyName");
      Methods.trimtestdata(vars["SelectedCompanyName"], "SelectedCompanyName");
      await priceOfferedPage.Show_Selected.click();
      vars["numberOfItemsSelected"] = await priceOfferedPage.number_of_items_selected.textContent() || '';
      Methods.trimtestdata(vars["numberOfItemsSelected"], "numberOfItemsSelected");
      await expect(priceOfferedPage.Selected_Company).toContainText(vars["SelectedCompanyName"]);
      vars["SelectedCompanyCountInFilters"] = String(await priceOfferedPage.Selected_Company_Count_in_Filters.count());
      expect(Methods.verifyComparison("1","==",vars["SelectedCompanyCountInFilters"]));
      expect(Methods.verifyComparison("1","==",vars["numberOfItemsSelected"]));

      log.info("click on show all and check select all verify the dropdown companies count");
      await correspondentPortalPage.Show_All_Button.click();
      vars["CountAfterSelectingAll"] = String(await priceOfferedPage.Company_Count_In_Filters.count());
      expect(Methods.verifyComparison(vars["CountOfCompanyBeforeClearing"],"==",vars["CountAfterSelectingAll"]));
      await expect(correspondentPortalPage.Apply_Selected).toBeVisible();
      await priceOfferedPage.Select_All_In_Filters.click();
      await priceOfferedPage.SelectAllCheckBox.isChecked();
      vars["CountOfItemsSelected"] = await priceOfferedPage.Items_Selected.textContent() || '';
      Methods.trimtestdata(vars["CountOfItemsSelected"], "CountOfItemsSelected");
      expect(Methods.verifyComparison(vars["CountOfCompanyBeforeClearing"],"==",vars["CountOfItemsSelected"]));

      log.info("uncheck the select all and select the first company and verify the data");
      await priceOfferedPage.Select_All_In_Filters.click();
      await priceOfferedPage.Check_Company.first().check();
      vars["CheckedName"] = await priceOfferedPage.Checked_Company.first().textContent() || '';
      Methods.trimtestdata(vars["CheckedName"], "CheckedName");
      await correspondentPortalPage.Apply_Selected.click();
      await applyFiltersButtonPage.Apply_Filters_Button.click();
      await expect(priceOfferedPage.Filtered_Company_NameChip).toBeVisible();
      Methods.concatenateWithSpace("Company:", vars["SelectedCompanyName"], "SelectedCompany");
      await expect(priceOfferedPage.Filtered_Company_NameChip).toContainText(vars["SelectedCompany"]);
      log.info("selected company name is matched with displayed company chip");
      
      const NextButton = correspondentPortalPage.Go_to_Next_Page_Button;
      log.info("isDisabled:"+ await NextButton.getAttribute('aria-disabled'));
      vars["Ccount"] = "1";
      while (parseFloat(String(vars["Ccount"])) <= parseFloat(String("2"))) {
        await priceOfferedPage.Price_Offered_Company_Name_Column_Data.first().waitFor({ state: 'visible' });
        await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Price_Offered_Company_Name_Column_Data, vars["SelectedCompanyName"]);
        const isDisabled = await NextButton.getAttribute('aria-disabled');
        if (isDisabled === 'false') {
          await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
          log.info("cliked on next button");
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        }
        Methods.MathematicalOperation(vars["Ccount"], '+', 1, "Ccount");
      }
      await commitmentListPage.Clear_all_ButtonCommitment_List.click();
      await expect(priceOfferedPage.Filtered_Company_NameChip).not.toBeVisible();
       log.stepPass('Successfully applied the particular company in dropdown and verify the all the displayed bids are applied filtered company');
      }
      catch (e) {
        log.stepFail(page, 'Failed to apply the particular company in dropdown and verify the all the displayed bids are applied filtered company');
        throw e;
      }
      log.step('Navigating to customer permissions and very the no of companies count with available companies count in filters dropdown');
      try {
      await page.waitForTimeout(3000);
      await correspondentPortalPage.Administration_Menu.waitFor({ state: 'visible' });
      await correspondentPortalPage.Administration_Menu.dispatchEvent('click');
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await page.waitForTimeout(3000);
      await page.waitForLoadState('networkidle');
      await correspondentPortalPage.GeneralSettings_Menu.waitFor({ state: 'visible' });
      await correspondentPortalPage.GeneralSettings_Menu.dispatchEvent('click');
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await page.waitForTimeout(3000);
      await page.waitForLoadState('networkidle');
      await customerPermissionPage.CustomerPermission_Menu.waitFor({ state: 'visible' });
      await customerPermissionPage.CustomerPermission_Menu.dispatchEvent('click');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      await expect(customerPermissionPage.CustomerPermission_Menu_Active).toBeVisible();
      await priceOfferedPage.Page_Selection.click();
      await priceOfferedPage.Number_50.waitFor({ state: 'visible' });
      await page.waitForTimeout(3000);
      await priceOfferedPage.Number_50.click();
      await page.waitForTimeout(3000);
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await page.waitForLoadState('networkidle');

      vars["Count"] = "1";
      const NextButton1 = correspondentPortalPage.Go_to_Next_Page_Button;
      vars["TotalCompanyCountCustomerPermission"] = "0";
      vars["PageCount"] = await correspondentPortalPage.Pagination_Count.textContent() || '';
      Methods.removeCharactersFromPosition(vars["PageCount"], "10", "0", "PageCount");

      while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["PageCount"]))) {
        vars["CompanyNameCount"] = String(await statusInactivePage.Company_Names.count());
        Methods.MathematicalOperation(vars["TotalCompanyCountCustomerPermission"], '+', vars["CompanyNameCount"], "TotalCompanyCountCustomerPermission");
        const isDisabled1 = await NextButton1.getAttribute('aria-disabled');
        if (isDisabled1 === 'false') {
          await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
          log.info("clicked on next button");
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await page.waitForLoadState('networkidle');
        }
        Methods.MathematicalOperation(vars["Count"], '+', 1, "Count");
      }
      expect(Methods.verifyComparison(vars["TotalCompanyCountCustomerPermission"], "==", vars["TotalCompanyCountInFilter"]));
      expect(Methods.verifyComparison(vars["TotalCompanyCountCustomerPermission"], "==", vars["CountOfItemsSelected"]));
      log.stepPass('Succesfully navigated and verified the companies count with filter dropdown companies count');
      }
      catch (e) {
        log.stepFail(page, 'Fail to navigated and verified the companies count with filter dropdown companies count');
        throw e;
      }
    }
    catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});