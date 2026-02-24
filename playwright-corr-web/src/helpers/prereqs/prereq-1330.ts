import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as stepGroups from '../step-groups';
import { BidRequestPage } from '../../pages/correspondant/bid-request';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../pages/correspondant/spinner';

export async function runPrereq_1330(page: Page, vars: Record<string, string>): Promise<void> {
  const bidRequestPage = new BidRequestPage(page);
  const bidRequestsPage = new BidRequestsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const spinnerPage = new SpinnerPage(page);


  await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
  await expect(correspondentPortalPage.Bid_Requestsside_bar_menu).toBeVisible();
  await correspondentPortalPage.Bid_Requestsside_bar_menu.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(page.getByText("Bid Requests")).toBeVisible();
  await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill("878");
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  // [DISABLED] Verify that the elements with locator All Bid Requests(Bid Requests) displays text 878 and With Scrollable TRUE
  // await expect(bidRequestsPage.All_Bid_RequestsBid_Requests).toContainText("878");
  vars["TotalCount"] = String(await bidRequestsPage.All_Bid_RequestsBid_Requests.count());
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalCount"]))) {
    await expect(bidRequestPage.All_Bid_Requests2Bid_Requests).toHaveAttribute('aria-label', "878");
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
  vars["count"] = "1";
  if (true) /* Element Navigate To Page is visible */ {
    await bidRequestsPage.Navigate_to_Next.click();
    await expect(bidRequestsPage.Navigate_To_Page).toContainText("Page 2");
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalCount"]))) {
      await expect(bidRequestPage.All_Bid_Requests2Bid_Requests).toHaveAttribute('aria-label', "878");
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
  }
}
