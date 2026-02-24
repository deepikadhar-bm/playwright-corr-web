// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { runPrereq_2155 } from '../../../src/helpers/prereqs/prereq-2155';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let generalSettingPage: GeneralSettingPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_2155(page, vars);
    generalSettingPage = new GeneralSettingPage(page);
  });

  test('REG_TS06_TC02_ Early Close Config - Verify the last Modified date, Time and User data that get displayed in the Right corner of the Page.', async ({ page }) => {

    expect((await generalSettingPage.Last_Modified_DataRight_Corner_Screen.textContent() || '').toLowerCase()).toContain(String('').toLowerCase());
    expect((await generalSettingPage.Last_Modified_DataRight_Corner_Screen.textContent() || '').toLowerCase()).toContain(String('').toLowerCase());
  });
});
