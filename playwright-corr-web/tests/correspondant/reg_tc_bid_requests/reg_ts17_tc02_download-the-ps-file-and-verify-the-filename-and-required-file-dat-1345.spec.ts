// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequest2Page } from '../../../src/pages/correspondant/bid-request-2';
import { BidrequestPage } from '../../../src/pages/correspondant/bidrequest';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as fileHelper from '../../../src/helpers/file-helpers';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequest2Page: BidRequest2Page;
  let bidrequestPage: BidrequestPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequest2Page = new BidRequest2Page(page);
    bidrequestPage = new BidrequestPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS17_TC02_Download the PS file and verify the filename and required file data.', async ({ page }) => {
    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.Heading_Bid_Requests).toBeVisible();
    vars["Count"] = "1";
    vars["RowsCountBidList"] = String(await bidRequestPage.LoansErrorsCount.count());
    while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["RowsCountBidList"]))) {
      vars["StatusOfBidRequestID"] = await bidrequestPage.StatusOfBidRequestID.textContent() || '';
      if (String(vars["StatusOfBidRequestID"]).includes(String("Committed"))) {
        vars["Count"] = (parseFloat(String(vars["Count"])) + parseFloat(String("1"))).toFixed(0);
      } else {
        vars["Loans&Errors"] = await bidRequestPage.LoansErrors.textContent() || '';
        vars["loans"] = String(vars["Loans&Errors"]).split("/")["1"] || '';
        vars["Errors"] = String(vars["Loans&Errors"]).split("/")["2"] || '';
        if (String(vars["loans"]) > String(vars["Errors"])) {
          await bidrequestPage.BidRequestID.click();
          break;
        } else {
          vars["Count"] = (parseFloat(String(vars["Count"])) + parseFloat(String("1"))).toFixed(0);
        }
      }
    }
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(correspondentPortalPage.Heading_Bid_Request_Details).toBeVisible();
    vars["Rows"] = "1";
    vars["LoanStatusCountDetails"] = String(await bidRequestPage.LoanstatusCount.count());
    while (parseFloat(String(vars["Rows"])) <= parseFloat(String(vars["LoanStatusCountDetails"]))) {
      vars["LoanStatusText"] = await bidRequest2Page.LoanStatusText.textContent() || '';
      if (String(vars["LoanStatusText"]) === String("Success")) {
        vars["LoanName"] = await bidRequestPage.Corr_LoanName.textContent() || '';
        vars["LoanAmount"] = await bidRequestPage.LoanAmount.textContent() || '';
        await bidrequestPage.PS_in_Corr_Loan.click();
        break;
      } else {
        vars["Rows"] = (parseFloat(String(vars["Rows"])) + parseFloat(String("1"))).toFixed(0);
      }
    }
    // [DISABLED] Wait until all files are download in all browsers
    // await page.waitForTimeout(3000); // Wait for download to complete
    // Wait for download - handled by Playwright download events
    await page.waitForTimeout(2000);
    vars[""] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
    expect(String(vars["JsonFile"])).toBe(vars["LoanName"]);
    vars["LoanName"] = String('') + String('');
    expect(String(vars["JsonFile"])).toBe(vars["FileName"]);
    vars["JsonFilePath"] = vars['_lastDownloadPath'] || '';
    vars[""] = fileHelper.readJsonValue('', "");
    vars["LoanAmount"] = String(vars["LoanAmount"]).substring(2, String(vars["LoanAmount"]).length - 1);
    vars["Loan"] = String(vars["LoanAmount"]).split(",")["1"] || '';
    vars["Amount"] = String(vars["LoanAmount"]).split(",")["2"] || '';
    vars["Amount"] = String('') + String('');
    expect(String(vars["DataFromJsonFile"])).toBe(vars["LoanAmount"]);
  });
});
