// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
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

test.describe('Unassigned', () => {
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

  test('REG_TS08_TC13_Verify that the user is able to perform UnChecked the checkbox operations in the Enumeration  mapping.', async ({ page }) => {

    if (true) /* Element Add Rule Button is visible */ {
      await backButtonPage.BACK_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await correspondentPortalPage.Header_Mapping1.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await page.waitForLoadState('networkidle');
    } else if (true) /* Element Add Rule Button is not visible */ {
      await backButtonPage.BACK_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await backButtonPage.BACK_Button.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    }
    await p15ActivePage.Checking_Enum_Value.uncheck();
    await mappingPage.Checking_Enum_Values_in_Header_Mapping2.uncheck();
    await correspondentPortalPage.Save_Draft_Button1.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await expect(statusInactivePage.Checking_Enum_Values_In_Enumeration_Mapping).toBeVisible();
    await expect(statusInactivePage.Checking_Enum_Values_In_Enumeration_Mapping).toBeVisible();
    await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
    if (true) /* Element You have unidentified fields. This action will save  */ {
      await expect(correspondentPortalPage.You_have_unidentified_fields_This_action_will_save_the_changes_and_Move_to_Next_Page).toBeVisible();
      await continueEditingButtonPage.Continue_Editing_Button.click();
    }
  });
});
