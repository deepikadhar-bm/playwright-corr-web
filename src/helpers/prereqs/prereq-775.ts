import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../pages/correspondant/enumeration-mapping-button';
import { HeaderMappingPage } from '../../pages/correspondant/header-mapping';
import { NameCantBeEmptyPage } from '../../pages/correspondant/name-cant-be-empty';
import { ENV } from '@config/environments'
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';


const profileName = "Bid_Maps";
const profile = testDataManager.getProfileByName(profileName);
export async function runPrereq_775(page: Page, vars: Record<string, string>): Promise<void> {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
  const headerMappingPage = new HeaderMappingPage(page);
  const nameCantBeEmptyPage = new NameCantBeEmptyPage(page);
  const credentials = ENV.getCredentials('internal');

  try {
    log.step("Prereq 775 - Load profile data and credentials");
    try {
      if (profile && profile.data) {
        const customHeader = profile.data[0]['Custom Header'];
        vars["Custom Header"] = customHeader;
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
      }
      log.stepPass("Prereq 775 - Profile data and credentials loaded.");
    } catch (error) {
      log.stepFail(page, "Prereq 775 - Failed to load profile data or credentials.");
      throw error;
    }

    log.step("Prereq 775 - Login, navigate to Header Mapping, and create header");
    try {
      await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
      await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
      await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
      await correspondentPortalPage.Add_New_Header_Button.click();
      await expect(correspondentPortalPage.Add_Header).toBeVisible();
      await correspondentPortalPage.Insert_Header_Button.click();
      await expect(nameCantBeEmptyPage.Name_cant_be_empty).toBeVisible();
      await correspondentPortalPage.Custom_Header_Field.pressSequentially(vars["Custom Header"]);
      await expect(nameCantBeEmptyPage.Name_cant_be_empty).toBeHidden();
      await correspondentPortalPage.Chase_Field_Name.click();
      await correspondentPortalPage.Chase_Field_Name.selectOption({ index: parseInt("10") });
      await correspondentPortalPage.Insert_Header_Button.click();
      await expect(correspondentPortalPage.New_Header_Mapping).toBeVisible();
      vars["Header Value"] =(await headerMappingPage.getHeaderValueInMapping(vars["Custom Header"]).getAttribute('title')) || '';
      await expect(enumerationMappingButtonPage.Enumeration_Mapping_Button).toBeVisible();
      log.stepPass("Prereq 775 - Header created and mapping visible.");
    } catch (error) {
      log.stepFail(page, "Prereq 775 - Failed during login, header creation, or mapping verification.");
      throw error;
    }
  } catch (error) {
    await log.captureOnFailure(page, "runPrereq_775", error);
    throw error;
  }
}
