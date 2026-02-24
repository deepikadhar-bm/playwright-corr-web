// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { DashBoardPage } from '../../../src/pages/correspondant/dash-board';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let dashBoardPage: DashBoardPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    dashBoardPage = new DashBoardPage(page);
  });

  test('REG_TS01_TC01_Verify Default Data Load and Graph Updates', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await page.waitForLoadState('networkidle');
    await expect(correspondentPortalPage.Heading_Dashboard).toBeVisible();
    await expect(dashBoardPage.Current_Day_Dropdown).toContainText("Current Day");
    await expect(correspondentPortalPage.Select_Clients_Dropdown_2).toContainText("All Companies");
    await expect(correspondentPortalPage.Total_commitments).toBeVisible();
    await expect(dashBoardPage.Total_loan_value_Text).toBeVisible();
    await expect(dashBoardPage.SLA_Accuracy_Text).toBeVisible();
  });
});
