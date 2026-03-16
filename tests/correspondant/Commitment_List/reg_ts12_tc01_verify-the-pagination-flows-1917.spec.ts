import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID    = 'REG_TS12_TC01';
const TC_TITLE = 'Verify the pagination flows';

test.describe('Commitment List - TS_1', () => {

  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    commitmentListPage      = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage        = new PriceOfferedPage(page);
    spinnerPage             = new SpinnerPage(page);
    Methods                 = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Login to CORR portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login successful');
      } catch (e) {
        await log.stepFail(page, 'Login failed');
        throw e;
      }

      log.step('Navigate to Commitment List');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        log.stepPass('Navigated to Commitment List');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Commitment List');
        throw e;
      }

      log.step('Capture available page size options');
      try {
        await correspondentPortalPage.Change_Page_Size_Dropdown.click();
        vars['CountOfSetPageSize'] = String(await commitmentListPage.Set_page_size_to_Dropdown.count());
        await correspondentPortalPage.Change_Page_Size_Dropdown.click();
        log.stepPass('Page size options count: ' + vars['CountOfSetPageSize']);
      } catch (e) {
        await log.stepFail(page, 'Failed to get page size options');
        throw e;
      }

      log.step('Verify row count matches each page size option');
      try {
        vars['count'] = appconstants.ONE;
        while (parseFloat(vars['count']) <= parseFloat(vars['CountOfSetPageSize'])) {
          await correspondentPortalPage.Change_Page_Size_Dropdown.click();
          vars['IndividualSetPageSize'] = await commitmentListPage.IndividualSetPageSize(vars['count']).textContent() || '';
          await commitmentListPage.IndividualSetPageSize(vars['count']).click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden' });
          Methods.trimWhitespace(vars['IndividualSetPageSize'], 'IndividualSetPageSize');
          vars['RowsCount'] = String(await priceOfferedPage.Total_Rows_Count_UIDetails.count());
          expect(Methods.verifyComparison(vars['IndividualSetPageSize'],'==',vars['RowsCount']));
          log.info('Page size: ' + vars['IndividualSetPageSize'] + ' Rows displayed: ' + vars['RowsCount']);
          Methods.MathematicalOperation(vars['count'],"+","1","count");
        }
        log.stepPass('Pagination verified for all ' + vars['CountOfSetPageSize'] + ' page size');
      } catch (e) {
        await log.stepFail(page, 'Row count mismatch for page size: ' + vars['IndividualSetPageSize'] + ' Rows displayed: ' + vars['RowsCount']);
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