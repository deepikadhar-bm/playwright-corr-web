// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { P2142530YrFreddieMacFixedDropdownPage } from '../../../src/pages/correspondant/p-2142530-yr-freddie-mac-fixed-dropdown';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let p2142530YrFreddieMacFixedDropdownPage: P2142530YrFreddieMacFixedDropdownPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    p2142530YrFreddieMacFixedDropdownPage = new P2142530YrFreddieMacFixedDropdownPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS21_TC01_Verify that user should be able to navigate to the required bid map details screen.', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    if (true) /* Element Dashboard is visible */ {
      await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
      await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
      await stepGroups.stepGroup_Edition_in_Header_Mapping(page, vars);
      await stepGroups.stepGroup_Deletion_in_Enumeration_Mapping(page, vars);
      await stepGroups.stepGroup_Import_Rule_in_Mapping(page, vars);
      await correspondentPortalPage.Bid_Maps_name.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(p2142530YrFreddieMacFixedDropdownPage.Bid_Maps_Name).toContainText(vars["Create New Map"]);
    } else {
      await page.waitForLoadState('networkidle');
    }
  });
});
