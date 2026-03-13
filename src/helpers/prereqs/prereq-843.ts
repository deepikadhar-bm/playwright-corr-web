import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { CorrespondentPortal8Page } from '../../pages/correspondant/correspondent-portal-8';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../pages/correspondant/enumeration-mapping-button';
import { runPrereq_793 } from './prereq-793';
import { CorrespondentPortal7Page } from '../../pages/correspondant/correspondent-portal-7';
import { Logger as log } from '../../../src/helpers/log-helper';

export async function runPrereq_843(page: Page, vars: Record<string, string>): Promise<void> {
  try {
    log.step("Prereq 843 - Run prereq 793 to prepare mapping");
    try {
      await runPrereq_793(page, vars);
      log.stepPass("Prereq 843 - Prereq 793 completed successfully.");
    } catch (error) {
      await log.stepFail(page, "Prereq 843 - Failed while running prereq 793.");
      throw error;
    }

    log.step("Prereq 843 - Check Bid Request and Header Mapping checkboxes");
    try {
      const correspondentPortal7Page = new CorrespondentPortal7Page(page);
      const correspondentPortal8Page = new CorrespondentPortal8Page(page);
      const correspondentPortalPage = new CorrespondentPortalPage(page);
      const enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);

      await correspondentPortalPage.First_Checkbox_Bid_Request.check();
      await correspondentPortal7Page.Header_Mapping_checkbox.check();
      await expect(enumerationMappingButtonPage.Enumeration_Mapping_Button).toBeVisible();
      log.stepPass("Prereq 843 - Checkboxes checked and Enumeration Mapping button visible.");
    } catch (error) {
      await log.stepFail(page, "Prereq 843 - Failed to check checkboxes or verify Enumeration Mapping button visibility.");
      throw error;
    }
  } catch (error) {
    await log.captureOnFailure(page, "runPrereq_843", error);
    throw error;
  }
}