// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS25_TC03_Verify the Resend commitment letter action', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await commitmentListPage.Closed_List_Tab.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Commitment_Letter.click();
    await correspondentPortalPage.Send_Email_ButtonCommitment_List.waitFor({ state: 'visible' });
    await correspondentPortalPage.Send_Email_ButtonCommitment_List.click();
    await page.getByText("Commitment letter email triggered successfully!").waitFor({ state: 'visible' });
    await expect(page.getByText("Commitment letter email triggered successfully!")).toBeVisible();
    await correspondentPortalPage.OK_ButtonCommitment_List.click();
    await correspondentPortalPage.Close_ButtonCommitment_List.click();
  });
});
