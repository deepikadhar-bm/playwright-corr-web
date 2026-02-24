import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1748 } from './prereq-1748';

export async function runPrereq_1746(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1748(page, vars);

  const bidRequestsPage = new BidRequestsPage(page);
  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);



  const testData: Record<string, string> = {
  "RequestIDFromPRE_PR_1-1": "87YTD25F4356",
  "Requestidfrom4-2": "873O84593BB5",
  "RequestIdfrom6-1.1": "57HK54C5AE2A",
  "RequestIDfrom14-1": "876U855F6483",
  "CommitmentIdfrom8-8": "87JU2DDD",
  "RequestIdFrom5-1": "876YA587E147",
  "RequestIdFrom5-5": "87CKA7D37EB6",
  "RequestIdFrom6-4": "87MWF9C278BC",
  "CommitmentIDfrom8-10": "87JU2DDD",
  "RequestIdFrom8-8": "87BI08DD054F"
}; // Profile: "Commitment List", row: 0

  await correspondentPortalPage.Commitments_Side_Menu.click();
  await correspondentPortalPage.Price_Offered_List_Dropdown.click();
  vars["BidReqId"] = testData["RequestIDFromPRE_PR_1-1"];
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqId"]);
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await priceOfferedPage.BidRequestIDPrice_Offered_New.click();
  await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.waitFor({ state: 'visible' });
  await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.check();
  await priceOfferedPage.Get_Price_Button.click();
  await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
  await priceOfferedPage.Commit_Selected_1_Dropdown.click();
  await priceOfferedPage.Yes_Commit_ButtonPopup.click();
  await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
  vars["CommittedTime"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
    const fmt = "hh:mm a";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["CommitmentIDPriceOffered"] = await priceOfferedPage.Commitment_IdPrice_Offered.textContent() || '';
  await priceOfferedPage.Okay_ButtonPopup.click();
  await correspondentPortalPage.Commitments_Side_Menu.click();
  await commitmentListPage.Committed_List_Dropdown.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await priceOfferedPage.Search_Dropdown.click();
  await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
  await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await expect(page.getByText(vars["CommitmentIDPriceOffered"])).toBeVisible();
  vars["TotalCommitmentIDs"] = String(await commitmentListPage.Commitment_IDCommitment_List_Page.count());
  await expect(commitmentListPage.Commitment_ID_Same_Loan_Num).toBeVisible();
  expect(String(vars["TotalCommitmentIDs"])).toBe("1");
  // Write to test data profile: "Requestidfrom4-2" = vars["BidReqId"]
}
