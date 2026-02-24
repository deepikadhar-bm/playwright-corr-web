// [PREREQ-APPLIED]
// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1909 } from '../../../src/helpers/prereqs/prereq-1909';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1909(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS14_TC02_Perform add to commit action and verify that latest commitment letter should be displayed with the latest value', async ({ page }) => {

    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    if (true) /* Element Search Cancel Button is visible */ {
      await commitmentListPage.Search_Cancel_Button.click();
    }
    await priceOfferedPage.Search_Dropdown.click();
    await priceOfferedPage.Search_Dropdown.fill(vars["BidReqId"]);
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.waitFor({ state: 'visible' });
    await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
    await priceOfferedPage.Commitment_IDCommitment_List_Page_New.waitFor({ state: 'visible' });
    await priceOfferedPage.Commitment_IDCommitment_List_Page_New.click();
    await commitmentListPage.Total_LoansCommitment_List.waitFor({ state: 'visible' });
    vars["CommitID"] = await priceOfferedPage.Commit_IDCommitment_List.textContent() || '';
    await commitmentListPage.Total_LoansCommitment_List.click();
    await bidRequestDetailsPage.Last_Name_Sort_Button.waitFor({ state: 'visible' });
    await bidRequestDetailsPage.Last_Name_Sort_Button.click();
    await priceOfferedPage.Last_Name_Down_ArrowDetails.waitFor({ state: 'visible' });
    await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.check();
    await expect(priceOfferedPage.Check_Bid_Loan_NumChase_Exe).toBeVisible();
    vars["CommittedCorrLoan"] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
    await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
    await priceOfferedPage.Commit_Selected_1_Dropdown.click();
    await correspondentPortalPage.Commitment_OrderCommitment_List.click();
    await correspondentPortalPage.Yes_Commit_Button.click();
    vars["CurrentEstTime"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
      const fmt = "hh:mm a";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    vars["CommittedDateUI1"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
      const fmt = "MM-dd-yyyy";
      // Map Java date format to Intl parts
      const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
      return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    })();
    vars["ActualCurrentEstTime"] = (() => {
      const d = new Date(String(vars["CurrentEstTime"]));
      const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
      return "hh:mm".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
    })();
    vars[""] = String(vars["ActualCurrentEstTime"]).replace(/ActualCurrentEstTime/g, "");
    vars["CurrentEstTimePlusOneMin"] = (() => {
      const d = new Date('2000-01-01 ' + String(vars["CurrentEstTime"]));
      d.setMinutes(d.getMinutes() + parseInt(String("1")));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm
    })();
    vars[""] = String(vars["CurrentEstTimePlusOneMin"]).replace(/CurrentEstTimePlusOneMin/g, "");
    vars[""] = (() => {
      const d = new Date('2000-01-01 ' + String(''));
      d.setMinutes(d.getMinutes() - parseInt(String('')));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    })();
    vars["CurrentEstTimeMinusOneMin"] = (() => {
      const d = new Date(String(vars["CurrentEstTimeMinusOneMin"]));
      const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
      return "hh:mm".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
    })();
    vars[""] = String(vars["CurrentEstTimeMinusOneMin"]).replace(/CurrentEstTimeMinusOneMin/g, "");
    await page.waitForTimeout(60000);
    if (true) /* Element Okay Button1 is visible */ {
      await correspondentPortalPage.Okay_Button1.click();
    }
    await page.reload();
    await commitmentListPage.Total_Committed_Loans_Tab.waitFor({ state: 'visible' });
    await commitmentListPage.Total_Committed_Loans_Tab.click();
    await priceOfferedPage.Committed_CorrLoan.waitFor({ state: 'visible' });
    await expect(priceOfferedPage.Committed_CorrLoan).toBeVisible();
    vars["ProductNameUI"] = await priceOfferedPage.Product_NameDetails.textContent() || '';
    vars["RefSecCouponUI"] = await priceOfferedPage.Ref_Sec_CouponDetails.textContent() || '';
    vars["CurrentMarketValueUI"] = await commitmentListPage.Current_Market_ValueCommitment_List.textContent() || '';
    await priceOfferedPage.Back_To_Commitment_List.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["CCodeUI"] = await priceOfferedPage.CCode_In_Commitment_List.textContent() || '';
    vars["CommitmentIdUI"] = await priceOfferedPage.Commitment_IDCommitment_List.textContent() || '';
    vars["CommitmentIdUI"] = String(vars["CommitmentIdUI"]).trim();
    vars["CompanyNameUI"] = await priceOfferedPage.Company_In_Commitment_List.textContent() || '';
    vars["CompanyNameUI"] = String(vars["CompanyNameUI"]).trim();
    vars["CompanyNameUI"] = await priceOfferedPage.Company_In_Commitment_List.textContent() || '';
    vars["CommitmentLoanAmountUI"] = await priceOfferedPage.Comm_AmountCommitment_List.textContent() || '';
    vars["CommittedLoansUI"] = await priceOfferedPage.CommLoans_Commitment_List.textContent() || '';
    vars["CommittedDateUI"] = await priceOfferedPage.Committed_DateCommitment_List.textContent() || '';
    vars["ExpiredDateUI"] = await priceOfferedPage.Expiration_DateCommitment_List.textContent() || '';
    vars["ExecutionTypeUI"] = await priceOfferedPage.Execution_TypeCommitment_List.textContent() || '';
    vars["AllCoverLetterDetailsUI"] = String(vars["CommitmentIdUI"]) + ";" + String(vars["CommittedDateUI"]);
    vars["AllCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]) + ";" + String(vars["ProductNameUI"]);
    vars["AllCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]) + ";" + String(vars["CommitmentLoanAmountUI"]);
    vars["AllCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]) + ";" + String(vars["ExpiredDateUI"]);
    vars["AllCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]) + ";" + String(vars["RefSecCouponUI"]);
    vars["AllCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]) + ";" + String(vars["CommittedLoansUI"]);
    vars["AllCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]) + ";" + String(vars["BidReqId"]);
    vars["AllCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]) + ";" + String(vars["ReferenceMonth"]);
    vars["AllCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]) + ";" + String(vars["ExecutionTypeUI"]);
    vars["AllCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]) + ";" + String(vars["CurrentMarketValueUI"]);
    vars["count"] = "1";
    for (let dataIdx = parseInt(vars["count"]); dataIdx <= 11; dataIdx++) {
      vars["IndividualCoverLetterDetailsUI"] = String(vars["AllCoverLetterDetailsUI"]).split(";")[parseInt(String(vars["count"]))] || '';
      vars["IndividualCoverLetterDetailsUI"] = String(vars["IndividualCoverLetterDetailsUI"]).trim();
      // Write to test data profile: "ChaseInfo" = vars["IndividualCoverLetterDetailsUI"]
      vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
    }
    vars["space"] = "key_blank";
    vars["CompanyNameWithCCodeUI"] = vars["CompanyNameUI"] + "-" + "(" + vars["CCodeUI"] + ")";
    vars["CompanyNameWithCCodeUI"] = String(vars["CompanyNameWithCCodeUI"]).trim();
    vars["ExpectedFileName"] = "CommitmentLetter_" + vars["CommitmentIdUI"] + "_" + vars["CommittedDateUI1"] + vars["space"] + vars["ActualCurrentEstTime"];
    vars["ExpectedFileNamePlusOne"] = "CommitmentLetter_" + vars["CommitmentIdUI"] + "_" + vars["CommittedDateUI1"] + vars["space"] + vars["CurrentEstTimePlusOneMin"];
    vars["ExpectedFileNameMinusOne"] = "CommitmentLetter_" + vars["CommitmentIdUI"] + "_" + vars["CommittedDateUI1"] + vars["space"] + vars["CurrentEstTimeMinusOneMin"];
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await commitmentListPage.Commitment_Letter.click();
    await commitmentListPage.File_NamePopup.waitFor({ state: 'visible' });
    vars["FileNamePopup"] = await commitmentListPage.File_NamePopup.textContent() || '';
    vars["FileNamePopup"] = String(vars["FileNamePopup"]).trim();
    if (String(vars["FileNamePopup"]).includes(String(vars["ExpectedFileName"]))) {
    } else if (String(vars["FileNamePopup"]).includes(String(vars["ExpectedFileNamePlusOne"]))) {
    } else {
      expect(String(vars["FileNamePopup"])).toBe(vars["ExpectedFileNameMinusOne"]);
    }
    vars["CreationDatePopup"] = await commitmentListPage.Creation_DatePopup.textContent() || '';
    expect(String(vars["CommittedDateUI"])).toBe(vars["CreationDatePopup"]);
    await correspondentPortalPage.Download_Commitment_Letter.click();
    await commitmentListPage.Download_Commitment_Letter1.waitFor({ state: 'visible' });
    await commitmentListPage.Download_Commitment_Letter1.hover();
    await commitmentListPage.Download_Commitment_Letter1.evaluate(el => (el as HTMLElement).click());
    await page.waitForTimeout(3000); // Wait for download to complete
    vars["FilePath"] = vars['_lastDownloadPath'] || '';
    vars[""] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
    if (String(vars["ActualDownloadedFileName"]).includes(String(vars["ExpectedFileName"]))) {
    } else if (String(vars["ActualDownloadedFileName"]).includes(String(vars["ExpectedFileNamePlusOne"]))) {
    } else {
      expect(String(vars["ActualDownloadedFileName"])).toBe(vars["ExpectedFileNameMinusOne"]);
    }
  });
});
