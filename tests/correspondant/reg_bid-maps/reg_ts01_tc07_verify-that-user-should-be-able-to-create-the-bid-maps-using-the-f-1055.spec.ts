import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionruleheaderPage } from '../../../src/pages/correspondant/actionruleheader';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { EnumerationMappingPage } from '../../../src/pages/correspondant/enumeration-mapping';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { MapNameFieldInBidMapsPage } from '../../../src/pages/correspondant/map-name-field-in-bid-maps';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments';
import { FILE_CONSTANTS as fileconstants } from '../../../src/constants/file-constants';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS01_TC07';
const TC_TITLE = 'Verify that user should be able to create the bid maps using the file extenstion xls';


test.describe('REG_Bid Maps', () => {

  let vars: Record<string, string> = {};
  let actionruleheaderPage: ActionruleheaderPage;
  let bidmapPage: BidmapPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let enumerationMappingPage: EnumerationMappingPage;
  let headerMappingPage: HeaderMappingPage;
  let mapNameFieldInBidMapsPage: MapNameFieldInBidMapsPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  const profileName1 = 'Bid_Maps';
  const profile1 = testDataManager.getProfileByName(profileName1);

  const profileName2 = 'Enum Type Values';
  const profile2 = testDataManager.getProfileByName(profileName2);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    actionruleheaderPage = new ActionruleheaderPage(page);
    bidmapPage = new BidmapPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    enumerationMappingPage = new EnumerationMappingPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    mapNameFieldInBidMapsPage = new MapNameFieldInBidMapsPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    if (profile1 && profile1.data) {
      vars["Rule Name"] = profile1.data[0]['Rule Name'];
      vars["BidEnumeratedTapeValue"] = profile1.data[0]['BidEnumeratedTapeValue'];
      vars["BidField"] = profile1.data[0]['BidField'];
      vars["Operation1"] = profile1.data[0]['Operation1'];
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
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars, fileconstants.BID_QA_FILE_COMMON);
        log.stepPass('Smart Mapper enabled and Bid Map created up to Header Mapping');
      } catch (e) {
        await log.stepFail(page, 'Failed to enable Smart Mapper or create Bid Map');
        throw e;
      }

      log.step('Build EnumValues list from test data profile');
      try {
        vars['EnumValues'] = 'Loan Purpose';
        const dataList = profile2?.data as Record<string, any>[];
        for (let i = 1; i <= 17; i++) {
          log.info('Iteration: ' + i);
          vars['Enum Type'] = dataList[i]['Enum Type'];
          log.info('Enum Type: ' + vars['Enum Type']);
          Methods.concatenateWithSpecialChar(vars['EnumValues'], vars['Enum Type'], ',', 'EnumValues');
        }
        log.info('Final EnumValues: ' + vars['EnumValues']);
        log.stepPass('EnumValues list built successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to build EnumValues list from test data profile');
        throw e;
      }

      log.step('Iterate through mapped Chase fields and verify enum values in Enumeration Mapping');
      try {
        vars['MappedChaseFieldCount'] = String(await headerMappingPage.MappedChaseFieldName.count());
        log.info('Mapped Chase Field Count: ' + vars['MappedChaseFieldCount']);
        vars['count'] = appconstants.ONE;
        vars['ChaseEnumValue'] = 'sample';
        while (parseFloat(String(vars['count'])) < parseFloat(String(vars['MappedChaseFieldCount']))) {
          vars['ChaseName'] = await headerMappingPage.get_Individual_Mapped_Chase_Name(vars['count']).evaluate(el => {const s = el as HTMLSelectElement;return s.options[s.selectedIndex]?.text || '';});
          Methods.trimtestdata(vars['ChaseName'], 'ChaseName');
          log.info('ChaseName at count ' + vars['count'] + ': ' + vars['ChaseName']);
          if (String(vars['EnumValues']).includes(String(vars['ChaseName']))) {
            Methods.concatenateWithSpecialChar(vars['ChaseName'], vars['ChaseEnumValue'], ',', 'ChaseEnumValue');
            vars['CorrespondentBidName'] = await headerMappingPage.get_Correspondent_Bid_sample_name(vars['count']).textContent() || '';
            Methods.trimtestdata(vars['CorrespondentBidName'], 'CorrespondentBidName');
            log.info('CorrespondentBidName: ' + vars['CorrespondentBidName']);
            await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
            await bidmapPage.Yes_Proceed_Button_Text.click();
            await rulesAndActionsButtonPage.Rules_and_Actions_Button.waitFor({ state: 'visible' });
            await expect(enumerationMappingPage.get_Bid_Sample_Name_Field_Enumeration_Mapping(vars['ChaseName'])).toContainText(vars['CorrespondentBidName']);
            await correspondentPortalPage.Header_Mapping1.click();
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          }
          Methods.performArithmetic('1', 'ADDITION', vars['count'], 'count', 0);
        }
        log.stepPass('All mapped Chase fields iterated and enum values verified');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify enum values in Enumeration Mapping at count: ' + vars['count']);
        throw e;
      }

      log.step('Navigate to Enumeration Mapping and verify Chase Enum Names');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        if (await bidmapPage.Yes_Proceed_Button_Text.isVisible()) {
          await bidmapPage.Yes_Proceed_Button_Text.click();
        }
        if (await proceedWithSavingButtonPage.Proceed_with_Saving_Button.isVisible()) {
          await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        }
        vars['ChaseEnumNamesCount[Enumeration]'] = String(await enumerationMappingPage.Chase_Enum_Names.count());
        log.info('Chase Enum Names Count: ' + vars['ChaseEnumNamesCount[Enumeration]']);
        vars['count1'] = appconstants.ONE;
        while (parseFloat(String(vars['count1'])) <= parseFloat(String(vars['ChaseEnumNamesCount[Enumeration]']))) {
          vars['ChaseName'] = await chaseFieldNamePage.get_Chase_Field_Name_common_one_Field(vars['count1']).textContent() || '';
          Methods.trimtestdata(vars['ChaseName'], 'ChaseName');
          log.info('ChaseName at count1 ' + vars['count1'] + ': ' + vars['ChaseName']);
          Methods.verifyString(vars['ChaseEnumValue'], 'contains', vars['ChaseName']);
          Methods.performArithmetic('1', 'ADDITION', vars['count1'], 'count1', 0);
        }
        log.stepPass('Chase Enum Names verified successfully against ChaseEnumValue');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Chase Enum Names in Enumeration Mapping');
        throw e;
      }

      log.step('Navigate to Rules and Actions and add Rules and Actions');
      try {
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        if (await bidmapPage.Yes_Proceed_Button_Text.isVisible()) {
          await bidmapPage.Yes_Proceed_Button_Text.click();
        }
        if (await proceedWithSavingButtonPage.Proceed_with_Saving_Button.isVisible()) {
          await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        }
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Add_Rule_For_Add_Condition_In_Rules_and_Actions(page, vars);
        await stepGroups.stepGroup_Add_Actions_in_Rules_and_Actions(page, vars);
        await expect(rulesAndActionsButtonPage.Condition_BidField_1).toContainText(vars['RuleBidField']);
        await expect(rulesAndActionsButtonPage.Condition_BidTape1).toContainText(vars['RuleBidTapeValue']);
        await expect(actionruleheaderPage.Action_Chase_Field_Name_1.locator('option:checked')).toHaveText(vars['ChaseFieldNameonAddActions']);
        log.stepPass('Rules and Actions added and verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to add or verify Rules and Actions');
        throw e;
      }

      log.step('Save and Publish the Bid Map');
      try {
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        if (await proceedWithSavingButtonPage.Proceed_with_Saving_Button.isVisible()) {
          await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        }
        await expect(mapNameFieldInBidMapsPage.get_Bid_Map_Name_Field_In_Row(vars['CreateNewMap'])).toBeVisible();
        log.stepPass('Bid Map saved and published successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to Save and Publish the Bid Map');
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