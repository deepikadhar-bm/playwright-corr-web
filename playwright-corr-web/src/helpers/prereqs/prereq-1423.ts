import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { GeneralSettingPage } from '../../pages/correspondant/general-setting';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1426 } from './prereq-1426';

export async function runPrereq_1423(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1426(page, vars);

  const bidRequestsPage = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const generalSettingPage = new GeneralSettingPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);



  await correspondentPortalPage.Administration_Menu.click();
  await generalSettingPage.General_Settings.click();
  await generalSettingPage.Commitment_Timer_General_Settings.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await stepGroups.stepGroup_Editing_the_Chase_Users_Time_Under_General_Settings(page, vars);
  vars["ExtractedTimeFromChaseUserBox"] = await priceOfferedPage.Chase_Usercommitment_timer.inputValue() || '';
  await correspondentPortalPage.Save_Changes_Button.waitFor({ state: 'visible' });
  await page.waitForLoadState('networkidle');
  await correspondentPortalPage.Save_Changes_Button.click();
  await correspondentPortalPage.Commitments_Side_Menu.click();
  await correspondentPortalPage.Price_Offered_List_Dropdown.click();
  await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await priceOfferedPage.First_bid_id.click();
  await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.waitFor({ state: 'visible' });
  await expect(priceOfferedPage.Remaining_Timeprice_offered).toBeVisible();
  await correspondentPortalPage.Get_Price_Button.click();
  await priceOfferedPage.First_Check_Boxprice_offered_screen.waitFor({ state: 'visible' });
  await expect(priceOfferedPage.Remaining_Timeprice_offered).toBeVisible();
  await expect(priceOfferedPage.Remaining_Timeprice_offered).toContainText("Remaining Time");
  vars["ExtractedTimeFromTimer"] = await priceOfferedPage.Text_from_Remaining_Timeprice_offered.textContent() || '';
  vars["WaitingTimeInterval"] = (parseFloat(String("60")) * parseFloat(String(vars["ExtractedTimeFromChaseUserBox"]))).toFixed(0);
  await page.waitForTimeout(parseInt(vars["WaitingTimeInterval"]) * 1000);
  await expect(priceOfferedPage.Remaining_Timeprice_offered).toBeVisible();
  await expect(priceOfferedPage.First_Check_Boxprice_offered_screen).toBeVisible();
  await priceOfferedPage.First_Check_Boxprice_offered_screen.click();
  await priceOfferedPage.First_Check_Boxprice_offered_screen.check();
  await expect(priceOfferedPage.First_Check_Boxprice_offered_screen).toBeVisible();
  await expect(priceOfferedPage.Commit_Selected_Button_Disabledprice_offered).toBeVisible();
}
