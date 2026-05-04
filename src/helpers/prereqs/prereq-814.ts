import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { ActionruleheaderPage } from '../../pages/correspondant/actionruleheader';
import { CorrespondentPortal18Page } from '../../pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { DuplicatecopyButtonPage } from '../../pages/correspondant/duplicatecopy-button';
import { EnumerationMappingButtonPage } from '../../pages/correspondant/enumeration-mapping-button';
import { EnumerationMappingPage } from '../../pages/correspondant/enumeration-mapping';
import { HeaderMappingPage } from '../../pages/correspondant/header-mapping';
import { MapHeaderPage } from '../../pages/correspondant/map-header';
import { MapHeadersButtonPage } from '../../pages/correspondant/map-headers-button';
import { ProceedWithSavingButtonPage } from '../../pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../pages/correspondant/rules-and-actions-button';
import { RulesAndActionsPage } from '../../pages/correspondant/rules-and-actions';
import { SaveAndPublishButtonPage } from '../../pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { StatusInactive2Page } from '../../pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';


const TC_ID = 'REG_TS26_TC01';
const TC_TITLE = 'Verify that if there are multiple versions in a bid, then user should be able to restore the required active map version.';

export async function runPrereq_814(page: Page, vars: Record<string, string>): Promise<void> {
  const actionruleheaderPage = new ActionruleheaderPage(page);
  const correspondentPortal18Page = new CorrespondentPortal18Page(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const duplicatecopyButtonPage = new DuplicatecopyButtonPage(page);
  const enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
  const enumerationMappingPage = new EnumerationMappingPage(page);
  const headerMappingPage = new HeaderMappingPage(page);
  const mapHeaderPage = new MapHeaderPage(page);
  const mapHeadersButtonPage = new MapHeadersButtonPage(page);
  const proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
  const rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
  const rulesAndActionsPage = new RulesAndActionsPage(page);
  const saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
  const spinnerPage = new SpinnerPage(page);
  const statusInactive2Page = new StatusInactive2Page(page);
  const statusInactivePage = new StatusInactivePage(page);

  const credentials = ENV.getCredentials('internal');
  const Methods = new AddonHelpers(page, vars);

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  vars['Username'] = credentials.username;
  vars['Password'] = credentials.password;

  log.tcStart(TC_ID, TC_TITLE);

  try {

    if (profile && profile.data) {
      vars['CompanyName1'] = profile.data[0]['CompanyName1'];
      vars['Rule Name'] = profile.data[0]['Rule Name'];
      vars['Chase Field Name'] = profile.data[0]['Chase Field Name'];
      vars["BidField"] = profile.data[0]['BidField'];
      vars["Operation1"] = profile.data[0]['Operation1'];
      vars["BidEnumeratedTapeValue"] = profile.data[0]['BidEnumeratedTapeValue'];
      vars["CustomHeader"] = profile.data[0]['CustomHeader'];
      vars["customheadername"] = profile.data[0]['customheadername'];
      vars["BidFields"] = profile.data[0]['BidFields'];
      vars["Bid Enumerated Tape Value"] = profile.data[0]['Bid Enumerated Tape Value'];
    }

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
      vars['Companyname'] = vars['CompanyName1'];
      const fileName = fileconstants.BID_QA_FILE_COMMON;
      await stepGroups.stepGroup_Creating_of_Add_New_Header(page, vars, fileName);
      await stepGroups.stepGroup_Storing_Values_from_map_header_screen(page, vars);
      await mapHeadersButtonPage.Map_Headers_Button.click();
      await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Smart Mapper enabled and Bid Map created up to Header Mapping');
    } catch (e) {
      await log.stepFail(page, 'Failed to enable Smart Mapper or create Bid Map');
      throw e;
    }

    log.step('Fetch Bid Sample names and navigate to Enumeration Mapping');
    try {
      await stepGroups.stepGroup_Fetching_Bid_Sample_Names_and_Corresponding_Chase_Values_and(page, vars);
      await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
      if (await proceedWithSavingButtonPage.Proceed_with_Saving_Button.isVisible()) {
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
      } else {
        await correspondentPortal18Page.Yes_Proceed_Button.click();
      }
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Bid Sample names fetched and navigated to Enumeration Mapping');
    } catch (e) {
      await log.stepFail(page, 'Failed to fetch Bid Sample names or navigate to Enumeration Mapping');
      throw e;
    }

    log.step('Store Enumeration Mapping values and navigate to Rules and Actions');
    try {
      await enumerationMappingPage.Bid_Sample_Field_NameEnum_mapping.first().waitFor({ state: 'visible' });
      vars['EnumFieldsCount'] = String(await enumerationMappingPage.Bid_Sample_Field_NameEnum_mapping.count());
      log.info('Enum Fields Count: ' + vars['EnumFieldsCount']);
      await stepGroups.stepGroup_Storing_BidSample_and_BidTape_Values_from_Enum_Page_with_Map(page, vars);
      await stepGroups.stepGroup_Storing_Chase_Field_and_Chase_Value_from_Enum_Page_With_Mapp(page, vars);
      await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
      await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Enumeration values stored and navigated to Rules and Actions');
    } catch (e) {
      await log.stepFail(page, 'Failed to store Enumeration values or navigate to Rules and Actions');
      throw e;
    }

    log.step('Add Rules and Actions and Save and Publish version 1');
    try {
      await stepGroups.stepGroup_Add_Rule_For_Add_Condition_In_Rules_and_Actions(page, vars);
      await stepGroups.stepGroup_Add_Actions_in_Rules_and_Actions(page, vars);
      await saveAndPublishButtonPage.Save_and_Publish_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await correspondentPortalPage.Version.first().waitFor({ state: 'visible' });
      vars['Version'] = await correspondentPortalPage.Version.first().textContent() || '';
      Methods.trimtestdata(vars['Version'], 'Version');
      log.info('Published Version: ' + vars['Version']);
      await expect(page.getByText(vars['Version']).first()).toBeVisible();
      log.stepPass('Rules and Actions added and version 1 published: ' + vars['Version']);
    } catch (e) {
      await log.stepFail(page, 'Failed to add Rules and Actions or publish version 1');
      throw e;
    }

    log.step('Create version 2 — select new execution type and map headers');
    try {
      vars['CreateNewMap'] = vars['Create New Map'];
      await statusInactive2Page.Bid_Map_In_List_Screen(vars['CreateNewMap']).click();
      await expect(page.getByText(vars['Create New Map'])).toBeVisible();
      await mapHeaderPage.Execution_Type_Dropdown_New.selectOption({ index: parseInt('2') });
      vars['ExecutionVersion2'] = await mapHeaderPage.Execution_Type_Dropdown_New.evaluate(el => {
        const s = el as HTMLSelectElement;
        return s.options[s.selectedIndex]?.text || '';
      });
      Methods.trimtestdata(vars['ExecutionVersion2'], 'ExecutionVersion2');
      log.info('ExecutionVersion2: ' + vars['ExecutionVersion2']);
      await mapHeadersButtonPage.Map_Headers_Button.click();
      await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Version 2 execution type selected: ' + vars['ExecutionVersion2']);
    } catch (e) {
      await log.stepFail(page, 'Failed to create version 2 or select execution type');
      throw e;
    }

    log.step('Create, edit and delete headers in Header Mapping for version 2');
    try {
      vars["Chase_Field_Name"] = vars['Chase Field Name'];
      await stepGroups.stepGroup_Creating_New_Header_In_Header_Mapping_Screen(page, vars);
      if (profile && profile.data) {
        vars["Chase_Field_Name"] = profile.data[0]['Chase_Field_Name'];
      }
      await stepGroups.stepGroup_Editing_Header_Mapping(page, vars);
      vars['EditedChaseFieldNameVersion2'] = vars['UpdatedChaseFieldNameHeaderMapping'];
      vars['DeletedHeader[HeaderMapping]'] = await headerMappingPage.Deleting_Header.textContent() || '';
      Methods.trimtestdata(vars['DeletedHeader[HeaderMapping]'], 'DeletedHeaderHeaderMapping');
      log.info('Deleted Header: ' + vars['DeletedHeaderHeaderMapping']);
      await stepGroups.stepGroup_Delete_a_Header_In_Header_Mapping(page, vars);
      await expect(headerMappingPage.get_Deleted_Header_In_HeaderMaping(vars['DeletedHeaderHeaderMapping'])).not.toBeVisible();
      await headerMappingPage.First_Header_Checkbox.check();
      vars['FirstHeaderName'] = await headerMappingPage.First_Header_Bid_Sample_Name.textContent() || '';
      Methods.trimtestdata(vars['FirstHeaderName'], 'FirstHeaderName');
      await actionruleheaderPage.Second_Header_Checkbox.check();
      vars['SecondHeaderName'] = await headerMappingPage.Second_Header_Bid_Sample_Name.textContent() || '';
      Methods.trimtestdata(vars['SecondHeaderName'], 'SecondHeaderName');
      log.info('FirstHeaderName: ' + vars['FirstHeaderName']);
      log.info('SecondHeaderName: ' + vars['SecondHeaderName']);
      log.stepPass('Headers created, edited and deleted for version 2');
    } catch (e) {
      await log.stepFail(page, 'Failed to create, edit or delete headers for version 2');
      throw e;
    }

    log.step('Navigate to Enumeration Mapping and add/edit/delete enum fields for version 2');
    try {
      await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
      await expect(statusInactivePage.You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page).toBeVisible();
      await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await stepGroups.stepGroup_Adding_Field_In_Enumeration_Mapping(page, vars);
      await stepGroups.stepGroup_Editing_In_Enumeration_Mapping_Screen(page, vars);
      vars['ChaseFieldNameTobeEdited'] = await enumerationMappingPage.ChaseFieldname_To_be_edited_enum.textContent() || '';
      Methods.trimtestdata(vars['ChaseFieldNameTobeEdited'], 'ChaseFieldNameTobeEdited');
      vars['SelectedChaseValueText'] = await enumerationMappingPage.To_be_edited_Chase_Value_ListEnum(vars['ChaseFieldNameTobeEdited']).evaluate(el => {
        const s = el as HTMLSelectElement;
        return s.options[s.selectedIndex]?.text || '';
      });
      Methods.trimtestdata(vars['SelectedChaseValueText'], 'SelectedChaseValueText');
      await enumerationMappingPage.To_be_edited_Chase_Value_ListEnum(vars['ChaseFieldNameTobeEdited']).selectOption({ index: parseInt('1') });
      vars['EditedChaseValueVersion2'] = await enumerationMappingPage.To_be_edited_Chase_Value_ListEnum(vars['ChaseFieldNameTobeEdited']).evaluate(el => {
        const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || '';
      });
      Methods.trimtestdata(vars['EditedChaseValueVersion2'], 'EditedChaseValueVersion2');
      log.info('EditedChaseValueVersion2: ' + vars['EditedChaseValueVersion2']);
      await stepGroups.stepGroup_Delete_In_Enumeration_Mapping(page, vars);
      await enumerationMappingPage.First_Checkbox_Enum.check();
      vars['FirstBidSampleName'] = await enumerationMappingPage.First_Bid_Sample_Name_In_Enumeration.textContent() || '';
      Methods.trimtestdata(vars['FirstBidSampleName'], 'FirstBidSampleName');
      log.info('FirstBidSampleName: ' + vars['FirstBidSampleName']);
      log.stepPass('Enumeration Mapping fields added, edited and deleted for version 2');
    } catch (e) {
      await log.stepFail(page, 'Failed to add, edit or delete Enumeration Mapping fields for version 2');
      throw e;
    }

    log.step('Navigate to Rules and Actions for version 2 and edit conditions and actions');
    try {
      await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
      await expect(statusInactivePage.You_have_unidentified_Fields_This_action_will_save_and_Move_to_Next_Page).toBeVisible();
      await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
      await stepGroups.stepGroup_Editing_of_Add_Conditions_and_Add_Actions(page, vars);
      log.stepPass('Navigated to Rules and Actions and edited conditions and actions for version 2');
    } catch (e) {
      await log.stepFail(page, 'Failed to navigate to Rules and Actions or edit conditions for version 2');
      throw e;
    }

    log.step('Duplicate rule block twice and rename duplicate rules');
    try {
      await duplicatecopyButtonPage.DuplicateCopy_Button.click();
      await duplicatecopyButtonPage.DuplicateCopy_Button.click();
      await expect(rulesAndActionsButtonPage.Added_Rule_Block).toHaveCount(parseInt('3'));
      await statusInactive2Page.Rule_Name.click();
      await statusInactive2Page.Rule_Name.clear();
      await statusInactive2Page.Rule_Name.type('Rule 2');
      vars['SecondRuleName'] = await statusInactive2Page.Rule_Name.inputValue() || '';
      Methods.trimtestdata(vars['SecondRuleName'], 'SecondRuleName');
      await statusInactivePage.Enter_Rule_Name.click();
      await statusInactivePage.Enter_Rule_Name.clear();
      await statusInactivePage.Enter_Rule_Name.type('Rule 3');
      vars['ThirdRuleName'] = await statusInactivePage.Enter_Rule_Name.inputValue() || '';
      Methods.trimtestdata(vars['ThirdRuleName'], 'ThirdRuleName');
      vars['LastRuleName'] = vars['ThirdRuleName'];
      log.info('SecondRuleName: ' + vars['SecondRuleName']);
      log.info('ThirdRuleName: ' + vars['ThirdRuleName']);
      log.stepPass('Rule duplicated twice and renamed successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to duplicate or rename rule blocks');
      throw e;
    }

    log.step('Delete a rule and Save and Publish version 2');
    try {
      await rulesAndActionsPage.Delete_Rule_Button_1.scrollIntoViewIfNeeded();
      await stepGroups.stepGroup_Deleting_In_Rules_and_Actions(page, vars);
      await expect(page.getByText(vars['Rule Name'])).not.toBeVisible();
      await saveAndPublishButtonPage.Save_and_Publish_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      log.stepPass('Rule deleted and version 2 published successfully');
    } catch (e) {
      await log.stepFail(page, 'Failed to delete rule or publish version 2');
      throw e;
    }

    log.tcEnd('PASS');

  } catch (e) {
    await log.captureOnFailure(page, TC_ID, e);
    log.tcEnd('FAIL');
    throw e;
  }
}