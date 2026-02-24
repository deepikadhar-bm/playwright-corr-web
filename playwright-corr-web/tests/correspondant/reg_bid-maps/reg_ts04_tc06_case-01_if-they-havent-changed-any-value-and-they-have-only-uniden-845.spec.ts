// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BackButtonPage } from '../../../src/pages/correspondant/back-button';
import { ContinueEditingButtonPage } from '../../../src/pages/correspondant/continue-editing-button';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let backButtonPage: BackButtonPage;
  let continueEditingButtonPage: ContinueEditingButtonPage;
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    backButtonPage = new BackButtonPage(page);
    continueEditingButtonPage = new ContinueEditingButtonPage(page);
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS04_TC06_CASE-01_If they haven\\\'t changed any value and they have only unidentified fields - Message should be \\\"You have unidentified fields do you want to proceed further\\\", its just \\\"Yes, Pro', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
    await expect(correspondentPortalPage.Yes_Proceed_Button).toBeVisible();
    await correspondentPortalPage.close_pop_up_bid_request_details.click();
    await page.waitForLoadState('networkidle');
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
    await continueEditingButtonPage.Continue_Editing_Button.click();
    await page.waitForLoadState('networkidle');
    await enumerationMappingButtonPage.Enumeration_Mapping_Button.click();
    await expect(correspondentPortalPage.You_have_unidentified_fields_do_you_want_to_proceed_Further).toBeVisible();
    await correspondentPortal18Page.Yes_Proceed_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(backButtonPage.BACK_Button).toBeVisible();
    await backButtonPage.BACK_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.Select_All_Checkbox).toBeVisible();
  });
});
