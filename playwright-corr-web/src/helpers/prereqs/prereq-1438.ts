import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../step-groups';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { ChaseFieldNamePage } from '../../pages/correspondant/chase-field-name';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { SpinnerPage } from '../../pages/correspondant/spinner';

export async function runPrereq_1438(page: Page, vars: Record<string, string>): Promise<void> {
  const bidRequestsPage = new BidRequestsPage(page);
  const chaseFieldNamePage = new ChaseFieldNamePage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const priceOfferedPage = new PriceOfferedPage(page);
  const spinnerPage = new SpinnerPage(page);


  await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
  // [DISABLED] Clipboard: set clipboard Allow mode for the current site
  // // Clipboard permissions are handled via Playwright browser context
  // [DISABLED] Notifications: set notifications Allow mode for the current site
  // // Notification permissions are handled via Playwright browser context
  await correspondentPortalPage.Commitments_Side_Menu.click();
  await correspondentPortalPage.Price_Offered_List_Dropdown.click();
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.waitFor({ state: 'visible' });
  await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
  await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill("873R67588B72");
  await spinnerPage.Spinner.waitFor({ state: 'hidden' });
  await priceOfferedPage.First_bid_id.click();
  await page.waitForLoadState('networkidle');
  // [DISABLED] Verify that the current page displays an element Get Price Button(price offered) and With Scrollable FALSE
  // await expect(correspondentPortalPage.Get_Price_Button).toBeVisible();
  // [DISABLED] Verify that the element Select all for Checkbox(price offered screen) is unchecked and With Scrollable FALSE
  // await expect(priceOfferedPage.Select_all_for_Checkboxprice_offered_screen).toBeVisible();
  // [DISABLED] Verify that the element First Check Box(price offered screen) is unchecked and With Scrollable FALSE
  // await expect(priceOfferedPage.First_Check_Boxprice_offered_screen).toBeVisible();
  // [DISABLED] Store 1 in count
  // vars["count"] = "1";
  // [DISABLED] Store the count of elements identified by locator Enabled Loan Numbers In Price Offered into a variable EnabledLoansCount
  // vars["EnabledLoansCount"] = String(await priceOfferedPage.Corr_Loan_Number_ID.count());
  while (true) /* Verify if count <= EnabledLoansCount */ {
    // [DISABLED] Store text from the element Individual Loan Num Price Offered into a variable CurrentLoanNumber
    // vars["CurrentLoanNumber"] = await priceOfferedPage.Individual_Loan_Num_Price_Offered.textContent() || '';
    // [DISABLED] Fetch text from multiple elements Loan Numbers Expect the Current Loan with the same xpath and store it in RemainingLoanNumbers .
    // vars["RemainingLoanNumbers"] = (await priceOfferedPage.Loan_Numbers_Expect_the_Current_Loan.allTextContents()).join(', ');
    // [DISABLED] Verify RemainingLoanNumbers not contains CurrentLoanNumber
    // expect(String(vars["RemainingLoanNumbers"])).not.toContain(String(vars["CurrentLoanNumber"]));
    // [DISABLED] Perform addition on 1 and count and store the result inside a count considering 0 decimal places
    // vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
  // [DISABLED] Click on Get Price Button(price offered)
  // await correspondentPortalPage.Get_Price_Button.click();
  // [DISABLED] Verify that the current page displays an element Remaining Time(price offered) and With Scrollable FALSE
  // await expect(priceOfferedPage.Remaining_Timeprice_offered).toBeVisible();
  // [DISABLED] Click on First Check Box(price offered screen)
  // await priceOfferedPage.First_Check_Boxprice_offered_screen.click();
  // [DISABLED] Check the checkbox First Check Box(price offered screen)
  // await priceOfferedPage.First_Check_Boxprice_offered_screen.check();
  // [DISABLED] Verify that the element First Check Box(price offered screen) is checked and With Scrollable FALSE
  // await expect(priceOfferedPage.First_Check_Boxprice_offered_screen).toBeVisible();
  // [DISABLED] Store text from the element First Loan Num Price offered into a variable FirstLoanNumPriceOffered
  // vars["FirstLoanNumPriceOffered"] = await priceOfferedPage.First_Loan_Num_Price_offered.textContent() || '';
  // [DISABLED] Verify that the element Commit Selected Footer Button(price offered) is enabled and With Scrollable FALSE
  // await expect(priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered).toBeVisible();
  // [DISABLED] Click on Commit Selected Footer Button(price offered)
  // await priceOfferedPage.Commit_Selected_Footer_Buttonprice_offered.click();
  // [DISABLED] Click on Yes Commit Button(popup price offered screen)
  // await priceOfferedPage.Yes_Commit_Buttonpopup_price_offered_screen.click();
  // [DISABLED] Wait until the element Yes Commit Button(popup price offered screen) is not visible
  // await priceOfferedPage.Yes_Commit_Buttonpopup_price_offered_screen.waitFor({ state: 'hidden' });
  // [DISABLED] Wait until the element Okay Button(popup, price offered screen) is visible
  // await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.waitFor({ state: 'visible' });
  // [DISABLED] Click on Okay Button(popup, price offered screen)
  // await priceOfferedPage.Okay_Buttonpopup_price_offered_screen.click();
  await page.waitForLoadState('networkidle');
  await priceOfferedPage.All_Loans_Tabprice_offered_screen.waitFor({ state: 'visible' });
  await priceOfferedPage.All_Loans_Tabprice_offered_screen.click();
  await page.waitForLoadState('networkidle');
  vars[""] = await priceOfferedPage.First_Loan_Num_Price_offered.getAttribute("value") || '';
  vars[""] = await priceOfferedPage.First_Loan_Num_Price_offered.getAttribute("value") || '';
  // [DISABLED] Copy text from element First Loan Num Price offered and send it as keyboard
  // vars[""] = await priceOfferedPage.First_Loan_Num_Price_offered.textContent() || '';
  vars["URL"] = page.url();
  // [DISABLED] Set chrome permission to URL: URL , Permission Name: Pop-ups and redirects , Permission Type: Allow
  // // Chrome permissions are handled via Playwright browser context
  // [DISABLED] Click on the Refresh button in the browser
  // await page.reload();
  // [DISABLED] Wait for 10 seconds
  // await page.waitForTimeout(10000);
  await correspondentPortalPage.Paste_Loans_Button1.click();
  await page.waitForTimeout(3000);
  // [DISABLED] Enter Allow in prompt popup and click on accept
  // page.once('dialog', async dialog => { await dialog.accept(String("Allow")); });
  // [DISABLED] Click on text Allow
  // await page.getByText("Allow").click();
  await priceOfferedPage.Paste_Clipboard_Button.click();
  // [DISABLED] Notifications: set notifications Allow mode for the current site
  // // Notification permissions are handled via Playwright browser context
  // [DISABLED] Allow clipboard access in browser
  // // Clipboard access is handled by Playwright browser context permissions
  // [DISABLED] Wait for 5 seconds
  // await page.waitForTimeout(5000);
  // [DISABLED] Wait until the text Allow is present on the current page
  // await page.getByText("Allow").waitFor({ state: 'visible' });
  // [DISABLED] Enter ok in prompt popup and click on accept
  // page.once('dialog', async dialog => { await dialog.accept(String("ok")); });
  // [DISABLED] Click OK button in the alert
  // page.once('dialog', dialog => dialog.accept());
  // [DISABLED] Wait for 10 seconds
  // await page.waitForTimeout(10000);
  // [DISABLED] Click on Paste loan numbers here
  // await correspondentPortalPage.Paste_loan_numbers_here1.click();
  // [DISABLED] Enter FirstLoanNumPriceOffered in the Paste loan numbers here field
  // await correspondentPortalPage.Paste_loan_numbers_here1.fill(vars["FirstLoanNumPriceOffered"]);
  await page.waitForTimeout(20000);
  vars["LoanNumFreedom"] = vars["FirstLoanNumPriceOffered"];
  await priceOfferedPage.Validate_Button_Paste_loan_popup.click();
  await priceOfferedPage.Validate_Button_Paste_loan_popup.waitFor({ state: 'hidden' });
  await expect(chaseFieldNamePage.Add_to_Commit_Buttonpaste_loan_popup).toBeVisible();
}
