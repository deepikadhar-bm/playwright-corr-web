import { test, expect } from '@playwright/test';
import * as stepGroups from '../../../src/helpers/step-groups';
import { ApplyFiltersButtonPage } from '../../../src/pages/correspondant/apply-filters-button';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { BidRequestListPage } from '../../../src/pages/correspondant/bid-request-list';
import { BidrequestPage } from '../../../src/pages/correspondant/bidrequest';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { Logger as log } from '@helpers/log-helper';
import { ENV } from '@config/environments';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';


const TC_ID = 'REG_TS22_TC04_01';
const TC_TITLE = 'Perform the resubmit for pricing action for a bid with the Chase execution type, and validate all the values in the resubmitted record . (Target: Submit today, status :Expired)';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let applyFiltersButtonPage: ApplyFiltersButtonPage;
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let bidRequestListPage: BidRequestListPage;
  let bidrequestPage: BidrequestPage;
  let bidRequestPage: BidRequestPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let spinnerPage: SpinnerPage;
  let statusInactivePage: StatusInactivePage;
  let Methods: AddonHelpers;
  const credentials = ENV.getCredentials('internal');

  const profileName = 'Bid Requests';
  const profile = testDataManager.getProfileByName(profileName);

  test.beforeEach(async ({ page }) => {
    vars = {};
    vars['Username'] = credentials.username;
    vars['Password'] = credentials.password;
    applyFiltersButtonPage = new ApplyFiltersButtonPage(page);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    bidRequestListPage = new BidRequestListPage(page);
    bidrequestPage = new BidrequestPage(page);
    bidRequestPage = new BidRequestPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    spinnerPage = new SpinnerPage(page);
    statusInactivePage = new StatusInactivePage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);

    try {

      log.step('Load test data from profile');
      try {
        if (profile && profile.data) {
          vars['CompanyName'] = profile.data[0]['Company Name'];
          log.info('Company Name: ' + vars['CompanyName']);
        }
        log.stepPass('Test data loaded from profile successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to load test data from profile');
        throw e;
      }

      log.step('Login to CORR Portal and delete early config report if present');
      try {
        await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
        await stepGroups.stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
        log.stepPass('Login to CORR Portal and early config report deleted successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to login to CORR Portal or delete early config report');
        throw e;
      }

      log.step('Navigate to Bulk Batch Timing and capture buffer time');
      try {
        await stepGroups.stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
        vars['BufferTime'] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
        log.info('BufferTime: ' + vars['BufferTime']);
        log.stepPass('Navigated to Bulk Batch Timing and buffer time captured successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bulk Batch Timing or capture buffer time');
        throw e;
      }

      log.step('Navigate to Bid Requests and apply company and status filters');
      try {
        await correspondentPortalPage.Bid_Requests_Side_Menu.click();
        await page.waitForLoadState('load');
        await priceOfferedPage.Filter_Dropdown1.click();
        await correspondentPortalPage.Select_CompanyCCode_Dropdown1.click();
        await bidRequestListPage.Required_Company_Checkbox_filter(vars['CompanyName']).check();
        await correspondentPortalPage.Apply_Selected_1_button_in_Rule.first().click();
        vars['StatusToBeSelected'] = appconstants.EXPIRED_STATUS;
        log.info('StatusToBeSelected: ' + vars['StatusToBeSelected']);
        await correspondentPortalPage.Select_Bid_Request_Status_Dropdown1.click();
        await bidRequestPage.Status_checkbox_Filter(vars['StatusToBeSelected']).check();
        await expect(correspondentPortalPage.Apply_Selected_1_button_in_Rule).toBeEnabled();
        await bidRequestDetailsPage.Apply_Selected_Button_2_filter.click();
        await applyFiltersButtonPage.Apply_Filters_Button.click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        await expect(correspondentPortalPage.Status).toContainText(vars['StatusToBeSelected']);
        log.stepPass('Navigated to Bid Requests and company and status filters applied successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to navigate to Bid Requests or apply company and status filters');
        throw e;
      }

      log.step('Traverse to Chase Direct bid with Expired status and open bid details');
      try {
        vars['ExecutionType'] = appconstants.ChaseDirectExecutionTableHeader;
        log.info('ExecutionType: ' + vars['ExecutionType']);
        await stepGroups.stepGroup_Traversing_to_the_next_screens_until_the_bid_is_visible(page, vars);
        await bidrequestPage.Filtered_Status_BidRequest_ID(vars['ExecutionType'], vars['StatusToBeSelected']).click();
        await spinnerPage.Spinner.waitFor({ state: 'hidden' });
        log.stepPass('Traversed to Chase Direct bid with Expired status and bid details opened successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to traverse to Chase Direct bid or open bid details');
        throw e;
      }

      log.step('Capture all bid details before resubmit');
      try {
        vars['CCodeBeforeResubmit'] = await correspondentPortalPage.CCode_Valuebid_request_details.textContent() || '';
        vars['CompanyBeforeResubmit'] = await bidRequestDetailsPage.Company_ValueBid_Request_Details.textContent() || '';
        vars['RequestIDBeforeResubmit'] = await bidRequestDetailsPage.Request_Id_From_Details.textContent() || '';
        Methods.trimtestdata(vars['RequestIDBeforeResubmit'],'RequestIDBeforeResubmit');
        vars['StatusBeforeResubmit'] = await bidRequestDetailsPage.Statusbid_request_details.textContent() || '';
        vars['BidValueBeforeResubmit'] = await bidRequestDetailsPage.Bid_Value_parsed_row.textContent() || '';
        vars['ExecutionBeforeResubmit'] = await bidRequestDetailsPage.Execution_Type_Parsed_Row.textContent() || '';
        vars['ParsedTotalLoansBeforeSubmit'] = await bidRequestDetailsPage.Parsed_Total_Loans.textContent() || '';
        vars['ParsedSuccessLoansBeforeSubmit'] = await bidRequestDetailsPage.Parsed_Success_Loans.textContent() || '';
        vars['ParsedErroredLoansBeforeSubmit'] = await bidRequestDetailsPage.Parsed_Errored_loans.textContent() || '';
        vars['ExecutionTypeHeaderBeforeSubmit'] = await bidRequestDetailsPage.Execution_Type_from_Details_table1.textContent() || '';
        vars['BidValueHeaderBeforeSubmit'] = await bidRequestDetailsPage.Bid_Value_From_Table_Header1.textContent() || '';
        vars['TotalloansHeaderBeforeSubmit'] = await bidRequestDetailsPage.Total_loans_TableHeader_1.textContent() || '';
        vars['SuccessLoansHeaderBeforeSubmit'] = await bidRequestDetailsPage.Success_Loans_Header_1.textContent() || '';
        vars['ErrorredLoansHeaderBeforeSubmit'] = await bidRequestDetailsPage.Errored_Loans_Header1.textContent() || '';
        vars['TotalRowsCount'] = String(await bidRequestDetailsPage.Rows_Count_Table_1.count());
        log.info('CCodeBeforeResubmit: ' + vars['CCodeBeforeResubmit']);
        log.info('CompanyBeforeResubmit: ' + vars['CompanyBeforeResubmit']);
        log.info('RequestIDBeforeResubmit: ' + vars['RequestIDBeforeResubmit']);
        log.info('StatusBeforeResubmit: ' + vars['StatusBeforeResubmit']);
        log.info('BidValueBeforeResubmit: ' + vars['BidValueBeforeResubmit']);
        log.info('ExecutionBeforeResubmit: ' + vars['ExecutionBeforeResubmit']);
        log.info('ParsedTotalLoansBeforeSubmit: ' + vars['ParsedTotalLoansBeforeSubmit']);
        log.info('ParsedSuccessLoansBeforeSubmit: ' + vars['ParsedSuccessLoansBeforeSubmit']);
        log.info('ParsedErroredLoansBeforeSubmit: ' + vars['ParsedErroredLoansBeforeSubmit']);
        log.info('TotalRowsCount: ' + vars['TotalRowsCount']);
        log.stepPass('All bid details captured before resubmit successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to capture bid details before resubmit');
        throw e;
      }

      log.step('Iterate through all rows and columns to capture cell data and store in profile');
      try {
        vars['RowsCount'] = appconstants.ONE;
        const profileChaseDirect = 'Bid Request Details Tables Data For ChaseDirect';
        while (parseFloat(String(vars['RowsCount'])) <= parseFloat(String(vars['TotalRowsCount']))) {
          log.info('Row iteration: ' + vars['RowsCount']);
          vars['ColumnCount'] = appconstants.ONE;
          while (parseFloat(String(vars['ColumnCount'])) <= parseFloat(String('7'))) {
            log.info('Column iteration: ' + vars['ColumnCount']);
            await bidRequestDetailsPage.Bid_Request_Details_Text.click();
            vars['CellData'] = await bidRequestDetailsPage.Individual_Cell_Data(vars['RowsCount'], vars['ColumnCount']).textContent() || '';
            log.info(`CellData at [Row:${vars['RowsCount']}, Column:${vars['ColumnCount']}]: ${vars['CellData']}`);

            if (String(vars['ColumnCount']) === String('1')) {
              testDataManager.updatePartialProfileDataByDataIndex(profileChaseDirect, {
                'Loan Number': vars['CellData'],
              }, vars['RowsCount']);
              log.info('Loan Number: ' + vars['CellData']);
            } else if (String(vars['ColumnCount']) === String('2')) {
              testDataManager.updatePartialProfileDataByDataIndex(profileChaseDirect, {
                'Last Name': vars['CellData'],
              }, vars['RowsCount']);
              log.info('Last Name: ' + vars['CellData']);
            } else if (String(vars['ColumnCount']) === String('3')) {
              testDataManager.updatePartialProfileDataByDataIndex(profileChaseDirect, {
                'LoanAmount': vars['CellData'],
              }, vars['RowsCount']);
              log.info('LoanAmount: ' + vars['CellData']);
            } else if (String(vars['ColumnCount']) === String('4')) {
              testDataManager.updatePartialProfileDataByDataIndex(profileChaseDirect, {
                'Program': vars['CellData'],
              }, vars['RowsCount']);
              log.info('Program: ' + vars['CellData']);
            } else if (String(vars['ColumnCount']) === String('5')) {
              vars['Loan Status'] = vars['CellData'];
              testDataManager.updatePartialProfileDataByDataIndex(profileChaseDirect, {
                'Loan Status': vars['CellData'],
              }, vars['RowsCount']);
              log.info('Loan Status: ' + vars['CellData']);
            } else if (String(vars['ColumnCount']) === String('6')) {
              if (String(vars['CellData']).includes(String('+'))) {
                await bidRequestDetailsPage.Footer_Queued_For_Date.click();
                await bidRequestDetailsPage.Individual_Cell_Data(vars['RowsCount'], vars['ColumnCount']).hover();
                vars['CellDataPopup'] = await bidRequestDetailsPage.Tool_Tip_Text.textContent() || '';
                Methods.concatenateWithSpecialChar(vars['CellDataPopup'], vars['CellData'], ',', 'CellData');
                log.info('CellDataPopup (Errors with tooltip): ' + vars['CellDataPopup']);
              }
              testDataManager.updatePartialProfileDataByDataIndex(profileChaseDirect, {
                'Errors': vars['CellData'],
              }, vars['RowsCount']);
              log.info('Errors: ' + vars['CellData']);
            } else {
              testDataManager.updatePartialProfileDataByDataIndex(profileChaseDirect, {
                'Error Description': vars['CellData'],
              }, vars['RowsCount']);
              log.info('Error Description: ' + vars['CellData']);
            }

            if (await bidRequestDetailsPage.Individual_PQ_Button(vars['RowsCount']).isEnabled()) {
              vars['PQ Status'] = 'PQ Enabled';
            } else {
              vars['PQ Status'] = 'PQ Disabled';
            }
            testDataManager.updatePartialProfileDataByDataIndex(profileChaseDirect, {
              'PQ Status': vars['PQ Status'],
            }, vars['RowsCount']);
            log.info('PQ Status: ' + vars['PQ Status']);

            if (await bidRequestDetailsPage.Individual_PS_Button(vars['RowsCount']).isEnabled()) {
              vars['PS Status'] = 'PS Enabled';
            } else {
              vars['PS Status'] = 'PS Disabled';
            }
            testDataManager.updatePartialProfileDataByDataIndex(profileChaseDirect, {
              'PS Status': vars['PS Status'],
            }, vars['RowsCount']);
            log.info('PS Status: ' + vars['PS Status']);

            Methods.MathematicalOperation(vars['ColumnCount'], '+', 1, 'ColumnCount');
          }
          Methods.MathematicalOperation(vars['RowsCount'], '+', 1, 'RowsCount');
        }
        log.stepPass('All rows and columns iterated and cell data captured successfully');
      } catch (e) {
        await log.stepFail(page, 'Failed to iterate rows and columns or capture cell data at Row: ' + vars['RowsCount'] + ' Column: ' + vars['ColumnCount']);
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