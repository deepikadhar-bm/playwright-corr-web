import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { EnumerationMappingPage } from '../../../src/pages/correspondant/enumeration-mapping';
import { EnumFilterPage } from '../../../src/pages/correspondant/enum-filter';
import { FilterEnumerationsDropdownPage } from '../../../src/pages/correspondant/filter-enumerations-dropdown';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { testDataManager } from 'testdata/TestDataManager';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { AddonHelpers } from '@helpers/AddonHelpers';


const TC_ID = 'REG_TS10_TC01';
const TC_TITLE = 'Verify that when the user applies filters by selecting an enum from the dropdown, only those corresponding enum records should be displayed, and the values will be displayed based on the filter selection.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let enumerationMappingPage: EnumerationMappingPage;
  let enumFilterPage: EnumFilterPage;
  let filterEnumerationsDropdownPage: FilterEnumerationsDropdownPage;
  let headerMappingPage: HeaderMappingPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  const credentials = ENV.getCredentials('internal');

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    enumerationMappingPage = new EnumerationMappingPage(page);
    enumFilterPage = new EnumFilterPage(page);
    filterEnumerationsDropdownPage = new FilterEnumerationsDropdownPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    if (profile && profile.data) {
      vars["Unidentified Enumerations"] = profile.data[0]['Unidentified Enumerations'];
      vars["Unused Enumerations"] = profile.data[0]['Unused Enumerations'];
    }

    try {

      log.step('Login to CORR Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login to CORR Portal successful');
      } catch (e) {
        await log.stepFail(page, 'Login to CORR Portal failed');
        throw e;
      }

      log.step('Enable Smart Mapper and create Bid Map up to Header Mapping');
      try {
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        const fileName = fileconstants.BID_QA_FILE_COMMON;
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars, fileName);
        log.stepPass('Smart Mapper enabled and Bid Map created up to Header Mapping successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to enable Smart Mapper or create Bid Map up to Header Mapping');
        throw e;
      }

      log.step('Fetch Enum from Header Mapping screen and verify, then navigate to Enumeration Mapping');
      try {
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await page.waitForTimeout(5000);
        await stepGroups.stepGroup_Fetching_Enum_From_Header_Mapping_Screen_and_Verifying_the_S(page, vars);
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
        await correspondentPortalPage.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(rulesAndActionsButtonPage.Rules_and_Actions_Button).toBeVisible();
        log.stepPass('Enum fetched and verified; navigated to Enumeration Mapping screen');
      } catch (e) {
        await log.stepFail(page, 'Failed to fetch Enum or navigate to Enumeration Mapping');
        throw e;
      }

      log.step('Apply Unidentified Enumerations filter and verify all records are unidentified');
      try {
        vars["count"] = appconstants.ONE;
        await correspondentPortalPage.Dropdown_Show_All_Enumerations_Show_Unidentified_Enum.selectOption({ value: vars["Unidentified Enumerations"] });
        vars["BidSampleCount"] = String(await enumerationMappingPage.Bid_Enum_names.count());
        log.info('Bid Sample Count: '+vars["BidSampleCount"]);
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["BidSampleCount"]))) {
          log.info('Iteration: '+vars["count"]);
          vars["IndividualBidSample"] = await enumerationMappingPage.Individual_Bid_Sample(vars['count']).textContent() || '';
          vars["UnidentifiedChaseValueCount"] = String(await enumerationMappingPage.Correspondent_Unidentified_Chase_Value(vars['IndividualBidSample']).count());
          log.info('Unidentified Chase Value Count: '+vars["UnidentifiedChaseValueCount"]);
          Methods.verifyComparison(vars["UnidentifiedChaseValueCount"],'>=',appconstants.ONE);
          Methods.performArithmetic(vars["count"], 'ADDITION', '1', 'count', 0);
        }
        log.stepPass(`Unidentified Enumerations filter verified for ${vars["BidSampleCount"]} records`);
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Unidentified Enumerations filter');
        throw e;
      }

      log.step('Check first enum checkbox and apply Unused Enumerations filter, verify Bid Field Name is hidden');
      try {
        vars["BidFieldName"] = await enumFilterPage.Bid_Field_Name_Text.textContent() || '';
        await enumFilterPage.First_Checkbox_Element(vars['BidFieldName']).check();
        await enumerationMappingPage.Status_Filter_DropdownEnumeration.selectOption({ value: vars["Unused Enumerations"] });
        await expect(page.getByText(vars["BidFieldName"])).not.toBeVisible();
        log.stepPass(`Bid Field Name "${vars["BidFieldName"]}" correctly hidden after Unused Enumerations filter`);
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Unused Enumerations filter hides Bid Field Name');
        throw e;
      }

      log.step('Verify Filter Enumerations dropdown — check, uncheck and search behaviour');
      try {
        await correspondentPortalPage.Select_Clients_Dropdown_2.click();
        await correspondentPortalPage.Filter_Enumeration.first().check();
        await expect(correspondentPortalPage.Apply_Selected).toBeEnabled();
        await correspondentPortalPage.Filter_Enumeration.first().uncheck();
        await expect(correspondentPortalPage.Apply_Selected).toBeDisabled();
        vars["CountOfBidFields"] = String(await filterEnumerationsDropdownPage.Count_Of_BidFields_In_Dropdown.count());
        vars["FirstBidField"] = await filterEnumerationsDropdownPage.First_check_box_text.textContent() || '';
        await filterEnumerationsDropdownPage.Search_Box.type(vars["FirstBidField"]);
        await expect(filterEnumerationsDropdownPage.Bid_field_Searched_for(vars['FirstBidField'])).toBeVisible();
        await filterEnumerationsDropdownPage.Cancel_Search_Button.click();
        await expect(filterEnumerationsDropdownPage.Search_Box).toHaveValue('');
        await expect(filterEnumerationsDropdownPage.Count_Of_BidFields_In_Dropdown).toHaveCount(parseInt(vars["CountOfBidFields"]));
        log.stepPass('Filter Enumerations dropdown check/uncheck and search behaviour verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Filter Enumerations dropdown behaviour');
        throw e;
      }

      log.step('Verify Show Selected filter — select two checkboxes and confirm count is 2');
      try {
        vars["checkbox count"] = String(await filterEnumerationsDropdownPage.Count_Of_BidFields_In_Dropdown.count());
        await filterEnumerationsDropdownPage.First_BidField_Checkbox.check();
        await page.waitForTimeout(2000);
        await filterEnumerationsDropdownPage.First_BidField_Checkbox.check();
        await filterEnumerationsDropdownPage.Show_Selected_Filter.click();
        await expect(filterEnumerationsDropdownPage.Show_Selected_Filter).not.toBeVisible();
        await expect(filterEnumerationsDropdownPage.Selected_BidFields.first()).toBeVisible();
        vars["SelectedBidInFilterEnum"] = String(await filterEnumerationsDropdownPage.Selected_BidFields.count());
        expect(Methods.verifyString(vars["SelectedBidInFilterEnum"],'equals',appconstants.TWO));
        log.stepPass('Show Selected filter verified: 2 selected Bid Fields visible');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Show Selected filter count');
        throw e;
      }

      log.step('Verify Show All filter restores full Bid Field list count');
      try {
        await headerMappingPage.First_Checked_Bid.uncheck();
        await page.waitForTimeout(2000);
        await headerMappingPage.First_Checked_Bid.uncheck();
        await filterEnumerationsDropdownPage.Show_ALL_Filter.click();
        await expect(filterEnumerationsDropdownPage.Show_ALL_Filter).not.toBeVisible();
        await expect(page.getByText("Select All")).toBeVisible();
        vars["count"] = String(await filterEnumerationsDropdownPage.Count_of_Bids_Checkbox.count());
        expect(Methods.verifyString(vars["checkbox count"],'equals',vars["count"]));
        log.stepPass(`Show All filter verified: total Bid Field count restored to ${vars["count"]}`);
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Show All filter restores full count');
        throw e;
      }

      log.step('Select two Bid Fields from dropdown, apply filter and verify filtered results');
      try {
        await filterEnumerationsDropdownPage.First_BidField_Checkbox_2.check();
        vars["FirstBidFieldName"] = await filterEnumerationsDropdownPage.First_check_box_text.textContent() || '';
        Methods.splitBySpecialChar(vars["FirstBidFieldName"],'/','0','FirstBidFieldName');
        await filterEnumerationsDropdownPage.Second_Checkbox_filter_enum.check();
        vars["SecondBidFieldName"] = await filterEnumerationsDropdownPage.Second_Bidfield_Checkbox_Text.textContent() || '';
        Methods.splitBySpecialChar(vars["SecondBidFieldName"],'/','0','SecondBidFieldName');
        await correspondentPortalPage.Apply_Selected.click();
        await expect(filterEnumerationsDropdownPage.Filtered_BidFields.first()).toBeVisible();
        vars["count1"] = String(await filterEnumerationsDropdownPage.Filtered_BidFields.count());
        expect(Methods.verifyString(vars["count1"],'equals',appconstants.TWO));
        await expect(enumerationMappingPage.First_selected_Bid).toContainText(vars["FirstBidFieldName"]);
        await expect(enumerationMappingPage.Second_Selected_Bid).toContainText(vars["SecondBidFieldName"]);
        log.stepPass(`Filtered results verified: "${vars["FirstBidFieldName"]}" and "${vars["SecondBidFieldName"]}" displayed correctly`);
      } catch (e) {
        await log.stepFail(page, 'Failed to verify filtered Bid Field results');
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