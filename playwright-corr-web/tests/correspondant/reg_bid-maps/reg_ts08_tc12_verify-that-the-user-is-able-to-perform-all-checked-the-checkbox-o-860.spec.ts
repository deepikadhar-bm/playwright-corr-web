// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BackButtonPage } from '../../../src/pages/correspondant/back-button';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { ProceedWithSavingButtonPage } from '../../../src/pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../../src/pages/correspondant/rules-and-actions-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let backButtonPage: BackButtonPage;
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let proceedWithSavingButtonPage: ProceedWithSavingButtonPage;
  let rulesAndActionsButtonPage: RulesAndActionsButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    backButtonPage = new BackButtonPage(page);
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
    rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS08_TC12_Verify that the user is able to perform all Checked the checkbox operations in the Enumeration mapping.', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    await page.waitForLoadState('networkidle');
    await stepGroups.stepGroup_Storing_All_Enum_TDP_Values_into_a_Variable(page, vars);
    await stepGroups.stepGroup_Checking_All_Enum_Fields_In_Header_Mapping_Screen(page, vars);
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    if (true) /* Element Proceed with Saving Button is visible */ {
      await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
    }
    if (true) /* Element Yes, Proceed Button. is visible */ {
      await correspondentPortal18Page.Yes_Proceed_Button.click();
    }
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Verification_Of_Checked_Enum_Fields_In_Enumeration(page, vars);
    await backButtonPage.BACK_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.waitFor({ state: 'visible' });
    await stepGroups.stepGroup_Unchecking_All_Enum_Fields_In_Header_Mapping_Screen(page, vars);
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    if (true) /* Element Proceed with Saving Button is visible */ {
      await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
    }
    if (true) /* Element Yes, Proceed Button. is visible */ {
      await correspondentPortal18Page.Yes_Proceed_Button.click();
    }
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Verification_Of_Unchecked_Enum_Fields_In_Enumeration(page, vars);
    await rulesAndActionsButtonPage.Rules_and_Actions_Button.click();
    if (true) /* Element Proceed with Saving Button is visible */ {
      await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
    }
    if (true) /* Element Yes, Proceed Button. is visible */ {
      await correspondentPortal18Page.Yes_Proceed_Button.click();
    }
  });
});
