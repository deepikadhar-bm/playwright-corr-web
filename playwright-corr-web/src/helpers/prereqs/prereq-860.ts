import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BackButtonPage } from '../../pages/correspondant/back-button';
import { CorrespondentPortal18Page } from '../../pages/correspondant/correspondent-portal-18';
import { EnumerationMappingButtonPage } from '../../pages/correspondant/enumeration-mapping-button';
import { ProceedWithSavingButtonPage } from '../../pages/correspondant/proceed-with-saving-button';
import { RulesAndActionsButtonPage } from '../../pages/correspondant/rules-and-actions-button';
import { SpinnerPage } from '../../pages/correspondant/spinner';

export async function runPrereq_860(page: Page, vars: Record<string, string>): Promise<void> {
  const backButtonPage = new BackButtonPage(page);
  const correspondentPortal18Page = new CorrespondentPortal18Page(page);
  const enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
  const proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
  const rulesAndActionsButtonPage = new RulesAndActionsButtonPage(page);
  const spinnerPage = new SpinnerPage(page);


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
}
