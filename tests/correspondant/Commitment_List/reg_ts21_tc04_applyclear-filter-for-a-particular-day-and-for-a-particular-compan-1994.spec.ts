import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';
import { ENV } from '@config/environments';
import { Logger as log } from '@helpers/log-helper';


const TC_ID = 'REG_TS21_TC04';
const TC_TITLE = 'Apply/Clear filter for a particular day and for a particular company in closed list and verify that same filter should be applied in open list';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  const profileName = 'Price Offered';
  const profile = testDataManager.getProfileByName(profileName);

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {
      log.step('Login to CORR portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Login successful');
      } catch (e) {
        await log.stepFail(page, 'Login failed');
        throw e;
      }
      log.step('Navigate to commitment closed list tab');
      try {
        if (profile && profile.data) {
          vars['CompanyNameInFilters'] = profile.data[0]['CompanyNameInFilters'];
          log.info('CompanyNameInFilters: ' + vars['CompanyNameInFilters']);
        }
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
        await commitmentListPage.Closed_List_Tab.evaluate((el: HTMLElement) => {
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          el.click();
        });
        await commitmentListPage.Commitment_List_Text.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Commitment_List_Text).toBeVisible();
        await commitmentListPage.Closed_Date.waitFor({ state: 'visible' });
        await expect(commitmentListPage.Closed_Date).toBeVisible();
        log.stepPass('Successfully navigated to commitment closed list tab');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate commitment closed list');
        throw e;
      }

      log.step('Select date and company filters and apply');
      try {
        await stepGroups.stepGroup_Selecting_Date_from_the_filters_by_fetching_the_first_comm_d(page, vars);
        Methods.convertDateFormat(vars['ExpectedCommDate'], appconstants.DATE_FORMAT_MMDDYYYY, appconstants. DATE_FORMATEYYYYMMDD, 'ExpectedChipDate');
        log.info('ExpectedCommDate: ' + vars['ExpectedCommDate']);
        log.info('ExpectedChipDate: ' + vars['ExpectedChipDate']);
        await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
        await priceOfferedPage.Search_In_Select_Company.click();
        await priceOfferedPage.Search_In_Select_Company.fill(vars['CompanyNameInFilters']);
        await priceOfferedPage.Check_Company.first().click();
        vars['SelectedCompanyName'] = await priceOfferedPage.Selected_Company.textContent() || '';
        Methods.splitBySpecialChar(vars['SelectedCompanyName'], '(', '0', 'SelectedCompanyName');
        Methods.trimtestdata(vars['SelectedCompanyName'], 'SelectedCompany');
        vars['SelectedCompanyName'] = String(vars['SelectedCompanyName']).trim();
        log.info('SelectedCompanyName: ' + vars['SelectedCompanyName']);
        await correspondentPortalPage.Apply_Selected.click();
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        Methods.concatenateWithSpace(appconstants.DATE_TEXT,vars['ExpectedChipDate'],'DateWithTextDate');
        Methods.concatenateWithSpace(appconstants.COMPANY_TEXT,vars['SelectedCompanyName'],'CompanyNamewithText');
        log.stepPass('Date and company filters applied Date: ' + vars['ExpectedChipDate'] + 'Company: ' + vars['SelectedCompanyName']);
      } catch (e) {
        await log.stepFail(page, 'Failed to apply date and company filters');
        throw e;
      }

      log.step('Verify date and company filter chips visible on Closed List');
      try {
        await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();
        await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toContainText(vars['SelectedCompanyName']);
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars['ExpectedChipDate']);
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars['DateWithTextDate']);
        await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toContainText(vars['CompanyNamewithText']);
        log.stepPass('Date and company filter chips verified on Closed List');
      } catch (e) {
        await log.stepFail(page, 'Date or company filter chip not visible or incorrect on Closed List');
        throw e;
      }

      log.step('Verify all Closed List records match selected date and company');
      try {
        const NextButton1 = correspondentPortalPage.Go_to_Next_Page_Button;
        if (await NextButton1.isVisible()) {
          vars['CountofPages'] = appconstants.TWO;
        } else {
          vars['CountofPages'] = appconstants.ONE;
        }
        log.info('CountofPages: ' + vars['CountofPages']);
        vars['count'] = appconstants.ONE;
        const noResults = page.getByText('No result', { exact: true });
        await page.waitForTimeout(2000);
        if (await noResults.isVisible()) {
          log.info('No results present on Closed List');
        } else {
          while (parseFloat(String(vars['count'])) <= parseFloat(String(vars['CountofPages']))) {
            await commitmentListPage.Committed_Date.first().waitFor({ state: 'visible' });
            await Methods.verifyMultipleElementsHaveSameText(commitmentListPage.Committed_Date, vars['ExpectedCommDate']);
            await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Price_Offered_Company_Name_Column_Data, vars['SelectedCompanyName']);
            if (await NextButton1.isVisible() && await NextButton1.isEnabled()) {
              await correspondentPortalPage.Go_to_Next_Page_Button.click();
              await spinnerPage.Spinner.waitFor({ state: 'hidden' });
            }
            Methods.MathematicalOperation(vars['count'], '+', 1, 'count');
          }
        }
        log.stepPass('All Closed List records verified against date: ' + vars['ExpectedCommDate'] + ' | company: ' + vars['SelectedCompanyName']);
      } catch (e) {
        await log.stepFail(page, 'Closed List record mismatch. Expected date: ' + vars['ExpectedCommDate'] + ' | company: ' + vars['SelectedCompanyName']);
        throw e;
      }

      log.step('Switch to Open List tab and verify same filters are retained');
      try {
        await commitmentListPage.Open_List_Tab.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await commitmentListPage.Closed_Date.waitFor({ state: 'hidden' });
        await expect(commitmentListPage.Closed_Date).not.toBeVisible();
        await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars['ExpectedChipDate']);
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars['DateWithTextDate']);
        await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();
        await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toContainText(vars['SelectedCompanyName']);
        await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toContainText(vars['CompanyNamewithText']);
        log.stepPass('Filters retained on Open List tab. Date: ' + vars['ExpectedChipDate'] + ' | Company: ' + vars['SelectedCompanyName']);
      } catch (e) {
        await log.stepFail(page, 'Filters not retained on Open List tab');
        throw e;
      }

      log.step('Verify all Open List records match selected date and company');
      try {
        const NextButton2 = correspondentPortalPage.Go_to_Next_Page_Button;
        if (await NextButton2.isVisible()) {
          vars['CountofPages'] = appconstants.TWO;
        } else {
          vars['CountofPages'] = appconstants.ONE;
        }
        log.info('CountofPages: ' + vars['CountofPages']);
        vars['count'] = appconstants.ONE;
        const noResults2 = page.getByText('No result', { exact: true });
        await page.waitForTimeout(2000);
        if (await noResults2.isVisible()) {
          log.info('No results present on Open List');
        } else {
          while (parseFloat(String(vars['count'])) <= parseFloat(String(vars['CountofPages']))) {
            await commitmentListPage.Committed_Date.first().waitFor({ state: 'visible' });
            await Methods.verifyMultipleElementsHaveSameText(commitmentListPage.Committed_Date, vars['ExpectedCommDate']);
            await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Price_Offered_Company_Name_Column_Data, vars['SelectedCompanyName']);
            if (await NextButton2.isVisible() && await NextButton2.isEnabled()) {
              await correspondentPortalPage.Go_to_Next_Page_Button.click();
              await spinnerPage.Spinner.waitFor({ state: 'hidden' });
            }
            Methods.MathematicalOperation(vars['count'], '+', 1, 'count');
          }
        }
        log.stepPass('All Open List records verified against date: ' + vars['ExpectedCommDate'] + ' | company: ' + vars['SelectedCompanyName']);
      } catch (e) {
        await log.stepFail(page, 'Open List record mismatch. Expected date: ' + vars['ExpectedCommDate'] + ' | company: ' + vars['SelectedCompanyName']);
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