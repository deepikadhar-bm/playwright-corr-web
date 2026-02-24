import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1423 } from './prereq-1423';

export async function runPrereq_1424(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1423(page, vars);

  const bidRequestsPage = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);



  await expect(correspondentPortalPage.Commitments_Side_Menu).toBeVisible();
  await correspondentPortalPage.Commitments_Side_Menu.click();
  await correspondentPortalPage.Price_Offered_List_Dropdown.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await priceOfferedPage.First_bid_id.click();
  await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.waitFor({ state: 'visible' });
  await correspondentPortalPage.Get_Price_Button.click();
  await priceOfferedPage.Remaining_Timeprice_offered.waitFor({ state: 'visible' });
  await expect(priceOfferedPage.First_Check_Boxprice_offered_screen).toBeVisible();
  await priceOfferedPage.First_Check_Boxprice_offered_screen.check();
  await expect(priceOfferedPage.First_Check_Boxprice_offered_screen).toBeVisible();
  await expect(priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered).toBeVisible();
  await expect(priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered).toBeVisible();
  await priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered.click();
  await priceOfferedPage.Commit_Selected_Loanspopupprice_offered_screen.waitFor({ state: 'visible' });
  await expect(priceOfferedPage.Commit_Selected_Loanspopupprice_offered_screen).toContainText("Commit Selected Loans");
  await expect(page.getByText("Selecting “Yes, Commit” is confirmation of entering a Mandatory Commitment along with the pair-off risks associated with not meeting the conditions of the commitment.")).toBeVisible();
  await priceOfferedPage.Yes_Commit_Buttonpopup_price_offered_screen.click();
  await priceOfferedPage.Commit_Selected_Loans2popup_price_offered_screen.waitFor({ state: 'visible' });
  await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.waitFor({ state: 'visible' });
  await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.click();
  await expect(priceOfferedPage.Remaining_Timeprice_offered).toBeVisible();
  await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
  await priceOfferedPage.Second_Check_Boxprice_offered_screen.waitFor({ state: 'visible' });
  await expect(priceOfferedPage.Second_Check_Boxprice_offered_screen).toBeVisible();
  await priceOfferedPage.Second_Check_Boxprice_offered_screen.check();
  await expect(priceOfferedPage.Second_Check_Boxprice_offered_screen).toBeVisible();
  await expect(priceOfferedPage.Commit_Selected_Button_Disabledprice_offered).toBeVisible();
}
