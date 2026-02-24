// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { StatusInactive2Page } from '../../../src/pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { runPrereq_794 } from '../../../src/helpers/prereqs/prereq-794';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let headerMappingPage: HeaderMappingPage;
  let statusInactive2Page: StatusInactive2Page;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_794(page, vars);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    statusInactive2Page = new StatusInactive2Page(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('REG_TS04_TC03_Verify that the user is able to perform all Delete operations in the header mapping.', async ({ page }) => {

    await correspondentPortalPage.Delete_icon.click();
    await expect(correspondentPortalPage.Delete).toBeVisible();
    vars["DeleteHeaderMapping"] = await headerMappingPage.Deleting_Header.textContent() || '';
    vars["BidSampleFieldName"] = await statusInactivePage.Delete_Message.textContent() || '';
    await expect(page.getByText(vars["BidSampleFieldName"])).toBeVisible();
    await correspondentPortalPage.Yes_Proceed_Button.click();
    await page.waitForLoadState('networkidle');
    await expect(statusInactive2Page.Error_Message_in_Hedaer_Mapping).toBeVisible();
    await expect(enumerationMappingButtonPage.Enumeration_Mapping_Button).toBeVisible();
  });
});
