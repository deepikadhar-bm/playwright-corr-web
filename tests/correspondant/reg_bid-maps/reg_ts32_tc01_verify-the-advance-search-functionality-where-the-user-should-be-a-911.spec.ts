import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SaveDraftExitButtonPage } from '../../../src/pages/correspondant/save-draft-exit-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS32_TC01';
const TC_TITLE = 'Verify the advance search functionality, where the user should be able to perform search action based on the rules and actions.[Bidmap Creation]';

const profileName1 = 'Bid_Maps';
const profile1 = testDataManager.getProfileByName(profileName1);

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidmapPage: BidmapPage;
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let saveDraftExitButtonPage: SaveDraftExitButtonPage;
  let spinnerPage: SpinnerPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    bidmapPage = new BidmapPage(page);
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    saveDraftExitButtonPage = new SaveDraftExitButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    if (profile1 && profile1.data) {
      vars["Rule Name"] = profile1.data[0]['Rule Name'];
      vars["BidEnumeratedTapeValue"] = profile1.data[0]['BidEnumeratedTapeValue'];
      vars["Operation1"] = profile1.data[0]['Operation1'];
      vars["Condition Bid Field"] = profile1.data[0]['Condition Bid Field'];
      vars["Unique Chase Field Name"] = profile1.data[0]['Unique Chase Field Name'];
      vars["Unique Chase Value"] = profile1.data[0]['Unique Chase Value'];
    }
    try {

      log.step('Login to CORR Portal and verify dashboard');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await expect(correspondentPortalPage.Heading_Dashboard).toBeVisible();
        log.stepPass('Login to CORR Portal and dashboard verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Login to CORR Portal or dashboard verification failed');
        throw e;
      }

      log.step('Enable Smart Mapper and create first Bid Map up to header mapping');
      try {
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars, fileconstants.BID_QA_FILE_COMMON);
        vars['BidMapName1'] = vars['CreateNewMap'];
        log.info('BidMapName1: ' + vars['BidMapName1']);
        log.stepPass('Smart Mapper enabled and first Bid Map created successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to enable Smart Mapper or create first Bid Map');
        throw e;
      }

      log.step('Navigate through Enumeration Mapping and Rules and Actions for first Bid Map');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await bidmapPage.Yes_Proceed_Button_Text.click();
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.waitFor({ state: 'visible' });
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        if (await bidmapPage.Yes_Proceed_Button_Text.isVisible()) /* Element Yes Proceed Button Text is visible */ {
          await bidmapPage.Yes_Proceed_Button_Text.click();
        }
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated through Enumeration Mapping and Rules and Actions for first Bid Map successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate through Enumeration Mapping and Rules and Actions for first Bid Map');
        throw e;
      }

      log.step('Add rules and actions and save and publish first Bid Map');
      try {
        await stepGroups.stepGroup_Adding_Rules_In_Rules_and_Actions_Screen(page, vars);
        await stepGroups.stepGroup_Adding_Actions_In_Rules_and_Actions_Screen(page, vars);
        await saveAndPublishButtonPage.Save_and_Publish_Button.waitFor({ state: 'visible' });
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Rules and actions added and first Bid Map saved and published successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to add rules and actions or save and publish first Bid Map');
        throw e;
      }

      log.step('Create second Bid Map up to header mapping');
      try {
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars, fileconstants.BID_QA_FILE_COMMON);
        vars['BidMapName2'] = vars['CreateNewMap'];
        log.info('BidMapName2: ' + vars['BidMapName2']);
        log.stepPass('Second Bid Map created successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to create second Bid Map');
        throw e;
      }

      log.step('Navigate through Enumeration Mapping and Rules and Actions for second Bid Map');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await correspondentPortal18Page.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await correspondentPortal18Page.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated through Enumeration Mapping and Rules and Actions for second Bid Map successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate through Enumeration Mapping and Rules and Actions for second Bid Map');
        throw e;
      }

      log.step('Add rules and actions and save and publish second Bid Map');
      try {
        await stepGroups.stepGroup_Adding_Rules_In_Rules_and_Actions_Screen(page, vars);
        await stepGroups.stepGroup_Adding_Actions_In_Rules_and_Actions_Screen(page, vars);
        await saveAndPublishButtonPage.Save_and_Publish_Button.waitFor({ state: 'visible' });
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Rules and actions added and second Bid Map saved and published successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to add rules and actions or save and publish second Bid Map');
        throw e;
      }

      log.step('Create new Bid Mapping for search action based on rules');
      try {
        await stepGroups.stepGroup_Creating_New_Bid_Mapping_For_search_action_based_on_the_rule(page, vars);
        vars['Common Keyword'] = 'TS_AdvanceSearch';
        log.stepPass('New Bid Mapping for search action created successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to create new Bid Mapping for search action');
        throw e;
      }

      log.step('Create third Bid Map up to header mapping');
      try {
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars, fileconstants.BID_QA_FILE_COMMON);
        vars['BidMapName3'] = vars['CreateNewMap'];
        log.info('BidMapName3: ' + vars['BidMapName3']);
        log.stepPass('Third Bid Map created successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to create third Bid Map');
        throw e;
      }

      log.step('Navigate through Enumeration Mapping and Rules and Actions for third Bid Map');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await bidmapPage.Yes_Proceed_Button_Text.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await correspondentPortal18Page.Yes_Proceed_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Navigated through Enumeration Mapping and Rules and Actions for third Bid Map successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate through Enumeration Mapping and Rules and Actions for third Bid Map');
        throw e;
      }

      log.step('Add rules and actions and save draft for third Bid Map');
      try {
        await stepGroups.stepGroup_Adding_Rules_In_Rules_and_Actions_Screen(page, vars);
        await stepGroups.stepGroup_Adding_Actions_In_Rules_and_Actions_Screen(page, vars);
        await saveDraftExitButtonPage.Save_Draft_Exit_Button.waitFor({ state: 'visible' });
        await saveDraftExitButtonPage.Save_Draft_Exit_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Rules and actions added and third Bid Map saved as draft successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to add rules and actions or save draft for third Bid Map');
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