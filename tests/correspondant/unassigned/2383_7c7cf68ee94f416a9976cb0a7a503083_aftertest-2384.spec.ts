// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { OkButtonPage } from '../../../src/pages/correspondant/ok-button';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let okButtonPage: OkButtonPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    okButtonPage = new OkButtonPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('2383_7c7cf68ee94f416a9976cb0a7a503083_aftertest', async ({ page }) => {
    if (true) /* Test Case Result is Failed */ {
      await correspondentPortalPage.Administration_Menu.click();
      await correspondentPortalPage.GeneralSettings_Menu.click();
      await correspondentPortalPage.Company_ConfigGenral_settings.click();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await correspondentPortalPage.Toggle_dropdown_Dropdown.click();
      await correspondentPortalPage.Time_Zone_OptionAmericaNew_York.scrollIntoViewIfNeeded();
      await correspondentPortalPage.Time_Zone_OptionAmericaNew_York.click();
      await expect(correspondentPortalPage.Toggle_dropdown_Dropdown).toContainText("America/New_York");
      if (true) /* Element Save Settings is enabled */ {
        await correspondentPortalPage.Save_Settings.click();
        await page.getByText("Company config updated successfully!").waitFor({ state: 'visible' });
        await okButtonPage.Ok_Button.waitFor({ state: 'visible' });
        await okButtonPage.Ok_Button.click();
      }
    }
  });
});
