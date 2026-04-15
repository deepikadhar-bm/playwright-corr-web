import { test, expect } from '@playwright/test';
import { BackButtonPage } from '../../../src/pages/correspondant/back-button';
import { ContinueEditingButtonPage } from '../../../src/pages/correspondant/continue-editing-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { MappingPage } from '../../../src/pages/correspondant/mapping';
import { P15ActivePage } from '../../../src/pages/correspondant/p-15-active';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { runPrereq_860 } from '../../../src/helpers/prereqs/prereq-860';
import { Logger as log } from '@helpers/log-helper';


const TC_ID = 'REG_TS08_TC13';
const TC_TITLE = 'Verify that the user is able to perform UnChecked the checkbox operations in the Enumeration Mapping.';

test.describe('REG_Bid Maps', () => {

  let vars: Record<string, string> = {};
  let backButtonPage: BackButtonPage;
  let continueEditingButtonPage: ContinueEditingButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let mappingPage: MappingPage;
  let p15ActivePage: P15ActivePage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_860(page, vars);
    backButtonPage = new BackButtonPage(page);
    continueEditingButtonPage = new ContinueEditingButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    mappingPage = new MappingPage(page);
    p15ActivePage = new P15ActivePage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Navigate to Header Mapping based on Back Button visibility');
      try {
        if (await backButtonPage.BACK_Button.isVisible()) {
          log.info('Back Button is visible — clicking back and navigating to Header Mapping');
          await backButtonPage.BACK_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await correspondentPortalPage.Header_Mapping1.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await page.waitForLoadState('networkidle');
        } else {
          log.info('Back Button is not visible — navigating back twice');
          await backButtonPage.BACK_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          await backButtonPage.BACK_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        }
        log.stepPass('Navigation to Header Mapping completed');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Header Mapping');
        throw e;
      }

      log.step('Uncheck enumeration values and Save Draft');
      try {
        await p15ActivePage.Checking_Enum_Value.uncheck();
        await mappingPage.Checking_Enum_Values_in_Header_Mapping2(vars['EnumValues']).uncheck();
        await correspondentPortalPage.Save_Draft_Button1.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Enumeration values unchecked and Draft saved successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to uncheck enumeration values or Save Draft');
        throw e;
      }

      log.step('Navigate to Enumeration Mapping and verify unchecked enum values');
      try {
        await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
        await expect(statusInactivePage.Checking_Enum_In_Enumeration_Mapping).not.toBeChecked();
        await expect(statusInactivePage.Checking_Enum_Values_In_Enumeration_Mapping).not.toBeChecked();
        log.stepPass('Enumeration Mapping loaded and unchecked enum values verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Enumeration Mapping or verify unchecked enum values');
        throw e;
      }

      log.step('Navigate to Rules and Actions and handle unidentified fields dialog if present');
      try {
        await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
        if (await correspondentPortalPage.You_have_unidentified_fields_This_action_will_save_the_changes_and_Move_to_Next_Page.isVisible()) {
          log.info('Unidentified fields dialog is visible — clicking Continue Editing');
          await expect(correspondentPortalPage.You_have_unidentified_fields_This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
          await continueEditingButtonPage.Continue_Editing_Button.click();
          log.info('Clicked Continue Editing on unidentified fields dialog');
        } else {
          log.info('Unidentified fields dialog not present — proceeding');
        }
        log.stepPass('Rules and Actions navigation and unidentified fields dialog handled successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Rules and Actions or handle unidentified fields dialog');
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