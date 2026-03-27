// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
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
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments'
import { Logger as log } from '../../../src/helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';

const TC_ID = "REG_TS01_TC09";
const TC_TITLE = "Verify that user should be able to create the bid maps using the file extension csv"

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
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
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
  });

  const profileName = "Enum Type Values";
  const profile = testDataManager.getProfileByName(profileName);
  const profileName1 = "Bid_Maps";
  const profile1 = testDataManager.getProfileByName(profileName1);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {
      log.step("Step 1: Prepare data and login");
      try {
        if (profile1 && profile1.data && profile1.data.length > 0) {
          vars["Rule Name"] = profile1.data[0]['Rule Name'];
          vars["BidField"] = profile1.data[0]['BidField'];
          vars["BidEnumeratedTapeValue"] = profile1.data[0]['BidEnumeratedTapeValue'];
          vars["Username"] = credentials.username;
          vars["Password"] = credentials.password;
          log.info(`Rule Name: ${vars["Rule Name"]}`);
          log.info(`BidField: ${vars["BidField"]}`);
        }
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars, "BidMAP_Happy_Flow_Csv.csv");
        log.stepPass("Step 1 passed");
      } catch (error) {
        log.stepFail(page, "Step 1 failed");
        throw error;
      }

      log.step("Step 2: Prepare enum values");
      try {
        vars["EnumValues"] = appconstants.LOAN_PURPOSE;
        if (profile && profile.data && profile.data.length > 0) {
          profile.data.forEach((dataRow: Record<string, string>) => {
            vars["EnumValues"] = dataRow["Enum Type"] + "," + vars["EnumValues"];
          });
        }
        log.info(`EnumValues: ${vars["EnumValues"]}`);
        log.stepPass("Step 2 passed");
      } catch (error) {
        log.stepFail(page, "Step 2 failed");
        throw error;
      }

      log.step("Step 3: Perform enumeration mapping");
      try {
        await headerMappingPage.MappedChaseFieldName.first().waitFor({ state: 'visible' });
        vars["MappedChaseFieldCount"] = String(await headerMappingPage.MappedChaseFieldName.count());
        vars["count"] = appconstants.ONE;
        vars["ChaseEnumValue"] = appconstants.SAMPLE;
        log.info(`MappedChaseFieldCount: ${vars["MappedChaseFieldCount"]}`);
        log.info(`Initial count: ${vars["count"]}`);
        while (parseFloat(String(vars["count"])) < parseFloat(String(vars["MappedChaseFieldCount"]))) {
          vars["ChaseName"] = await headerMappingPage.get_Individual_Mapped_Chase_Name(vars["count"]).evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
          if (String(vars["EnumValues"]).includes(String(vars["ChaseName"]))) {
            vars["ChaseEnumValue"] = String(vars["ChaseName"]) + "," + String(vars["ChaseEnumValue"]);
            vars["CorrespondentBidName"] = await headerMappingPage.get_Correspondent_Bid_sample_name(vars["count"]).textContent() || '';
            await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
            await bidmapPage.Yes_Proceed_Button_Text.click();
            await rulesAndActionsButtonPage.Rules_and_Actions_Button.waitFor({ state: 'visible' });
            await expect(enumerationMappingPage.get_Bid_Sample_Name_Field_Enumeration_Mapping(vars["ChaseName"])).toContainText(vars["CorrespondentBidName"]);
            await correspondentPortalPage.Header_Mapping1.click();
            await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          }
          vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        }
        log.stepPass("Step 3 passed");
      } catch (error) {
        log.stepFail(page, "Step 3 failed");
        throw error;
      }

      log.step("Step 4: Validate enumeration results");
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        if (await bidmapPage.Yes_Proceed_Button_Text.isVisible()) /* Element Yes Proceed Button is visible */ {
          await bidmapPage.Yes_Proceed_Button_Text.click();
        }
        if (await proceedWithSavingButtonPage.Proceed_with_Saving_Button.isVisible()) /* Element Proceed with Saving Button is visible */ {
          await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        }
        vars["ChaseEnumNamesCount[Enumeration]"] = String(await enumerationMappingPage.Chase_Enum_Names.count());
        vars["count1"] = appconstants.ONE;
        log.info(`ChaseEnumNamesCount: ${vars["ChaseEnumNamesCount[Enumeration]"]}`);
        log.info(`Initial count1: ${vars["count1"]}`);
        while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["ChaseEnumNamesCount[Enumeration]"]))) {
          vars["ChaseName"] = (await chaseFieldNamePage.get_Chase_Field_Name_common_one_Field(vars["count1"]).textContent())?.trim() || '';
          expect(String(vars["ChaseEnumValue"])).toContain(vars["ChaseName"]);
          vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
        }
        log.stepPass("Step 4 passed");
      } catch (error) {
        log.stepFail(page, "Step 4 failed");
        throw error;
      }

      log.step("Step 5: Add rules, actions and publish");
      try {
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        if (await bidmapPage.Yes_Proceed_Button_Text.isVisible()) /* Element Yes Proceed Button is visible */ {
          await bidmapPage.Yes_Proceed_Button_Text.click();
        }
        if (await proceedWithSavingButtonPage.Proceed_with_Saving_Button.isVisible()) /* Element Proceed with Saving Button is visible */ {
          await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        }
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await stepGroups.stepGroup_Add_Rule_For_Add_Condition_In_Rules_and_Actions(page, vars);
        await stepGroups.stepGroup_Add_Actions_in_Rules_and_Actions(page, vars);
        await expect(rulesAndActionsButtonPage.Condition_BidField_1).toContainText(vars["RuleBidField"]);
        await expect(rulesAndActionsButtonPage.Condition_BidTape1).toContainText(vars["RuleBidTapeValue"]);
        // [DISABLED] Verify that the element Action Chase Field Name 1 display value ChaseFieldNameonAddActions and With Scrollable FALSE
        // await expect(actionruleheaderPage.Action_Chase_Field_Name_1).toHaveValue(vars["ChaseFieldNameonAddActions"]);
        await expect(actionruleheaderPage.Action_Chase_Field_Name_1).toContainText(vars["ChaseFiledNameonAddActions"]);
        await saveAndPublishButtonPage.Save_and_Publish_Button.click();
        await expect(mapNameFieldInBidMapsPage.get_Bid_Map_Name_Field_In_Row(vars["BidMap"])).toBeVisible();
        log.stepPass("Step 5 passed");
      } catch (error) {
        log.stepFail(page, "Step 5 failed");
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