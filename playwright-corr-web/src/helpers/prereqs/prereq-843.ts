import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { CorrespondentPortal8Page } from '../../pages/correspondant/correspondent-portal-8';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { EnumerationMappingButtonPage } from '../../pages/correspondant/enumeration-mapping-button';
import { runPrereq_793 } from './prereq-793';
import { CorrespondentPortal7Page } from '../../pages/correspondant/correspondent-portal-7';

export async function runPrereq_843(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_793(page, vars);

  const correspondentPortal7Page = new CorrespondentPortal7Page(page);
  const correspondentPortal8Page = new CorrespondentPortal8Page(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const enumerationMappingButtonPage = new EnumerationMappingButtonPage(page);



  await correspondentPortalPage.First_Checkbox_Bid_Request.check();
  await correspondentPortal7Page.Header_Mapping_checkbox.check();
  await expect(enumerationMappingButtonPage.Enumeration_Mapping_Button).toBeVisible();
}
