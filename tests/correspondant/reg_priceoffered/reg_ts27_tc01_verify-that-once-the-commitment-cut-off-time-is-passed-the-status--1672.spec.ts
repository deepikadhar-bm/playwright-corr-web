// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { ChaseFieldNamePage } from '../../../src/pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let chaseFieldNamePage: ChaseFieldNamePage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    chaseFieldNamePage = new ChaseFieldNamePage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS27_TC01_Verify that once the commitment cut off time is passed the status with \\\"Price offered\\\" should get updated to \\\"expired\\\"', async ({ page }) => {

    vars["BidReqIdPriceOffered"] = vars["RequestIDDetails"];
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqIdPriceOffered"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["BidStatusPriceOffered"] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1.textContent() || '';
    vars["BidStatusPriceOffered"] = String(vars["BidStatusPriceOffered"]).trim();
    expect(String(vars["BidStatusPriceOffered"])).toBe("Price Offered");
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await correspondentPortalPage.Early_Close_Config.click();
    await correspondentPortalPage.Add_New_Config_Button.click();
    await correspondentPortalPage.Toggle_Date_Picker_Button.click();
    vars["CurrentDate"] = new Date().toLocaleDateString('en-US') /* format: d-M-yyyy */;
    await correspondentPortalPage.Select_Current_DateAdd_Config.click();
    vars["CurrentEstTime"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
      const fmt = "hh:mma";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    vars["CurrentEstTime"] = (() => {
      const d = new Date('2000-01-01 ' + String(vars["CurrentEstTime"]));
      d.setMinutes(d.getMinutes() + parseInt(String("3")));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mma
    })();
    vars["TimeStandard"] = String(vars["CurrentEstTime"]).slice(-2);
    vars["CurrentEstTime"] = String(vars["CurrentEstTime"]).substring(0, String(vars["CurrentEstTime"]).length - 2);
    await chaseFieldNamePage.CommitCutOffTime.fill(vars["CurrentEstTime"]);
    await correspondentPortalPage.Time_Standard_Dropdown.click();
    await correspondentPortalPage.Time_Standard_Dropdown.selectOption({ label: vars["TimeStandard"] });
    await correspondentPortalPage.Save_Config_Button.waitFor({ state: 'visible' });
    await correspondentPortalPage.Save_Config_Button.click();
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqIdPriceOffered"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    while (!(await priceOfferedPage.Status_Expired.isVisible())) {
      await page.reload();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqIdPriceOffered"]);
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    }
    vars["BidStatusPriceOffered"] = await priceOfferedPage.Bid_Status_Price_OfferedExe_Type1.textContent() || '';
    vars["BidStatusPriceOffered"] = String(vars["BidStatusPriceOffered"]).trim();
    expect(String(vars["BidStatusPriceOffered"])).toBe("Expired");
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await correspondentPortalPage.Early_Close_Config.click();
    if (true) /* Element Delete Button(Early Conf) is visible */ {
      await correspondentPortalPage.Delete_ButtonEarly_Conf.click();
      await correspondentPortalPage.Yes_Delete_ButtonEarly_config.click();
      await page.reload();
      await spinnerPage.Spinner.waitFor({ state: 'hidden' });
      await expect(page.getByText("No result")).toBeVisible();
    }
    // Write to test data profile: "RequestIDfrom27-1" = vars["BidReqIdPriceOffered"]
  });
});
