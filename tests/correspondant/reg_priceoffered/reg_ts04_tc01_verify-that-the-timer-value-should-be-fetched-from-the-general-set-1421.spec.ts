// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../../src/pages/correspondant/general-setting';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let generalSettingPage: GeneralSettingPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    generalSettingPage = new GeneralSettingPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS04_TC01_Verify that the timer value should be fetched from the general settings config [ Chase Users ]', async ({ page }) => {

    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await generalSettingPage.Commitment_Timer_General_Settings.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["MinutesSettings"] = await correspondentPortalPage.Internal_User_Minutes_Input.inputValue() || '';
    vars["startMin"] = (parseFloat(String(vars["MinutesSettings"])) - parseFloat(String("1"))).toFixed(0);
    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    // Write to test data profile: "RequestIDCreated4rthScenario" = vars["RequestIDDetails"]
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.First_Bid_Request_ID.click();
    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Get_Price_Button.click();
    await correspondentPortalPage.Remaining_Time_Price_Offered.waitFor({ state: 'visible' });
    vars["RemainingTime"] = await correspondentPortalPage.Remaining_Time_Price_Offered.textContent() || '';
    vars["RemainingTime"] = String(vars["RemainingTime"]).trim();
    vars["MinSettings"] = vars["MinutesSettings"];
    vars["startMin"] = (parseFloat(String(vars["MinSettings"])) - parseFloat(String("1"))).toFixed(0);
    vars["MinTimePriceOffered"] = String(vars["RemainingTime"]).split(":")["1"] || '';
    vars["ExpectedMinTime"] = String(vars["MinSettings"]) + String("m");
    vars["ExpectedMinTimeMinus1"] = String(vars["startMin"]) + String("m");
    vars["SecondsTimePriceOffered"] = String(vars["RemainingTime"]).split(":")["2"] || '';
    vars["FirstDigitSeconds"] = String(vars["SecondsTimePriceOffered"]).substring(0, String(vars["SecondsTimePriceOffered"]).length - 2);
    vars["SecondDigitSeconds"] = String(vars["SecondsTimePriceOffered"]).substring(1, String(vars["SecondsTimePriceOffered"]).length - 1);
    vars["CharSeconds"] = String(vars["SecondsTimePriceOffered"]).substring(2);
    if (String(vars["MinTimePriceOffered"]) === String(vars["ExpectedMinTime"])) {
      expect(String(vars["FirstDigitSeconds"])).toBe("0");
      expect(String(vars["SecondDigitSeconds"])).toBe("0");
    } else {
      expect(String(vars["MinTimePriceOffered"])).toBe(vars["ExpectedMinTimeMinus1"]);
      expect(String(vars["FirstDigitSeconds"])).toBe("5");
    }
    expect(String(vars["RemainingTime"])).toMatch(/^\d+m:\d{2}s$/);
  });
});
