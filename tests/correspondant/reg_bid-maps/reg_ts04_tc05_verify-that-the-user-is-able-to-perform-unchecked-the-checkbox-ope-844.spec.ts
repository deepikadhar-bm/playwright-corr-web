// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortal8Page } from '../../../src/pages/correspondant/correspondent-portal-8';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { runPrereq_843 } from '../../../src/helpers/prereqs/prereq-843';
import { CorrespondentPortal7Page } from '../../../src/pages/correspondant/correspondent-portal-7';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortal7Page: CorrespondentPortal7Page;
  let correspondentPortal8Page: CorrespondentPortal8Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_843(page, vars);
    correspondentPortal7Page = new CorrespondentPortal7Page(page);
    correspondentPortal8Page = new CorrespondentPortal8Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
  });

  test('REG_TS04_TC05_Verify that the user is able to perform UnChecked the checkbox  operations in the header mapping.', async ({ page }) => {

    await correspondentPortalPage.First_Checkbox_Bid_Request.uncheck();
    await correspondentPortal7Page.Header_Mapping_checkbox.uncheck();
    await page.waitForLoadState('networkidle');
    await expect(enumerationMappingButtonPage.Enumeration_Mapping_Button).toBeVisible();
  });
});
