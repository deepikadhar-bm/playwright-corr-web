import { test, expect } from '@playwright/test';
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
import { Logger as log } from '@helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { ENV } from '@config/environments';



const TC_ID = 'REG_TS18_TC03';
const TC_TITLE = 'Apply/Clear filter for a particular company and verify that the screen should display only those company bids';

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
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
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
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step('Login to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Logged in to Correspondent Portal successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to login to Correspondent Portal');
        throw e;
      }
      log.step('Navigate to commitment list Search company in filter, verify count and clear search');
      try {
        if (profile && profile.data) {
          vars['CompanyNameInFilters'] = profile.data[0]['CompanyNameInFilters'];
          log.info('CompanyNameInFilters: ' + vars['CompanyNameInFilters']);
        }
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Filter_Dropdown1.click();
        await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
        await priceOfferedPage.Search_In_Select_Company.click();
        await priceOfferedPage.Search_In_Select_Company.waitFor({ state: 'visible' });
        await priceOfferedPage.Search_In_Select_Company.fill(vars['CompanyNameInFilters']);
        await expect(priceOfferedPage.Selected_Company.first()).toContainText(vars['CompanyNameInFilters']);
        vars['CountOfCompanyBeforeClearing'] = String(await priceOfferedPage.Company_Count_In_Filters.count());
        log.info('CountOfCompanyBeforeClearing: ' + vars['CountOfCompanyBeforeClearing']);
        await correspondentPortalPage.Clear_Search_Button.click();
        await correspondentPortalPage.Clear_Search_Button.waitFor({ state: 'hidden' });
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['TotalCompanyCountInFilter'] = String(await priceOfferedPage.Company_Count_In_Filters.count());
        log.info('TotalCompanyCountInFilter: ' + vars['TotalCompanyCountInFilter']);
        expect(Methods.verifyComparison(vars['CountOfCompanyBeforeClearing'], '<', vars['TotalCompanyCountInFilter']));
        log.stepPass('Company search and count verified before clearing');
      } catch (e) {
        await log.stepFail(page, 'Failed to search company or verify count in filter');
        throw e;
      }

      log.step('Select company, verify selected count and show selected');
      try {
        await priceOfferedPage.Check_Company.first().check();
        vars['SelectedCompanyName'] = await priceOfferedPage.Checked_Company.first().textContent() || '';
        Methods.splitBySpecialChar(vars['SelectedCompanyName'], '(', '0', 'SelectedCompanyName');
        Methods.trimtestdata(vars['SelectedCompanyName'], 'SelectedCompany');
        log.info('SelectedCompany: ' + vars['SelectedCompany']);
        await priceOfferedPage.Show_Selected.click();
        vars['numberOfItemsSelected'] = await priceOfferedPage.number_of_items_selected.textContent() || '';
        Methods.trimtestdata(vars['numberOfItemsSelected'], 'numberOfItemsSelected');
        log.info('numberOfItemsSelected: ' + vars['numberOfItemsSelected']);
        await expect(priceOfferedPage.Selected_Company).toContainText(vars['SelectedCompanyName']);
        await correspondentPortalPage.Apply_Selected.isEnabled();
        vars['SelectedCompanyCountInFilters'] = String(await priceOfferedPage.Selected_Company_Count_in_Filters.count());
        log.info('SelectedCompanyCountInFilters: ' + vars['SelectedCompanyCountInFilters']);
        expect(Methods.verifyComparison(vars['SelectedCompanyCountInFilters'], '==', '1'));
        expect(Methods.verifyComparison(vars['numberOfItemsSelected'], '==', '1'));
        log.stepPass('Selected company count and items selected count verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to select company or verify selected count');
        throw e;
      }

      log.step('Show all companies and verify count increased after deselecting');
      try {
        await correspondentPortalPage.Show_All_Button.click();
        vars['CountAfterSelectingAll'] = String(await priceOfferedPage.Company_Count_In_Filters.count());
        log.info('CountAfterSelectingAll: ' + vars['CountAfterSelectingAll']);
        expect(Methods.verifyComparison(vars['CountOfCompanyBeforeClearing'], '<', vars['CountAfterSelectingAll']));
        log.stepPass('Company count increased after showing all');
      } catch (e) {
        await log.stepFail(page, 'Failed to show all companies or verify count');
        throw e;
      }

      log.step('Select all companies and verify items selected count');
      try {
        await expect(correspondentPortalPage.Apply_Selected).toBeVisible();
        await priceOfferedPage.Select_All_In_Filters.click();
        await priceOfferedPage.SelectAllCheckBox.isChecked();
        vars['CountOfItemsSelected'] = await priceOfferedPage.Items_Selected.textContent() || '';
        Methods.trimtestdata(vars['CountOfItemsSelected'], 'CountOfItemsSelected');
        log.info('CountOfItemsSelected: ' + vars['CountOfItemsSelected']);
        expect(Methods.verifyComparison(vars['CountOfCompanyBeforeClearing'], '<', vars['CountOfItemsSelected']));
        log.stepPass('Select all verified - CountOfItemsSelected: ' + vars['CountOfItemsSelected']);
      } catch (e) {
        await log.stepFail(page, 'Failed to select all or verify items selected count');
        throw e;
      }

      log.step('Deselect all, select one company and apply filter');
      try {
        await priceOfferedPage.Select_All_In_Filters.click();
        await priceOfferedPage.Check_Company.first().check();
        vars['CheckedName'] = await priceOfferedPage.Checked_Company.first().textContent() || '';
        Methods.trimtestdata(vars['CheckedName'], 'CheckedName');
        log.info('CheckedName: ' + vars['CheckedName']);
        await correspondentPortalPage.Apply_Selected.click();
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        await expect(priceOfferedPage.Filtered_Company_NameChip).toBeVisible();
        Methods.concatenateWithSpace('Company:', vars['SelectedCompanyName'], 'SelectedCompany');
        await expect(priceOfferedPage.Filtered_Company_NameChip).toContainText(vars['SelectedCompany']);
        log.stepPass('Filter applied and company chip verified: ' + vars['SelectedCompany']);
      } catch (e) {
        await log.stepFail(page, 'Failed to apply company filter');
        throw e;
      }

      log.step('Verify all records on filtered list match selected company name');
      try {
        const NextButton = correspondentPortalPage.Go_to_Next_Page_Button;
        vars['Ccount'] = appconstants.ONE;
        while (parseFloat(String(vars['Ccount'])) <= parseFloat(String(appconstants.TWO))) {
          await priceOfferedPage.Price_Offered_Company_Name_Column_Data.first().waitFor({ state: 'visible' });
          await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Price_Offered_Company_Name_Column_Data, vars['SelectedCompanyName']);
          if (await NextButton.isVisible() && await NextButton.isEnabled()) {
            await correspondentPortalPage.Go_to_Next_Page_Button_2.click();
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          }
          Methods.MathematicalOperation(vars['Ccount'], '+', 1, 'Ccount');
        }
        log.stepPass('All records verified against selected company: ' + vars['SelectedCompanyName']);
      } catch (e) {
        await log.stepFail(page, 'Record company name mismatch. Expected: ' + vars['SelectedCompanyName']);
        throw e;
      }

      log.step('Clear all filters and verify company chip is removed');
      try {
        await commitmentListPage.Clear_all_ButtonCommitment_List.click();
        await expect(priceOfferedPage.Filtered_Company_NameChip).not.toBeVisible();
        log.stepPass('Filters cleared and company chip removed');
      } catch (e) {
        await log.stepFail(page, 'Failed to clear filters or company chip still visible');
        throw e;
      }

      log.step('Navigate to Customer Permission and capture total company count');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.waitFor({ state: 'visible' });
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await customerPermissionPage.CustomerPermission_Menu.waitFor({ state: 'visible' });
        await customerPermissionPage.CustomerPermission_Menu.click();
        await expect(customerPermissionPage.CustomerPermission_Menu_Active).toBeVisible();
        await priceOfferedPage.Page_Selection.click();
        await priceOfferedPage.Number_50.waitFor({ state: 'visible' });
        await priceOfferedPage.Number_50.click();
        vars['Count'] = appconstants.ONE;
        const NextButton1 = correspondentPortalPage.Go_to_Next_Page_Button;
        vars['TotalCompanyCountCustomerPermission'] = appconstants.ZERO;
        vars['PageCount'] = await correspondentPortalPage.Pagination_Count.textContent() || '';
        Methods.removeCharactersFromPosition(vars['PageCount'], '10', '0', 'PageCount');
        log.info('PageCount: ' + vars['PageCount']);
        while (parseFloat(String(vars['Count'])) <= parseFloat(String(vars['PageCount']))) {
          vars['CompanyNameCount'] = String(await statusInactivePage.Company_Names.count());
          Methods.MathematicalOperation(vars['TotalCompanyCountCustomerPermission'], '+', vars['CompanyNameCount'], 'TotalCompanyCountCustomerPermission');
          if (await NextButton1.isVisible() && await NextButton1.isEnabled()) {
            await correspondentPortalPage.Go_to_Next_Page_Button.click();
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          }
          Methods.MathematicalOperation(vars['Count'], '+', 1, 'Count');
        }
        log.info('TotalCompanyCountCustomerPermission: ' + vars['TotalCompanyCountCustomerPermission']);
        log.stepPass('Customer Permission company count captured: ' + vars['TotalCompanyCountCustomerPermission']);
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Customer Permission or capture company count');
        throw e;
      }

      log.step('Verify Customer Permission company count matches filter counts');
      try {
        expect(Methods.verifyComparison(vars['TotalCompanyCountCustomerPermission'], '==', vars['CountOfItemsSelected']));
        expect(Methods.verifyComparison(vars['TotalCompanyCountCustomerPermission'], '==', vars['TotalCompanyCountInFilter']));
        log.info('TotalCompanyCountCustomerPermission: ' + vars['TotalCompanyCountCustomerPermission']);
        log.info('CountOfItemsSelected: ' + vars['CountOfItemsSelected']);
        log.info('TotalCompanyCountInFilter: ' + vars['TotalCompanyCountInFilter']);
        log.stepPass('Company count verified across Customer Permission and filters');
      } catch (e) {
        await log.stepFail(
          page,
          'Company count mismatch - CustomerPermission: ' + vars['TotalCompanyCountCustomerPermission'] +
          ' | CountOfItemsSelected: ' + vars['CountOfItemsSelected'] +
          ' | TotalCompanyCountInFilter: ' + vars['TotalCompanyCountInFilter']
        );
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