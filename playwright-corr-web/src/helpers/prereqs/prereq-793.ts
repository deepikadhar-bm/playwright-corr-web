import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../pages/correspondant/enumeration-mapping-button';
import { HeaderMappingPage } from '../../pages/correspondant/header-mapping';
import { StatusInactive2Page } from '../../pages/correspondant/status-inactive--2';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';
import { runPrereq_794 } from './prereq-794';

export async function runPrereq_793(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_794(page, vars);

  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);
  const headerMappingPage = new HeaderMappingPage(page);
  const statusInactive2Page = new StatusInactive2Page(page);
  const statusInactivePage = new StatusInactivePage(page);



  await correspondentPortalPage.Delete_icon.click();
  await expect(correspondentPortalPage.Delete).toBeVisible();
  vars["DeleteHeaderMapping"] = await headerMappingPage.Deleting_Header.textContent() || '';
  vars["BidSampleFieldName"] = await statusInactivePage.Delete_Message.textContent() || '';
  await expect(page.getByText(vars["BidSampleFieldName"])).toBeVisible();
  await correspondentPortalPage.Yes_Proceed_Button.click();
  await page.waitForLoadState('networkidle');
  await expect(statusInactive2Page.Error_Message_in_Hedaer_Mapping).toBeVisible();
  await expect(enumerationMappingButtonPage.Enumeration_Mapping_Button).toBeVisible();
}
