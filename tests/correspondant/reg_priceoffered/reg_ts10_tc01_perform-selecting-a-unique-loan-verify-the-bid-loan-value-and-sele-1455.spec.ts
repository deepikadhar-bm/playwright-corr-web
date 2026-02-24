// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1394 } from '../../../src/helpers/prereqs/prereq-1394';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1394(page, vars);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS10_TC01_Perform selecting a unique loan Verify the bid, loan value, and selected loan count displayed in the Commit Selected Loans popup', async ({ page }) => {

    await correspondentPortalPage.Commitments_Side_Menu.click();
    await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    vars["PriceOfferedBidReqId"] = vars["RequestIDDetails"];
    vars["PriceOfferedBidReqId"] = String(vars["PriceOfferedBidReqId"]).trim();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.click();
    await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill(vars["PriceOfferedBidReqId"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await priceOfferedPage.Price_Offered_Bid_Req_Id.click();
    await page.waitForLoadState('networkidle');
    await priceOfferedPage.Check_UncommittedLoanNum1.check();
    vars["UncommittedLoanNum1"] = await priceOfferedPage.Uncommitted_LoanNum1.textContent() || '';
    await priceOfferedPage.Check_Uncommitted_LoanNum2.check();
    vars["UncommittedLoanNum2"] = await correspondentPortalPage.Uncommited_LoanNum2.textContent() || '';
    vars["CheckedRowsCount"] = String(await priceOfferedPage.Checked_Row.count());
    vars["LoanAmount1"] = await priceOfferedPage.Loan_Amount1AllLoans.textContent() || '';
    vars["LoanAmount2"] = await priceOfferedPage.Loan_Amount2AllLoans.textContent() || '';
    vars["TotalLoanAmountSelectedBids"] = (parseFloat(String(vars["LoanAmount1"])) + parseFloat(String(vars["LoanAmount2"]))).toFixed(0);
    await priceOfferedPage.Get_Price_Button.click();
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    vars["OpenAuthLimitBeforeCommitted"] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
    vars["OpenAuthLimitBeforeCommitted"] = String('').split("(")["0"] || '';
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    vars["BidreqIDPopup"] = await priceOfferedPage.BidRequestIdPopup.textContent() || '';
    vars["LoanValuePopup"] = await priceOfferedPage.Loan_ValuePopup.textContent() || '';
    vars["LoanValuePopup"] = String(vars["LoanValuePopup"]).replace(/\$\,/g, '');
    vars["SelectedLoansCountPopup"] = await priceOfferedPage.Selected_LoansPopup.textContent() || '';
    vars["SelectedLoansCountPopup"] = String(vars["SelectedLoansCountPopup"]).trim();
    expect(String(vars["BidreqIDPopup"])).toBe(vars["PriceOfferedBidReqId"]);
    expect(String(vars["LoanValuePopup"])).toBe(vars["TotalLoanAmountSelectedBids"]);
    expect(String(vars["SelectedLoansCountPopup"])).toBe(vars["CheckedRowsCount"]);
    await priceOfferedPage.Yes_Commit_ButtonPopup.click();
    vars["space"] = "key_blank";
    vars["DateAndTimeFormatCurrent"] = "M/d/yy" + vars["space"] + "h:mm a";
    vars["BidCommittedDateAndTime"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
      const fmt = "DateAndTimeFormatCurrent";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
    vars["CommitmentUniqueNumPopup"] = await priceOfferedPage.Commitment_ID.textContent() || '';
    vars["CommitmentUniqueNumPopup"] = String(vars["CommitmentUniqueNumPopup"]).length.toString();
    expect(String(vars["CommitmentUniqueNumPopup"])).toBe("8");
    await priceOfferedPage.Okay_ButtonPopup.click();
    await page.waitForLoadState('networkidle');
    await priceOfferedPage.All_Loans_PriceofferedPage.click();
    vars["count"] = "1";
    vars["CountOfCommittedLoans"] = String(await priceOfferedPage.CommittedLoansCount.count());
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountOfCommittedLoans"]))) {
      for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
        await expect(priceOfferedPage.CommittedLoan_Locked_Icon).toBeVisible();
        vars["LockedLoanCommitOrder"] = await priceOfferedPage.Locked_Loan_CommitOrder.textContent() || '';
        // Write to test data profile: "CommitOrder" = vars["LockedLoanCommitOrder"]
        vars["CorrLoan(table)"] = await priceOfferedPage.Corr_Loan_price_offered_table.textContent() || '';
        // Write to test data profile: "Corr Loan" = vars["CorrLoan(table)"]
        vars["LastName(table)"] = await priceOfferedPage.Last_Nameprice_offered_table.textContent() || '';
        // Write to test data profile: "Last Name" = vars["LastName(table)"]
        vars["LoanAmount(table)"] = await priceOfferedPage.Loan_Amountprice_offered_table.textContent() || '';
        // Write to test data profile: "Loan Amount" = vars["LoanAmount(table)"]
        vars["IntRate(table)"] = await priceOfferedPage.Int_Rateprice_offered_table.textContent() || '';
        // Write to test data profile: "Int Rate" = vars["IntRate(table)"]
        vars["RefSecProd(table)"] = await priceOfferedPage.Ref_Sec_Prodprice_offered_table.textContent() || '';
        // Write to test data profile: "Ref Sec Prod" = vars["RefSecProd(table)"]
        vars["RefSecPrice(table)"] = await priceOfferedPage.Ref_Sec_Priceprice_offered_table.textContent() || '';
        // Write to test data profile: "Ref Sec Price" = vars["RefSecPrice(table)"]
        vars["GrossPrice(table)"] = await priceOfferedPage.Gross_Priceprice_offered_table.textContent() || '';
        // Write to test data profile: "Gross Price" = vars["GrossPrice(table)"]
        vars["HedgeRatio(table)"] = await priceOfferedPage.Hedge_Ratioprice_offered_table.textContent() || '';
        // Write to test data profile: "Hedge Ratio" = vars["HedgeRatio(table)"]
        vars["MarkAdj(table)"] = await priceOfferedPage.Mark_Adjprice_offered_table.textContent() || '';
        // Write to test data profile: "Mark Adj" = vars["MarkAdj(table)"]
        vars["CurrGross(table)"] = await priceOfferedPage.Curr_Grossprice_offered_table.textContent() || '';
        // Write to test data profile: "Curr Gross" = vars["CurrGross(table)"]
      }
      vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    }
    vars["OpenAuthLimitAllLoans"] = await priceOfferedPage.Open_Auth_Limit.textContent() || '';
    vars["ActualOpenAuthLimit"] = String('').split("(")["0"] || '';
    vars["ActualOpenAuthLimit"] = String(vars["ActualOpenAuthLimit"]).replace(/\$\,/g, '');
    vars["ActualOpenAuthLimit"] = String(vars["ActualOpenAuthLimit"]).trim();
    vars["ActualAuthLimit"] = await priceOfferedPage.Auth_Limit.textContent() || '';
    vars["ExpectedOpenAuthLimit"] = (parseFloat(String(vars["OpenAuthLimitBeforeCommitted"])) - parseFloat(String(vars["TotalLoanAmountSelectedBids"]))).toFixed(0);
    vars["ActualOpenAuthLimitPercentage"] = String('').split("(")["1"] || '';
    vars["ActualOpenAuthLimitPercentage"] = String(vars["ActualOpenAuthLimitPercentage"]).replace(/\)%/g, '');
    vars["ExpectedOpenAuthLimitPercentage"] = (parseFloat(String(vars["ActualOpenAuthLimit"])) / parseFloat(String(vars["ActualAuthLimit"]))).toFixed(4);
    vars["ExpectedOpenAuthLimitPercentage"] = (parseFloat(String(vars["ExpectedOpenAuthLimitPercentage"])) * parseFloat(String("100"))).toFixed(2);
    vars["LastCommittedBid"] = await priceOfferedPage.Last_Committed_Bid.textContent() || '';
    vars["LastCommittedBidTimeAndDate"] = String('').split("|")["0"] || '';
    vars["LastCommittedBidTimeAndDate"] = String(vars["LastCommittedBidTimeAndDate"]).trim();
    vars["LastCommittedBidLoanLoanAmount"] = await priceOfferedPage.Last_Committed_Bid_LoanAmount.textContent() || '';
    vars["LastCommittedBidLoanLoanAmount"] = String(vars["LastCommittedBidLoanLoanAmount"]).substring(3);
    vars["LastCommittedBidLoanLoanAmount"] = String(vars["LastCommittedBidLoanLoanAmount"]).replace(/\$\,/g, '');
    await priceOfferedPage.LockedCommitted_Loans_2.click();
    await page.waitForLoadState('networkidle');
    await expect(priceOfferedPage.Paste_Loans_ButtonPrice_Offered_Page).toBeVisible();
    await expect(priceOfferedPage.Commit_Selected_1_Dropdown).toBeVisible();
  });
});
