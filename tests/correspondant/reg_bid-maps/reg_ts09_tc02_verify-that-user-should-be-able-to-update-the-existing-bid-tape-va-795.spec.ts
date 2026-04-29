import { test, expect } from '@playwright/test';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingPage } from '../../../src/pages/correspondant/enumeration-mapping';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { runPrereq_791 } from '../../../src/helpers/prereqs/prereq-791';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS09_TC02';
const TC_TITLE = 'Verify that user should be able to update the existing bid tape value (not editable under the enum) and also should be able to update the chase values.';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingPage: EnumerationMappingPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let Methods: AddonHelpers;

  const profileName = 'Bid_Maps';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_791(page, vars);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingPage = new EnumerationMappingPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    if (profile && profile.data) {
      vars["ChaseValue"] = profile.data[0]['ChaseValue'];
    }

    try {

      log.step('Select Chase Value in Enumeration Mapping and Save Draft');
      try {
        await correspondentPortalPage.Chase_Value_in_Enumeration.selectOption({ label: vars["ChaseValue"] });
        await correspondentPortalPage.Save_Draft_Button1.click();
        await expect(correspondentPortalPage.Attachment_Type).toHaveValue("Attached");
        log.stepPass('Chase Value selected: ' + vars["ChaseValue"] + ' and Draft saved. Attachment Type verified as Attached');
      } catch (e) {
        await log.stepFail(page, 'Failed to select Chase Value or Save Draft');
        throw e;
      }

      log.step('Verify all bid tape values are disabled and not editable');
      try {
        vars["AllBidTapeValuesCount"] = String(await enumerationMappingPage.Default_Bid_Tape_Values_Count.count());
        vars["DisabledBidTapeCount"] = String(await enumerationMappingPage.Disabled_Bid_Tape_Value_Count.count());
        log.info('AllBidTapeValuesCount: ' + vars["AllBidTapeValuesCount"] );
        log.info('DisabledBidTapeCount: ' + vars["DisabledBidTapeCount"]);
        Methods.verifyString(vars["AllBidTapeValuesCount"], 'equals', vars["DisabledBidTapeCount"]);
        log.stepPass('All bid tape values are disabled. Count: ' + vars["AllBidTapeValuesCount"]);
      } catch (e) {
        await log.stepFail(page, 'Bid tape values count mismatch. AllBidTapeValuesCount: ' + vars["AllBidTapeValuesCount"] + ' DisabledBidTapeCount: ' + vars["DisabledBidTapeCount"]);
        throw e;
      }

      log.step('Verify Input Bid Tape field and Rules and Actions button are visible');
      try {
        await expect(enumerationMappingPage.Input_Bid_Tape_Field).not.toBeVisible();
        await expect(rulesAndActionsButtonPage.Rules_and_Actions_Button).toBeEnabled();
        log.stepPass('Input Bid Tape Field and Rules and Actions Button are visible');
      } catch (e) {
        await log.stepFail(page, 'Input Bid Tape Field or Rules and Actions Button not visible');
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