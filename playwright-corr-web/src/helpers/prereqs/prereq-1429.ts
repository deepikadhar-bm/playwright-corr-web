import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1424 } from './prereq-1424';

export async function runPrereq_1429(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1424(page, vars);

  const bidRequestsPage = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);



  await correspondentPortalPage.Commitments_Side_Menu.click();
  await correspondentPortalPage.Price_Offered_List_Dropdown.click();
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.waitFor({ state: 'visible' });
  await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await priceOfferedPage.First_bid_id.click();
  await page.waitForLoadState('networkidle');
  await expect(priceOfferedPage.Remaining_Timeprice_offered).toBeVisible();
  await correspondentPortalPage.Get_Price_Button.click();
  await page.waitForLoadState('networkidle');
  await expect(priceOfferedPage.Remaining_Timeprice_offered).toBeVisible();
  await expect(priceOfferedPage.Price_Offered_Back_Arrowprice_offered).toBeVisible();
  await priceOfferedPage.Price_Offered_Back_Arrowprice_offered.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.clear();
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
  await priceOfferedPage.First_bid_id.click();
  await page.waitForLoadState('networkidle');
  await expect(priceOfferedPage.Remaining_Timeprice_offered).toBeVisible();
}
