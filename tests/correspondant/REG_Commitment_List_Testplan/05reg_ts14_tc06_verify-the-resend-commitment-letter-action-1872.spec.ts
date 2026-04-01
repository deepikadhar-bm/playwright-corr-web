import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '@config/environments';

const TC_ID = 'REG_TS14_TC06';
const TC_TITLE = 'Verify the Resend commitment letter action';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Login to CORR portal and navigate to Commitment List');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Login successful and navigated to Commitment List');
      } catch (e) {
        log.stepFail(page, 'Failed to login or navigate to Commitment List');
        throw e;
      }

      log.step('Resending commitment letter and verifying success message');
      try {
        await commitmentListPage.Commitment_Letter.first().click();
        await correspondentPortalPage.Send_Email_ButtonCommitment_List.first().waitFor({ state: 'visible' });
        await correspondentPortalPage.Send_Email_ButtonCommitment_List.first().click();
        await page.getByText('Commitment letter email triggered successfully!').waitFor({ state: 'visible' });
        await expect(page.getByText('Commitment letter email triggered successfully!')).toBeVisible();
        await correspondentPortalPage.OK_ButtonCommitment_List.click();
        await correspondentPortalPage.Close_ButtonCommitment_List.click();
        log.stepPass('Commitment letter resent and success message verified');
      } catch (e) {
        log.stepFail(page, 'Failed to resend commitment letter or verify success message');
        throw e;
      }

      log.tcEnd('PASS');
    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});