// [POM-APPLIED]
import { test, expect, Page } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionsPage } from '../../../src/pages/correspondant/actions';
import { AdvanceSearchPage } from '../../../src/pages/correspondant/advance-search';
import { Amix4MosnaCovdaA4189CheckboxPage } from '../../../src/pages/correspondant/amix4-mosna-covda-a4189-checkbox';
import { BidMapsCompanyDropdownPage } from '../../../src/pages/correspondant/bid-maps-company-dropdown';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CheckboxPage } from '../../../src/pages/correspondant/checkbox';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { HeadingCreateNewMapPage } from '../../../src/pages/correspondant/heading-create-new-map';
import { HomeSweetMortgageCheckboxPage } from '../../../src/pages/correspondant/home-sweet-mortgage-checkbox';
import { NewMapNameInputPage } from '../../../src/pages/correspondant/new-map-name-input';
import { P15ActivePage } from '../../../src/pages/correspondant/p-15-active';
import { P1MoreButtonPage } from '../../../src/pages/correspondant/p-1-more-button';
import { P2142530YrFreddieMacFixedDropdownPage } from '../../../src/pages/correspondant/p-2142530-yr-freddie-mac-fixed-dropdown';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { uploadFile } from '../../../src/helpers/file-helpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { ENV } from '@config/environments'

