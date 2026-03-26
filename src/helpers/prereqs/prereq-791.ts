import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../pages/correspondant/enumeration-mapping-button';
import { RulesAndActionsButtonPage } from '../../pages/correspondant/rules-and-actions-button';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { ENV } from '@config/environments'
import { Logger as log } from '../../../src/helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';

export async function runPrereq_791(page: Page, vars: Record<string, string>): Promise<void> {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
  const rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
  const spinnerPage = new SpinnerPage(page);
  const profileName = "Bid_Maps";
  const profile = testDataManager.getProfileByName(profileName);
  const credentials = ENV.getCredentials('internal');

  try {
    log.step("Prereq 791 - Load profile data and credentials");
    try {
      if (profile && profile.data) {
        const chaseValue = profile.data[0]['Chase Value'];
        const bidTapeValue = profile.data[0]['Bid Tape Value'];
        vars["Chase Value"] = chaseValue;
        vars["Bid Tape Value"] = bidTapeValue;
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
      }
      log.stepPass("Prereq 791 - Profile data and credentials loaded.");
    } catch (error) {
      await log.stepFail(page, "Prereq 791 - Failed to load profile data or credentials.");
      throw error;
    }

    log.step("Prereq 791 - Login, create Bid Map up to header mapping, and add enumeration pair");
    try {
      await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
      await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
      await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars,"DeepikaAugBidQA_(3)_(1)_(1)_(2).xlsx");
      await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
      await enumerationMappingButtonPage.Enumeration_Mapping_Button.waitFor({ state: 'visible' });
      await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
      await correspondentPortalPage.Heading_Save_and_Move_to_Next_Page1.waitFor({ state: 'visible' });
      await correspondentPortalPage.Yes_Proceed_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
      await correspondentPortalPage.Add_Field_Button.click();
      await correspondentPortalPage.Chase_Value.selectOption({ label: vars["Chase Value"] });
      await correspondentPortalPage.Bid_Tape_Value.fill(vars["Bid Tape Value"]);
      await correspondentPortalPage.Save_Draft_Button_in_Enumeration_Mapping.click();
      await expect(rulesAndActionsButtonPage.Rules_and_Actions_Button).toBeVisible();
      log.stepPass("Prereq 791 - Enumeration pair created and Rules and Actions button visible.");
    } catch (error) {
      await log.stepFail(page, "Prereq 791 - Failed during login, header mapping creation, or enumeration pair creation.");
      throw error;
    }
  } catch (error) {
    await log.captureOnFailure(page, "runPrereq_791", error);
    throw error;
  }
}
