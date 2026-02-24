// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { LoginPage } from '../../../src/pages/correspondant/login';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_993 } from '../../../src/helpers/prereqs/prereq-993';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let loginPage: LoginPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_993(page, vars);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    loginPage = new LoginPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS04_TC09_CASE-04_No changes / No unidentified fields : Directly move to next screen without prompt.', async ({ page }) => {

    vars["headername"] = String(await loginPage.header_chase_name.count());
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["headername"]))) {
      await expect(loginPage.Header_chase_name).toBeVisible();
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(rulesAndActionsButtonPage.Rules_and_Actions_Button).toBeVisible();
  });
});
