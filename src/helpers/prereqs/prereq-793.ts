import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../pages/correspondant/enumeration-mapping-button';
import { HeaderMappingPage } from '../../pages/correspondant/header-mapping';
import { StatusInactive2Page } from '../../pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';
import { runPrereq_794 } from './prereq-794';
import { Logger as log } from '../log-helper';

export async function runPrereq_793(page: Page, vars: Record<string, string>): Promise<void> {
  try {
    log.step("Prereq 793 - Run base prereq 794");
    try {
      await runPrereq_794(page, vars);
      log.stepPass("Prereq 793 - Base prereq 794 completed.");
    } catch (error) {
      log.stepFail(page, "Prereq 793 - Base prereq 794 failed.");
      throw error;
    }

    const correspondentPortalPage = new CorrespondentPortalPage(page);
    const enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    const headerMappingPage = new HeaderMappingPage(page);
    const statusInactive2Page = new StatusInactive2Page(page);
    const statusInactivePage = new StatusInactivePage(page);

    log.step("Prereq 793 - Delete header mapping and verify delete state");
    try {
      vars["DeleteHeaderMapping"] = (await headerMappingPage.Deleting_Header.textContent()) || '';
      await correspondentPortalPage.Delete_icon.click();
      await expect(correspondentPortalPage.Delete).toBeVisible();
      vars["BidSampleFieldName"] = (await statusInactivePage.getDelete_Message(vars["DeleteHeaderMapping"]).textContent()) || '';
      await expect(page.getByText(vars["BidSampleFieldName"])).toBeVisible();
      await correspondentPortalPage.Yes_Proceed_Button.click();
      await expect(statusInactive2Page.get_Error_Message_in_Header_Mapping(vars["DeleteHeaderMapping"])).toBeHidden();
      await expect(enumerationMappingButtonPage.Enumeration_Mapping_Button).toBeVisible();
      log.stepPass("Prereq 793 - Header mapping deleted and verified successfully.");
    } catch (error) {
      log.stepFail(page, "Prereq 793 - Failed to delete header mapping or verify delete state.");
      throw error;
    }
  } catch (error) {
    await log.captureOnFailure(page, "runPrereq_793", error);
    throw error;
  }
}
