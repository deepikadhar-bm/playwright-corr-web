import { test, expect } from '@playwright/test';
import { BidRequestsPage } from '../../../src/pages/correspondant/bid-requests';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { runPrereq_1746 } from '../../../src/helpers/prereqs/prereq-1746';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { Logger as log } from '../../../src/helpers/log-helper';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS04_TC03';
const TC_TITLE = 'If a bid contains multiple commitments, then the details screen should display the list of all those commitments.';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestsPage: BidRequestsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_1746(page, vars);
    bidRequestsPage = new BidRequestsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {

      log.step('Navigating to Commitment List and capturing first and second commitment details');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.waitFor({ state: 'visible' });
        // await priceOfferedPage.Search_Dropdown.clear();
        //  await priceOfferedPage.Search_Dropdown.fill('');
        // await priceOfferedPage.Search_Dropdown.click();
        await page.reload();
        await priceOfferedPage.Search_Dropdown.waitFor({ state: 'visible' });
        // await priceOfferedPage.Search_Dropdown.press('Control+A');
        // await priceOfferedPage.Search_Dropdown.press('Delete');
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.waitFor({ state: 'visible' });
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await commitmentListPage.Commitment_IDCommitment_List_Page(vars["BidReqId"]).first().click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        vars['FirstCommitOrderBefore'] = await commitmentListPage.Commit_OrderCommitment_List.first().textContent() || '';
        vars['FirstCommitIDBefore'] = await priceOfferedPage.Commit_IDCommitment_List.first().textContent() || '';
        vars['FirstCommitTimeBefore'] = await commitmentListPage.Commit_TimeCommitment_Screen.first().textContent() || '';
        vars['FirstMarketValueBefore'] = await commitmentListPage.Market_ValueCommitment_List.first().textContent() || '';
        vars['FirstCurrMarketValueBefore'] = await commitmentListPage.Current_Market_ValueCommitment_List.first().textContent() || '';
        vars['FirstLockedLastName'] = await priceOfferedPage.Locked_Last_NameCommitment_List.first().textContent() || '';
        vars['FirstLockedLoanAmount'] = await priceOfferedPage.Locked_Loan_AmountCommitment_List.first().textContent() || '';
        vars['FirstLockedRefSecProd'] = await priceOfferedPage.Locked_RefSecProdCommitment_List.first().textContent() || '';
        vars['FirstLockedRefSecPrice'] = await priceOfferedPage.Locked_RefSecPriceCommitment_List.first().textContent() || '';
        vars['FirstLockedGrossPrice'] = await priceOfferedPage.Locked_GrossPriceCommitment_List.first().textContent() || '';
        vars['FirstLockedHedgeRatio'] = await priceOfferedPage.Locked_Hedge_RatioCommitment_List.first().textContent() || '';
        vars['FirstLockedMarkAdj'] = await priceOfferedPage.Locked_MarkAdjCommitment_List.first().textContent() || '';
        vars['FirstLockedCurrGross'] = await priceOfferedPage.Locked_CurrGrossCommitment_List.first().textContent() || '';
        vars['SecondCommitOrder'] = await commitmentListPage.Second_Commit_OrderCommitment_List.textContent() || '';
        vars['SecondCommitID'] = await commitmentListPage.Second_Commit_IDCommitment_List.textContent() || '';
        vars['SecondCommitTime'] = await commitmentListPage.Second_Commit_Time.textContent() || '';
        vars['SecondMarketValue'] = await commitmentListPage.Market_ValueCommitment_List2.textContent() || '';
        vars['SecondCurrentMarketValue'] = await commitmentListPage.Second_Current_Market_Value.textContent() || '';
        log.stepPass('First and second commitment details captured for Bid Request ID: ' + vars['BidReqId']);
      } catch (e) {
        log.stepFail(page, 'Failed to capture first and second commitment details');
        throw e;
      }

      log.step('Navigating to Price Offered and creating third commitment');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars['BidReqId']);
        await page.keyboard.press('Enter');
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.BidRequestIDPrice_Offered_New(vars["BidReqId"]).click();
        await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.first().waitFor({ state: 'visible' });
        await priceOfferedPage.Check_Bid_Loan_NumChase_Exe.first().check();
        await priceOfferedPage.Get_Price_Button.waitFor({ state: 'visible' });
        await priceOfferedPage.Get_Price_Button.click();
        await priceOfferedPage.Commit_Selected_1_Dropdown.waitFor({ state: 'visible' });
        expect(await priceOfferedPage.Commit_Selected_1_Dropdown).toBeEnabled();
        await priceOfferedPage.Commit_Selected_1_Dropdown.click();
        await priceOfferedPage.Yes_Commit_ButtonPopup.click();
        Methods.getCurrentTimestamp(appconstants.TIME_FORMATE, 'ThirdCommitTime', appconstants.UTC);
        await priceOfferedPage.Okay_ButtonPopup.waitFor({ state: 'visible' });
        vars['ThirdCommitmentID'] = await priceOfferedPage.Commitment_IdPrice_Offered.textContent() || '';
        await priceOfferedPage.Okay_ButtonPopup.click();
        log.stepPass('Third commitment created. Commitment ID: ' + vars['ThirdCommitmentID']);
      } catch (e) {
        log.stepFail(page, 'Failed to create third commitment from Price Offered');
        throw e;
      }

      log.step('Capturing third commitment loan details from Price Offered screen');
      try {
        await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
        vars['ThirdCurrentMarket'] = await priceOfferedPage.Current_Market_ValueDetails_Screen.first().textContent() || '';
        vars['ThirdCommittedCorrLoan'] = await commitmentListPage.Third_Committed_Corr_Loan.textContent() || '';
        vars['ThirdCommittedLastName'] = await commitmentListPage.Third_Committed_Last_Name.textContent() || '';
        vars['ThirdCommittedLoanAmount'] = await commitmentListPage.Third_Committed_Loan_Amount.textContent() || '';
        vars['ThirdCommittedRefSecProd'] = await commitmentListPage.Third_Committed_Ref_Sec_Prod.textContent() || '';
        vars['ThirdCommittedRefSecPrice'] = await commitmentListPage.Third_Committed_Ref_Sec_Price.textContent() || '';
        vars['ThirdCommittedGrossPrice'] = await commitmentListPage.Third_Committed_Gross_Price.textContent() || '';
        vars['ThirdCommittedHedgeRatio'] = await commitmentListPage.Third_Committed_Hedge_Ratio.textContent() || '';
        vars['ThirdCommittedMarkAdj'] = await commitmentListPage.Third_Committed_Mark_Adj.textContent() || '';
        vars['ThirdCommittedLoanCurrGross'] = await commitmentListPage.Third_Committed_Loan_Curr_Gross.textContent() || '';
        log.stepPass('Third commitment loan details captured');
      } catch (e) {
        log.stepFail(page, 'Failed to capture third commitment loan details');
        throw e;
      }

      log.step('Navigating back to Commitment List and verifying all three commitments');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Search_Dropdown.type(vars['BidReqId']);
        await priceOfferedPage.Search_Dropdown.click();
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.waitFor({ state: 'visible' });
        await priceOfferedPage.Bid_Request_ID_DropdownCommitment_List_Page.click();
        await commitmentListPage.Commitment_IDCommitment_List_Page(vars["BidReqId"]).first().click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(commitmentListPage.Commit_OrderCommitment_List.first()).toContainText(vars['FirstCommitOrderBefore']);
        await expect(priceOfferedPage.Commit_IDCommitment_List.first()).toContainText(vars['FirstCommitIDBefore']);
        await expect(commitmentListPage.Commit_TimeCommitment_Screen.first()).toContainText(vars['FirstCommitTimeBefore']);
        await expect(commitmentListPage.Market_ValueCommitment_List.first()).toContainText(vars['ThirdCurrentMarket']);
        await expect(commitmentListPage.Current_Market_ValueCommitment_List.first()).toContainText(vars['FirstCurrMarketValueBefore']);
        await expect(priceOfferedPage.Locked_Last_NameCommitment_List.first()).toContainText(vars['FirstLockedLastName']);
        await expect(priceOfferedPage.Locked_Loan_AmountCommitment_List.first()).toContainText(vars['FirstLockedLoanAmount']);
        await expect(priceOfferedPage.Locked_RefSecProdCommitment_List.first()).toContainText(vars['FirstLockedRefSecProd']);
        await expect(priceOfferedPage.Locked_RefSecPriceCommitment_List.first()).toContainText(vars['FirstLockedRefSecPrice']);
        await expect(priceOfferedPage.Locked_GrossPriceCommitment_List.first()).toContainText(vars['FirstLockedGrossPrice']);
        await expect(priceOfferedPage.Locked_Hedge_RatioCommitment_List.first()).toContainText(vars['FirstLockedHedgeRatio']);
        await expect(priceOfferedPage.Locked_MarkAdjCommitment_List.first()).toContainText(vars['FirstLockedMarkAdj']);
        await expect(priceOfferedPage.Locked_CurrGrossCommitment_List.first()).toContainText(vars['FirstLockedCurrGross']);
        await expect(commitmentListPage.Second_Commit_OrderCommitment_List).toContainText(vars['SecondCommitOrder']);
        await expect(commitmentListPage.Second_Commit_IDCommitment_List).toContainText(vars['SecondCommitID']);
        await expect(commitmentListPage.Second_Commit_Time).toContainText(vars['SecondCommitTime']);
        await expect(commitmentListPage.Market_ValueCommitment_List2).toContainText(vars['ThirdCurrentMarket']);
        await expect(commitmentListPage.Second_Current_Market_Value).toContainText(vars['SecondCurrentMarketValue']);
        const element = page.getByText(vars['ThirdCommitmentID']);
        await element.scrollIntoViewIfNeeded();  
        await expect(element).toBeVisible();
        await expect(commitmentListPage.Third_Commit_Time_Screen).toContainText(vars['ThirdCommitTime']);
        await expect(commitmentListPage.Third_Market_ValueCommitment_List).toContainText(vars['ThirdCurrentMarket']);
        await expect(commitmentListPage.Third_Current_Market_Value).toContainText(vars['ThirdCurrentMarket']);
        await expect(commitmentListPage.Third_Locked_Last_NameCommitment_List).toContainText(vars['ThirdCommittedLastName']);
        await expect(commitmentListPage.Third_Locked_LoanAmountCommitment_List).toContainText(vars['ThirdCommittedLoanAmount']);
        await expect(commitmentListPage.Third_Locked_RefSecProdCommitment_List).toContainText(vars['ThirdCommittedRefSecProd']);
        await expect(commitmentListPage.Third_Locked_RefSecPriceCommitment_List).toContainText(vars['ThirdCommittedRefSecPrice']);
        await expect(commitmentListPage.Third_Locked_GrossCommitment_List).toContainText(vars['ThirdCommittedGrossPrice']);
        await expect(commitmentListPage.Third_Locked_HedgeRatioCommitment_List).toContainText(vars['ThirdCommittedHedgeRatio']);
        await expect(commitmentListPage.Third_Locked_MarAdjCommitment_List).toContainText(vars['ThirdCommittedMarkAdj']);
        await expect(commitmentListPage.Third_Locked_CurrGrossCommitment_List).toContainText(vars['ThirdCommittedLoanCurrGross']);
        log.stepPass('All three commitments verified successfully in Commitment List');
      } catch (e) {
        log.stepFail(page, 'Verification failed for commitments in Commitment List');
        throw e;
      }

      log.tcEnd('PASS');
    } catch (e) {
      await log.captureOnFailure(page, TC_ID, e);
      log.tcEnd('FAIL');
      throw e;
    }
  });
});