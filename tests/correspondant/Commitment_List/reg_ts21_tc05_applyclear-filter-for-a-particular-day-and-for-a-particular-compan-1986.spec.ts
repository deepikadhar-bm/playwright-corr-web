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


const TC_ID = 'REG_TS21_TC05';
const TC_TITLE = 'Apply/Clear filter for a particular day and for a particular company in open list and verify that same filter should be applied in closed list';

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

      log.step('Login to Correspondent Portal');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        log.stepPass('Logged in to Correspondent Portal');
      } catch (e) {
        await log.stepFail(page, 'Failed to login to Correspondent Portal');
        throw e;
      }

      log.step('Navigate to Commitment List and apply date and company filters on Open List');
      try {
        if (profile && profile.data) {
          vars['CompanyNameInFilters'] = profile.data[0]['CompanyNameInFilters'];
          log.info('CompanyNameInFilters: ' + vars['CompanyNameInFilters']);
        }
        await correspondentPortalPage.Commitments_Side_Menu.click();
        await commitmentListPage.Committed_List_Dropdown.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Filter_Dropdown1.click();
        await correspondentPortalPage.Select_Date_Range_Dropdown.click();
        await correspondentPortalPage.Current_Date_On_Filters.click();
        Methods.getCurrentTimestamp(appconstants.DATE_FORMAT_DMYYYY, 'CurrentDate', appconstants.UTC);
        log.info('CurrentDate: ' + vars['CurrentDate']);
        await correspondentPortalPage.Select_Current_DateAdd_Config(vars['CurrentDate']).click();
        await correspondentPortalPage.Apply_Button.click();
        await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
        await priceOfferedPage.Search_In_Select_Company.click();
        await priceOfferedPage.Search_In_Select_Company.fill(vars['CompanyNameInFilters']);
        await priceOfferedPage.Check_Company.first().click();
        vars['SelectedCompanyName'] = await priceOfferedPage.Selected_Company.first().textContent() || '';
        Methods.splitBySpecialChar(vars['SelectedCompanyName'], '(', '0', 'SelectedCompanyName');
        Methods.trimtestdata(vars['SelectedCompanyName'], 'SelectedCompany');
        log.info('SelectedCompanyName: ' + vars['SelectedCompanyName']);
        await correspondentPortalPage.Apply_Selected.click();
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
        Methods.convertDateFormat(vars['CurrentDate'], appconstants.DATE_FORMAT_DMYYYY, appconstants.DATE_FORMAT_YYYYMMDD, 'CurrentDateChip');
        Methods.concatenateWithSpace(appconstants.DATE_TEXT, vars['CurrentDateChip'], 'CurrentDateWithTextDate');
        Methods.concatenateWithSpace(appconstants.COMPANY_TEXT, vars['SelectedCompanyName'], 'CompanyWithText');
        log.info('CurrentDateChip: ' + vars['CurrentDateChip']);
        log.info('CurrentDateWithTextDate: ' + vars['CurrentDateWithTextDate']);
        log.info('CompanyWithText: ' + vars['CompanyWithText']);
        log.stepPass('Date and company filters applied. Date: ' + vars['CurrentDateChip'] + ' | Company: ' + vars['SelectedCompanyName']);
      } catch (e) {
        await log.stepFail(page, 'Failed to apply date and company filters on Open List');
        throw e;
      }

      log.step('Verify date and company filter chips visible on Open List');
      try {
        await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();
        await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toContainText(vars['SelectedCompanyName']);
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars['CurrentDateChip']);
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars['CurrentDateWithTextDate']);
        await expect(commitmentListPage.Company_Filter_ChipCommitted_Page).toContainText(vars['CompanyWithText']);
        log.stepPass('Date and company filter chips verified on Open List');
      } catch (e) {
        await log.stepFail(page, 'Date or company filter chip not visible or incorrect on Open List');
        throw e;
      }

      log.step('Verify all Open List records match selected date and company');
      try {
        const NextButton = correspondentPortalPage.Go_to_Next_Page_Button;
        if (await NextButton.isVisible()) {
          vars['CountofPages'] = appconstants.TWO;
        } else {
          vars['CountofPages'] = appconstants.ONE;
        }
        log.info('CountofPages: ' + vars['CountofPages']);
        vars['count'] = appconstants.ONE;
        const noResults = page.getByText('No result', { exact: true });
        await page.waitForTimeout(2000);
        if (await noResults.isVisible()) {
          log.info('No results present on Open List');
        } else {
          Methods.convertDateFormat(vars['CurrentDate'], appconstants.DATE_FORMAT_DMYYYY, appconstants.DATE_FORMAT_MMDDYYYY, 'ExpectedDate');
          log.info('ExpectedDate: ' + vars['ExpectedDate']);
          while (parseFloat(String(vars['count'])) <= parseFloat(String(vars['CountofPages']))) {
            await commitmentListPage.Committed_Date.first().waitFor({ state: 'visible' });
            await Methods.verifyMultipleElementsHaveSameText(commitmentListPage.Committed_Date, vars['ExpectedDate']);
            await Methods.verifyMultipleElementsHaveSameText(priceOfferedPage.Price_Offered_Company_Name_Column_Data, vars['SelectedCompanyName']);
            if (await NextButton.isVisible() && await NextButton.isEnabled()) {
              await correspondentPortalPage.Go_to_Next_Page_Button.click();
              await spinnerPage.Spinner.waitFor({ state: 'hidden' });
            }
            Methods.MathematicalOperation(vars['count'], '+', 1, 'count');
          }
        }
        log.stepPass('All Open List records verified against date: ' + vars['ExpectedDate'] + ' | company: ' + vars['SelectedCompanyName']);
      } catch (e) {
        await log.stepFail(page, 'Open List record mismatch. Expected date: ' + vars['ExpectedDate'] + ' | company: ' + vars['SelectedCompanyName']);
        throw e;
      }

      log.step('Switch to Closed List tab and verify same filters are retained');
      try {
        await commitmentListPage.Closed_List_Tab.waitFor({ state: 'visible' });
        await commitmentListPage.Closed_List_Tab.evaluate((el: HTMLElement) => {
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          el.click();
        });
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await priceOfferedPage.Date_Filter_ChipPrice_Offered_Page.waitFor({ state: 'visible' });
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars['CurrentDateChip']);
        await expect(priceOfferedPage.Date_Filter_ChipPrice_Offered_Page).toContainText(vars['CurrentDateWithTextDate']);
        await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toBeVisible();
        await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toContainText(vars['SelectedCompanyName']);
        await expect(priceOfferedPage.Company_Filter_ChipPrice_Offered_Page).toContainText(vars['CompanyWithText']);
        log.stepPass('Filters retained on Closed List tab. Date: ' + vars['CurrentDateChip'] + ' | Company: ' + vars['SelectedCompanyName']);
      } catch (e) {
        await log.stepFail(page, 'Filters not retained on Closed List tab');
        throw e;
      }

      log.step('Verify all Closed List records match selected date and company');
      try {
        const noResults2 = page.getByText('No result', { exact: true });
        await page.waitForTimeout(2000);
        if (await noResults2.isVisible()) {
          log.info('No results present on Closed List');
        } else {
          await stepGroups.stepGroup_Data_Verification_After_Applying_FiltersCommitment_List(page, vars);
        }
        log.stepPass('Closed List records verified against date: ' + vars['ExpectedDate'] + ' | company: ' + vars['SelectedCompanyName']);
      } catch (e) {
        await log.stepFail(page, 'Closed List record mismatch. Expected date: ' + vars['ExpectedDate'] + ' | company: ' + vars['SelectedCompanyName']);
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