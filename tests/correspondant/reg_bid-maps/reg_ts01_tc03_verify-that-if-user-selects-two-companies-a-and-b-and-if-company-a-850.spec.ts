// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BackButtonPage } from '../../../src/pages/correspondant/back-button';
import { BidMapPage } from '../../../src/pages/correspondant/bid-map';
import { BidMapsCompanyDropdownPage } from '../../../src/pages/correspondant/bid-maps-company-dropdown';
import { CorrespondentPortal8Page } from '../../../src/pages/correspondant/correspondent-portal-8';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { HeadingCreateNewMapPage } from '../../../src/pages/correspondant/heading-create-new-map';
import { P2142530YrFreddieMacFixedDropdownPage } from '../../../src/pages/correspondant/p-2142530-yr-freddie-mac-fixed-dropdown';
import { ProceedWithoutSavingButtonPage } from '../../../src/pages/correspondant/proceed-without-saving-button';
import { SelectAllCheckboxPage } from '../../../src/pages/correspondant/select-all-checkbox';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { YouHaveUnsavedChangesIfYouLeaveYourChangesPage } from '../../../src/pages/correspondant/you-have-unsaved-changes-if-you-leave-your-changes';
import { CorrespondentPortal7Page } from '../../../src/pages/correspondant/correspondent-portal-7';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { ENV } from '@config/environments'

