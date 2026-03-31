// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { Logger as log } from '../../../src/helpers/log-helper';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ENV } from '@config/environments'
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';


test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');


  test.beforeEach(async ({ page }) => {
    vars = {};
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  const TC_ID = 'REG_TS19_TC06';
  const TC_TITLE = 'Apply/Clear filter for a particular Status field and verify the apply filter functionality';


  const profileName = "Price Offered";
  const profile = testDataManager.getProfileByName(profileName);
  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {
      if (profile && profile.data) {
        const statusInFilters = profile.data[0]['StatusInFilters'];
        vars["StatusInFilters"] = statusInFilters;
        vars["Username"] = credentials.username;
        vars["Password"] = credentials.password;
      }
      log.step(`Step 1: Login to CORR Portal`);
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass(`Step 1 passed: Logged in to CORR Portal successfully`);
      } catch (error) {
        log.stepFail(page, `Step 1 failed: Failed to login to CORR Portal`);
        throw error;
      }

      log.step(`Step 2: Open Price Offered and filters`);
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Filter_Dropdown1.click();
        log.stepPass(`Step 2 passed: Price Offered opened and filters visible`);
      } catch (error) {
        log.stepFail(page, `Step 2 failed: Failed to open Price Offered and filters`);
        throw error;
      }

      log.step(`Step 3: Search Status in filters`);
      try {
        await correspondentPortalPage.Select_Commitments_Status_Dropdown.click();
        await correspondentPortalPage.Dropdown_Search_In_Commitments_Status.click();
        await Methods.clearAndEnterText(correspondentPortalPage.Dropdown_Search_In_Commitments_Status, undefined, vars["StatusInFilters"]);
        await page.waitForTimeout(1200);
        await Methods.verifyElementTextContainsCaseInsensitive(priceOfferedPage.Selected_Status, undefined, vars["StatusInFilters"]);
        vars["CountOfSelectedStatusBeforeClearing"] = String(await priceOfferedPage.Selected_Status.count());
        log.stepPass(`Step 3 passed: Status search applied and selection visible`);
      } catch (error) {
        log.stepFail(page, `Step 3 failed: Failed to search status in filters`);
        throw error;
      }

      log.step(`Step 4: Clear search and verify counts`);
      try {
        await correspondentPortalPage.Clear_Search_Button.click();
        vars["StatusCountInFilters"] = String(await priceOfferedPage.Status_Count_In_Filters.count());
        expect(parseFloat(vars["CountOfSelectedStatusBeforeClearing"])).toBeLessThanOrEqual(parseFloat(vars["StatusCountInFilters"]));
        log.stepPass(`Step 4 passed: Search cleared and counts verified`);
      } catch (error) {
        log.stepFail(page, `Step 4 failed: Failed to clear search or verify counts`);
        throw error;
      }

      log.step(`Step 5: Select a status and verify selection count`);
      try {
        await priceOfferedPage.Status_Checkbox.nth(0).check();
        vars["CheckedStatus"] = await priceOfferedPage.Checked_Status.nth(0).textContent() || '';
        await correspondentPortalPage.Dropdown_Show_Selected_In_Status.click();
        vars["CountOfstatusChecked"] = (await priceOfferedPage.number_of_items_selected.textContent() || '').trim();
        expect(String("1")).toBe(vars["CountOfstatusChecked"]);
        vars["SelectedstatusInFilterCount"] = String(await priceOfferedPage.Selected_Company_Count_in_Filters.count());
        expect(String("1")).toBe(vars["SelectedstatusInFilterCount"]);
        log.stepPass(`Step 5 passed: Status selected and counts are correct`);
      } catch (error) {
        log.stepFail(page, `Step 5 failed: Failed to select status or verify selection count`);
        throw error;
      }

      log.step(`Step 6: Show all and validate total status count`);
      try {
        await correspondentPortalPage.Show_All_Button.click();
        vars["TotalStatusCountInFilters"] = String(await priceOfferedPage.Status_Count_In_Filters.count());
        expect(parseFloat(vars["CountOfSelectedStatusBeforeClearing"])).toBeLessThanOrEqual(parseFloat(vars["TotalStatusCountInFilters"]));
        await expect(priceOfferedPage.Apply_Selected_In_Status).toBeVisible();
        await priceOfferedPage.Select_All_In_Status.click();
        vars["CountOfItemsSelected"] = await priceOfferedPage.Items_Selected.textContent() || '';
        expect(parseFloat(vars["CountOfSelectedStatusBeforeClearing"])).toBeLessThan(parseFloat(vars["CountOfItemsSelected"]));
        await priceOfferedPage.Select_All_In_Status.click();
        log.stepPass(`Step 6 passed: Show all and select-all validated`);
      } catch (error) {
        log.stepFail(page, `Step 6 failed: Show all or select-all failed`);
        throw error;
      }

      await priceOfferedPage.Filter_Dropdown1.click();
      // await priceOfferedPage.Filter_Dropdown1.click();
      vars["count"] = appconstants.ONE;
      log.step(`Step 7: Iterate each status option and verify rows`);
      try {
        while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalStatusCountInFilters"]))) {
          await priceOfferedPage.Filter_Dropdown1.click();
          await correspondentPortalPage.Select_Commitments_Status_Dropdown.waitFor({ state: 'visible' });
          await correspondentPortalPage.Select_Commitments_Status_Dropdown.click();
          vars["IndividualStatusInFilters"] = await priceOfferedPage.Individual_Status_In_Filters(vars["count"]).textContent() || '';
          vars["IndividualStatusInFilters"] = String(vars["IndividualStatusInFilters"]).trim();
          await priceOfferedPage.Individual_Status_In_Filters(vars["count"]).click();
          await priceOfferedPage.Apply_Selected_In_Status.click();
          await applyFiltersButtonPage.Apply_Filters_Button.click();
          // await spinnerPage.Spinner.waitFor({ state: 'visible', timeout: 10000 });
          await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 10000 });
          await expect(priceOfferedPage.Filtered_In_Status).toBeVisible();

          vars["Count"] = appconstants.ONE;
          vars["RowCount"] = String(await priceOfferedPage.Row_Count.count());
          if (vars["RowCount"] >appconstants.ONE) {

            if (String(vars["IndividualStatusInFilters"]) === String("Commitment in Progress")) {
              while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["RowCount"]))) {
                await priceOfferedPage.Loans_Header_Text.click();
                if (await priceOfferedPage.Status_Individual(vars["Count"]).isVisible()) /* Element Status Individual is visible */ {
                  await Methods.verifyElementTextContainsCaseInsensitive(priceOfferedPage.Status_Individual(vars["Count"]), undefined, vars["IndividualStatusInFilters"]);
                  vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
                } else {
                  await expect(page.getByText("No result")).toBeVisible();
                }
              }
            } else {
              await page.waitForTimeout(2000);
              await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Status_Individual_In_Screen, vars["IndividualStatusInFilters"]);
            }
          } else {
            await expect(page.getByText("No result")).toBeVisible();
          }



          const nextBtn = correspondentPortalPage.Go_to_Next_Page_Button_2;
          const hasNextPage = (await nextBtn.count()) > 0 && await nextBtn.isVisible() && await nextBtn.isEnabled();

          if (hasNextPage) {
            await Promise.all([nextBtn.click(), spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 15000 })]);
            // vars["RowCount2"] = String(await priceOfferedPage.Row_Count.count());
            // vars["CCount"] = "0";
            // if (String(vars["IndividualStatusInFilters"]) === String("Commitment in Progress")) {
            //   while (parseFloat(String(vars["CCount"])) < parseFloat(String(vars["RowCount2"]))) {
            //     if (await priceOfferedPage.Status_Individual(vars["CCount"]).isVisible()) /* Element Status Individual is visible */ {
            //       await Methods.verifyElementTextContainsCaseInsensitive(priceOfferedPage.Status_Individual(parseInt(vars["CCount"])), undefined, vars["IndividualStatusInFilters"]);
            //       vars["CCount"] = (parseFloat(String("1")) + parseFloat(String(vars["CCount"]))).toFixed(0);
            //     } else {
            //       await expect(page.getByText("No result")).toBeVisible();
            //     }
            //   }
            // } else {
            //   await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Status_Individual_In_Screen, vars["IndividualStatusInFilters"]);
            // }
            vars["RowCount2"] = String(await priceOfferedPage.Status_Individual_In_Screen.count());
            vars["CCount"] = appconstants.ZERO;

            if (vars["IndividualStatusInFilters"] === "Commitment in Progress") {

              while (Number(vars["CCount"]) < Number(vars["RowCount2"])) {

                const index = Number(vars["CCount"]);
                const status = priceOfferedPage.Status_Individual(vars["CCount"]);

                if (await status.isVisible()) {
                  await Methods.verifyElementTextContainsCaseInsensitive(
                    status,
                    undefined,
                    vars["IndividualStatusInFilters"]
                  );

                  vars["CCount"] = String(index + 1);

                } else {
                  await expect(page.getByText("No result")).toBeVisible();
                }
              }

            } else {
              await Methods.verifyMultipleElementsHaveSameText(
                priceOfferedPage.Status_Individual_In_Screen,
                vars["IndividualStatusInFilters"]
              );
            }
          }

          await priceOfferedPage.Filter_Dropdown1.click();
          await priceOfferedPage.Clear_All_In_Filter.click();
          await expect(priceOfferedPage.Filtered_In_Status).not.toBeVisible();
          vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
        }
        log.stepPass(`Step 7 passed: Verified status rows across pages`);
      } catch (error) {
        log.stepFail(page, `Step 7 failed: Error while verifying status rows`);
        throw error;
      }
    } catch (error) {
      log.captureOnFailure(page, TC_ID, error);
      log.tcEnd('FAIL');
      throw error;
    }
  });
});  
