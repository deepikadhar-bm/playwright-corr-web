// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { Amix4MosnaCovdaA4189CheckboxPage } from '../../../src/pages/correspondant/amix4-mosna-covda-a4189-checkbox';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { runPrereq_791 } from '../../../src/helpers/prereqs/prereq-791';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let amix4MosnaCovdaA4189CheckboxPage: Amix4MosnaCovdaA4189CheckboxPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_791(page, vars);
    amix4MosnaCovdaA4189CheckboxPage = new Amix4MosnaCovdaA4189CheckboxPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
  });

  test('REG_TS09_TC03_Verify that user should be able to Delete the existing bid tape value under the enum and also should be able to update the chase values.', async ({ page }) => {

    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Delete_icon_in_Enumeration_Mappings.click();
    await correspondentPortalPage.Delete_Enumeration_Pair.waitFor({ state: 'visible' });
    await expect(correspondentPortalPage.Are_you_sure_you_want_to_delete_fixed_from_enumeration).toBeVisible();
    await correspondentPortalPage.Yes_Go_ahead_Button.click();
    await page.waitForLoadState('networkidle');
    await expect(rulesAndActionsButtonPage.Rules_and_Actions_Button).toBeVisible();
    await expect(amix4MosnaCovdaA4189CheckboxPage.Delete_icon_in_Enumeration_Mapping).toBeVisible();
  });
});
