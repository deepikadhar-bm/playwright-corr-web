import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1394 } from './prereq-1394';

export async function runPrereq_1738(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1394(page, vars);

  const bidRequestsPage = new BidRequestsPage(page);
  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);



  vars["CurrentEstDate"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "MM/dd/yyyy";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["DatePriceOfferedScreen"] = vars["CurrentEstDate"];
  await correspondentPortalPage.Commitments_Side_Menu.click();
  await correspondentPortalPage.Price_Offered_List_Dropdown.click();
  vars["BidReqId"] = vars["RequestIDDetails"];
  // Write to test data profile: "RequestIDFromPRE_PR_1-1" = vars["BidReqId"]
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.click();
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqId"]);
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await priceOfferedPage.BidRequestIDPrice_Offered_New.click();
  await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.waitFor({ state: 'visible' });
  await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.check();
  vars["CommittedCorrLoan"] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
  await priceOfferedPage.Get_Price_Button.waitFor({ state: 'visible' });
  await priceOfferedPage.Get_Price_Button.click();
  await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
  await priceOfferedPage.Commit_Selected_1_Dropdown.click();
  await priceOfferedPage.Yes_Commit_ButtonPopup.click();
  vars["ExpectedCommitDate"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
    const fmt = "MM/dd/yyyy";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["CommitTimePriceOffered"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
    const fmt = "h:mm a";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  await priceOfferedPage.Yes_Commit_ButtonPopup.waitFor({ state: 'hidden' });
  await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
  vars["CommitmentIDPriceOffered"] = await priceOfferedPage.Commitment_IdPrice_Offered.textContent() || '';
  vars["CommitmentIDPriceOffered"] = String(vars["CommitmentIDPriceOffered"]).trim();
  await priceOfferedPage.Okay_ButtonPopup.click();
  vars["LockedLoansCount"] = await priceOfferedPage.Locked_Loans_Count.textContent() || '';
  vars["CommitmentOrderPriceOffered"] = await priceOfferedPage.Commitment_OrderPrice_Offred.textContent() || '';
  vars["MaraketValuePriceOffered"] = await priceOfferedPage.Current_Marketprice_offered.textContent() || '';
  vars["LockedLoanAmountPriceOffered"] = await priceOfferedPage.Locked_Loan_AmountPrice_Offered.textContent() || '';
  await priceOfferedPage.BackTo_PriceofferedPage.click();
  vars["CompanyCCodePriceOfferedScreen"] = await priceOfferedPage.Company_CCodePrice_Offered_Screen.textContent() || '';
  vars["CompanyNamePriceOfferedScreen"] = await priceOfferedPage.Company_NamePrice_Offered_Screen.textContent() || '';
  // [DISABLED] Store text from the element Date(Price Offered Screen) into a variable DatePriceOfferedScreen
  // vars["DatePriceOfferedScreen"] = await priceOfferedPage.DatePrice_Offered_Screen.textContent() || '';
  vars["ExecutionTypePriceOfferedScreen"] = await priceOfferedPage.Execution_TypePrice_Offered_Screen.textContent() || '';
  vars["StatusPriceOfferedScreen"] = await priceOfferedPage.StatusPrice_Offered_Screen.textContent() || '';
  vars["DateAfterAdding3Days"] = (() => {
    const d = new Date(String(vars["DatePriceOfferedScreen"]));
    d.setDate(d.getDate() + parseInt(String("3")));
    const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
    return "MM/dd/yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
  })();
  vars[""] = new Date(String("DayAfter3Days")).toLocaleDateString('en-US', { weekday: 'long' });
  if (String(vars["DayAfter3Days"]) === String("Saturday")) {
    vars["ExpectedExpirationDate"] = (() => {
      const d = new Date(String(vars["DateAfterAdding3Days"]));
      d.setDate(d.getDate() + parseInt(String("2")));
      const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
      return "MM/dd/yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
    })();
  } else if (String(vars["DayAfter3Days"]) === String("Sunday")) {
    vars["ExpectedExpirationDate"] = (() => {
      const d = new Date(String(vars["DateAfterAdding3Days"]));
      d.setDate(d.getDate() + parseInt(String("1")));
      const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
      return "MM/dd/yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
    })();
  } else {
    vars["ExpectedExpirationDate"] = (() => {
      const d = new Date(String(vars["DateAfterAdding3Days"]));
      d.setDate(d.getDate() + parseInt(String("0")));
      const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
      return "MM/dd/yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
    })();
  }
  await correspondentPortalPage.Commitments_Side_Menu.click();
  await commitmentListPage.Committed_List_Dropdown.click();
  await priceOfferedPage.Search_Dropdown.click();
  await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
  vars["BidRequestIdPriceOffered"] = vars["BidReqId"];
  await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
  vars["CCodeInCommitmentList"] = await priceOfferedPage.CCode_In_Commitment_List.textContent() || '';
  vars["CommitmentIdInCommitmentList"] = await priceOfferedPage.Commitment_IDCommitment_List.textContent() || '';
  vars["CompanyInCommitmentList"] = await priceOfferedPage.Company_In_Commitment_List.textContent() || '';
  vars["CommAmountCommitmentList"] = await priceOfferedPage.Comm_AmountCommitment_List.textContent() || '';
  vars["CommLoansCommitmentList"] = await priceOfferedPage.CommLoans_Commitment_List.textContent() || '';
  vars["CommittedDateCommitmentList"] = await priceOfferedPage.Committed_DateCommitment_List.textContent() || '';
  vars["ExpirationDateCommitmentList"] = await priceOfferedPage.Expiration_DateCommitment_List.textContent() || '';
  vars["ExecutionTypeCommitmentList"] = await priceOfferedPage.Execution_TypeCommitment_List.textContent() || '';
  vars["AmountDeliveredCommitmentList"] = await priceOfferedPage.Amount_DeliveredCommitment_List.textContent() || '';
  vars["AmountFundedCommitmentList"] = await priceOfferedPage.Amount_FundedCommitment_List.textContent() || '';
  vars["AmountPairedOffCommitmentList"] = await priceOfferedPage.Amount_Paired_OffCommitment_List.textContent() || '';
  expect(String(vars["CompanyCCodePriceOfferedScreen"])).toBe(vars["CCodeInCommitmentList"]);
  expect(String(vars["CommitmentIDPriceOffered"])).toBe(vars["CommitmentIdInCommitmentList"]);
  await expect(commitmentListPage.First_Bid_Req_IDCommitment_List).toContainText(vars["BidRequestIdPriceOffered"]);
  expect(String(vars["CompanyNamePriceOfferedScreen"])).toBe(vars["CompanyInCommitmentList"]);
  expect(String(vars["LockedLoanAmountPriceOffered"])).toBe(vars["CommAmountCommitmentList"]);
  expect(String(vars["LockedLoansCount"])).toBe(vars["CommLoansCommitmentList"]);
  expect(String(vars["ExpectedCommitDate"])).toBe(vars["CommittedDateCommitmentList"]);
  expect(String(vars["ExecutionTypePriceOfferedScreen"])).toBe(vars["ExecutionTypeCommitmentList"]);
  expect(String("$0")).toBe(vars["AmountDeliveredCommitmentList"]);
  expect(String("$0")).toBe(vars["AmountFundedCommitmentList"]);
  expect(String("$0")).toBe(vars["AmountPairedOffCommitmentList"]);
  expect(String(vars["ExpectedExpirationDate"])).toBe(vars["ExpirationDateCommitmentList"]);
}
