// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import { CorrespondentPortal8Page } from '../../../src/pages/correspondant/correspondent-portal-8';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { runPrereq_843 } from '../../../src/helpers/prereqs/prereq-843';
import { CorrespondentPortal7Page } from '../../../src/pages/correspondant/correspondent-portal-7';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = "REG_TS04_TC05";
const TC_TITLE = "Verify that the user is able to perform UnChecked the checkbox operations in the header mapping.";

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortal7Page: CorrespondentPortal7Page;
  let correspondentPortal8Page: CorrespondentPortal8Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_843(page, vars);
    correspondentPortal7Page = new CorrespondentPortal7Page(page);
    correspondentPortal8Page = new CorrespondentPortal8Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step("Step 1: Uncheck Bid Request and Header Mapping checkboxes");
      try {
        await correspondentPortalPage.First_Checkbox_Bid_Request.uncheck();
        await correspondentPortal7Page.Header_Mapping_checkbox.uncheck();
        await expect(enumerationMappingButtonPage.Enumeration_Mapping_Button).toBeVisible();
        log.stepPass("Step 1 passed: Checkboxes unchecked and Enumeration Mapping button is visible.");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Unable to uncheck checkboxes or Enumeration Mapping button not visible.");
        throw error;
      }

      log.tcEnd('PASS');
    } catch (error) {
      await log.captureOnFailure(page, TC_ID, error);
      log.tcEnd('FAIL');
      throw error;
    }
  });
});
