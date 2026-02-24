// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ActionruleheaderPage } from '../../../src/pages/correspondant/actionruleheader';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { DuplicatecopyButtonPage } from '../../../src/pages/correspondant/duplicatecopy-button';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { RulesAndActionsPage } from '../../../src/pages/correspondant/rules-and-actions';
import { SaveAndPublishButtonPage } from '../../../src/pages/correspondant/save-and-publish-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let actionruleheaderPage: ActionruleheaderPage;
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let duplicatecopyButtonPage: DuplicatecopyButtonPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let rulesAndActionsPage: RulesAndActionsPage;
  let saveAndPublishButtonPage: SaveAndPublishButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    actionruleheaderPage = new ActionruleheaderPage(page);
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    duplicatecopyButtonPage = new DuplicatecopyButtonPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    rulesAndActionsPage = new RulesAndActionsPage(page);
    saveAndPublishButtonPage = new SaveAndPublishButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS11_TC02_Verification Of Duplicating the Rule', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    if (true) /* Element Yes, Proceed Button. is visible */ {
      await correspondentPortal18Page.Yes_Proceed_Button.click();
    }
    await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
    await correspondentPortal18Page.Yes_Proceed_Button.click();
    await page.waitForLoadState('networkidle');
    await expect(actionruleheaderPage.Rules_and_Actions_Heading).toBeVisible();
    await stepGroups.stepGroup_Adding_Rules_In_Rules_and_Actions_Screen(page, vars);
    await stepGroups.stepGroup_Add_Actions_in_Rules_and_Actions(page, vars);
    await duplicatecopyButtonPage.DuplicateCopy_Button.click();
    await expect(rulesAndActionsPage.Duplicated_Block).toBeVisible();
    await stepGroups.stepGroup_Verification_Of_Duplicated_Rule_Values(page, vars);
    await stepGroups.stepGroup_Adding_Rules_In_Rules_and_Actions_Screen_Duplicated_Rule(page, vars);
    await stepGroups.stepGroup_Add_Actions_in_Rules_and_ActionsDuplicated_Rule(page, vars);
    await stepGroups.stepGroup_Verification_Of_Duplicated_Rule_Values(page, vars);
    await saveAndPublishButtonPage.Save_and_Publish_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  });
});
