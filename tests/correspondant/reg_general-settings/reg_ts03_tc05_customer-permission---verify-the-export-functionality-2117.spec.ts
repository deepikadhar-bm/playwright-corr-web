// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import * as excelHelper from '../../../src/helpers/excel-helpers';

test.describe('REG_General Settings', () => {
  let vars: Record<string, string> = {};
  let correspondentPortalPage: CorrespondentPortalPage;
  let customerPermissionPage: CustomerPermissionPage;
  let spinnerPage: SpinnerPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    correspondentPortalPage = new CorrespondentPortalPage(page);
    customerPermissionPage = new CustomerPermissionPage(page);
    spinnerPage = new SpinnerPage(page);
  });

  test('REG_TS03_TC05_Customer Permission - Verify the Export Functionality', async ({ page }) => {
    // Set up download handler
    page.on('download', async (download) => {
      const filePath = path.join('test-results', 'downloads', download.suggestedFilename());
      await download.saveAs(filePath);
      vars['_lastDownloadPath'] = filePath;
    });

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.GeneralSettings_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await customerPermissionPage.CustomerPermission_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await customerPermissionPage.Third_Checkbox.check();
    await expect(customerPermissionPage.Third_Checkbox).toBeVisible();
    await customerPermissionPage.Fourth_Check_box.check();
    await expect(customerPermissionPage.Fourth_Check_box).toBeVisible();
    await correspondentPortalPage.Export_Selected_1_Button.waitFor({ state: 'visible' });
    await correspondentPortalPage.Export_Selected_1_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    vars["File"] = vars['_lastDownloadPath'] || '';
    vars["IndexCol"] = "0";
    vars["Count1"] = "1";
    while (parseFloat(String(vars["Count1"])) <= parseFloat(String("6"))) {
      vars["IndividualHeaderUI"] = await customerPermissionPage.Individual_Column_Header_Data.textContent() || '';
      vars["HeaderExcel"] = excelHelper.readCell(vars['_lastDownloadPath'] || '', "0", vars["IndexCol"], "0");
      if (String(vars["IndividualHeaderUI"]).includes(String("CCode"))) {
        expect(String(vars["HeaderExcel"])).toBe("Ccode");
      } else if (String(vars["IndividualHeaderUI"]).includes(String("Standard"))) {
        expect(String(vars["HeaderExcel"])).toBe("Standard Flow");
      } else {
        expect(String(vars["IndividualHeaderUI"])).toBe(vars["HeaderExcel"]);
      }
      vars["Count1"] = (parseFloat(String("1")) + parseFloat(String(vars["Count1"]))).toFixed(0);
      vars["IndexCol"] = (parseFloat(String("1")) + parseFloat(String(vars["IndexCol"]))).toFixed(0);
    }
    vars["RowsCountExcel"] = String(excelHelper.getRowCount(vars["File"], "0"));
    expect(String(vars["RowsCountExcel"])).toBe("3");
    vars["RowIndexExcel"] = "1";
    vars["RowIndexUI"] = "3";
    while (parseFloat(String(vars["RowIndexExcel"])) <= parseFloat(String("2"))) {
      vars["Count"] = "1";
      vars["IndexCol"] = "0";
      while (parseFloat(String(vars["Count"])) <= parseFloat(String("6"))) {
        await correspondentPortalPage.Heading_Customer_Permission.click();
        vars["CellDataUI"] = await customerPermissionPage.IndividualCellDataUI.textContent() || '';
        vars["CellDataExcel"] = excelHelper.readCell(vars['_lastDownloadPath'] || '', vars["RowIndexExcel"], vars["IndexCol"], "0");
        if (String(vars["CellDataExcel"]).includes(String("ET"))) {
          vars["DateUI"] = String('').split("")["0"] || '';
          vars["TimeUI"] = String('').split("")["1"] || '';
          vars["TimeStandardUI"] = String('').split("")["2"] || '';
          vars[""] = String(vars["TimeUI"]) + ' ' + String(vars["TimeStandardUI"]);
          vars[""] = (() => {
            const d = new Date('2000-01-01 ' + String(''));
            d.setMinutes(d.getMinutes() - parseInt(String('')));
            return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          })();
          vars[""] = String(vars["DateUI"]) + ' ' + String(vars["EstTime"]);
          vars["ExpectedTimeExcel"] = (() => {
            const d = new Date(String(vars["ExpectedTimeExcel"]));
            const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
            return "MM/dd/yyyy HH:mm a".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
          })();
          vars[""] = String(vars["ExpectedTimeExcel"]) + ' ' + String("ET");
          if (String(vars["EstTimeExcel"]).includes(String("AM"))) {
            vars["EstTimeExcel"] = String(vars["EstTimeExcel"]).replace(/AM/g, '');
          } else if (String(vars["EstTimeExcel"]).includes(String("PM"))) {
            vars["EstTimeExcel"] = String(vars["EstTimeExcel"]).replace(/PM/g, '');
          }
          // [DISABLED] Remove Special char TimeStandardUI from EstTimeExcel and store it in runtime EstTimeExcel
          // vars["EstTimeExcel"] = String(vars["EstTimeExcel"]).replace(/TimeStandardUI/g, '');
          vars["EstTimeExcel"] = String(vars["EstTimeExcel"]).trim();
          vars["CellDataExcel"] = String(vars["CellDataExcel"]).trim();
          expect(String(vars["CellDataExcel"])).toBe(vars["EstTimeExcel"]);
        } else {
          expect(String(vars["CellDataUI"])).toBe(vars["CellDataExcel"]);
        }
        vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
        vars["IndexCol"] = (parseFloat(String("1")) + parseFloat(String(vars["IndexCol"]))).toFixed(0);
      }
      vars["RowIndexExcel"] = (parseFloat(String(vars["RowIndexExcel"])) + parseFloat(String("1"))).toFixed(0);
      vars["RowIndexUI"] = (parseFloat(String("1")) + parseFloat(String(vars["RowIndexUI"]))).toFixed(0);
    }
  });
});
