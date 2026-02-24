import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { ChaseFieldNamePage } from '../../pages/correspondant/chase-field-name';
import { CorrespondentPortal18Page } from '../../pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../pages/correspondant/enumeration-mapping-button';
import { EnumerationMappingPage } from '../../pages/correspondant/enumeration-mapping';
import { FirstPagePage } from '../../pages/correspondant/first-page';
import { MapHeaderPage } from '../../pages/correspondant/map-header';
import { MapHeadersButtonPage } from '../../pages/correspondant/map-headers-button';
import { NewMapPage } from '../../pages/correspondant/new-map';
import { ProceedWithSavingButtonPage } from '../../pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../pages/correspondant/rules-and-actions-button';
import { SaveAndPublishButtonPage } from '../../pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { ThisActionWillSaveTheChangesAndMoveToNextPagePage } from '../../pages/correspondant/this-action-will-save-the-changes-and-move-to-next-page';

export async function runPrereq_1361(page: Page, vars: Record<string, string>): Promise<void> {
  const chaseFieldNamePage = new ChaseFieldNamePage(page);
  const correspondentPortal18Page = new CorrespondentPortal18Page(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
  const enumerationMappingPage = new EnumerationMappingPage(page);
  const firstPagePage = new FirstPagePage(page);
  const mapHeaderPage = new MapHeaderPage(page);
  const mapHeadersButtonPage = new MapHeadersButtonPage(page);
  const newMapPage = new NewMapPage(page);
  const proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
  const rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
  const saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
  const spinnerPage = new SpinnerPage(page);
  const thisActionWillSaveTheChangesAndMoveToNextPagePage = new ThisActionWillSaveTheChangesAndMoveToNextPagePage(page);


  await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
  await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
  await stepGroups.stepGroup_Creating_New_BidMap_Upto_Upload_File(page, vars);
  vars["SelectedCompanyCount"] = String(await newMapPage.Selected_Companies.count());
  vars["SelectedCompanyName"] = await newMapPage.Individual_Selected_Company.textContent() || '';
  vars["BidMapName"] = vars["BidMap"];
  vars["ExecutionType"] = await mapHeaderPage.Execution_Type_Dropdown_New.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  vars["UploadedFileName"] = await firstPagePage.Uploaded_File_Name.textContent() || '';
  await page.waitForLoadState('networkidle');
  await mapHeadersButtonPage.Map_Headers_Button.click();
  await expect(thisActionWillSaveTheChangesAndMoveToNextPagePage.This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
  await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await stepGroups.stepGroup_Editing_Header_Mapping(page, vars);
  await stepGroups.stepGroup_Fetching_Bid_Sample_Names_and_Corresponding_Chase_Values_and(page, vars);
  await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
  if (true) /* Element Yes, Proceed Button. is visible */ {
    await correspondentPortal18Page.Yes_Proceed_Button.click();
  } else {
    await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
  }
  await correspondentPortalPage.Rules_and_Actions_Step_4_of_4.waitFor({ state: 'visible' });
  await page.getByText("No data Found").waitFor({ state: 'hidden' });
  vars["count1"] = "1";
  vars["EnumFieldsCount"] = String(await enumerationMappingPage.Chase_Enum_Names.count());
  await enumerationMappingPage.First_Checkbox_Enum.check();
  await enumerationMappingPage.First_Checkbox_Enum.uncheck();
  while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["EnumFieldsCount"]))) {
    vars["IndividualBidSampleName"] = await enumerationMappingPage.Individual_Bid_Sample_NameEnum_Page.textContent() || '';
    vars["ColumnHeader"] = vars["IndividualBidSampleName"];
    for (let dataIdx = parseInt(vars["count1"]); dataIdx <= parseInt(vars["count1"]); dataIdx++) {
      // Write to test data profile: "EnumBidSampleNames" = vars["IndividualBidSampleName"]
      if (true) /* Element BidTapeFieldCountForBidField is not visible */ {
        vars["IndividualBidTapeValue"] = "No BidTape";
      } else {
        vars["IndividualBidTapeValue"] = "Sample";
        vars["BidTapeCount"] = String(await enumerationMappingPage.BidTapeFieldCountForBidField.count());
        vars["count2"] = "1";
        while (parseFloat(String(vars["count2"])) <= parseFloat(String(vars["BidTapeCount"]))) {
          vars["BidTapeValue"] = await enumerationMappingPage.Individual_Bid_Tape_Value_2.textContent() || '';
          vars["IndividualBidTapeValue"] = String(vars["BidTapeValue"]) + "," + String(vars["IndividualBidTapeValue"]);
          vars["count2"] = (parseFloat(String("1")) + parseFloat(String(vars["count2"]))).toFixed(0);
        }
      }
      // Write to test data profile: "EnumBidTapeValues" = vars["IndividualBidTapeValue"]
      vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
    }
  }
  vars["count1"] = "1";
  vars["ChaseFieldsCountEnum"] = String(await enumerationMappingPage.Chase_Enum_Names.count());
  while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["ChaseFieldsCountEnum"]))) {
    await enumerationMappingPage.First_Checkbox_Enum.check();
    await enumerationMappingPage.First_Checkbox_Enum.uncheck();
    for (let dataIdx = parseInt(vars["count1"]); dataIdx <= parseInt(vars["count1"]); dataIdx++) {
      vars["IndividualChaseFieldName"] = await chaseFieldNamePage.Chase_Field_Name_common_one_Field.textContent() || '';
      // Write to test data profile: "ChaseFieldName" = vars["IndividualChaseFieldName"]
      if (true) /* Element ChaseValues Corresponding to Chase Field is not visi */ {
        // Write to test data profile: "Chase Value" = "No ChaseValue"
      } else {
        vars["IndividualChaseValueofChaseField"] = "Sample";
        vars["ChaseValuesOfChaseFieldCount"] = String(await enumerationMappingPage.ChaseValues_Corresponding_to_Chase_Field.count());
        vars["count2"] = "1";
        vars["TagName"] = await enumerationMappingPage.Individual_ChaseValue_of_ChaseField.evaluate(el => (el as HTMLElement).tagName);
        while (parseFloat(String(vars["count2"])) <= parseFloat(String(vars["ChaseValuesOfChaseFieldCount"]))) {
          if (String(vars["TagName"]).includes(String("select"))) {
            vars["ChaseValue"] = await enumerationMappingPage.Individual_ChaseValue_of_ChaseField.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
          } else {
            vars["ChaseValue"] = await enumerationMappingPage.Individual_ChaseValue_of_ChaseField.textContent() || '';
          }
          vars["IndividualChaseValueofChaseField"] = String(vars["ChaseValue"]) + "," + String(vars["IndividualChaseValueofChaseField"]);
          vars["count2"] = (parseFloat(String("1")) + parseFloat(String(vars["count2"]))).toFixed(0);
        }
        // Write to test data profile: "Chase Value" = vars["IndividualChaseValueofChaseField"]
      }
    }
    vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
  }
  await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
  await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
  await page.waitForLoadState('networkidle');
  await stepGroups.stepGroup_Add_Rule_For_Add_Condition_In_Rules_and_Actions(page, vars);
  await stepGroups.stepGroup_Add_Actions_in_Rules_and_Actions(page, vars);
  await saveAndPublishButtonPage.Save_and_Publish_Button.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
}
