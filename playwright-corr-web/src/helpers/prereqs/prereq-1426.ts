import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../pages/correspondant/general-setting';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1421 } from './prereq-1421';

export async function runPrereq_1426(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1421(page, vars);

  const bidRequestsPage = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const generalSettingPage = new GeneralSettingPage(page);
  const spinnerPage = new SpinnerPage(page);



  await correspondentPortalPage.Administration_Menu.click();
  await correspondentPortalPage.GeneralSettings_Menu.click();
  await generalSettingPage.Commitment_Timer_General_Settings.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  vars["MinutesSettings"] = await correspondentPortalPage.Internal_User_Minutes_Input.inputValue() || '';
  vars["NewMinToEnter"] = String(Math.floor(Math.random() * (4 - 1 + 1)) + 1);
  while (String(vars["NewMinToEnter"]) === String(vars["MinutesSettings"])) {
    vars["NewMinToEnter"] = String(Math.floor(Math.random() * (4 - 1 + 1)) + 1);
  }
  await correspondentPortalPage.Internal_User_Minutes_Input.clear();
  await correspondentPortalPage.Internal_User_Minutes_Input.fill(vars["NewMinToEnter"]);
  vars["MinutesSettings"] = await correspondentPortalPage.Internal_User_Minutes_Input.inputValue() || '';
  await correspondentPortalPage.Save_Changes_Button.waitFor({ state: 'visible' });
  await correspondentPortalPage.Save_Changes_Button.click();
  await page.waitForLoadState('networkidle');
  vars["startMin"] = (parseFloat(String(vars["MinutesSettings"])) - parseFloat(String("1"))).toFixed(0);
  await correspondentPortalPage.Commitments_Side_Menu.click();
  await correspondentPortalPage.Price_Offered_List_Dropdown.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
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
}
