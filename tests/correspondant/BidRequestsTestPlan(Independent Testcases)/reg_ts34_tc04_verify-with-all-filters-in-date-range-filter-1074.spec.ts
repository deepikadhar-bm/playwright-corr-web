// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { testDataManager } from 'testdata/TestDataManager';
import { Logger as log } from '../../../src/helpers/log-helper';
import { ENV } from '../../../src/config/environments';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { BidRequestListPage } from '../../../src/pages/correspondant/bid-request-list';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let bidRequestListPage: BidRequestListPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    bidRequestListPage = new BidRequestListPage(page);
  });

  test('REG_TS34_TC04_Verify With All Filters In Date Range Filter', async ({ page }) => {
//     const testData: Record<string, string> = {
//   "Last One Month": "Last One Month",
//   "This Calendar Month": "This Calendar Month",
//   "This Quarter": "This Quarter",
//   "This Year": "This Year"
// }; // Profile: "Filter View", row: 0
    const addonHelpers = new AddonHelpers(page, vars);

    log.step('Loading credentials and test data');
    try {
      const profileName = 'Filter View';
      const profile = testDataManager.getProfileByName(profileName);
      if (profile && profile.data) {
        const data = (profile.data as unknown as Record<string, string>);
        const LastOneMonth = data['Last One Month'];
        vars["Last One Month"] = LastOneMonth;
        const ThisCalendarMonth = data['This Calendar Month'];
        vars["This Calendar Month"] = ThisCalendarMonth;
        const ThisQuarter = data['This Quarter'];
        vars["This Quarter"] = ThisQuarter;
        const ThisYear = data['This Year'];
        vars["This Year"] = ThisYear;
      }
      log.info(`This Quarter from TDP : ${vars["This Quarter"]}`);
      const credentials = ENV.getCredentials('internal');
      vars["Username"] = credentials.username;
      vars["Password"] = credentials.password;
      log.stepPass('Credentials and test data loaded successfully');
    } catch (e) {
      await log.stepFail(page, 'Loading credentials and test data failed');
      throw e;
    }

    // ── Login ──────────────────────────────────────────────────────────────────
    log.step('Logging in to Correspondent Portal');
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await expect(correspondentPortalPage.Bid_Requests).toBeVisible();
    log.stepPass('Login successful and Bid Requests menu is visible');

    // ── Navigate to Bid Requests ───────────────────────────────────────────────
    log.step('Navigating to Bid Requests page');
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    log.stepPass('Bid Requests page loaded successfully');

    // ── Filter: Last One Month ─────────────────────────────────────────────────
    log.step('Applying Date Range filter: Last One Month');
    await priceOfferedPage.Filter_Dropdown1.click();
    await page.waitForLoadState('load');
    await correspondentPortalPage.Select_Date_Range_Dropdown_Field.click();
    await correspondentPortalPage.Last_One_Month_Button.click();
    vars["Last One Month Name"] = await correspondentPortalPage.Select_Date_Range_Dropdown_Value.textContent() || '';
    log.info(`Selected date range value: "${vars["Last One Month Name"]}"`);
    await expect(correspondentPortalPage.Select_Date_Range_Dropdown_Value).toContainText(vars["Last One Month"]);
    await applyFiltersButtonPage.Apply_Filters_Button.click();

    if (await page.getByText("No result").isVisible()) /* Element No result (Bid requests) is visible */ {
      log.info('No results found for Last One Month filter — verifying "No result" message');
      await expect(page.getByText("No result")).toBeVisible();
    } else {
      log.info('Results found for Last One Month filter — verifying each uploaded date matches last month');
      await stepGroups.stepGroup_Getting_Last_Month_From_Current_Month(page, vars);
      vars["count"] = "1";
      vars["All Uploaded Date Count"] = String(await bidRequestPage.Uploaded_Date_Count.count());
      log.info(`Total uploaded dates to verify: ${vars["Count of Uploaded Date"]}`);
      // while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["All Uploaded Date Count"]))) {
      //   vars["IndividualDate"] = await bidRequestPage.Individual_Uploaded_Date.textContent() || '';
      //   expect(new Date(String('')).getMonth()).toBe(new Date(String('')).getMonth());
      //   vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
      // }
      const addonHelpers = new AddonHelpers(page, vars);
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["Count of Uploaded Date"]))) {
        vars["UploadedDates"] = (await correspondentPortalPage.Uploaded_Dates(parseFloat(String(vars["count"]))).textContent() || '').trim();
        log.info(`Iteration ${vars["count"]}: Verifying uploaded date "${vars["UploadedDates"]}" matches last month "${vars["Last Month"]}"`);
        addonHelpers.verifyDateStringMonthMatchesExpectedMonth(vars["UploadedDates"], vars["Last Month"]);
        vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
      }
      log.stepPass('All uploaded dates verified against Last One Month filter');
    }

    // ── Filter: This Calendar Month ────────────────────────────────────────────
    log.step('Applying Date Range filter: This Calendar Month');
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_Date_Range_Dropdown_Field.click();
    await bidRequestPage.This_Calendar_Month_Option.click();
    vars["This Calendar Month"] = await correspondentPortalPage.Select_Date_Range_Dropdown_Value.textContent() || '';
    log.info(`Selected date range value: "${vars["This Calendar Month"]}"`);
    await expect(correspondentPortalPage.Select_Date_Range_Dropdown_Value).toContainText(vars["This Calendar Month"]);
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await page.waitForLoadState('load');

    if (await page.getByText("No result").isVisible()) /* Element No result (Bid requests) is visible */ {
      log.info('No results found for This Calendar Month filter — verifying "No result" message');
      await expect(page.getByText("No result")).toBeVisible();
    } else {
      log.info('Results found for This Calendar Month filter — verifying each uploaded date matches current month');
      vars["count"] = "1";
      vars["DateCount"] = String(await bidRequestPage.Uploaded_Date_Count.count());
      log.info(`Total uploaded dates to verify: ${vars["DateCount"]}`);
      // while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["DateCount"]))) {
      //   vars["IndividualDate"] = await bidRequestPage.Individual_Uploaded_Date.textContent() || '';
      //   expect(new Date(String('')).getMonth()).toBe(new Date(String('')).getMonth());
      //   vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
      // }
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["Count of Uploaded Date"]))) {
        vars["UploadedDates"] = (await correspondentPortalPage.Uploaded_Dates(parseFloat(String(vars["count"]))).textContent() || '').trim();
        log.info(`Iteration ${vars["count"]}: Verifying uploaded date "${vars["UploadedDates"]}" matches last month "${vars["This Calendar Month"]}"`);
        addonHelpers.verifyDateStringMonthMatchesExpectedMonth(vars["UploadedDates"], vars["This Calendar Month"]);
        vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
      }
      log.stepPass('All uploaded dates verified against This Calendar Month filter');
    }

    // ── Filter: This Quarter ───────────────────────────────────────────────────
    log.step('Applying Date Range filter: This Quarter');
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_Date_Range_Dropdown_Field.click();
    await correspondentPortalPage.This_Quarter_Button.click();
    vars["This Quarter Button"] = await correspondentPortalPage.Select_Date_Range_Dropdown_Value.innerText() || '';
    log.info(`Selected date range value: "${vars["This Quarter Button"]}"`);
    await expect(correspondentPortalPage.Select_Date_Range_Dropdown_Value).toContainText(vars["This Quarter"]);
    await applyFiltersButtonPage.Apply_Filters_Button.click();

    if (true) /* Verify if Last Month == 01 */ {
      // [DISABLED] Store 12 in Month Before Last Month
      // vars["Month Before Last Month"] = "12";
    } else {
      // [DISABLED] Perform subtraction on Last Month and 1 and store the result inside a Month Before Last Month considering 0 decimal places
      // vars["Month Before Last Month"] = (parseFloat(String(vars["Last Month"])) - parseFloat(String("1"))).toFixed(0);
    }
    if (true) /* Verify if 1,2,3,4,5,6,7,8,9 contains Month Before Last Month */ {
      // [DISABLED] concate 0 and Month Before Last Month and store the new string into a Month Before Last Month
      // vars["Month Before Last Month"] = String('') + String('');
    }
    // [DISABLED] Concate Current Month and Last Month with SpecialCharacter , and store into a variable Current And Last Month
    // vars["Current And Last Month"] = String(vars["Current Month"]) + "," + String(vars["Last Month"]);
    // [DISABLED] Concate Current And Last Month and Month Before Last Month with SpecialCharacter , and store into a variable QuarterMonths
    // vars["QuarterMonths"] = String(vars["Current And Last Month"]) + "," + String(vars["Month Before Last Month"]);

    await page.waitForLoadState('load');

    if (await page.getByText("No result").isVisible()) /* Element No result (Bid requests) is visible */ {
      log.info('No results found for This Quarter filter — verifying "No result" message');
      await expect(page.getByText("No result")).toBeVisible();
    } else {
      log.info('Results found for This Quarter filter — verifying each uploaded date falls within the current quarter');
      vars["Quarter1"] = "01,02,03";
      vars["Quarter2"] = "04,05,06";
      vars["Quarter3"] = "07,08,09";
      vars["Quarter4"] = "10,11,12";
      vars["count"] = "1";
      vars["DatesCount"] = String(await bidRequestPage.Uploaded_Date_Count.count());
      log.info(`Current Month: "${vars["Current Month"]}" — Total dates to verify: ${vars["DatesCount"]}`);

      if (String(vars["Quarter1"]).includes(String(vars["Current Month"]))) {
        log.info('Current month falls in Quarter 1 (Jan–Mar) — verifying dates against Quarter 1');
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["DatesCount"]))) {
          vars["IndividualQuarterDate"] = await bidRequestPage.Individual_Uploaded_Date(vars["count"]).textContent() || '';
          vars["IndividualQuarterDate"] = String(vars["IndividualQuarterDate"]).substring(0, String(vars["IndividualQuarterDate"]).length - 9).trim();
          log.info(`Iteration ${vars["count"]}: Verifying date month "${vars["IndividualQuarterDate"]}" is within Quarter 1`);
          expect(String(vars["Quarter1"])).toContain(vars["IndividualQuarterDate"]);
          vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
        }
      } else if (String(vars["Quarter2"]).includes(String(vars["Current Month"]))) {
        log.info('Current month falls in Quarter 2 (Apr–Jun) — verifying dates against Quarter 2');
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["DatesCount"]))) {
          vars["IndividualQuarterDate"] = await bidRequestPage.Individual_Uploaded_Date(vars["count"]).textContent() || '';
          vars["IndividualQuarterDate"] = String(vars["IndividualQuarterDate"]).substring(0, String(vars["IndividualQuarterDate"]).length - 9).trim();
          log.info(`Iteration ${vars["count"]}: Verifying date month "${vars["IndividualQuarterDate"]}" is within Quarter 2`);
          expect(String(vars["Quarter2"])).toContain(vars["IndividualQuarterDate"]);
          vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
        }
      } else if (String(vars["Quarter3"]).includes(String(vars["Current Month"]))) {
        log.info('Current month falls in Quarter 3 (Jul–Sep) — verifying dates against Quarter 3');
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["DatesCount"]))) {
          vars["IndividualQuarterDate"] = await bidRequestPage.Individual_Uploaded_Date(vars["count"]).textContent() || '';
          vars["IndividualQuarterDate"] = String(vars["IndividualQuarterDate"]).substring(0, String(vars["IndividualQuarterDate"]).length - 9).trim();
          log.info(`Iteration ${vars["count"]}: Verifying date month "${vars["IndividualQuarterDate"]}" is within Quarter 3`);
          expect(String(vars["Quarter3"])).toContain(vars["IndividualQuarterDate"]);
          vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
        }
      } else {
        log.info('Current month falls in Quarter 4 (Oct–Dec) — verifying dates against Quarter 4');
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["DatesCount"]))) {
          vars["IndividualQuarterDate"] = await bidRequestPage.Individual_Uploaded_Date(vars["count"]).textContent() || '';
          vars["IndividualQuarterDate"] = String(vars["IndividualQuarterDate"]).substring(0, String(vars["IndividualQuarterDate"]).length - 9).trim();
          log.info(`Iteration ${vars["count"]}: Verifying date month "${vars["IndividualQuarterDate"]}" is within Quarter 4`);
          expect(String(vars["Quarter4"])).toContain(vars["IndividualQuarterDate"]);
          vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
        }
      }
      log.stepPass('All uploaded dates verified against This Quarter filter');
    }

    // ── Filter: This Year ──────────────────────────────────────────────────────
    log.step('Applying Date Range filter: This Year');
    await priceOfferedPage.Filter_Dropdown1.click();
    await correspondentPortalPage.Select_Date_Range_Dropdown_Field.click();
    await correspondentPortalPage.This_Year_Button.click();
    vars["This Year Button"] = await correspondentPortalPage.Select_Date_Range_Dropdown_Value.textContent() || '';
    log.info(`Selected date range value: "${vars["This Year Button"]}"`);
    await expect(correspondentPortalPage.Select_Date_Range_Dropdown_Value).toContainText(vars["This Year"]);
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await page.waitForLoadState('load');

    // vars["Current Year"] = (() => {
    //   const d = new Date();
    //   const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata" };
    //   const fmt = "yyyy";
    //   // Map Java date format to Intl parts
    //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
    // })();
    // vars["count"] = "1";
    // vars["Date Count"] = String(await bidRequestPage.Uploaded_Date_Count.count());
    // while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["Date Count"]))) {
    //   vars["DateInList"] = await bidRequestPage.Individual_Uploaded_Date.textContent() || '';
    // }

    // Step 45: Store current year using IST timezone
    vars["Current Year"] = (() => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata" };
      const parts = new Intl.DateTimeFormat('en-US', {
        ...opts,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      }).formatToParts(d);
      const p = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
      return p.year || '';
    })();
    log.info(`Current year (IST): "${vars["Current Year"]}"`);

    // Step 46: Store count of Uploaded Date elements into Date Count
    vars["count"] = "1";
    vars["Date Count"] = String(await bidRequestPage.Uploaded_Date_Count.count());
    log.info(`Total uploaded dates to verify for This Year filter: ${vars["Date Count"]}`);

    // Step 47: Loop — verify each uploaded date's year matches Current Year
    while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["Date Count"]))) {
      // 47.1: Store text from Individual Uploaded Date into DateInList
      vars["DateInList"] = (await bidRequestPage.Individual_Uploaded_Date(vars["count"]).textContent() || '').trim();

      // 47.2: Remove last 7 characters from DateInList to extract year portion → IndividualYear(List)
      //vars["IndividualYear(List)"] = String(vars["DateInList"]).substring(String(vars["DateInList"]).length - 6,0).trim();
      vars["IndividualYear(List)"] = String(vars["DateInList"]).slice(-4).trim();
      log.info(`Individual year from list for row - ${vars["count"]} is - ${vars["IndividualYear(List)"]}`)

      // const individualYear = new Intl.DateTimeFormat('en-US', { year: 'numeric' })
      //   .format(new Date(vars["IndividualYear(List)"]));
      log.info(`Iteration ${vars["count"]}: Verifying year "${vars["IndividualYear(List)"]}" matches Current Year "${vars["Current Year"]}"`);
      expect(vars["IndividualYear(List)"]).toBe(vars["Current Year"]);

      // 47.4: Increment count by 1
      vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
    }
    log.stepPass('All uploaded dates verified against This Year filter');

    // ── Filter: Custom Date Range ──────────────────────────────────────────────
    log.step('Verifying a filter with Custom Date Range option');

    // Step 48: Click Filter Dropdown
    await priceOfferedPage.Filter_Dropdown1.click();

    // Step 49: Click Select Date Range Dropdown Field
    await correspondentPortalPage.Select_Date_Range_Dropdown_Field.click();

    // Step 50: Click Select Date From Custom Date Range
    await correspondentPortalPage.Select_Date_From_Custom_Date_Range.click();
    log.info('Opened Custom Date Range calendar');

    // Step 51: Store DateFunctions::Date Before Today in YesterdaysDate
    vars["YesterdaysDate"] = (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        //month: '2-digit',
        day: '2-digit',
        //year: 'numeric'
      }).format(d);
    })();
    //vars["YesterdaysDate"] = String(vars["YesterdaysDate"]).slice(3, 5).trim();
    
    log.info(`Yesterday's date (before leading-zero check): "${vars["YesterdaysDate"]}"`);

    // Step 52: IF YesterdaysDate contains "0" at position 0 (i.e. day has leading zero)
    if (String(vars["YesterdaysDate"]).charAt(0) === '0') {
      // 52.1: Remove leading 1 character from YesterdaysDate and store back into YesterdaysDate
      vars["YesterdaysDate"] = String(vars["YesterdaysDate"]).substring(1);
      log.info(`Leading zero removed — YesterdaysDate updated to: "${vars["YesterdaysDate"]}"`);
    }

    // Step 53: Store DateFunctions::Current Date in CurrentDate
    vars["CurrentDate"] = (() => {
      const d = new Date();
      return new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
      }).format(d);
    })();
