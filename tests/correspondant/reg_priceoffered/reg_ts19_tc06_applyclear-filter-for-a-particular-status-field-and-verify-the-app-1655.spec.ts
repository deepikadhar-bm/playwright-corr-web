import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { Logger as log } from '../../../src/helpers/log-helper';
import { AddonHelpers } from '../../../src/helpers/AddonHelpers';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { ENV } from '@config/environments';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { testDataManager } from 'testdata/TestDataManager';


const TC_ID = 'REG_TS19_TC06';
const TC_TITLE = 'Apply/Clear filter for a particular Status field and verify the apply filter functionality';

test.describe('REG_PriceOffered', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');
  const profileName = 'Price Offered';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars["Username"] = credentials.username;
    vars["Password"] = credentials.password;
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });


  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {
      if (profile && profile.data) {
        vars["StatusInFilters"] = profile.data[0]['StatusInFilters'];
      }
      log.info('StatusInFilters: ' + vars['StatusInFilters']);

      log.step('Login to CORR Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Logged in to CORR Portal successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to login to CORR Portal');
        throw e;
      }

      log.step('Navigate to Price Offered and open filters');
      try {
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await correspondentPortalPage.Price_Offered_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Filter_Dropdown1.click();
        log.stepPass('Navigated to Price Offered and filters panel opened successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Price Offered or open filters panel');
        throw e;
      }

      log.step('Search status in filters and capture count before clearing');
      try {
        await correspondentPortalPage.Select_Commitments_Status_Dropdown.click();
        await correspondentPortalPage.Dropdown_Search_In_Commitments_Status.click();
        await correspondentPortalPage.Dropdown_Search_In_Commitments_Status.fill(vars["StatusInFilters"]);
        log.info('StatusInFilters searched: ' + vars['StatusInFilters']);
        await Methods.verifyElementTextContainsCaseInsensitive(priceOfferedPage.Selected_Status, vars["StatusInFilters"]);
        vars["CountOfSelectedStatusBeforeClearing"] = String(await priceOfferedPage.Selected_Status.count());
        log.info('CountOfSelectedStatusBeforeClearing: ' + vars['CountOfSelectedStatusBeforeClearing']);
        log.stepPass('Status search applied and matching results verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to search status in filters or verify matching results');
        throw e;
      }

      log.step('Clear search and verify total status count is greater than or equal to filtered count');
      try {
        await correspondentPortalPage.Clear_Search_Button.click();
        vars["StatusCountInFilters"] = String(await priceOfferedPage.Status_Count_In_Filters.count());
        log.info('StatusCountInFilters after clear: ' + vars['StatusCountInFilters']);
        expect(Methods.verifyComparison(vars["CountOfSelectedStatusBeforeClearing"], '<=', vars["StatusCountInFilters"]));
        log.stepPass('Search cleared and total status count verified successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to clear search or total status count is less than filtered count');
        throw e;
      }

      log.step('Select first status checkbox and verify selection count is 1');
      try {
        await priceOfferedPage.Status_Checkbox.first().check();
        vars["CheckedStatus"] = await priceOfferedPage.Checked_Status.first().textContent() || '';
        Methods.trimtestdata(vars["CheckedStatus"], 'CheckedStatus');
        log.info('CheckedStatus: ' + vars['CheckedStatus']);
        await correspondentPortalPage.Dropdown_Show_Selected_In_Status.click();
        vars["CountOfstatusChecked"] = (await priceOfferedPage.number_of_items_selected.textContent() || '');
        Methods.trimtestdata(vars["CountOfstatusChecked"], 'CountOfstatusChecked');
        log.info('CountOfstatusChecked: ' + vars['CountOfstatusChecked']);
        Methods.verifyString(vars["CountOfstatusChecked"], 'equals', appconstants.ONE);
        vars["SelectedstatusInFilterCount"] = String(await priceOfferedPage.Selected_Company_Count_in_Filters.count());
        log.info('SelectedstatusInFilterCount: ' + vars['SelectedstatusInFilterCount']);
        Methods.verifyString(vars["SelectedstatusInFilterCount"], 'equals', appconstants.ONE);
        log.stepPass('First status selected and selection count verified as 1 successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to select first status or selection count is not 1');
        throw e;
      }

      log.step('Show all statuses and verify Select All behaviour');
      try {
        await correspondentPortalPage.Show_All_Button.click();
        vars["TotalStatusCountInFilters"] = String(await priceOfferedPage.Status_Count_In_Filters.count());
        log.info('TotalStatusCountInFilters: ' + vars['TotalStatusCountInFilters']);
        expect(Methods.verifyComparison(vars["CountOfSelectedStatusBeforeClearing"], '<=', vars["TotalStatusCountInFilters"]));
        await expect(priceOfferedPage.Apply_Selected_In_Status).toBeEnabled();
        await priceOfferedPage.Select_All_In_Status.click();
        vars["CountOfItemsSelected"] = await priceOfferedPage.Items_Selected.textContent() || '';
        Methods.trimtestdata(vars["CountOfItemsSelected"], 'CountOfItemsSelected');
        log.info('CountOfItemsSelected after Select All: ' + vars['CountOfItemsSelected']);
        expect(Methods.verifyComparison(vars["CountOfSelectedStatusBeforeClearing"], '<', vars["CountOfItemsSelected"]));
        await priceOfferedPage.Select_All_In_Status.click();
        await priceOfferedPage.Filter_Dropdown1.click();
        log.stepPass('Show All verified and Select All behaviour validated successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to verify Show All or Select All behaviour');
        throw e;
      }
      log.step('Iterate each status option, apply filter and verify all visible records match the status');
      try {

        vars["count"] = appconstants.ONE;
        log.info('TotalStatusCountInFilters to iterate: ' + vars['TotalStatusCountInFilters']);

        while (parseFloat(vars["count"]) <= parseFloat(vars["TotalStatusCountInFilters"])) {

          await priceOfferedPage.Filter_Dropdown1.click();
          await correspondentPortalPage.Select_Commitments_Status_Dropdown.waitFor({ state: 'visible' });
          await correspondentPortalPage.Select_Commitments_Status_Dropdown.click();
          vars["IndividualStatusInFilters"] = await priceOfferedPage.Individual_Status_In_Filters(vars["count"]).textContent() || '';
          Methods.trimtestdata(vars["IndividualStatusInFilters"], 'IndividualStatusInFilters');
          log.info('Processing Status' + vars['count'] + ': ' + vars['IndividualStatusInFilters']);

          await priceOfferedPage.Individual_Status_In_Filters(vars["count"]).click();
          await expect(priceOfferedPage.Apply_Selected_In_Status).toBeEnabled();
          await priceOfferedPage.Apply_Selected_In_Status.click();
          await applyFiltersButtonPage.Apply_Filters_Button.click();
          await spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 10000 });
          await expect(priceOfferedPage.Filtered_In_Status).toBeVisible();
          await page.waitForTimeout(5000);
          vars["Count"] = appconstants.ONE;
          vars["RowCount"] = String(await priceOfferedPage.Row_Count.count());
          log.info('RowCount on page 1: ' + vars['RowCount']);

          if (String(vars["IndividualStatusInFilters"]) === appconstants.COMMITMENT_IN_PROGRESS_STATUS1) {
            log.info('Individual status in filter matches Commitment In Progress');
            while (parseFloat(vars["Count"]) <= parseFloat(vars["RowCount"])) {
              await priceOfferedPage.Loans_Header_Text.click();
              if (await priceOfferedPage.Status_Individual(vars["Count"]).isVisible()) {
                Methods.trimtestdata(vars["IndividualStatusInFilters"], 'IndividualStatusInFilters');
                vars["IndividualStatusInScreen"] = await priceOfferedPage.Status_Individual(vars["Count"]).textContent() || '';
                Methods.trimtestdata(vars["IndividualStatusInScreen"], 'IndividualStatusInScreen');
                Methods.verifyTestdataIgnoreCase(vars["IndividualStatusInScreen"], 'equals', vars["IndividualStatusInFilters"]);
              } else {
                await expect(page.getByText("No result")).toBeVisible();
              }
              Methods.MathematicalOperation(vars["Count"], '+', 1, 'Count');
            }
          } else {
            await page.waitForTimeout(2000);
            await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Status_Individual_In_Screen, vars["IndividualStatusInFilters"]);
          }

          const NextButton = correspondentPortalPage.Go_to_Next_Page_Button_2;

          if (await NextButton.isVisible() && await NextButton.isEnabled()) {
            log.info('Next page detected — navigating to page 2 for status: ' + vars['IndividualStatusInFilters']);
            await NextButton.click(),
              spinnerPage.Spinner.waitFor({ state: 'hidden', timeout: 20000 });

            vars["RowCount2"] = String(await priceOfferedPage.Status_Individual_In_Screen.count());
            vars["CCount"] = appconstants.ONE;
            log.info('RowCount on page 2: ' + vars['RowCount2']);

            if (String(vars["IndividualStatusInFilters"]) === appconstants.COMMITMENT_IN_PROGRESS_STATUS1) {
              log.info('Individual status in filter matches Commitment In Progress');
              while (Number(vars["CCount"]) < Number(vars["RowCount2"])) {
                vars['IndividualStatusInScreen2'] = await priceOfferedPage.Status_Individual(vars["CCount"]).textContent() || '';
                Methods.trimtestdata(vars['IndividualStatusInScreen2'], 'IndividualStatusInScreen2');
                if (vars['IndividualStatusInScreen2'] === vars["IndividualStatusInFilters"]) {
                  Methods.verifyTestdataIgnoreCase(vars['IndividualStatusInScreen2'], 'equals', vars["IndividualStatusInFilters"]);
                } else {
                  await expect(page.getByText("No result")).toBeVisible();
                }
                Methods.MathematicalOperation(vars["CCount"], '+', 1, 'CCount');
              }
            } else {
              await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Status_Individual_In_Screen, vars["IndividualStatusInFilters"]);
            }
          }

          await priceOfferedPage.Filter_Dropdown1.click();
          await priceOfferedPage.Clear_All_In_Filter.click();
          await expect(priceOfferedPage.Filtered_In_Status).not.toBeVisible();
          log.info('Filter cleared for status: ' + vars['IndividualStatusInFilters']);
          Methods.MathematicalOperation(vars["count"], '+', 1, 'count');
        }
        log.stepPass('All status options iterated and records verified successfully across pages');
      } catch (e) {
        await log.stepFail(page, 'Status iteration or record verification failed — status: ' + vars['IndividualStatusInFilters']);
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