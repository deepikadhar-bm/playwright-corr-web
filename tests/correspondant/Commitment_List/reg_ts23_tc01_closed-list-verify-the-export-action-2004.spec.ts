// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { Logger as log } from '@helpers/log-helper';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';


test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let Methods: AddonHelpers;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    Methods = new AddonHelpers(page, vars);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS23_TC01_Closed List : Verify the Export action', async ({ page }) => {
    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
    await commitmentListPage.Closed_List_Tab.hover();
    await commitmentListPage.Closed_List_Tab.click();
    await page.waitForLoadState('networkidle'),
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // await commitmentListPage.First_Company_CommitmentClosedList.click();
    await commitmentListPage.Required_Record.first().waitFor({ state: 'visible' });
    await commitmentListPage.Required_Record.first().check();
    expect(await commitmentListPage.Required_Record.first().isChecked());
    vars["TotalRowsCountUI"] = String(await commitmentListPage.Row_CountClosed_List.count());
    await correspondentPortalPage.Export_Selected_1_Button.isEnabled();
    Methods.getCurrentTimestamp('dd-MM-yyyy HH-mm-ss', 'TimeStamp', 'Asia/Kolkata');
    const [download] = await Promise.all([page.waitForEvent('download'), correspondentPortalPage.Export_Selected_1_Button.first().click()]);
    log.info("File was downloaded successfully");
    vars['SavedFileName'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
    vars['ExportsFilePath'] = path.join(vars['DownloadDir'], vars['SavedFileName']);
    await download.saveAs(vars['ExportsFilePath']);
    await stepGroups.stepGroup_Headers_Verification_in_Closed_List(page, vars);
    await stepGroups.stepGroup_Verification_of_Data_from_Excel_to_UIClosed_List(page, vars);
  });
});