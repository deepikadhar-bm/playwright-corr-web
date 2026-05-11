import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactive3Page } from '../../../src/pages/correspondant/status-inactive--3';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS01_TC11';
const TC_TITLE = 'Select Required Company Scenario';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let customerPermissionPage: CustomerPermissionPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactive3Page: StatusInactive3Page;
  let statusInactivePage: StatusInactivePage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);


  const profileNameCompanyNames = 'Company names from Customer permissions';
  const profile2 = testDataManager.getProfileByName(profileNameCompanyNames);
  const dataList = profile2?.data as Record<string, any>[];


  test.beforeEach(async ({ page }) => {
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    bidRequestPage = new BidRequestPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    customerPermissionPage = new CustomerPermissionPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactive3Page = new StatusInactive3Page(page);
    statusInactivePage = new StatusInactivePage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      if (profile && profile.data) {
        vars['All Company Name'] = profile.data[0]['All Company Name'];
        vars['UniqueColHeader/Enum'] = profile.data[0]['UniqueColHeader/Enum'];
        vars['Save and Move to Next Page'] = profile.data[0]['Save and Move to Next Page'];
      }
      log.step('Login to CORR Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Login to CORR Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to CORR Portal failed');
        throw e;
      }

      log.step('Navigate to Customer Permission and capture all company names');
      try {
        vars['count'] = appconstants.ONE;
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.GeneralSettings_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await customerPermissionPage.CustomerPermission_Menu.click();
        vars['CompanyNamesCount'] = String(await statusInactivePage.Company_Names.count());
        log.info('CompanyNames count: ' + vars['CompanyNamesCount']);
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CompanyNamesCount"]))) {
          vars['All_Company_Name'] = await chaseFieldNamePage.Individual_Company_in_Customer_permission(vars['count']).textContent() || '';
          log.info('Individual company name: ' + vars['All_Company_Name']);
          testDataManager.updatePartialProfileDataByDataIndex(profileNameCompanyNames, {
            'All Company Name': vars["All_Company_Name"],
          }, vars['count']);
          Methods.performArithmetic(vars["count"], 'ADDITION', appconstants.ONE, "count", 0);

        }
        log.stepPass('Navigated to Customer Permission and company names captured successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Customer Permission or capture company names');
        throw e;
      }

      log.step('Navigate to Bid Maps and create a new mapping');
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.Bid_Maps_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByRole('heading', { name: 'Mappings' })).toBeVisible();
        await correspondentPortalPage.Add_New_Mapping_Button.click();
        Methods.getCurrentTimestamp(appconstants.DATE_FORMAT_SLASH, 'CurrentDate', appconstants.ASIA_KOLKATA); /* format: dd/MM/yyyy/HH:mm:ss */;
        Methods.concatenate(appconstants.Testsigma_, vars['CurrentDate'], 'Create New Map');
        await correspondentPortalPage.Create_New_Map_Field.fill(vars["Create New Map"]);
        log.info('Create New Map: ' + vars['Create New Map']);
        await expect(correspondentPortalPage.Create_Button).toBeEnabled();
        await correspondentPortalPage.Create_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated to Bid Maps and new mapping created successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Maps or create new mapping');
        throw e;
      }

      log.step('Open Select Companies dropdown and verify all company names are displayed');
      try {

        await correspondentPortalPage.Select_Companys_Dropdown.click();
        for (let i = 0; i < parseInt(vars['CompanyNamesCount']); i++) {
          log.info('Testdata Iteration: ' + i)
          vars['All Company Name'] = dataList[i]['All Company Name'];
          Methods.splitBySpecialChar(vars['All Company Name'], '-', '0', 'Companyname');
          Methods.trimtestdata(vars['Companyname'], 'Companyname');
          await expect(chaseFieldNamePage.After_entering_Company_name_is_displayed(vars['Companyname']).first()).toContainText(vars['Companyname']);
        }
        log.info('Companyname (from split): ' + vars['Companyname']);
        log.stepPass('Select Companies dropdown opened and all company names verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to open Select Companies dropdown or verify company names');
        throw e;
      }

      log.step('Search for company, verify count and clear search field');
      try {
        await expect(bidRequestPage.Bid_Mapping_IdSearch_Input_box).toBeVisible();
        vars['Companyname'] = await statusInactive2Page.Selecting_Companies_From_Dropdown.textContent() || '';
        log.info('Companyname (search): ' + vars['Companyname']);
        await bidRequestPage.Bid_Mapping_IdSearch_Input_box.fill(vars['Companyname']);
        await expect(statusInactive3Page.Searched_Company_Name(vars['Companyname'])).toBeVisible();
        vars['After entering company name_count'] = String(await chaseFieldNamePage.Company_Names_In_DropdownBidRequest.count());
        log.info('After entering company name count: ' + vars['After entering company name_count']);
        await correspondentPortalPage.Cross_In_Search_Field.click();
        await expect(bidRequestPage.Bid_Mapping_IdSearch_Input_box).toHaveValue('');
        vars['After Clearing company name_count'] = String(await chaseFieldNamePage.Company_Names_In_DropdownBidRequest.count());
        log.info('After clearing company name count: ' + vars['After Clearing company name_count']);
        expect(Methods.verifyComparison(vars['After entering company name_count'], '<', vars['After Clearing company name_count']));
        log.stepPass('Company search verified and search field cleared successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to search for company or verify count after clearing search');
        throw e;
      }

      log.step('Select a random company and verify selection');
      try {
        Methods.generateRandomInteger(1, 20, 'Number');
        log.info('Random Number: ' + vars['Number']);
        for (let i = parseInt(vars['Number']); i <= parseInt(vars['Number']); i++) {
          vars['All Company Name'] = dataList[i]['All Company Name'];
          Methods.trimtestdata(vars['Companyname'], 'Companyname');
          log.info('Companyname (selected): ' + vars['Companyname']);
          await bidRequestPage.Bid_Mapping_IdSearch_Input_box.fill(vars['Companyname']);
          await chaseFieldNamePage.Company_name_for_Select_Companys(vars['Companyname']).check();
          await expect(correspondentPortalPage.Apply_Selected).toBeEnabled();
          await correspondentPortalPage.Apply_Selected.click();
          await expect(statusInactivePage._1_Selected_for_Companys).toBeVisible();
          await expect(chaseFieldNamePage.After_entering_Company_name_is_displayed(vars['Companyname']).first()).toBeVisible();
        }
        log.stepPass('Random company selected and verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to select random company or verify selection');
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