const TC_ID = "REG_TS01_TC03";
const TC_TITLE = "Verify that if user selects two companies A and B and if Company A has both standard and chase execution type, and company B has only standard execution type -> Now if user selects both companies";

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let backButtonPage: BackButtonPage;
  let bidMapPage: BidMapPage;
  let bidMapsCompanyDropdownPage: BidMapsCompanyDropdownPage;
  let correspondentPortal7Page: CorrespondentPortal7Page;
  let correspondentPortal8Page: CorrespondentPortal8Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let headingCreateNewMapPage: HeadingCreateNewMapPage;
  let p2142530YrFreddieMacFixedDropdownPage: P2142530YrFreddieMacFixedDropdownPage;
  let proceedWithoutSavingButtonPage: ProceedWithoutSavingButtonPage;
  let selectAllCheckboxPage: SelectAllCheckboxPage;
  let spinnerPage: SpinnerPage;
  let youHaveUnsavedChangesIfYouLeaveYourChangesPage: YouHaveUnsavedChangesIfYouLeaveYourChangesPage;
  let helpers: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    backButtonPage = new BackButtonPage(page);
    bidMapPage = new BidMapPage(page);
    bidMapsCompanyDropdownPage = new BidMapsCompanyDropdownPage(page);
    correspondentPortal7Page = new CorrespondentPortal7Page(page);
    correspondentPortal8Page = new CorrespondentPortal8Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    headingCreateNewMapPage = new HeadingCreateNewMapPage(page);
    p2142530YrFreddieMacFixedDropdownPage = new P2142530YrFreddieMacFixedDropdownPage(page);
    proceedWithoutSavingButtonPage = new ProceedWithoutSavingButtonPage(page);
    selectAllCheckboxPage = new SelectAllCheckboxPage(page);
    spinnerPage = new SpinnerPage(page);
    youHaveUnsavedChangesIfYouLeaveYourChangesPage = new YouHaveUnsavedChangesIfYouLeaveYourChangesPage(page);
    helpers = new AddonHelpers(page, vars);
  });



  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);
  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      if (profile && profile.data) {
        const uploadText = profile.data[0]['Upload File Text Verification'];
        const executionType = profile.data[0]['Execution Type'];
        const secondCompanyName = profile.data[0]['Second Company Name'];
        vars["SecondCompanyName"] = secondCompanyName;
        vars["Upload File Text Verification"] = uploadText;
        vars["Execution Type"] = executionType;
        const companyName2 = profile.data[0]['CompanyName2'];
        vars["Company name 2"] = companyName2;
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
      }

      log.step("Step 1: Login to CORR Portal");
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass("Step 1 passed: Logged in to CORR Portal successfully");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Failed to login to CORR Portal");
        throw error;
      }
      log.step("Step 2: Navigate to Customer Permission and store company names");
      try {
        await stepGroups.stepGroup_Navigation_to_Customer_Permission(page, vars);
        await stepGroups.stepGroup_Store_Company_Names_from_Company_Permissions(page, vars);
        log.stepPass("Step 2 passed: Navigated to Customer Permission and stored company names successfully");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Failed to navigate to Customer Permission or store company names");
        throw error;
      }
      log.step("Step 3: Navigate to Administration menu and select Bid Maps");
      try {
        await correspondentPortalPage.Administration_Menu.click();
        await correspondentPortalPage.Bid_Maps_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass("Step 3 passed: Navigated to Bid Maps menu successfully");
      } catch (error) {
        log.stepFail(page, "Step 3 failed: Failed to navigate to Bid Maps menu");
        throw error;
      }
      log.step("Step 4: Create new Bid Map with timestamp");
      try {
        await correspondentPortalPage.Add_New_Mapping_Button.click();
        await expect(headingCreateNewMapPage.Create_New_Map).toBeVisible();
        helpers.getCurrentTimestamp(appconstants.DATE_FORMAT_SLASH, 'CurrentDate');
        helpers.concatenate('Testsigma_', vars['CurrentDate'], 'Create New Map');
        await correspondentPortalPage.Create_New_Map_Field.fill(vars["Create New Map"]);
        vars["BidMap"] = await correspondentPortalPage.Create_New_Map_Field.inputValue() || '';
        await correspondentPortalPage.Create_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(p2142530YrFreddieMacFixedDropdownPage.Bid_Maps_Name).toContainText(vars["Create New Map"]);
        log.stepPass("Step 4 passed: New Bid Map created successfully with name: " + vars["Create New Map"]);
      } catch (error) {
        log.stepFail(page, "Step 4 failed: Failed to create new Bid Map");
        throw error;
      }
      log.step("Step 5: Select companies and verify Show Selected/Show All behavior");
      try {
        await correspondentPortalPage.Select_Companys_Dropdown.click();
        await bidMapPage.Required_Company_Checkbox_Bidmap_Company_dropdown.check();

        vars["SelectedCompanyName"] = await correspondentPortalPage.Selected_Company_Name.textContent() || '';
        vars["NotSelectedCompanyName"] = await correspondentPortalPage.Not_Selected_Company_Name.textContent() || '';

        await expect(correspondentPortalPage.Show_Selected_Button).toBeVisible();
        await correspondentPortalPage.Show_Selected_Button.click();
        await expect(correspondentPortalPage.Dropdown_Company_for_Selected).toContainText(vars["SelectedCompanyName"]);
        await expect(page.getByText(vars["NotSelectedCompanyName"])).not.toBeVisible();

        await expect(correspondentPortalPage.Show_All_Button).toBeVisible();
        await correspondentPortalPage.Show_All_Button.click();
        await expect(correspondentPortalPage.Dropdown_Company_for_Selected).toContainText(vars["SelectedCompanyName"]);
        await expect(bidMapsCompanyDropdownPage.getRequired_CompanyBidmap_company_dropdown(vars["NotSelectedCompanyName"])).toBeVisible();
        log.stepPass("Step 5 passed: Companies selected and Show Selected/Show All behavior verified successfully");
      } catch (error) {
        log.stepFail(page, "Step 5 failed: Failed to select companies or verify selection behavior");
        throw error;
      }
      log.step("Step 6: Enter company name filter and apply selected companies");
      try {
        await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
        await page.waitForTimeout(4000);
        await expect(correspondentPortalPage.Apply_Selected).toBeVisible();
        await page.waitForTimeout(3000);
        await expect(correspondentPortalPage.Apply_Selected_for_Bid_Maps).toContainText("2");
        await correspondentPortalPage.Apply_Selected.click();
        // await expect(correspondentPortalPage.Dropdown_selection_2).toHaveValue("STANDARD");
        await expect(correspondentPortalPage.Execution_Type_Dropdown).toHaveValue("STANDARD");
        // await correspondentPortalPage.Dropdown_selection_2.click();
        await correspondentPortalPage.Execution_Type_Dropdown.click();
        log.stepPass("Step 6 passed: Companies filtered and applied successfully, execution type verified as STANDARD");
      } catch (error) {
        log.stepFail(page, "Step 6 failed: Failed to filter or apply companies");
        throw error;
      }
      log.step("Step 7: Navigate back and handle unsaved changes warning");
      try {
        await backButtonPage.BACK_Button.click();
        await expect(youHaveUnsavedChangesIfYouLeaveYourChangesPage.You_have_unsaved_changes_If_you_leave_your_changes).toBeVisible();
        await proceedWithoutSavingButtonPage.Proceed_without_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass("Step 7 passed: Navigated back and handled unsaved changes successfully");
      } catch (error) {
        log.stepFail(page, "Step 7 failed: Failed to navigate back or handle unsaved changes");
        throw error;
      }
      log.step("Step 8: Re-enter Bid Map and test Select All checkbox functionality");
      try {
        await correspondentPortalPage.Bid_Maps_name(vars["BidMap"]).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await correspondentPortalPage.Select_Companys_Dropdown.click();
        await page.waitForTimeout(2000);
        vars["CompanyCount"] = String(await correspondentPortalPage.Companies_In_Dropdown.count());
        await selectAllCheckboxPage.Select_All_Checkbox.check();
        await expect(correspondentPortalPage.Apply_Selected_for_Bid_Maps).toContainText(vars["CompanyCount"]);
        await correspondentPortalPage.Apply_Selected.click();
        await expect(correspondentPortal7Page.Apply_Selected_for_the_Bid_Maps).toContainText(vars["CompanyCount"]);
        await selectAllCheckboxPage.Select_All_Checkbox.uncheck();
        await expect(selectAllCheckboxPage.Select_All_Checkbox).toBeVisible();
        log.stepPass("Step 8 passed: Re-entered Bid Map and Select All functionality verified successfully");
      } catch (error) {
        log.stepFail(page, "Step 8 failed: Failed to re-enter Bid Map or test Select All functionality");
        throw error;
      }
      log.step("Step 9: Test company search and filter functionality");
      try {
        await expect(correspondentPortalPage.Apply_Selected).toBeVisible();
        await expect(correspondentPortalPage.Search_Text_Field).toBeVisible();
        vars["vars[FirstCompanyName]"] = await correspondentPortalPage.Search_Text_Field.textContent() || '';
        await correspondentPortalPage.Search_Text_Field.fill(vars["FirstCompanyName"]);
        await correspondentPortalPage.Cross_In_Search_Field.click();
        await correspondentPortalPage.Search_Text_Field.fill(vars["SecondCompanyName"]);
        await correspondentPortalPage.Check_box.click();
        await correspondentPortalPage.Search_Text_Field.clear();
        await expect(correspondentPortalPage.Search_Text_Field).toHaveValue('');
        await correspondentPortalPage.Search_Text_Field.fill(vars["FirstCompanyName"]);
        await correspondentPortalPage.Check_box.check();
        await expect(correspondentPortalPage.Apply_Selected).toBeVisible();
        log.stepPass("Step 9 passed: Company search and filter functionality verified successfully");
      } catch (error) {
        log.stepFail(page, "Step 9 failed: Failed to test company search and filter functionality");
        throw error;
      }

      log.tcEnd('PASS');

    } catch (error) {
      log.captureOnFailure(page, TC_ID, error);
      log.tcEnd('FAIL');
      throw error;
    }
  });
});