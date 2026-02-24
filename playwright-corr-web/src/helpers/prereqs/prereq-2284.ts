import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../pages/correspondant/spinner';

export async function runPrereq_2284(page: Page, vars: Record<string, string>): Promise<void> {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const spinnerPage = new SpinnerPage(page);


  await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await stepGroups.stepGroup_Smart_Mapper_from_On_to_Off(page, vars);
  await correspondentPortalPage.Administration_Menu.click();
  await correspondentPortalPage.GeneralSettings_Menu.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await correspondentPortalPage.Bid_Map_Creation_in_General_Settings.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await stepGroups.stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page, vars);
  // [DISABLED] Store CurrentLocalTime in ExpectedTimeAudit
  // vars["ExpectedTimeAudit"] = vars["CurrentLocalTime"];
  await stepGroups.stepGroup_Smart_Mapper_from_Off_to_On(page, vars);
  vars["ExpectedPreviousData"] = "false";
  vars["ExpectedNewData"] = "true";
}