const TC_ID = "REG_TS01_TC04";
const TC_TITLE = "Verify that if user selects two companies A and B and if company A has both exe type and company B has only chase exe type, then user should be able to view only chase exe type in the dropdown";

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let actionsPage: ActionsPage;
  let advanceSearchPage: AdvanceSearchPage;
  let amix4MosnaCovdaA4189CheckboxPage: Amix4MosnaCovdaA4189CheckboxPage;
  let bidMapsCompanyDropdownPage: BidMapsCompanyDropdownPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let checkboxPage: CheckboxPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let headingCreateNewMapPage: HeadingCreateNewMapPage;
  let homeSweetMortgageCheckboxPage: HomeSweetMortgageCheckboxPage;
  let newMapNameInputPage: NewMapNameInputPage;
  let p15ActivePage: P15ActivePage;
  let p1MoreButtonPage: P1MoreButtonPage;
  let p2142530YrFreddieMacFixedDropdownPage: P2142530YrFreddieMacFixedDropdownPage;
  let spinnerPage: SpinnerPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;
  let helpers: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    actionsPage = new ActionsPage(page);
    advanceSearchPage = new AdvanceSearchPage(page);
    amix4MosnaCovdaA4189CheckboxPage = new Amix4MosnaCovdaA4189CheckboxPage(page);
    bidMapsCompanyDropdownPage = new BidMapsCompanyDropdownPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    checkboxPage = new CheckboxPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    headingCreateNewMapPage = new HeadingCreateNewMapPage(page);
    homeSweetMortgageCheckboxPage = new HomeSweetMortgageCheckboxPage(page);
    newMapNameInputPage = new NewMapNameInputPage(page);
    p15ActivePage = new P15ActivePage(page);
    p1MoreButtonPage = new P1MoreButtonPage(page);
    p2142530YrFreddieMacFixedDropdownPage = new P2142530YrFreddieMacFixedDropdownPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
    helpers = new AddonHelpers(page, vars);
  });


  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);
  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      if (profile && profile.data) {
        const uploadText = profile.data[0]['Upload File Text Verification'];
        vars["Upload File Text Verification"] = uploadText;
        vars["Execution Type"] = profile.data[0]['Execution Type'];
        const companyName1 = profile.data[0]['CompanyName1'];
        vars["Company name 1"] = companyName1;
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
      log.step("Step 2: Navigate to Customer Permission and configure company execution types");
      try {
        await stepGroups.stepGroup_Navigate_to_Customer_Permission_to_Fetch_First_Company_Name(page, vars);
        await stepGroups.stepGroup_Store_Company_Names_from_Company_Permissions(page, vars);
        await stepGroups.stepGroup_Store_More_Company_Name(page, vars);
        await stepGroups.stepGroup_Standard_and_Chase_Direct_ON_for_Company(page, vars);
        await stepGroups.stepGroup_Store_More_Company_Name(page, vars);
        await stepGroups.stepGroup_Only_Chase_Direct_On_for_Company(page, vars);
        log.stepPass("Step 2 passed: Navigated to Customer Permission and configured company execution types successfully");
      } catch (error) {
        log.stepFail(page, "Step 2 failed: Failed to navigate or configure company permissions");
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
      log.step("Step 5: Select companies and verify execution type with mixed configurations");
      try {
        await correspondentPortalPage.Select_Companys_Dropdown.click();
        await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
        await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
        await expect(correspondentPortalPage.Apply_Selected_for_Bid_Maps).toContainText("2");
        await correspondentPortalPage.Apply_Selected.click();
        vars["CompanyNamePartial"] = String(vars["FirstCompanyName"]).substring(0, String(vars["FirstCompanyName"]).length - 4);
        await expect(actionsPage.CompanyName_Below_Dropdown).toContainText(vars["FirstCompanyName"]);
        vars["CompanyNamePartial"] = String(vars["SecondCompanyName"]).substring(0, String(vars["SecondCompanyName"]).length - 10);
        await expect(actionsPage.CompanyName_Below_Dropdown).toContainText(vars["SecondCompanyName"]);
        await correspondentPortalPage.Dropdown_selection_2.click();
        await expect(correspondentPortalPage.Dropdown_selection_2).toHaveValue("STANDARD");
        log.stepPass("Step 5 passed: Companies selected and execution type verified successfully");
      } catch (error) {
        log.stepFail(page, "Step 5 failed: Failed to select companies or verify execution type");
        throw error;
      }
      log.step("Step 6: Remove and re-add companies to verify Chase Direct execution type");
      try {
        await bidMapsCompanyDropdownPage.Remove_second_Selected_Company_buttonBid_Map_Creation.click();
        await statusInactivePage.Selected1_Dropdown.click();
        await correspondentPortalPage.Search_Text_Field.fill(vars["SecondCompanyName"]);
        await expect(correspondentPortalPage.Check_box).toBeVisible();
        await statusInactivePage.Selected1_Dropdown.click();
        await bidMapsCompanyDropdownPage.Remove_First_Selected_Company_ButtonBid_map_creation.click();
        await correspondentPortalPage.Select_Companys_Dropdown.click();
        await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
        await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
        await correspondentPortalPage.Apply_Selected.click();
        await correspondentPortalPage.Dropdown_selection_2.click();
        await expect(correspondentPortalPage.Dropdown_selection_2.locator('option', { hasText: "CHASE_DIRECT" })).toBeVisible();
        log.stepPass("Step 6 passed: Companies removed and re-added, Chase Direct execution type verified");
      } catch (error) {
        log.stepFail(page, "Step 6 failed: Failed to remove/re-add companies or verify execution type");
        throw error;
      }
      log.step("Step 7: Test single company selection and execution type");
      try {
        await correspondentPortalPage.Cross_button_in_Bid_Map.click();
        await correspondentPortalPage.Cross_button_in_Bid_Map.click();
        await correspondentPortalPage.Select_Companys_Dropdown.click();
        await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
        await expect(correspondentPortalPage.Apply_Selected).toContainText("1");
        await correspondentPortalPage.Apply_Selected.click();
        await correspondentPortalPage.Dropdown_selection_2.click();
        await correspondentPortalPage.Dropdown_selection_2.hover();
        await correspondentPortalPage.Dropdown_selection_2.click();
        await correspondentPortalPage.Dropdown_selection_2.hover();
        await correspondentPortalPage.Dropdown_selection_2.selectOption({ label: vars["Execution Type"] });
        await expect(correspondentPortalPage.Dropdown_selection_2).toHaveValue(vars["Execution Type"]);
        log.stepPass("Step 7 passed: Single company selected and execution type set successfully");
      } catch (error) {
        log.stepFail(page, "Step 7 failed: Failed to select single company or set execution type");
        throw error;
      }
      log.step("Step 8: Select multiple companies and verify company display behavior");
      try {
        await correspondentPortalPage.Cross_button_in_Bid_Map.click();
        await correspondentPortalPage.Select_Companys_Dropdown.click();
        await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
        await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
        await correspondentPortalPage.Search_Text_Field.clear();
        await checkboxPage.checkbox2.check();
        vars["ThirdCompanyName"] = await correspondentPortalPage.Third_Company_Name.textContent() || '';
        await homeSweetMortgageCheckboxPage.FourthCompany_Checkbox.check();
        vars["FourthCompanyName"] = await correspondentPortalPage.Fourth_Company_Name.textContent() || '';
        await statusInactive2Page.Import_Rule_Checkbox.check();
        vars["FifthCompanyName"] = await correspondentPortalPage.Fifth_Company_Name.textContent() || '';
        await amix4MosnaCovdaA4189CheckboxPage.SixthCompany_Checkbox.check();
        vars["SixthCompanyName"] = await correspondentPortalPage.Sixth_Company_Name.textContent() || '';
        await expect(correspondentPortalPage.Apply_Selected).toContainText("6");
        await correspondentPortalPage.Apply_Selected.click();
        log.stepPass("Step 8 passed: Multiple companies selected successfully");
      } catch (error) {
        log.stepFail(page, "Step 8 failed: Failed to select multiple companies");
        throw error;
      }
      log.step("Step 9: Verify selected companies display correctly in dropdown area");
      try {
        vars["ExpectedThirdCompanyName"] = await statusInactivePage.Below_Dropdown_First_company.textContent() || '';
        expect(String(vars["ExpectedThirdCompanyName"])).toBe(vars["ThirdCompanyName"]);
        await expect(advanceSearchPage.Below_Dropdown_Second_Company).toContainText(vars["FourthCompanyName"]);
        vars["ExpectedFifthCompanyName"] = String(vars["FifthCompanyName"]).trim();
        vars["FifthCompanyName1"] = await p15ActivePage.Below_Dropdown_Third_Company.textContent() || '';
        vars["FifthCompanyName1"] = String(vars["FifthCompanyName1"]).trim();
        expect(String(vars["FifthCompanyName1"])).toBe(vars["ExpectedFifthCompanyName"]);
        await correspondentPortalPage._2_more_Button.click();
        vars["lastcompany"] = await statusInactive2Page.Below_Dropdown_Fourth_Company.textContent() || '';
        expect(String(vars["lastcompany"])).toBe(vars["SixthCompanyName"]);
        await chaseFieldNamePage.Ok_Button_Bid_Request.click();
        await page.waitForLoadState('networkidle');
        log.stepPass("Step 9 passed: All selected companies displayed correctly");
      } catch (error) {
        log.stepFail(page, "Step 9 failed: Failed to verify selected companies display");
        throw error;
      }
      log.step("Step 10: Verify company visibility and more companies button behavior");
      try {
        await expect(page.getByText(vars["SecondCompanyName"])).not.toBeVisible();
        await expect(correspondentPortalPage.More_companies).toContainText("2");
        // await correspondentPortalPage.More_companies.hover();
        await expect(correspondentPortalPage.Dropdown_selection_2).toHaveValue('');
        await p1MoreButtonPage._1_more_Button.click();
        log.stepPass("Step 10 passed: Company visibility and more button verified successfully");
      } catch (error) {
        log.stepFail(page, "Step 10 failed: Failed to verify company visibility or more button");
        throw error;
      }
      log.step("Step 11: Verify Added On date, save draft and edit file name");
      try {
        helpers.getCurrentTimestamp('MM/dd/yyyy hh:mm a', 'Added On');
        vars["Added On Bid Map"] = await correspondentPortalPage.Added_On.textContent() || '';
        expect(String(vars["Added On"])).toBe(vars["Added On Bid Map"]);
        await correspondentPortalPage.close_pop_up_bid_request_details.click();
        await correspondentPortalPage.Save_Draft_Button1.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(newMapNameInputPage.New_Map_Name_Input).toBeEditable();
        await newMapNameInputPage.New_Map_Name_Input.fill(Array.from({ length: 5 }, () => "ab".charAt(Math.floor(Math.random() * 2))).join(''));
        vars["EditedFileName"] = await newMapNameInputPage.New_Map_Name_Input.inputValue() || '';
        await expect(newMapNameInputPage.New_Map_Name_Input).toHaveValue(vars["EditedFileName"]);
        await actionsPage.Save_Draft_Exit.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(page.getByText(vars["EditedFileName"])).toBeVisible();
        log.stepPass("Step 11 passed: Added On date verified, draft saved and file name edited successfully");
      } catch (error) {
        log.stepFail(page, "Step 11 failed: Failed to verify date, save draft or edit file name");
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