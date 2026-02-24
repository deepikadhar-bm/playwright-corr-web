// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BackButtonPage } from '../../../src/pages/correspondant/back-button';
import { BidMapPage } from '../../../src/pages/correspondant/bid-map';
import { BidMapsCompanyDropdownPage } from '../../../src/pages/correspondant/bid-maps-company-dropdown';
import { CorrespondentPortal8Page } from '../../../src/pages/correspondant/correspondent-portal-8';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { HeadingCreateNewMapPage } from '../../../src/pages/correspondant/heading-create-new-map';
import { P2142530YrFreddieMacFixedDropdownPage } from '../../../src/pages/correspondant/p-2142530-yr-freddie-mac-fixed-dropdown';
import { ProceedWithoutSavingButtonPage } from '../../../src/pages/correspondant/proceed-without-saving-button';
import { SelectAllCheckboxPage } from '../../../src/pages/correspondant/select-all-checkbox';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { YouHaveUnsavedChangesIfYouLeaveYourChangesPage } from '../../../src/pages/correspondant/you-have-unsaved-changes-if-you-leave-your-changes';
import { CorrespondentPortal7Page } from '../../../src/pages/correspondant/correspondent-portal-7';

test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let backButtonPage: BackButtonPage;
  let bidMapPage: BidMapPage;
  let bidMapsCompanyDropdownPage: BidMapsCompanyDropdownPage;
  let correspondentPortal7Page: CorrespondentPortal7Page;
  let correspondentPortal8Page: CorrespondentPortal8Page;
  let correspondentPortalPage: CorrespondentPortalPage;
  let headingCreateNewMapPage: HeadingCreateNewMapPage;
  let p2142530YrFreddieMacFixedDropdownPage: P2142530YrFreddieMacFixedDropdownPage;
  let proceedWithoutSavingButtonPage: ProceedWithoutSavingButtonPage;
  let selectAllCheckboxPage: SelectAllCheckboxPage;
  let spinnerPage: SpinnerPage;
  let youHaveUnsavedChangesIfYouLeaveYourChangesPage: YouHaveUnsavedChangesIfYouLeaveYourChangesPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    backButtonPage = new BackButtonPage(page);
    bidMapPage = new BidMapPage(page);
    bidMapsCompanyDropdownPage = new BidMapsCompanyDropdownPage(page);
    correspondentPortal7Page = new CorrespondentPortal7Page(page);
    correspondentPortal8Page = new CorrespondentPortal8Page(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    headingCreateNewMapPage = new HeadingCreateNewMapPage(page);
    p2142530YrFreddieMacFixedDropdownPage = new P2142530YrFreddieMacFixedDropdownPage(page);
    proceedWithoutSavingButtonPage = new ProceedWithoutSavingButtonPage(page);
    selectAllCheckboxPage = new SelectAllCheckboxPage(page);
    spinnerPage = new SpinnerPage(page);
    youHaveUnsavedChangesIfYouLeaveYourChangesPage = new YouHaveUnsavedChangesIfYouLeaveYourChangesPage(page);
  });

  test('REG_TS01_TC03_Verify that if user selects two companies \\\"A and B\\\"  and if Company A has both standard and chase execution type, and company B has only standard execution type -> Now if user select b', async ({ page }) => {
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await stepGroups.stepGroup_Navigation_to_Customer_Permission(page, vars);
    await stepGroups.stepGroup_Store_Company_Names_from_Company_Permissions(page, vars);
    await correspondentPortalPage.Administration_Menu.click();
    await correspondentPortalPage.Bid_Maps_Menu.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Add_New_Mapping_Button.click();
    await expect(headingCreateNewMapPage.Create_New_Map).toBeVisible();
    vars["Create New Map"] = new Date().toLocaleDateString('en-US') /* format: dd/MM/yyyy:HH:mm:ss */;
    vars["Create New Map"] = "Testsigma_" + vars["Create New Map"];
    await correspondentPortalPage.Create_New_Map_Field.fill(vars["Create New Map"]);
    vars["BidMap"] = await correspondentPortalPage.Create_New_Map_Field.inputValue() || '';
    await correspondentPortalPage.Create_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(p2142530YrFreddieMacFixedDropdownPage.Bid_Maps_Name).toContainText(vars["Create New Map"]);
    await correspondentPortalPage.Select_Companys_Dropdown.click();
    await bidMapPage.Required_Company_Checkbox_Bidmap_Company_dropdown.check();
    vars["SelectedCompanyName"] = await correspondentPortalPage.Selected_Company_Name.textContent() || '';
    vars["NotSelectedCompanyName"] = await correspondentPortalPage.Not_Selected_Company_Name.textContent() || '';
    // [DISABLED] Split the NotSelectedCompanyName with the - and store the value from the 1 in the NotSelectedCompany
    // vars["NotSelectedCompany"] = String(vars["NotSelectedCompanyName"]).split("-")["1"] || '';
    // [DISABLED] Split the NotSelectedCompanyName with the - and store the value from the 2 in the NotSelectedCcode
    // vars["NotSelectedCcode"] = String(vars["NotSelectedCompanyName"]).split("-")["2"] || '';
    // [DISABLED] Remove Special char NotSelectedCompany from NotSelectedCompanyName and store it in runtime NotSelectedCcode
    // vars["NotSelectedCcode"] = String(vars["NotSelectedCompanyName"]).replace(/NotSelectedCompany/g, '');
    // [DISABLED] Store key_blank in Space
    // vars["Space"] = "key_blank";
    // [DISABLED] Store StringFunctions :: Concat in NotSelectedCompanyName
    // vars["NotSelectedCompanyName"] = vars["NotSelectedCompany"] + "," + vars["Space"] + "-" + vars["Space"] + vars["NotSelectedCcode"];
    // [DISABLED] Replace , with Space in the given text NotSelectedCompanyName and store into NotSelectedCompanyName
    // vars[""] = String("NotSelectedCompanyName").replace("", "");
    await expect(correspondentPortalPage.Show_Selected_Button).toBeVisible();
    await correspondentPortalPage.Show_Selected_Button.click();
    await expect(correspondentPortalPage.Dropdown_Company_for_Selected).toContainText(vars["SelectedCompanyName"]);
    await expect(page.getByText(vars["NotSelectedCompanyName"])).not.toBeVisible();
    await expect(correspondentPortalPage.Show_All_Button).toBeVisible();
    await correspondentPortalPage.Show_All_Button.click();
    await expect(correspondentPortalPage.Dropdown_Company_for_Selected).toContainText(vars["SelectedCompanyName"]);
    await expect(bidMapsCompanyDropdownPage.Required_CompanyBidmap_company_dropdown).toBeVisible();
    // [DISABLED] Verify that the Dropdown_Company_for_Selected list has option with text NotSelectedCompanyName selected and With Scrollable FALSE
    // await expect(correspondentPortalPage.Dropdown_Company_for_Selected).toHaveValue(vars["NotSelectedCompanyName"]);
    // [DISABLED] Verify that the current page displays text NotSelectedCompanyName
    // await expect(page.getByText(vars["NotSelectedCompanyName"])).toBeVisible();
    await stepGroups.stepGroup_Enter_Company_Name_in_New_Map_Filter(page, vars);
    await expect(correspondentPortalPage.Apply_Selected_for_Bid_Maps).toContainText("2");
    await correspondentPortalPage.Apply_Selected.click();
    await expect(correspondentPortalPage.Dropdown_selection_2).toHaveValue("STANDARD");
    await correspondentPortalPage.Dropdown_selection_2.click();
    await backButtonPage.BACK_Button.click();
    await expect(youHaveUnsavedChangesIfYouLeaveYourChangesPage.You_have_unsaved_changes_If_you_leave_your_changes).toBeVisible();
    await proceedWithoutSavingButtonPage.Proceed_without_Saving_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Bid_Maps_name.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Select_Companys_Dropdown.click();
    vars["CompanyCount"] = String(await correspondentPortalPage.Companies_In_Dropdown.count());
    await selectAllCheckboxPage.Select_All_Checkbox.check();
    await expect(correspondentPortal7Page.Apply_Selected_for_the_Bid_Maps).toContainText(vars["CompanyCount"]);
    await selectAllCheckboxPage.Select_All_Checkbox.uncheck();
    await expect(selectAllCheckboxPage.Select_All_Checkbox).toBeVisible();
    await expect(correspondentPortalPage.Apply_Selected).toBeVisible();
    await expect(correspondentPortalPage.Search_Text_Field).toBeVisible();
    vars["vars[FirstCompanyName]"] = await correspondentPortalPage.Search_Text_Field.textContent() || '';
    await correspondentPortalPage.Search_Text_Field.fill(vars["FirstCompanyName"]);
    await correspondentPortalPage.Cross_In_Search_Field.click();
    await correspondentPortalPage.Search_Text_Field.fill(vars["SecondCompanyName"]);
    await correspondentPortalPage.Check_box.click();
    await correspondentPortalPage.Search_Text_Field.clear();
    await expect(correspondentPortalPage.Search_Text_Field).toHaveValue('');
    await correspondentPortalPage.Search_Text_Field.fill(vars["FirstCompanyName"]);
    await correspondentPortalPage.Check_box.check();
    await expect(correspondentPortalPage.Apply_Selected).toBeVisible();
  });
});
