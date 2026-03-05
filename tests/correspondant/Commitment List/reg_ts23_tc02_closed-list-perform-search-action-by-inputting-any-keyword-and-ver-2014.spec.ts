// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { Logger as log } from '@helpers/log-helper';
import { AddonHelpers } from '@helpers/AddonHelpers';


test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test('REG_TS23_TC02_Closed List : Perform search action by inputting any keyword and verify the export action', async ({ page }) => {
    vars['DownloadDir'] = path.join(process.cwd(), 'downloads');
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await commitmentListPage.Committed_List_Dropdown.click();
    await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
    await commitmentListPage.Closed_List_Tab.hover();
    await commitmentListPage.Closed_List_Tab.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.First_Bid_Req_IDCommitment_List.first().waitFor({ state: 'visible' });
    vars["FirstBidReqId"] = await commitmentListPage.First_Bid_Req_IDCommitment_List.first().textContent() || '';
    // vars["FirstBidReqId"] = String(vars["FirstBidReqId"]).trim();
    Methods.trimtestdata(vars["FirstBidReqId"], "FirstBidReqId");
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.type(vars["FirstBidReqId"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    // await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Select_all_for_Checkbox.check();
    await expect(priceOfferedPage.Select_all_for_Checkbox).toBeChecked({ timeout: 60000 });
    vars["TotalRowsCountUI"] = String(await commitmentListPage.Row_CountClosed_List.count());
    await correspondentPortalPage.Export_Selected_1_Button.isEnabled();
    Methods.getCurrentTimestamp('dd-MM-yyyy HH-mm-ss', 'TimeStamp', 'Asia/Kolkata');
    const [download] = await Promise.all([page.waitForEvent('download'), correspondentPortalPage.Export_Selected_1_Button.first().click()]);
    log.info("File was downloaded successfully");
    vars['SavedFileName'] = vars['TimeStamp'] + '_' + download.suggestedFilename();
    vars['ExportsFilePath'] = path.join(vars['DownloadDir'], vars['SavedFileName']);
    await download.saveAs(vars['ExportsFilePath']);
    await page.waitForTimeout(2000);
    await stepGroups.stepGroup_Headers_Verification_in_Closed_List(page, vars);
    await stepGroups.stepGroup_Verification_of_Data_from_Excel_to_UIClosed_List(page, vars);
  });
});
