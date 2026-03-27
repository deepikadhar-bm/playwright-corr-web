// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BackButtonPage } from '../../../src/pages/correspondant/back-button';
import { BidmapPage } from '../../../src/pages/correspondant/bidmap';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { ChaseValuePage } from '../../../src/pages/correspondant/chase-value';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { testDataManager } from 'testdata/TestDataManager';
import { ENV } from '@config/environments'
import { Logger as log } from '../../../src/helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID="REG_TS08_TC10_CASE-03";
const TC_TITLE="They have changes and they don’t have unidentified field - Message should be Note : This action will save the changes and Move to Next Page."

test.describe('REG_Bid Maps', () => {
  let vars: Record<string,string>={};
  let backButtonPage:BackButtonPage;
  let bidmapPage:BidmapPage;
  let chaseFieldNamePage:ChaseFieldNamePage;
  let chaseValuePage:ChaseValuePage;
  let correspondentPortalPage:CorrespondentPortalPage;
  let enumerationMappingButtonPage:EnumerationMappingButtonPage;
  let proceedWithSavingButtonPage:ProceedWithSavingButtonPage;
  let rulesAndActionsButtonPage:RulesAndActionsButtonPage;
  let spinnerPage:SpinnerPage;
  const credentials=ENV.getCredentials('internal');

  test.beforeEach(async({page})=>{
    vars={};
    backButtonPage=new BackButtonPage(page);
    bidmapPage=new BidmapPage(page);
    chaseFieldNamePage=new ChaseFieldNamePage(page);
    chaseValuePage=new ChaseValuePage(page);
    correspondentPortalPage=new CorrespondentPortalPage(page);
    enumerationMappingButtonPage=new EnumerationMappingButtonPage(page);
    proceedWithSavingButtonPage=new ProceedWithSavingButtonPage(page);
    rulesAndActionsButtonPage=new RulesAndActionsButtonPage(page);
    spinnerPage=new SpinnerPage(page);
  });

  const profileName="Bid_Maps";
  const profile=testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`,async({page})=>{
    log.tcStart(TC_ID,TC_TITLE);
    try{
      log.step("Step 1: Prepare data and login");
      try{
        if(profile&&profile.data){
          vars['Action Save message']=profile.data[0]["Action Save message"];
          vars["Username"]=credentials.username;
          vars["Password"]=credentials.password;
          log.info(`Action Save message: ${vars['Action Save message']}`);
        }
        await stepGroups.stepGroup_Login_to_CORR_Portal(page,vars);
        await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page,vars);
        await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page,vars,"DeepikaAugBidQA_(3)_(1)_(1)_(2).xlsx");
        log.stepPass("Step 1 passed");
      }catch(error){
        log.stepFail(page,"Step 1 failed");
        throw error;
      }

      log.step("Step 2: Navigate to Enumeration Mapping and proceed");
      try{
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click({trial:true});
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
        if(await bidmapPage.Yes_Proceed_Button_Text.isVisible()){
          await bidmapPage.Yes_Proceed_Button_Text.click();
        }else{
          await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        }
        await spinnerPage.Spinner.waitFor({state:'hidden'});
        log.stepPass("Step 2 passed");
      }catch(error){
        log.stepFail(page,"Step 2 failed");
        throw error;
      }

      log.step("Step 3: Resolve unmapped enumeration values");
      try{
        vars["count"]=appconstants.ONE;
        vars["ChaseValues"]=String(await chaseValuePage.Chase_Values_In_Enumration_Page.count());
        log.info(`Total Chase Values: ${vars["ChaseValues"]}`);
        log.info(`Initial count: ${vars["count"]}`);
        while(parseFloat(vars["count"])<=parseFloat(vars["ChaseValues"])){
          vars["values"]=await correspondentPortalPage.get_Chases_Values_1(vars["count"]).evaluate(el=>{const s=el as HTMLSelectElement;return s.options[s.selectedIndex]?.text||''});
          vars["value"]=String(vars["values"]).trim();
          if(vars["value"]==="Select"){
            await correspondentPortalPage.get_Chases_Values_1(vars["count"]).selectOption({index:1});
          }
          vars["count"]=(parseFloat(vars["count"])+1).toFixed(0);
        }
        log.stepPass("Step 3 passed");
      }catch(error){
        log.stepFail(page,"Step 3 failed");
        throw error;
      }

      log.step("Step 4: Validate save message across actions");
      try{
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(page.getByText(vars["Action Save message"])).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({state:'hidden'});
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({state:'hidden'});

        await stepGroups.stepGroup_Add_Field_in_Enumeration_Mapping(page,vars);
        await correspondentPortalPage.Default_dropdown_selection_Dropdown.selectOption({index:1});
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(page.getByText(vars["Action Save message"])).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({state:'hidden'});
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({state:'hidden'});

        await correspondentPortalPage.Attachment_Types.selectOption({index:2});
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(page.getByText(vars["Action Save message"])).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({state:'hidden'});
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({state:'hidden'});

        await stepGroups.stepGroup_Delete_In_Enumeration_Mapping(page,vars);
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(page.getByText(vars["Action Save message"])).toBeVisible();
        await expect(proceedWithSavingButtonPage.Proceed_with_Saving_Button).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({state:'hidden'});
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({state:'hidden'});

        await chaseFieldNamePage.Checking_Checkbox_In_EnumerationMapping.check();
        await chaseFieldNamePage.Checking_Checkbox_In_Enumeration_Mapping.check();
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(page.getByText(vars["Action Save message"])).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({state:'hidden'});
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({state:'hidden'});

        await chaseFieldNamePage.Checking_Checkbox_In_EnumerationMapping.uncheck();
        await chaseFieldNamePage.Checking_Checkbox_In_Enumeration_Mapping.uncheck();
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        await expect(page.getByText(vars["Action Save message"])).toBeVisible();
        await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
        await spinnerPage.Spinner.waitFor({state:'hidden'});
        await backButtonPage.BACK_Button.click();
        await spinnerPage.Spinner.waitFor({state:'hidden'});

        log.stepPass("Step 4 passed");
      }catch(error){
        log.stepFail(page,"Step 4 failed");
        throw error;
      }

      log.tcEnd('PASS');
    }catch(error){
      log.captureOnFailure(page,TC_ID,error);
      log.tcEnd('FAIL');
      throw error;
    }
  });
});