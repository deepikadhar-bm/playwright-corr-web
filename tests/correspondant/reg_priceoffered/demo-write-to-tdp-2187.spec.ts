// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';

test.describe('Unassigned', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
  });

  test('demo write to tdp', async ({ page }) => {
    // [DISABLED] Login to CORR Portal
    // await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    // [DISABLED] Navigate to https://ext-qa.lpcorrtest.com/cp/#/bid-requests/edit-bid-details/6942683ddb344a41b01ed910/bid-details
    // await page.goto("https://ext-qa.lpcorrtest.com/cp/#/bid-requests/edit-bid-details/6942683ddb344a41b01ed910/bid-details");
    // [DISABLED] Click on Commitments Side Menu
    // await correspondentPortalPage.Commitments_Side_Menu.click();
    // [DISABLED] Click on Price Offered List Dropdown
    // await correspondentPortalPage.Price_Offered_List_Dropdown.click();
    // [DISABLED] Enter 87NDB3C12736 in the Search Field in Price Offered Page field
    // await correspondentPortalPage.Search_By_Bid_Request_ID_Input.fill("87NDB3C12736");
    // [DISABLED] Wait until the element Spinner is not visible
    // await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // [DISABLED] Click on 87NDB3C12736
    // await statusInactivePage._87NDB3C12736.click();
    // [DISABLED] Wait until the element demo last name is visible
    // await bidRequestDetailsPage.demo_last_name.waitFor({ state: 'visible' });
    // [DISABLED] Click on demo last name
    // await bidRequestDetailsPage.demo_last_name.click();
    // [DISABLED] Wait until the current page is loaded completely
    // await page.waitForLoadState('networkidle');
    // [DISABLED] Store the count of elements identified by locator ChaseFields Count Popup (Loan Details) into a variable ChaseFieldCountPopup
    // vars["ChaseFieldCountPopup"] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
    // [DISABLED] Store 1 in count
    // vars["count"] = "1";
    // [DISABLED] Store text from the element Individual Chase Field Name Popup into a variable ChaseFieldNameBeforeSubmit
    // vars["ChaseFieldNameBeforeSubmit"] = await bidRequestDetailsPage.Individual_Chase_Field_Name_Popup.textContent() || '';
    // [DISABLED] Store text from the element Chase value 2026 into a variable ChaseFieldNameBeforeSubmit
    // vars["ChaseFieldNameBeforeSubmit"] = await statusInactivePage.Chase_value_2026.textContent() || '';
    // [DISABLED] Writing the data from pop up to tdp
    // await stepGroups.stepGroup_Writing_the_data_from_pop_up_to_tdp(page, vars);
    // [DISABLED] Split string 2/2/26 3:56 PM | $450,063 using | and store the 1 into a vhk
    // vars["vhk"] = String('').split("|")["1"] || '';
    // [DISABLED] Store vhk in nkg
    // vars["nkg"] = vars["vhk"];
    // [DISABLED] Split string 2/2/26 3:56 PM | $450,063 using | and store the 0 into a vhk
    // vars["vhk"] = String('').split("|")["0"] || '';
    // [DISABLED] Store vhk in zcd
    // vars["zcd"] = vars["vhk"];
    // [DISABLED] Split string vhk using space and store the 0 into a zxc
    // vars["zxc"] = String('').split("")["0"] || '';
    // [DISABLED] Store zxc in zxs
    // vars["zxs"] = vars["zxc"];
    // [DISABLED] Split string vhk using space and store the 1 into a zxc
    // vars["zxc"] = String('').split("")["1"] || '';
    // [DISABLED] Split string vhk using space and store the 2 into a zxc
    // vars["zxc"] = String('').split("")["2"] || '';
    vars["bhk"] = (() => {
      const d = new Date(String("04:00 PM"));
      const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
      return "hh:mm".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
    })();
  });
});
