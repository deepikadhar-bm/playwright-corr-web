import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import path from 'path';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';
import { runPrereq_1394 } from './prereq-1394';

export async function runPrereq_1873(page: Page, vars: Record<string, string>): Promise<void> {
  await runPrereq_1394(page, vars);

  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const bidRequestsPage = new BidRequestsPage(page);
  const commitmentListPage = new CommitmentListPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);



  // Set up download handler
  page.on('download', async (download) => {
    const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
    await download.saveAs(filePath);
    vars['_lastDownloadPath'] = filePath;
  });

  await correspondentPortalPage.Commitments_Side_Menu.click();
  await correspondentPortalPage.Price_Offered_List_Dropdown.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  vars["BidReqId"] = vars["RequestIDDetails"];
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["BidReqId"]);
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await priceOfferedPage.BidRequestIDPrice_Offered_New.click();
  await bidRequestDetailsPage.Last_Name_Sort_Button.waitFor({ state: 'visible' });
  vars["ReferenceMonth"] = await priceOfferedPage.Reference_Month.textContent() || '';
  await bidRequestDetailsPage.Last_Name_Sort_Button.click();
  await priceOfferedPage.Last_Name_Down_ArrowDetails.waitFor({ state: 'visible' });
  await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.check();
  vars["CommittedCorrLoan"] = await priceOfferedPage.Checked_Corr_Loan.textContent() || '';
  await priceOfferedPage.Get_Price_Button.waitFor({ state: 'visible' });
  await priceOfferedPage.Get_Price_Button.click();
  await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
  await priceOfferedPage.Commit_Selected_1_Dropdown.click();
  await priceOfferedPage.Yes_Commit_ButtonPopup.click();
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
  await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
  vars["CommitmentID"] = await priceOfferedPage.Commitment_IdPrice_Offered.textContent() || '';
  await priceOfferedPage.Okay_ButtonPopup.click();
  await correspondentPortalPage.Commitments_Side_Menu.click();
  await commitmentListPage.Committed_List_Dropdown.click();
  await priceOfferedPage.Search_Dropdown.click();
  await priceOfferedPage.Search_Dropdown.fill(vars["CommitmentID"]);
  await priceOfferedPage.Commitment_Id_DropdownCommitment_List_Page.click();
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  vars["CCodeUI"] = await priceOfferedPage.CCode_In_Commitment_List.textContent() || '';
  vars["CommitmentIdUI"] = await priceOfferedPage.Commitment_IDCommitment_List.textContent() || '';
  vars["CommitmentIdUI"] = String(vars["CommitmentIdUI"]).trim();
  vars["CompanyNameUI"] = await priceOfferedPage.Company_In_Commitment_List.textContent() || '';
  vars["CompanyNameUI"] = String(vars["CompanyNameUI"]).trim();
  vars["CommitmentLoanAmountUI"] = await priceOfferedPage.Comm_AmountCommitment_List.textContent() || '';
  vars["CommittedLoansUI"] = await priceOfferedPage.CommLoans_Commitment_List.textContent() || '';
  vars["CommittedDateUI"] = await priceOfferedPage.Committed_DateCommitment_List.textContent() || '';
  vars["ExpiredDateUI"] = await priceOfferedPage.Expiration_DateCommitment_List.textContent() || '';
  vars["ExecutionTypeUI"] = await priceOfferedPage.Execution_TypeCommitment_List.textContent() || '';
  await priceOfferedPage.Commitment_IDCommitment_List_Page_New.click();
  vars["ProductNameUI"] = await priceOfferedPage.Product_NameDetails.textContent() || '';
  vars["RefSecCouponUI"] = await priceOfferedPage.Ref_Sec_CouponDetails.textContent() || '';
  vars["CurrentMarketValueUI"] = await commitmentListPage.Current_Market_ValueCommitment_List.textContent() || '';
  vars["ChaseLoanNumUI"] = await commitmentListPage.Chase_Loan_Num.textContent() || '';
  vars["LastNameUI"] = await commitmentListPage.Last_NameCommitment_List.textContent() || '';
  vars["InterestRateUI"] = await priceOfferedPage.Committed_Interest_RatePrice_Offered.textContent() || '';
  vars["CommittedPriceUI"] = await correspondentPortalPage.Curr_GrossCommitment_List.textContent() || '';
  vars["HedgeRatioUI"] = await priceOfferedPage.Committed_Hedge_RatioPrice_Offered.textContent() || '';
  await priceOfferedPage.Committed_CorrLoan.click();
  await correspondentPortalPage.Search_Fields_Input.waitFor({ state: 'visible' });
  await commitmentListPage.Product_CodePopup_Details.scrollIntoViewIfNeeded();
  vars["ProductCodeUI"] = await commitmentListPage.Product_CodePopup_Details.textContent() || '';
  await commitmentListPage.LMI_PricePopup_Details.scrollIntoViewIfNeeded();
  vars["LMIPriceUI"] = await commitmentListPage.LMI_PricePopup_Details.textContent() || '';
  if (true) /* Element LMI Type(Popup Details) is visible */ {
    vars["LMITypeUI"] = await commitmentListPage.LMI_TypePopup_Details.textContent() || '';
  } else {
    vars["LMITypeUI"] = "Null";
  }
  await correspondentPortalPage.Close_Buttonemail_config.click();
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
  vars["AllLoanDetailsUI"] = String(vars["CCodeUI"]) + ";" + String(vars["CommitmentIdUI"]);
  vars["AllLoanDetailsUI"] = String(vars["AllLoanDetailsUI"]) + ";" + String(vars["ChaseLoanNumUI"]);
  vars["AllLoanDetailsUI"] = String(vars["AllLoanDetailsUI"]) + ";" + String(vars["CommittedCorrLoan"]);
  vars["AllLoanDetailsUI"] = String(vars["AllLoanDetailsUI"]) + ";" + String(vars["LastNameUI"]);
  vars["AllLoanDetailsUI"] = String(vars["AllLoanDetailsUI"]) + ";" + String(vars["ProductCodeUI"]);
  vars["AllLoanDetailsUI"] = String(vars["AllLoanDetailsUI"]) + ";" + String(vars["CommitmentLoanAmountUI"]);
  vars["AllLoanDetailsUI"] = String(vars["AllLoanDetailsUI"]) + ";" + String(vars["InterestRateUI"]);
  vars["AllLoanDetailsUI"] = String(vars["AllLoanDetailsUI"]) + ";" + String(vars["CommittedPriceUI"]);
  vars["AllLoanDetailsUI"] = String(vars["AllLoanDetailsUI"]) + ";" + String(vars["ExpiredDateUI"]);
  vars["AllLoanDetailsUI"] = String(vars["AllLoanDetailsUI"]) + ";" + String(vars["HedgeRatioUI"]);
  vars["AllLoanDetailsUI"] = String(vars["AllLoanDetailsUI"]) + ";" + String(vars["LMIPriceUI"]);
  vars["AllLoanDetailsUI"] = String(vars["AllLoanDetailsUI"]) + ";" + String(vars["LMITypeUI"]);
  vars["count"] = "1";
  for (let dataIdx = parseInt(vars["count"]); dataIdx <= 13; dataIdx++) {
    vars["IndividualLoanDetailsUI"] = String(vars["AllLoanDetailsUI"]).split(";")[parseInt(String(vars["count"]))] || '';
    vars["IndividualLoanDetailsUI"] = String(vars["IndividualLoanDetailsUI"]).trim();
    // Write to test data profile: "LoanDetails(Loan Level Details)" = vars["IndividualLoanDetailsUI"]
    vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
  }
  vars["space"] = "key_blank";
  vars["CompanyNameWithCCodeUI"] = vars["CompanyNameUI"] + vars["space"] + "-" + vars["space"] + "(" + vars["CCodeUI"] + ")";
  vars["ExpectedFileName"] = "CommitmentLetter_" + vars["CommitmentIdUI"] + "_" + vars["CommittedDateUI1"] + vars["space"] + vars["ActualCurrentEstTime"];
  vars["ExpectedFileNamePlusOne"] = "CommitmentLetter_" + vars["CommitmentIdUI"] + "_" + vars["CommittedDateUI1"] + vars["space"] + vars["CurrentEstTimePlusOneMin"];
  vars["ExpectedFileNameMinusOne"] = "CommitmentLetter_" + vars["CommitmentIdUI"] + "_" + vars["CommittedDateUI1"] + vars["space"] + vars["CurrentEstTimeMinusOneMin"];
  await priceOfferedPage.Back_To_Commitment_List.click();
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
  await commitmentListPage.Download_Commitment_Letter1.waitFor({ state: 'visible' });
  await commitmentListPage.Download_Commitment_Letter1.hover();
  await commitmentListPage.Download_Commitment_Letter1.evaluate(el => (el as HTMLElement).click());
  await page.waitForTimeout(3000); // Wait for download to complete
  vars["FilePath"] = vars['_lastDownloadPath'] || '';
  vars[""] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
  if (String(vars["ActualDownloadedFileName1"]).includes(String(vars["ExpectedFileName"]))) {
  } else if (String(vars["ActualDownloadedFileName1"]).includes(String(vars["ExpectedFileNamePlusOne"]))) {
  } else {
    expect(String(vars["ActualDownloadedFileName1"])).toBe(vars["ExpectedFileNameMinusOne"]);
  }
}
