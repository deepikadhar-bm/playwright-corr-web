import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { CorrespondentPortal4Page } from '../../pages/correspondant/correspondent-portal-4';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { HeaderMappingPage } from '../../pages/correspondant/header-mapping';
import { NameCantBeEmptyPage } from '../../pages/correspondant/name-cant-be-empty';
import { runPrereq_775 } from './prereq-775';
import { ENV } from '@config/environments'
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';



const profileName = "Bid_Maps";
const profile = testDataManager.getProfileByName(profileName);
export async function runPrereq_794(page: Page, vars: Record<string, string>): Promise<void> {
  try {
    log.step("Prereq 794 - Run base prereq 775");
    try {
      await runPrereq_775(page, vars);
      log.stepPass("Prereq 794 - Base prereq 775 completed.");
    } catch (error) {
      log.stepFail(page, "Prereq 794 - Base prereq 775 failed.");
      throw error;
    }

    const correspondentPortal4Page = new CorrespondentPortal4Page(page);
    const correspondentPortalPage = new CorrespondentPortalPage(page);
    const headerMappingPage = new HeaderMappingPage(page);
    const nameCantBeEmptyPage = new NameCantBeEmptyPage(page);
    const credentials = ENV.getCredentials('internal');

    log.step("Prereq 794 - Load profile data and credentials");
    try {
      if (profile && profile.data) {
        const chaseFieldName = profile.data[0]['Chase Field Name'];
        vars["Chase Field Name"] = chaseFieldName;
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
      }
      log.stepPass("Prereq 794 - Profile data and credentials loaded.");
    } catch (error) {
      log.stepFail(page, "Prereq 794 - Failed to load profile data or credentials.");
      throw error;
    }

    log.step("Prereq 794 - Edit header mapping and verify saved changes");
    try {
      await correspondentPortalPage.Edit_icon_in_Header_Mapping.click();
      await expect(correspondentPortalPage.Update_Header).toBeVisible();
      await correspondentPortal4Page.Custom_Header.clear();
      await correspondentPortalPage.Update_Header_Button.click();
      await expect(nameCantBeEmptyPage.Name_cant_be_empty).toBeVisible();
      await correspondentPortal4Page.Custom_Header.pressSequentially(vars["Chase Field Name"]);
      await correspondentPortalPage.Chase_Field_Name.selectOption({ index: parseInt("11") });
      await correspondentPortalPage.Update_Header_Button.click();
      await expect(headerMappingPage.Chase_Field_Name_Text_Field.last()).toBeVisible();
      log.stepPass("Prereq 794 - Header mapping edited and verified successfully.");
    } catch (error) {
      log.stepFail(page, "Prereq 794 - Failed to edit header mapping or verify saved changes.");
      throw error;
    }
  } catch (error) {
    await log.captureOnFailure(page, "runPrereq_794", error);
    throw error;
  }
}
