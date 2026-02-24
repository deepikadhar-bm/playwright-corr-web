// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortal8Page } from '../../../src/pages/correspondant/correspondent-portal-8';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SaveDraftExitButtonPage } from '../../../src/pages/correspondant/save-draft-exit-button';
import { CorrespondentPortal7Page } from '../../../src/pages/correspondant/correspondent-portal-7';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortal7Page: CorrespondentPortal7Page;
  let correspondentPortal8Page: CorrespondentPortal8Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let saveDraftExitButtonPage: SaveDraftExitButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortal7Page = new CorrespondentPortal7Page(page);
    correspondentPortal8Page = new CorrespondentPortal8Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    saveDraftExitButtonPage = new SaveDraftExitButtonPage(page);
  });

  test('REG_TS02_TC07_Verify that user should be allowed to select / deselect the required fields via individual fields.Allow users to enable / disable the checkboxes / header values.', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    await expect(correspondentPortalPage.First_Checkbox_Bid_Request).toBeEnabled();
    await correspondentPortalPage.First_Checkbox_Bid_Request.check();
    await expect(saveDraftExitButtonPage.Save_Draft_Exit_Button).toBeVisible();
    await expect(correspondentPortal7Page.Header_Mapping_checkbox).toBeEnabled();
    await correspondentPortal7Page.Header_Mapping_checkbox.check();
    await correspondentPortalPage.First_Checkbox_Bid_Request.uncheck();
    await correspondentPortal7Page.Header_Mapping_checkbox.uncheck();
    await expect(correspondentPortalPage.First_Checkbox_Bid_Request).toBeVisible();
    await expect(correspondentPortal7Page.Header_Mapping_checkbox).toBeVisible();
  });
});
