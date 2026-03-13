// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import {EnumerationMappingPage } from '../../../src/pages/correspondant/enumeration-mapping';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { runPrereq_791 } from '../../../src/helpers/prereqs/prereq-791';
import { Logger as log } from '../../../src/helpers/log-helper';

const TC_ID = "REG_TS09_TC03";
const TC_TITLE = "Verify that user should be able to Delete the existing bid tape value under the enum and also should be able to update the chase values.";

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let enumerationMappingPage: EnumerationMappingPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_791(page, vars);
    enumerationMappingPage = new EnumerationMappingPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step("Step 1: Delete existing bid tape enumeration pair and verify it is removed");
      try {
        await correspondentPortalPage.Delete_icon_in_Enumeration_Mappings.click();
        await correspondentPortalPage.Delete_Enumeration_Pair.waitFor({ state: 'visible' });
        await expect(correspondentPortalPage.Are_you_sure_you_want_to_delete_fixed_from_enumeration).toBeVisible();
        await correspondentPortalPage.Yes_Go_ahead_Button.click();
        await expect(rulesAndActionsButtonPage.Rules_and_Actions_Button).toBeVisible();
        await expect(enumerationMappingPage.Delete_icon_in_Enumeration_Mapping).toBeHidden();
        log.stepPass("Step 1 passed: Enumeration pair deleted and no delete icon visible for that mapping.");
      } catch (error) {
        log.stepFail(page, "Step 1 failed: Unable to delete enumeration pair or verify its removal.");
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
