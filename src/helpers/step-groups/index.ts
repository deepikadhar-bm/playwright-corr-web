/**
 * Auto-generated step group helpers
 * Converted from Testsigma step groups
 */
import { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import path from 'path';
import * as excelHelper from '../excel-helpers';
import { CommitmentListPage } from '../../pages/correspondant/commitment-list';
import { PriceOfferedPage } from '../../pages/correspondant/price-offered';
import { CorrespondentPortalPage } from '../../pages/correspondant/correspondent-portal';
import { EarlyConfigPage } from '../../pages/correspondant/early-config';
import { BidRequestsPage } from '../../pages/correspondant/bid-requests';
import { SeeDifferencePopUpPage } from '../../pages/correspondant/see-difference-pop-up';
import { GeneralSettingPage } from '../../pages/correspondant/general-setting';
import { BidRequestDetailsPage } from '../../pages/correspondant/bid-request-details';
import { BidRequestPage } from '../../pages/correspondant/bid-request';
import { CustomerPermissionPage } from '../../pages/correspondant/customer-permission';
import { AuditPage } from '../../pages/correspondant/audit';
import { CommitmentsPage } from '../../pages/correspondant/commitments';
import { EditPermissionsPage } from '../../pages/correspondant/edit-permissions';
import { ActionsPage } from '../../pages/correspondant/actions';
import { ChaseFieldNamePage } from '../../pages/correspondant/chase-field-name';
import { EnumerationMappingPage } from '../../pages/correspondant/enumeration-mapping';
import { CorrespondentPortal8Page } from '../../pages/correspondant/correspondent-portal-8';
import { ProceedWithSavingButtonPage } from '../../pages/correspondant/proceed-with-saving-button';
import { AdvanceSearch2Page } from '../../pages/correspondant/advance-search-2';
import { StatusInactivePage } from '../../pages/correspondant/status-inactive-';
import { MapNameFieldInBidMapsPage } from '../../pages/correspondant/map-name-field-in-bid-maps';
import { BidMapPage } from '../../pages/correspondant/bid-map';
import { ActionruleheaderPage } from '../../pages/correspondant/actionruleheader';
import { HeaderMappingPage } from '../../pages/correspondant/header-mapping';
import { ChaseValuePage } from '../../pages/correspondant/chase-value';
import { AmericanPacificPage } from '../../pages/correspondant/american-pacific';
import { MappingListPage } from '../../pages/correspondant/mapping-list';
import { BidmapDashboardPage } from '../../pages/correspondant/bidmap-dashboard';
import { AdvanceSearchPage } from '../../pages/correspondant/advance-search';
import { LoginPage } from '../../pages/correspondant/login';
import { P24UnitDropdownPage } from '../../pages/correspondant/p-24-unit-dropdown';
import { CorrespondentPortal9Page } from '../../pages/correspondant/correspondent-portal-9';
import { StatusInactive2Page } from '../../pages/correspondant/status-inactive--2';
import { SelectAllCheckboxPage } from '../../pages/correspondant/select-all-checkbox';
import { CorrespondentPortal19Page } from '../../pages/correspondant/correspondent-portal-19';

/**
 * Step Group: Login to CORR Portal
 * ID: 773
 * Steps: 5
 */
export async function stepGroup_Login_to_CORR_Portal(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  await page.goto("https://ext-qa.lpcorrtest.com/cp/#/auth/login");
  await correspondentPortalPage.Username_Field.fill("testsigma_internal");
  await correspondentPortalPage.Password_Field.fill("Welcome@123");
  await page.locator("//button[contains(@class, 'btn-primary') and contains(@class, 'caps') and contains(@class, 'login-button')]").click();
  await correspondentPortalPage.Logo.waitFor({ state: 'visible' });
}

/**
 * Step Group: Rename File
 * ID: 786
 * Steps: 12
 */
export async function stepGroup_Rename_File(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const headerMappingPage = new HeaderMappingPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const newPage = await page.context().newPage();
  await page.goto("https://imgtool.net/en/filerename/");
  await page.waitForLoadState('networkidle');
  await headerMappingPage.File_Input.setInputFiles(path.resolve(__dirname, 'test-data', "DeepikaAugBidQA.xlsx"));
  await page.waitForLoadState('networkidle');
  await correspondentPortalPage.Username_Field.scrollIntoViewIfNeeded();
  await correspondentPortalPage.Username_Field.waitFor({ state: 'visible' });
  await page.locator("(//button[@class=\"el-button el-button--primary\"])[2]").click();
  // Wait for download - handled by Playwright download events
  await page.waitForTimeout(2000);
  vars[""] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
  vars["Total Headers From Xls"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "0", "0");
  // TODO: Manual conversion needed - unknown template 88
  // Action: Switch to the window by index 0
}

/**
 * Step Group: Creation Of Bid Map_Upto_Header Mapping
 * ID: 792
 * Steps: 31
 */
export async function stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const correspondentPortal8Page = new CorrespondentPortal8Page(page);
  const proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  // [DISABLED] Verify that the element Dashboard is displayed and With Scrollable FALSE
  // await expect(page.locator("//h3[text()[normalize-space() = \"Dashboard\"]]")).toBeVisible();
  await stepGroup_Navigation_to_Customer_Permission(page, vars);
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"Bid Maps\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//h1[text()=\"Mappings\"]")).toBeVisible();
  await page.locator("//button[text()[normalize-space() = \"Add New Mapping\"]]").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Create New Map\"]]")).toBeVisible();
  vars["Current Date"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata" };
    const fmt = "MM/dd/yyyy";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["Create New Map"] = new Date().toLocaleDateString('en-US') /* format: MM/dd/yyyy/HH:mm:ss */;
  vars["Create New Map"] = "Testsigma_" + vars["Create New Map"];
  await correspondentPortalPage.Create_New_Map_Field.fill(vars["Create New Map"]);
  vars["BidMap"] = await correspondentPortalPage.Create_New_Map_Field.inputValue() || '';
  await correspondentPortal8Page.Compare_Button.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//span[contains(.,' $|Create New Map|')]")).toContainText(vars["Create New Map"]);
  // [DISABLED] Verify that the current page displays text Create New Map
  // await expect(page.getByText(vars["Create New Map"])).toBeVisible();
  await correspondentPortalPage.Select_Companys_Dropdown.click();
  await page.locator("//span[@class='pl-2'][contains(.,'$|Companyname|')]").click();
  await page.locator("//button[contains(text(),\" Apply Selected \")]").click();
  await expect(page.locator("(//input[@type=\"file\"])[1]")).toHaveValue('');
  await expect(page.getByText("Drag and drop files here or click to browse. Allowed formats: .xls,.xlsx,.csv,.txt")).toBeVisible();
  await page.locator("(//input[@type=\"file\"])[1]").setInputFiles(path.resolve(__dirname, 'test-data', "DeepikaAugBidQA.xlsx"));
  await page.locator("//span[text()[normalize-space() = \"Map Headers\"]]").click();
  await page.locator("//h5[text()[normalize-space() = \"Save and Move to Next Page\"]]").waitFor({ state: 'visible' });
  await expect(page.locator("//*[contains(text(),\"This action will save the changes and Move to Next Page\")]")).toBeVisible();
  await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText(vars["Create New Map"])).toBeVisible();
  await page.locator("//a[text()[normalize-space() = \"Header Mapping\"]]").waitFor({ state: 'visible' });
}

/**
 * Step Group: Smart Mapper from On to Off
 * ID: 799
 * Steps: 14
 */
export async function stepGroup_Smart_Mapper_from_On_to_Off(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
  await page.waitForLoadState('networkidle');
  // [DISABLED] Verify that the element General Settings. is displayed and With Scrollable FALSE
  // await expect(page.locator("//*[text()[normalize-space() = \"General Settings\"]]")).toBeVisible();
  await correspondentPortalPage.Bid_Map_Creation_in_General_Settings.click();
  await expect(page.locator("//h6[text()[normalize-space() = \"Bid Map Creation\"]]")).toBeVisible();
  await expect(page.locator("//label[text()[normalize-space() = \"Smart Mapper\"]]")).toBeVisible();
  if (true) /* Radio button Off Radio Button is not selected */ {
    await correspondentPortalPage.Off_Radio_Button.check();
    await page.locator("//button[normalize-space(text())=\"Save changes\" or contains(text(),\"Save Changes\")]").click();
  }
  await page.waitForLoadState('networkidle');
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"Bid Maps\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: Reading files
 * ID: 816
 * Steps: 11
 */
export async function stepGroup_Reading_files(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const headerMappingPage = new HeaderMappingPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const newPage = await page.context().newPage();
  await page.goto("https://imgtool.net/en/filerename/#google_vignette");
  await headerMappingPage.File_Input.setInputFiles(path.resolve(__dirname, 'test-data', "DeepikaAugBidQA.xlsx"));
  await page.waitForLoadState('networkidle');
  // [DISABLED] Wait until the element Rename Field is enabled
  // await correspondentPortalPage.Username_Field.waitFor({ state: 'visible' });
  await page.locator("(//button[@class=\"el-button el-button--primary\"])[2]").click();
  // Wait for download - handled by Playwright download events
  await page.waitForTimeout(2000);
  vars[""] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
  // [DISABLED] Excel: Read the entire Row of the latest Excel file (.xlsx) using the Row 0 and store it in a variable named Total Headers From Xls
  // vars["Total Headers From Xls"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "0", "0");
  vars["Total exl"] = excelHelper.readColumn(vars['_lastDownloadPath'] || '', "4", "0");
  // TODO: Manual conversion needed - unknown template 88
  // Action: Switch to the window by index 0
}

/**
 * Step Group: Edition in Header Mapping
 * ID: 822
 * Steps: 10
 */
export async function stepGroup_Edition_in_Header_Mapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await expect(page.locator("//span[text()='Enumeration Mapping']")).toBeVisible();
  await page.locator("(//i[@class=\"fas fa-pencil-alt\"])[3]").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Update Header\"]]")).toBeVisible();
  await page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/following-sibling::div[contains(@class, 'd-flex')]//select[contains(@class, 'form-select')]").selectOption({ label: testData["ChaseFieldNames"] });
  await page.locator("//span[text()[normalize-space() = \"Update Header\"]]").click();
  await page.locator("//span[text()='Enumeration Mapping']").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//h5[text()[normalize-space() = \"Save and Move to Next Page\"]]").waitFor({ state: 'visible' });
  await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: Deletion in Enumeration Mapping
 * ID: 823
 * Steps: 8
 */
export async function stepGroup_Deletion_in_Enumeration_Mapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
  await expect(page.locator("//span[text()[normalize-space() = \"Rules and Actions\"]]")).toBeVisible();
  await page.locator("(//i[@class=\"fa fas fa-trash trash-icon\"])[5]").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Delete Enumeration Pair\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Yes, Go ahead.\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"Rules and Actions\"]]").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Save and Move to Next Page\"]]")).toBeVisible();
  await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: Import Rule in Mapping
 * ID: 824
 * Steps: 19
 */
export async function stepGroup_Import_Rule_in_Mapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await expect(page.locator("//span[text()[normalize-space() = \"Save and Publish\"]]")).toBeVisible();
  await page.locator("//button[text()[normalize-space() = \"Import Rule\"]]").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Select Rule/s\"]]")).toBeVisible();
  await correspondentPortalPage.Search_Map_Input.fill(testData["Search Map Input"]);
  vars["ImportRuleName"] = await correspondentPortalPage.Search_Map_Input.textContent() || '';
  await page.locator("(//span[text()[normalize-space() = \"Deepika Aug1\"]])[1]").click();
  await correspondentPortalPage.Import_Rule_Checkbox.check();
  await page.locator("//span[contains(normalize-space(),\"Apply Selected 1\")]").click();
  await expect(page.locator("//h6[text()[normalize-space() = \"Add Conditions\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Save and Publish\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  vars["Status"] = await page.locator("(//td[@data-title=\"Status\"])[1]").textContent() || '';
  await expect(page.locator("(//td[@data-title=\"Status\"])[1]")).toContainText(vars["Status"]);
  vars["Version"] = await page.locator("(//td[@data-title=\"Version\"])[1]").textContent() || '';
  await expect(page.getByText(vars["Version"])).toBeVisible();
  // [DISABLED] Store text from the element Company_Name into a variable CompanyName
  // vars["CompanyName"] = await page.locator("(//td[@data-title=\"Company\"])[1]").textContent() || '';
  // [DISABLED] Remove the no of ( 0,1 ) positions of given string CompanyName and store into runtime variable CompanyName
  // vars["CompanyName"] = String(vars["CompanyName"]).substring(0, String(vars["CompanyName"]).length - 1);
  // [DISABLED] Trim white space from CompanyName and store it in a runtime CompanyName
  // vars["CompanyName"] = String(vars["CompanyName"]).trim();
  // [DISABLED] Verify that the element Company_Name displays text CompanyName and With Scrollable FALSE
  // await expect(page.locator("(//td[@data-title=\"Company\"])[1]")).toContainText(vars["CompanyName"]);
}

/**
 * Step Group: Smart Mapper from Off to On
 * ID: 827
 * Steps: 14
 */
export async function stepGroup_Smart_Mapper_from_Off_to_On(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const correspondentPortal19Page = new CorrespondentPortal19Page(page);
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
  // [DISABLED] Verify that the element General Settings. is displayed and With Scrollable FALSE
  // await expect(page.locator("//*[text()[normalize-space() = \"General Settings\"]]")).toBeVisible();
  await correspondentPortalPage.Bid_Map_Creation_in_General_Settings.click();
  await expect(page.locator("//h6[text()[normalize-space() = \"Bid Map Creation\"]]")).toBeVisible();
  await expect(page.locator("//label[text()[normalize-space() = \"Smart Mapper\"]]")).toBeVisible();
  if (true) /* Radio button On Radio Button is not selected */ {
    await correspondentPortal19Page.On_Radio_Button.check();
    await page.locator("//button[normalize-space(text())=\"Save changes\" or contains(text(),\"Save Changes\")]").click();
  } else {
  }
  await page.waitForLoadState('networkidle');
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"Bid Maps\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: Creation Of New Map.
 * ID: 855
 * Steps: 20
 */
export async function stepGroup_Creation_Of_New_Map(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const correspondentPortal8Page = new CorrespondentPortal8Page(page);
  const selectAllCheckboxPage = new SelectAllCheckboxPage(page);
  const americanPacificPage = new AmericanPacificPage(page);
  const actionsPage = new ActionsPage(page);
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"Bid Maps\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//button[text()[normalize-space() = \"Add New Mapping\"]]").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Create New Map\"]]")).toBeVisible();
  vars["Create New Map"] = new Date().toLocaleDateString('en-US') /* format: dd/MM/yyyy/HH:mm:ss */;
  vars["Create New Map"] = "Testsigma_" + vars["Create New Map"];
  await correspondentPortalPage.Create_New_Map_Field.fill(vars["Create New Map"]);
  vars["BidMap"] = await correspondentPortalPage.Create_New_Map_Field.inputValue() || '';
  await correspondentPortal8Page.Compare_Button.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText(vars["Create New Map"])).toBeVisible();
  await correspondentPortalPage.Select_Companys_Dropdown.click();
  await expect(page.locator("//button[contains(text(),\" Apply Selected \")]")).toBeVisible();
  vars["CompanyCount"] = String(await page.locator("(//label[@class='dropdown-item d-flex'])").count());
  await selectAllCheckboxPage.Select_All_Checkbox.check();
  await expect(americanPacificPage.Apply_selected_Number).toContainText(vars["CompanyCount"]);
  await page.locator("//button[contains(text(),\" Apply Selected \")]").click();
  await expect(actionsPage.Standard_Dropdown).toHaveValue('');
}

/**
 * Step Group: Verification Header Mapping Smart Mapper On to Off
 * ID: 865
 * Steps: 4
 */
export async function stepGroup_Verification_Header_Mapping_Smart_Mapper_On_to_Off(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["IndexCount"] = "2";
  while (parseFloat(String(vars["IndexCount"])) <= parseFloat(String("43"))) {
    await expect(page.locator("(//div[contains(@class,\"gap-2 header-grid-layout\")]/..//select)[$|IndexCount|]")).toHaveValue("Select");
    vars["IndexCount"] = (parseFloat(String("1")) + parseFloat(String(vars["IndexCount"]))).toFixed(0);
  }
}

/**
 * Step Group: Show Unidentified Headers
 * ID: 876
 * Steps: 10
 */
export async function stepGroup_Show_Unidentified_Headers(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const p24UnitDropdownPage = new P24UnitDropdownPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//select[contains(normalize-space(),\"Select Show All Headers Show Unidentified Headers (10) Show Unused Headers Show Used Headers\")]").selectOption({ label: testData["Unidentified Headers"] });
  await page.waitForLoadState('networkidle');
  expect(await page.locator("//div[contains(@class,\"gap-2 header-grid-layout\")]/..//select[@title=\"\"]").textContent() || '').toContain(String("Select"));
  // [DISABLED] Element Bid_Sample_Field_Name_in_Header_Mapping is visible
  // await expect(p24UnitDropdownPage.Bid_Sample_Field_Name_in_Header_Mapping).toBeVisible();
    // [DISABLED] Store the count of elements identified by locator Bid_Sample_Field_Name in Header Mapping into a variable BidSamleField
    // vars["BidSamleField"] = String(await p24UnitDropdownPage.Bid_Sample_Field_Name_in_Header_Mapping.count());
    // [DISABLED] Store 2 in Headercount
    // vars["Headercount"] = "2";
  // [DISABLED] Verify that the element Header Mapping Show Unidentified Header displays text (10) and With Scrollable FALSE
  // await expect(page.locator("//select[@class=\"form-select\"]/../..//option[@value=\"Show Unidentified Headers\"]/..//span[text()=\"(10)\"]")).toContainText("(10)");
  // [DISABLED] Verify if Headercount <= BidSampleField
  // while (parseFloat(String(vars["Headercount"])) <= parseFloat(String(vars["BidSampleField"])))
    // [DISABLED] Verify that the Header Mapping for Unidentified Headers. list has option with text Select selected and With Scrollable FALSE
    // await expect(page.locator("(//select[contains(@class, 'form-select')])[$|Headercount|]")).toHaveValue("Select");
    // [DISABLED] Perform addition on 1 and Headercount and store the result inside a Headercount considering 0 decimal places
    // vars["Headercount"] = (parseFloat(String("1")) + parseFloat(String(vars["Headercount"]))).toFixed(0);
}

/**
 * Step Group: Show Unused Headers
 * ID: 877
 * Steps: 10
 */
export async function stepGroup_Show_Unused_Headers(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const p24UnitDropdownPage = new P24UnitDropdownPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//select[contains(normalize-space(),\"Select Show All Headers Show Unidentified Headers (10) Show Unused Headers Show Used Headers\")]").selectOption({ label: testData["Unused Headers"] });
  await page.waitForLoadState('networkidle');
  await expect(page.locator("//div[@class=\"flex-grow-1\" and text()=\"$|FirstCheckedBidName|\"]")).toBeVisible();
  await expect(page.locator("//div[@class=\"flex-grow-1\" and text()=\"$|SecondCheckedBidName|\"]")).toBeVisible();
  vars["BidSampleFieldCount"] = String(await p24UnitDropdownPage.Bid_Sample_Field_Name_in_Header_Mapping.count());
  expect(String(vars["BidSampleFieldCount"])).toBe(vars["UncheckedHeadersCount"]);
  // [DISABLED] Store 2 in Count
  // vars["Count"] = "2";
  // [DISABLED] Verify if Count <= BidSampleField
  // while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["BidSampleField"])))
    // [DISABLED] Verify that the element Show All Headers in Header Mappings. is present and With Scrollable FALSE
    // await expect(correspondentPortalPage.Show_All_Headers_in_Header_Mappings).toBeVisible();
    // [DISABLED] Perform addition on 1 and Count and store the result inside a Count considering 0 decimal places
    // vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
}

/**
 * Step Group: Verification for the Header Mapping.
 * ID: 882
 * Steps: 5
 */
export async function stepGroup_Verification_for_the_Header_Mapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const p24UnitDropdownPage = new P24UnitDropdownPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  vars["BidSampleFieldName"] = String(await p24UnitDropdownPage.Bid_Sample_Field_Name_in_Header_Mapping.count());
  vars["Count"] = "2";
  while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["BidSampleFieldName"]))) {
    await expect(correspondentPortalPage.Show_All_Headers_in_Header_Mappings).toBeVisible();
    vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
  }
}

/**
 * Step Group: Navigation and Verification of Customer Permission in Bid Request.
 * ID: 886
 * Steps: 12
 */
export async function stepGroup_Navigation_and_Verification_of_Customer_Permission_in_Bid_Re(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const customerPermissionPage = new CustomerPermissionPage(page);
  await expect(page.locator("//span[text()[normalize-space() = \"Bid Requests\"] and contains(@class, 'hide-text')]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Bid Requests\"] and contains(@class, 'hide-text')]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await customerPermissionPage.CustomerPermission_Menu.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText("Customer Permission")).toBeVisible();
  vars["CompanyName"] = await page.locator("//td[@data-title=\"Company Name\" and text()=\" @|CompanyName(CustomerPermissions)| \"]").textContent() || '';
  vars["Companyname"] = String(vars["CompanyName"]).trim();
  await expect(page.locator("//td[@data-title=\"Company Name\" and text()=\" @|CompanyName(CustomerPermissions)| \"]")).toContainText(vars["Companyname"]);
}

/**
 * Step Group: Navigating to Bulk Batch Timing
 * ID: 906
 * Steps: 6
 */
export async function stepGroup_Navigating_to_Bulk_Batch_Timing(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  await page.waitForLoadState('networkidle');
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//*[text()[normalize-space() = \"General Settings\"]]").first().click();
  await page.waitForLoadState('networkidle');
  await correspondentPortalPage.Bulk_Batch_Timing.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: Create Bid Map
 * ID: 907
 * Steps: 11
 */
export async function stepGroup_Create_Bid_Map(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const mapNameFieldInBidMapsPage = new MapNameFieldInBidMapsPage(page);
  const correspondentPortal8Page = new CorrespondentPortal8Page(page);
  await page.waitForLoadState('networkidle');
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"Bid Maps\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//button[text()[normalize-space() = \"Add New Mapping\"]]").click();
  await expect(page.getByText("Create New Map")).toBeVisible();
  vars["Create Bid Map"] = new Date().toLocaleDateString('en-US') /* format: dd/MM/yyyy:HH:mm:ss */;
  vars["Create New Map"] = "Automation_Testsigma_" + vars["Create New Map"];
  await mapNameFieldInBidMapsPage.Map_Name_Field_in_Bid_Maps.fill("Automation_Testsigma_" + vars["Create New Map"]);
  await expect(correspondentPortal8Page.Compare_Button).toBeVisible();
  await correspondentPortal8Page.Compare_Button.click();
}

/**
 * Step Group: Verification for the Pricing Return Timing
 * ID: 908
 * Steps: 19
 */
export async function stepGroup_Verification_for_the_Pricing_Return_Timing(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const statusInactivePage = new StatusInactivePage(page);
  const statusInactive2Page = new StatusInactive2Page(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  vars["Batch"] = "1";
  while (parseFloat(String(vars["Batch"])) <= parseFloat(String(vars["BatchCount"]))) {
    vars["BatchTime"] = await page.locator("(//h6[@class=\"card-subtitle text-body-secondary flex-grow-1 mb-0\"]/../..//h5)[$|BatchNum|]").textContent() || '';
    vars["PricingReturnTimeBuffer"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
    vars["BulkBatchTiming"] = (() => {
      const d = new Date('2000-01-01 ' + String(vars["BatchTime"]));
      d.setMinutes(d.getMinutes() + parseInt(String(vars["PricingReturnTimeBuffer"])));
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: HH:mm a
    })();
    await page.waitForLoadState('networkidle');
    await page.locator("//span[text()[normalize-space() = \"Bid Requests\"] and contains(@class, 'hide-text')]").click();
    await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
    await expect(page.getByText("Bid Requests")).toBeVisible();
    await page.locator("//button[text()[normalize-space() = \"Upload New Bid Request\"]]").click();
    await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
    await expect(page.getByText("Bid Request Details")).toBeVisible();
    await page.locator("//*[@id=\"pricingReturnTimeDropdown\"]//select[contains(@class,\"form-select\")]").click();
    await expect(statusInactive2Page.Select_Pricing_Batch_Dropdown.locator('option', { hasText: vars["BulkBatchTiming"] })).toBeVisible();
    vars["Batch"] = (parseFloat(String("1")) + parseFloat(String(vars["Batch"]))).toFixed(0);
    await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
    await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
    await page.waitForLoadState('networkidle');
    await correspondentPortalPage.Bulk_Batch_Timing.click();
  }
}

/**
 * Step Group: Navigation to Customer Permission
 * ID: 913
 * Steps: 10
 */
export async function stepGroup_Navigation_to_Customer_Permission(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const customerPermissionPage = new CustomerPermissionPage(page);
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await customerPermissionPage.CustomerPermission_Menu.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText("Customer Permission")).toBeVisible();
  vars["CompanyName"] = await page.locator("(//div[@class='d-flex align-items-end'][contains(.,'Company Name')]/../../../..//td[@data-title=\"Company Name\"])").textContent() || '';
  vars["Companyname"] = String(vars["CompanyName"]).trim();
  await expect(page.locator("(//div[@class='d-flex align-items-end'][contains(.,'Company Name')]/../../../..//td[@data-title=\"Company Name\"])")).toContainText(vars["Companyname"]);
}

/**
 * Step Group: Navigation to Customer Permission For Chase Direct
 * ID: 915
 * Steps: 10
 */
export async function stepGroup_Navigation_to_Customer_Permission_For_Chase_Direct(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const customerPermissionPage = new CustomerPermissionPage(page);
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await customerPermissionPage.CustomerPermission_Menu.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText("Customer Permission")).toBeVisible();
  vars["CompanyName"] = await page.locator("//td[contains(.,\"Allowed\") and @data-title=\"Chase Direct\"]/../td[@data-title=\"Company Name\"]").textContent() || '';
  vars["Companyname"] = String(vars["CompanyName"]).trim();
  await expect(page.locator("//td[contains(.,\"Allowed\") and @data-title=\"Chase Direct\"]/../td[@data-title=\"Company Name\"]")).toContainText(vars["Companyname"]);
}

/**
 * Step Group: Store Company Names from Company Permissions
 * ID: 923
 * Steps: 31
 */
export async function stepGroup_Store_Company_Names_from_Company_Permissions(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const actionsPage = new ActionsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  vars["FirstCompanyName"] = await actionsPage.Company_Name_ChaseDirect_FirstRow.textContent() || '';
  vars["FirstCompanyName"] = String(vars["FirstCompanyName"]).substring(1, String(vars["FirstCompanyName"]).length - 1);
  await page.locator("(//div[@id=\"common-table-results\"]//following-sibling::td[@data-title=\"Actions\"])[1]//button[@aria-label=\"Edit Permission\"]").click();
  await page.locator("//h5[contains(.,'Edit Permissions')]").waitFor({ state: 'visible' });
  if (true) /* Radio button Standard_Flow_On_Button is not selected */ {
    await page.locator("(//label[normalize-space(text())='Standard']/parent::div//input)[1]").click();
  }
  if (true) /* Radio button Chase_Direct_ON_button is not selected */ {
    await page.locator("(//label[normalize-space(text())='Chase Direct']/parent::div//input)[1]").click();
  }
  if (true) /* Element Update Permissions Button is enabled */ {
    await page.locator("//button[contains(.,'Update Permissions')]").click();
  } else {
    await actionsPage.Close_Model_Button.click();
  }
  await correspondentPortalPage.Search_Filter_Input_in_Customer_Permission.clear();
  await page.waitForLoadState('networkidle');
  await correspondentPortalPage.Search_Filter_Input_in_Customer_Permission.click();
  await correspondentPortalPage.Search_Filter_Input_in_Customer_Permission.fill(testData["Company name 2"]);
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  vars["SecondCompanyName"] = await actionsPage.Company_Name_ChaseDirect_FirstRow.textContent() || '';
  vars["SecondCompanyName"] = String(vars["SecondCompanyName"]).substring(1, String(vars["SecondCompanyName"]).length - 1);
  await page.locator("(//div[@id=\"common-table-results\"]//following-sibling::td[@data-title=\"Actions\"])[2]//button[@aria-label=\"Edit Permission\"]").click();
  await page.locator("//h5[contains(.,'Edit Permissions')]").waitFor({ state: 'visible' });
  if (true) /* Radio button Standard_Flow_On_Button is not selected */ {
    await page.locator("(//label[normalize-space(text())='Standard']/parent::div//input)[1]").click();
  }
  if (true) /* Radio button ChaseDirect_Off_Button is not selected */ {
    await page.locator("(//label[normalize-space(text())='Chase Direct']/parent::div//input)[2]").click();
  }
  if (true) /* Element Update Permissions Button is enabled */ {
    await page.locator("//button[contains(.,'Update Permissions')]").click();
  } else {
    await actionsPage.Close_Model_Button.click();
  }
  await correspondentPortalPage.Search_Filter_Input_in_Customer_Permission.clear();
  await page.waitForLoadState('networkidle');
}

/**
 * Step Group: Enter Company Name in New Map Filter
 * ID: 924
 * Steps: 6
 */
export async function stepGroup_Enter_Company_Name_in_New_Map_Filter(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortal9Page = new CorrespondentPortal9Page(page);
  await correspondentPortal9Page.Search_Input.clear();
  await expect(correspondentPortal9Page.Search_Input).toHaveValue('');
  await correspondentPortal9Page.Search_Input.fill(vars["SecondCompanyName"]);
  await page.waitForLoadState('networkidle');
  // [DISABLED] Verify that the current page displays text SecondCompanyName
  // await expect(page.getByText(vars["SecondCompanyName"])).toBeVisible();
  await page.locator("(//input[@type=\"checkbox\"])[1]").click();
}

/**
 * Step Group: Creation_of_Add_New_Header
 * ID: 925
 * Steps: 6
 */
export async function stepGroup_Creation_of_Add_New_Header(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//button[text()[normalize-space() = \"Add New Header\"]]").click();
  await page.locator("//div[text()='Custom Header']//..//..//input[contains(@class, 'form-control')]").fill(testData["Custom Header"]);
  await page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/following-sibling::div[contains(@class, 'd-flex')]//select[contains(@class, 'form-select')]").selectOption({ label: testData["Chase Field Name"] });
  await page.locator("//span[text()[normalize-space() = \"Insert Header\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText(testData["Custom Header"])).toBeVisible();
}

/**
 * Step Group: Edit_in_Header_Mapping
 * ID: 926
 * Steps: 7
 */
export async function stepGroup_Edit_in_Header_Mapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await expect(page.locator("//span[text()='Enumeration Mapping']")).toBeVisible();
  await page.locator("(//i[@class=\"fas fa-pencil-alt\"])[3]").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Update Header\"]]")).toBeVisible();
  await page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/following-sibling::div[contains(@class, 'd-flex')]//select[contains(@class, 'form-select')]").selectOption({ label: testData["ChaseFieldNames"] });
  await page.locator("//span[text()[normalize-space() = \"Update Header\"]]").click();
  await page.locator("//span[text()='Enumeration Mapping']").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: Checking the CheckBox in Header Mapping
 * ID: 927
 * Steps: 8
 */
export async function stepGroup_Checking_the_CheckBox_in_Header_Mapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("(//input[@type=\"checkbox\"])[2]").check();
  await page.locator("(//input[@type=\"checkbox\"])[3]").check();
  await page.locator("//span[text()='Enumeration Mapping']").click();
  await expect(page.locator("//p[text()[normalize-space() = \"Multiple client headers are mapped to the same Chase Field name. Please review and make changes.\"]]/..")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Continue Editing\"]]").click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator("(//input[@type=\"checkbox\"])[2]")).toBeVisible();
  await expect(page.locator("(//input[@type=\"checkbox\"])[3]")).toBeVisible();
}

/**
 * Step Group: Unchecking the CheckBox in Header Mapping
 * ID: 928
 * Steps: 8
 */
export async function stepGroup_Unchecking_the_CheckBox_in_Header_Mapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("(//input[@type=\"checkbox\"])[2]").uncheck();
  await page.locator("(//input[@type=\"checkbox\"])[3]").uncheck();
  await page.locator("//span[text()='Enumeration Mapping']").click();
  await expect(page.locator("//p[text()[normalize-space() = \"Multiple client headers are mapped to the same Chase Field name. Please review and make changes.\"]]/..")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Continue Editing\"]]").click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator("(//input[@type=\"checkbox\"])[2]")).toBeVisible();
  await expect(page.locator("(//input[@type=\"checkbox\"])[3]")).toBeVisible();
}

/**
 * Step Group: Add New Header 
 * ID: 929
 * Steps: 6
 */
export async function stepGroup_Add_New_Header(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//button[text()[normalize-space() = \"Add New Header\"]]").click();
  await page.locator("//div[text()='Custom Header']//..//..//input[contains(@class, 'form-control')]").fill(testData["CustomHeader"]);
  await page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/following-sibling::div[contains(@class, 'd-flex')]//select[contains(@class, 'form-select')]").selectOption({ label: testData["ChaseFieldNames"] });
  await page.locator("//span[text()[normalize-space() = \"Insert Header\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText(testData["CustomHeader"])).toBeVisible();
}

/**
 * Step Group: Selecting the multiple Company name Creating a New Map
 * ID: 931
 * Steps: 23
 */
export async function stepGroup_Selecting_the_multiple_Company_name_Creating_a_New_Map(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const correspondentPortal8Page = new CorrespondentPortal8Page(page);
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"Bid Maps\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//button[text()[normalize-space() = \"Add New Mapping\"]]").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Create New Map\"]]")).toBeVisible();
  vars["Create New Map"] = new Date().toLocaleDateString('en-US') /* format: dd/MM/yyyy/HH:mm:ss */;
  vars["Create New Map"] = "Testsigma_" + vars["Create New Map"];
  await correspondentPortalPage.Create_New_Map_Field.fill(vars["Create New Map"]);
  vars["BidMap"] = await correspondentPortalPage.Create_New_Map_Field.inputValue() || '';
  await correspondentPortal8Page.Compare_Button.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//span[contains(.,' $|Create New Map|')]")).toContainText(vars["Create New Map"]);
  await correspondentPortalPage.Select_Companys_Dropdown.click();
  await page.locator("((//input[@type=\"checkbox\" and not(contains(@aria-label,\"Home Sweet Mortgage\"))])[position() > 1 and position() < last()])[1]").check();
  vars["firstCompanySelected"] = await page.locator("(//input[@type=\"checkbox\"])[4]//following-sibling::div/span").textContent() || '';
  await page.locator("(//input[@type=\"checkbox\"])[5]").check();
  vars["secondCompanySelected"] = await page.locator("(//input[@type=\"checkbox\"])[5]//following-sibling::div/span").textContent() || '';
  await page.locator("(//input[@type=\"checkbox\"])[6]").check();
  vars["thirdCompanySelected"] = await page.locator("(//input[@type=\"checkbox\"])[6]//following-sibling::div/span").textContent() || '';
  await page.locator("(//input[@type=\"checkbox\"])[7]").check();
  vars["fourthCompanySelected"] = await page.locator("(//input[@type=\"checkbox\"])[7]//following-sibling::div/span").textContent() || '';
  await expect(page.locator("//button[contains(text(),\" Apply Selected \")]")).toContainText("4");
  await page.locator("//button[contains(text(),\" Apply Selected \")]").click();
}

/**
 * Step Group: Add Rule For Add Condition In Rules and Actions
 * ID: 935
 * Steps: 24
 */
export async function stepGroup_Add_Rule_For_Add_Condition_In_Rules_and_Actions(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const actionruleheaderPage = new ActionruleheaderPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//button[text()[normalize-space() = \"Add Rule\"]]").click();
  await actionruleheaderPage.Rule_Name_Field.fill(testData["Rule Name"]);
  vars["Rule Name"] = await actionruleheaderPage.Rule_Name_Field.inputValue() || '';
  await expect(actionruleheaderPage.Rule_Name_Field).toHaveValue(vars["Rule Name"]);
  await page.locator("//div[text()[normalize-space() = \"Select Category\"]]").click();
  vars["SelectCategory"] = await page.locator("(//div[@class=\"cursor-pointer py-3 text-wrap\"])[2]").textContent() || '';
  await page.locator("(//input[@type=\"checkbox\"])[2]").check();
  await page.locator("//button[contains(normalize-space(),\"Apply Selected 1\")]").click();
  await expect(page.locator("//h6[text()[normalize-space() = \"Add Conditions\"]]")).toBeVisible();
  await page.locator("//label[text()[normalize-space() = \"When Bid Field\"]]/following-sibling::div[contains(@class, 'd-flex')]//div[text()[normalize-space() = \"Select\"]]").click();
  await page.locator("//label[text()[normalize-space() = \"When Bid Field\"]]/following-sibling::div[contains(@class, 'd-flex')]//div[@aria-labelledby=\"singleSelectDropDown\"]//input[@type=\"search\"]").click();
  await expect(page.locator("//label[text()[normalize-space() = \"When Bid Field\"]]/following-sibling::div[contains(@class, 'd-flex')]//div[@aria-labelledby=\"singleSelectDropDown\"]//input[@type=\"search\"]")).toBeVisible();
  await page.locator("(//input[@type=\"search\"])[1]").fill(testData["BidField"]);
  vars["BidField"] = await page.locator("(//input[@type=\"search\"])[1]").inputValue() || '';
  await correspondentPortalPage.FICO_Score.click();
  await page.locator("//select[contains(normalize-space(),\"Select = != > < >= <= contains\")]").selectOption({ label: "LESS" });
  await page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[3]").click();
  await page.locator("(//label[text()[normalize-space() = \"Bid Enumerated Tape Value\"]]/following-sibling::div[contains(@class, 'd-flex')]//div[@aria-labelledby=\"singleSelectDropDown\"]//input[@type=\"search\"])[1]").click();
  await page.locator("(//input[@type=\"search\"])[2]").fill(testData["BidEnumeratedTapeValue"]);
  await expect(page.locator("(//label[text()[normalize-space() = \"Bid Enumerated Tape Value\"]]/following-sibling::div[contains(@class, 'd-flex')]//div[@aria-labelledby=\"singleSelectDropDown\"]//input[@type=\"search\"])[1]")).toHaveValue(testData["BidEnumeratedTapeValue"]);
  await page.locator("//a[text()=\"Select\"]").click();
  vars["RuleBidField"] = vars["BidField"];
  vars["RuleCondition"] = await page.locator("//select[contains(normalize-space(),\"Select = != > < >= <= contains\")]").inputValue() || '';
  vars["RuleBidTapeValue"] = testData["BidEnumeratedTapeValue"];
}

/**
 * Step Group: Store More Company Name
 * ID: 938
 * Steps: 3
 */
export async function stepGroup_Store_More_Company_Name(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["CompanyIndex"] = "1";
  vars["FirstCompanyName"] = await page.locator("//div[@id='common-table-results']/table//tr[$|CompanyIndex|]//td[@data-title=\"Company Name\"]").textContent() || '';
  vars["FirstCompanyName"] = String(vars["FirstCompanyName"]).substring(1, String(vars["FirstCompanyName"]).length - 1);
}

/**
 * Step Group: Edit in Header Mapping
 * ID: 939
 * Steps: 9
 */
export async function stepGroup_Edit_in_Header_Mapping_2(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await expect(page.locator("//span[text()='Enumeration Mapping']")).toBeVisible();
  await page.locator("(//i[@class=\"fas fa-pencil-alt\"])[3]").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Update Header\"]]")).toBeVisible();
  await page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/following-sibling::div[contains(@class, 'd-flex')]//select[contains(@class, 'form-select')]").selectOption({ index: parseInt("3") });
  // [DISABLED] Store text from the element CLM_Field_Name into a variable chaseFieldNames
  // vars["chaseFieldNames"] = await page.locator("//div[text()='CLM Field Name']//..//..//select").textContent() || '';
  vars["chasefieldnames"] = await page.locator("//div[text()='CLM Field Name']//..//..//select").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  await expect(page.locator("//div[text()='CLM Field Name']//..//..//select")).toContainText(vars["chasefieldnames"]);
  // [DISABLED] Verify that the current page displays text chaseFieldNames
  // await expect(page.getByText(vars["chaseFieldNames"])).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Update Header\"]]").click();
}

/**
 * Step Group: Only Chase Direct On for Company
 * ID: 940
 * Steps: 11
 */
export async function stepGroup_Only_Chase_Direct_On_for_Company(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const actionsPage = new ActionsPage(page);
  vars["CompanyNameActionIndex"] = "1";
  await page.locator("(//div[@id=\"common-table-results\"]//following-sibling::td[@data-title=\"Actions\"])[$|CompanyIndex|]//button[@aria-label=\"Edit Permission\"]").click();
  await page.locator("//h5[contains(.,'Edit Permissions')]").waitFor({ state: 'visible' });
  if (true) /* Radio button Standard_Flow_Off_Button is not selected */ {
    await page.locator("(//label[normalize-space(text())='Standard Flow']/parent::div//input)[2]").click();
  }
  if (true) /* Radio button Chase_Direct_ON_button is not selected */ {
    await page.locator("(//label[normalize-space(text())='Chase Direct']/parent::div//input)[1]").click();
  }
  if (true) /* Element Update Permissions Button is enabled */ {
    await page.locator("//button[contains(.,'Update Permissions')]").click();
  } else {
    await actionsPage.Close_Model_Button.click();
  }
}

/**
 * Step Group: Standard and Chase Direct ON for Company
 * ID: 941
 * Steps: 11
 */
export async function stepGroup_Standard_and_Chase_Direct_ON_for_Company(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const actionsPage = new ActionsPage(page);
  vars["CompanyNameActionIndex"] = "1";
  await page.locator("(//div[@id=\"common-table-results\"]//following-sibling::td[@data-title=\"Actions\"])[$|CompanyIndex|]//button[@aria-label=\"Edit Permission\"]").click();
  await page.locator("//h5[contains(.,'Edit Permissions')]").waitFor({ state: 'visible' });
  if (true) /* Radio button Standard_Flow_On_Button is not selected */ {
    await page.locator("(//label[normalize-space(text())='Standard']/parent::div//input)[1]").click();
  }
  if (true) /* Radio button Chase_Direct_ON_button is not selected */ {
    await page.locator("(//label[normalize-space(text())='Chase Direct']/parent::div//input)[1]").click();
  }
  if (true) /* Element Update Permissions Button is enabled */ {
    await page.locator("//button[contains(.,'Update Permissions')]").click();
  } else {
    await actionsPage.Close_Model_Button.click();
  }
}

/**
 * Step Group: Uploading the File
 * ID: 942
 * Steps: 10
 */
export async function stepGroup_Uploading_the_File(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
  await expect(page.locator("(//input[@type=\"file\"])[1]")).toHaveValue('');
  await expect(page.getByText("Drag and drop files here or click to browse. Allowed formats: .xls,.xlsx,.csv,.txt")).toBeVisible();
  await page.locator("(//input[@type=\"file\"])[1]").setInputFiles(path.resolve(__dirname, 'test-data', "DeepikaAugBidQA.xlsx"));
  await page.locator("//span[text()[normalize-space() = \"Map Headers\"]]").click();
  await page.locator("//h5[text()[normalize-space() = \"Save and Move to Next Page\"]]").waitFor({ state: 'visible' });
  await expect(page.locator("//*[contains(text(),\"This action will save the changes and Move to Next Page\")]")).toBeVisible();
  await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText(vars["Create New Map"])).toBeVisible();
  await page.locator("//a[text()[normalize-space() = \"Header Mapping\"]]").waitFor({ state: 'visible' });
}

/**
 * Step Group: Add Actions in Rules and Actions
 * ID: 943
 * Steps: 6
 */
export async function stepGroup_Add_Actions_in_Rules_and_Actions(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("(//select[@id=\"id\"])[2]").selectOption({ index: parseInt("16") });
  await page.locator("(//select[@class=\"form-select\" and @id=\"id\"])[last()]").click();
  await page.locator("//*[contains(text(),\"False\")]").click();
  vars["ChaseFiledNameonAddActions"] = await page.locator("(//label[normalize-space(text())='Chase Field Name']//..//select[@class=\"form-select\"])[1]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  // [DISABLED] Store the value displayed in the text box Action Chase Field Name 1 field into a variable ChaseFiledNameonAddActions
  // vars["ChaseFiledNameonAddActions"] = await page.locator("(//div[@class=\"row rules-actions\"]//div[@class=\"col-4\"]//select)[1]").inputValue() || '';
  vars["ChasevalueOnAddActions"] = await page.locator("(//label[normalize-space(text())='Chase Value']//..//select[@class=\"form-select\"])[1]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
}

/**
 * Step Group: Editing of Add Conditions and Add Actions
 * ID: 944
 * Steps: 13
 */
export async function stepGroup_Editing_of_Add_Conditions_and_Add_Actions(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const p24UnitDropdownPage = new P24UnitDropdownPage(page);
  const statusInactivePage = new StatusInactivePage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[2]").click();
  await page.locator("(//input[@type=\"search\"])[2]").fill(testData["BidFields"]);
  vars["BidField"] = await page.locator("(//input[@type=\"search\"])[2]").inputValue() || '';
  await p24UnitDropdownPage.When_Bid_Field_Name.click();
  expect(String(vars["BidField"])).toBe(testData["BidFields"]);
  vars["EditedBidField[RulesAndActions]"] = await page.locator("(//div[@class=\"rules-conditions\"]//button//div[contains(@class,\"flex-grow-1\")])[1]").inputValue() || '';
  await page.waitForLoadState('networkidle');
  await page.locator("(//button[@id=\"singleSelectDropDownWithSearch\"])[2]").click();
  await page.locator("(//input[@type=\"search\"])[2]").fill(testData["Bid Enumerated Tape Value"]);
  vars["BidField"] = await page.locator("(//input[@type=\"search\"])[2]").inputValue() || '';
  await statusInactivePage.Select_Button.click();
  expect(String(vars["BidField"])).toBe(testData["Bid Enumerated Tape Value"]);
  vars["EditedBidTape[RulesAndActions]"] = await page.locator("(//div[@class=\"rules-conditions\"]//button//div[contains(@class,\"flex-grow-1\")])[2]").inputValue() || '';
}

/**
 * Step Group: Add Field in Enumeration Mapping
 * ID: 945
 * Steps: 4
 */
export async function stepGroup_Add_Field_in_Enumeration_Mapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("(//button[text()[normalize-space() = \"Add Field\"]])[1]").click();
  await page.locator("//input[@type=\"text\" and contains(@class, 'input-field-edit')]").fill(Array.from({length: 7}, () => "abc".charAt(Math.floor(Math.random() * 3))).join(''));
  vars["BidTapeValue"] = await page.locator("//input[@type=\"text\" and contains(@class, 'input-field-edit')]").inputValue() || '';
  await expect(page.locator("//input[@type=\"text\" and contains(@class, 'input-field-edit')]")).toHaveValue(vars["BidTapeValue"]);
}

/**
 * Step Group: Deleting the Header Mapping
 * ID: 948
 * Steps: 7
 */
export async function stepGroup_Deleting_the_Header_Mapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("(//i[@class=\"fas fa-trash-alt text-danger\"])[5]").click();
  await expect(page.locator("//div[contains(@class, 'modal-header')]")).toBeVisible();
  vars["DeleteHeaderMapping"] = await page.locator("(//div[contains(@class,\"gap-2 header-grid-layout\")]//div[@class=\"flex-grow-1\"])[5]").textContent() || '';
  vars["BidSampleFieldName"] = await page.locator("//div[text()[normalize-space() = 'You have selected to delete \"$|DeleteHeaderMapping|\" mapping. Do you want to proceed?']]").textContent() || '';
  await expect(page.getByText(vars["BidSampleFieldName"])).toBeVisible();
  await page.locator("(//button[@type=\"button\"])[last()]").click();
  await page.waitForLoadState('networkidle');
}

/**
 * Step Group: Import_Rule_In_Rules_and_Actions
 * ID: 952
 * Steps: 9
 */
export async function stepGroup_Import_Rule_In_Rules_and_Actions(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await expect(page.locator("//span[text()[normalize-space() = \"Save and Publish\"]]")).toBeVisible();
  await page.locator("//button[text()[normalize-space() = \"Import Rule\"]]").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Select Rule/s\"]]")).toBeVisible();
  await correspondentPortalPage.Search_Map_Input.waitFor({ state: 'visible' });
  await correspondentPortalPage.Search_Map_Input.fill(testData["Search Map Input"]);
  await page.locator("(//span[@class='ngb-highlight'][contains(.,'@|Search Map Input|')])[1]").click();
  await correspondentPortalPage.Import_Rule_Checkbox.check();
  await page.locator("//span[contains(normalize-space(),\"Apply Selected 1\")]").click();
  await expect(page.locator("//h6[text()[normalize-space() = \"Add Conditions\"]]")).toBeVisible();
}

/**
 * Step Group: Delete_In_Enumeration_Mapping
 * ID: 961
 * Steps: 8
 */
export async function stepGroup_Delete_In_Enumeration_Mapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["BidTapeValueforBeforeDeleted"] = await page.locator("(//div[contains(@class,\"input-field-name text\")])[1]").inputValue() || '';
  await page.locator("(//div[contains(@class,\"input-field-name text\")]/..//button[@type=\"button\"])[1]").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Delete Enumeration Pair\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Yes, Go ahead.\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  vars["Bid Tape Value for After Deleted"] = await page.locator("(//div[contains(@class,\"input-field-name text\")])[1]").inputValue() || '';
  // [DISABLED] Verify that the element Delete_In_EnumerationMapping is not displayed and With Scrollable FALSE
  // await expect(page.locator("(//div[contains(@class,\"input-field-name text\")]/..//button[@type=\"button\"])[1]")).toBeVisible();
  expect(String(vars["BidTapeValueforBeforeDeleted"])).toBe(vars["Bid Tape Value for After Deleted"]);
}

/**
 * Step Group: Editing Header Mapping
 * ID: 965
 * Steps: 7
 */
export async function stepGroup_Editing_Header_Mapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await expect(page.locator("//span[text()='Enumeration Mapping']")).toBeVisible();
  await page.locator("(//i[@class=\"fas fa-pencil-alt\"])[3]").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Update Header\"]]")).toBeVisible();
  await page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/following-sibling::div[contains(@class, 'd-flex')]//select[contains(@class, 'form-select')]").selectOption({ label: testData["ChaseFieldNames"] });
  vars["UpdatedChaseFieldNameHeaderMapping"] = await page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/following-sibling::div[contains(@class, 'd-flex')]//select[contains(@class, 'form-select')]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  vars["UpdatedBidSampleName[HeaderMapping]"] = await page.locator("//div[text()=\"Custom Header\"]/../..//input").inputValue() || '';
  await page.locator("//span[text()[normalize-space() = \"Update Header\"]]").click();
}

/**
 * Step Group: Deleting_the_UnMapped_fields_in_Header_Mapping
 * ID: 972
 * Steps: 5
 */
export async function stepGroup_Deleting_the_UnMapped_fields_in_Header_Mapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const americanPacificPage = new AmericanPacificPage(page);
  const loginPage = new LoginPage(page);
  while (await americanPacificPage.header_anme.isVisible()) {
    await loginPage.Delete_button_in_Header_Mapping.click();
    await expect(page.locator("//div[contains(@class, 'modal-header')]")).toBeVisible();
    await page.locator("(//button[@type=\"button\"])[last()]").click();
    await page.waitForLoadState('networkidle');
  }
}

/**
 * Step Group: Storing All Enum TDP Values into a Variable
 * ID: 973
 * Steps: 3
 */
export async function stepGroup_Storing_All_Enum_TDP_Values_into_a_Variable(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  const testDataSets: Record<string, string>[] = []; // TODO: Load test data sets
  vars["EnumValues"] = "Loan Purpose";
  // Loop over test data sets in "Enum Type Values." from set2 to set18
for (const testDataSet of testDataSets) {
    vars["EnumValues"] = String(testData["Enum Type"]) + "," + String(vars["EnumValues"]);
  }
}

/**
 * Step Group: Deleting_the_Header__Mapping
 * ID: 976
 * Steps: 7
 */
export async function stepGroup_Deleting_the_Header_Mapping_2(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("(//i[@class=\"fas fa-trash-alt text-danger\"])[3]").click();
  await expect(page.locator("//div[contains(@class, 'modal-header')]")).toBeVisible();
  vars["DeleteHeaderMapping"] = await page.locator("(//div[@class=\"flex-grow-1\"])[7]").textContent() || '';
  vars["BidSampleFieldName"] = await page.locator("//div[text()[normalize-space() = 'You have selected to delete \"$|DeleteHeaderMapping|\" mapping. Do you want to proceed?']]").textContent() || '';
  await expect(page.getByText(vars["BidSampleFieldName"])).toBeVisible();
  await page.locator("(//button[@type=\"button\"])[last()]").click();
  await page.waitForLoadState('networkidle');
}

/**
 * Step Group: Verification of Chase Enum Values From Header Mapping To Chase Enum Values in Enumeration Mapping
 * ID: 977
 * Steps: 6
 */
export async function stepGroup_Verification_of_Chase_Enum_Values_From_Header_Mapping_To_Cha(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const enumerationMappingPage = new EnumerationMappingPage(page);
  vars["ChaseEnumNamesCount"] = String(await enumerationMappingPage.Chase_Enum_Names.count());
  vars["count1"] = "1";
  while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["ChaseEnumNamesCount"]))) {
    vars["ChaseName"] = await page.locator("(//div[@class=\"my-2\"])[$|count1|]").inputValue() || '';
    expect(String(vars["ChaseEnumValue"])).toBe(vars["ChaseName"]);
    vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
  }
}

/**
 * Step Group: Create_New_Header_In_Header_Mapping
 * ID: 978
 * Steps: 6
 */
export async function stepGroup_Create_New_Header_In_Header_Mapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//button[text()[normalize-space() = \"Add New Header\"]]").click();
  await page.locator("//div[text()='Custom Header']//..//..//input[contains(@class, 'form-control')]").fill(testData["Custom Header"]);
  await page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/following-sibling::div[contains(@class, 'd-flex')]//select[contains(@class, 'form-select')]").selectOption({ label: testData["Chase Field Name"] });
  await page.locator("//span[text()[normalize-space() = \"Insert Header\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText(testData["Custom Header"])).toBeVisible();
}

/**
 * Step Group: Deleting_In_Rules_and_Actions
 * ID: 1002
 * Steps: 5
 */
export async function stepGroup_Deleting_In_Rules_and_Actions(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const actionruleheaderPage = new ActionruleheaderPage(page);
  await page.locator("(//span[text()[normalize-space() = \"Delete Rule\"]])[1]").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Delete Rule\"]]")).toBeVisible();
  await page.locator("(//button[@type=\"button\"])[last()]").click();
  await page.waitForLoadState('networkidle');
  // [DISABLED] Verify that the text Rule Name is not displayed in the element Rule Name and With Scrollable FALSE
  // await expect(actionruleheaderPage.Rule_Name_Field).not.toContainText(vars["Rule Name"]);
}

/**
 * Step Group: Adding Field In Enumeration Mapping
 * ID: 1006
 * Steps: 5
 */
export async function stepGroup_Adding_Field_In_Enumeration_Mapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("(//button[text()[normalize-space() = \"Add Field\"]])[1]").click();
  await page.locator("//input[@type=\"text\" and contains(@class, 'input-field-edit')]").fill(Array.from({length: 7}, () => "abc".charAt(Math.floor(Math.random() * 3))).join(''));
  vars["AddedBidTapeValue[EnumerationMapping]"] = await page.locator("//input[@type=\"text\" and contains(@class, 'input-field-edit')]").inputValue() || '';
  await page.locator("(//input[@class=\"input-field-edit\"]/../../../../..//select[@class=\"form-select\"])[2]").click();
  await page.locator("(//input[@class=\"input-field-edit\"]/../../../../..//select[@class=\"form-select\"])[2]").selectOption({ index: parseInt("2") });
}

/**
 * Step Group: Edition In Enumeration Mapping
 * ID: 1007
 * Steps: 8
 */
export async function stepGroup_Edition_In_Enumeration_Mapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.waitForLoadState('networkidle');
  await page.locator("(//select[@id=\"id\"])[3]").click();
  await page.locator("(//select[@id=\"id\"])[3]").selectOption({ index: parseInt("2") });
  vars["EditedChaseValue[Enumeration Mapping]"] = await page.locator("(//select[@id=\"id\"])[3]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  await expect(page.getByText(vars["EditedChaseValue[Enumeration Mapping]"])).toBeVisible();
  // [DISABLED] Verify that the element Chase Values Dropdown displays text EditedChaseValue[Enumeration Mapping] and With Scrollable FALSE
  // await expect(page.locator("(//select[@id=\"id\"])[3]")).toContainText(vars["EditedChaseValue[Enumeration Mapping]"]);
  // [DISABLED] Select option by text Chasevalues in the Fixed rate Dropdown list
  // await page.locator("//*[text()=\"First Time Home Buyer\"]/../..//select").selectOption({ label: testData["Chasevalues"] });
  // [DISABLED] Store the text of the selected option from Fixed rate Dropdown list into a variable ChaseValue
  // vars["ChaseValue"] = await page.locator("//*[text()=\"First Time Home Buyer\"]/../..//select").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
}

/**
 * Step Group: Deleting the Rule in Rules and Actions Page
 * ID: 1009
 * Steps: 5
 */
export async function stepGroup_Deleting_the_Rule_in_Rules_and_Actions_Page(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const actionruleheaderPage = new ActionruleheaderPage(page);
  await page.locator("(//span[text()[normalize-space() = \"Delete Rule\"]])[2]").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Delete Rule\"]]")).toBeVisible();
  await page.locator("(//button[@type=\"button\"])[last()]").click();
  await page.waitForLoadState('networkidle');
  // [DISABLED] Verify that the text Rule Name is not displayed in the element Rule Name and With Scrollable FALSE
  // await expect(actionruleheaderPage.Rule_Name_Field).not.toContainText(vars["Rule Name"]);
}

/**
 * Step Group: Delete a Header In Header Mapping
 * ID: 1010
 * Steps: 4
 */
export async function stepGroup_Delete_a_Header_In_Header_Mapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("(//i[@class=\"fas fa-trash-alt text-danger\"])[5]").click();
  await expect(page.locator("//div[contains(@class, 'modal-header')]")).toBeVisible();
  await page.locator("(//button[@type=\"button\"])[last()]").click();
  await page.waitForLoadState('networkidle');
}

/**
 * Step Group: Creating New BidMap Upto Upload File
 * ID: 1026
 * Steps: 23
 */
export async function stepGroup_Creating_New_BidMap_Upto_Upload_File(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const correspondentPortal8Page = new CorrespondentPortal8Page(page);
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//h1[text()=\"Mappings\"]")).toBeVisible();
  // [DISABLED] Navigation to Customer Permission
  // await stepGroup_Navigation_to_Customer_Permission(page, vars);
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"Bid Maps\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//h1[text()=\"Mappings\"]")).toBeVisible();
  await page.locator("//button[text()[normalize-space() = \"Add New Mapping\"]]").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Create New Map\"]]")).toBeVisible();
  vars["Current Date"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata" };
    const fmt = "MM/dd/yyyy";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["Create New Map"] = new Date().toLocaleDateString('en-US') /* format: MM/dd/yyyy/HH:mm:ss */;
  vars["Create New Map"] = "Testsigma_" + vars["Create New Map"];
  await correspondentPortalPage.Create_New_Map_Field.fill(vars["Create New Map"]);
  vars["BidMap"] = await correspondentPortalPage.Create_New_Map_Field.inputValue() || '';
  await correspondentPortal8Page.Compare_Button.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//span[contains(.,' $|Create New Map|')]")).toContainText(vars["Create New Map"]);
  await correspondentPortalPage.Select_Companys_Dropdown.click();
  await page.locator("//span[@class='pl-2'][contains(.,'$|Companyname|')]").click();
  await page.locator("//button[contains(text(),\" Apply Selected \")]").click();
  await expect(page.locator("(//input[@type=\"file\"])[1]")).toHaveValue('');
  await expect(page.getByText("Drag and drop files here or click to browse. Allowed formats: .xls,.xlsx,.csv,.txt")).toBeVisible();
  await page.locator("(//input[@type=\"file\"])[1]").setInputFiles(path.resolve(__dirname, 'test-data', "DeepikaAugBidQA.xlsx"));
}

/**
 * Step Group: Creating_of_Add_New__Header
 * ID: 1031
 * Steps: 28
 */
export async function stepGroup_Creating_of_Add_New_Header(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const correspondentPortal8Page = new CorrespondentPortal8Page(page);
  const proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
  // [DISABLED] Navigation to Customer Permission
  // await stepGroup_Navigation_to_Customer_Permission(page, vars);
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"Bid Maps\"]]").click();
  await page.locator("//button[text()[normalize-space() = \"Add New Mapping\"]]").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Create New Map\"]]")).toBeVisible();
  vars["Current Date"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata" };
    const fmt = "MM/dd/yyyy";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["Create New Map"] = new Date().toLocaleDateString('en-US') /* format: MM/dd/yyyy/HH:mm:ss */;
  vars["Create New Map"] = "Testsigma_" + vars["Create New Map"];
  await correspondentPortalPage.Create_New_Map_Field.fill(vars["Create New Map"]);
  vars["BidMap"] = await correspondentPortalPage.Create_New_Map_Field.inputValue() || '';
  await correspondentPortal8Page.Compare_Button.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//span[contains(.,' $|Create New Map|')]")).toContainText(vars["Create New Map"]);
  await correspondentPortalPage.Select_Companys_Dropdown.click();
  await page.locator("//span[@class='pl-2'][contains(.,'$|Companyname|')]").click();
  vars["Companyname"] = await page.locator("//span[@class='pl-2'][contains(.,'$|Companyname|')]").textContent() || '';
  await page.locator("//button[contains(text(),\" Apply Selected \")]").click();
  vars["Companyname"] = await page.locator("//label[text()=\"Select Company/s\"]/..//div[@class=\"pill rounded-pill relative\"]//span").textContent() || '';
  vars["ExecutionType"] = await page.locator("//label[text()=\"Execution Type\"]/..//select").inputValue() || '';
  await expect(page.locator("(//input[@type=\"file\"])[1]")).toHaveValue('');
  await expect(page.getByText("Drag and drop files here or click to browse. Allowed formats: .xls,.xlsx,.csv,.txt")).toBeVisible();
  await page.locator("(//input[@type=\"file\"])[1]").setInputFiles(path.resolve(__dirname, 'test-data', "DeepikaAugBidQA.xlsx"));
  vars["File"] = await page.locator("//label[text()=\"Upload File\"]/..//div[contains(@class,\"text-truncate flex-grow-1\")]").textContent() || '';
  // [DISABLED] Click on Map Headers Button
  // await page.locator("//span[text()[normalize-space() = \"Map Headers\"]]").click();
  // [DISABLED] Verify that the element This action will save the changes and Move to Next Page is displayed and With Scrollable FALSE
  // await expect(page.locator("//*[contains(text(),\"This action will save the changes and Move to Next Page\")]")).toBeVisible();
  // [DISABLED] Click on Proceed with Saving Button
  // await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
  // [DISABLED] Wait until the element Spinner is not visible
  // await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  // [DISABLED] Verify that the current page displays text Create New Map
  // await expect(page.getByText(vars["Create New Map"])).toBeVisible();
}

/**
 * Step Group: Fetching Mapped Enum Values From Header Mapping and Verifying them In Enumeration Filter Dropdown
 * ID: 1036
 * Steps: 17
 */
export async function stepGroup_Fetching_Mapped_Enum_Values_From_Header_Mapping_and_Verifyin(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const advanceSearch2Page = new AdvanceSearch2Page(page);
  const chaseFieldNamePage = new ChaseFieldNamePage(page);
  while (parseFloat(String(vars["count"])) < parseFloat(String(vars["MappedChaseFieldCount"]))) {
    vars["ChaseName"] = await page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    if (String(vars["EnumValues"]).includes(String(vars["ChaseName"]))) {
      // [DISABLED] Concate ChaseName and ChaseEnumValue with SpecialCharacter , and store into a variable ChaseEnumValue
      // vars["ChaseEnumValue"] = String(vars["ChaseName"]) + "," + String(vars["ChaseEnumValue"]);
      vars["CorrespondentBidName"] = await page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]/../../..//div[@class=\"flex-grow-1\"]").textContent() || '';
      vars["IndividualBidSample/ChaseValueName"] = String(vars["CorrespondentBidName"]) + "/" + String(vars["ChaseName"]);
      vars["IndividualBidSample/ChaseValueName"] = String(vars["IndividualBidSample/ChaseValueName"]).trim();
      await page.locator("//span[text()='Enumeration Mapping']").click();
      await advanceSearch2Page.Yes_Proceed_Button.click();
      await chaseFieldNamePage.All_Companies_DropdownDash_Board.waitFor({ state: 'visible' });
      await chaseFieldNamePage.All_Companies_DropdownDash_Board.click();
      vars["IndividualBidSample/ChaseValueName[Dropdown]"] = await page.locator("//div[@class=\"dropdown-overflow\"]//*[contains(text(),\"$|ChaseName|\")]").textContent() || '';
      vars["IndividualBidSample/ChaseValueName[Dropdown]"] = String(vars["IndividualBidSample/ChaseValueName[Dropdown]"]).trim();
      expect(String(vars["IndividualBidSample/ChaseValueName"])).toBe(vars["IndividualBidSample/ChaseValueName[Dropdown]"]);
      await page.locator("//a[contains(text(),\"Header Mapping\")]").click();
      await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}

/**
 * Step Group: Advanced Search For Rules
 * ID: 1039
 * Steps: 19
 */
export async function stepGroup_Advanced_Search_For_Rules(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidMapPage = new BidMapPage(page);
  const bidmapDashboardPage = new BidmapDashboardPage(page);
  const advanceSearchPage = new AdvanceSearchPage(page);
  const mappingListPage = new MappingListPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await bidMapPage.SearchFilter_Input_Field.click();
  await page.locator("//a[text()[normalize-space() = \"Try Advanced Search and Filter option\"]]").click();
  await expect(page.locator("//*[text()[normalize-space() = \"Advanced Search/Filter\"]]")).toBeVisible();
  await page.locator("//label[text()=\"If Bid Field\"]/../..//select/ancestor::div//*[@aria-label=\"Bid Map Field\"]//select").selectOption({ label: vars["RuleBidField"] });
  await expect(page.getByText(vars["RuleBidField"])).toBeVisible();
  await bidmapDashboardPage.Operations_Dropdown_Advance_Search.selectOption({ label: vars["RuleCondition"] });
  if (true) /* Element Chase Value Input box is visible */ {
    await advanceSearchPage.Chase_Value_Input_box.click();
    await advanceSearchPage.Chase_Value_Input_box.fill(testData["Bid Enumerated Tape Value"]);
  } else if (true) /* Element Chase Values Select is enabled */ {
    await advanceSearchPage.Chase_Values_Select.selectOption({ label: vars["ChaseValues"] });
  }
  await expect(page.locator("//span[text()[normalize-space() = \"Show Results\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Show Results\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  // [DISABLED] Verify that the current page displays an element Searched Map Name and With Scrollable FALSE
  // await expect(page.locator("(//td//button[text()=\" $|BidMapName1| \"])")).toBeVisible();
  // [DISABLED] Store the count of elements identified by locator Total Bid Maps into a variable BidMapCount
  // vars["BidMapCount"] = String(await mappingListPage.Bid_Maps.count());
  // [DISABLED] Verify that the current page displays an element Searched Map Name and With Scrollable FALSE
  // await expect(page.locator("(//td//button[text()=\" $|BidMapName1| \"])")).toBeVisible();
  // [DISABLED] Verify if BidMapCount > 1
  // if (String(vars["BidMapCount"]) > String("1"))
    // [DISABLED] Verify that the current page displays an element Second Bid Map and With Scrollable FALSE
    // await expect(mappingListPage.Second_Bid_Map).toBeVisible();
}

/**
 * Step Group: Advance Search For Actions
 * ID: 1040
 * Steps: 17
 */
export async function stepGroup_Advance_Search_For_Actions(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidMapPage = new BidMapPage(page);
  const mappingListPage = new MappingListPage(page);
  await bidMapPage.SearchFilter_Input_Field.click();
  await page.locator("//a[text()[normalize-space() = \"Try Advanced Search and Filter option\"]]").click();
  await expect(page.locator("//*[text()[normalize-space() = \"Advanced Search/Filter\"]]")).toBeVisible();
  await expect(page.locator("(//*[text()[normalize-space() = \"Actions\"]])[2]")).toBeVisible();
  await page.locator("//label[text()=\"Chase value\"]/../..//*[@aria-label=\"LP Field Type\"]//select").selectOption({ label: vars["ActionChaseField"] });
  await expect(page.getByText(vars["ActionChaseField"])).toBeVisible();
  if (true) /* Element Chase Field Input box is enabled */ {
    await page.locator("//div[@aria-labelledby=\"actionsGroup\"]//label[text()=\"Chase value\"]/../..//*[@aria-label=\"LP Field Value\"]//input").fill(vars["ActionChaseValue"]);
  } else if (true) /* Element Chase Field Select list is enabled */ {
    await page.locator("//label[text()=\"Chase value\"]/../..//*[@aria-label=\"LP Field Value\"]//select").selectOption({ label: vars["ActionChaseValue"] });
  }
  await expect(page.locator("//span[text()[normalize-space() = \"Show Results\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Show Results\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  // [DISABLED] Verify that the current page displays an element Searched Map Name and With Scrollable FALSE
  // await expect(page.locator("(//td//button[text()=\" $|BidMapName1| \"])")).toBeVisible();
  // [DISABLED] Store the count of elements identified by locator Total Bid Maps into a variable BidMapCount
  // vars["BidMapCount"] = String(await mappingListPage.Bid_Maps.count());
  // [DISABLED] Verify if BidMapCount > 1
  // if (String(vars["BidMapCount"]) > String("1"))
    // [DISABLED] Verify that the current page displays an element Second Bid Map and With Scrollable FALSE
    // await expect(mappingListPage.Second_Bid_Map).toBeVisible();
}

/**
 * Step Group: Create_NewMap
 * ID: 1042
 * Steps: 21
 */
export async function stepGroup_Create_NewMap(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const mapNameFieldInBidMapsPage = new MapNameFieldInBidMapsPage(page);
  const correspondentPortal8Page = new CorrespondentPortal8Page(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
  await page.waitForLoadState('networkidle');
  await stepGroup_Navigation_to_Customer_Permission(page, vars);
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"Bid Maps\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//button[text()[normalize-space() = \"Add New Mapping\"]]").click();
  vars["SearchMapNumber"] = String(Math.floor(Math.random() * (50 - 22 + 1)) + 22);
  vars["SearchFieldInputMap"] = "TS_SEARCHMAP" + vars["SearchMapNumber"];
  await mapNameFieldInBidMapsPage.Map_Name_Field_in_Bid_Maps.fill(vars["SearchFieldInputMap"]);
  await expect(correspondentPortal8Page.Compare_Button).toBeVisible();
  await correspondentPortal8Page.Compare_Button.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  // [DISABLED] Verify that the element Bid Maps Name displays text contains TS_SEARCH and With Scrollable FALSE
  // await expect(page.locator("//span[contains(.,' $|Create New Map|')]")).toContainText("TS_SEARCH");
  await correspondentPortalPage.Select_Companys_Dropdown.click();
  await page.locator("//span[@class='pl-2'][contains(.,'$|Companyname|')]").click();
  await page.locator("//button[contains(text(),\" Apply Selected \")]").click();
  await page.locator("(//input[@type=\"file\"])[1]").setInputFiles(path.resolve(__dirname, 'test-data', "DeepikaAugBidQA.xlsx"));
  await page.locator("//span[text()[normalize-space() = \"Map Headers\"]]").click();
  await expect(page.locator("//*[contains(text(),\"This action will save the changes and Move to Next Page\")]")).toBeVisible();
  await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: Add_Actions_In_Rules_and_Actions
 * ID: 1043
 * Steps: 7
 */
export async function stepGroup_Add_Actions_In_Rules_and_Actions(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("(//select[@id=\"id\"])[2]").selectOption({ index: parseInt("2") });
  await page.locator("(//select[@class=\"form-select\" and @id=\"id\"])[last()]").click();
  await page.locator("//label[text()=\"Chase Value\"]/..//button[@id=\"singleSelectDropDownWithSearch\"]").click();
  await page.locator("(//input[@type=\"search\"])[3]").fill("TS_SEARCH");
  await page.locator("//a[text()=\"Select\"]").click();
  vars["ChaseFiledNameonAddActions"] = await page.locator("(//label[normalize-space(text())='Chase Field Name']//..//select[@class=\"form-select\"])[1]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  vars["ChaseFiledNameonAddActions"] = await page.locator("(//div[@class=\"row rules-actions\"]//div[@class=\"col-4\"]//select)[1]").inputValue() || '';
}

/**
 * Step Group: Fetching Enum From Header Mapping Screen and Verifying the Show All Enumerations Filter In Dropdown In Enumeration Mapping 
 * ID: 1046
 * Steps: 18
 */
export async function stepGroup_Fetching_Enum_From_Header_Mapping_Screen_and_Verifying_the_S(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const headerMappingPage = new HeaderMappingPage(page);
  const advanceSearch2Page = new AdvanceSearch2Page(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  const testDataSets: Record<string, string>[] = []; // TODO: Load test data sets
  vars["EnumValues"] = "Loan Purpose";
  // Loop over test data sets in "Enum Type Values." from set2 to set18
for (const testDataSet of testDataSets) {
    vars["EnumValues"] = String(testData["Enum Type"]) + "," + String(vars["EnumValues"]);
  }
  vars["MappedChaseFieldCount"] = String(await headerMappingPage.MappedChaseFieldName.count());
  vars["count"] = "1";
  vars["ChaseEnumValue"] = "sample";
  while (parseFloat(String(vars["count"])) < parseFloat(String(vars["MappedChaseFieldCount"]))) {
    vars["ChaseName"] = await page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    if (String(vars["EnumValues"]).includes(String(vars["ChaseName"]))) {
      vars["ChaseEnumValue"] = String(vars["ChaseName"]) + "," + String(vars["ChaseEnumValue"]);
      vars["CorrespondentBidName"] = await page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]/../../..//div[@class=\"flex-grow-1\"]").textContent() || '';
      await page.locator("//span[text()='Enumeration Mapping']").click();
      await advanceSearch2Page.Yes_Proceed_Button.click();
      await page.locator("//span[text()[normalize-space() = \"Rules and Actions\"]]").waitFor({ state: 'visible' });
      await expect(page.locator("(//div[@class=\"my-2\" and text()=\"$|ChaseName|\"]/../..//div)[3]")).toContainText(vars["CorrespondentBidName"]);
      await page.locator("//a[contains(text(),\"Header Mapping\")]").click();
      await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}

/**
 * Step Group: Verification Of Unidentified Fields In Header Mapping
 * ID: 1048
 * Steps: 2
 */
export async function stepGroup_Verification_Of_Unidentified_Fields_In_Header_Mapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const americanPacificPage = new AmericanPacificPage(page);
  vars["UnidentifiedCount"] = String(await americanPacificPage.header_anme.count());
  expect(String(vars["UnidentifiedCount"])).toBe("1");
}

/**
 * Step Group: Verifying_ChaseValue_In_EnumerationMapping
 * ID: 1052
 * Steps: 9
 */
export async function stepGroup_Verifying_ChaseValue_In_EnumerationMapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const chaseValuePage = new ChaseValuePage(page);
  vars["count"] = "1";
  vars["ChaseValues"] = String(await chaseValuePage.Chase_Values_In_Enumration_Page.count());
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["ChaseValues"]))) {
    vars["values"] = await page.locator("(//div[@class=\"mb-2\"]//..//select[@class=\"form-select\"])[$|count|]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    vars["value"] = String(vars["values"]).trim();
    if (String(vars["value"]) === String("Select")) {
      await page.locator("(//div[@class=\"mb-2\"]//..//select[@class=\"form-select\"])[$|count|]").selectOption({ index: parseInt("1") });
    // [DISABLED] Step group
    // // TODO: No template - Unknown step
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}

/**
 * Step Group: Verification of ExportList from UI to Excel
 * ID: 1054
 * Steps: 25
 */
export async function stepGroup_Verification_of_ExportList_from_UI_to_Excel(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("//div[text()[normalize-space() = \"Export List\"]]").click();
  await page.waitForTimeout(5000);
  vars["FileName"] = vars['_lastDownloadPath'] || '';
  // [DISABLED] Copy the latest downloaded file and save the file path in runtime-variable FileName
  // if (vars['_lastDownloadPath']) { require('fs').copyFileSync(vars['_lastDownloadPath'], vars['_lastDownloadPath'] + '.copy'); }
  // [DISABLED] Store the recent downloaded file name to variable FileName
  // vars[""] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
  vars["RowsCount"] = String(await page.locator("(//tbody//tr)[position() >= 1 and position() <= last()]").count());
  vars["RowCountUI"] = "1";
  vars["RowCountExcel"] = "1";
  while (parseFloat(String(vars["RowCountUI"])) <= parseFloat(String(vars["RowsCount"]))) {
    vars["ColumnCountUI"] = "2";
    vars["ColumnCountExcel"] = "0";
    while (parseFloat(String(vars["ColumnCountUI"])) <= parseFloat(String("10"))) {
      await page.locator("//button[@role=\"button\" and contains(text(),\"Show 20\")]").click();
      await page.locator("(//tbody//tr[$|RowCountUI|]//td)[$|ColumnCountUI|]").hover();
      vars["CellValueInExcel"] = excelHelper.readCell(vars['_lastDownloadPath'] || '', vars["RowCountExcel"], vars["ColumnCountExcel"], "0");
      if (String(vars["CellValueInExcel"]) === String("Key_blank")) {
        vars["CellValueInExcel"] = "-";
      }
      vars["CellValueInExcel"] = String(vars["CellValueInExcel"]).trim();
      vars["CellValueInUI"] = await page.locator("(//tbody//tr[$|RowCountUI|]//td)[$|ColumnCountUI|]").textContent() || '';
      vars["CellValueInUI"] = String(vars["CellValueInUI"]).trim();
      expect(String(vars["CellValueInExcel"])).toBe(vars["CellValueInUI"]);
      vars["ColumnCountExcel"] = (parseFloat(String("1")) + parseFloat(String(vars["ColumnCountExcel"]))).toFixed(0);
      vars["ColumnCountUI"] = (parseFloat(String("1")) + parseFloat(String(vars["ColumnCountUI"]))).toFixed(0);
    }
    vars["RowCountExcel"] = (parseFloat(String("1")) + parseFloat(String(vars["RowCountExcel"]))).toFixed(0);
    vars["RowCountUI"] = (parseFloat(String("1")) + parseFloat(String(vars["RowCountUI"]))).toFixed(0);
  }
}

/**
 * Step Group: Checking All Enum Fields In Header Mapping Screen
 * ID: 1060
 * Steps: 14
 */
export async function stepGroup_Checking_All_Enum_Fields_In_Header_Mapping_Screen(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const headerMappingPage = new HeaderMappingPage(page);
  vars["MappedChaseFieldCount"] = String(await headerMappingPage.MappedChaseFieldName.count());
  vars["count"] = "1";
  vars["ChaseEnumValue"] = "sample";
  vars["CorrespondentBidNames"] = "sample";
  while (parseFloat(String(vars["count"])) < parseFloat(String(vars["MappedChaseFieldCount"]))) {
    vars["ChaseName"] = await page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    if (String(vars["EnumValues"]).includes(String(vars["ChaseName"]))) {
      vars["ChaseEnumValue"] = String(vars["ChaseName"]) + "," + String(vars["ChaseEnumValue"]);
      vars["CorrespondentBidName"] = await page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]/../../..//div[@class=\"flex-grow-1\"]").textContent() || '';
      vars["CorrespondentBidNames"] = String(vars["CorrespondentBidName"]) + "," + String(vars["CorrespondentBidNames"]);
      await page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]/../../..//input[@type=\"checkbox\"]").check();
      await expect(page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]/../../..//input[@type=\"checkbox\"]")).toBeVisible();
      // [DISABLED] Verify that the element Bid Sample Name Field [Enumeration Mapping] displays text CorrespondentBidName and With Scrollable FALSE
      // await expect(page.locator("(//div[@class=\"my-2\" and text()=\"$|ChaseName|\"]/../..//div)[3]")).toContainText(vars["CorrespondentBidName"]);
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}

/**
 * Step Group: Verification Of Checked Enum Fields In Enumeration
 * ID: 1062
 * Steps: 8
 */
export async function stepGroup_Verification_Of_Checked_Enum_Fields_In_Enumeration(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const enumerationMappingPage = new EnumerationMappingPage(page);
  vars["ChaseEnumNamesCount"] = String(await enumerationMappingPage.Chase_Enum_Names.count());
  vars["count1"] = "1";
  while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["ChaseEnumNamesCount"]))) {
    // [DISABLED] Store the value displayed in the text box Individual Chase Enum Name field into a variable ChaseName
    // vars["ChaseName"] = await page.locator("(//div[@class=\"my-2\"])[$|count1|]").inputValue() || '';
    vars["IndividualBidSampleName"] = await page.locator("(//div[@class=\"my-2\"])[$|count1|]/ancestor::div[contains(@class,\"mapping-card\")]//div[@class=\"col-2\"]//div[not(contains(@class,\"my-2\"))]").textContent() || '';
    expect(String(vars["CorrespondentBidNames"])).toBe(vars["IndividualBidSampleName"]);
    await expect(page.locator("(//div[@class=\"my-2\"])[$|count1|]/ancestor::div[contains(@class,\"mapping-card\")]//input[@type=\"checkbox\"]")).toBeVisible();
    vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
  }
}

/**
 * Step Group: Unchecking All Enum Fields In Header Mapping Screen
 * ID: 1063
 * Steps: 14
 */
export async function stepGroup_Unchecking_All_Enum_Fields_In_Header_Mapping_Screen(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const headerMappingPage = new HeaderMappingPage(page);
  vars["MappedChaseFieldCount"] = String(await headerMappingPage.MappedChaseFieldName.count());
  vars["count"] = "1";
  vars["ChaseEnumValue"] = "sample";
  vars["CorrespondentBidNames"] = "sample";
  while (parseFloat(String(vars["count"])) < parseFloat(String(vars["MappedChaseFieldCount"]))) {
    vars["ChaseName"] = await page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    if (String(vars["EnumValues"]).includes(String(vars["ChaseName"]))) {
      vars["ChaseEnumValue"] = String(vars["ChaseName"]) + "," + String(vars["ChaseEnumValue"]);
      vars["CorrespondentBidName"] = await page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]/../../..//div[@class=\"flex-grow-1\"]").textContent() || '';
      vars["CorrespondentBidNames"] = String(vars["CorrespondentBidName"]) + "," + String(vars["CorrespondentBidNames"]);
      await page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]/../../..//input[@type=\"checkbox\"]").uncheck();
      await expect(page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]/../../..//input[@type=\"checkbox\"]")).toBeVisible();
      // [DISABLED] Verify that the element Bid Sample Name Field [Enumeration Mapping] displays text CorrespondentBidName and With Scrollable FALSE
      // await expect(page.locator("(//div[@class=\"my-2\" and text()=\"$|ChaseName|\"]/../..//div)[3]")).toContainText(vars["CorrespondentBidName"]);
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}

/**
 * Step Group: Verification Of Unchecked Enum Fields In Enumeration
 * ID: 1064
 * Steps: 8
 */
export async function stepGroup_Verification_Of_Unchecked_Enum_Fields_In_Enumeration(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const enumerationMappingPage = new EnumerationMappingPage(page);
  vars["ChaseEnumNamesCount"] = String(await enumerationMappingPage.Chase_Enum_Names.count());
  vars["count1"] = "1";
  while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["ChaseEnumNamesCount"]))) {
    // [DISABLED] Store the value displayed in the text box Individual Chase Enum Name field into a variable ChaseName
    // vars["ChaseName"] = await page.locator("(//div[@class=\"my-2\"])[$|count1|]").inputValue() || '';
    vars["IndividualBidSampleName"] = await page.locator("(//div[@class=\"my-2\"])[$|count1|]/ancestor::div[contains(@class,\"mapping-card\")]//div[@class=\"col-2\"]//div[not(contains(@class,\"my-2\"))]").textContent() || '';
    expect(String(vars["CorrespondentBidNames"])).toBe(vars["IndividualBidSampleName"]);
    await expect(page.locator("(//div[@class=\"my-2\"])[$|count1|]/ancestor::div[contains(@class,\"mapping-card\")]//input[@type=\"checkbox\"]")).toBeVisible();
    vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
  }
}

/**
 * Step Group: Fetching Bid Sample Names and Corresponding Chase Values and Storing them In TDP
 * ID: 1072
 * Steps: 12
 */
export async function stepGroup_Fetching_Bid_Sample_Names_and_Corresponding_Chase_Values_and(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const headerMappingPage = new HeaderMappingPage(page);
  vars["BidEnumValueCount"] = String(await headerMappingPage.BidMapFieldSet.count());
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["BidEnumValueCount"]))) {
    vars["BidSampleName"] = await page.locator("(//fieldset//div[@class=\"flex-grow-1\"])[$|count|]").textContent() || '';
    for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
      // Write to test data profile: "Bid Sample Field Name" = vars["BidSampleName"]
      // TODO: Test data profile writes need custom implementation
      vars["ChaseValue"] = await page.locator("//div[@class=\"flex-grow-1\" and text()=\"$|BidSampleName|\"]/..//select").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    }
    for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
      // Write to test data profile: "Correspondent Chase Field Name" = vars["ChaseValue"]
      // TODO: Test data profile writes need custom implementation
    }
    await page.locator("(//fieldset//input[@type=\"checkbox\"])[1]").check();
    await page.locator("(//fieldset//input[@type=\"checkbox\"])[1]").uncheck();
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}

/**
 * Step Group: Verification Of BidSampleNames In Header Mapping From TDP
 * ID: 1073
 * Steps: 9
 */
export async function stepGroup_Verification_Of_BidSampleNames_In_Header_Mapping_From_TDP(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const headerMappingPage = new HeaderMappingPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  vars["BidEnumValueCount"] = String(await headerMappingPage.BidMapFieldSet.count());
  vars["count"] = "1";
  for (let dataIdx = 1; dataIdx <= parseInt(vars["BidEnumValueCount"]); dataIdx++) {
    await expect(page.locator("(//fieldset//div[@class=\"flex-grow-1\"])[$|count|]")).toContainText(testData["Bid Sample Field Name"]);
    vars["ChaseValue"] = await page.locator("//div[@class=\"flex-grow-1\" and text()=\"@|Bid Sample Field Name|\"]/..//select").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    expect(String(vars["ChaseValue"])).toBe(testData["Correspondent Chase Field Name"]);
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    await page.locator("(//fieldset//input[@type=\"checkbox\"])[1]").check();
    await page.locator("(//fieldset//input[@type=\"checkbox\"])[1]").uncheck();
  }
}

/**
 * Step Group: Verification of Column Headers Count and Column Names From UI to Excel 
 * ID: 1083
 * Steps: 20
 */
export async function stepGroup_Verification_of_Column_Headers_Count_and_Column_Names_From_U(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  vars["CountOfColumnsUI"] = String(await page.locator("//th[position() > 1 and position() < last()]").count());
  vars["CountOfColumnsExcel"] = String(excelHelper.getColumnCount(vars["File"], "0"));
  expect(String(vars["CountOfColumnsUI"])).toBe(vars["CountOfColumnsExcel"]);
  vars["count1"] = "0";
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountOfColumnsUI"]))) {
    vars["ColumnNameUI"] = await page.locator("//th[position() >1 and position() < last()][$|count|]").textContent() || '';
    vars["ColumnNameUI"] = String(vars["ColumnNameUI"]).trim();
    vars["ColumnNameExcel"] = excelHelper.readCell(vars['_lastDownloadPath'] || '', "0", vars["count1"], "0");
    vars["ColumnNameExcel"] = String(vars["ColumnNameExcel"]).trim();
    if (String(vars["count"]) === String("6")) {
      expect(String(vars["ColumnNameExcel"])).toBe(testData["Execution Type Header"]);
    } else if (String(vars["count"]) === String("1")) {
      expect(String(vars["ColumnNameExcel"])).toBe(testData["CCode Header"]);
    } else if (String(vars["count"]) === String("2")) {
      expect(String(vars["ColumnNameExcel"])).toBe(testData["Bid Request ID Header"]);
    } else {
      expect(String(vars["ColumnNameUI"])).toBe(vars["ColumnNameExcel"]);
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
    vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
  }
}

/**
 * Step Group: Creating New Header In Header Mapping Screen
 * ID: 1095
 * Steps: 12
 */
export async function stepGroup_Creating_New_Header_In_Header_Mapping_Screen(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
  await page.locator("//button[text()[normalize-space() = \"Add New Header\"]]").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Add Header\"]]")).toBeVisible();
  await page.locator("//div[text()='Custom Header']//..//..//input[contains(@class, 'form-control')]").fill(testData["Custom Header"]);
  vars["customheadername"] = await page.locator("//div[text()='Custom Header']//..//..//input[contains(@class, 'form-control')]").inputValue() || '';
  await expect(page.locator("//div[text()='Custom Header']//..//..//input[contains(@class, 'form-control')]")).toHaveValue(vars["customheadername"]);
  await page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/following-sibling::div[contains(@class, 'd-flex')]//select[contains(@class, 'form-select')]").click();
  await page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/following-sibling::div[contains(@class, 'd-flex')]//select[contains(@class, 'form-select')]").selectOption({ label: testData["Chase_Field_Name"] });
  vars["clmfieldname"] = await page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/following-sibling::div[contains(@class, 'd-flex')]//select[contains(@class, 'form-select')]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  await page.locator("//span[text()[normalize-space() = \"Insert Header\"]]").click();
  await expect(page.locator("//div[contains(@class, 'header-grid-layout') and contains(@class, 'custom-header')]")).toBeVisible();
  await expect(page.locator("//span[text()='Enumeration Mapping']")).toBeVisible();
}

/**
 * Step Group: Editing In Enumeration Mapping Screen
 * ID: 1096
 * Steps: 3
 */
export async function stepGroup_Editing_In_Enumeration_Mapping_Screen(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("((//div[@class=\"field-block mb-2\"])/../../../..//select)[4]").selectOption({ index: parseInt("1") });
  vars["EditedChaseValue"] = await page.locator("((//div[@class=\"field-block mb-2\"])/../../../..//select)[4]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  vars["EditedChaseFieldName"] = await page.locator("((//div[@class=\"field-block mb-2\"])/../../../..//div[@class=\"my-2\"])[2]").textContent() || '';
}

/**
 * Step Group: Save Draft exit and Navigating To Rules And Actions
 * ID: 1097
 * Steps: 14
 */
export async function stepGroup_Save_Draft_exit_and_Navigating_To_Rules_And_Actions(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("//span[text()[normalize-space() = \"Save Draft & Exit\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//td[@data-title=\"Map Name\"]//button[text()=\" $|Create New Map| \"]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText(vars["Create New Map"])).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Map Headers\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//span[text()='Enumeration Mapping']").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Save and Move to Next Page\"]]")).toBeVisible();
  await page.locator("(//button[@type=\"button\"])[last()]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//span[text()[normalize-space() = \"Rules and Actions\"]]").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Save and Move to Next Page\"]]")).toBeVisible();
  await page.locator("(//button[@type=\"button\"])[last()]").click();
}

/**
 * Step Group: Fetching Enum from Header Mapping and verifying them at Enumeration Mapping 
 * ID: 1099
 * Steps: 18
 */
export async function stepGroup_Fetching_Enum_from_Header_Mapping_and_verifying_them_at_Enum(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const headerMappingPage = new HeaderMappingPage(page);
  const advanceSearch2Page = new AdvanceSearch2Page(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  const testDataSets: Record<string, string>[] = []; // TODO: Load test data sets
  vars["EnumValues"] = "Loan Purpose";
  // Loop over test data sets in "Enum Type Values." from set2 to set18
for (const testDataSet of testDataSets) {
    vars["EnumValues"] = String(testData["Enum Type"]) + "," + String(vars["EnumValues"]);
  }
  vars["MappedChaseFieldCount"] = String(await headerMappingPage.MappedChaseFieldName.count());
  vars["count"] = "1";
  vars["ChaseEnumValue"] = "sample";
  while (parseFloat(String(vars["count"])) < parseFloat(String(vars["MappedChaseFieldCount"]))) {
    vars["ChaseName"] = await page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    if (String(vars["EnumValues"]).includes(String(vars["ChaseName"]))) {
      vars["ChaseEnumValue"] = String(vars["ChaseName"]) + "," + String(vars["ChaseEnumValue"]);
      vars["CorrespondentBidName"] = await page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]/../../..//div[@class=\"flex-grow-1\"]").textContent() || '';
      await page.locator("//span[text()='Enumeration Mapping']").click();
      await advanceSearch2Page.Yes_Proceed_Button.click();
      await page.locator("//span[text()[normalize-space() = \"Rules and Actions\"]]").waitFor({ state: 'visible' });
      await expect(page.locator("(//div[@class=\"my-2\" and text()=\"$|ChaseName|\"]/../..//div)[3]")).toContainText(vars["CorrespondentBidName"]);
      await page.locator("//a[contains(text(),\"Header Mapping\")]").click();
      await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}

/**
 * Step Group: Adding Rules In Rules and Actions Screen
 * ID: 1104
 * Steps: 22
 */
export async function stepGroup_Adding_Rules_In_Rules_and_Actions_Screen(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const actionruleheaderPage = new ActionruleheaderPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//button[text()[normalize-space() = \"Add Rule\"]]").click();
  await actionruleheaderPage.Rule_Name_Field.fill(testData["Rule Name"]);
  vars["Rule Name"] = await actionruleheaderPage.Rule_Name_Field.inputValue() || '';
  await expect(actionruleheaderPage.Rule_Name_Field).toHaveValue(vars["Rule Name"]);
  await page.locator("//div[text()[normalize-space() = \"Select Category\"]]").click();
  vars["CategoryName"] = await page.locator("(//div[@class=\"cursor-pointer py-3 text-wrap\"])[2]").textContent() || '';
  await page.locator("(//input[@type=\"checkbox\"])[2]").check();
  await page.locator("//button[contains(normalize-space(),\"Apply Selected 1\")]").click();
  await page.locator("//label[text()[normalize-space() = \"When Bid Field\"]]/following-sibling::div[contains(@class, 'd-flex')]//div[text()[normalize-space() = \"Select\"]]").click();
  await page.locator("(//input[@type=\"search\"])[1]").fill(testData["Condition Bid Field"]);
  vars["BidField"] = await page.locator("(//input[@type=\"search\"])[1]").inputValue() || '';
  await page.locator("//a[text()=\"Select\"]").click();
  expect(String(vars["BidField"])).toBe(testData["Condition Bid Field"]);
  await page.locator("//select[contains(normalize-space(),\"Select = != > < >= <= contains\")]").selectOption({ label: testData["Operation1"] });
  await page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[3]").click();
  await page.locator("(//label[text()[normalize-space() = \"Bid Enumerated Tape Value\"]]/following-sibling::div[contains(@class, 'd-flex')]//div[@aria-labelledby=\"singleSelectDropDown\"]//input[@type=\"search\"])[1]").click();
  await page.locator("(//input[@type=\"search\"])[2]").fill(testData["BidEnumeratedTapeValue"]);
  await expect(page.locator("(//label[text()[normalize-space() = \"Bid Enumerated Tape Value\"]]/following-sibling::div[contains(@class, 'd-flex')]//div[@aria-labelledby=\"singleSelectDropDown\"]//input[@type=\"search\"])[1]")).toHaveValue(testData["BidEnumeratedTapeValue"]);
  await page.locator("//a[text()=\"Select\"]").click();
  vars["RuleBidField"] = vars["BidField"];
  vars["RuleCondition"] = await page.locator("//select[contains(normalize-space(),\"Select = != > < >= <= contains\")]").inputValue() || '';
  vars["RuleBidTapeValue"] = testData["BidEnumeratedTapeValue"];
}

/**
 * Step Group: Reading Column Data from XLS
 * ID: 1105
 * Steps: 11
 */
export async function stepGroup_Reading_Column_Data_from_XLS(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const headerMappingPage = new HeaderMappingPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const newPage = await page.context().newPage();
  await page.goto("https://imgtool.net/en/filerename/#google_vignette");
  await headerMappingPage.File_Input.setInputFiles(path.resolve(__dirname, 'test-data', "Bid Field Value.xlsx"));
  await page.waitForLoadState('networkidle');
  // [DISABLED] Wait until the element Rename Field is enabled
  // await correspondentPortalPage.Username_Field.waitFor({ state: 'visible' });
  await page.locator("(//button[@class=\"el-button el-button--primary\"])[2]").click();
  // Wait for download - handled by Playwright download events
  await page.waitForTimeout(2000);
  vars[""] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';
  // [DISABLED] Excel: Read the entire Row of the latest Excel file (.xlsx) using the Row 0 and store it in a variable named Total Headers From Xls
  // vars["Total Headers From Xls"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "0", "0");
  vars["Total exl"] = excelHelper.readColumn(vars['_lastDownloadPath'] || '', "1", "0");
  // TODO: Manual conversion needed - unknown template 88
  // Action: Switch to the window by index 0
}

/**
 * Step Group: Fetching Income Value From XLS.
 * ID: 1106
 * Steps: 24
 */
export async function stepGroup_Fetching_Income_Value_From_XLS(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["DuplicateIncome"] = "1";
  vars["index"] = "2";
  vars["index1"] = "3";
  while (parseFloat(String(vars["index"])) <= parseFloat(String("4"))) {
    vars["income"] = String("Income (Monthly),2001.0,2001.0,2001.0,2001.0,2001.0").split(",")[parseInt(String(vars["index"]))] || '';
    vars["income2"] = String("Income (Monthly),2001.0,2001.0,2001.0,2001.0,2001.0").split(",")[parseInt(String(vars["index1"]))] || '';
    for (let dataIdx = parseInt(vars["index"]); dataIdx <= parseInt(vars["index"]); dataIdx++) {
      if (String(vars["income"]) !== String(vars["income2"])) {
        vars["income"] = String(vars["income"]).substring(0, String(vars["income"]).length - 2);
        vars["income2"] = String(vars["income2"]).substring(0, String(vars["income2"]).length - 2);
        // Write to test data profile: "Income Value" = vars["income"]
        // TODO: Test data profile writes need custom implementation
        vars["DuplicateIncome"] = (parseFloat(String(vars["DuplicateIncome"])) + parseFloat(String("1"))).toFixed(0);
        vars["index"] = (parseFloat(String(vars["index"])) + parseFloat(String("1"))).toFixed(0);
        vars["index1"] = (parseFloat(String(vars["index1"])) + parseFloat(String("1"))).toFixed(0);
        await page.locator("//h1[text()=\" Rules and Actions / \"]").click();
      } else {
        vars["income"] = String(vars["income"]).substring(0, String(vars["income"]).length - 2);
        vars["income2"] = String(vars["income2"]).substring(0, String(vars["income2"]).length - 2);
        // Write to test data profile: "same Income" = vars["income"]
        // TODO: Test data profile writes need custom implementation
        vars["DuplicateIncome"] = (parseFloat(String(vars["DuplicateIncome"])) + parseFloat(String("1"))).toFixed(0);
        vars["index"] = (parseFloat(String(vars["index"])) + parseFloat(String("1"))).toFixed(0);
        vars["index1"] = (parseFloat(String(vars["index1"])) + parseFloat(String("1"))).toFixed(0);
        await page.locator("//h1[text()=\" Rules and Actions / \"]").click();
  // [DISABLED] Verify if DuplicateIncome == 1
  // expect(String(vars["DuplicateIncome"])).toBe("1");
      }
    }
  }
}

/**
 * Step Group: Save Draft Exit Action and Navigate from new map to enumeration
 * ID: 1107
 * Steps: 11
 */
export async function stepGroup_Save_Draft_Exit_Action_and_Navigate_from_new_map_to_enumerat(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("//span[text()[normalize-space() = \"Save Draft & Exit\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//td[@data-title=\"Map Name\"]//button[text()=\" $|Create New Map| \"]").waitFor({ state: 'visible' });
  await page.locator("//td[@data-title=\"Map Name\"]//button[text()=\" $|Create New Map| \"]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//span[text()[normalize-space() = \"Map Headers\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//span[text()='Enumeration Mapping']").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("(//button[@type=\"button\"])[last()]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: Editing In New Map (After Save draft)
 * ID: 1113
 * Steps: 5
 */
export async function stepGroup_Editing_In_New_Map_After_Save_draft(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("//input[contains(@id,\"mappingName\")]").fill(Array.from({length: 4}, () => "abcd".charAt(Math.floor(Math.random() * 4))).join(''));
  vars["EditedMapName"] = await page.locator("//input[contains(@id,\"mappingName\")]").inputValue() || '';
  await page.locator("//div[contains(@class, 'container') and contains(@class, 'd-flex')]/div[2]/button[2]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//input[contains(@id,\"mappingName\")]")).toHaveValue(vars["EditedMapName"]);
}

/**
 * Step Group: Creating New Bid Mapping For search action based on the rules and actions.
 * ID: 1115
 * Steps: 6
 */
export async function stepGroup_Creating_New_Bid_Mapping_For_search_action_based_on_the_rule(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const advanceSearch2Page = new AdvanceSearch2Page(page);
  await stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
  await page.locator("//span[text()='Enumeration Mapping']").click();
  await advanceSearch2Page.Yes_Proceed_Button.click();
  await page.locator("//span[text()[normalize-space() = \"Rules and Actions\"]]").waitFor({ state: 'visible' });
  await page.locator("//span[text()[normalize-space() = \"Rules and Actions\"]]").click();
  await advanceSearch2Page.Yes_Proceed_Button.click();
}

/**
 * Step Group: Verification Of Duplicated Rule Values
 * ID: 1117
 * Steps: 10
 */
export async function stepGroup_Verification_Of_Duplicated_Rule_Values(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await expect(page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[2]")).toHaveValue(vars["Rule Name"]);
  await page.locator("(//button[@id=\"multiSelectDropDown\"])[2]").click();
  await expect(page.locator("//input[contains(@aria-label,\"$|CategoryName|\")]")).toBeVisible();
  await page.locator("//button[contains(normalize-space(),\"Apply Selected 1\")]").scrollIntoViewIfNeeded();
  await page.locator("//button[contains(normalize-space(),\"Apply Selected 1\")]").click();
  await expect(page.locator("(//label[text()=\" When Bid Field \"]/..//button//div[contains(@class,\"text-truncate\")])[2]")).toContainText(vars["RuleBidField"]);
  await expect(page.locator("(//select[contains(normalize-space(),\"Select = != > < >= <= contains\")])[2]")).toHaveValue(vars["RuleCondition"]);
  await expect(page.locator("(//div[@class=\"rules-conditions\"]//button//div[contains(@class,\"flex-grow-1\")])[4]")).toContainText(vars["RuleBidTapeValue"]);
  await expect(page.locator("(//label[normalize-space(text())='Chase Field Name']//..//select[@class=\"form-select\"])[2]")).toHaveValue(vars["ActionChaseFieldName"]);
  await expect(page.locator("(//label[normalize-space(text())='Chase Value']//..//select[@class=\"form-select\"])[2]")).toHaveValue(vars["ActionChaseValue"]);
}

/**
 * Step Group: Fetching the data based on Enum value in Header Mapping and fetching both Chase Value and Bid Sample Field Name
 * ID: 1122
 * Steps: 26
 */
export async function stepGroup_Fetching_the_data_based_on_Enum_value_in_Header_Mapping_and_(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const headerMappingPage = new HeaderMappingPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const advanceSearch2Page = new AdvanceSearch2Page(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  const testDataSets: Record<string, string>[] = []; // TODO: Load test data sets
  vars["EnumValues"] = "Loan Purpose";
  // Loop over test data sets in "Enum_Type_Values_For_Happy_Flow" from set2 to set18
for (const testDataSet of testDataSets) {
    vars["EnumValues"] = String(testData["Parameter 1"]) + "," + String(vars["EnumValues"]);
  }
  vars["MappedChaseFieldCount"] = String(await headerMappingPage.MappedChaseFieldName.count());
  vars["count"] = "1";
  vars["count1"] = "1";
  vars["ChaseEnumValue"] = "sample";
  while (parseFloat(String(vars["count"])) < parseFloat(String(vars["MappedChaseFieldCount"]))) {
    await correspondentPortalPage.Rules_and_Actions_Step_4_of_4.click();
    vars["ChaseName"] = await page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    if (String(vars["EnumValues"]).includes(String(vars["ChaseName"]))) {
      vars["ChaseEnumValue"] = String(vars["ChaseName"]) + "," + String(vars["ChaseEnumValue"]);
      // [DISABLED] Split the ChaseEnumValue with the , and store the value from the 1 in the ChaseEnumValue
      // vars["ChaseEnumValue"] = String(vars["ChaseEnumValue"]).split(",")["1"] || '';
      vars["CorrespondentBidName"] = await page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]/../../..//div[@class=\"flex-grow-1\"]").textContent() || '';
      for (let dataIdx = parseInt(vars["count1"]); dataIdx <= parseInt(vars["count1"]); dataIdx++) {
        // Write to test data profile: "Bid Sample Field" = vars["CorrespondentBidName"]
        // TODO: Test data profile writes need custom implementation
      }
      for (let dataIdx = parseInt(vars["count1"]); dataIdx <= parseInt(vars["count1"]); dataIdx++) {
        // Write to test data profile: "Chase value name" = vars["ChaseName"]
        // TODO: Test data profile writes need custom implementation
      }
      vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
      // [DISABLED] Click on Enumeration Mapping Button
      // await page.locator("//span[text()='Enumeration Mapping']").click();
      // [DISABLED] Click on Yes Proceed Button
      // await advanceSearch2Page.Yes_Proceed_Button.click();
      // [DISABLED] Wait until the element Rules and Actions Button is visible
      // await page.locator("//span[text()[normalize-space() = \"Rules and Actions\"]]").waitFor({ state: 'visible' });
      // [DISABLED] Verify that the element Bid Sample Name Field [Enumeration Mapping] displays text CorrespondentBidName and With Scrollable FALSE
      // await expect(page.locator("(//div[@class=\"my-2\" and text()=\"$|ChaseName|\"]/../..//div)[3]")).toContainText(vars["CorrespondentBidName"]);
      // [DISABLED] Click on Header Mapping1
      // await page.locator("//a[contains(text(),\"Header Mapping\")]").click();
      // [DISABLED] Wait until the element Spinner is not visible
      // await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
    }
  }
  vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
}

/**
 * Step Group: Add Actions in Rules and Actions[Duplicated Rule]
 * ID: 1125
 * Steps: 4
 */
export async function stepGroup_Add_Actions_in_Rules_and_ActionsDuplicated_Rule(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("(//label[normalize-space(text())='Chase Field Name']//..//select[@class=\"form-select\"])[2]").selectOption({ index: parseInt("17") });
  await page.locator("(//label[normalize-space(text())='Chase Value']//..//select[@class=\"form-select\"])[2]").selectOption({ index: parseInt("1") });
  vars["ActionChaseFieldName"] = await page.locator("(//label[normalize-space(text())='Chase Field Name']//..//select[@class=\"form-select\"])[2]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  vars["ActionChaseValue"] = await page.locator("(//label[normalize-space(text())='Chase Value']//..//select[@class=\"form-select\"])[2]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
}

/**
 * Step Group: Adding Rules In Rules and Actions Screen [Duplicated Rule].
 * ID: 1126
 * Steps: 21
 */
export async function stepGroup_Adding_Rules_In_Rules_and_Actions_Screen_Duplicated_Rule(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[2]").clear();
  await page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[2]").fill(testData["Duplicated Rule Name"]);
  await expect(page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[2]")).not.toHaveValue('');
  await page.locator("(//button[@id=\"multiSelectDropDown\"])[2]").click();
  vars["CategoryName"] = await page.locator("(//div[@class=\"cursor-pointer py-3 text-wrap\"])[2]").textContent() || '';
  await page.locator("(//input[@type=\"checkbox\"])[2]").check();
  await page.locator("//button[contains(normalize-space(),\"Apply Selected 1\")]").click();
  await page.locator("(//label[text()=\" When Bid Field \"]/..//button//div[contains(@class,\"text-truncate\")])[2]").click();
  await page.locator("(//label[text()=\" When Bid Field \"]/..//input[@type=\"search\"])[2]").fill(testData["BidFields"]);
  // [DISABLED] Store the value displayed in the text box Search_Field field into a variable BidField
  // vars["BidField"] = await page.locator("(//input[@type=\"search\"])[1]").inputValue() || '';
  await page.locator("(//label[text()=\" When Bid Field \"]/..//a[text()=\"Select\"])").click();
  // [DISABLED] Verify if BidField == Condition Bid Field
  // expect(String(vars["BidField"])).toBe(testData["Condition Bid Field"]);
  await page.locator("(//select[contains(normalize-space(),\"Select = != > < >= <= contains\")])[2]").selectOption({ label: testData["Operation2"] });
  await page.locator("((//label[text()=\" Bid Enumerated Tape Value \"]/..//button)//div)[4]").click();
  await page.locator("(//label[text()=\" Bid Enumerated Tape Value \"]/..//input[@type=\"search\"])[2]").fill(testData["Bid Enumerated Tape Value"]);
  await expect(page.locator("(//label[text()=\" Bid Enumerated Tape Value \"]/..//input[@type=\"search\"])[2]")).toHaveValue(testData["Bid Enumerated Tape Value"]);
  await page.locator("(//label[text()=\" Bid Enumerated Tape Value \"]/..//a[text()=\"Select\"])").click();
  await expect(page.locator("((//label[text()=\" Bid Enumerated Tape Value \"]/..//button)//div)[4]")).toContainText(testData["Bid Enumerated Tape Value"]);
  vars["RuleBidField"] = vars["BidField"];
  vars["RuleCondition"] = await page.locator("(//select[contains(normalize-space(),\"Select = != > < >= <= contains\")])[2]").inputValue() || '';
  vars["RuleBidTapeValue"] = testData["Bid Enumerated Tape Value"];
}

/**
 * Step Group: Creating New Bid Map
 * ID: 1135
 * Steps: 24
 */
export async function stepGroup_Creating_New_Bid_Map(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const mapNameFieldInBidMapsPage = new MapNameFieldInBidMapsPage(page);
  const correspondentPortal8Page = new CorrespondentPortal8Page(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
  await page.waitForLoadState('networkidle');
  // [DISABLED] Navigation to Customer Permission
  // await stepGroup_Navigation_to_Customer_Permission(page, vars);
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"Bid Maps\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//button[text()[normalize-space() = \"Add New Mapping\"]]").click();
  vars["Common KeyWord"] = "Testsigma_" + vars["RandomName"];
  vars["LastName"] = ['Smith','Johnson','Williams','Brown','Jones','Davis','Miller','Wilson'][Math.floor(Math.random() * 8)];
  vars["BidMap Name"] = "Testsigma_" + vars["RandomName"] + "_" + vars["LastName"] + "_" + "SeachField";
  await mapNameFieldInBidMapsPage.Map_Name_Field_in_Bid_Maps.fill(vars["BidMap Name"]);
  await expect(correspondentPortal8Page.Compare_Button).toBeVisible();
  await correspondentPortal8Page.Compare_Button.click();
  for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
    // Write to test data profile: "Search Functionality BidMaps" = vars["BidMap Name"]
    // TODO: Test data profile writes need custom implementation
  }
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  // [DISABLED] Verify that the element Bid Maps Name displays text contains TS_SEARCH and With Scrollable FALSE
  // await expect(page.locator("//span[contains(.,' $|Create New Map|')]")).toContainText("TS_SEARCH");
  // [DISABLED] Click on Select Company/s Dropdown
  // await correspondentPortalPage.Select_Companys_Dropdown.click();
  // [DISABLED] Click on Required Company/s Name Value
  // await page.locator("//span[@class='pl-2'][contains(.,'$|Companyname|')]").click();
  // [DISABLED] Click on Apply Selected
  // await page.locator("//button[contains(text(),\" Apply Selected \")]").click();
  // [DISABLED] Upload file DeepikaAugBidQA.xlsx,DeepikaAugBidQA.xlsx using the element Upload File
  // await page.locator("(//input[@type=\"file\"])[1]").setInputFiles(path.resolve(__dirname, 'test-data', "DeepikaAugBidQA.xlsx"));
  // [DISABLED] Click on Map Headers Button
  // await page.locator("//span[text()[normalize-space() = \"Map Headers\"]]").click();
  // [DISABLED] Verify that the element This action will save the changes and Move to Next Page is displayed and With Scrollable FALSE
  // await expect(page.locator("//*[contains(text(),\"This action will save the changes and Move to Next Page\")]")).toBeVisible();
  // [DISABLED] Click on Proceed with Saving Button
  // await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
  // [DISABLED] Wait until the element Spinner is not visible
  // await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: Verifying Changes After SaveDraft Action In Enumeration Mapping Screen
 * ID: 1140
 * Steps: 6
 */
export async function stepGroup_Verifying_Changes_After_SaveDraft_Action_In_Enumeration_Mapp(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  vars["NewFieldChaseValueAfterSaveDraftExit"] = await page.locator("((//input[@type=\"text\" and contains(@class, 'input-field-edit')])/ancestor::div[@class=\"mapping-card rounded-3 unchecked\"]//select)[last()]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  expect(String(vars["NewFieldChaseValue"])).toBe(vars["NewFieldChaseValueAfterSaveDraftExit"]);
  await expect(page.locator("(//button[text()=\" Add Field \"]/../div[text()=\"$|EditedChaseFieldName|\"]/../..//select)[1]")).toHaveValue(vars["EditedChaseValue"]);
  await expect(page.locator("(//div[@class=\"field-block mb-2\"])//div[text()=\" $|BidTapeValueforBeforeDeleted| \"]")).toBeVisible();
  await expect(page.locator("(//div[@class=\"col-2\"]//div[text()=\"$|FirstBidSampleName|\"])[1]/../..//input[@type=\"checkbox\"]")).toBeVisible();
}

/**
 * Step Group: Duplicating Rule In Enumeration Mapping
 * ID: 1141
 * Steps: 8
 */
export async function stepGroup_Duplicating_Rule_In_Enumeration_Mapping(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("(//span[text()[normalize-space() = \"Duplicate/Copy\"]])[1]").click();
  await expect(page.locator("(//div[@class=\"block\"])[2]")).toBeVisible();
  await page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[2]").clear();
  await page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[2]").fill(testData["Duplicated Rule Name"]);
  vars["Rule Name Input Field_Duplicated"] = await page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[2]").inputValue() || '';
  expect(String(vars["Rule Name Input Field_Duplicated"])).toBe(testData["Duplicated Rule Name"]);
  // [DISABLED] Verify that the element Rule Name Input Field[Duplicated] display value Duplicated Rule Name and With Scrollable FALSE
  // await expect(page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[2]")).toHaveValue(testData["Duplicated Rule Name"]);
  // [DISABLED] Verify that the element Rule Name Input Field[Duplicated] displays text contains Duplicated Rule Name and With Scrollable TRUE
  // await expect(page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[2]")).toContainText(testData["Duplicated Rule Name"]);
}

/**
 * Step Group: Editing All Fields In a Rule
 * ID: 1142
 * Steps: 14
 */
export async function stepGroup_Editing_All_Fields_In_a_Rule(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const actionruleheaderPage = new ActionruleheaderPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await stepGroup_Editing_of_Add_Conditions_and_Add_Actions(page, vars);
  await actionruleheaderPage.Rule_Name_Field.clear();
  await actionruleheaderPage.Rule_Name_Field.fill(testData["New Rule Name"]);
  await expect(actionruleheaderPage.Rule_Name_Field).toHaveValue(testData["New Rule Name"]);
  await page.locator("//div[text()[normalize-space() = \"Select Category\"]]").click();
  vars["EditedCategory"] = await page.locator("(//div[@class=\"cursor-pointer py-3 text-wrap\"])[3]").textContent() || '';
  await page.locator("((//div[@class=\"cursor-pointer py-3 text-wrap\"])/..//input)[3]").check();
  await page.locator("//button[contains(normalize-space(),\"Apply Selected 1\")]").click();
  await page.locator("//select[contains(normalize-space(),\"Select = != > < >= <= contains\")]").selectOption({ label: testData["Operation2"] });
  await expect(page.locator("//select[contains(normalize-space(),\"Select = != > < >= <= contains\")]")).toHaveValue(testData["Operation2"]);
  await page.locator("(//div[@class=\"row rules-actions\"]//div[@class=\"col-4\"]//select)[1]").selectOption({ index: parseInt("17") });
  vars["EditedActionChaseFieldName"] = await page.locator("(//div[@class=\"row rules-actions\"]//div[@class=\"col-4\"]//select)[1]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  await page.locator("//div[@class=\"row rules-actions\"]//label[text()=\"Chase Value\"]/..//select").selectOption({ index: parseInt("1") });
  vars["EditedActionChaseValue"] = await page.locator("//label[text()=\"Chase Value\"]/..//div[@class=\"d-flex\"]//select").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
}

/**
 * Step Group: Verification of Rules and Action Values Before Editing(Active version)
 * ID: 1143
 * Steps: 6
 */
export async function stepGroup_Verification_of_Rules_and_Action_Values_Before_EditingActive(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const actionruleheaderPage = new ActionruleheaderPage(page);
  await expect(actionruleheaderPage.Rule_Name_Field).toHaveValue(vars["Rule Name"]);
  await expect(page.locator("(//div[@class=\"rules-conditions\"]//button//div[contains(@class,\"flex-grow-1\")])[1]")).toContainText(vars["RuleBidField"]);
  await expect(page.locator("//select[contains(normalize-space(),\"Select = != > < >= <= contains\")]")).toHaveValue(vars["RuleCondition"]);
  await expect(page.locator("(//div[@class=\"rules-conditions\"]//button//div[contains(@class,\"flex-grow-1\")])[2]")).toContainText(vars["RuleBidTapeValue"]);
  await expect(page.locator("(//label[normalize-space(text())='Chase Field Name']//..//select[@class=\"form-select\"])[1]")).toHaveValue(vars["ActionChaseFieldName"]);
  await expect(page.locator("(//label[normalize-space(text())='Chase Value']//..//select[@class=\"form-select\"])[1]")).toHaveValue(vars["ActionChaseValue"]);
}

/**
 * Step Group: Verifying that Changes Are Not Updated In Active Version[Rules and Actions] 
 * ID: 1144
 * Steps: 11
 */
export async function stepGroup_Verifying_that_Changes_Are_Not_Updated_In_Active_VersionRule(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  vars["ActiveVersionRuleName"] = await page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[1]").inputValue() || '';
  expect(String(vars["Rule Name"])).toBe(vars["ActiveVersionRuleName"]);
  // [DISABLED] Verify that the text Rule Name is not displayed in the element First Rule Name Field and With Scrollable FALSE
  // await expect(page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[1]")).not.toContainText(vars["Rule Name"]);
  vars["CountOfCategory"] = await page.locator("(//button[@id=\"multiSelectDropDown\"]//div)[1]").textContent() || '';
  expect(String(vars["CountOfCategory"])).toBe("1");
  await expect(page.locator("(//div[@class=\"rules-conditions\"]//button//div[contains(@class,\"flex-grow-1\")])[1]")).not.toContainText(vars["RuleBidField"]);
  await expect(page.locator("//select[contains(normalize-space(),\"Select = != > < >= <= contains\")]")).not.toContainText(testData["Operator 2 Symbol"]);
  // [DISABLED] Verify that the element Operation Dropdown display value RuleCondition and With Scrollable FALSE
  // await expect(page.locator("//select[contains(normalize-space(),\"Select = != > < >= <= contains\")]")).toHaveValue(vars["RuleCondition"]);
  await expect(page.locator("(//div[@class=\"rules-conditions\"]//button//div[contains(@class,\"flex-grow-1\")])[2]")).not.toContainText(vars["RuleBidTapeValue"]);
  await expect(page.locator("(//label[normalize-space(text())='Chase Field Name']//..//select[@class=\"form-select\"])[1]")).not.toContainText(vars["ActionChaseFieldName"]);
  await expect(page.locator("(//label[normalize-space(text())='Chase Value']//..//select[@class=\"form-select\"])[1]")).not.toContainText(vars["ActionChaseValue"]);
}

/**
 * Step Group: Deleting All Advanced Search Bid Maps
 * ID: 1145
 * Steps: 5
 */
export async function stepGroup_Deleting_All_Advanced_Search_Bid_Maps(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const advanceSearch2Page = new AdvanceSearch2Page(page);
  while (await page.locator("//tbody//td[@data-title=\"Map Name\"]//*[contains(text(),\"TS_AdvanceSearch\")]/../..//button[@aria-label=\"Delete Map\"]").isVisible()) {
    await page.locator("//tbody//td[@data-title=\"Map Name\"]//*[contains(text(),\"TS_AdvanceSearch\")]/../..//button[@aria-label=\"Delete Map\"]").click();
    await page.locator("(//button[@type=\"button\"])[last()]").click();
    await advanceSearch2Page.Yes_Proceed_Button.waitFor({ state: 'hidden' });
    await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  }
}

/**
 * Step Group: Verifying The BidMaps Count
 * ID: 1146
 * Steps: 3
 */
export async function stepGroup_Verifying_The_BidMaps_Count(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidMapPage = new BidMapPage(page);
  await expect(bidMapPage.SearchFilter_Input_Field).toBeVisible();
  vars["BidMapsCount(AllMapsList)"] = String(await page.locator("(//tbody//tr)[position() >= 1 and position() <= last()]").count());
  expect(String(vars["BidMapsCount(AdvanceSearch)"])).toBe(vars["BidMapsCount(AllMapsList)"]);
}

/**
 * Step Group: Navigating to Upload New Bid Request
 * ID: 1149
 * Steps: 5
 */
export async function stepGroup_Navigating_to_Upload_New_Bid_Request(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("//span[text()[normalize-space() = \"Bid Requests\"] and contains(@class, 'hide-text')]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText("Bid Requests")).toBeVisible();
  await page.locator("//button[text()[normalize-space() = \"Upload New Bid Request\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: Add_Actions_In_Rules and Actions
 * ID: 1173
 * Steps: 7
 */
export async function stepGroup_Add_Actions_In_Rules_and_Actions_2(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("//button[text()[normalize-space() = \"Add Action\"]]").click();
  await page.locator("(//*[text()=\"Add Actions\"]/..//select)[3]").selectOption({ index: parseInt("3") });
  vars["Chase Fieldname_Rule"] = await page.locator("(//*[text()=\"Add Actions\"]/..//select)[3]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  // [DISABLED] Trim the data Chase Fieldname_Rule and store into a runtime variable Chase Fieldname_Rule
  // vars["Chase Fieldname_Rule"] = String(vars["Chase Fieldname_Rule"]).trim();
  await expect(page.locator("(//*[text()=\"Add Actions\"]/..//select)[3]")).toContainText(vars["Chase Fieldname_Rule"]);
  await page.locator("(//*[text()=\"Add Actions\"]/..//select)[4]").selectOption({ label: "Attached" });
  await expect(page.locator("(//*[text()=\"Add Actions\"]/..//select)[4]")).toContainText("Attached");
}

/**
 * Step Group: Adding Actions In Rules and Actions Screen
 * ID: 1176
 * Steps: 9
 */
export async function stepGroup_Adding_Actions_In_Rules_and_Actions_Screen(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("(//select[@id=\"id\"])[2]").selectOption({ label: testData["Unique Chase Field Name"] });
  // [DISABLED] Select option by index 16 in the Chase Field Name list
  // await page.locator("(//select[@id=\"id\"])[2]").selectOption({ index: parseInt("16") });
  // [DISABLED] Click on Chase Value
  // await page.locator("(//select[@class=\"form-select\" and @id=\"id\"])[last()]").click();
  await page.locator("//label[text()=\"Chase Value\"]/..//div[@class=\"form-control p-0\"]").click();
  await page.locator("(//label[text()=\"Chase Value\"]/..//input[@type=\"search\"])[1]").fill(testData["Unique Chase Value"]);
  await page.locator("(//label[text()=\"Chase Value\"]/..//a[text()=\"Select\"])[1]").click();
  vars["ChaseFiledNameonAddActions"] = await page.locator("(//label[normalize-space(text())='Chase Field Name']//..//select[@class=\"form-select\"])[1]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  vars["ChasevalueOnAddActions"] = await page.locator("//label[normalize-space(text())='Chase Value']/..//*[@class=\"form-control p-0\"]").textContent() || '';
  vars["ChasevalueOnAddActions"] = String(vars["ChasevalueOnAddActions"]).trim();
}

/**
 * Step Group: Exporting Map list for Advance Search (New)
 * ID: 1177
 * Steps: 12
 */
export async function stepGroup_Exporting_Map_list_for_Advance_Search_New(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("//input[@type=\"checkbox\" and contains(@class, 'custom-control-input')]").check();
  await expect(page.locator("//input[@type=\"checkbox\" and contains(@class, 'custom-control-input')]")).toBeVisible();
  await page.locator("//button[@type=\"button\" and text()=\" Export Selected \"]").waitFor({ state: 'visible' });
  await page.waitForTimeout(5000);
  await expect(page.locator("//button[@type=\"button\" and text()=\" Export Selected \"]")).toBeEnabled();
  await page.locator("//button[@type=\"button\" and text()=\" Export Selected \"]").click();
  await page.locator("//div[text()[normalize-space() = \"Export List\"]]").waitFor({ state: 'visible' });
  await page.locator("//div[text()[normalize-space() = \"Export List\"]]").click();
  await expect(page.locator("//div[text()[normalize-space() = \"Export List\"]]")).toBeVisible();
  await page.locator("//button[@type=\"button\" and text()=\" Export Selected \"]").click();
  await expect(page.locator("//div[text()[normalize-space() = \"Export List\"]]")).toBeVisible();
  await stepGroup_New_Export_List_Advance_Search(page, vars);
}

/**
 * Step Group: Deleting BidMaps After Test Steps(Advance Search)
 * ID: 1182
 * Steps: 11
 */
export async function stepGroup_Deleting_BidMaps_After_Test_StepsAdvance_Search(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidMapPage = new BidMapPage(page);
  if (true) /* Test Case Result is Failed */ {
    if (true) /* Element Close Advance Search Pop up Button is visible */ {
      await page.locator("//h2[text()=\"Advanced Search/Filter\"]/..//button").click();
      await page.reload();
      await stepGroup_Deleting_All_Advanced_Search_Bid_Maps(page, vars);
    }
    if (true) /* Element Reset Button is visible */ {
      await page.locator("//i[contains(@class, 'fa-undo')]").click();
      await bidMapPage.SearchFilter_Input_Field.waitFor({ state: 'visible' });
      await stepGroup_Deleting_All_Advanced_Search_Bid_Maps(page, vars);
    }
    if (true) /* Element Search/Filter Input(All Map List Page) is visible */ {
      await stepGroup_Deleting_All_Advanced_Search_Bid_Maps(page, vars);
    }
  }
}

/**
 * Step Group: New Export List (Advance Search )
 * ID: 1185
 * Steps: 25
 */
export async function stepGroup_New_Export_List_Advance_Search(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["RowsCount"] = String(await page.locator("(//tbody//tr)[position() >= 1 and position() <= last()]").count());
  vars["RowCountUI"] = "1";
  vars["RowCountExcel"] = "1";
  while (parseFloat(String(vars["RowCountUI"])) <= parseFloat(String(vars["RowsCount"]))) {
    vars["index"] = "1";
    vars["ColumnCountUI"] = "2";
    while (parseFloat(String(vars["ColumnCountUI"])) <= parseFloat(String("10"))) {
      vars["RowDataExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["RowCountExcel"], "0");
      if (String(vars["index"]) === String("5")) {
        if (String(vars["RowDataExcel"]).includes(String("ACTIVE, DRAFT"))) {
          vars["ExcelValue1"] = String(vars["RowDataExcel"]).split(",")[parseInt(String(vars["index"]))] || '';
          vars["index"] = (parseFloat(String("1")) + parseFloat(String(vars["index"]))).toFixed(0);
          vars["ExcelValue2"] = String(vars["RowDataExcel"]).split(",")[parseInt(String(vars["index"]))] || '';
          vars["CellValueInExcel"] = String(vars["ExcelValue1"]) + String(vars["ExcelValue2"]);
          vars["CellValueInExcel"] = String(vars["CellValueInExcel"]).trim();
        } else {
          vars["CellValueInExcel"] = String(vars["RowDataExcel"]).split(",")[parseInt(String(vars["index"]))] || '';
        }
      } else {
        vars["CellValueInExcel"] = String(vars["RowDataExcel"]).split(",")[parseInt(String(vars["index"]))] || '';
      }
      vars["CellValueInExcel"] = String(vars["CellValueInExcel"]).trim();
      vars["CellValueInUI"] = await page.locator("(//tbody//tr[$|RowCountUI|]//td)[$|ColumnCountUI|]").textContent() || '';
      vars["CellValueInUI"] = String(vars["CellValueInUI"]).trim();
      if (String(vars["CellValueInExcel"]) === String("N/A")) {
        vars["CellValueInExcel"] = "-";
      }
      if (String(vars["CellValueInExcel"]).includes(String("ET"))) {
      }
    }
  }
}

/**
 * Step Group: Create Bid Maps(Companies verification)
 * ID: 1191
 * Steps: 11
 */
export async function stepGroup_Create_Bid_MapsCompanies_verification(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const mapNameFieldInBidMapsPage = new MapNameFieldInBidMapsPage(page);
  const correspondentPortal8Page = new CorrespondentPortal8Page(page);
  await page.waitForLoadState('networkidle');
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"Bid Maps\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//button[text()[normalize-space() = \"Add New Mapping\"]]").click();
  await expect(page.getByText("Create New Map")).toBeVisible();
  vars["Create Bid Map"] = new Date().toLocaleDateString('en-US') /* format: dd/MM/yyyy:HH:mm:ss */;
  await mapNameFieldInBidMapsPage.Map_Name_Field_in_Bid_Maps.fill("Automation_Testsigma_" + vars["Create New Map"]);
  vars["CreatedBidMap"] = await mapNameFieldInBidMapsPage.Map_Name_Field_in_Bid_Maps.inputValue() || '';
  await expect(correspondentPortal8Page.Compare_Button).toBeVisible();
  await correspondentPortal8Page.Compare_Button.click();
}

/**
 * Step Group: Getting Last Month From Current Month
 * ID: 1192
 * Steps: 7
 */
export async function stepGroup_Getting_Last_Month_From_Current_Month(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["Current Month"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata" };
    const fmt = "MM";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  if (String(vars["Current Month"]) === String("01")) {
    vars["Last Month"] = "12";
  } else {
    vars["Last Month"] = (parseFloat(String(vars["Current Month"])) - parseFloat(String("1"))).toFixed(0);
  }
  if (String("1,2,3,4,5,6,7,8,9").includes(String(vars["Last Month"]))) {
    vars["Last Month"] = String('') + String('');
  }
}

/**
 * Step Group: Verifying last month and Required status In filter
 * ID: 1197
 * Steps: 22
 */
export async function stepGroup_Verifying_last_month_and_Required_status_In_filter(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const bidRequestPage = new BidRequestPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//span[text()[normalize-space() = \"Filter\"]]").click();
  await page.waitForLoadState('networkidle');
  await page.locator("//label[text()=\"Select Date Range\"]/..//button").click();
  await page.locator("//span[text()[normalize-space() = \"Last One Month\"]]").click();
  await expect(correspondentPortalPage.Select_Date_Range_Dropdown_Value).toContainText(testData["Last One Month"]);
  await page.locator("//div[text()[normalize-space() = \"Select Bid Request Status\"]]").click();
  vars["ExpectedStatus"] = await page.locator("//span[text()=\"@|Status Name|\"]").textContent() || '';
  await page.locator("//span[text()=\"@|Status Name|\"]").click();
  await page.locator("(//button[@aria-label=\"Apply selected items\"])[2]").click();
  await page.locator("//div[contains(@class, \"justify-content-end\")]//button[text()=\"Apply Filters\"]").click();
  await stepGroup_Getting_Last_Month_From_Current_Month(page, vars);
  await page.waitForLoadState('networkidle');
  await expect(page.locator("//div[@class=\"pill rounded-pill relative\" and contains(@aria-label,\"Chip Date\")]")).toBeVisible();
  await expect(page.locator("//div[@class=\"pill rounded-pill relative\" and contains(@aria-label,\"Chip Status\")]")).toBeVisible();
  if (true) /* Element No result (Bid requests) is visible */ {
    await expect(page.getByText("No result")).toBeVisible();
  } else {
    vars["RowsCount"] = String(await page.locator("(//tbody//tr)[position() >= 1 and position() <= last()]").count());
    vars["LastMonthCount"] = String(await page.locator("//td[@data-title=\"Uploaded\"]//div[starts-with(text(),\" $|Last Month|\")]").count());
    expect(String(vars["LastMonthCount"])).toBe(vars["RowsCount"]);
    // [DISABLED] Verify that the elements with locator Bid Request Status Column Data displays text ExpectedStatus and With Scrollable FALSE
    // await expect(bidRequestPage.Bid_Request_Status_Column_Data).toContainText(vars["ExpectedStatus"]);
    for (let i = 0; i < await bidRequestPage.Bid_Request_Status_Column_Data.count(); i++) {
      await expect(bidRequestPage.Bid_Request_Status_Column_Data.nth(i)).toHaveText(String(vars["ExpectedStatus"]));
    }
  }
}

/**
 * Step Group: Delete Last Batch Time
 * ID: 1204
 * Steps: 11
 */
export async function stepGroup_Delete_Last_Batch_Time(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["LastBatchTime"] = await page.locator("(//h5[@class=\"mb-0\"])[last()]").textContent() || '';
  vars["BufferedDeletedBatchTime2"] = (() => {
    const d = new Date('2000-01-01 ' + String(vars["LastBatchTime"]));
    d.setMinutes(d.getMinutes() + parseInt(String(vars["BufferTime"])));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
  })();
  await page.reload();
  await page.locator("(//div[@class=\"card-body\"])[last()]").hover();
  await page.locator("(//button[@aria-label=\"Delete Batch Time\"])[last()]").hover();
  await expect(page.getByText("Delete Batch Time")).toBeVisible();
  await page.locator("(//button[@aria-label=\"Delete Batch Time\"])[last()]").click();
  await page.waitForLoadState('networkidle');
  await expect(page.getByText("Delete Batch")).toBeVisible();
  await page.locator("//span[normalize-space(text())=\"Delete batch\"]//parent::button").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: Separating Hours and Minutes 
 * ID: 1206
 * Steps: 5
 */
export async function stepGroup_Separating_Hours_and_Minutes(page: import('@playwright/test').Page, vars: Record<string, string>) {
  // [DISABLED] Trim white space from DeletedBatch1 and store it in a runtime DeletedBatch1
  // vars["DeletedBatch1"] = String(vars["DeletedBatch1"]).trim();
  vars["MinWithStandard"] = String(vars["DeletedBatch1"]).split(":")["2"] || '';
  vars["Time_Hour"] = String(vars["DeletedBatch1"]).substring(0, String(vars["DeletedBatch1"]).length - 5);
  vars["Time_Min"] = String(vars["MinWithStandard"]).substring(0, String(vars["MinWithStandard"]).length - 2);
  vars["Time_Unit"] = String(vars["MinWithStandard"]).substring(2);
}

/**
 * Step Group: selecting time unit (bulk batch)
 * ID: 1209
 * Steps: 3
 */
export async function stepGroup_selecting_time_unit_bulk_batch(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const actionsPage = new ActionsPage(page);
  if (String(vars["Time_Unit"]).includes(String("PM"))) {
    await actionsPage.Standard_Dropdown.selectOption({ label: "PM" });
    await expect(actionsPage.Standard_Dropdown).toHaveValue("PM");
  }
}

/**
 * Step Group: Modifying The Batch Intervals
 * ID: 1210
 * Steps: 14
 */
export async function stepGroup_Modifying_The_Batch_Intervals(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//button[text()[normalize-space() = \"Modify Batch Intervals\"]]").click();
  await expect(page.getByText("Edit Batch Timing")).toBeVisible();
  vars["Time_Hour"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "hh";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  await page.locator("//span[text()[normalize-space() = \"H\"]]/preceding-sibling::input[@placeholder=\"0\"]").fill(vars["Time_Hour"]);
  vars["Time_Min"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "hh:mm";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["Time_Minute"] = String(vars["Time_Min"]).split(":")["2"] || '';
  await page.locator("(//input[@placeholder=\"00\"])[1]").fill(vars["Time_Minute"]);
  await page.locator("//div[text()[normalize-space() = \"Time Interval\"]]/following-sibling::div[contains(@class, 'custom-input')]//input[@placeholder=\"0\"]").fill(testData["Time Interval"]);
  await correspondentPortalPage.No_Of_Batches.fill(testData["NO of Batches"]);
  await expect(page.locator("(//input[@type=\"radio\"])[1]")).toBeEnabled();
  await page.locator("//span[text()[normalize-space() = \"Modify Batch\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//div[text()[normalize-space() = \"Modified batch timings successfully\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Ok\"]]").click();
}

/**
 * Step Group: Delete early config
 * ID: 1215
 * Steps: 6
 */
export async function stepGroup_Delete_early_config(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  if (true) /* Element Early Config With Current Date is visible */ {
    await page.locator("(//td[@data-title='Date' and contains(text(), '$|NextBusinessDateList|')]/..//button[2])").hover();
    await expect(page.getByText("Delete")).toBeVisible();
    await page.locator("(//td[@data-title='Date' and contains(text(), '$|NextBusinessDateList|')]/..//button[2])").click();
    await correspondentPortalPage.Yes_Delete_ButtonEarly_config.click();
    await page.locator("//td[contains(text(),\" $|CurrentDateList|\")]").waitFor({ state: 'hidden' });
  }
}

/**
 * Step Group: Modifying Batch Intervals For next bussiness day
 * ID: 1219
 * Steps: 16
 */
export async function stepGroup_Modifying_Batch_Intervals_For_next_bussiness_day(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//button[text()[normalize-space() = \"Modify Batch Intervals\"]]").click();
  await expect(page.getByText("Edit Batch Timing")).toBeVisible();
  vars["Time_Hour"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "hh";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  await page.locator("//span[text()[normalize-space() = \"H\"]]/preceding-sibling::input[@placeholder=\"0\"]").fill(vars["Time_Hour"]);
  vars["Time_Min"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "hh:mm";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["Time_Minute"] = String(vars["Time_Min"]).split(":")["2"] || '';
  await page.locator("(//input[@placeholder=\"00\"])[1]").fill(vars["Time_Minute"]);
  await page.locator("//div[text()[normalize-space() = \"Time Interval\"]]/following-sibling::div[contains(@class, 'custom-input')]//input[@placeholder=\"0\"]").fill(testData["Time Interval"]);
  await correspondentPortalPage.No_Of_Batches.fill(testData["NO of Batches"]);
  await expect(page.locator("(//input[@type=\"radio\"])[1]")).toBeEnabled();
  await page.locator("(//input[@type=\"radio\"])[2]").check();
  await expect(page.locator("(//input[@type=\"radio\"])[2]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Modify Batch\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//div[text()[normalize-space() = \"Modified batch timings successfully\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Ok\"]]").click();
}

/**
 * Step Group: Modifying Batch Intervals For Passed Time
 * ID: 1220
 * Steps: 17
 */
export async function stepGroup_Modifying_Batch_Intervals_For_Passed_Time(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//button[text()[normalize-space() = \"Modify Batch Intervals\"]]").click();
  await expect(page.getByText("Edit Batch Timing")).toBeVisible();
  vars[""] = (() => {
    const d = new Date('2000-01-01 ' + String(''));
    d.setMinutes(d.getMinutes() - parseInt(String('')));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  })();
  await stepGroup_Separting_Hours_and_minutes_In_Time_For_passed_time(page, vars);
  // [DISABLED] Pick the current date hh by location UTC-04:00 and store into a variable Time_Hour
  // vars["Time_Hour"] = (() => {
  //   const d = new Date();
  //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-04:00" };
  //   const fmt = "hh";
  //   // Map Java date format to Intl parts
  //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
  //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
  //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  // })();
  await page.locator("//span[text()[normalize-space() = \"H\"]]/preceding-sibling::input[@placeholder=\"0\"]").fill(vars["Time_Hour"]);
  // [DISABLED] Pick the current date hh:mm by location UTC-04:00 and store into a variable Time_Min
  // vars["Time_Min"] = (() => {
  //   const d = new Date();
  //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-04:00" };
  //   const fmt = "hh:mm";
  //   // Map Java date format to Intl parts
  //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
  //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
  //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  // })();
  // [DISABLED] Split the Time_Min with the : and store the value from the 2 in the Time_Minute
  // vars["Time_Minute"] = String(vars["Time_Min"]).split(":")["2"] || '';
  await page.locator("(//input[@placeholder=\"00\"])[1]").fill(vars["Time_Min"]);
  await stepGroup_selecting_time_unit_bulk_batch(page, vars);
  await page.locator("//div[text()[normalize-space() = \"Time Interval\"]]/following-sibling::div[contains(@class, 'custom-input')]//input[@placeholder=\"0\"]").fill(testData["Time Interval"]);
  await correspondentPortalPage.No_Of_Batches.fill(testData["NO of Batches"]);
  await expect(page.locator("(//input[@type=\"radio\"])[1]")).toBeEnabled();
  await page.locator("//span[text()[normalize-space() = \"Modify Batch\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//div[text()[normalize-space() = \"Modified batch timings successfully\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Ok\"]]").click();
}

/**
 * Step Group: Separting Hours and minutes In Time (For passed time)
 * ID: 1221
 * Steps: 4
 */
export async function stepGroup_Separting_Hours_and_minutes_In_Time_For_passed_time(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["MinWithStandard"] = String(vars["PassedTime"]).split(":")["2"] || '';
  vars["Time_Hour"] = String(vars["PassedTime"]).substring(0, String(vars["PassedTime"]).length - 6);
  vars["Time_Min"] = String(vars["MinWithStandard"]).substring(0, String(vars["MinWithStandard"]).length - 3);
  vars["Time_Unit"] = String(vars["MinWithStandard"]).substring(3);
}

/**
 * Step Group: Writing past time into tdp
 * ID: 1222
 * Steps: 9
 */
export async function stepGroup_Writing_past_time_into_tdp(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const statusInactivePage = new StatusInactivePage(page);
  vars["BatchCount"] = String(await correspondentPortalPage.Batches_Count.count());
  vars["BatchNum"] = "1";
  while (parseFloat(String(vars["BatchNum"])) <= parseFloat(String(vars["BatchCount"]))) {
    for (let dataIdx = parseInt(vars["BatchNum"]); dataIdx <= parseInt(vars["BatchNum"]); dataIdx++) {
      vars["BatchTime"] = await page.locator("(//h6[@class=\"card-subtitle text-body-secondary flex-grow-1 mb-0\"]/../..//h5)[$|BatchNum|]").textContent() || '';
      vars["PricingReturnTimeBuffer"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
      vars["BufferedBatchTiming"] = (() => {
        const d = new Date('2000-01-01 ' + String(vars["BatchTime"]));
        d.setMinutes(d.getMinutes() + parseInt(String(vars["PricingReturnTimeBuffer"])));
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: HH:mm a
      })();
      // Write to test data profile: "Individual Batch Time" = vars["BufferedBatchTiming"]
      // TODO: Test data profile writes need custom implementation
      vars["BatchNum"] = (parseFloat(String("1")) + parseFloat(String(vars["BatchNum"]))).toFixed(0);
    }
  }
}

/**
 * Step Group: Past time disable verification in bidrequest dropdown 
 * ID: 1223
 * Steps: 8
 */
export async function stepGroup_Past_time_disable_verification_in_bidrequest_dropdown(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestPage = new BidRequestPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  vars["BatchNum"] = "1";
  await page.locator("//*[@id=\"pricingReturnTimeDropdown\"]//select[contains(@class,\"form-select\")]").click();
  // [DISABLED] Store the count of elements identified by locator OptionsCountInPricingDropdown(PastTime) into a variable OptionsCountInPricingDropdown
  // vars["OptionsCountInPricingDropdown"] = String(await bidRequestPage.OptionsCountInPricingDropdownPastTime.count());
  while (parseFloat(String(vars["BatchNum"])) <= parseFloat(String(vars["OptionsCountInPricingDropdown"]))) {
    for (let dataIdx = parseInt(vars["BatchNum"]); dataIdx <= parseInt(vars["BatchNum"]); dataIdx++) {
      vars["BatchTime"] = testData["Individual Batch Time"];
      await expect(page.locator("//option[contains(text(),\"$|BatchTime|\")]")).toBeVisible();
      vars["BatchNum"] = (parseFloat(String("1")) + parseFloat(String(vars["BatchNum"]))).toFixed(0);
    }
  }
}

/**
 * Step Group: Uploading Bid Request
 * ID: 1226
 * Steps: 24
 */
export async function stepGroup_Uploading_Bid_Request(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//div[text()[normalize-space() = \"Select\"]]").click();
  await page.locator("(//div[@class=\"mb-0 overflow-hidden\"])[1]/../..//input[@placeholder=\"Search\"]").fill(testData["Company Name"]);
  // [DISABLED] Verify that the element SelectCompany_Value has value Company Name for title and With Scrollable FALSE
  // await expect(page.locator("(//span[contains(@class,'pl-2')])[1]")).toHaveAttribute('title', testData["Company Name"]);
  await page.locator("(//span[contains(@class,'pl-2')])[1]").click();
  // [DISABLED] Verify that the element SelectCompany_Value displays text Company Name and With Scrollable FALSE
  // await expect(page.locator("(//span[contains(@class,'pl-2')])[1]")).toContainText(testData["Company Name"]);
  await page.waitForTimeout(2000);
  await expect(page.locator("//label[text()=\"Standard\"]/..//input[@type=\"checkbox\"]")).toBeVisible();
  await page.locator("(//select[contains(normalize-space(),\"Select 3 7 15\")])[1]").selectOption({ label: "3" });
  await page.locator("(//option[@value=\"3\"])[1]/../..//select[@aria-label=\"Dropdown selection\"]").waitFor({ state: 'visible' });
  await expect(page.locator("(//option[@value=\"3\"])[1]/../..//select[@aria-label=\"Dropdown selection\"]")).toHaveValue("3");
  await page.locator("//div[text()[normalize-space() = \"Select Mapping\"]]").click();
  await page.locator("//div[contains(@class, 'shadow') and contains(@class, 'dropdown-menu') and contains(@class, 'show')]//input[@placeholder=\"Search\"]").fill(testData["BidMappingID"]);
  await page.locator("//span[text()[normalize-space() =\"Deepika Aug1\"]]").waitFor({ state: 'visible' });
  await page.locator("//span[text()[normalize-space() =\"Deepika Aug1\"]]").click();
  await expect(page.locator("//button//div[text()=' @|BidMappingID| ']")).toContainText(testData["BidMappingID"]);
  await expect(correspondentPortalPage.Bid_Request_Date).toBeEnabled();
  await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").click();
  // [DISABLED] Scroll down to the element Enabled_PricingReturnTime into view
  // await page.locator("//option[contains(text(),\"$|BulkBatchTiming|\")]").scrollIntoViewIfNeeded();
  // [DISABLED] Verify that the element Enabled_PricingReturnTime is present and With Scrollable TRUE
  // await expect(page.locator("//option[contains(text(),\"$|BulkBatchTiming|\")]")).toBeVisible();
  // [DISABLED] Click on Enabled_PricingReturnTime
  // await page.locator("//option[contains(text(),\"$|BulkBatchTiming|\")]").click();
  // [DISABLED] Verify that the current page displays text Drag and drop files here or click to browse. Allowed formats: .xls,.xlsx,.csv,.txt
  // await expect(page.getByText("Drag and drop files here or click to browse. Allowed formats: .xls,.xlsx,.csv,.txt")).toBeVisible();
  // [DISABLED] Upload file Bid_Valid_file.xlsx,Bid_Valid_file.xlsx using the element UploadFile [BidRequest]
  // await page.locator("(//input[@type=\"file\"])[1]").setInputFiles(path.resolve(__dirname, 'test-data', "Bid_Valid_file.xlsx"));
  // [DISABLED] Verify that the element UploadBid_Button is enabled and With Scrollable FALSE
  // await expect(page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]")).toBeVisible();
  // [DISABLED] Click on UploadBid_Button
  // await page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]").click();
}

/**
 * Step Group: Adding a batch In bulk batch screen
 * ID: 1227
 * Steps: 21
 */
export async function stepGroup_Adding_a_batch_In_bulk_batch_screen(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const statusInactivePage = new StatusInactivePage(page);
  const actionsPage = new ActionsPage(page);
  vars["CurrentTime"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "hh:mm a";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["ExtendedTime"] = (() => {
    const d = new Date('2000-01-01 ' + String(vars["CurrentTime"]));
    d.setMinutes(d.getMinutes() + parseInt(String("5")));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
  })();
  vars["MinWithStandard"] = String(vars["ExtendedTime"]).split(":")["2"] || '';
  vars["Time_Hour"] = String(vars["ExtendedTime"]).substring(0, String(vars["ExtendedTime"]).length - 6);
  vars["Time_Min"] = String(vars["MinWithStandard"]).substring(0, String(vars["MinWithStandard"]).length - 3);
  vars["Time_Unit"] = String(vars["MinWithStandard"]).substring(3);
  await page.locator("//button[text()[normalize-space() = \"Add A Batch\"]]").click();
  await expect(page.getByText("Add a Batch")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"H\"]]/preceding-sibling::input[@placeholder=\"0\"]").fill(vars["Time_Hour"]);
  vars["PricingReturnTimeBuffer"] = await statusInactivePage.Pricing_Return_Time_Buffer.inputValue() || '';
  await page.locator("(//input[@placeholder=\"00\"])[1]").fill(vars["Time_Min"]);
  vars["AddStartTimeInMin"] = await page.locator("(//input[@placeholder=\"00\"])[1]").inputValue() || '';
  if (String(vars["Time_Unit"]).includes(String("PM"))) {
    await actionsPage.Standard_Dropdown.selectOption({ label: "PM" });
    await expect(actionsPage.Standard_Dropdown).toHaveValue("PM");
  }
  await page.locator("//span[text()[normalize-space() = \"Add Batch\"]]").click();
  await page.waitForLoadState('networkidle');
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText("Create Batch Timing")).toBeVisible();
  await expect(page.locator("//div[text()[normalize-space() = \"Batch timing has been created successfully\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Ok\"]]").click();
}

/**
 * Step Group: IF Condition for Yes, Proceed Button
 * ID: 1230
 * Steps: 4
 */
export async function stepGroup_IF_Condition_for_Yes_Proceed_Button(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const advanceSearch2Page = new AdvanceSearch2Page(page);
  const proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
  if (true) /* Element Yes, Proceed Button is visible */ {
    await advanceSearch2Page.Yes_Proceed_Button.click();
  } else {
    await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
  }
}

/**
 * Step Group: Modifying The Batch Intervals For one Hour Prior.
 * ID: 1232
 * Steps: 19
 */
export async function stepGroup_Modifying_The_Batch_Intervals_For_one_Hour_Prior(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//button[text()[normalize-space() = \"Modify Batch Intervals\"]]").click();
  await expect(page.getByText("Edit Batch Timing")).toBeVisible();
  vars["CurrentTime"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "hh:mm a";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["CurrentTime"] = (() => {
    const d = new Date('2000-01-01 ' + String(vars["CurrentTime"]));
    d.setMinutes(d.getMinutes() + parseInt(String("5")));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
  })();
  await stepGroup_Separating_Hours_and_minutes_In_time_Current_EST_time(page, vars);
  // [DISABLED] Separating Hours and minutes In time(One hour prior)
  // await stepGroup_Separating_Hours_and_minutes_In_timeOne_hour_prior(page, vars);
  // [DISABLED] Pick the current date hh by location UTC-04:00 and store into a variable Time_Hour
  // vars["Time_Hour"] = (() => {
  //   const d = new Date();
  //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-04:00" };
  //   const fmt = "hh";
  //   // Map Java date format to Intl parts
  //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
  //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
  //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  // })();
  await page.locator("//span[text()[normalize-space() = \"H\"]]/preceding-sibling::input[@placeholder=\"0\"]").fill(vars["Time_Hour"]);
  // [DISABLED] Pick the current date hh:mm by location UTC-04:00 and store into a variable Time_Min
  // vars["Time_Min"] = (() => {
  //   const d = new Date();
  //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-04:00" };
  //   const fmt = "hh:mm";
  //   // Map Java date format to Intl parts
  //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
  //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
  //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  // })();
  // [DISABLED] Split the Time_Min with the : and store the value from the 2 in the Time_Minute
  // vars["Time_Minute"] = String(vars["Time_Min"]).split(":")["2"] || '';
  await page.locator("(//input[@placeholder=\"00\"])[1]").fill(vars["Time_Min"]);
  await stepGroup_selecting_time_unit_bulk_batch(page, vars);
  await page.locator("//div[text()[normalize-space() = \"Time Interval\"]]/following-sibling::div[contains(@class, 'custom-input')]//input[@placeholder=\"0\"]").fill(testData["Time Interval"]);
  await correspondentPortalPage.No_Of_Batches.fill(testData["NO of Batches"]);
  await expect(page.locator("(//input[@type=\"radio\"])[1]")).toBeEnabled();
  await page.locator("//span[text()[normalize-space() = \"Modify Batch\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//div[text()[normalize-space() = \"Modified batch timings successfully\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Ok\"]]").click();
}

/**
 * Step Group: Separating Hours and minutes In time(One hour prior)
 * ID: 1233
 * Steps: 4
 */
export async function stepGroup_Separating_Hours_and_minutes_In_timeOne_hour_prior(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["MinWithStandard"] = String(vars["OnehourPrior"]).split(":")["2"] || '';
  vars["Time_Hour"] = String(vars["OnehourPrior"]).substring(0, String(vars["OnehourPrior"]).length - 6);
  vars["Time_Min"] = String(vars["MinWithStandard"]).substring(0, String(vars["MinWithStandard"]).length - 3);
  vars["Time_Unit"] = String(vars["MinWithStandard"]).substring(3);
}

/**
 * Step Group: Creating Of Bid Maps
 * ID: 1236
 * Steps: 30
 */
export async function stepGroup_Creating_Of_Bid_Maps(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const correspondentPortal8Page = new CorrespondentPortal8Page(page);
  const proceedWithSavingButtonPage = new ProceedWithSavingButtonPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//h3[text()[normalize-space() = \"Dashboard\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"Bid Maps\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//h1[text()=\"Mappings\"]")).toBeVisible();
  await page.locator("//button[text()[normalize-space() = \"Add New Mapping\"]]").click();
  await expect(page.locator("//h5[text()[normalize-space() = \"Create New Map\"]]")).toBeVisible();
  vars["Current Date"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata" };
    const fmt = "MM/dd/yyyy";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["Create New Map"] = new Date().toLocaleDateString('en-US') /* format: MM/dd/yyyy/HH:mm:ss */;
  vars["Create New Map"] = "Testsigma_" + vars["Create New Map"];
  await correspondentPortalPage.Create_New_Map_Field.fill(vars["Create New Map"]);
  vars["BidMap"] = await correspondentPortalPage.Create_New_Map_Field.inputValue() || '';
  await correspondentPortal8Page.Compare_Button.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//span[contains(.,' $|Create New Map|')]")).toContainText(vars["Create New Map"]);
  await correspondentPortalPage.Select_Companys_Dropdown.click();
  await correspondentPortalPage.Search_Field_For_Company.fill(testData["Company name 1"]);
  await page.locator("//span[@class='pl-2'][contains(.,'@|Company name 1|')]").click();
  await page.locator("//button[contains(text(),\" Apply Selected \")]").click();
  await expect(page.locator("(//input[@type=\"file\"])[1]")).toHaveValue('');
  await expect(page.getByText("Drag and drop files here or click to browse. Allowed formats: .xls,.xlsx,.csv,.txt")).toBeVisible();
  await page.locator("(//input[@type=\"file\"])[1]").setInputFiles(path.resolve(__dirname, 'test-data', "DeepikaAugBidQA.xlsx"));
  await page.locator("//span[text()[normalize-space() = \"Map Headers\"]]").click();
  await page.locator("//h5[text()[normalize-space() = \"Save and Move to Next Page\"]]").waitFor({ state: 'visible' });
  await expect(page.locator("//*[contains(text(),\"This action will save the changes and Move to Next Page\")]")).toBeVisible();
  await proceedWithSavingButtonPage.Proceed_with_Saving_Button.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText(vars["Create New Map"])).toBeVisible();
  await page.locator("//a[text()[normalize-space() = \"Header Mapping\"]]").waitFor({ state: 'visible' });
}

/**
 * Step Group: Uploading Bid Request For Next Buisiness day
 * ID: 1246
 * Steps: 18
 */
export async function stepGroup_Uploading_Bid_Request_For_Next_Buisiness_day(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//div[text()[normalize-space() = \"Select\"]]").click();
  await page.locator("(//div[@class=\"mb-0 overflow-hidden\"])[1]/../..//input[@placeholder=\"Search\"]").fill(testData["Company Name"]);
  await page.locator("(//span[contains(@class,'pl-2')])[1]").click();
  await expect(page.locator("(//span[contains(@class,'pl-2')])[1]")).toContainText(testData["Company Name"]);
  await page.waitForTimeout(3000);
  await expect(page.locator("//label[text()=\"Standard\"]/..//input[@type=\"checkbox\"]")).toBeVisible();
  await page.locator("(//select[contains(normalize-space(),\"Select 3 7 15\")])[1]").selectOption({ label: "3" });
  await expect(page.locator("(//option[@value=\"3\"])[1]/../..//select[@aria-label=\"Dropdown selection\"]")).toHaveValue("3");
  await page.locator("//label[text()[normalize-space() = \"Chase Direct\"]]/preceding-sibling::input[@type=\"checkbox\"]").check();
  await expect(page.locator("//label[text()[normalize-space() = \"Chase Direct\"]]/preceding-sibling::input[@type=\"checkbox\"]")).toBeVisible();
  await page.locator("(//select[contains(normalize-space(),\"Select 3 7 15\")])[2]").selectOption({ index: parseInt("1") });
  await page.locator("//div[text()[normalize-space() = \"Select Mapping\"]]").click();
  await page.locator("//div[contains(@class, 'shadow') and contains(@class, 'dropdown-menu') and contains(@class, 'show')]//input[@placeholder=\"Search\"]").fill(testData["BidMappingID"]);
  await page.locator("//span[text()[normalize-space() =\"Deepika Aug1\"]]").click();
  await expect(page.locator("//button//div[text()=' @|BidMappingID| ']")).toContainText(testData["BidMappingID"]);
  await page.locator("(//input[@type=\"radio\"])[2]").check();
  await expect(page.locator("(//input[@type=\"radio\"])[2]")).toBeEnabled();
  await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").click();
}

/**
 * Step Group: Navigating to Customer Permission For the Chase Direct Company Name
 * ID: 1247
 * Steps: 13
 */
export async function stepGroup_Navigating_to_Customer_Permission_For_the_Chase_Direct_Compa(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const customerPermissionPage = new CustomerPermissionPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await customerPermissionPage.CustomerPermission_Menu.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText("Customer Permission")).toBeVisible();
  await correspondentPortalPage.Search_Filter_Input_in_Customer_Permission.click();
  await correspondentPortalPage.Search_Filter_Input_in_Customer_Permission.fill(testData["Company name 1"]);
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  vars["CompanyName"] = await page.locator("//td[contains(.,\"Allowed\") and @data-title=\"Chase Direct\"]/../td[@data-title=\"Company Name\"]").textContent() || '';
  vars["Companyname"] = String(vars["CompanyName"]).trim();
  await expect(page.locator("//td[contains(.,\"Allowed\") and @data-title=\"Chase Direct\"]/../td[@data-title=\"Company Name\"]")).toContainText(vars["Companyname"]);
}

/**
 * Step Group: Getting Next Bussiness day by handling weekend
 * ID: 1248
 * Steps: 9
 */
export async function stepGroup_Getting_Next_Bussiness_day_by_handling_weekend(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["CurrentDateList"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "MM/dd/yyyy";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["TomorrowsDateList"] = (() => {
    const d = new Date(String(vars["CurrentDateList"]));
    d.setDate(d.getDate() + parseInt(String("1")));
    const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
    return "MM/dd/yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
  })();
  vars[""] = new Date(String("TomorrowsDay")).toLocaleDateString('en-US', { weekday: 'long' });
  if (String(vars["TomorrowsDay"]) === String("Saturday")) {
    vars["NextBusinessDate"] = (() => {
      const d = new Date(String(vars["TomorrowsDateList"]));
      d.setDate(d.getDate() + parseInt(String("2")));
      const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
      return "MM/dd/yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
    })();
  } else if (String(vars["TomorrowsDay"]) === String("Sunday")) {
    vars["NextBusinessDate"] = (() => {
      const d = new Date(String(vars["TomorrowsDateList"]));
      d.setDate(d.getDate() + parseInt(String("1")));
      const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
      return "MM/dd/yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
    })();
  } else {
    vars["NextBusinessDate"] = vars["TomorrowsDateList"];
  }
}

/**
 * Step Group: Modifying The Batch Intervals For Next bussiness day with one hour prior
 * ID: 1249
 * Steps: 19
 */
export async function stepGroup_Modifying_The_Batch_Intervals_For_Next_bussiness_day_with_on(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//button[text()[normalize-space() = \"Modify Batch Intervals\"]]").click();
  await expect(page.getByText("Edit Batch Timing")).toBeVisible();
  vars["CurrentTime"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "hh:mm a";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["OnehourPrior"] = (() => {
    const d = new Date('2000-01-01 ' + String(vars["CurrentTime"]));
    d.setMinutes(d.getMinutes() + parseInt(String("60")));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
  })();
  await stepGroup_Separating_Hours_and_minutes_In_timeOne_hour_prior(page, vars);
  // [DISABLED] Pick the current date hh by location UTC-04:00 and store into a variable Time_Hour
  // vars["Time_Hour"] = (() => {
  //   const d = new Date();
  //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-04:00" };
  //   const fmt = "hh";
  //   // Map Java date format to Intl parts
  //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
  //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
  //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  // })();
  await page.locator("//span[text()[normalize-space() = \"H\"]]/preceding-sibling::input[@placeholder=\"0\"]").fill(vars["Time_Hour"]);
  // [DISABLED] Pick the current date hh:mm by location UTC-04:00 and store into a variable Time_Min
  // vars["Time_Min"] = (() => {
  //   const d = new Date();
  //   const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-04:00" };
  //   const fmt = "hh:mm";
  //   // Map Java date format to Intl parts
  //   const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
  //   const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
  //   return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  // })();
  // [DISABLED] Split the Time_Min with the : and store the value from the 2 in the Time_Minute
  // vars["Time_Minute"] = String(vars["Time_Min"]).split(":")["2"] || '';
  await page.locator("(//input[@placeholder=\"00\"])[1]").fill(vars["Time_Min"]);
  await stepGroup_selecting_time_unit_bulk_batch(page, vars);
  await page.locator("//div[text()[normalize-space() = \"Time Interval\"]]/following-sibling::div[contains(@class, 'custom-input')]//input[@placeholder=\"0\"]").fill(testData["Time Interval"]);
  await correspondentPortalPage.No_Of_Batches.fill(testData["NO of Batches"]);
  await page.locator("(//input[@type=\"radio\"])[2]").check();
  await expect(page.locator("(//input[@type=\"radio\"])[2]")).toBeEnabled();
  await page.locator("//span[text()[normalize-space() = \"Modify Batch\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//div[text()[normalize-space() = \"Modified batch timings successfully\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Ok\"]]").click();
}

/**
 * Step Group: Navigate to Customer Permission to Fetch First Company Name
 * ID: 1250
 * Steps: 13
 */
export async function stepGroup_Navigate_to_Customer_Permission_to_Fetch_First_Company_Name(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const customerPermissionPage = new CustomerPermissionPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await customerPermissionPage.CustomerPermission_Menu.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText("Customer Permission")).toBeVisible();
  await correspondentPortalPage.Search_Filter_Input_in_Customer_Permission.click();
  await correspondentPortalPage.Search_Filter_Input_in_Customer_Permission.fill(testData["Company name 1"]);
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  vars["CompanyName"] = await page.locator("(//div[@class='d-flex align-items-end'][contains(.,'Company Name')]/../../../..//td[@data-title=\"Company Name\"])").textContent() || '';
  vars["Companyname"] = String(vars["CompanyName"]).trim();
  await expect(page.locator("(//div[@class='d-flex align-items-end'][contains(.,'Company Name')]/../../../..//td[@data-title=\"Company Name\"])")).toContainText(vars["Companyname"]);
}

/**
 * Step Group: Getting Perfect,Partial,Incorrect,Unmapped Count From Enum Mapping
 * ID: 1251
 * Steps: 20
 */
export async function stepGroup_Getting_PerfectPartialIncorrectUnmapped_Count_From_Enum_Mapp(page: import('@playwright/test').Page, vars: Record<string, string>) {
  if (true) /* Element Unmapped Chase Value is visible */ {
    vars["UnmappedCount"] = (parseFloat(String("1")) + parseFloat(String(vars["UnmappedCount"]))).toFixed(0);
  } else if (String("N , False , FALSE , false").includes(String(vars["BidTapeValueUI"]))) {
    if (String("N , False , FALSE , false").includes(String(vars["ChaseValueUI"]))) {
      vars["PerfectMatch"] = (parseFloat(String("1")) + parseFloat(String(vars["PerfectMatch"]))).toFixed(0);
    } else {
      vars["IncorrectMatch"] = (parseFloat(String("1")) + parseFloat(String(vars["IncorrectMatch"]))).toFixed(0);
    }
  } else if (String("Y , True , true , TRUE").includes(String(vars["BidTapeValueUI"]))) {
    if (String("Y , True , true , TRUE").includes(String(vars["ChaseValueUI"]))) {
      vars["PerfectMatch"] = (parseFloat(String("1")) + parseFloat(String(vars["PerfectMatch"]))).toFixed(0);
    } else {
      vars["IncorrectMatch"] = (parseFloat(String("1")) + parseFloat(String(vars["IncorrectMatch"]))).toFixed(0);
    }
  } else if (String(vars["ChaseValueUI"]) === String(vars["BidTapeValueUI"])) {
    vars["PerfectMatch"] = (parseFloat(String("1")) + parseFloat(String(vars["PerfectMatch"]))).toFixed(0);
  } else if (String(vars["ChaseValueUI"]).includes(String(vars["BidTapeValueUI"]))) {
    vars["PartialMatch"] = (parseFloat(String("1")) + parseFloat(String(vars["PartialMatch"]))).toFixed(0);
  } else if (String(vars["BidTapeValueUI"]).includes(String(vars["ChaseValueUI"]))) {
    vars["PartialMatch"] = (parseFloat(String("1")) + parseFloat(String(vars["PartialMatch"]))).toFixed(0);
  } else {
    vars["IncorrectMatch"] = (parseFloat(String("1")) + parseFloat(String(vars["IncorrectMatch"]))).toFixed(0);
  }
}

/**
 * Step Group: Upload Bid Request For Next Business Day With Chase Direct Execution Type
 * ID: 1256
 * Steps: 18
 */
export async function stepGroup_Upload_Bid_Request_For_Next_Business_Day_With_Chase_Direct_E(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const actionsPage = new ActionsPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//div[text()[normalize-space() = \"Select\"]]").click();
  await page.locator("(//div[@class=\"mb-0 overflow-hidden\"])[1]/../..//input[@placeholder=\"Search\"]").fill(testData["Company Name"]);
  await page.locator("(//span[contains(@class,'pl-2')])[1]").click();
  await expect(page.locator("(//span[contains(@class,'pl-2')])[1]")).toContainText(testData["Company Name"]);
  await actionsPage.Standard_Dropdown.waitFor({ state: 'visible' });
  await expect(page.locator("//label[text()=\"Standard\"]/..//input[@type=\"checkbox\"]")).toBeVisible();
  await page.locator("//label[text()=\"Standard\"]/..//input[@type=\"checkbox\"]").uncheck();
  await expect(page.locator("//label[text()=\"Standard\"]/..//input[@type=\"checkbox\"]")).toBeVisible();
  await page.locator("//label[text()[normalize-space() = \"Chase Direct\"]]/preceding-sibling::input[@type=\"checkbox\"]").check();
  await expect(page.locator("//label[text()[normalize-space() = \"Chase Direct\"]]/preceding-sibling::input[@type=\"checkbox\"]")).toBeVisible();
  await page.locator("(//select[contains(normalize-space(),\"Select 3 7 15\")])[2]").selectOption({ index: parseInt("1") });
  await page.locator("//div[text()[normalize-space() = \"Select Mapping\"]]").click();
  await page.locator("//div[contains(@class, 'shadow') and contains(@class, 'dropdown-menu') and contains(@class, 'show')]//input[@placeholder=\"Search\"]").fill(testData["BidMappingID"]);
  await page.locator("//span[text()[normalize-space() =\"Deepika Aug1\"]]").click();
  await expect(page.locator("//button//div[text()=' @|BidMappingID| ']")).toContainText(testData["BidMappingID"]);
  await page.locator("(//input[@type=\"radio\"])[2]").check();
  await expect(page.locator("(//input[@type=\"radio\"])[2]")).toBeEnabled();
  await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").click();
}

/**
 * Step Group: Uploading Bid Request By Selecting both standard and chase type 
 * ID: 1259
 * Steps: 17
 */
export async function stepGroup_Uploading_Bid_Request_By_Selecting_both_standard_and_chase_t(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//div[text()[normalize-space() = \"Select\"]]").click();
  await page.locator("(//div[@class=\"mb-0 overflow-hidden\"])[1]/../..//input[@placeholder=\"Search\"]").fill(testData["Company Name"]);
  await page.locator("(//span[contains(@class,'pl-2')])[1]").waitFor({ state: 'visible' });
  await expect(page.locator("(//span[contains(@class,'pl-2')])[1]")).toContainText(testData["Company Name"]);
  await page.locator("(//span[contains(@class,'pl-2')])[1]").click();
  await expect(page.locator("//label[text()=\"Standard\"]/..//input[@type=\"checkbox\"]")).toBeVisible();
  await page.locator("(//select[contains(normalize-space(),\"Select 3 7 15\")])[1]").selectOption({ label: "3" });
  await expect(page.locator("(//option[@value=\"3\"])[1]/../..//select[@aria-label=\"Dropdown selection\"]")).toHaveValue("3");
  await page.locator("//label[text()[normalize-space() = \"Chase Direct\"]]/preceding-sibling::input[@type=\"checkbox\"]").check();
  await expect(page.locator("//label[text()[normalize-space() = \"Chase Direct\"]]/preceding-sibling::input[@type=\"checkbox\"]")).toBeVisible();
  await page.locator("(//select[contains(normalize-space(),\"Select 3 7 15\")])[2]").selectOption({ index: parseInt("1") });
  await page.locator("//div[text()[normalize-space() = \"Select Mapping\"]]").click();
  await page.locator("//div[contains(@class, 'shadow') and contains(@class, 'dropdown-menu') and contains(@class, 'show')]//input[@placeholder=\"Search\"]").fill(testData["BidMappingID"]);
  await page.locator("//span[contains(text(),\"@|BidMappingIDNew|\")]").waitFor({ state: 'visible' });
  await page.locator("//span[contains(text(),\"@|BidMappingIDNew|\")]").click();
  await expect(page.locator("//button//div[text()=' @|BidMappingID| ']")).toContainText(testData["BidMappingID"]);
  await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").click();
}

/**
 * Step Group: Upload bid request with execution type chase
 * ID: 1264
 * Steps: 15
 */
export async function stepGroup_Upload_bid_request_with_execution_type_chase(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//div[text()[normalize-space() = \"Select\"]]").click();
  await page.locator("(//div[@class=\"mb-0 overflow-hidden\"])[1]/../..//input[@placeholder=\"Search\"]").fill(testData["Company Name"]);
  await page.locator("(//span[contains(@class,'pl-2')])[1]").click();
  await expect(page.locator("(//span[contains(@class,'pl-2')])[1]")).toContainText(testData["Company Name"]);
  await expect(page.locator("//label[text()=\"Standard\"]/..//input[@type=\"checkbox\"]")).toBeVisible();
  await page.locator("//label[text()=\"Standard\"]/..//input[@type=\"checkbox\"]").uncheck();
  await expect(page.locator("//label[text()=\"Standard\"]/..//input[@type=\"checkbox\"]")).toBeVisible();
  await page.locator("//label[text()[normalize-space() = \"Chase Direct\"]]/preceding-sibling::input[@type=\"checkbox\"]").check();
  await expect(page.locator("//label[text()[normalize-space() = \"Chase Direct\"]]/preceding-sibling::input[@type=\"checkbox\"]")).toBeVisible();
  await page.locator("(//select[contains(normalize-space(),\"Select 3 7 15\")])[2]").selectOption({ index: parseInt("1") });
  await page.locator("//div[text()[normalize-space() = \"Select Mapping\"]]").click();
  await page.locator("//div[contains(@class, 'shadow') and contains(@class, 'dropdown-menu') and contains(@class, 'show')]//input[@placeholder=\"Search\"]").fill(testData["BidMappingID"]);
  await page.locator("//span[text()[normalize-space() =\"Deepika Aug1\"]]").click();
  await expect(page.locator("//button//div[text()=' @|BidMappingID| ']")).toContainText(testData["BidMappingID"]);
  await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").click();
}

/**
 * Step Group: Verifying the second accordian table from excel to UI In bid request details page
 * ID: 1266
 * Steps: 25
 */
export async function stepGroup_Verifying_the_second_accordian_table_from_excel_to_UI_In_bid(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  vars["BidValueFromTableHeader2"] = await page.locator("(//h5[@aria-labelledby=\"bidValueLabel\"])[2]").textContent() || '';
  vars["amount1"] = String(vars["BidValueFromTableHeader2"]).split(",")["1"] || '';
  vars["amount2"] = String(vars["BidValueFromTableHeader2"]).split(",")["2"] || '';
  vars["BidValueFromTableHeader2"] = String(vars["amount1"]) + String(vars["amount2"]);
  expect(String(vars["BidValueFromTableHeader2"])).toBe(vars["TotalLoanAmountFromRows"]);
  await expect(page.locator("(//div[text()=\" Execution Type \"]/..//h5)[1]")).toContainText("Standard");
  vars["TotalLoansCountRows"] = String(await page.locator("(//table)[1]//td[@data-title=\"Loan Status\"]").count());
  if (true) /* Element Success Loans Header 1 is visible */ {
    vars["SuccessLoansCountRows"] = String(await page.locator("(//table)[1]//td[@data-title=\"Loan Status\"]//*[text()=\" Success \"]").count());
  } else {
    vars["SuccessLoansCountRows"] = "0";
  }
  if (true) /* Element Errored Loans Count from Rows is visible */ {
    vars["ErroredLoansCountRows"] = String(await page.locator("(//table)[1]//td[@data-title=\"Loan Status\"]//*[text()=\" Error \"]").count());
  } else {
    vars["ErroredLoansCountRows"] = "0";
  }
  await expect(page.locator("(//h5[@aria-labelledby=\"totalLoanRowsLabel\"]//span[contains(@aria-label,\"Total Loans\")])[1]")).toContainText(vars["TotalLoansCountRows"]);
  await expect(page.locator("(//h5[@aria-labelledby=\"totalLoanRowsLabel\"]//span[contains(@aria-label,\"Successful Loans\")])[1]")).toContainText(vars["SuccessLoansCountRows"]);
  await expect(page.locator("(//h5[@aria-labelledby=\"totalLoanRowsLabel\"]//span[contains(@aria-label,\"Errored Loans\")])[1]")).toContainText(vars["ErroredLoansCountRows"]);
  vars["TotalColumnCountExcel"] = String(excelHelper.getColumnCount("Bid_file_success_error.xlsx,Bid_file_success_error.xlsx", "0"));
  vars["count"] = "1";
  vars["ColumnCountExcel"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalColumnCountExcel"]))) {
    await bidRequestDetailsPage.Bid_Request_Details_Text.click();
    vars["ColumnHeaderExcel"] = excelHelper.readCell(path.resolve(__dirname, 'test-data', "Bid_file_success_error.xlsx,Bid_file_success_error.xlsx"), "1", vars["ColumnCountExcel"]);
    if (String("Correspondent Loan Number , Borrower Last Name , Original Loan Amount , Product Code").includes(String(vars["ColumnHeaderExcel"]))) {
    }
  }
}

/**
 * Step Group: Navigating To Bid Request Config
 * ID: 1269
 * Steps: 6
 */
export async function stepGroup_Navigating_To_Bid_Request_Config(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestPage = new BidRequestPage(page);
  await page.waitForLoadState('networkidle');
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//*[text()[normalize-space() = \"General Settings\"]]").click();
  await page.waitForLoadState('networkidle');
  await bidRequestPage.Bid_Request_Config_Menu.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: EditActions_In_CustomerPermission
 * ID: 1270
 * Steps: 12
 */
export async function stepGroup_EditActions_In_CustomerPermission(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const actionsPage = new ActionsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  await page.locator("(//div[@id=\"common-table-results\"]//following-sibling::td[@data-title=\"Actions\"])[1]//button[@aria-label=\"Edit Permission\"]").click();
  await page.locator("//h5[contains(.,'Edit Permissions')]").waitFor({ state: 'visible' });
  if (true) /* Radio button Standard_Flow_On_Button is not selected */ {
    await page.locator("(//label[normalize-space(text())='Standard']/parent::div//input)[1]").click();
  }
  if (true) /* Radio button Chase_Direct_ON_button is not selected */ {
    await page.locator("(//label[normalize-space(text())='Chase Direct']/parent::div//input)[1]").click();
  }
  if (true) /* Element Update Permissions Button is enabled */ {
    await page.locator("//button[contains(.,'Update Permissions')]").click();
  } else {
    await actionsPage.Close_Model_Button.click();
  }
  await correspondentPortalPage.Search_Filter_Input_in_Customer_Permission.clear();
  await page.waitForLoadState('networkidle');
}

/**
 * Step Group: Navigating to Customer Permission Page and disabling the standard type in freedom company 
 * ID: 1273
 * Steps: 20
 */
export async function stepGroup_Navigating_to_Customer_Permission_Page_and_disabling_the_sta(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const customerPermissionPage = new CustomerPermissionPage(page);
  const editPermissionsPage = new EditPermissionsPage(page);
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await customerPermissionPage.CustomerPermission_Menu.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText("Customer Permission")).toBeVisible();
  await page.locator("//td[contains(text(),\"@|Company Name|\")]/following-sibling::td[@data-title=\"Actions\"]//button[@aria-label=\"Edit Permission\"]//span[contains(@class, 'fa-pencil-alt')]").click();
  await page.getByText("Edit Permissions").waitFor({ state: 'visible' });
  await expect(page.locator("(//input[@type=\"radio\"])[3]")).toBeEnabled();
  if (true) /* Radio button Off Radio Standard(Edit Permissions Popup) is n */ {
    await page.locator("(//input[@type=\"radio\"])[2]").check();
    await page.locator("//button[contains(.,'Update Permissions')]").waitFor({ state: 'visible' });
  }
  if (true) /* Radio button On Radio ChaseDirect(Edit Permissions Popup) is */ {
    await page.locator("(//input[@type=\"radio\"])[3]").check();
    await page.locator("//button[contains(.,'Update Permissions')]").waitFor({ state: 'visible' });
  }
  if (true) /* Element Update Permissions Button is enabled */ {
    await page.locator("//button[contains(.,'Update Permissions')]").click();
  } else {
    await editPermissionsPage.Close_pop_up.click();
  }
}

/**
 * Step Group: Filtering Status and Navigating to Filtered Status Bid Request
 * ID: 1274
 * Steps: 16
 */
export async function stepGroup_Filtering_Status_and_Navigating_to_Filtered_Status_Bid_Reque(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  await correspondentPortalPage.Bid_Requests_Side_Menu.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//span[text()[normalize-space() = \"Filter\"]]").click();
  await page.locator("//div[text()[normalize-space() = \"Select Company/CCode\"]]").click();
  await page.locator("//input[@type=\"checkbox\" and contains(@aria-label,\"@|Company Name|\")]").check();
  await page.locator("//button[contains(normalize-space(),\"Apply Selected 1\")]").click();
  await page.locator("//div[text()[normalize-space() = \"Select Bid Request Status\"]]").click();
  await page.locator("//input[@type=\"checkbox\" and @aria-label=\"Select $|StatusToBeSelected|\"]").check();
  await expect(page.locator("//button[contains(normalize-space(),\"Apply Selected 1\")]")).toBeVisible();
  await page.locator("(//button[contains(normalize-space(),\"Apply Selected 1\")])[2]").click();
  await page.locator("//div[contains(@class, \"justify-content-end\")]//button[text()=\"Apply Filters\"]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await stepGroup_Traversing_to_the_next_screens_until_the_bid_is_visible(page, vars);
  await expect(page.locator("(//td[@data-title=\"Status\"])[1]")).toContainText(vars["StatusToBeSelected"]);
  await page.locator("//div[   contains(@aria-label, 'Loans total:') and   number(substring-before(substring-after(@aria-label, 'Loans total: '), ',')) < 10 ]/../..//td[@data-title=\"Execution Type\"]//div[text()=\" $|ExecutionType| \"]/../..//td[@data-title=\"Status\"]//span[contains(text(),\"$|StatusToBeSelected|\")]/../../..//td[@data-title=\"Bid Req. ID\"]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: Navigating to Customer Permission and enabling the Standard type in Freedom Company
 * ID: 1275
 * Steps: 16
 */
export async function stepGroup_Navigating_to_Customer_Permission_and_enabling_the_Standard_(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const customerPermissionPage = new CustomerPermissionPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await customerPermissionPage.CustomerPermission_Menu.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText("Customer Permission")).toBeVisible();
  await customerPermissionPage.Search_Filter_Input.fill(testData["Expected Company Name"]);
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//td[contains(text(),\"@|Company Name|\")]/following-sibling::td[@data-title=\"Actions\"]//button[@aria-label=\"Edit Permission\"]//span[contains(@class, 'fa-pencil-alt')]").click();
  await page.getByText("Edit Permissions").waitFor({ state: 'visible' });
  if (true) /* Radio button Standard_Flow_On_Button is not selected */ {
    await page.locator("(//label[normalize-space(text())='Standard']/parent::div//input)[1]").check();
    await page.locator("//button[contains(.,'Update Permissions')]").waitFor({ state: 'visible' });
    await page.locator("//button[contains(.,'Update Permissions')]").click();
    await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  }
}

/**
 * Step Group: Navigating to Customer Permissions and disabling the chase execution type for freedom company.
 * ID: 1279
 * Steps: 21
 */
export async function stepGroup_Navigating_to_Customer_Permissions_and_disabling_the_chase_e(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const customerPermissionPage = new CustomerPermissionPage(page);
  const editPermissionsPage = new EditPermissionsPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await customerPermissionPage.CustomerPermission_Menu.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText("Customer Permission")).toBeVisible();
  await customerPermissionPage.Search_Filter_Input.fill(testData["Expected Company Name"]);
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//td[contains(text(),\"@|Company Name|\")]/following-sibling::td[@data-title=\"Actions\"]//button[@aria-label=\"Edit Permission\"]//span[contains(@class, 'fa-pencil-alt')]").click();
  await page.getByText("Edit Permissions").waitFor({ state: 'visible' });
  if (true) /* Radio button Off Radio Chase Direct(Edit Permissions) is not */ {
    await page.locator("(//input[@type=\"radio\"])[4]").check();
    await page.locator("//button[contains(.,'Update Permissions')]").waitFor({ state: 'visible' });
  }
  if (true) /* Radio button StandardFlow On(Edit Permissions Popup) is not  */ {
    await page.locator("(//input[@type=\"radio\"])[1]").check();
    await page.locator("//button[contains(.,'Update Permissions')]").waitFor({ state: 'visible' });
  }
  if (true) /* Element Update Permissions Button is enabled */ {
    await page.locator("//button[contains(.,'Update Permissions')]").click();
  } else {
    await editPermissionsPage.Close_pop_up.click();
  }
}

/**
 * Step Group: Navigating To Customer Permissions and enabling the chase type for Freedom Company
 * ID: 1280
 * Steps: 16
 */
export async function stepGroup_Navigating_To_Customer_Permissions_and_enabling_the_chase_ty(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const customerPermissionPage = new CustomerPermissionPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await customerPermissionPage.CustomerPermission_Menu.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText("Customer Permission")).toBeVisible();
  await customerPermissionPage.Search_Filter_Input.fill(testData["Expected Company Name"]);
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//td[contains(text(),\"@|Company Name|\")]/following-sibling::td[@data-title=\"Actions\"]//button[@aria-label=\"Edit Permission\"]//span[contains(@class, 'fa-pencil-alt')]").click();
  await page.getByText("Edit Permissions").waitFor({ state: 'visible' });
  if (true) /* Radio button On Radio ChaseDirect(Edit Permissions Popup) is */ {
    await page.locator("(//input[@type=\"radio\"])[3]").check();
    await page.locator("//button[contains(.,'Update Permissions')]").waitFor({ state: 'visible' });
    await page.locator("//button[contains(.,'Update Permissions')]").click();
    await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  }
}

/**
 * Step Group: Traversing to the next screens until the bid is visible
 * ID: 1283
 * Steps: 7
 */
export async function stepGroup_Traversing_to_the_next_screens_until_the_bid_is_visible(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  if (true) /* Element Filtered Status BidRequest ID is not visible */ {
    await correspondentPortalPage.Change_Page_Size_Dropdown.click();
    await correspondentPortalPage.Set_page_size_to_50_Dropdown.click();
    await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
    if (true) /* Element Filtered Status BidRequest ID is not visible */ {
      while (!(await page.locator("//div[   contains(@aria-label, 'Loans total:') and   number(substring-before(substring-after(@aria-label, 'Loans total: '), ',')) < 10 ]/../..//td[@data-title=\"Execution Type\"]//div[text()=\" $|ExecutionType| \"]/../..//td[@data-title=\"Status\"]//span[contains(text(),\"$|StatusToBeSelected|\")]/../../..//td[@data-title=\"Bid Req. ID\"]").isVisible())) {
        await page.locator("//span[contains(@class, 'dlp-icon') and contains(@class, 'fa-chevron-right')]").click();
      }
    }
  }
}

/**
 * Step Group: Navigating to Customer Permissions and disabling both execution types for freedom company
 * ID: 1284
 * Steps: 21
 */
export async function stepGroup_Navigating_to_Customer_Permissions_and_disabling_both_execut(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const customerPermissionPage = new CustomerPermissionPage(page);
  const editPermissionsPage = new EditPermissionsPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await customerPermissionPage.CustomerPermission_Menu.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText("Customer Permission")).toBeVisible();
  await customerPermissionPage.Search_Filter_Input.fill(testData["Expected Company Name"]);
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//td[contains(text(),\"@|Company Name|\")]/following-sibling::td[@data-title=\"Actions\"]//button[@aria-label=\"Edit Permission\"]//span[contains(@class, 'fa-pencil-alt')]").click();
  await page.getByText("Edit Permissions").waitFor({ state: 'visible' });
  if (true) /* Radio button Off Radio Chase Direct(Edit Permissions) is not */ {
    await page.locator("(//input[@type=\"radio\"])[4]").check();
    await page.locator("//button[contains(.,'Update Permissions')]").waitFor({ state: 'visible' });
  }
  if (true) /* Radio button Off Radio Standard(Edit Permissions Popup) is n */ {
    await page.locator("(//input[@type=\"radio\"])[2]").check();
    await page.locator("//button[contains(.,'Update Permissions')]").waitFor({ state: 'visible' });
  }
  if (true) /* Element Update Permissions Button is enabled */ {
    await page.locator("//button[contains(.,'Update Permissions')]").click();
  } else {
    await editPermissionsPage.Close_pop_up.click();
  }
}

/**
 * Step Group: Navigating to Customer Permissions and enabling both execution types for freedom company
 * ID: 1285
 * Steps: 21
 */
export async function stepGroup_Navigating_to_Customer_Permissions_and_enabling_both_executi(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const customerPermissionPage = new CustomerPermissionPage(page);
  const editPermissionsPage = new EditPermissionsPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await customerPermissionPage.CustomerPermission_Menu.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText("Customer Permission")).toBeVisible();
  await customerPermissionPage.Search_Filter_Input.fill(testData["Expected Company Name"]);
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//td[contains(text(),\"@|Company Name|\")]/following-sibling::td[@data-title=\"Actions\"]//button[@aria-label=\"Edit Permission\"]//span[contains(@class, 'fa-pencil-alt')]").click();
  await page.getByText("Edit Permissions").waitFor({ state: 'visible' });
  if (true) /* Radio button StandardFlow On(Edit Permissions Popup) is not  */ {
    await page.locator("(//input[@type=\"radio\"])[1]").check();
    await page.locator("//button[contains(.,'Update Permissions')]").waitFor({ state: 'visible' });
  }
  if (true) /* Radio button On Radio ChaseDirect(Edit Permissions Popup) is */ {
    await page.locator("(//input[@type=\"radio\"])[3]").check();
    await page.locator("//button[contains(.,'Update Permissions')]").waitFor({ state: 'visible' });
  }
  if (true) /* Element Update Permissions Button is enabled */ {
    await page.locator("//button[contains(.,'Update Permissions')]").click();
  } else {
    await editPermissionsPage.Close_pop_up.click();
  }
}

/**
 * Step Group: Traversing to the next screens until the Standard and chase bid request along with selected status  is visible 
 * ID: 1288
 * Steps: 7
 */
export async function stepGroup_Traversing_to_the_next_screens_until_the_Standard_and_chase_(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  if (true) /* Element Filtered Status BidRequest ID (Standard and chase) i */ {
    await correspondentPortalPage.Change_Page_Size_Dropdown.click();
    await correspondentPortalPage.Set_page_size_to_50_Dropdown.click();
    await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
    if (true) /* Element Filtered Status BidRequest ID (Standard and chase) i */ {
      while (!(await page.locator("//div[   contains(@aria-label, 'Loans total:') and   number(substring-before(substring-after(@aria-label, 'Loans total: '), ',')) <= 10 ]/../..//td[@data-title='Execution Type']/div[normalize-space(.) = 'Standard , Chase Direct']/../..//td[@data-title=\"Status\"]//*[text()=\" $|StatusToBeSelected| \"]/../../..//td[@data-title=\"Bid Req. ID\"]").isVisible())) {
        await page.locator("//span[contains(@class, 'dlp-icon') and contains(@class, 'fa-chevron-right')]").click();
      }
    }
  }
}

/**
 * Step Group: Filtering Status and Navigating to the standard chase bid request
 * ID: 1289
 * Steps: 16
 */
export async function stepGroup_Filtering_Status_and_Navigating_to_the_standard_chase_bid_re(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  await correspondentPortalPage.Bid_Requests_Side_Menu.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//span[text()[normalize-space() = \"Filter\"]]").click();
  await page.locator("//div[text()[normalize-space() = \"Select Company/CCode\"]]").click();
  await page.locator("//input[@type=\"checkbox\" and contains(@aria-label,\"@|Company Name|\")]").check();
  await page.locator("//button[contains(normalize-space(),\"Apply Selected 1\")]").click();
  await page.locator("//div[text()[normalize-space() = \"Select Bid Request Status\"]]").click();
  await page.locator("//input[@type=\"checkbox\" and @aria-label=\"Select $|StatusToBeSelected|\"]").check();
  await expect(page.locator("//button[contains(normalize-space(),\"Apply Selected 1\")]")).toBeVisible();
  await page.locator("(//button[contains(normalize-space(),\"Apply Selected 1\")])[2]").click();
  await page.locator("//div[contains(@class, \"justify-content-end\")]//button[text()=\"Apply Filters\"]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("(//td[@data-title=\"Status\"])[1]")).toContainText(vars["StatusToBeSelected"]);
  await stepGroup_Traversing_to_the_next_screens_until_the_Standard_and_chase_(page, vars);
  await page.locator("//div[   contains(@aria-label, 'Loans total:') and   number(substring-before(substring-after(@aria-label, 'Loans total: '), ',')) <= 10 ]/../..//td[@data-title='Execution Type']/div[normalize-space(.) = 'Standard , Chase Direct']/../..//td[@data-title=\"Status\"]//*[text()=\" $|StatusToBeSelected| \"]/../../..//td[@data-title=\"Bid Req. ID\"]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: Verify that the Bid Upload Progress Popup has All statuses with either Warning Or Success
 * ID: 1297
 * Steps: 6
 */
export async function stepGroup_Verify_that_the_Bid_Upload_Progress_Popup_has_All_statuses_w(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestPage = new BidRequestPage(page);
  vars["AllRowsCount"] = String(await bidRequestPage.Bid_Request_Status_Column_Data.count());
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["AllRowsCount"]))) {
    vars["IndividualStatus"] = await page.locator("(//td[@data-title=\"Status\"]//span)[$|count|]").textContent() || '';
    expect(String("Success , Warning")).toBe(vars["IndividualStatus"]);
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}

/**
 * Step Group: Verifying the table data in bid request details from tdp
 * ID: 1299
 * Steps: 25
 */
export async function stepGroup_Verifying_the_table_data_in_bid_request_details_from_tdp(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  vars["TotalRowsCount"] = String(await page.locator("(//table)[1]//tbody//tr").count());
  vars["RowsCount"] = "1";
  while (parseFloat(String(vars["RowsCount"])) <= parseFloat(String(vars["TotalRowsCount"]))) {
    await bidRequestDetailsPage.Bid_Request_Details_Text.click();
    vars["ColumnCount"] = "1";
    while (parseFloat(String(vars["ColumnCount"])) <= parseFloat(String("7"))) {
      for (let dataIdx = parseInt(vars["RowsCount"]); dataIdx <= parseInt(vars["RowsCount"]); dataIdx++) {
        await bidRequestDetailsPage.Bid_Request_Details_Text.click();
        if (String(vars["ColumnCount"]) === String("1")) {
          await expect(page.locator("(//tr[$|RowsCount|]//td)[$|ColumnCount|]")).toContainText(testData["Loan Number"]);
        } else if (String(vars["ColumnCount"]) === String("2")) {
          await expect(page.locator("(//tr[$|RowsCount|]//td)[$|ColumnCount|]")).toContainText(testData["Last Name"]);
        } else if (String(vars["ColumnCount"]) === String("3")) {
          await expect(page.locator("(//tr[$|RowsCount|]//td)[$|ColumnCount|]")).toContainText(testData["LoanAmount"]);
        } else if (String(vars["ColumnCount"]) === String("4")) {
          await expect(page.locator("(//tr[$|RowsCount|]//td)[$|ColumnCount|]")).toContainText(testData["Program"]);
        } else if (String(vars["ColumnCount"]) === String("5")) {
          await expect(page.locator("(//tr[$|RowsCount|]//td)[$|ColumnCount|]")).toContainText(testData["Loan Status"]);
        } else if (String(vars["ColumnCount"]) === String("6")) {
          vars["CellData"] = await page.locator("(//tr[$|RowsCount|]//td)[$|ColumnCount|]").textContent() || '';
          if (String(vars["CellData"]).includes(String("+"))) {
            await page.locator("//div[@id=\"page-footer\"]//span[contains(text(),\"Queued For\")]").click();
            await page.locator("(//tr[$|RowsCount|]//td)[$|ColumnCount|]").hover();
            vars["CellDataPopup"] = await bidRequestDetailsPage.Tool_Tip_Text.textContent() || '';
            vars["CellData"] = String(vars["CellDataPopup"]) + "," + String(vars["CellData"]);
          }
        }
      }
    }
  }
}

/**
 * Step Group: Verifying Footer Queued and Submission date for next bussiness day
 * ID: 1300
 * Steps: 16
 */
export async function stepGroup_Verifying_Footer_Queued_and_Submission_date_for_next_bussine(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentESTDate"]);
  vars["CurrentEstPlusOneMin"] = (() => {
    const d = new Date('2000-01-01 ' + String(vars["CurrentEstTime"]));
    d.setMinutes(d.getMinutes() + parseInt(String("1")));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
  })();
  vars["CurrentEstUnitAfterAddition"] = String(vars["CurrentEstPlusOneMin"]).substring(6);
  vars["CurrentEstHourMinAfterAddition"] = String(vars["CurrentEstPlusOneMin"]).substring(0, String(vars["CurrentEstPlusOneMin"]).length - 3);
  vars["CurrentEstTimeUnit"] = String(vars["CurrentEstTime"]).substring(6);
  vars["CurrentEstHourMin"] = String(vars["CurrentEstTime"]).substring(0, String(vars["CurrentEstTime"]).length - 3);
  if (true) /* Verify that the element Footer Submission Date displays text */ {
    await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentEstTimeUnit"]);
  } else {
    await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentEstHourMinAfterAddition"]);
    await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentEstUnitAfterAddition"]);
  }
  await expect(page.locator("//div[@id=\"page-footer\"]//span[contains(text(),\"Queued For\")]")).toContainText(vars["NextBusinessDate"]);
  vars[""] = (() => {
    const d = new Date('2000-01-01 ' + String(''));
    d.setMinutes(d.getMinutes() - parseInt(String('')));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  })();
  await expect(page.locator("//div[@id=\"page-footer\"]//span[contains(text(),\"Queued For\")]")).toContainText(vars["SelectedBatchTimeWithoutBuffer"]);
  await expect(page.locator("//div[@id=\"page-footer\"]//span[contains(text(),\"Queued For\")]")).toContainText("ET");
  await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText("ET");
}

/**
 * Step Group: Verify Footer Submission and Queued Date For Today in Bid Request details
 * ID: 1308
 * Steps: 21
 */
export async function stepGroup_Verify_Footer_Submission_and_Queued_Date_For_Today_in_Bid_Re(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentESTDate"]);
  vars["CurrentEstPlusOneMin"] = (() => {
    const d = new Date('2000-01-01 ' + String(vars["CurrentEstTime"]));
    d.setMinutes(d.getMinutes() + parseInt(String("1")));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
  })();
  vars["CurrentEstUnitAfterAddition"] = String(vars["CurrentEstPlusOneMin"]).substring(6);
  vars["CurrentEstHourMinAfterAddition"] = String(vars["CurrentEstPlusOneMin"]).substring(0, String(vars["CurrentEstPlusOneMin"]).length - 3);
  vars[""] = (() => {
    const d = new Date('2000-01-01 ' + String(''));
    d.setMinutes(d.getMinutes() - parseInt(String('')));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  })();
  vars["CurrentEstTimeUnitMinus1"] = String(vars["CurrentEstTime"]).substring(6);
  vars["CurrentEstHourMinMinus1"] = String(vars["CurrentEstTime"]).substring(0, String(vars["CurrentEstTime"]).length - 3);
  vars["CurrentEstTimeUnit"] = String(vars["CurrentEstTime"]).substring(6);
  vars["CurrentEstHourMin"] = String(vars["CurrentEstTime"]).substring(0, String(vars["CurrentEstTime"]).length - 3);
  if (true) /* Verify that the element Footer Submission Date displays text */ {
    await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentEstTimeUnit"]);
  } else if (true) /* Verify that the element Footer Submission Date displays text */ {
    await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentEstTimeUnitMinus1"]);
  } else {
    await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentEstHourMinAfterAddition"]);
    await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText(vars["CurrentEstUnitAfterAddition"]);
  }
  await expect(page.locator("//div[@id=\"page-footer\"]//span[contains(text(),\"Queued For\")]")).toContainText(vars["CurrentESTDate"]);
  vars[""] = (() => {
    const d = new Date('2000-01-01 ' + String(''));
    d.setMinutes(d.getMinutes() - parseInt(String('')));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  })();
  await expect(page.locator("//div[@id=\"page-footer\"]//span[contains(text(),\"Queued For\")]")).toContainText(vars["SelectedBatchTimeWithoutBuffer"]);
  await expect(bidRequestDetailsPage.Footer_Submission_Date).toContainText("ET");
  await expect(page.locator("//div[@id=\"page-footer\"]//span[contains(text(),\"Queued For\")]")).toContainText("ET");
}

/**
 * Step Group: Fetching Second Table data in bid requests details and storing into tdp
 * ID: 1314
 * Steps: 25
 */
export async function stepGroup_Fetching_Second_Table_data_in_bid_requests_details_and_stori(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  vars["ExecutionTypeHeaderBeforeSubmit"] = await page.locator("(//div[text()=\" Execution Type \"]/..//h5)[1]").textContent() || '';
  vars["BidValueHeaderBeforeSubmit"] = await bidRequestDetailsPage.Bid_Value_From_Table_Header1.textContent() || '';
  vars["TotalloansHeaderBeforeSubmit"] = await page.locator("(//h5[@aria-labelledby=\"totalLoanRowsLabel\"]//span[contains(@aria-label,\"Total Loans\")])[1]").textContent() || '';
  vars["SuccessLoansHeaderBeforeSubmit"] = await page.locator("(//h5[@aria-labelledby=\"totalLoanRowsLabel\"]//span[contains(@aria-label,\"Successful Loans\")])[1]").textContent() || '';
  vars["ErrorredLoansHeaderBeforeSubmit"] = await page.locator("(//h5[@aria-labelledby=\"totalLoanRowsLabel\"]//span[contains(@aria-label,\"Errored Loans\")])[1]").textContent() || '';
  vars["TotalRowsCount"] = String(await page.locator("(//table)[1]//tbody//tr").count());
  vars["RowsCount"] = "1";
  while (parseFloat(String(vars["RowsCount"])) <= parseFloat(String(vars["TotalRowsCount"]))) {
    vars["ColumnCount"] = "1";
    while (parseFloat(String(vars["ColumnCount"])) <= parseFloat(String("7"))) {
      await bidRequestDetailsPage.Bid_Request_Details_Text.click();
      vars["CellData"] = await page.locator("(//tr[$|RowsCount|]//td)[$|ColumnCount|]").textContent() || '';
      for (let dataIdx = parseInt(vars["RowsCount"]); dataIdx <= parseInt(vars["RowsCount"]); dataIdx++) {
        if (String(vars["ColumnCount"]) === String("1")) {
          // Write to test data profile: "Loan Number" = vars["CellData"]
          // TODO: Test data profile writes need custom implementation
        } else if (String(vars["ColumnCount"]) === String("2")) {
          // Write to test data profile: "Last Name" = vars["CellData"]
          // TODO: Test data profile writes need custom implementation
        } else if (String(vars["ColumnCount"]) === String("3")) {
          // Write to test data profile: "LoanAmount" = vars["CellData"]
          // TODO: Test data profile writes need custom implementation
        } else if (String(vars["ColumnCount"]) === String("4")) {
          // Write to test data profile: "Program" = vars["CellData"]
          // TODO: Test data profile writes need custom implementation
        } else if (String(vars["ColumnCount"]) === String("5")) {
          // Write to test data profile: "Loan Status" = vars["CellData"]
          // TODO: Test data profile writes need custom implementation
        } else if (String(vars["ColumnCount"]) === String("6")) {
          if (String(vars["CellData"]).includes(String("+"))) {
          }
        }
      }
    }
  }
}

/**
 * Step Group: Verifying Second Table loan details On popup(Bid Request Details)
 * ID: 1320
 * Steps: 16
 */
export async function stepGroup_Verifying_Second_Table_loan_details_On_popupBid_Request_Deta(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await expect(page.locator("(//h5[@aria-labelledby=\"bidRequestIdLabel\"])[1]")).not.toContainText(vars["RequestIdPopupBeforeSubmit"]);
  await expect(page.locator("(//h5[@aria-labelledby=\"bidRequestIdLabel\"])[2]")).toContainText(vars["LoanNumberPopUpBeforeSubmit"]);
  await expect(bidRequestDetailsPage.Errors_Check_On_Laon_Details_Popup).toContainText(vars["ErrorsCheckPopupBeforeSubmit"]);
  vars["ChaseFieldCountPopup"] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["ChaseFieldCountPopup"]))) {
    await page.locator("(//h5[@aria-labelledby=\"bidRequestIdLabel\"])[1]").click();
    vars["ChaseFieldPopupAfterSubmit"] = await page.locator("(//div[@class=\"border-bottom p-2\"])[$|count|]").textContent() || '';
    vars["ChaseValuePopupAfterSubmit"] = await page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"$|ChaseFieldPopupAfterSubmit|\")]/following-sibling::div)[1]").textContent() || '';
    for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
      await expect(page.locator("(//div[@class=\"border-bottom p-2\"])[$|count|]")).toContainText(testData["ChaseFieldNameBeforeSubmit"]);
      if (String(vars["ChaseValuePopupAfterSubmit"]) === String("Key_blank")) {
        expect(String(testData["ChaseValueBeforeSubmit"])).toBe("Null");
      } else {
        await expect(page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"$|ChaseFieldPopupAfterSubmit|\")]/following-sibling::div)[1]")).toContainText(testData["ChaseValueBeforeSubmit"]);
      }
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}

/**
 * Step Group: Uploading Bid Request(New)
 * ID: 1323
 * Steps: 21
 */
export async function stepGroup_Uploading_Bid_RequestNew(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//div[text()[normalize-space() = \"Select\"]]").click();
  await page.locator("(//div[@class=\"mb-0 overflow-hidden\"])[1]/../..//input[@placeholder=\"Search\"]").fill(testData["Company Name"]);
  await page.locator("(//span[contains(@class,'pl-2')])[1]").click();
  await expect(page.locator("(//span[contains(@class,'pl-2')])[1]")).toContainText(testData["Company Name"]);
  await page.locator("//label[text()=\"Standard\"]/..//input[@type=\"checkbox\"]").waitFor({ state: 'visible' });
  await expect(page.locator("//label[text()=\"Standard\"]/..//input[@type=\"checkbox\"]")).toBeVisible();
  await page.locator("(//select[contains(normalize-space(),\"Select 3 7 15\")])[1]").selectOption({ label: "3" });
  await expect(page.locator("(//option[@value=\"3\"])[1]/../..//select[@aria-label=\"Dropdown selection\"]")).toHaveValue("3");
  await page.locator("//div[text()[normalize-space() = \"Select Mapping\"]]").click();
  await page.locator("//div[contains(@class, 'shadow') and contains(@class, 'dropdown-menu') and contains(@class, 'show')]//input[@placeholder=\"Search\"]").fill(testData["BidMappingID"]);
  await page.locator("//span[text()[normalize-space() =\"Deepika Aug1\"]]").click();
  await expect(page.locator("//button//div[text()=' @|BidMappingID| ']")).toContainText(testData["BidMappingID"]);
  await expect(correspondentPortalPage.Bid_Request_Date).toBeEnabled();
  await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").click();
  await page.locator("//option[contains(text(),\"$|BulkBatchTiming|\")]").scrollIntoViewIfNeeded();
  await expect(page.locator("//option[contains(text(),\"$|BulkBatchTiming|\")]")).toBeVisible();
  await page.locator("//option[contains(text(),\"$|BulkBatchTiming|\")]").click();
  await expect(page.getByText("Drag and drop files here or click to browse. Allowed formats: .xls,.xlsx,.csv,.txt")).toBeVisible();
  await page.locator("(//input[@type=\"file\"])[1]").setInputFiles(path.resolve(__dirname, 'test-data', "Bid_Valid_file.xlsx"));
  await expect(page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]").click();
}

/**
 * Step Group: Modifying The batch Intervals with current est time
 * ID: 1324
 * Steps: 14
 */
export async function stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//button[text()[normalize-space() = \"Modify Batch Intervals\"]]").click();
  await expect(page.getByText("Edit Batch Timing")).toBeVisible();
  vars["CurrentTime"] = (() => {
    const d = new Date();
    //const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "hh:mm a";
    // Map Java date format to Intl parts
    const opts: Intl.DateTimeFormatOptions = { timeZone: "America/New_York" };
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  await stepGroup_Separating_Hours_and_minutes_In_time_Current_EST_time(page, vars);
  await page.locator("//span[text()[normalize-space() = \"H\"]]/preceding-sibling::input[@placeholder=\"0\"]").fill(vars["Time_Hour"]);
  await page.locator("(//input[@placeholder=\"00\"])[1]").fill(vars["Time_Min"]);
  await stepGroup_selecting_time_unit_bulk_batch(page, vars);
  await page.locator("//div[text()[normalize-space() = \"Time Interval\"]]/following-sibling::div[contains(@class, 'custom-input')]//input[@placeholder=\"0\"]").fill(testData["Time Interval"]);
  await correspondentPortalPage.No_Of_Batches.fill(testData["NO of Batches"]);
  await expect(page.locator("(//input[@type=\"radio\"])[1]")).toBeEnabled();
  await page.locator("//span[text()[normalize-space() = \"Modify Batch\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//div[text()[normalize-space() = \"Modified batch timings successfully\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Ok\"]]").click();
}

/**
 * Step Group: Separating Hours and minutes In time (Current EST time)
 * ID: 1325
 * Steps: 4
 */
export async function stepGroup_Separating_Hours_and_minutes_In_time_Current_EST_time(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["MinWithStandard"] = String(vars["CurrentTime"]).split(":")["2"] || '';
  vars["Time_Hour"] = String(vars["CurrentTime"]).substring(0, String(vars["CurrentTime"]).length - 6);
  vars["Time_Min"] = String(vars["MinWithStandard"]).substring(0, String(vars["MinWithStandard"]).length - 3);
  vars["Time_Unit"] = String(vars["MinWithStandard"]).substring(3);
}

/**
 * Step Group: Verifying the bidsample to bidtape mapping in Enumpage from tdp
 * ID: 1353
 * Steps: 20
 */
export async function stepGroup_Verifying_the_bidsample_to_bidtape_mapping_in_Enumpage_from_(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const enumerationMappingPage = new EnumerationMappingPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  vars["count1"] = "1";
  vars["EnumFieldsCount"] = String(await enumerationMappingPage.Chase_Enum_Names.count());
  while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["EnumFieldsCount"]))) {
    for (let dataIdx = parseInt(vars["count1"]); dataIdx <= parseInt(vars["count1"]); dataIdx++) {
      vars["IndividualBidSampleName"] = await page.locator("(//div[@class=\"my-2\"])[$|count1|]/ancestor::div[contains(@class,\"mapping-card\")]//div[@class=\"col-2\"]//div[not(contains(@class,\"my-2\"))]").textContent() || '';
      expect(String(vars["IndividualBidSampleName"])).toBe(testData["EnumBidSampleNames"]);
      vars["ColumnHeader"] = vars["IndividualBidSampleName"];
      if (true) /* Element BidTapeFieldCountForBidField is not visible */ {
        vars["IndividualBidTapeValue"] = "No BidTape";
      } else {
        vars["IndividualBidTapeValue"] = "Sample";
        vars["BidTapeCount"] = String(await page.locator("//div[text()=\"$|ColumnHeader|\" and not(@class=\"my-2\")]/../..//div[contains(@class,\"input-field-name\")]").count());
        vars["count2"] = "1";
        while (parseFloat(String(vars["count2"])) <= parseFloat(String(vars["BidTapeCount"]))) {
          vars["BidTapeValue"] = await page.locator("(//div[text()=\"$|ColumnHeader|\" and not(@class=\"my-2\")]/../..//div[contains(@class,\"input-field-name\")])[$|count2|]").textContent() || '';
          vars["IndividualBidTapeValue"] = String(vars["BidTapeValue"]) + "," + String(vars["IndividualBidTapeValue"]);
          vars["count2"] = (parseFloat(String("1")) + parseFloat(String(vars["count2"]))).toFixed(0);
      // [DISABLED] Write value IndividualBidTapeValue to BidSampleNamesWithBidTapeValues(EnumPage) column EnumBidTapeValues
      // // Write to test data profile: "EnumBidTapeValues" = vars["IndividualBidTapeValue"]
      // // TODO: Test data profile writes need custom implementation
        }
      }
      expect(String(vars["IndividualBidTapeValue"])).toBe(testData["EnumBidTapeValues"]);
      vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
    }
  }
}

/**
 * Step Group: Verifying the Mapping of ChaseField and ChaseValues in Enum Page
 * ID: 1358
 * Steps: 24
 */
export async function stepGroup_Verifying_the_Mapping_of_ChaseField_and_ChaseValues_in_Enum_(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const enumerationMappingPage = new EnumerationMappingPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  vars["count1"] = "1";
  vars["ChaseFieldsCountEnum"] = String(await enumerationMappingPage.Chase_Enum_Names.count());
  while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["ChaseFieldsCountEnum"]))) {
    await page.locator("(//input[@type=\"checkbox\" and @class=\"mapping-select mt-1\"])[1]").check();
    await page.locator("(//input[@type=\"checkbox\" and @class=\"mapping-select mt-1\"])[1]").uncheck();
    for (let dataIdx = parseInt(vars["count1"]); dataIdx <= parseInt(vars["count1"]); dataIdx++) {
      vars["IndividualChaseFieldName"] = await page.locator("(//div[@class=\"my-2\"])[$|count1|]").textContent() || '';
      expect(String(testData["ChaseFieldName"])).toBe(vars["IndividualChaseFieldName"]);
      if (true) /* Element ChaseValues Corresponding to Chase Field is not visi */ {
        vars["IndividualChaseValueofChaseField"] = "No ChaseValue";
      } else {
        vars["IndividualChaseValueofChaseField"] = "Sample";
        vars["ChaseValuesOfChaseFieldCount"] = String(await page.locator("(//div[@class=\"my-2\" and text()=\"$|IndividualChaseFieldName|\"]/..//following-sibling::div)//div[@class=\"mb-2\"]").count());
        vars["count2"] = "1";
        while (parseFloat(String(vars["count2"])) <= parseFloat(String(vars["ChaseValuesOfChaseFieldCount"]))) {
          vars["TagName"] = await page.locator("((//div[@class=\"my-2\" and text()=\"$|IndividualChaseFieldName|\"]/..//following-sibling::div)//div[@class=\"mb-2\"]//*[contains(@class,\"form-control p-0\") or contains(@class,\"form-select\")])[$|count2|]").evaluate(el => (el as HTMLElement).tagName);
          if (String(vars["TagName"]) === String("select")) {
            vars["ChaseValue"] = await page.locator("((//div[@class=\"my-2\" and text()=\"$|IndividualChaseFieldName|\"]/..//following-sibling::div)//div[@class=\"mb-2\"]//*[contains(@class,\"form-control p-0\") or contains(@class,\"form-select\")])[$|count2|]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
          } else {
            vars["ChaseValue"] = await page.locator("((//div[@class=\"my-2\" and text()=\"$|IndividualChaseFieldName|\"]/..//following-sibling::div)//div[@class=\"mb-2\"]//*[contains(@class,\"form-control p-0\") or contains(@class,\"form-select\")])[$|count2|]").textContent() || '';
          }
          vars["IndividualChaseValueofChaseField"] = String(vars["ChaseValue"]) + "," + String(vars["IndividualChaseValueofChaseField"]);
          vars["count2"] = (parseFloat(String("1")) + parseFloat(String(vars["count2"]))).toFixed(0);
        }
      }
      expect(String(vars["IndividualChaseValueofChaseField"])).toBe(testData["Chase Value"]);
    }
    vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
  }
}

/**
 * Step Group: Deleting Early Config Report If Present
 * ID: 1362
 * Steps: 18
 */
export async function stepGroup_Deleting_Early_Config_Report_If_Present(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const earlyConfigPage = new EarlyConfigPage(page);
  await expect(page.locator("//span[text()[normalize-space() = \"Administration\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//a[@aria-label=\"General Settings\"]//span[text()=\"General Settings\"]").click();
  await correspondentPortalPage.Early_Close_Config.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//button[text()[normalize-space() = \"Add New\"]]")).toBeVisible();
  if (true) /* Verify that the element Early Close Config Rows displays tex */ {
  } else {
    if (true) /* Element Early Close Config Rows is visible */ {
      vars["TotalRowsInEarlyCloseConfig"] = String(await page.locator("(//table//tr[@role=\"row\"])[position() >1 and position() <= last()]").count());
      vars["count"] = "1";
      while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalRowsInEarlyCloseConfig"]))) {
        await earlyConfigPage.Delete_Option_Field.hover();
        await expect(earlyConfigPage.Delete_Option_Field).toBeVisible();
        await earlyConfigPage.Delete_Option_Field.click();
        await correspondentPortalPage.Yes_Delete_ButtonEarly_config.click();
        await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
        vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
      }
    }
  }
}

/**
 * Step Group: Storing BidSample and BidTape Values from Enum Page with Mapping and writing into TDP
 * ID: 1364
 * Steps: 18
 */
export async function stepGroup_Storing_BidSample_and_BidTape_Values_from_Enum_Page_with_Map(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["count1"] = "1";
  while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["EnumFieldsCount"]))) {
    vars["IndividualBidSampleName"] = await page.locator("(//div[@class=\"my-2\"])[$|count1|]/ancestor::div[contains(@class,\"mapping-card\")]//div[@class=\"col-2\"]//div[not(contains(@class,\"my-2\"))]").textContent() || '';
    vars["ColumnHeader"] = vars["IndividualBidSampleName"];
    for (let dataIdx = parseInt(vars["count1"]); dataIdx <= parseInt(vars["count1"]); dataIdx++) {
      // Write to test data profile: "EnumBidSampleNames" = vars["IndividualBidSampleName"]
      // TODO: Test data profile writes need custom implementation
      if (true) /* Element BidTapeFieldCountForBidField is not visible */ {
        vars["IndividualBidTapeValue"] = "No BidTape";
      } else {
        vars["IndividualBidTapeValue"] = "Sample";
        vars["BidTapeCount"] = String(await page.locator("//div[text()=\"$|ColumnHeader|\" and not(@class=\"my-2\")]/../..//div[contains(@class,\"input-field-name\")]").count());
        vars["count2"] = "1";
        while (parseFloat(String(vars["count2"])) <= parseFloat(String(vars["BidTapeCount"]))) {
          vars["BidTapeValue"] = await page.locator("(//div[text()=\"$|ColumnHeader|\" and not(@class=\"my-2\")]/../..//div[contains(@class,\"input-field-name\")])[$|count2|]").textContent() || '';
          vars["IndividualBidTapeValue"] = String(vars["BidTapeValue"]) + "," + String(vars["IndividualBidTapeValue"]);
          vars["count2"] = (parseFloat(String("1")) + parseFloat(String(vars["count2"]))).toFixed(0);
        }
      }
      // Write to test data profile: "EnumBidTapeValues" = vars["IndividualBidTapeValue"]
      // TODO: Test data profile writes need custom implementation
      vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
    }
  }
}

/**
 * Step Group: Storing Values from map header screen 
 * ID: 1365
 * Steps: 5
 */
export async function stepGroup_Storing_Values_from_map_header_screen(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["SelectedCompanyCount"] = String(await page.locator("//label[text()=\"Select Company/s\"]/..//div[@class=\"pill rounded-pill relative\"]").count());
  vars["SelectedCompanyName"] = await page.locator("//label[text()=\"Select Company/s\"]/..//div[@class=\"pill rounded-pill relative\"]//span").textContent() || '';
  vars["BidMapName"] = vars["BidMap"];
  vars["ExecutionType"] = await page.locator("//label[text()=\"Execution Type\"]/..//select").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  vars["UploadedFileName"] = await page.locator("//label[text()=\"Upload File\"]/..//div[contains(@class,\"text-truncate flex-grow-1\")]").textContent() || '';
}

/**
 * Step Group: Storing Chase Field and Chase Value from Enum Page With Mapping
 * ID: 1366
 * Steps: 24
 */
export async function stepGroup_Storing_Chase_Field_and_Chase_Value_from_Enum_Page_With_Mapp(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const enumerationMappingPage = new EnumerationMappingPage(page);
  vars["count1"] = "1";
  vars["ChaseFieldsCountEnum"] = String(await enumerationMappingPage.Chase_Enum_Names.count());
  while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["ChaseFieldsCountEnum"]))) {
    await page.locator("(//input[@type=\"checkbox\" and @class=\"mapping-select mt-1\"])[1]").check();
    await page.locator("(//input[@type=\"checkbox\" and @class=\"mapping-select mt-1\"])[1]").uncheck();
    for (let dataIdx = parseInt(vars["count1"]); dataIdx <= parseInt(vars["count1"]); dataIdx++) {
      vars["IndividualChaseFieldName"] = await page.locator("(//div[@class=\"my-2\"])[$|count1|]").textContent() || '';
      // Write to test data profile: "ChaseFieldName" = vars["IndividualChaseFieldName"]
      // TODO: Test data profile writes need custom implementation
      if (true) /* Element ChaseValues Corresponding to Chase Field is not visi */ {
        // Write to test data profile: "Chase Value" = "No ChaseValue"
        // TODO: Test data profile writes need custom implementation
      } else {
        vars["IndividualChaseValueofChaseField"] = "Sample";
        vars["ChaseValuesOfChaseFieldCount"] = String(await page.locator("(//div[@class=\"my-2\" and text()=\"$|IndividualChaseFieldName|\"]/..//following-sibling::div)//div[@class=\"mb-2\"]").count());
        vars["count2"] = "1";
        vars["TagName"] = await page.locator("((//div[@class=\"my-2\" and text()=\"$|IndividualChaseFieldName|\"]/..//following-sibling::div)//div[@class=\"mb-2\"]//*[contains(@class,\"form-control p-0\") or contains(@class,\"form-select\")])[$|count2|]").evaluate(el => (el as HTMLElement).tagName);
        while (parseFloat(String(vars["count2"])) <= parseFloat(String(vars["ChaseValuesOfChaseFieldCount"]))) {
          if (String(vars["TagName"]).includes(String("select"))) {
            vars["ChaseValue"] = await page.locator("((//div[@class=\"my-2\" and text()=\"$|IndividualChaseFieldName|\"]/..//following-sibling::div)//div[@class=\"mb-2\"]//*[contains(@class,\"form-control p-0\") or contains(@class,\"form-select\")])[$|count2|]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
          } else {
            vars["ChaseValue"] = await page.locator("((//div[@class=\"my-2\" and text()=\"$|IndividualChaseFieldName|\"]/..//following-sibling::div)//div[@class=\"mb-2\"]//*[contains(@class,\"form-control p-0\") or contains(@class,\"form-select\")])[$|count2|]").textContent() || '';
          }
          vars["IndividualChaseValueofChaseField"] = String(vars["ChaseValue"]) + "," + String(vars["IndividualChaseValueofChaseField"]);
          vars["count2"] = (parseFloat(String("1")) + parseFloat(String(vars["count2"]))).toFixed(0);
        }
        // Write to test data profile: "Chase Value" = vars["IndividualChaseValueofChaseField"]
        // TODO: Test data profile writes need custom implementation
      }
    }
    vars["count1"] = (parseFloat(String("1")) + parseFloat(String(vars["count1"]))).toFixed(0);
  }
}

/**
 * Step Group: Getting Next Month From Current Month
 * ID: 1384
 * Steps: 7
 */
export async function stepGroup_Getting_Next_Month_From_Current_Month(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["CurrentMonth"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata" };
    const fmt = "MM";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  if (String(vars["CurrentMonth"]) === String("12")) {
    vars["NextMonth"] = "1";
  } else {
    vars["NextMonth"] = (parseFloat(String(vars["CurrentMonth"])) + parseFloat(String("1"))).toFixed(0);
  }
  if (String("1,2,3,4,5,6,7,8,9").includes(String(vars["NextMonth"]))) {
    vars["NextMonth"] = String('') + String('');
  }
}

/**
 * Step Group: Verifying the Time Count Down In Price Offered Details Screen
 * ID: 1431
 * Steps: 20
 */
export async function stepGroup_Verifying_the_Time_Count_Down_In_Price_Offered_Details_Scree(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("//button[text()[normalize-space() = \"Get Price\"]]").click();
  await page.locator("//div[text()=\"Remaining Time\"]/..//h5").waitFor({ state: 'visible' });
  vars["RemainingTime"] = await page.locator("//div[text()=\"Remaining Time\"]/..//h5").textContent() || '';
  vars["RemainingTime"] = String(vars["RemainingTime"]).trim();
  vars["MinSettings"] = vars["MinutesSettings"];
  vars["startMin"] = (parseFloat(String(vars["MinSettings"])) - parseFloat(String("1"))).toFixed(0);
  vars["MinTimePriceOffered"] = String(vars["RemainingTime"]).split(":")["1"] || '';
  vars["ExpectedMinTime"] = String(vars["MinSettings"]) + String("m");
  vars["ExpectedMinTimeMinus1"] = String(vars["startMin"]) + String("m");
  vars["SecondsTimePriceOffered"] = String(vars["RemainingTime"]).split(":")["2"] || '';
  vars["FirstDigitSeconds"] = String(vars["SecondsTimePriceOffered"]).substring(0, String(vars["SecondsTimePriceOffered"]).length - 2);
  vars["SecondDigitSeconds"] = String(vars["SecondsTimePriceOffered"]).substring(1, String(vars["SecondsTimePriceOffered"]).length - 1);
  vars["CharSeconds"] = String(vars["SecondsTimePriceOffered"]).substring(2);
  if (String(vars["MinTimePriceOffered"]) === String(vars["ExpectedMinTime"])) {
    expect(String(vars["FirstDigitSeconds"])).toBe("0");
    expect(String(vars["SecondDigitSeconds"])).toBe("0");
  } else {
    expect(String(vars["MinTimePriceOffered"])).toBe(vars["ExpectedMinTimeMinus1"]);
    expect(String(vars["FirstDigitSeconds"])).toBe("5");
  }
  // TODO: Regex verification with empty pattern
  // Action: Verify if the text RemainingTime matches the pattern ^\d+m:\d{2}s$
}

/**
 * Step Group: Unique Loan Number Check In Price Offered Screen
 * ID: 1443
 * Steps: 7
 */
export async function stepGroup_Unique_Loan_Number_Check_In_Price_Offered_Screen(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["count"] = "1";
  vars["EnabledLoansCount"] = String(await page.locator("//button[contains(@aria-label,\"View loan details\")]").count());
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["EnabledLoansCount"]))) {
    vars["CurrentLoanNumber"] = await page.locator("(//button[contains(@aria-label,\"View loan details\")])[$|count|]").textContent() || '';
    vars["RemainingLoanNumbers"] = (await page.locator("(//button[contains(@aria-label,\"View loan details\")])[not(position()=$|count|)]").allTextContents()).join(', ');
    expect(String(vars["RemainingLoanNumbers"])).not.toContain(String(vars["CurrentLoanNumber"]));
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}

/**
 * Step Group: Uploading bid for American Pacific Company
 * ID: 1445
 * Steps: 25
 */
export async function stepGroup_Uploading_bid_for_American_Pacific_Company(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  await stepGroup_Login_to_CORR_Portal(page, vars);
  await stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
  await stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
  await stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
  await stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
  await stepGroup_Uploading_Bid_Request(page, vars);
  await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").selectOption({ index: parseInt("2") });
  vars["ExtractedPrincingReturnTime"] = await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  await page.locator("(//input[@type=\"file\"])[1]").setInputFiles([]);
  await expect(page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
  await page.locator("//span[text()=\"Continue\"]/..").waitFor({ state: 'visible' });
  await page.locator("//span[text()=\"Continue\"]/..").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  vars["RequestIDDetails"] = await page.locator("//div[text()=\"Request ID\"]/..//h5").textContent() || '';
  vars["RequestIDDetails"] = String(vars["RequestIDDetails"]).trim();
  await expect(page.locator("//div[text()=\"Status\"]/..//h5")).toContainText("Ready for Pricing");
  vars["QueuedDateTime"] = await bidRequestDetailsPage.Queued_Forbid_request_details_text_dark.textContent() || '';
  vars["ExtractedDateTime"] = String('').split("")["3"] || '';
  vars["QueuedTime"] = vars["ExtractedDateTime"];
  vars["CurrentEstTime"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-04:00" };
    const fmt = "hh:mm ";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["TimeDifference"] = Math.abs(new Date('2000-01-01 ' + String(vars["QueuedTime"])).getTime() - new Date('2000-01-01 ' + String(vars["CurrentEstTime"])).getTime()) / 60000 + '';
  if (String(vars["TimeDifference"]) > String("4")) {
  }
}

/**
 * Step Group: Price offered Details Screen Verification (Price details and Current Market Values)
 * ID: 1453
 * Steps: 25
 */
export async function stepGroup_Price_offered_Details_Screen_Verification_Price_details_and_(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["CurrentMarketValue"] = await page.locator("//div[@id=\"price-offered-details-header\"]//div/div[text()=\"Current Market\"]/..//h5").textContent() || '';
  vars["CurrentMarketValue"] = String(vars["CurrentMarketValue"]).trim();
  // TODO: Regex verification with empty pattern
  // Action: Verify if the text CurrentMarketValue matches the pattern ^\d+\.\d{3}$
  vars["CurrentMarketDiffValue"] = await page.locator("//div[@id=\"price-offered-details-header\"]//div/div[text()=\"Current Market Diff\"]/..//h5").textContent() || '';
  vars["CurrentMarketDiffValue"] = String(vars["CurrentMarketDiffValue"]).trim();
  // TODO: Regex verification with empty pattern
  // Action: Verify if the text CurrentMarketDiffValue matches the pattern ^[+-]?\d+\.\d{3}$
  vars["count1"] = "1";
  vars["TotalRowsCountValue"] = String(await page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"])[position() >=2 and position()<=last()]").count());
  while (parseFloat(String(vars["count1"])) <= parseFloat(String(vars["TotalRowsCountValue"]))) {
    vars["IntRateValue"] = await page.locator("( //table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Int. Rate\"])[$|count1|]").textContent() || '';
    vars["IntRateValue"] = String(vars["IntRateValue"]).trim();
    // TODO: Regex verification with empty pattern
    // Action: Verify if the text IntRateValue matches the pattern ^\d+\.\d{3}\%$
    vars["RefSecPriceValue"] = await page.locator("( //table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Ref Sec Price\"]/div)[$|count1|]").textContent() || '';
    vars["RefSecPriceValue"] = String(vars["RefSecPriceValue"]).trim();
    // TODO: Regex verification with empty pattern
    // Action: Verify if the text RefSecPriceValue matches the pattern ^\d+\.\d{3}$
    vars["GrossPriceValue"] = await page.locator("( //table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Gross Price\"]/div)[$|count1|]").textContent() || '';
    vars["GrossPriceValue"] = String(vars["GrossPriceValue"]).trim();
    // TODO: Regex verification with empty pattern
    // Action: Verify if the text GrossPriceValue matches the pattern ^\d+\.\d{3}$
    vars["HedgeRatioValue"] = await page.locator("( //table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Hedge Ratio\"]/div)[$|count1|]").textContent() || '';
    vars["HedgeRatioValue"] = String(vars["HedgeRatioValue"]).trim();
    // TODO: Regex verification with empty pattern
    // Action: Verify if the text HedgeRatioValue matches the pattern ^\d+\.\d{3}$
    vars["MarkAdjValue"] = await page.locator(" (//table//td[@data-title=\"Mark Adj\"])[$|count1|]").textContent() || '';
    vars["MarkAdjValue"] = String(vars["MarkAdjValue"]).trim();
    // TODO: Regex verification with empty pattern
    // Action: Verify if the text MarkAdjValue matches the pattern ^[+-]?\d+\.\d{3}$
    vars["CurrGrossValue"] = await page.locator(" (//table//td[@data-title=\"Curr Gross\"])[$|count1|]").textContent() || '';
  }
}

/**
 * Step Group: Editing the Chase Users Time Under General Settings
 * ID: 1454
 * Steps: 6
 */
export async function stepGroup_Editing_the_Chase_Users_Time_Under_General_Settings(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  vars["MinutesSettings"] = await correspondentPortalPage.Internal_User_Minutes_Input.inputValue() || '';
  vars["NewMinToEnter"] = String(Math.floor(Math.random() * (4 - 1 + 1)) + 1);
  while (String(vars["NewMinToEnter"]) === String(vars["MinutesSettings"])) {
    vars["NewMinToEnter"] = String(Math.floor(Math.random() * (4 - 1 + 1)) + 1);
  }
  await correspondentPortalPage.Internal_User_Minutes_Input.clear();
  await correspondentPortalPage.Internal_User_Minutes_Input.fill(vars["NewMinToEnter"]);
}

/**
 * Step Group: Commits an Fresh Loan Num Chase Direct
 * ID: 1471
 * Steps: 10
 */
export async function stepGroup_Commits_an_Fresh_Loan_Num_Chase_Direct(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestPage = new BidRequestPage(page);
  const commitmentListPage = new CommitmentListPage(page);
  await page.locator("//td[@data-title=\"Execution Type\"]//div[contains(text(),\"CHASE_DIRECT\")]//ancestor::tr//td[@data-title=\"Bid Req. ID\"]//a[contains(@aria-label,\"View details for\")]").click();
  await bidRequestPage.First_CheckboxData.check();
  await page.locator("//button[normalize-space(text())=\"Get Price\"]").click();
  await commitmentListPage.Uncommit_Selected_Button.waitFor({ state: 'visible' });
  await expect(commitmentListPage.Uncommit_Selected_Button).toBeEnabled();
  await commitmentListPage.Uncommit_Selected_Button.click();
  await page.locator("//span[text()=\"Yes, Commit\"]//parent::button").click();
  await page.locator("//span[text()=\"Yes, Commit\"]//parent::button").waitFor({ state: 'hidden' });
  await page.locator("//button[contains(text(),\"Okay\")]").waitFor({ state: 'visible' });
  await page.locator("//button[contains(text(),\"Okay\")]").click();
}

/**
 * Step Group: Uploading New Bid Request (Bid Request Screen)
 * ID: 1476
 * Steps: 14
 */
export async function stepGroup_Uploading_New_Bid_Request_Bid_Request_Screen(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestPage = new BidRequestPage(page);
  await stepGroup_Uploading_Bid_Request(page, vars);
  if (true) /* Element Enabled Time New is visible */ {
    await page.locator("(//option[@aria-disabled=\"false\"])").scrollIntoViewIfNeeded();
    await page.locator("(//option[@aria-disabled=\"false\"])").click();
  } else {
    await stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
    await stepGroup_Modifying_The_Batch_Intervals_For_one_Hour_Prior(page, vars);
    await stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
    await stepGroup_Uploading_Bid_Request(page, vars);
    await bidRequestPage.Enabled_Time.scrollIntoViewIfNeeded();
    await bidRequestPage.Enabled_Time.click();
  }
  await page.locator("(//input[@type=\"file\"])[1]").setInputFiles(path.resolve(__dirname, 'test-data', "Bid_file_success_error.xlsx"));
  await expect(page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]").click();
}

/**
 * Step Group: Verification of Loan Pop up Details From Locked Loans Tab (Price Offered Screen)
 * ID: 1501
 * Steps: 14
 */
export async function stepGroup_Verification_of_Loan_Pop_up_Details_From_Locked_Loans_Tab_Pr(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  vars["ChaseFieldCountPopup"] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["ChaseFieldCountPopup"]))) {
    await page.locator("//div[text()=\"Bid Loan Number\"]//following-sibling::h5").click();
    vars["ChaseFieldPopupLockedLoans"] = await page.locator("(//div[@class=\"border-bottom p-2\"])[$|count|]").textContent() || '';
    vars["ChaseValuePopupLockedLoans"] = await page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"$|ChaseFieldPopupLockedLoans|\")]/following-sibling::div)[1]").textContent() || '';
    for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
      await expect(page.locator("(//div[@class=\"border-bottom p-2\"])[$|count|]")).toContainText(testData["ChaseFieldName"]);
      if (String(vars["ChaseValuePopupLockedLoans"]) === String("Key_blank")) {
        expect(String(testData["ChaseValue"])).toBe("Null");
      } else {
        await expect(page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"$|ChaseFieldPopupLockedLoans|\")]/following-sibling::div)[1]")).toContainText(testData["ChaseValue"]);
      }
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
  await bidRequestDetailsPage.Close_Button_Loan_Details_Popup.click();
}

/**
 * Step Group: Storing Loan Popup Details From All Loans Tab in to the tdp (Price Offered Screen)
 * ID: 1502
 * Steps: 13
 */
export async function stepGroup_Storing_Loan_Popup_Details_From_All_Loans_Tab_in_to_the_tdp_(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  vars["ChaseFieldCountPopup"] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["ChaseFieldCountPopup"]))) {
    await page.locator("//div[text()=\"Bid Loan Number\"]//following-sibling::h5").click();
    vars["ChaseFieldNamePopupAllLoans"] = await page.locator("(//div[@class=\"border-bottom p-2\"])[$|count|]").textContent() || '';
    vars["ChaseValuePopupAllLoans"] = await page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"$|ChaseFieldNamePopupAllLoans|\")]/following-sibling::div)[1]").textContent() || '';
    if (String(vars["ChaseValuePopupAllLoans"]) === String("Key_blank")) {
      vars["ChaseValuePopupAllLoans"] = "Null";
    }
    for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
      // Write to test data profile: "ChaseFieldName" = vars["ChaseFieldNamePopupAllLoans"]
      // TODO: Test data profile writes need custom implementation
      // Write to test data profile: "ChaseValue" = vars["ChaseValuePopupAllLoans"]
      // TODO: Test data profile writes need custom implementation
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
  await bidRequestDetailsPage.Close_Button_Loan_Details_Popup.click();
}

/**
 * Step Group: Market Threshold
 * ID: 1504
 * Steps: 3
 */
export async function stepGroup_Market_Threshold(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  await page.locator("//td[@role=\"cell\"]//input[@type=\"checkbox\"]//..//..//button[contains(@aria-label,\"Edit Map\")]").click();
  await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.click();
  await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.clear();
}

/**
 * Step Group: If Test case fail
 * ID: 1505
 * Steps: 10
 */
export async function stepGroup_If_Test_case_fail(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  if (true) /* Test Case Result is Failed */ {
    await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
    await page.locator("//a[@aria-label=\"General Settings\"]//span[text()=\"General Settings\"]").click();
    await correspondentPortalPage.Market_Thresholds.click();
    await page.locator("//td[@role=\"cell\"]//input[@type=\"checkbox\"]//..//..//button[contains(@aria-label,\"Edit Map\")]").click();
    await page.locator("//label[text()=\"Min Display Value\"]/..//input[contains(@aria-label,\"Enter minimum display value in percentage\")]").clear();
    await page.locator("//label[text()=\"Min Display Value\"]/..//input[contains(@aria-label,\"Enter minimum display value in percentage\")]").fill("1");
    await page.locator("//label[text()=\"Max Display Value\"]/..//input[contains(@aria-label,\"Enter maximum display value in percentage\")]").clear();
    await page.locator("//label[text()=\"Max Display Value\"]/..//input[contains(@aria-label,\"Enter maximum display value in percentage\")]").fill("120");
    await page.locator("//span[contains(text(),\"Update Threshold\")]").click();
  }
}

/**
 * Step Group: Verification of Loan Popup Details From BidReq Lon Popup
 * ID: 1518
 * Steps: 16
 */
export async function stepGroup_Verification_of_Loan_Popup_Details_From_BidReq_Lon_Popup(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  vars["ChaseFieldCountPopup"] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["ChaseFieldCountPopup"]))) {
    await page.locator("//div[text()=\"Bid Loan Number\"]//following-sibling::h5").click();
    vars["ChaseFieldNamePopup"] = await page.locator("(//div[@class=\"border-bottom p-2\"])[$|count|]").textContent() || '';
    vars["ChaseValuePopup"] = await page.locator("(//div[@class=\"border-bottom p-2\" and normalize-space((text())=\"$|ChaseFieldNamePopup|\")]/following-sibling::div)[1]").textContent() || '';
    for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
      await expect(page.locator("(//div[@class=\"border-bottom p-2\"])[$|count|]")).toContainText(testData["ChaseFieldName"]);
      if (String(vars["ChaseValuePopup"]) === String("Key_blank")) {
        expect(String(testData["ChaseValue"])).toBe("Null");
      } else if (String(vars["ChaseFieldNamePopup"]) === String("Correspondent Loan Number")) {
        expect(String(vars["ChaseValuePopup"])).toBe(vars["BidLoanNumBidReqPage"]);
      } else {
        await expect(page.locator("(//div[@class=\"border-bottom p-2\" and normalize-space((text())=\"$|ChaseFieldNamePopup|\")]/following-sibling::div)[1]")).toContainText(testData["ChaseValue"]);
      }
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
  await bidRequestDetailsPage.Close_Button_Loan_Details_Popup.click();
}

/**
 * Step Group: Verifying Header Names From UI to Excel
 * ID: 1539
 * Steps: 16
 */
export async function stepGroup_Verifying_Header_Names_From_UI_to_Excel(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["HeaderNamesExcelLockedLoans"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "0", "2");
  vars["HeaderNamesExcelLockedLoans"] = String(vars["HeaderNamesExcelLockedLoans"]).replace(/\./g, '');
  vars["CountofHeaderNamesUI"] = String(await page.locator("//div[contains(@aria-label,\"Sort by\")]").count());
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofHeaderNamesUI"]))) {
    vars["IndividualHeaderNameUILockedLoans"] = await page.locator("(//div[contains(@aria-label,\"Sort by\")])[$|count|]").textContent() || '';
    if (String(vars["IndividualHeaderNameUILockedLoans"]).includes(String("."))) {
      vars["IndividualHeaderNameUILockedLoans"] = String(vars["IndividualHeaderNameUILockedLoans"]).replace(/\./g, '');
    }
    vars["IndividualHeaderNameUILockedLoans"] = String(vars["IndividualHeaderNameUILockedLoans"]).trim();
    vars["IndividualHeaderNameExcelLockedLoans"] = String(vars["HeaderNamesExcelLockedLoans"]).split(",")[parseInt(String(vars["count"]))] || '';
    vars["IndividualHeaderNameExcelLockedLoans"] = String(vars["IndividualHeaderNameExcelLockedLoans"]).trim();
    if (String(vars["IndividualHeaderNameUILockedLoans"]) === String("LoanAmount")) {
      expect(String(vars["IndividualHeaderNameExcelLockedLoans"])).toBe("LoanAmt");
    } else {
      expect(String(vars["IndividualHeaderNameUILockedLoans"])).toBe(vars["IndividualHeaderNameExcelLockedLoans"]);
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}

/**
 * Step Group: Verifying Locked Loans Data from UI to Excel
 * ID: 1540
 * Steps: 26
 */
export async function stepGroup_Verifying_Locked_Loans_Data_from_UI_to_Excel(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const commitmentListPage = new CommitmentListPage(page);
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  vars["TotalRowsCountUILockedLoans"] = String(await commitmentListPage.Total_Rows_Count_UITotal_Loans.count());
  // [DISABLED] Click on Last Name Button
  // await bidRequestDetailsPage.Last_Name_Sort_Button.click();
  // [DISABLED] Wait until the element Last Name Down Arrow(Price Offered Details) is visible
  // await page.locator("//div[contains(text(),\"Last Name\")]//following::span[contains(@class,\"fas small px-1 fa-sort-down\")]").waitFor({ state: 'visible' });
  await expect(page.locator("//div[contains(text(),\"Last Name\")]//following::span[contains(@class,\"fas small px-1 fa-sort-down\")]")).toBeVisible();
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalRowsCountUILockedLoans"]))) {
    await page.locator("//div[text()=\"Bid Req. ID\"]//following-sibling::h5").click();
    vars["EntireRowDataExcelLockedLoans"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["count"], "2");
    vars["ColumnCountUILockedLoans"] = String(await page.locator("//table[@role='table']//tbody//tr[$|count|]//td[@data-title][position() >= 3]").count());
    vars["Count"] = "1";
    while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["ColumnCountUILockedLoans"]))) {
      vars["IndividualCellDataLockedLoansUI"] = await page.locator("(//table[@role='table']//tbody//tr[$|count|]//td[@data-title][position() >= 3])[$|Count|]").textContent() || '';
      if (String(vars["IndividualCellDataLockedLoansUI"]).includes(String("$"))) {
        vars["IndividualCellDataLockedLoansUI"] = String(vars["IndividualCellDataLockedLoansUI"]).replace(/\$\,/g, '');
      } else if (String(vars["IndividualCellDataLockedLoansUI"]).includes(String("| PQ | PS"))) {
        vars["IndividualCellDataLockedLoansUI"] = String(vars["IndividualCellDataLockedLoansUI"]).substring(0, String(vars["IndividualCellDataLockedLoansUI"]).length - 10);
      } else if (String(vars["IndividualCellDataLockedLoansUI"]).includes(String("%"))) {
        vars["IndividualCellDataLockedLoansUI"] = String(vars["IndividualCellDataLockedLoansUI"]).replace(/%/g, '');
      }
      vars["IndividualCellDataLockedLoansUI"] = String(vars["IndividualCellDataLockedLoansUI"]).trim();
      vars["IndividualRowDataExcelLockedLoans"] = String(vars["EntireRowDataExcelLockedLoans"]).split(",")[parseInt(String(vars["Count"]))] || '';
      if (String(vars["IndividualCellDataLockedLoansUI"]) === String("-")) {
        expect(String(vars["IndividualRowDataExcelLockedLoans"])).toBe("0.000");
      } else {
        expect(String(vars["IndividualCellDataLockedLoansUI"])).toBe(vars["IndividualRowDataExcelLockedLoans"]);
      }
      vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
    }
  }
  vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
}

/**
 * Step Group: Commits an Fresh Loan Num Standard
 * ID: 1570
 * Steps: 9
 */
export async function stepGroup_Commits_an_Fresh_Loan_Num_Standard(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const commitmentListPage = new CommitmentListPage(page);
  await page.locator("//tbody//tr[not(descendant::button[contains(text(),\"$|CommittedLoanNumChaseDirect|\")])]//input[@type=\"checkbox\"]").check();
  await page.locator("//button[normalize-space(text())=\"Get Price\"]").click();
  await commitmentListPage.Uncommit_Selected_Button.waitFor({ state: 'visible' });
  await expect(commitmentListPage.Uncommit_Selected_Button).toBeEnabled();
  await commitmentListPage.Uncommit_Selected_Button.click();
  await page.locator("//span[text()=\"Yes, Commit\"]//parent::button").click();
  await page.locator("//span[text()=\"Yes, Commit\"]//parent::button").waitFor({ state: 'hidden' });
  await page.locator("//button[contains(text(),\"Okay\")]").waitFor({ state: 'visible' });
  await page.locator("//button[contains(text(),\"Okay\")]").click();
}

/**
 * Step Group: Headers Verification
 * ID: 1576
 * Steps: 17
 */
export async function stepGroup_Headers_Verification(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["Count"] = "1";
  vars["count"] = "1";
  vars["ExcelHeader"] = "0";
  vars["CountOfHeaders"] = String(await page.locator("(//div[contains(@aria-label,\"Sort by\")])[position() <= 8]").count());
  vars["HeaderValuesExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["ExcelHeader"], "0");
  while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["CountOfHeaders"]))) {
    vars["IndividualHeaders"] = await page.locator("((//div[contains(@aria-label,\"Sort by\")])[position() <= 8])[$|Count|]").textContent() || '';
    vars["IndividualHeadersUI"] = String(vars["IndividualHeaders"]).trim();
    vars["IndividualExcelHeaders"] = String(vars["HeaderValuesExcel"]).split(",")[parseInt(String(vars["count"]))] || '';
    vars["IndividualExcelHeaders"] = String(vars["IndividualExcelHeaders"]).trim();
    if (String(vars["IndividualHeadersUI"]) === String("BidReq.ID")) {
      vars["IndividualHeadersUI"] = "BidRequestID";
    }
    if (String(vars["IndividualHeadersUI"]) === String("ExecutionType")) {
      // [DISABLED] Store Exe.Type in IndividualHeadersUI
      // vars["IndividualHeadersUI"] = "Exe.Type";
    }
    expect(String(vars["IndividualHeadersUI"]).toLowerCase()).toContain(String(vars["IndividualExcelHeaders"]).toLowerCase());
    vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}

/**
 * Step Group: Commit All Loans Chase Direct
 * ID: 1592
 * Steps: 9
 */
export async function stepGroup_Commit_All_Loans_Chase_Direct(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const commitmentListPage = new CommitmentListPage(page);
  await page.locator("//td[@data-title=\"Execution Type\"]//div[contains(text(),\"CHASE_DIRECT\")]//ancestor::tr//td[@data-title=\"Bid Req. ID\"]//a[contains(@aria-label,\"View details for\")]").click();
  await page.locator("//input[normalize-space(@aria-label)=\"Select all for\" and @type=\"checkbox\"]").check();
  await page.locator("//button[normalize-space(text())=\"Get Price\"]").click();
  await commitmentListPage.Uncommit_Selected_Button.waitFor({ state: 'visible' });
  await commitmentListPage.Uncommit_Selected_Button.click();
  await page.locator("//span[text()=\"Yes, Commit\"]//parent::button").click();
  await page.locator("//span[text()=\"Yes, Commit\"]//parent::button").waitFor({ state: 'hidden' });
  await page.locator("//button[contains(text(),\"Okay\")]").waitFor({ state: 'visible' });
  await page.locator("//button[contains(text(),\"Okay\")]").click();
}

/**
 * Step Group: Commit All Loans Standard
 * ID: 1593
 * Steps: 8
 */
export async function stepGroup_Commit_All_Loans_Standard(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const commitmentListPage = new CommitmentListPage(page);
  await page.locator("//input[normalize-space(@aria-label)=\"Select all for\" and @type=\"checkbox\"]").check();
  await page.locator("//button[normalize-space(text())=\"Get Price\"]").click();
  await commitmentListPage.Uncommit_Selected_Button.waitFor({ state: 'visible' });
  await commitmentListPage.Uncommit_Selected_Button.click();
  await page.locator("//span[text()=\"Yes, Commit\"]//parent::button").click();
  await page.locator("//span[text()=\"Yes, Commit\"]//parent::button").waitFor({ state: 'hidden' });
  await page.locator("//button[contains(text(),\"Okay\")]").waitFor({ state: 'visible' });
  await page.locator("//button[contains(text(),\"Okay\")]").click();
}

/**
 * Step Group: Verifying and Removing If the Last Digits are Zeroes
 * ID: 1615
 * Steps: 12
 */
export async function stepGroup_Verifying_and_Removing_If_the_Last_Digits_are_Zeroes(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["Count Ref Sec Price"] = String(vars["Ref Sec Price"]).length.toString();
  vars["Count Ref Sec Price"] = (parseFloat(String(vars["Count Ref Sec Price"])) - parseFloat(String("1"))).toFixed(0);
  /* charAt 0 */ String('').charAt(0); // TODO: Missing target variable
  if (String(vars["LastCharacter"]) === String("0")) {
    while (String(vars["LastCharacter"]) !== String(".")) {
      /* charAt 0 */ String('').charAt(0); // TODO: Missing target variable
      if (String(vars["LastCharacter"]) === String("0")) {
        vars["Ref Sec Price"] = String(vars["Ref Sec Price"]).substring(0, String(vars["Ref Sec Price"]).length - 1);
      } else {
        expect(String(vars["LastCharacter"])).toBe("0");
        break;
      }
      vars["Count Ref Sec Price"] = (parseFloat(String(vars["Count Ref Sec Price"])) - parseFloat(String("1"))).toFixed(0);
    }
  }
}

/**
 * Step Group: Uncommits the Committed Loans One Exe Type
 * ID: 1620
 * Steps: 16
 */
export async function stepGroup_Uncommits_the_Committed_Loans_One_Exe_Type(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const priceOfferedPage = new PriceOfferedPage(page);
  const commitmentListPage = new CommitmentListPage(page);
  await page.locator("//ul[contains(@class, 'navbar-nav') and contains(@class, 'flex-column')]/li[3]/a[1]").click();
  await page.locator("//span[text()[normalize-space() = \"Committed List\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await priceOfferedPage.Search_In_Committed_Page.click();
  await priceOfferedPage.Search_In_Committed_Page.fill("87VP612D87AC");
  await page.locator("//span[normalize-space(text())=\"Bid Request ID\"]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//div[contains(text(),\"$|BidReqIdPriceOffered|\")]/ancestor::tr/td[@data-title=\"Comm. ID\"]").click();
  while (await page.locator("//input[normalize-space(@aria-label)=\"Select all for\" and @type=\"checkbox\"]").isVisible()) {
    await page.locator("//input[normalize-space(@aria-label)=\"Select all for\" and @type=\"checkbox\"]").check();
    await commitmentListPage.Uncommit_Selected_Button.click();
    await page.locator("//span[text()[normalize-space() = \"Yes, Uncommit\"]]").click();
    await page.locator("//button[text()[normalize-space() = \"Okay\"]]").waitFor({ state: 'visible' });
    await page.locator("//button[text()[normalize-space() = \"Okay\"]]").click();
    await page.locator("//span[contains(text(),\" Total Committed Loans\")]").waitFor({ state: 'visible' });
    await page.locator("//span[contains(text(),\" Total Committed Loans\")]").click();
  }
}

/**
 * Step Group: Uncommits the Committed Loans Two Exe Type
 * ID: 1621
 * Steps: 25
 */
export async function stepGroup_Uncommits_the_Committed_Loans_Two_Exe_Type(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const priceOfferedPage = new PriceOfferedPage(page);
  const commitmentListPage = new CommitmentListPage(page);
  await page.locator("//ul[contains(@class, 'navbar-nav') and contains(@class, 'flex-column')]/li[3]/a[1]").click();
  await page.locator("//span[text()[normalize-space() = \"Committed List\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await priceOfferedPage.Search_In_Committed_Page.click();
  await priceOfferedPage.Search_In_Committed_Page.fill("87Y58FDC37EC");
  await page.locator("//span[normalize-space(text())=\"Bid Request ID\"]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//td[@data-title=\"Execution Type\"]//div[contains(text(),\"STANDARD\")]//ancestor::tr//a[contains(@aria-label,\"View details for commitment ID\")]").click();
  await page.locator("//span[contains(text(),\" Total Committed Loans\")]").waitFor({ state: 'visible' });
  while (await page.locator("//input[normalize-space(@aria-label)=\"Select all for\" and @type=\"checkbox\"]").isVisible()) {
    await page.locator("//input[normalize-space(@aria-label)=\"Select all for\" and @type=\"checkbox\"]").click();
    await commitmentListPage.Uncommit_Selected_Button.click();
    await page.locator("//span[text()[normalize-space() = \"Yes, Uncommit\"]]").click();
    await page.locator("//button[text()[normalize-space() = \"Okay\"]]").waitFor({ state: 'visible' });
    await page.locator("//button[text()[normalize-space() = \"Okay\"]]").click();
    await page.locator("//span[contains(text(),\" Total Committed Loans\")]").waitFor({ state: 'visible' });
    await page.locator("//span[contains(text(),\" Total Committed Loans\")]").click();
  }
  await page.locator("//a[contains(text(),\"Commitment List\")]//i[contains(@class,\"fas fa-arrow-left \")]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//td[@data-title=\"Execution Type\"]//div[contains(text(),\"CHASE_DIRECT\")]//ancestor::tr//a[contains(@aria-label,\"View details for commitment ID\")]").click();
  await page.locator("//span[contains(text(),\" Total Committed Loans\")]").waitFor({ state: 'visible' });
  while (await page.locator("//input[normalize-space(@aria-label)=\"Select all for\" and @type=\"checkbox\"]").isVisible()) {
    await page.locator("//input[normalize-space(@aria-label)=\"Select all for\" and @type=\"checkbox\"]").click();
    await commitmentListPage.Uncommit_Selected_Button.click();
    await page.locator("//span[text()[normalize-space() = \"Yes, Uncommit\"]]").click();
  }
}

/**
 * Step Group: Commits an Fresh Loan Num
 * ID: 1625
 * Steps: 11
 */
export async function stepGroup_Commits_an_Fresh_Loan_Num(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const bidRequestPage = new BidRequestPage(page);
  const commitmentListPage = new CommitmentListPage(page);
  await correspondentPortalPage.First_Bid_Request_ID.click();
  await bidRequestPage.First_CheckboxData.check();
  await page.locator("//button[normalize-space(text())=\"Get Price\"]").waitFor({ state: 'visible' });
  await page.locator("//button[normalize-space(text())=\"Get Price\"]").click();
  await commitmentListPage.Uncommit_Selected_Button.waitFor({ state: 'visible' });
  await expect(commitmentListPage.Uncommit_Selected_Button).toBeEnabled();
  await commitmentListPage.Uncommit_Selected_Button.click();
  await page.locator("//span[text()=\"Yes, Commit\"]//parent::button").click();
  await page.locator("//span[text()=\"Yes, Commit\"]//parent::button").waitFor({ state: 'hidden' });
  await page.locator("//button[contains(text(),\"Okay\")]").waitFor({ state: 'visible' });
  await page.locator("//button[contains(text(),\"Okay\")]").click();
}

/**
 * Step Group: Navigating To Early Close Config
 * ID: 1681
 * Steps: 5
 */
export async function stepGroup_Navigating_To_Early_Close_Config(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  await expect(page.locator("//span[text()[normalize-space() = \"Administration\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//a[@aria-label=\"General Settings\"]//span[text()=\"General Settings\"]").click();
  await correspondentPortalPage.Early_Close_Config.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: Add Early Config With Current Est Time
 * ID: 1683
 * Steps: 16
 */
export async function stepGroup_Add_Early_Config_With_Current_Est_Time(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const chaseFieldNamePage = new ChaseFieldNamePage(page);
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
  await correspondentPortalPage.Early_Close_Config.click();
  await page.locator("//button[text()[normalize-space() = \"Add New\"]]").click();
  await correspondentPortalPage.Toggle_Date_Picker_Button.click();
  vars["CurrentDate"] = new Date().toLocaleDateString('en-US') /* format: d-M-yyyy */;
  await page.locator("//div[@class=\"ngb-dp-month\"]//div[@aria-label=\"$|CurrentDate|\"]").click();
  vars["CurrentEstTime"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-04:00" };
    const fmt = "hh:mma";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["CurrentEstTime"] = (() => {
    const d = new Date('2000-01-01 ' + String(vars["CurrentEstTime"]));
    d.setMinutes(d.getMinutes() + parseInt(String("3")));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mma
  })();
  vars["TimeStandard"] = String(vars["CurrentEstTime"]).slice(-2);
  vars["CurrentEstTime"] = String(vars["CurrentEstTime"]).substring(0, String(vars["CurrentEstTime"]).length - 2);
  await chaseFieldNamePage.CommitCutOffTime.fill(vars["CurrentEstTime"]);
  await page.locator("//div[text()=\"Comm. Cut Off\"]/following::select[@class=\"form-select\"]").click();
  await page.locator("//div[text()=\"Comm. Cut Off\"]/following::select[@class=\"form-select\"]").selectOption({ label: vars["TimeStandard"] });
  await correspondentPortalPage.Save_Config_Button.waitFor({ state: 'visible' });
  await correspondentPortalPage.Save_Config_Button.click();
}

/**
 * Step Group: Undoing Time in Other Config
 * ID: 1691
 * Steps: 11
 */
export async function stepGroup_Undoing_Time_in_Other_Config(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const priceOfferedPage = new PriceOfferedPage(page);
  const actionsPage = new ActionsPage(page);
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
  await priceOfferedPage.Other_Config.click();
  await priceOfferedPage.Commit_Creation_Cut_Off.waitFor({ state: 'visible' });
  await priceOfferedPage.Commit_Creation_Cut_Off.clear();
  await priceOfferedPage.Commit_Creation_Cut_Off.click();
  await priceOfferedPage.Commit_Creation_Cut_Off.fill(vars["CommitCreationTimeBefore"]);
  await actionsPage.Standard_Dropdown.click();
  await actionsPage.Standard_Dropdown.selectOption({ label: vars["CommitCreationTimeStandard"] });
  await page.locator("//button[text()=\"Save Changes\"]").waitFor({ state: 'visible' });
  await page.locator("//button[text()=\"Save Changes\"]").click();
}

/**
 * Step Group: Navigating to Customer Permission Page and disabling the standard type in freedom company (New)
 * ID: 1726
 * Steps: 22
 */
export async function stepGroup_Navigating_to_Customer_Permission_Page_and_disabling_the_sta_2(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const customerPermissionPage = new CustomerPermissionPage(page);
  const editPermissionsPage = new EditPermissionsPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await customerPermissionPage.CustomerPermission_Menu.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.getByText("Customer Permission")).toBeVisible();
  await customerPermissionPage.Search_Filter_Input.fill(testData["Expected Company Name"]);
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.locator("//td[contains(text(),\"@|Company Name|\")]/following-sibling::td[@data-title=\"Actions\"]//button[@aria-label=\"Edit Permission\"]//span[contains(@class, 'fa-pencil-alt')]").click();
  await page.getByText("Edit Permissions").waitFor({ state: 'visible' });
  await expect(page.locator("(//input[@type=\"radio\"])[3]")).toBeEnabled();
  if (true) /* Radio button Off Radio Standard(Edit Permissions Popup) is n */ {
    await page.locator("(//input[@type=\"radio\"])[2]").check();
    await page.locator("//button[contains(.,'Update Permissions')]").waitFor({ state: 'visible' });
  }
  if (true) /* Radio button On Radio ChaseDirect(Edit Permissions Popup) is */ {
    await page.locator("(//input[@type=\"radio\"])[3]").check();
    await page.locator("//button[contains(.,'Update Permissions')]").waitFor({ state: 'visible' });
  }
  if (true) /* Element Update Permissions Button is enabled */ {
    await page.locator("//button[contains(.,'Update Permissions')]").click();
  } else {
    await editPermissionsPage.Close_pop_up.click();
  }
}

/**
 * Step Group: Storing Open Auth Limit and AuthLimit (Price Offered)
 * ID: 1768
 * Steps: 5
 */
export async function stepGroup_Storing_Open_Auth_Limit_and_AuthLimit_Price_Offered(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["OpenAuthLimit"] = await page.locator("//div[contains(text(),\"Open Auth Limit:\")]//following-sibling::div").textContent() || '';
  vars["OpenAuthLimitStandard"] = String('').split("(")["0"] || '';
  vars["OpenAuthLimitPercentageStandard"] = String('').split("(")["1"] || '';
  vars["OpenAuthLimitPercentageStandard"] = String(vars["OpenAuthLimitPercentageStandard"]).replace(/\)%/g, '');
  vars["AuthLimitStandard"] = await page.locator("//div[normalize-space(text())=\"Auth Limit:\"]/following-sibling::div").textContent() || '';
}

/**
 * Step Group: Uploading Bid Request(Latest)
 * ID: 1778
 * Steps: 25
 */
export async function stepGroup_Uploading_Bid_RequestLatest(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//div[text()[normalize-space() = \"Select\"]]").click();
  await page.locator("(//div[@class=\"mb-0 overflow-hidden\"])[1]/../..//input[@placeholder=\"Search\"]").fill(testData["Company Name"]);
  // [DISABLED] Verify that the element SelectCompany_Value has value Company Name for title and With Scrollable FALSE
  // await expect(page.locator("(//span[contains(@class,'pl-2')])[1]")).toHaveAttribute('title', testData["Company Name"]);
  await page.locator("(//span[contains(@class,'pl-2')])[1]").click();
  // [DISABLED] Verify that the element SelectCompany_Value displays text Company Name and With Scrollable FALSE
  // await expect(page.locator("(//span[contains(@class,'pl-2')])[1]")).toContainText(testData["Company Name"]);
  await expect(page.locator("//label[text()=\"Standard\"]/..//input[@type=\"checkbox\"]")).toBeVisible();
  await page.locator("(//select[contains(normalize-space(),\"Select 3 7 15\")])[1]").selectOption({ label: "3" });
  await page.locator("(//option[@value=\"3\"])[1]/../..//select[@aria-label=\"Dropdown selection\"]").waitFor({ state: 'visible' });
  await expect(page.locator("(//option[@value=\"3\"])[1]/../..//select[@aria-label=\"Dropdown selection\"]")).toHaveValue("3");
  await page.locator("//div[text()[normalize-space() = \"Select Mapping\"]]").click();
  await page.locator("//div[contains(@class, 'shadow') and contains(@class, 'dropdown-menu') and contains(@class, 'show')]//input[@placeholder=\"Search\"]").fill(testData["BidMappingID"]);
  await page.locator("//span[text()[normalize-space() =\"Deepika Aug1\"]]").waitFor({ state: 'visible' });
  await page.locator("//span[text()[normalize-space() =\"Deepika Aug1\"]]").click();
  await expect(page.locator("//button//div[text()=' @|BidMappingID| ']")).toContainText(testData["BidMappingID"]);
  await expect(correspondentPortalPage.Bid_Request_Date).toBeEnabled();
  await page.locator("//label[normalize-space(text())=\"Deferred\"]/..//input[@name=\"pricingMode\" and @type=\"radio\"]").click();
  await page.locator("//label[normalize-space(text())=\"Deferred\"]/..//input[@name=\"pricingMode\" and @type=\"radio\"]").waitFor({ state: 'visible' });
  await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").click();
  // [DISABLED] Scroll down to the element Enabled_PricingReturnTime into view
  // await page.locator("//option[contains(text(),\"$|BulkBatchTiming|\")]").scrollIntoViewIfNeeded();
  // [DISABLED] Verify that the element Enabled_PricingReturnTime is present and With Scrollable TRUE
  // await expect(page.locator("//option[contains(text(),\"$|BulkBatchTiming|\")]")).toBeVisible();
  // [DISABLED] Click on Enabled_PricingReturnTime
  // await page.locator("//option[contains(text(),\"$|BulkBatchTiming|\")]").click();
  // [DISABLED] Verify that the current page displays text Drag and drop files here or click to browse. Allowed formats: .xls,.xlsx,.csv,.txt
  // await expect(page.getByText("Drag and drop files here or click to browse. Allowed formats: .xls,.xlsx,.csv,.txt")).toBeVisible();
  // [DISABLED] Upload file Bid_Valid_file.xlsx,Bid_Valid_file.xlsx using the element UploadFile [BidRequest]
  // await page.locator("(//input[@type=\"file\"])[1]").setInputFiles(path.resolve(__dirname, 'test-data', "Bid_Valid_file.xlsx"));
  // [DISABLED] Verify that the element UploadBid_Button is enabled and With Scrollable FALSE
  // await expect(page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]")).toBeVisible();
  // [DISABLED] Click on UploadBid_Button
  // await page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]").click();
}

/**
 * Step Group: Updating the Loan Numbers in a file
 * ID: 1823
 * Steps: 14
 */
export async function stepGroup_Updating_the_Loan_Numbers_in_a_file(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await stepGroup_Rename_File(page, vars);
  if (vars['_lastDownloadPath']) { require('fs').copyFileSync(vars['_lastDownloadPath'], vars['_lastDownloadPath'] + '.copy'); }
  vars["CurrentDate"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
    const fmt = "dd-MM-yyyy";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["Str1"] = String("TestSigma_") + String(vars["CurrentDate"]);
  vars["Str2"] = String(vars["Str1"]) + String("_SC1");
  vars["ColumnCount"] = "0";
  vars["count"] = "1";
  vars["RowsCountExcel"] = String(excelHelper.getRowCount(vars["File"], "0"));
  while (parseFloat(String(vars["count"])) < parseFloat(String(vars["RowsCountExcel"]))) {
    vars["RandomString"] = Array.from({length: 2}, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 62))).join('');
    vars["RandomNumber"] = String(Math.floor(Math.random() * (999 - 100 + 1)) + 100);
    vars["FormattedLoanNumber"] = vars["Str2"] + "_" + vars["RandomString"] + "_" + vars["RandomNumber"];
    excelHelper.writeCell(vars["File"], vars["count"], vars["ColumnCount"], String(vars["FormattedLoanNumber"]), "0");
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}

/**
 * Step Group: Storing Required Loan Number Details
 * ID: 1831
 * Steps: 10
 */
export async function stepGroup_Storing_Required_Loan_Number_Details(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["LastNameBeforeCommit"] = await page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Last Name\"]").textContent() || '';
  vars["LoanAmountBeforeCommit"] = await page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Loan Amount\"]").textContent() || '';
  vars["InterestRateBeforeCommit"] = await page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Int. Rate\"]").textContent() || '';
  vars["RefSecProdBeforeCommit"] = await page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Ref Sec Prod.\"]").textContent() || '';
  vars["RefSecPriceBeforeCommit"] = await page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Ref Sec Price\"]  ").textContent() || '';
  vars["GrossPriceBeforeCommit"] = await page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Gross Price\"]").textContent() || '';
  vars["HedgeRatioBeforeCommit"] = await page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Hedge Ratio\"]  ").textContent() || '';
  vars["CurrMarketValueBeforeCommit"] = await page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Curr Market Value\"]").textContent() || '';
  vars["MarkAdjBeforeCommit"] = await page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Mark Adj\"]").textContent() || '';
  vars["CurrGrossBeforeCommit"] = await page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Curr Gross\"]").textContent() || '';
}

/**
 * Step Group: Verifying Loan Details
 * ID: 1832
 * Steps: 10
 */
export async function stepGroup_Verifying_Loan_Details(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Last Name\"]")).toContainText(vars["CommittedLastNameTotalLoans"]);
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Loan Amount\"]")).toContainText(vars["CommittedLoanAmountTotalLoans"]);
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Int. Rate\"]")).toContainText(vars["CommittedIntRateTotalLoans"]);
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Ref Sec Prod.\"]")).toContainText(vars["CommittedRefSecProdTotalLoans"]);
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Ref Sec Price\"]  ")).toContainText(vars["CommittedRefSecPriceTotalLoans"]);
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Gross Price\"]")).toContainText(vars["CommittedGrossPriceTotalLoans"]);
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Hedge Ratio\"]  ")).toContainText(vars["CommittedHedgeRatioTotalLoans"]);
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Curr Market Value\"]")).toContainText(vars["CommittedCurrMarketValueTotalLoans"]);
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Mark Adj\"]")).toContainText(vars["CommittedMarkAdjTotalLoans"]);
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Curr Gross\"]")).toContainText(vars["CommittedCurrGrossTotalLoans"]);
}

/**
 * Step Group: Verifying Header Names From UI to Excel(Commitment List)
 * ID: 1835
 * Steps: 16
 */
export async function stepGroup_Verifying_Header_Names_From_UI_to_ExcelCommitment_List(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["HeaderNamesTotalLoansExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "0", "1");
  vars["HeaderNamesTotalLoansExcel"] = String(vars["HeaderNamesTotalLoansExcel"]).replace(/\./g, '');
  vars["CountofHeaderNamesUI"] = String(await page.locator("(//div[contains(@aria-label,\"Sort by\")])[position() != 2 and position() != 10]").count());
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofHeaderNamesUI"]))) {
    vars["IndividualHeaderNameTotalLoansUI"] = await page.locator("((//div[contains(@aria-label,\"Sort by\")])[position() != 2 and position() != 10])[$|count|]").textContent() || '';
    if (String(vars["IndividualHeaderNameTotalLoansUI"]).includes(String("."))) {
      vars["IndividualHeaderNameTotalLoansUI"] = String(vars["IndividualHeaderNameTotalLoansUI"]).replace(/\./g, '');
    }
    vars["IndividualHeaderNameTotalLoansUI"] = String(vars["IndividualHeaderNameTotalLoansUI"]).trim();
    vars["IndividualHeaderNameTotalLoansExcel"] = String(vars["HeaderNamesTotalLoansExcel"]).split(",")[parseInt(String(vars["count"]))] || '';
    vars["IndividualHeaderNameTotalLoansExcel"] = String(vars["IndividualHeaderNameTotalLoansExcel"]).trim();
    if (String(vars["IndividualHeaderNameTotalLoansUI"]) === String("LoanAmount")) {
      expect(String(vars["IndividualHeaderNameTotalLoansExcel"])).toBe("LoanAmt");
    } else {
      expect(String(vars["IndividualHeaderNameTotalLoansUI"])).toBe(vars["IndividualHeaderNameTotalLoansExcel"]);
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}

/**
 * Step Group: Verifying Locked Loans Data UI to Excel(Commitment List)
 * ID: 1836
 * Steps: 24
 */
export async function stepGroup_Verifying_Locked_Loans_Data_UI_to_ExcelCommitment_List(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["TotalRowsCountUILockedLoans"] = String(await page.locator("//span[contains(@class,\"fa fas fa-lock lock-icon\")]//ancestor::tr[@role=\"row\"]").count());
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["TotalRowsCountUILockedLoans"]))) {
    await page.locator("//div[text()=\"Bid Req. ID\"]//following-sibling::h5").click();
    vars["EntireRowDataLockedLoansExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["count"], "2");
    vars["ColumnCountUILockedLoans"] = String(await page.locator("(//span[contains(@class,\"fa fas fa-lock lock-icon\")])[$|count|]//ancestor::tr//td[@data-title][position() >2 and position()!= 4 and position()!= 12]").count());
    vars["Count"] = "1";
    while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["ColumnCountUILockedLoans"]))) {
      vars["IndividualCellDataLockedLoansUI"] = await page.locator("((//span[contains(@class,\"fa fas fa-lock lock-icon\")])[$|count|]//ancestor::tr//td[@data-title][position() >2 and position()!= 4 and position()!= 12])[$|Count|]").textContent() || '';
      if (String(vars["IndividualCellDataLockedLoansUI"]).includes(String("$"))) {
        vars["IndividualCellDataLockedLoansUI"] = String(vars["IndividualCellDataLockedLoansUI"]).replace(/\$\,/g, '');
      } else if (String(vars["IndividualCellDataLockedLoansUI"]).includes(String("| PQ | PS"))) {
        vars["IndividualCellDataLockedLoansUI"] = String(vars["IndividualCellDataLockedLoansUI"]).substring(0, String(vars["IndividualCellDataLockedLoansUI"]).length - 10);
      } else if (String(vars["IndividualCellDataLockedLoansUI"]).includes(String("%"))) {
        vars["IndividualCellDataLockedLoansUI"] = String(vars["IndividualCellDataLockedLoansUI"]).replace(/%/g, '');
      }
      vars["IndividualCellDataLockedLoansUI"] = String(vars["IndividualCellDataLockedLoansUI"]).trim();
      vars["IndividualRowDataLockedLoansExcel"] = String(vars["EntireRowDataLockedLoansExcel"]).split(",")[parseInt(String(vars["Count"]))] || '';
      // [DISABLED] Verify if IndividualCellDataAllLoansUI == -
      // if (String(vars["IndividualCellDataAllLoansUI"]) === String("-"))
        // [DISABLED] Verify if IndividualRowDataExcelAllLoans == 0.000
        // expect(String(vars["IndividualRowDataExcelAllLoans"])).toBe("0.000");
      // [DISABLED] Step group
      // // TODO: No template - Unknown step
        // [DISABLED] Verify if IndividualCellDataAllLoansUI == IndividualRowDataExcelAllLoans
        // expect(String(vars["IndividualCellDataAllLoansUI"])).toBe(vars["IndividualRowDataExcelAllLoans"]);
      expect(String(vars["IndividualCellDataLockedLoansUI"])).toBe(vars["IndividualRowDataLockedLoansExcel"]);
      vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}

/**
 * Step Group: Market Threshold Values Updating Back
 * ID: 1845
 * Steps: 1
 */
export async function stepGroup_Market_Threshold_Values_Updating_Back(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await stepGroup_If_Test_case_fail(page, vars);
}

/**
 * Step Group: Updating Back Min/MaxThreshold
 * ID: 1853
 * Steps: 9
 */
export async function stepGroup_Updating_Back_MinMaxThreshold(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const commitmentListPage = new CommitmentListPage(page);
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
  await correspondentPortalPage.Market_Thresholds.scrollIntoViewIfNeeded();
  await correspondentPortalPage.Market_Thresholds.click();
  await stepGroup_Market_Threshold(page, vars);
  await commitmentListPage.Enter_minimum_display_value_in_percentage.clear();
  await correspondentPortalPage.Enter_maximum_display_value_in_percentage_Input.fill("120");
  await commitmentListPage.Enter_minimum_display_value_in_percentage.fill("1");
  await page.locator("//span[contains(text(),\"Update Threshold\")]").click();
}

/**
 * Step Group: Storing PopUpError
 * ID: 1859
 * Steps: 3
 */
export async function stepGroup_Storing_PopUpError(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["space"] = "key_blank";
  vars["ExpectedPopUpError1"] = "Loan" + vars["space"] + vars["CorrLoan"] + vars["space"] + "can not be committed. Market adjuster value" + vars["space"];
  vars["ExpectedPopUpError2"] = "is greater than market threshold value" + vars["space"] + vars["NumLowerThanMarkAdjPopup"];
}

/**
 * Step Group: Verifying MarkAdjValue
 * ID: 1863
 * Steps: 7
 */
export async function stepGroup_Verifying_MarkAdjValue(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["UncommittedLoansCount"] = String(await page.locator("//*[contains(@aria-label,\"Select loan\")]").count());
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["UncommittedLoansCount"]))) {
    vars["IndividualMarkAdjValue"] = await page.locator("(//*[contains(@aria-label,\"Select loan\")]/../..//td[@data-title=\"Mark Adj\"])[$|count|]").textContent() || '';
    vars["IndividualMarkAdjValue"] = String(vars["IndividualMarkAdjValue"]).trim();
    expect(String(vars["IndividualMarkAdjValue"])).toBe("-");
    vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
  }
}

/**
 * Step Group: Storing Committed Corr Loan Num Details(Commitment List)
 * ID: 1865
 * Steps: 9
 */
export async function stepGroup_Storing_Committed_Corr_Loan_Num_DetailsCommitment_List(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["CommittedLastName"] = await page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Last Name\"]").textContent() || '';
  vars["CommittedLoanAmount"] = await page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Loan Amount\"]").textContent() || '';
  vars["CommittedIntRate"] = await page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Int. Rate\"]").textContent() || '';
  vars["CommittedRefSecProd"] = await page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Ref Sec Prod.\"]").textContent() || '';
  vars["CommittedRefSecPrice"] = await page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Ref Sec Price\"]  ").textContent() || '';
  vars["CommittedGrossPrice"] = await page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Gross Price\"]").textContent() || '';
  vars["CommittedHedgeRatio"] = await page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Hedge Ratio\"]  ").textContent() || '';
  vars["CommittedMarkAdj"] = await page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Mark Adj\"]").textContent() || '';
  vars["CommittedCurrGross"] = await page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Curr Gross\"]").textContent() || '';
}

/**
 * Step Group: Verifying the Committed Loan Details(Price Offered)
 * ID: 1867
 * Steps: 10
 */
export async function stepGroup_Verifying_the_Committed_Loan_DetailsPrice_Offered(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]")).toBeVisible();
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Last Name\"]\n ")).toContainText(vars["CommittedLastName"]);
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Loan Amount\"]")).toContainText(vars["CommittedLoanAmount"]);
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Int. Rate\"]")).toContainText(vars["CommittedIntRate"]);
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Ref Sec Prod.\"]")).toContainText(vars["CommittedRefSecProd"]);
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Ref Sec Price\"]  ")).toContainText(vars["CommittedRefSecPrice"]);
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Gross Price\"]")).toContainText(vars["CommittedGrossPrice"]);
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Hedge Ratio\"]  ")).toContainText(vars["CommittedHedgeRatio"]);
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Mark Adj\"]")).toContainText(vars["CommittedMarkAdj"]);
  await expect(page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Curr Gross\"]")).toContainText(vars["CommittedCurrGross"]);
}

/**
 * Step Group: Data Verification After Applying Filters(Commitment List)
 * ID: 1987
 * Steps: 13
 */
export async function stepGroup_Data_Verification_After_Applying_FiltersCommitment_List(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const commitmentListPage = new CommitmentListPage(page);
  const bidRequestPage = new BidRequestPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  if (true) /* Element Go to Next Page Button is enabled */ {
    vars["CountofPages"] = "2";
  } else {
    vars["CountofPages"] = "1";
  }
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["CountofPages"]))) {
    await commitmentListPage.Committed_Date.waitFor({ state: 'visible' });
    for (let i = 0; i < await commitmentListPage.Committed_Date.count(); i++) {
      await expect(commitmentListPage.Committed_Date.nth(i)).toHaveText(String(new Date().toLocaleDateString('en-US') /* format: MM/dd/yyyy */));
    }
    for (let i = 0; i < await bidRequestPage.BidRequest_Company_Column_Data.count(); i++) {
      await expect(bidRequestPage.BidRequest_Company_Column_Data.nth(i)).toHaveText(String(vars["SelectedCompanyName"]));
    }
    if (true) /* Element Go to Next Page Button is enabled */ {
      await correspondentPortalPage.Go_to_Next_Page_Button.click();
      await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}

/**
 * Step Group: Selecting Date from the filters by fetching the first comm date in List(Committed List)
 * ID: 1989
 * Steps: 24
 */
export async function stepGroup_Selecting_Date_from_the_filters_by_fetching_the_first_comm_d(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const auditPage = new AuditPage(page);
  const commitmentsPage = new CommitmentsPage(page);
  vars["FirstCommDate"] = await page.locator("//div[contains(@aria-label,\"Committed Date:\")]").textContent() || '';
  vars["FirstCommDate"] = String(vars["FirstCommDate"]).trim();
  vars["ExpectedCommDate"] = vars["FirstCommDate"];
  vars["MonthCommDate"] = String(vars["FirstCommDate"]).split("/")["1"] || '';
  vars["CommDate"] = String(vars["FirstCommDate"]).split("/")["2"] || '';
  vars["YearCommDate"] = String(vars["FirstCommDate"]).split("/")["3"] || '';
  vars[""] = new Date(2000, parseInt(String("MonthName")) - 1, 1).toLocaleString('en-US', { month: 'long' });
  vars["DateFormatFilter"] = (() => {
    const d = new Date(String(vars["FirstCommDate"]));
    const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
    return "d-M-yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
  })();
  await page.locator("//span[text()[normalize-space() = \"Filter\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"Select Date Range\"]]").click();
  await auditPage.Date_Range_DropdownFilter.click();
  await commitmentsPage.Select_month_Dropdownfilters.click();
  await commitmentsPage.Select_month_Dropdownfilters.selectOption({ label: vars["MonthName"] });
  await commitmentsPage.Select_year_Dropdownfilters.click();
  await commitmentsPage.Select_year_Dropdownfilters.selectOption({ label: vars["YearCommDate"] });
  await page.locator("//div[@role=\"gridcell\" and @aria-label=\"$|DateFormatFilter|\"]").click();
  await page.locator("//button[text()[normalize-space() = \"Apply\"]]").waitFor({ state: 'visible' });
  await page.locator("//button[text()[normalize-space() = \"Apply\"]]").click();
  // [DISABLED] Click on Apply Filters Button
  // await page.locator("//div[contains(@class, \"justify-content-end\")]//button[text()=\"Apply Filters\"]").click();
  // [DISABLED] Wait until the element Spinner is not visible
  // await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  // [DISABLED] Wait until the element Date Filter Chip(Committed Page) is visible
  // await page.locator("//div[@class=\"pill rounded-pill relative\" and contains(@aria-label,\"Chip Date\")]").waitFor({ state: 'visible' });
  // [DISABLED] Convert the date from the FirstCommDate in MM/dd/yyyy to yyyy/MM/dd and store it in a runtime ExpectedDateChip
  // vars["ExpectedDateChip"] = (() => {
  //   const d = new Date(String(vars["FirstCommDate"]));
  //   const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
  //   return "yyyy/MM/dd".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
  // })();
  // [DISABLED] Concate Date: and ExpectedDateChip with Space and store into a variable ExpectedDateChip
  // vars[""] = String("Date:") + ' ' + String(vars["ExpectedDateChip"]);
  // [DISABLED] Verify that the element Date Filter Chip(Committed Page) displays text contains ExpectedDateChip and With Scrollable FALSE
  // await expect(page.locator("//div[@class=\"pill rounded-pill relative\" and contains(@aria-label,\"Chip Date\")]")).toContainText(vars["ExpectedDateChip"]);
}

/**
 * Step Group: Verification of Total no.of rows from UI to Excel and Export Button(Commitment List)
 * ID: 1991
 * Steps: 28
 */
export async function stepGroup_Verification_of_Total_noof_rows_from_UI_to_Excel_and_Export_(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const commitmentListPage = new CommitmentListPage(page);
  if (true) /* Element Pagination Count is not visible */ {
    vars["PageCount"] = "1";
  } else {
    vars["PageCount"] = await correspondentPortalPage.Pagination_Count.textContent() || '';
    vars["PageCount"] = String(vars["PageCount"]).substring(10);
  }
  vars["Count1"] = "1";
  vars["TotalRowsAllPagesUI"] = "0";
  while (parseFloat(String(vars["Count1"])) <= parseFloat(String(vars["PageCount"]))) {
    vars["RowCountUI"] = String(await page.locator("(//tbody//tr)[position() >= 1 and position() <= last()]").count());
    vars["TotalRowsAllPagesUI"] = (parseFloat(String(vars["TotalRowsAllPagesUI"])) + parseFloat(String(vars["RowCountUI"]))).toFixed(0);
    // [DISABLED] Perform subtraction on TotalRowsAllPages and 1 and store the result inside a RowCountUI considering 0 decimal places
    // vars["RowCountUI"] = (parseFloat(String(vars["TotalRowsAllPages"])) - parseFloat(String("1"))).toFixed(0);
    if (true) /* Element Go to Next Page Button is enabled */ {
      await correspondentPortalPage.Go_to_Next_Page_Button.click();
    }
    await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
    vars["Count1"] = (parseFloat(String("1")) + parseFloat(String(vars["Count1"]))).toFixed(0);
  }
  await page.locator("//input[contains(@aria-label,\"Select all for\") and @type=\"checkbox\"]").click();
  vars["ExportedCount"] = await page.locator(" //span[text()=\" Export Selected\"]/following-sibling::span").textContent() || '';
  vars["ExportedCount"] = String(vars["ExportedCount"]).trim();
  vars["ExportedCount"] = String(vars["ExportedCount"]).replace(/\(\)/g, '');
  vars["RowCount"] = String(await commitmentListPage.Rows_Count_Total_Loans_Tab.count());
  vars["RowCountInUI"] = (parseFloat(String(vars["RowCount"])) - parseFloat(String("1"))).toFixed(0);
  await page.locator("//span[text()[normalize-space() = \"Export Selected\"]]").click();
  // Wait for download - handled by Playwright download events
  await page.waitForTimeout(2000);
  vars["File"] = vars['_lastDownloadPath'] || '';
  vars["ExcelRowCount"] = String(excelHelper.getRowCount(vars["File"], "0"));
  vars["ExcelRowCount"] = (parseFloat(String(vars["ExcelRowCount"])) - parseFloat(String("1"))).toFixed(0);
  expect(String(vars["TotalRowsAllPagesUI"])).toBe(vars["ExcelRowCount"]);
  expect(String(vars["RowCountInUI"])).toBe(vars["ExportedCount"]);
}

/**
 * Step Group: Verification of Data from Excel to UI - Excluding Headers(Commitments)
 * ID: 1998
 * Steps: 25
 */
export async function stepGroup_Verification_of_Data_from_Excel_to_UI_Excluding_HeadersCommi(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const commitmentListPage = new CommitmentListPage(page);
  vars["RowCount"] = String(await commitmentListPage.Total_Rows_Count_UITotal_Loans.count());
  vars["RowCountUI"] = "1";
  vars["RowCountExcel"] = "1";
  while (parseFloat(String(vars["RowCountUI"])) <= parseFloat(String(vars["RowCount"]))) {
    vars["ColumnCountUI"] = "2";
    vars["indexExcel"] = "1";
    vars["RowDataExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["RowCountExcel"], "0");
    while (parseFloat(String(vars["ColumnCountUI"])) <= parseFloat(String("13"))) {
      await page.locator("//h3[text()[normalize-space() = \"Commitment List\"]]").click();
      vars["CellValueInExcel"] = String(vars["RowDataExcel"]).split(",")[parseInt(String(vars["indexExcel"]))] || '';
      vars["HeadersUI"] = await page.locator("(//div[@role=\"button\"])[$|indexExcel|]").textContent() || '';
      vars["HeadersUI"] = String(vars["HeadersUI"]).trim();
      vars["CellValuesUI "] = await page.locator("(//tbody//tr[$|RowCountUI|]//td)[$|ColumnCountUI|]").textContent() || '';
      vars["CellValuesUI"] = String(vars["CellValuesUI "]).trim();
      if (String(vars["indexExcel"]) === String("5")) {
        vars["CountofCama"] = String((String(vars["CellValuesUI"]).split(",").length - 1));
        vars["count"] = "1";
        while (parseFloat(String(vars["count"])) < parseFloat(String(vars["CountofCama"]))) {
          // [DISABLED] Split the RowDataExcel with the , and store the value from the indexExcel in the CellValueInExcel
          // vars["CellValueInExcel"] = String(vars["RowDataExcel"]).split(",")[parseInt(String(vars["indexExcel"]))] || '';
          vars["indexExcel"] = (parseFloat(String(vars["indexExcel"])) + parseFloat(String("1"))).toFixed(0);
          vars["CellValueInExcel2"] = String(vars["RowDataExcel"]).split(",")[parseInt(String(vars["indexExcel"]))] || '';
          vars["CellValueInExcel"] = String(vars["CellValueInExcel"]) + "," + String(vars["CellValueInExcel2"]);
          vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
        // [DISABLED] Concate CellValueInExcel and CellValueInExcel2 with SpecialCharacter , and store into a variable CellValueInExcel
        // vars["CellValueInExcel"] = String(vars["CellValueInExcel"]) + "," + String(vars["CellValueInExcel2"]);
        }
      }
      vars["CellValueInExcel"] = String(vars["CellValueInExcel"]).trim();
    }
  }
}

/**
 * Step Group: Headers Verification (Closed List)
 * ID: 2002
 * Steps: 17
 */
export async function stepGroup_Headers_Verification_Closed_List(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["Count"] = "1";
  vars["count"] = "1";
  vars["ExcelHeader"] = "0";
  vars["CountOfHeaders"] = String(await page.locator("(//div[contains(@aria-label,\"Sort by\")])[position() <= 13]").count());
  vars["HeaderValuesExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["ExcelHeader"], "0");
  while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["CountOfHeaders"]))) {
    vars["IndividualHeaders"] = await page.locator("((//div[contains(@aria-label,\"Sort by\")])[position() <= 13])[$|Count|]").textContent() || '';
    vars["IndividualHeadersUI"] = String(vars["IndividualHeaders"]).trim();
    vars["IndividualExcelHeaders"] = String(vars["HeaderValuesExcel"]).split(",")[parseInt(String(vars["count"]))] || '';
    vars["IndividualExcelHeaders"] = String(vars["IndividualExcelHeaders"]).trim();
    if (String(vars["IndividualHeadersUI"]) === String("BidReq.ID")) {
      vars["IndividualHeadersUI"] = "BidRequestID";
    }
    if (String(vars["IndividualHeadersUI"]) === String("ExecutionType")) {
      // [DISABLED] Store Exe.Type in IndividualHeadersUI
      // vars["IndividualHeadersUI"] = "Exe.Type";
    }
    expect(String(vars["IndividualHeadersUI"]).toLowerCase()).toContain(String(vars["IndividualExcelHeaders"]).toLowerCase());
    vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}

/**
 * Step Group: Headers Verification in Closed List
 * ID: 2005
 * Steps: 9
 */
export async function stepGroup_Headers_Verification_in_Closed_List(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["Count"] = "1";
  vars["CountOfHeaders"] = String(await page.locator("(//div[contains(@aria-label,\"Sort by\")])[position() <= 13]").count());
  vars["EntireHeadersExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', "0", "0");
  while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["CountOfHeaders"]))) {
    vars["IndividualHeaderNameUI"] = await page.locator("((//div[contains(@aria-label,\"Sort by\")])[position() <= 13])[$|Count|]").textContent() || '';
    vars["IndividualHeaderNameUI"] = String(vars["IndividualHeaderNameUI"]).trim();
    vars["IndividualHeaderNameExcel"] = String(vars["EntireHeadersExcel"]).split(",")[parseInt(String(vars["Count"]))] || '';
    expect(String(vars["IndividualHeaderNameExcel"])).toBe(vars["IndividualHeaderNameUI"]);
    vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
  }
}

/**
 * Step Group: Verification of Data from Excel to UI(Closed List)
 * ID: 2008
 * Steps: 25
 */
export async function stepGroup_Verification_of_Data_from_Excel_to_UIClosed_List(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["RowCount"] = "1";
  while (parseFloat(String(vars["RowCount"])) <= parseFloat(String(vars["TotalRowsCountUI"]))) {
    vars["ColumnCountUI"] = "1";
    vars["IndexCountExcel"] = "1";
    vars["EntireRowDataExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["RowCount"], "0");
    await page.locator("//h3[text()[normalize-space() = \"Commitment List\"]]").click();
    while (parseFloat(String(vars["ColumnCountUI"])) <= parseFloat(String("13"))) {
      vars["IndividualCellValueExcel"] = String(vars["EntireRowDataExcel"]).split(",")[parseInt(String(vars["IndexCountExcel"]))] || '';
      vars["IndividualCellValueUI"] = await page.locator("(//tr[contains(@class,'row')][$|RowCount|]//td[position() >= 2 and position() <= 14])[$|ColumnCountUI|]").textContent() || '';
      vars["IndividualCellValueUI"] = String(vars["IndividualCellValueUI"]).trim();
      if (String(vars["ColumnCountUI"]) === String("5")) {
        vars["CountofCama"] = String((String(vars["IndividualCellValueUI"]).split(",").length - 1));
        vars["count"] = "1";
        while (parseFloat(String(vars["count"])) < parseFloat(String(vars["CountofCama"]))) {
          vars["IndexCountExcel"] = (parseFloat(String(vars["IndexCountExcel"])) + parseFloat(String("1"))).toFixed(0);
          vars["CellValueInExcel2"] = String(vars["EntireRowDataExcel"]).split(",")[parseInt(String(vars["IndexCountExcel"]))] || '';
          vars["IndividualCellValueExcel"] = String(vars["IndividualCellValueExcel"]) + "," + String(vars["CellValueInExcel2"]);
          vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
        }
      } else if (String(vars["ColumnCountUI"]) === String("13")) {
        vars["CountofCama"] = String((String(vars["IndividualCellValueUI"]).split(",").length - 1));
        vars["count"] = "1";
        while (parseFloat(String(vars["count"])) < parseFloat(String(vars["CountofCama"]))) {
          vars["IndexCountExcel"] = (parseFloat(String(vars["IndexCountExcel"])) + parseFloat(String("1"))).toFixed(0);
          vars["CellValueInExcel2"] = String(vars["EntireRowDataExcel"]).split(",")[parseInt(String(vars["IndexCountExcel"]))] || '';
          vars["IndividualCellValueExcel"] = String(vars["IndividualCellValueExcel"]) + "," + String(vars["CellValueInExcel2"]);
        }
      }
    }
  }
}

/**
 * Step Group: Splitting the time and waiting- if the wait time is more than 5min
 * ID: 2013
 * Steps: 5
 */
export async function stepGroup_Splitting_the_time_and_waiting_if_the_wait_time_is_more_than(page: import('@playwright/test').Page, vars: Record<string, string>) {
  while (parseFloat(String(vars["TimeDiff"])) > parseFloat(String("4"))) {
    await page.waitForTimeout(240000);
    await page.locator("//form//div//label[text()=\"Bid Requested Date\"]").click();
    vars["TimeDiff"] = (parseFloat(String(vars["TimeDiff"])) - parseFloat(String("4"))).toFixed(0);
    vars["TimeDifferenceSeconds"] = (parseFloat(String(vars["TimeDiff"])) * parseFloat(String("60"))).toFixed(0);
  }
}

/**
 * Step Group: Verification of Loan Level Pricing Details
 * ID: 2029
 * Steps: 25
 */
export async function stepGroup_Verification_of_Loan_Level_Pricing_Details(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const commitmentListPage = new CommitmentListPage(page);
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  vars["TotalRowsCount"] = String(await commitmentListPage.Total_Rows_Count_UITotal_Loans.count());
  vars["RowCount"] = "1";
  while (parseFloat(String(vars["RowCount"])) <= parseFloat(String(vars["TotalRowsCount"]))) {
    vars["IndividualCurrentGrossPriceUI"] = await page.locator("(//td[@data-title=\"Curr Gross\"])[$|RowCount|]").textContent() || '';
    vars["IndividualCorrLoanNumUI"] = await page.locator("(//td[@data-title=\"Corr. Loan#\"]//button[1])[$|RowCount|]").textContent() || '';
    await page.locator("(//td[@data-title=\"Corr. Loan#\"]//button[1])[$|RowCount|]").click();
    await commitmentListPage.Search_FieldLon_Details_Popup.waitFor({ state: 'visible' });
    await page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"Product Name\")]/following-sibling::div)[1]").scrollIntoViewIfNeeded();
    vars["IndividualProductNameUI"] = await page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"Product Name\")]/following-sibling::div)[1]").textContent() || '';
    await page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"LMI_INCENTIVE_PRICE\")]/following-sibling::div)[1]").scrollIntoViewIfNeeded();
    vars["IndividualLMIPriceUI"] = await page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"LMI_INCENTIVE_PRICE\")]/following-sibling::div)[1]").textContent() || '';
    if (true) /* Element LMI Type(Popup Details) is visible */ {
      vars["IndividualLMITypeUI"] = await page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"LMI_TYPE\")]/following-sibling::div)[1]").textContent() || '';
    } else {
      vars["IndividualLMITypeUI"] = "Null";
    }
    await bidRequestDetailsPage.Close_Button_Loan_Details_Popup.click();
    vars["EntireRowDetailsExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["RowCount"], "2");
    await page.locator("//div[text()=\"Product\"]//following-sibling::h5").click();
    vars["ColumnCount"] = "1";
    vars["SplitCount"] = "1";
    vars["ColumnCountUI"] = "1";
    vars["HeaderSplit"] = "1";
    vars["CountofCama"] = String((String(vars["EntireRowDetailsExcel"]).split(",").length - 1));
    while (parseFloat(String(vars["ColumnCount"])) <= parseFloat(String("13"))) {
      if (String(vars["ColumnCountUI"]) <= String("5")) {
      }
    }
  }
}

/**
 * Step Group: Uploading Bid Request(From selecting batch time)
 * ID: 2032
 * Steps: 31
 */
export async function stepGroup_Uploading_Bid_RequestFrom_selecting_batch_time(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").selectOption({ index: parseInt("2") });
  vars["ExtractedPrincingReturnTime"] = await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  await page.locator("(//input[@type=\"file\"])[1]").setInputFiles([]);
  await expect(page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
  await page.locator("//span[text()=\"Continue\"]/..").waitFor({ state: 'visible' });
  await page.locator("//span[text()=\"Continue\"]/..").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  vars["RequestIDDetails"] = await page.locator("//div[text()=\"Request ID\"]/..//h5").textContent() || '';
  vars["RequestIDDetails"] = String(vars["RequestIDDetails"]).trim();
  await expect(page.locator("//div[text()=\"Status\"]/..//h5")).toContainText("Ready for Pricing");
  vars["QueuedDateTime"] = await bidRequestDetailsPage.Queued_Forbid_request_details_text_dark.textContent() || '';
  vars["ExtractedDateTime"] = String('').split("")["3"] || '';
  vars["QueuedTime"] = vars["ExtractedDateTime"];
  vars["CurrentEstTime"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "hh:mm ";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["TimeDifference"] = Math.abs(new Date('2000-01-01 ' + String(vars["QueuedTime"])).getTime() - new Date('2000-01-01 ' + String(vars["CurrentEstTime"])).getTime()) / 60000 + '';
  if (String(vars["TimeDifference"]) > String("4")) {
    vars["WaitTime"] = "4";
  } else {
    vars["WaitTime"] = vars["TimeDifference"];
  }
  vars["WaitTimeSeconds"] = (parseFloat(String(vars["WaitTime"])) * parseFloat(String("60"))).toFixed(0);
  vars["WaitTimeSeconds"] = (parseFloat(String(vars["WaitTimeSeconds"])) - parseFloat(String("60"))).toFixed(0);
  await page.waitForTimeout(parseInt(vars["WaitTimeSeconds"]) * 1000);
  await page.locator("//button/span[text()=\"Submit For Pricing\"]/..").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await bidRequestDetailsPage.Yes_Submit_Button.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await correspondentPortalPage.Bid_Requests_Side_Menu.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: Waiting until the Bid Status Changes to Price Offered
 * ID: 2033
 * Steps: 7
 */
export async function stepGroup_Waiting_until_the_Bid_Status_Changes_to_Price_Offered(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestsPage = new BidRequestsPage(page);
  while (!(await page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Status\"]//span[contains(text(),\"Price Offered\")]").isVisible())) {
    await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails2"]);
    await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
    await page.reload();
    await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  }
  await expect(page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Status\"]")).toContainText("Price Offered");
}

/**
 * Step Group: Headers Verification (Price Offered)
 * ID: 2038
 * Steps: 17
 */
export async function stepGroup_Headers_Verification_Price_Offered(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["Count"] = "1";
  vars["count"] = "1";
  vars["ExcelHeader"] = "0";
  vars["CountOfHeaders"] = String(await page.locator("(//div[contains(@aria-label,\"Sort by\")])[position() <= 8]").count());
  vars["HeaderValuesExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["ExcelHeader"], "0");
  while (parseFloat(String(vars["Count"])) <= parseFloat(String(vars["CountOfHeaders"]))) {
    vars["IndividualHeaders"] = await page.locator("((//div[contains(@aria-label,\"Sort by\")])[position() <= 8])[$|Count|]").textContent() || '';
    vars["IndividualHeadersUI"] = String(vars["IndividualHeaders"]).trim();
    vars["IndividualExcelHeaders"] = String(vars["HeaderValuesExcel"]).split(",")[parseInt(String(vars["count"]))] || '';
    vars["IndividualExcelHeaders"] = String(vars["IndividualExcelHeaders"]).trim();
    if (String(vars["IndividualHeadersUI"]) === String("BidReq.ID")) {
      vars["IndividualHeadersUI"] = "BidRequestID";
    }
    if (String(vars["IndividualHeadersUI"]) === String("ExecutionType")) {
      vars["IndividualHeadersUI"] = "Exe.Type";
    }
    expect(String(vars["IndividualHeadersUI"]).toLowerCase()).toContain(String(vars["IndividualExcelHeaders"]).toLowerCase());
    vars["Count"] = (parseFloat(String("1")) + parseFloat(String(vars["Count"]))).toFixed(0);
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
}

/**
 * Step Group: Toggle Radio Button Based on Current State
 * ID: 2104
 * Steps: 19
 */
export async function stepGroup_Toggle_Radio_Button_Based_on_Current_State(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const generalSettingPage = new GeneralSettingPage(page);
  if (true) /* Radio button Standard Off Radio button is selected */ {
    await generalSettingPage.Standard_On_RadioGlobal_Restriction.check();
    vars["ExpectedStandardState"] = "Allowed";
    vars["PreviousStandardState"] = "Disabled";
  } else if (true) /* Radio button Standard On Radio(Global Restriction) is select */ {
    await page.locator("(//label[normalize-space(text())='Standard']/parent::div//input)[2]").check();
    vars["ExpectedStandardState"] = "Disabled";
    vars["PreviousStandardState"] = "Allowed";
  }
  if (true) /* Radio button Chase On Radio(Global Restriction) is selected */ {
    await generalSettingPage.Chase_Off_RadioGlobal_Restrictions.check();
    vars["ExpectedChaseState"] = "Disabled";
    vars["PreviousChaseState"] = "Allowed";
  } else if (true) /* Radio button Chase Off Radio(Global Restrictions) is selecte */ {
    await generalSettingPage.Chase_On_RadioGlobal_Restriction.check();
    vars["ExpectedChaseState"] = "Allowed";
    vars["PreviousChaseState"] = "Disabled";
  }
  await page.locator("//button[contains(.,'Update Permissions')]").waitFor({ state: 'visible' });
  await page.locator("//button[contains(.,'Update Permissions')]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: Toggling the Radio Button based on previous state
 * ID: 2107
 * Steps: 15
 */
export async function stepGroup_Toggling_the_Radio_Button_based_on_previous_state(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const customerPermissionPage = new CustomerPermissionPage(page);
  const generalSettingPage = new GeneralSettingPage(page);
  await customerPermissionPage.Edit_Permission_Buttonfirst_record.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  if (String(vars["PreviousStandardState"]) === String("Disabled")) {
    await page.locator("(//label[normalize-space(text())='Standard']/parent::div//input)[2]").check();
  } else {
    await generalSettingPage.Standard_On_RadioGlobal_Restriction.check();
  }
  if (String(vars["PreviousChaseState"]) === String("Allowed")) {
    await generalSettingPage.Chase_On_RadioGlobal_Restriction.check();
  } else {
    await generalSettingPage.Chase_Off_RadioGlobal_Restrictions.check();
  }
  await page.locator("//button[contains(.,'Update Permissions')]").waitFor({ state: 'visible' });
  await page.locator("//button[contains(.,'Update Permissions')]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("(//td[@data-title=\"Chase Direct\"]//div)[1]")).toContainText(vars["PreviousChaseState"]);
  await expect(page.locator("(//td[@data-title=\"Standard\"]//div)[1]")).toContainText(vars["PreviousStandardState"]);
}

/**
 * Step Group: Toggle Radio Button Based on Current State and Storing the Updated Statuses 
 * ID: 2113
 * Steps: 15
 */
export async function stepGroup_Toggle_Radio_Button_Based_on_Current_State_and_Storing_the_U(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const generalSettingPage = new GeneralSettingPage(page);
  if (true) /* Radio button Standard Off Radio button is selected */ {
    await generalSettingPage.Standard_On_RadioGlobal_Restriction.check();
    vars["ExpectedStandardState"] = "Allowed";
  } else if (true) /* Radio button Standard On Radio(Global Restriction) is select */ {
    await page.locator("(//label[normalize-space(text())='Standard']/parent::div//input)[2]").check();
    vars["ExpectedStandardState"] = "Disabled";
  }
  if (true) /* Radio button Chase On Radio(Global Restriction) is selected */ {
    await generalSettingPage.Chase_Off_RadioGlobal_Restrictions.check();
    vars["ExpectedChaseState"] = "Disabled";
  } else if (true) /* Radio button Chase Off Radio(Global Restrictions) is selecte */ {
    await generalSettingPage.Chase_On_RadioGlobal_Restriction.check();
    vars["ExpectedChaseState"] = "Allowed";
  }
  await page.locator("//button[contains(.,'Update Permissions')]").waitFor({ state: 'visible' });
  await page.locator("//button[contains(.,'Update Permissions')]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: Verifying the Last Modified Data In the Right corner screen
 * ID: 2120
 * Steps: 11
 */
export async function stepGroup_Verifying_the_Last_Modified_Data_In_the_Right_corner_screen(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["CurrentLocalTime"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
    const fmt = "h:mm a";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["CurrentLocalDate"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
    const fmt = "M/d/yyyy";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  await expect(page.locator("(//div[contains(text(),\"Last Modified\")])[1]")).toContainText(vars["CurrentLocalDate"]);
  vars["LocalTimePlus1Min"] = (() => {
    const d = new Date('2000-01-01 ' + String(vars["CurrentLocalTime"]));
    d.setMinutes(d.getMinutes() + parseInt(String("1")));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: h:mm a
  })();
  vars[""] = (() => {
    const d = new Date('2000-01-01 ' + String(''));
    d.setMinutes(d.getMinutes() - parseInt(String('')));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  })();
  vars["TimeOnScreen"] = await page.locator("(//div[contains(text(),\"Last Modified\")])[1]").textContent() || '';
  if (true) /* Verify if TimeOnScreen contains ignore-case with CurrentLoca */ {
  } else if (true) /* Verify if TimeOnScreen contains ignore-case with LocalTimePl */ {
  } else {
    expect((await page.locator("(//div[contains(text(),\"Last Modified\")])[1]").textContent() || '').toLowerCase()).toContain(String('').toLowerCase());
  }
  await expect(page.locator("(//div[contains(text(),\"Last Modified\")])[1]")).toContainText("test sigma");
}

/**
 * Step Group: Verification of see difference pop up data
 * ID: 2147
 * Steps: 8
 */
export async function stepGroup_Verification_of_see_difference_pop_up_data(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await expect(page.locator("//td[@class=\"d2h-del d2h-change\"]//span[contains(text(),\"dynamicPricing\" )]")).toContainText(vars["StandardPreviousDataExp"]);
  await expect(page.locator("//td[@class=\"d2h-del d2h-change\"]//span[contains(text(),\"executionTypeFastPath\" )]")).toContainText(vars["ChasePreviousDataExp"]);
  await expect(page.locator("//td[@class=\"d2h-del d2h-change\"]//span[contains(text(),\"dynamicPricing\" )]//del")).toHaveCSS('border', "rgba(255, 182, 186, 1)");
  await expect(page.locator("//td[@class=\"d2h-del d2h-change\"]//span[contains(text(),\"executionTypeFastPath\" )]//del")).toHaveCSS('border', "rgba(255, 182, 186, 1)");
  await expect(page.locator("//td[@class=\"d2h-ins d2h-change\"]//span[contains(text(),\"executionTypeFastPath\" )]//ins")).toContainText(vars["ChaseNewDataExp"]);
  await expect(page.locator("//td[@class=\"d2h-ins d2h-change\"]//span[contains(text(),\"dynamicPricing\" )]//ins")).toContainText(vars["StandardNewDataExp"]);
  await expect(page.locator("//td[@class=\"d2h-ins d2h-change\"]//span[contains(text(),\"dynamicPricing\" )]//ins")).toHaveCSS('border', "rgba(151, 242, 149, 1)");
  await expect(page.locator("//td[@class=\"d2h-ins d2h-change\"]//span[contains(text(),\"executionTypeFastPath\" )]//ins")).toHaveCSS('border', "rgba(151, 242, 149, 1)");
}

/**
 * Step Group: Upload Bid Request from batch time selection to continue button
 * ID: 2175
 * Steps: 10
 */
export async function stepGroup_Upload_Bid_Request_from_batch_time_selection_to_continue_but(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").selectOption({ index: parseInt("2") });
  vars["ExtractedPrincingReturnTime"] = await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  await page.locator("(//input[@type=\"file\"])[1]").setInputFiles([]);
  await expect(page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
  await page.locator("//span[text()=\"Continue\"]/..").waitFor({ state: 'visible' });
  await page.locator("//span[text()=\"Continue\"]/..").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: Changing the Conventional type config
 * ID: 2176
 * Steps: 6
 */
export async function stepGroup_Changing_the_Conventional_type_config(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await stepGroup_Navigating_To_Bid_Request_Config(page, vars);
  await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").selectOption({ label: "Conventional" });
  await page.locator("//button[text()=\"Save Changes\"]").waitFor({ state: 'visible' });
  await page.locator("//button[text()=\"Save Changes\"]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]")).toHaveValue("Conventional");
}

/**
 * Step Group: Writing the data from pop up to tdp
 * ID: 2186
 * Steps: 19
 */
export async function stepGroup_Writing_the_data_from_pop_up_to_tdp(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  // [DISABLED] Click on First loan Number In table
  // await page.locator("(//tbody//tr//td)[1]//button[1]").click();
  await page.locator("(//h5[@aria-labelledby=\"bidRequestIdLabel\"])[1]").waitFor({ state: 'visible' });
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String("4"))) {
    await page.locator("(//h5[@aria-labelledby=\"bidRequestIdLabel\"])[1]").click();
    vars["ChaseFieldNameBeforeSubmit"] = await page.locator("(//div[@class=\"border-bottom p-2\"])[$|count|]").textContent() || '';
    vars["ChaseFieldNameBeforeSubmit"] = String(vars["ChaseFieldNameBeforeSubmit"]).trim();
    // [DISABLED] Store text from the element Individual Chase Value Popup into a variable ChaseValuePopupBeforeSubmit
    // vars["ChaseValuePopupBeforeSubmit"] = await page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"$|ChaseFieldNameBeforeSubmit|\")]/following-sibling::div)[1]").textContent() || '';
    vars[""] = await page.locator("//div[contains(@class,'border-bottom p-2') and contains(normalize-space(.),'$|ChaseFieldNameBeforeSubmit|')]/following-sibling::div[1]").textContent() || '';
    // [DISABLED] Store text from the element New Chase value into a variable ChaseValuePopupBeforeSubmit
    // vars["ChaseValuePopupBeforeSubmit"] = await page.locator("(//div[contains(@class,'border-bottom') and contains(.,'AmortizationTerm')])[1]/following-sibling::div[1]\n").textContent() || '';
    await page.locator("//div[contains(@class,'border-bottom p-2') and contains(normalize-space(.),'$|ChaseFieldNameBeforeSubmit|')]/following-sibling::div[1]").waitFor({ state: 'visible' });
    vars["ChaseValuePopupBeforeSubmit"] = await page.locator("//div[contains(@class,'border-bottom p-2') and contains(normalize-space(.),'$|ChaseFieldNameBeforeSubmit|')]/following-sibling::div[1]").textContent() || '';
    if (String(vars["ChaseValuePopupBeforeSubmit"]) === String("Key_blank")) {
      vars["ChaseValuePopupBeforeSubmit"] = "Null";
    // [DISABLED] Loop over data set in Loan Num Popup Details(Price Offered) from index count to index count
    // for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++)
      // [DISABLED] Write value ChaseFieldNameBeforeSubmit to Loan Num Popup Details(Price Offered) column ChaseFieldName
      // // Write to test data profile: "ChaseFieldName" = vars["ChaseFieldNameBeforeSubmit"]
      // // TODO: Test data profile writes need custom implementation
      // [DISABLED] Write value ChaseValuePopupBeforeSubmit to Loan Num Popup Details(Price Offered) column ChaseValue
      // // Write to test data profile: "ChaseValue" = vars["ChaseValuePopupBeforeSubmit"]
      // // TODO: Test data profile writes need custom implementation
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
  await bidRequestDetailsPage.Close_Button_Loan_Details_Popup.click();
}

/**
 * Step Group: Demo Storing Popup details
 * ID: 2192
 * Steps: 13
 */
export async function stepGroup_Demo_Storing_Popup_details(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  vars["ChaseFieldCountPopup"] = String(await bidRequestDetailsPage.ChaseFields_Count_Popup_Loan_Details.count());
  vars["count"] = "1";
  while (parseFloat(String(vars["count"])) <= parseFloat(String(vars["ChaseFieldCountPopup"]))) {
    await page.locator("//div[text()=\"Bid Loan Number\"]//following-sibling::h5").click();
    vars["ChaseFieldNamePopupAllLoans"] = await page.locator("(//div[@class=\"border-bottom p-2\"])[$|count|]").textContent() || '';
    vars["ChaseValuePopupAllLoans"] = await page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"$|ChaseFieldNamePopupAllLoans|\")]/following-sibling::div)[1]").textContent() || '';
    if (String(vars["ChaseValuePopupAllLoans"]) === String("Key_blank")) {
      vars["ChaseValuePopupAllLoans"] = "Null";
    }
    for (let dataIdx = parseInt(vars["count"]); dataIdx <= parseInt(vars["count"]); dataIdx++) {
      // Write to test data profile: "ChaseFieldName" = vars["ChaseFieldNamePopupAllLoans"]
      // TODO: Test data profile writes need custom implementation
      // Write to test data profile: "ChaseValue" = vars["ChaseValuePopupAllLoans"]
      // TODO: Test data profile writes need custom implementation
    }
    vars["count"] = (parseFloat(String("1")) + parseFloat(String(vars["count"]))).toFixed(0);
  }
  await bidRequestDetailsPage.Close_Button_Loan_Details_Popup.click();
}

/**
 * Step Group: Upload Bid Process from Batch time Selection to Bid Upload Pop up(Without Loan Num Update)
 * ID: 2204
 * Steps: 11
 */
export async function stepGroup_Upload_Bid_Process_from_Batch_time_Selection_to_Bid_Upload_P(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").selectOption({ index: parseInt("2") });
  vars["ExtractedPrincingReturnTime"] = await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  await page.locator("(//input[@type=\"file\"])[1]").setInputFiles(path.resolve(__dirname, 'test-data', "Bid_file_success_error_newly_updated.xlsx"));
  // [DISABLED] File Upload: Upload file File to the element UploadFile [BidRequest]
  // await page.locator("(//input[@type=\"file\"])[1]").setInputFiles([]);
  await expect(page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
  await page.locator("//span[text()=\"Continue\"]/..").waitFor({ state: 'visible' });
  await page.locator("//span[text()=\"Continue\"]/..").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
}

/**
 * Step Group: Uploading Bid Request for Real Time On
 * ID: 2219
 * Steps: 16
 */
export async function stepGroup_Uploading_Bid_Request_for_Real_Time_On(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//div[text()[normalize-space() = \"Select\"]]").click();
  await page.locator("(//div[@class=\"mb-0 overflow-hidden\"])[1]/../..//input[@placeholder=\"Search\"]").fill(testData["Company Name"]);
  await page.locator("(//span[contains(@class,'pl-2')])[1]").click();
  await page.waitForTimeout(2000);
  await expect(page.locator("//label[text()=\"Standard\"]/..//input[@type=\"checkbox\"]")).toBeVisible();
  await page.locator("(//select[contains(normalize-space(),\"Select 3 7 15\")])[1]").selectOption({ label: "3" });
  await page.locator("(//option[@value=\"3\"])[1]/../..//select[@aria-label=\"Dropdown selection\"]").waitFor({ state: 'visible' });
  await expect(page.locator("(//option[@value=\"3\"])[1]/../..//select[@aria-label=\"Dropdown selection\"]")).toHaveValue("3");
  await page.locator("//div[text()[normalize-space() = \"Select Mapping\"]]").click();
  await page.locator("//div[contains(@class, 'shadow') and contains(@class, 'dropdown-menu') and contains(@class, 'show')]//input[@placeholder=\"Search\"]").fill(testData["BidMappingID"]);
  await page.locator("//span[text()[normalize-space() =\"Deepika Aug1\"]]").waitFor({ state: 'visible' });
  await page.locator("//span[text()[normalize-space() =\"Deepika Aug1\"]]").click();
  await expect(page.locator("//button//div[text()=' @|BidMappingID| ']")).toContainText(testData["BidMappingID"]);
  await page.locator("(//input[@type=\"file\"])[1]").setInputFiles(path.resolve(__dirname, 'test-data', "Bid_Valid_file.xlsx"));
  await expect(page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]").click();
}

/**
 * Step Group: Uploading Bid Request For both Real and Differed Options
 * ID: 2222
 * Steps: 15
 */
export async function stepGroup_Uploading_Bid_Request_For_both_Real_and_Differed_Options(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//div[text()[normalize-space() = \"Select\"]]").click();
  await page.locator("(//div[@class=\"mb-0 overflow-hidden\"])[1]/../..//input[@placeholder=\"Search\"]").fill(testData["Company Name"]);
  await page.locator("(//span[contains(@class,'pl-2')])[1]").click();
  await page.waitForTimeout(2000);
  await expect(page.locator("//label[text()=\"Standard\"]/..//input[@type=\"checkbox\"]")).toBeVisible();
  await page.locator("(//select[contains(normalize-space(),\"Select 3 7 15\")])[1]").selectOption({ label: "3" });
  await page.locator("(//option[@value=\"3\"])[1]/../..//select[@aria-label=\"Dropdown selection\"]").waitFor({ state: 'visible' });
  await expect(page.locator("(//option[@value=\"3\"])[1]/../..//select[@aria-label=\"Dropdown selection\"]")).toHaveValue("3");
  await page.locator("//div[text()[normalize-space() = \"Select Mapping\"]]").click();
  await page.locator("//div[contains(@class, 'shadow') and contains(@class, 'dropdown-menu') and contains(@class, 'show')]//input[@placeholder=\"Search\"]").fill(testData["BidMappingID"]);
  await page.locator("//span[text()[normalize-space() =\"Deepika Aug1\"]]").waitFor({ state: 'visible' });
  await page.locator("//span[text()[normalize-space() =\"Deepika Aug1\"]]").click();
  await expect(page.locator("//button//div[text()=' @|BidMappingID| ']")).toContainText(testData["BidMappingID"]);
  await expect(correspondentPortalPage.Real_Time_Radio_ButtonUpload_Bid).toBeVisible();
  await expect(correspondentPortalPage.Deferred_Radio_ButtonUpload_Bid).toBeVisible();
}

/**
 * Step Group: Creating Early Config Record
 * ID: 2273
 * Steps: 16
 */
export async function stepGroup_Creating_Early_Config_Record(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const earlyConfigPage = new EarlyConfigPage(page);
  await page.locator("//button[text()[normalize-space() = \"Add New\"]]").click();
  await correspondentPortalPage.Toggle_Date_Picker_Button.click();
  await page.locator("//div[@aria-label=\"$|TomorrowsDateCalender|\"]").click();
  await expect(correspondentPortalPage.datepicker_Input).toHaveValue(vars["TomorrowsDateInput"]);
  vars["CurrentEstTime"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "hh:mm a";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["CurrentEst2hrPrior"] = (() => {
    const d = new Date('2000-01-01 ' + String(vars["CurrentEstTime"]));
    d.setMinutes(d.getMinutes() + parseInt(String("120")));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
  })();
  vars["TimeHourMin"] = String('').split("")["0"] || '';
  vars["TimeUnit"] = String('').split("")["1"] || '';
  await earlyConfigPage.Last_Batch_Time_Input_Box.fill(vars["TimeHourMin"]);
  if (String(vars["TimeUnit"]).includes(String("AM"))) {
    await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "AM" });
  } else {
    await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "PM" });
  }
  await correspondentPortalPage.Save_Config_Button.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//td[contains(text(),\" $|TomorrowDateList|\")]")).toBeVisible();
}

/**
 * Step Group: Deleting Early Config Records(other than today)
 * ID: 2283
 * Steps: 8
 */
export async function stepGroup_Deleting_Early_Config_Recordsother_than_today(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  while (await page.locator("//td[@data-title=\"Date\" and not(contains(text(),\"$|CurrentDateList|\"))]/..//button[@aria-label=\"Delete\"]").isVisible()) {
    await page.locator("//td[@data-title=\"Date\" and not(contains(text(),\"$|CurrentDateList|\"))]/..//button[@aria-label=\"Delete\"]").hover();
    await expect(page.getByText("Delete")).toBeVisible();
    await page.locator("//td[@data-title=\"Date\" and not(contains(text(),\"$|CurrentDateList|\"))]/..//button[@aria-label=\"Delete\"]").click();
    await correspondentPortalPage.Yes_Delete_ButtonEarly_config.click();
    await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
    // [DISABLED] Wait until the element Early Conf Del Button other than today is not visible
    // await page.locator("//td[@data-title=\"Date\" and not(contains(text(),\"$|CurrentDateList|\"))]/..//button[@aria-label=\"Delete\"]").waitFor({ state: 'hidden' });
  }
  await expect(page.locator("//td[@data-title=\"Date\" and not(contains(text(),\"$|CurrentDateList|\"))]/..//button[@aria-label=\"Delete\"]")).toBeVisible();
}

/**
 * Step Group: Splitting the amount through cama from the excel cell value
 * ID: 2301
 * Steps: 10
 */
export async function stepGroup_Splitting_the_amount_through_cama_from_the_excel_cell_value(page: import('@playwright/test').Page, vars: Record<string, string>) {
  if (String(vars["indexExcel"]) === String("13")) {
    vars["CountofCama"] = String((String(vars["CellValuesUI"]).split(",").length - 1));
    vars["count"] = "1";
    while (parseFloat(String(vars["count"])) < parseFloat(String(vars["CountofCama"]))) {
      // [DISABLED] Split the RowDataExcel with the , and store the value from the indexExcel in the CellValueInExcel
      // vars["CellValueInExcel"] = String(vars["RowDataExcel"]).split(",")[parseInt(String(vars["indexExcel"]))] || '';
      vars["indexExcel"] = (parseFloat(String(vars["indexExcel"])) + parseFloat(String("1"))).toFixed(0);
      vars["CellValueInExcel2"] = String(vars["RowDataExcel"]).split(",")[parseInt(String(vars["indexExcel"]))] || '';
      vars["CellValueInExcel"] = String(vars["CellValueInExcel"]) + "," + String(vars["CellValueInExcel2"]);
      vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
    // [DISABLED] Concate CellValueInExcel and CellValueInExcel2 with SpecialCharacter , and store into a variable CellValueInExcel
    // vars["CellValueInExcel"] = String(vars["CellValueInExcel"]) + "," + String(vars["CellValueInExcel2"]);
    }
  }
}

/**
 * Step Group: Verification of Data from Excel to UI - Excluding Headers (Commitments) - 2
 * ID: 2305
 * Steps: 25
 */
export async function stepGroup_Verification_of_Data_from_Excel_to_UI_Excluding_Headers_Comm(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const commitmentListPage = new CommitmentListPage(page);
  vars["RowCount"] = String(await commitmentListPage.Total_Rows_Count_UITotal_Loans.count());
  vars["RowCountUI"] = "1";
  vars["RowCountExcel"] = "1";
  while (parseFloat(String(vars["RowCountUI"])) <= parseFloat(String(vars["RowCount"]))) {
    vars["ColumnCountUI"] = "2";
    vars["indexExcel"] = "1";
    vars["RowDataExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["RowCountExcel"], "0");
    while (parseFloat(String(vars["ColumnCountUI"])) <= parseFloat(String("13"))) {
      vars["CellValueInExcel"] = String(vars["RowDataExcel"]).split(",")[parseInt(String(vars["indexExcel"]))] || '';
      vars["HeadersUI"] = await page.locator("(//div[@role=\"button\"])[$|indexExcel|]").textContent() || '';
      vars["HeadersUI"] = String(vars["HeadersUI"]).trim();
      vars["CellValuesUI "] = await page.locator("(//tbody//tr[$|RowCountUI|]//td)[$|ColumnCountUI|]").textContent() || '';
      vars["CellValuesUI"] = String(vars["CellValuesUI "]).trim();
      if (String(vars["indexExcel"]) === String("5")) {
        vars["CountofCama"] = String((String(vars["CellValuesUI"]).split(",").length - 1));
        vars["count"] = "1";
        while (parseFloat(String(vars["count"])) < parseFloat(String(vars["CountofCama"]))) {
          // [DISABLED] Split the RowDataExcel with the , and store the value from the indexExcel in the CellValueInExcel
          // vars["CellValueInExcel"] = String(vars["RowDataExcel"]).split(",")[parseInt(String(vars["indexExcel"]))] || '';
          vars["indexExcel"] = (parseFloat(String(vars["indexExcel"])) + parseFloat(String("1"))).toFixed(0);
          vars["CellValueInExcel2"] = String(vars["RowDataExcel"]).split(",")[parseInt(String(vars["indexExcel"]))] || '';
          vars["CellValueInExcel"] = String(vars["CellValueInExcel"]) + "," + String(vars["CellValueInExcel2"]);
          vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
        // [DISABLED] Concate CellValueInExcel and CellValueInExcel2 with SpecialCharacter , and store into a variable CellValueInExcel
        // vars["CellValueInExcel"] = String(vars["CellValueInExcel"]) + "," + String(vars["CellValueInExcel2"]);
        }
      }
      await stepGroup_Splitting_the_amount_through_cama_from_the_excel_cell_value(page, vars);
      vars["CellValueInExcel"] = String(vars["CellValueInExcel"]).trim();
    }
  }
}

/**
 * Step Group: Adjust Time by adding and subtracting one min from Last Commited Time
 * ID: 2314
 * Steps: 6
 */
export async function stepGroup_Adjust_Time_by_adding_and_subtracting_one_min_from_Last_Comm(page: import('@playwright/test').Page, vars: Record<string, string>) {
  vars["LastBidCommitTimeAfterUnCommitPlus1"] = (() => {
    const d = new Date('2000-01-01 ' + String(vars["LastBidCommitTimeAfterUncommit"]));
    d.setMinutes(d.getMinutes() + parseInt(String("1")));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: h:mm a
  })();
  vars[""] = (() => {
    const d = new Date('2000-01-01 ' + String(''));
    d.setMinutes(d.getMinutes() - parseInt(String('')));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  })();
  if (String(vars["BidCommitTimeFirstLoan"]) === String(vars["LastBidCommitTimeAfterUncommit"])) {
  } else if (String(vars["BidCommitTimeFirstLoan"]) === String(vars["LastBidCommitTimeAfterUnCommitPlus1"])) {
  } else {
    expect(String(vars["BidCommitTimeFirstLoan"])).toBe(vars["LastBidCommitTimeAfterUnCommitMinus1"]);
  }
}

/**
 * Step Group: Modifying batches with 5 min prior
 * ID: 2343
 * Steps: 15
 */
export async function stepGroup_Modifying_batches_with_5_min_prior(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const testData: Record<string, string> = {}; // TODO: Load from test data profile
  await page.locator("//button[text()[normalize-space() = \"Modify Batch Intervals\"]]").click();
  await expect(page.getByText("Edit Batch Timing")).toBeVisible();
  vars["CurrentTime"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "hh:mm a";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["CurrentTime"] = (() => {
    const d = new Date('2000-01-01 ' + String(vars["CurrentTime"]));
    d.setMinutes(d.getMinutes() + parseInt(String("5")));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
  })();
  await stepGroup_Separating_Hours_and_minutes_In_time_Current_EST_time(page, vars);
  await page.locator("//span[text()[normalize-space() = \"H\"]]/preceding-sibling::input[@placeholder=\"0\"]").fill(vars["Time_Hour"]);
  await page.locator("(//input[@placeholder=\"00\"])[1]").fill(vars["Time_Min"]);
  await stepGroup_selecting_time_unit_bulk_batch(page, vars);
  await page.locator("//div[text()[normalize-space() = \"Time Interval\"]]/following-sibling::div[contains(@class, 'custom-input')]//input[@placeholder=\"0\"]").fill(testData["Time Interval"]);
  await correspondentPortalPage.No_Of_Batches.fill(testData["NO of Batches"]);
  await expect(page.locator("(//input[@type=\"radio\"])[1]")).toBeEnabled();
  await page.locator("//span[text()[normalize-space() = \"Modify Batch\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//div[text()[normalize-space() = \"Modified batch timings successfully\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Ok\"]]").click();
}

/**
 * Step Group: Selecting Second Enabled Batch Time If the Condition is failed
 * ID: 2370
 * Steps: 8
 */
export async function stepGroup_Selecting_Second_Enabled_Batch_Time_If_the_Condition_is_fail(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestPage = new BidRequestPage(page);
  vars["EnabledTime"] = await bidRequestPage.Enabled_Time.textContent() || '';
  vars["CurrentEstTime"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "hh:mm a";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["TimeDiff"] = Math.abs(new Date('2000-01-01 ' + String(vars["CurrentEstTime"])).getTime() - new Date('2000-01-01 ' + String(vars["EnabledTime"])).getTime()) / 60000 + '';
  if (String(vars["TimeDiff"]) >= String("4")) {
    await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").selectOption({ label: vars["EnabledTime"] });
  } else {
    vars["SecondEnabledTime"] = await page.locator("(//option[@aria-disabled=\"false\"])[2]").textContent() || '';
    await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").selectOption({ label: vars["SecondEnabledTime"] });
  }
}

/**
 * Step Group: Creating a new bid for price offered status with freedom company
 * ID: 2400
 * Steps: 54
 */
export async function stepGroup_Creating_a_new_bid_for_price_offered_status_with_freedom_com(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const bidRequestsPage = new BidRequestsPage(page);
  // [DISABLED] Login to CORR Portal
  // await stepGroup_Login_to_CORR_Portal(page, vars);
  await stepGroup_Deleting_Early_Config_Report_If_Present(page, vars);
  await stepGroup_Navigating_to_Bulk_Batch_Timing(page, vars);
  await stepGroup_Modifying_The_batch_Intervals_with_current_est_time(page, vars);
  await stepGroup_Navigating_to_Upload_New_Bid_Request(page, vars);
  await stepGroup_Uploading_Bid_Request(page, vars);
  // [DISABLED] Uploading Bid Request(Latest)
  // await stepGroup_Uploading_Bid_RequestLatest(page, vars);
  await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").selectOption({ index: parseInt("2") });
  vars["ExtractedPrincingReturnTime"] = await page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]").evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
  await page.locator("(//input[@type=\"file\"])[1]").setInputFiles([]);
  await expect(page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]")).toBeVisible();
  await page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await page.getByText("Bid Upload Progress").waitFor({ state: 'visible' });
  await page.locator("//span[text()=\"Continue\"]/..").waitFor({ state: 'visible' });
  await page.locator("//span[text()=\"Continue\"]/..").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  vars["RequestIDDetails"] = await page.locator("//div[text()=\"Request ID\"]/..//h5").textContent() || '';
  vars["RequestIDDetails"] = String(vars["RequestIDDetails"]).trim();
  await expect(page.locator("//div[text()=\"Status\"]/..//h5")).toContainText("Ready for Pricing");
  vars["QueuedDateTime"] = await bidRequestDetailsPage.Queued_Forbid_request_details_text_dark.textContent() || '';
  vars["ExtractedDateTime"] = String('').split("")["3"] || '';
  vars["QueuedTime"] = vars["ExtractedDateTime"];
  vars["CurrentEstTime"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "hh:mm ";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["TimeDifference"] = Math.abs(new Date('2000-01-01 ' + String(vars["QueuedTime"])).getTime() - new Date('2000-01-01 ' + String(vars["CurrentEstTime"])).getTime()) / 60000 + '';
  // [DISABLED] Verify if TimeDifference > 4
  // if (String(vars["TimeDifference"]) > String("4"))
    // [DISABLED] Store 4 in WaitTime
    // vars["WaitTime"] = "4";
  // [DISABLED] Step group
  // // TODO: No template - Unknown step
    // [DISABLED] Store TimeDifference in WaitTime
    // vars["WaitTime"] = vars["TimeDifference"];
  // [DISABLED] Perform multiplication on WaitTime and 60 and store the result inside a WaitTimeSeconds considering 0 decimal places
  // vars["WaitTimeSeconds"] = (parseFloat(String(vars["WaitTime"])) * parseFloat(String("60"))).toFixed(0);
  // [DISABLED] Perform subtraction on WaitTimeSeconds and 60 and store the result inside a WaitTimeSeconds considering 0 decimal places
  // vars["WaitTimeSeconds"] = (parseFloat(String(vars["WaitTimeSeconds"])) - parseFloat(String("60"))).toFixed(0);
  // [DISABLED] Wait for WaitTimeSeconds seconds
  // await page.waitForTimeout(parseInt(vars["WaitTimeSeconds"]) * 1000);
  await page.locator("//button/span[text()=\"Submit For Pricing\"]/..").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await bidRequestDetailsPage.Yes_Submit_Button.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await correspondentPortalPage.Bid_Requests_Side_Menu.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  while (!(await page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Status\"]//span[contains(text(),\"Price Offered\")]").isVisible())) {
    await page.reload();
    await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  }
  vars["StatusOnScreen"] = await page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Status\"]").textContent() || '';
  if (String(vars["StatusOnScreen"]).includes(String("Price Offered"))) {
  } else {
    while (!(await page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Status\"]//span[contains(text(),\"Price Offered\")]").isVisible())) {
      await page.reload();
      await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    }
  }
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Status\"]")).toContainText("Price Offered");
  await page.reload();
  await page.waitForLoadState('networkidle');
}

/**
 * Step Group: Updating Back Username in Company Config
 * ID: 2404
 * Steps: 11
 */
export async function stepGroup_Updating_Back_Username_in_Company_Config(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
  await correspondentPortalPage.Company_ConfigGenral_settings.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await correspondentPortalPage.Internal_User_Username_Replacement_Input.click();
  await correspondentPortalPage.Internal_User_Username_Replacement_Input.fill(String(vars["UserName"]));
  if (true) /* Element Save Settings is enabled */ {
    await page.locator("//div[contains(@class, 'scrollable-page')]/div[1]/app-general-settings-container[1]/div[2]/div[1]/div[2]/app-company-config-container[1]/app-company-config[1]/div[2]//button").click();
    await page.getByText("Company config updated successfully!").waitFor({ state: 'visible' });
    await page.locator("//span[text()[normalize-space() = \"Ok\"]]").waitFor({ state: 'visible' });
    await page.locator("//span[text()[normalize-space() = \"Ok\"]]").click();
  }
}

/**
 * Step Group: updating back text to Delegated Conventional Mandatory
 * ID: 2410
 * Steps: 7
 */
export async function stepGroup_updating_back_text_to_Delegated_Conventional_Mandatory(page: import('@playwright/test').Page, vars: Record<string, string>) {
  await stepGroup_Navigating_To_Bid_Request_Config(page, vars);
  await page.locator("(//app-single-select-dropdown   [.//text()[normalize-space()='Conventional']]   /following-sibling::input[@type='text'])[3]").fill(String(vars["PosConventionalTextBeforeEdit"]));
  if (true) /* Element Save Changes Button is enabled */ {
    await page.locator("//button[text()=\"Save Changes\"]").waitFor({ state: 'visible' });
    await page.locator("//button[text()=\"Save Changes\"]").click();
    await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
    await expect(page.locator("(//app-single-select-dropdown   [.//text()[normalize-space()='Conventional']]   /following-sibling::input[@type='text'])[3]")).toHaveValue(vars["PosConventionalTextBeforeEdit"]);
  }
}

/**
 * Step Group: Deleting added email from email config
 * ID: 2420
 * Steps: 5
 */
export async function stepGroup_Deleting_added_email_from_email_config(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestDetailsPage = new BidRequestDetailsPage(page);
  await page.locator("(//td[@data-title=\"Email\" and contains(text(),\"$|ExpectedEmail|\")])/..//button[2]").click();
  await page.locator("//button[contains(@aria-label,\"Yes, Go ahead.\")]").waitFor({ state: 'visible' });
  await page.locator("//button[contains(@aria-label,\"Yes, Go ahead.\")]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await bidRequestDetailsPage.Close_Button_Loan_Details_Popup.click();
}

/**
 * Step Group: Verifying the Audit Time and Date
 * ID: 2436
 * Steps: 10
 */
export async function stepGroup_Verifying_the_Audit_Time_and_Date(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const generalSettingPage = new GeneralSettingPage(page);
  vars["CurrentLocalTime"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
    const fmt = "hh:mm a";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["CurrentLocalDate"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
    const fmt = "MM/d/yyyy";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  await expect(generalSettingPage.Created_Date_Time_Column_Data).toContainText(vars["CurrentLocalDate"]);
  vars["LocalTimePlus1Min"] = (() => {
    const d = new Date('2000-01-01 ' + String(vars["CurrentLocalTime"]));
    d.setMinutes(d.getMinutes() + parseInt(String("1")));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: h:mm a
  })();
  vars[""] = (() => {
    const d = new Date('2000-01-01 ' + String(''));
    d.setMinutes(d.getMinutes() - parseInt(String('')));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  })();
  vars["TimeOnScreen"] = await generalSettingPage.Created_Date_Time_Column_Data.textContent() || '';
  if (true) /* Verify if TimeOnScreen contains ignore-case with CurrentLoca */ {
  } else if (true) /* Verify if TimeOnScreen contains ignore-case with LocalTimePl */ {
  } else {
    expect((await generalSettingPage.Created_Date_Time_Column_Data.textContent() || '').toLowerCase()).toContain(String('').toLowerCase());
  }
}

/**
 * Step Group: Verifying the Username and Config Type in Audit List Screen
 * ID: 2440
 * Steps: 2
 */
export async function stepGroup_Verifying_the_Username_and_Config_Type_in_Audit_List_Screen(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const generalSettingPage = new GeneralSettingPage(page);
  await expect(generalSettingPage.First_User_Name_UI).toContainText("testsigma_internal\t\r");
  await expect(generalSettingPage.Config_Type_Column_Data).toContainText("Global Restrictions Config");
}

/**
 * Step Group: Verifying the side by side data in see difference pop up(Audit Log)
 * ID: 2441
 * Steps: 7
 */
export async function stepGroup_Verifying_the_side_by_side_data_in_see_difference_pop_upAudi(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const seeDifferencePopUpPage = new SeeDifferencePopUpPage(page);
  await correspondentPortalPage.See_the_difference_Button.click();
  await page.locator("//button[text()[normalize-space() = \"Side by side\"]]").waitFor({ state: 'visible' });
  await expect(page.locator("//button[text()[normalize-space() = \"Side by side\"]]")).toBeVisible();
  await expect(page.locator("//button[text()[normalize-space() = \"Line by line\"]]")).toBeVisible();
  await expect(seeDifferencePopUpPage.Side_by_Side_Tables).toBeVisible();
  vars["SidebySideTablesCount"] = String(await seeDifferencePopUpPage.Side_by_Side_Tables.count());
  expect(String(vars["SidebySideTablesCount"])).toBe("2");
}

/**
 * Step Group: Verifying the Line by line data in see difference pop up(Audit Log)
 * ID: 2442
 * Steps: 6
 */
export async function stepGroup_Verifying_the_Line_by_line_data_in_see_difference_pop_upAudi(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const seeDifferencePopUpPage = new SeeDifferencePopUpPage(page);
  await page.locator("//button[text()[normalize-space() = \"Line by line\"]]").click();
  await page.locator("//button[text()[normalize-space() = \"Side by side\"]]").waitFor({ state: 'visible' });
  await expect(page.locator("//button[text()[normalize-space() = \"Line by line\"]]")).toBeVisible();
  await seeDifferencePopUpPage.Line_by_line_Table.waitFor({ state: 'visible' });
  vars["LineByLineTableCount"] = String(await seeDifferencePopUpPage.Line_by_line_Table.count());
  expect(String(vars["LineByLineTableCount"])).toBe("1");
}

/**
 * Step Group: Waiting in the 2 while loops for the price offered status update.
 * ID: 2460
 * Steps: 19
 */
export async function stepGroup_Waiting_in_the_2_while_loops_for_the_price_offered_status_up(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const bidRequestsPage = new BidRequestsPage(page);
  while (!(await page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Status\"]//span[contains(text(),\"Price Offered\")]").isVisible())) {
    await page.reload();
    await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
    await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
    await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  }
  vars["CurrentEstTime"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "hh:mm a";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["StatusOnScreen"] = await page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Status\"]").textContent() || '';
  if (String(vars["StatusOnScreen"]).includes(String("Price Offered"))) {
  } else {
    while (!(await page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Status\"]//span[contains(text(),\"Price Offered\")]").isVisible())) {
      await page.reload();
      await expect(bidRequestsPage.Search_by_Bid_Request_ID_Field).toBeVisible();
      await bidRequestsPage.Search_by_Bid_Request_ID_Field.fill(vars["RequestIDDetails"]);
      await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
    }
  }
  vars["CurrentEstTime"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "hh:mm a";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["StatusOnScreen"] = await page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Status\"]").textContent() || '';
  await expect(page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Status\"]")).toContainText("Price Offered");
  await page.reload();
  await page.waitForLoadState('networkidle');
}

/**
 * Step Group: Creating an Early Config Record
 * ID: 2463
 * Steps: 25
 */
export async function stepGroup_Creating_an_Early_Config_Record(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const correspondentPortalPage = new CorrespondentPortalPage(page);
  const earlyConfigPage = new EarlyConfigPage(page);
  await correspondentPortalPage.Early_Close_Config.click();
  vars["CurrentDateList"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "yyyy/M/d";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["CurrentDateCalender"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "d-M-yyyy";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["CurrentDateInput"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "yyyy-MM-dd";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["TomorrowDateList"] = (() => {
    const d = new Date(String(vars["CurrentDateList"]));
    d.setDate(d.getDate() + parseInt(String("1")));
    const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
    return "yyyy/M/d".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
  })();
  vars["TomorrowsDateCalender"] = (() => {
    const d = new Date(String(vars["TomorrowDateList"]));
    const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
    return "d-M-yyyy".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
  })();
  // [DISABLED] Convert the date from the TomorrowDateList in d-M-yyyy to yyyy-MM-dd and store it in a runtime TomorrowDateInput
  // vars["TomorrowDateInput"] = (() => {
  //   const d = new Date(String(vars["TomorrowDateList"]));
  //   const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
  //   return "yyyy-MM-dd".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
  // })();
  vars["TomorrowsDateInput"] = (() => {
    const d = new Date(String(vars["CurrentDateInput"]));
    d.setDate(d.getDate() + parseInt(String("1")));
    const _p = { yyyy: String(d.getFullYear()), yy: String(d.getFullYear()).slice(-2), MM: String(d.getMonth()+1).padStart(2,'0'), M: String(d.getMonth()+1), dd: String(d.getDate()).padStart(2,'0'), d: String(d.getDate()), HH: String(d.getHours()).padStart(2,'0'), hh: String(d.getHours()%12||12).toString().padStart(2,'0'), h: String(d.getHours()%12||12), mm: String(d.getMinutes()).padStart(2,'0'), ss: String(d.getSeconds()).padStart(2,'0'), a: d.getHours() >= 12 ? 'PM' : 'AM' };
    return "yyyy-MM-dd".replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);
  })();
  await page.locator("//button[text()[normalize-space() = \"Add New\"]]").click();
  await correspondentPortalPage.Toggle_Date_Picker_Button.click();
  await page.locator("//div[@aria-label=\"$|TomorrowsDateCalender|\"]").click();
  await expect(correspondentPortalPage.datepicker_Input).toHaveValue(vars["TomorrowsDateInput"]);
  vars["CurrentEstTime"] = (() => {
    const d = new Date();
    const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC-05:00" };
    const fmt = "hh:mm a";
    // Map Java date format to Intl parts
    const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);
    const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));
    return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));
  })();
  vars["CurrentEst2hrPrior"] = (() => {
    const d = new Date('2000-01-01 ' + String(vars["CurrentEstTime"]));
    d.setMinutes(d.getMinutes() + parseInt(String("120")));
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format: hh:mm a
  })();
  // [DISABLED] Add 2 and 0 to date CurrentEstTime and format hh:mm a and store CurrentEst2hrPrior
  // vars[""] = (() => {
  //   const d = new Date(String(''));
  //   d.setMinutes(d.getMinutes() + parseInt(String('')));
  //   return d.toLocaleString('en-US');
  // })();
  vars["TimeHourMin"] = String('').split("")["0"] || '';
  vars["TimeUnit"] = String('').split("")["1"] || '';
  await earlyConfigPage.Last_Batch_Time_Input_Box.fill(vars["TimeHourMin"]);
  if (String(vars["TimeUnit"]).includes(String("AM"))) {
    await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "AM" });
  } else {
    await earlyConfigPage.Last_Batch_Time_Unit_Dropdown.selectOption({ label: "PM" });
  }
  await correspondentPortalPage.Save_Config_Button.click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//td[contains(text(),\" $|TomorrowDateList|\")]")).toBeVisible();
}

/**
 * Step Group: Add to Commit an Loan Num And Verifying The Committed Loan Num
 * ID: 2472
 * Steps: 14
 */
export async function stepGroup_Add_to_Commit_an_Loan_Num_And_Verifying_The_Committed_Loan_N(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const priceOfferedPage = new PriceOfferedPage(page);
  const commitmentListPage = new CommitmentListPage(page);
  await page.locator("//div[text()[normalize-space() = \"Total Loans\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await priceOfferedPage.Required_Loan_Num.check();
  vars["CommittedCorrLoan"] = await page.locator("//tr[contains(@class,\"row\")]//button[contains(@class,\"btn bg-transparent text-primary\")][1]").textContent() || '';
  await commitmentListPage.Uncommit_Selected_Button.waitFor({ state: 'visible' });
  await commitmentListPage.Uncommit_Selected_Button.click();
  await page.locator("//div[contains(text(),\"Commitment Order\")]").click();
  await page.locator("//span[text()[normalize-space() = \"Yes, Commit\"]]").click();
  await page.locator("//button[text()[normalize-space() = \"Okay\"]]").waitFor({ state: 'visible' });
  await page.locator("//button[text()[normalize-space() = \"Okay\"]]").click();
  await page.locator("//span[contains(text(),\" Total Committed Loans\")]").waitFor({ state: 'visible' });
  await page.locator("//span[contains(text(),\" Total Committed Loans\")]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await expect(page.locator("//div[text()=\"Commit. ID\"]//following-sibling::h5[text()=\"$|CommitID|\"]//ancestor::div[contains(@class,\"accordion-item\")]//div[@class=\"accordion-body\"]//tbody//button[\"$|CommittedCorrLoan|\"]")).toBeVisible();
}

/**
 * Step Group: Revert The Commitment Correction Cutoff Time
 * ID: 2473
 * Steps: 8
 */
export async function stepGroup_Revert_The_Commitment_Correction_Cutoff_Time(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const priceOfferedPage = new PriceOfferedPage(page);
  await page.locator("//span[text()[normalize-space() = \"Administration\"]]").click();
  await page.locator("//span[text()[normalize-space() = \"General Settings\"]]").click();
  await page.locator("//span[contains(@class,'circle')]").waitFor({ state: 'hidden' });
  await priceOfferedPage.Other_Config.click();
  await page.locator("//label[contains(text(),\"Commit Correction Cut-off\")]//following::input[contains(@id,\"CorrectionCutOfHours\")]").waitFor({ state: 'visible' });
  await page.locator("//label[contains(text(),\"Commit Correction Cut-off\")]//following::input[contains(@id,\"CorrectionCutOfHours\")]").fill(String(vars["ReplacingCutoffTime"]));
  if (true) /* Element Save Changes Button is enabled */ {
    await page.locator("//button[normalize-space(text())=\"Save changes\" or contains(text(),\"Save Changes\")]").click();
  }
}

/**
 * Step Group: Verification of Data from Excel to UI - Excluding Headers (Commitments) - 3
 * ID: 2498
 * Steps: 25
 */
export async function stepGroup_Verification_of_Data_from_Excel_to_UI_Excluding_Headers_Comm_2(page: import('@playwright/test').Page, vars: Record<string, string>) {
  const commitmentListPage = new CommitmentListPage(page);
  vars["RowCount"] = String(await commitmentListPage.Total_Rows_Count_UITotal_Loans.count());
  vars["RowCountUI"] = "1";
  vars["RowCountExcel"] = "1";
  while (parseFloat(String(vars["RowCountUI"])) <= parseFloat(String(vars["RowCount"]))) {
    vars["ColumnCountUI"] = "2";
    vars["indexExcel"] = "1";
    vars["RowDataExcel"] = excelHelper.readRow(vars['_lastDownloadPath'] || '', vars["RowCountExcel"], "0");
    while (parseFloat(String(vars["ColumnCountUI"])) <= parseFloat(String("13"))) {
      vars["CellValueInExcel"] = String(vars["RowDataExcel"]).split(",")[parseInt(String(vars["indexExcel"]))] || '';
      vars["HeadersUI"] = await page.locator("(//div[@role=\"button\"])[$|indexExcel|]").textContent() || '';
      vars["HeadersUI"] = String(vars["HeadersUI"]).trim();
      vars["CellValuesUI "] = await page.locator("(//tbody//tr[$|RowCountUI|]//td)[$|ColumnCountUI|]").textContent() || '';
      vars["CellValuesUI"] = String(vars["CellValuesUI "]).trim();
      if (String(vars["indexExcel"]) === String("5")) {
        vars["CountofCama"] = String((String(vars["CellValuesUI"]).split(",").length - 1));
        vars["count"] = "1";
        while (parseFloat(String(vars["count"])) < parseFloat(String(vars["CountofCama"]))) {
          // [DISABLED] Split the RowDataExcel with the , and store the value from the indexExcel in the CellValueInExcel
          // vars["CellValueInExcel"] = String(vars["RowDataExcel"]).split(",")[parseInt(String(vars["indexExcel"]))] || '';
          vars["indexExcel"] = (parseFloat(String(vars["indexExcel"])) + parseFloat(String("1"))).toFixed(0);
          vars["CellValueInExcel2"] = String(vars["RowDataExcel"]).split(",")[parseInt(String(vars["indexExcel"]))] || '';
          vars["CellValueInExcel"] = String(vars["CellValueInExcel"]) + "," + String(vars["CellValueInExcel2"]);
          vars["count"] = (parseFloat(String(vars["count"])) + parseFloat(String("1"))).toFixed(0);
        // [DISABLED] Concate CellValueInExcel and CellValueInExcel2 with SpecialCharacter , and store into a variable CellValueInExcel
        // vars["CellValueInExcel"] = String(vars["CellValueInExcel"]) + "," + String(vars["CellValueInExcel2"]);
        }
      }
      await stepGroup_Splitting_the_amount_through_cama_from_the_excel_cell_value(page, vars);
      vars["CellValueInExcel"] = String(vars["CellValueInExcel"]).trim();
    }
  }
}
