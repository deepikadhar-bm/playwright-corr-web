// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortal18Page } from '../../../src/pages/correspondant/correspondent-portal-18';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../../src/pages/correspondant/enumeration-mapping-button';
import { HeaderMappingPage } from '../../../src/pages/correspondant/header-mapping';
import { NoButtonPage } from '../../../src/pages/correspondant/no-button';
import { P24UnitDropdownPage } from '../../../src/pages/correspondant/p-24-unit-dropdown';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let correspondentPortal18Page: CorrespondentPortal18Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let enumerationMappingButtonPage: EnumerationMappingButtonPage;
  let headerMappingPage: HeaderMappingPage;
  let noButtonPage: NoButtonPage;
  let p24UnitDropdownPage: P24UnitDropdownPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortal18Page = new CorrespondentPortal18Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
    headerMappingPage = new HeaderMappingPage(page);
    noButtonPage = new NoButtonPage(page);
    p24UnitDropdownPage = new P24UnitDropdownPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('REG_TS02_TC03_Delete Should trigger a confirmation pop up.Upon Delete, On click on \\\'X\\\" / \\\'No\\\' The pop up should close.Upon Delete, On click on \\\'Yes, Proceed\\\' should delete the Mapping.', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    await expect(enumerationMappingButtonPage.Enumeration_Mapping_Button).toBeVisible();
    vars["DeleteHeaderMapping"] = await headerMappingPage.Deleting_Header.textContent() || '';
    await correspondentPortalPage.Delete_icon.click();
    vars["DeleteHederMapping"] = await statusInactivePage.Delete_Message.textContent() || '';
    await expect(page.getByText(vars["DeleteHederMapping"])).toBeVisible();
    await expect(statusInactivePage.Delete_Message).toBeVisible();
    await correspondentPortalPage.close_pop_up_bid_request_details.click();
    await expect(statusInactivePage.Delete_Message).toBeVisible();
    await correspondentPortalPage.Delete_icon.click();
    await expect(statusInactivePage.Delete_Message).toBeVisible();
    await noButtonPage.No_Button.click();
    await expect(statusInactivePage.Delete_Message).toBeVisible();
    await correspondentPortalPage.Delete_icon.click();
    await expect(statusInactivePage.Delete_Message).toBeVisible();
    await expect(correspondentPortal18Page.Yes_Proceed_Button).toBeVisible();
    await correspondentPortal18Page.Yes_Proceed_Button.click();
    await expect(p24UnitDropdownPage.Header_Mapping).toBeVisible();
  });
});
