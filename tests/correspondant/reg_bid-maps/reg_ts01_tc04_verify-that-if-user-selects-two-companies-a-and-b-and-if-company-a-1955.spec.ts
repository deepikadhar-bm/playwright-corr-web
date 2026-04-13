import { test, expect, Page } from '@playwright/test';
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
import { P2142530YrFreddieMacFixedDropdownPage } from '../../../src/pages/correspondant/p-2142530-yr-freddie-mac-fixed-dropdown';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { ENV } from '@config/environments'

const TC_ID = "REG_TS01_TC04";
const TC_TITLE = "Verify that if user selects two companies A and B and if company A has both exe type and company B has only chase exe type, then user should be able to view only chase exe type in the dropdown";

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, any> = {};
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
        vars["Company name"] = vars["Company name 1"]
        vars["Company name 2"] = profile.data[0]['CompanyName2'];;

        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
        vars["CompanyIndex"] = appconstants.THREE;
        vars["CompanyNameActionIndex"] = appconstants.THREE;
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
        vars["CompanyIndex"] = appconstants.FOUR;
        vars["CompanyNameActionIndex"] = appconstants.FOUR;
        log.info(vars["CompanyIndex"] + " | " + vars["CompanyNameActionIndex"]);
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
        vars["Company name"] = vars["Company name 2"];
        await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
        await expect(correspondentPortalPage.Apply_Selected_for_Bid_Maps).toContainText("2");
        await correspondentPortalPage.Apply_Selected.click();
        vars["CompanyNamePartial"] = String(vars["Company name 1"]).substring(0, String(vars["Company name 1"]).length - 4);
        log.info("Partial Company Name: " + vars["CompanyNamePartial"]);
        log.info("First Company Name: " + vars["Company name 1"]);
        await expect(actionsPage.CompanyName_Below_Dropdown(vars["CompanyNamePartial"])).toContainText(vars["Company name 1"]);
        vars["CompanyNamePartial"] = String(vars["Company name 2"]).substring(0, String(vars["Company name 2"]).length - 10);
        await expect(actionsPage.CompanyName_Below_Dropdown(vars["CompanyNamePartial"])).toContainText(vars["Company name 2"]);
        await correspondentPortalPage.Dropdown_selection_2.selectOption("STANDARD");
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
        await correspondentPortalPage.Search_Text_Field.fill(vars["Company name 2"]);
        await expect(correspondentPortalPage.Check_box).toBeVisible();
        await statusInactivePage.Selected1_Dropdown.click();
        await bidMapsCompanyDropdownPage.Remove_First_Selected_Company_ButtonBid_map_creation.click();
        await correspondentPortalPage.Select_Companys_Dropdown.click();
        vars["Company name"] = vars["Company name 1"];
        await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
        vars["Company name"] = vars["Company name 2"];
        await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
        await correspondentPortalPage.Apply_Selected.click();
        await correspondentPortalPage.Dropdown_selection_2.selectOption("CHASE_DIRECT");
        await expect(correspondentPortalPage.Dropdown_selection_2).toHaveValue("CHASE_DIRECT");
       
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
        vars["Company name"] = vars["Company name 1"];
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
        vars["Company name"] = vars["Company name 1"];
        await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
        vars["Company name"] = vars["Company name 2"];
        await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);

        await correspondentPortalPage.Search_Text_Field.clear();
        await checkboxPage.checkbox2.check();
        const rows = page.locator("//div[contains(@class, 'dropdown-overflow')]//label[@role='option']");

        // Capture already selected names
        const selectedSet = new Set<string>(
          await page
            .locator("//label[contains(@class, 'checked')]//span")
            .evaluateAll((spans: HTMLElement[]) => spans.map(s => s.getAttribute('title') || ""))
        );

        // Loop through indices 2 to 5 to capture and select companies, checking for duplicates against the Set
        for (let i = 1; i < 6; i++) {
          const currentRow = rows.nth(i);
          const companyName = await currentRow.locator('span').getAttribute('title');

          if (companyName) {
            // Only check if it's NOT already selected to avoid UI duplication bugs
            if (!selectedSet.has(companyName)) {
              await currentRow.locator('input[type="checkbox"]').check();
              selectedSet.add(companyName);
            }
          }
        }

        vars['storedCompanies'] = Array.from(selectedSet).sort();
        vars['storedCompanies'] = vars['storedCompanies']
        .map((name: string) => name.replace(/\s+/g, ' ').trim())
        .sort();

        await expect(correspondentPortalPage.Apply_Selected).toContainText("6");
        await correspondentPortalPage.Apply_Selected.click();
        log.stepPass("Step 8 passed: Multiple companies selected successfully");
      } catch (error) {
        log.stepFail(page, "Step 8 failed: Failed to select multiple companies");
        throw error;
      }
      log.step("Step 9: Verify selected companies display correctly in dropdown area");
      try {
           await  correspondentPortalPage.More_companies.click();
        const uiSelectedNames = await page
          .locator("//table[@role='table']//tbody//td[@data-title='Company']")
          .evaluateAll((cells: HTMLElement[]) =>
            cells.map(c => c.innerText.replace(/\s+/g, ' ').trim()).sort()
          );

        //stored variable is also sorted for an accurate comparison
        expect(uiSelectedNames).toEqual(vars['storedCompanies'].sort());
        log.info("Verification Passed: UI matches stored companies.");

        await chaseFieldNamePage.Ok_Button_Bid_Request.click();
        log.stepPass("Step 9 passed: All selected companies displayed correctly");
      } catch (error) {
        log.stepFail(page, "Step 9 failed: Failed to verify selected companies display");
        throw error;
      }
      log.step("Step 10: Verify company visibility and more companies button behavior");
      try {
        
        await expect(page.getByText(vars["Company name 2"])).not.toBeVisible();
        log.info("Verified that Company name 2 is not visible ");
        await expect(correspondentPortalPage.More_companies).toContainText("2");
        await correspondentPortalPage.More_companies.hover();
        await expect(correspondentPortalPage.Dropdown_selection_2).toHaveValue('');
        await correspondentPortalPage.More_companies.click();
        log.stepPass("Step 10 passed: Company visibility and more button verified successfully");
      } catch (error) {
        log.stepFail(page, "Step 10 failed: Failed to verify company visibility or more button");
        throw error;
      }
      log.step("Step 11: Verify Added On date, save draft and edit file name");
      try {
        helpers.getCurrentTimestamp('MM/dd/yyyy hh:mm a', 'Added On',appconstants.UTC);
        vars["Added On Bid Map"] = await correspondentPortalPage.Added_On.textContent() || '';
        expect(String(vars["Added On"])).toBe(vars["Added On Bid Map"].trim());
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