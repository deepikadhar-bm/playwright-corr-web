import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestDetailsPage } from '../../../src/pages/correspondant/bid-request-details';
import { CommitmentListPage } from '../../../src/pages/correspondant/commitment-list';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { PriceOfferedPage } from '../../../src/pages/correspondant/price-offered';
import * as excelHelper from '../../../src/helpers/excel-helpers';
import { runPrereq_2021 } from '../../../src/helpers/prereqs/prereq-2021';
import { Logger as log } from '@helpers/log-helper';
import { AddonHelpers } from '@helpers/AddonHelpers';
import { testDataManager } from 'testdata/TestDataManager';
import { APP_CONSTANTS as appconstants } from '../../../src/constants/app-constants';

const TC_ID = 'REG_TS25_TC01.1';
const TC_TITLE = 'Verify the download file action present in the accordian of each commitment, It should display the proper committed loan details';

test.describe('Commitment List - TS_1', () => {
  let vars: Record<string, string> = {};
  let bidRequestDetailsPage: BidRequestDetailsPage;
  let commitmentListPage: CommitmentListPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let priceOfferedPage: PriceOfferedPage;
  let Methods: AddonHelpers;

  test.beforeEach(async ({ page }) => {
    vars = {};
    await runPrereq_2021(page, vars);
    bidRequestDetailsPage = new BidRequestDetailsPage(page);
    commitmentListPage = new CommitmentListPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    priceOfferedPage = new PriceOfferedPage(page);
    Methods = new AddonHelpers(page, vars);
  });

  test(`${TC_ID} - ${TC_TITLE}`, async ({ page }) => {
    log.tcStart(TC_ID, TC_TITLE);
    try {
      log.step('Reading and verifying Cover Letter Header and Data from Excel Part 1');
      try {
        vars['CoverLetterHeaderExcelPart1'] = excelHelper.readCellByColAndRowIndex(vars['DownloadedCommitmentLetterPath'], 0, 3, 0);
        Methods.verifyString(vars['CoverLetterHeaderExcelPart1'], 'equals', 'Correspondent Name (Ccode):');
        vars['CoverLetterDataExcelPart1'] = excelHelper.readCellByColAndRowIndex(vars['DownloadedCommitmentLetterPath'], 0, 3, 1);
        Methods.trimWhitespace(vars['CoverLetterDataExcelPart1'], 'CoverLetterDataExcelPart1');
        Methods.verifyString(vars['CoverLetterDataExcelPart1'], 'contains', vars['CompanyNameWithCCodeUI']);
        vars['CoverLetterHeaderExcelPart1'] = excelHelper.readCellByColAndRowIndex(vars['DownloadedCommitmentLetterPath'], 0, 3, 3);
        Methods.verifyString(vars['CoverLetterHeaderExcelPart1'], 'equals', 'User Name:');
        vars['CoverLetterDataExcelPart1'] = excelHelper.readCellByColAndRowIndex(vars['DownloadedCommitmentLetterPath'], 0, 3, 4);
        Methods.verifyString(vars['CoverLetterDataExcelPart1'], 'contains', 'Chase Correspondent');
        log.stepPass('Successfully verified Cover Letter Header and Data from Excel Part 1');
      } catch (e) {
        log.stepFail(page, 'Failed to verify Cover Letter Header and Data from Excel Part 1');
        throw e;
      }

      log.step('Iterating rows 9 to 15 and verifying row data against TestDataProfile');
      try {
        const profileNameCoverLetter = 'Cover Letter Details Closed List';
        const profileCoverLetter = testDataManager.getProfileByName(profileNameCoverLetter);
        vars['RowCount'] = appconstants.NINE;
        vars['tdpcount'] = appconstants.ONE;

        while (parseFloat(String(vars['RowCount'])) <= parseFloat(String(appconstants.FIFTEEN))) {
          vars['EntireRowDataExcel'] = excelHelper.readEntireRow(vars['DownloadedCommitmentLetterPath'], 0, vars['RowCount'], 'EntireRowDataExcel');
          await commitmentListPage.Download_File_TextPopup.click();
          log.info('readed excel data:' + vars['EntireRowDataExcel']);

          vars['SplitHeaderCount'] = appconstants.ONE;
          vars['SplitIndex'] = appconstants.TWO;
          vars['ColumnCount'] = appconstants.ONE;

          while (parseFloat(String(vars['ColumnCount'])) <= parseFloat(String(appconstants.THREE))) {
            Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcel'], ',', vars['SplitHeaderCount'], 'IndividualHeaderNameExcel');
            Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcel'], ',', vars['SplitIndex'], 'IndividualValueExcel');

            const tdpRowIndex = parseInt(String(vars['tdpcount'])) - 1;
            const testData = profileCoverLetter?.data?.[tdpRowIndex];
            if (!testData) {
              throw new Error(`Test Data Missing: No data found for row index ${tdpRowIndex} (tdpcount: ${vars['tdpcount']})`);
            }
            vars['HeaderName'] = testData['HeaderName'] ?? '';
            vars['ChaseInfo'] = testData['ChaseInfo'] ?? '';

            if (String(vars['HeaderName']) === 'Commitment Amount:') {
              Methods.countCharacter(vars['ChaseInfo'], ',', 'CountofCama');
              vars['count1'] = '1';
              while (parseFloat(String(vars['count1'])) <= parseFloat(String(vars['CountofCama']))) {
                Methods.MathematicalOperation(vars['SplitIndex'], '+', '1', 'SplitIndex');
                Methods.MathematicalOperation(vars['SplitHeaderCount'], '+', '1', 'SplitHeaderCount');
                Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataExcel'], ',', vars['SplitIndex'], 'IndividualValueExcel2');
                Methods.concatenateWithSpecialChar(vars['IndividualValueExcel'], vars['IndividualValueExcel2'], ',', 'IndividualValueExcel');
                Methods.MathematicalOperation(vars['count1'], '+', '1', 'count1');
              }
            }
            if (String(vars['IndividualHeaderNameExcel']) === 'null' || String(vars['IndividualHeaderNameExcel']) === 'N/A') {
              Methods.MathematicalOperation(vars['tdpcount'], '-', '1', 'tdpcount');
            } else {
              Methods.verifyString(vars['IndividualHeaderNameExcel'], 'equals', vars['HeaderName']);
            }
            if (String(vars['IndividualValueExcel']) === 'null' || String(vars['IndividualValueExcel']) === 'N/A') {
              Methods.MathematicalOperation(vars['tdpcount'], '-', '1', 'tdpcount');
            } else {
              await Methods.verifyTestdataIgnoreCase(vars['IndividualValueExcel'], 'contains', vars['ChaseInfo']);
            }

            Methods.MathematicalOperation(vars['SplitHeaderCount'], '+', '2', 'SplitHeaderCount');
            Methods.MathematicalOperation(vars['SplitIndex'], '+', '2', 'SplitIndex');
            Methods.MathematicalOperation(vars['ColumnCount'], '+', '1', 'ColumnCount');
            Methods.MathematicalOperation(vars['tdpcount'], '+', '1', 'tdpcount');
          }

          Methods.MathematicalOperation(vars['RowCount'], '+', '1', 'RowCount');
        }

        log.stepPass('Successfully verified all row data against TestDataProfile');
      } catch (e) {
        log.stepFail(page, 'Failed to verify row data against TestDataProfile');
        throw e;
      }

      log.step('Verifying header names from Excel row 0 against TestDataProfile');
      try {
        const profileNameHeaders = 'Loan Level Pricing Header Names';
        const profileHeaders = testDataManager.getProfileByName(profileNameHeaders);
        vars['EntireRowDataHeaderNamesExcel'] = excelHelper.readEntireRow(vars['DownloadedCommitmentLetterPath'], '1', '0', 'EntireRowDataHeaderNamesExcel');
        vars['Count'] = '1';

        for (let Count = 1; Count <= 13; Count++) {
          Methods.splitStringByRegConditionWithPosition(vars['EntireRowDataHeaderNamesExcel'], ',', vars['Count'], 'IndividualHeaderNameExcel');
          const testData = profileHeaders?.data?.[Count - 1] ?? {};
          vars['HeaderName'] = testData['HeaderName'] ?? '';
          Methods.verifyString(vars['IndividualHeaderNameExcel'], 'equals', vars['HeaderName']);
          Methods.MathematicalOperation(vars['Count'], '+', '1', 'Count');
        }

        log.stepPass('Successfully verified all header names from Excel against TestDataProfile');
      } catch (e) {
        log.stepFail(page, 'Failed to verify header names from Excel against TestDataProfile');
        throw e;
      }

      log.step('Navigating to commitment details and verifying loan level pricing');
      try {
        await correspondentPortalPage.Close_ButtonCommitment_List.click();
        await priceOfferedPage.Commitment_IDCommitment_List_Page_New(vars['BidReqId']).waitFor({ state: 'visible' });
        await priceOfferedPage.Commitment_IDCommitment_List_Page_New(vars['BidReqId']).click();
        await bidRequestDetailsPage.Last_Name_Sort_Button.first().waitFor({ state: 'visible' });
        await commitmentListPage.Chase_Loan_Button.first().click();
        await correspondentPortalPage.Header_Sort_Down.waitFor({ state: 'visible' });
        await stepGroups.stepGroup_Verification_of_Loan_Level_Pricing_Details(page, vars);
        log.stepPass('Successfully navigated and verified loan level pricing details');
      } catch (e) {
        log.stepFail(page, 'Failed to navigate or verify loan level pricing details');
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