// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { HeadingCreateNewMapPage } from '../../../src/pages/correspondant/heading-create-new-map';
import { HeadingMappingsPage } from '../../../src/pages/correspondant/heading-mappings';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let headingCreateNewMapPage: HeadingCreateNewMapPage;
  let headingMappingsPage: HeadingMappingsPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    headingCreateNewMapPage = new HeadingCreateNewMapPage(page);
    headingMappingsPage = new HeadingMappingsPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS18_TC01_Verify that the user should not be allowed to create duplicate maps and verify that if the map is deleted then the user should be able to create a new map with the same name.', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.Heading_Dashboard).toBeVisible();
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.Bid_Maps_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(headingMappingsPage.Mappings).toBeVisible();
    vars["ExistingBidMapName"] = await correspondentPortalPage.ExistingCompany_Name.textContent() || '';
    vars["ExistingBidMapName"] = String(vars["ExistingBidMapName"]).substring(1, String(vars["ExistingBidMapName"]).length - 1);
    await correspondentPortalPage.Add_New_Mapping_Button.click();
    await expect(headingCreateNewMapPage.Create_New_Map).toBeVisible();
    await correspondentPortalPage.Create_New_Map_Field.fill(vars["ExistingBidMapName"]);
    await correspondentPortalPage.Create_Button.click();
    await expect(correspondentPortalPage.BidMap_already_exists_Error_Message).toBeVisible();
    await correspondentPortalPage.close_pop_up_bid_request_details.click();
    await page.waitForLoadState('networkidle');
  });
});