if (String(vars["CurrentDate"]).charAt(0) === '0') {
      // 52.1: Remove leading 1 character from YesterdaysDate and store back into YesterdaysDate
      vars["CurrentDate"] = String(vars["CurrentDate"]).substring(1);
      log.info(`Leading zero removed — CurrentDate updated to: "${vars["CurrentDate"]}"`);
    }
    //vars["YesterdaysDate"] = String(vars["YesterdaysDate"]).slice(3, 5).trim();
    log.info(`Current date (IST): "${vars["CurrentDate"]}"`);

    // Step 54: IF Element "Select Date From Calendar(yesterday)" is visible
   // vars["yesterdaysDateCount"] = String(await correspondentPortalPage.Select_Date_From_Calenderyesterday(vars["YesterdaysDate"]).count());

    if (await correspondentPortalPage.Select_Date_From_Calenderyesterday(vars["YesterdaysDate"]).first().isVisible()) {
      // 54.1: Store "Yesterday" in Day
      vars["Day"] = "Yesterday";
      log.info(`Calendar shows yesterday's date — storing Day as "Yesterday" and clicking it`);
      // 54.2: Click on Select Date From Calendar(yesterday)
      await correspondentPortalPage.Select_Date_From_Calenderyesterday(vars["YesterdaysDate"]).first().click();
    } else {
      // Step 55 ELSE:
      // 55.1: Store "Today" in Day
      vars["Day"] = "Today";
      log.info(`Yesterday's date not visible in calendar — storing Day as "Today" and clicking current date`);
      // 55.2: Click on Select Date From Calendar(current date)
      await bidRequestListPage.Select_Date_From_CalenderCurrent_date(vars["CurrentDate"]).first().click();
    }

    // Step 55 (after IF/ELSE): Click Apply Button
    log.info('Clicking Apply Button to confirm custom date selection');
    await correspondentPortalPage.Apply_Button.click();

    // Step 56: Click Apply Filters Button
    log.info('Clicking Apply Filters Button');
    await applyFiltersButtonPage.Apply_Filters_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    // Step 57: Wait until the current page is loaded completely
    await page.waitForLoadState('load');
    log.info('Page loaded after applying Custom Date Range filter');

    // Step 58: IF page displays text "No result"
    if (await page.getByText("No result").isVisible()) {
      log.info('No results found for Custom Date Range filter — verifying "No result" message');
      await expect(page.getByText("No result")).toBeVisible();
    } else {
      // Step 59 ELSE: Verify uploaded dates match the selected custom date range
      log.info(`Results found for Custom Date Range filter — verifying dates match Day: "${vars["Day"]}"`);
      //await bidRequestPage.Uploaded_Date_Count.waitFor({ state: 'visible' });
      // 59.1: Store count of Uploaded Date elements into DateCount
      vars["DateCount"] = String(await bidRequestPage.Uploaded_Date_Count.count());
      log.info(`Total uploaded dates to verify: ${vars["DateCount"]}`);

      // 59.2: Store 1 in count
      vars["count"] = "1";

      // 59.3: Loop — verify each date matches yesterday or today depending on Day variable
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["DateCount"]))) {
        // 59.3.1: Store text from Individual Uploaded Date into IndividualDate
        vars["IndividualDate"] = (await bidRequestPage.Individual_Uploaded_Date(vars["count"]).textContent() || '').trim();

        // 59.3.2: Remove last 6 characters (time portion) from IndividualDate to get date part
        vars["IndividualDate"] = String(vars["IndividualDate"]).slice(3, 5).trim();
        log.info(`Individual Date from the list for row : ${vars["count"]} - "${vars["IndividualDate"]}"`);

        // 59.3.3: IF Day == "Yesterday"
        if (String(vars["Day"]) === "Yesterday") {
          // Verify YesterdaysDate with dd format equals IndividualDate with dd format
          // const expectedDay = new Intl.DateTimeFormat('en-US', { day: '2-digit', timeZone: 'Asia/Kolkata' })
          //   .format(new Date(vars["YesterdaysDate"]));
          // const actualDay = new Intl.DateTimeFormat('en-US', { day: '2-digit', timeZone: 'Asia/Kolkata' })
          //   .format(new Date(vars["IndividualDate"]));
          log.info(`Iteration ${vars["count"]}: Verifying IndividualDate day "${vars["IndividualDate"]}" matches YesterdaysDate day ${vars["YesterdaysDate"]}`);
          expect(vars["YesterdaysDate"]).toBe(vars["IndividualDate"]);
          log.info(`Dates are mateched for row ${vars["count"]}`);
        } else {
          // 59.3.4 ELSE: Verify CurrentDate with dd format equals IndividualDate with dd format
          // const expectedDay = new Intl.DateTimeFormat('en-US', { day: '2-digit', timeZone: 'Asia/Kolkata' })
          //   .format(new Date(vars["CurrentDate"]));
          // const actualDay = new Intl.DateTimeFormat('en-US', { day: '2-digit', timeZone: 'Asia/Kolkata' })
          //   .format(new Date(vars["IndividualDate"]));
          log.info(`Iteration ${vars["count"]}: Verifying day of IndividualDate "${vars["IndividualDate"]}" matches CurrentDate day "${vars["CurrentDate"]}"`);
          expect(vars["CurrentDate"]).toBe(vars["IndividualDate"]);
          log.info(`Dates are matched for row ${vars["count"]}`);
        }

        // 59.3.5: Increment count by 1
        vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
      }
      log.stepPass('All uploaded dates verified against Custom Date Range filter');
    }
  });
});