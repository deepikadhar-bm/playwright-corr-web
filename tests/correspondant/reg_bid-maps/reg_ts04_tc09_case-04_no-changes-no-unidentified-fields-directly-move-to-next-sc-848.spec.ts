import { test, expect } from '@playwright/test';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { LoginPage } from '../../../src/pages/correspondant/login';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_993 } from '../../../src/helpers/prereqs/prereq-993';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { Logger as log } from '@helpers/log-helper';
import { AddonHelpers } from '@helpers/AddonHelpers';


const TC_ID = 'REG_TS04_TC09_CASE-04';
const TC_TITLE = 'No changes / No unidentified fields : Directly move to next screen without prompt.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let loginPage: LoginPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_993(page, vars);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    loginPage = new LoginPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Verify all header Chase names are visible in Header Mapping screen');
      try {
        vars["headername"] = String(await loginPage.header_chase_name.count());
        log.info('Total header names: '+vars["headername"]);
        vars["count"] = appconstants.ONE;
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["headername"]))) {
          await expect(loginPage.Header_chase_name(vars['count'])).toBeVisible();
          log.info('Verified header name: '+vars["count"]);
          Methods.performArithmetic(vars["count"],'ADDITION','1','count',0);
        }
        log.stepPass(`All ${vars["headername"]} header Chase names verified as visible`);
      } catch (e) {
        await log.stepFail(page, 'Failed to verify header Chase names visibility');
        throw e;
      }

      log.step('Click Enumeration Mapping and verify direct navigation without prompt');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(rulesAndActionsButtonPage.Rules_and_Actions_Button).toBeVisible();
        log.stepPass('Enumeration Mapping navigated directly to next screen without any prompt');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate directly to next screen or Rules and Actions Button not visible');
        throw e;
      }

      log.tcEnd('PASS');

    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});