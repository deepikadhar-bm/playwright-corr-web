// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { BidRequestPage } from '../../../src/pages/correspondant/bid-request';
import { ChaseDirectPage } from '../../../src/pages/correspondant/chase-direct';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { CustomerPermissionPage } from '../../../src/pages/correspondant/customer-permission';
import { EditPermissionsPage } from '../../../src/pages/correspondant/edit-permissions';
import { P3715DropdownPage } from '../../../src/pages/correspondant/p-3-7-15-dropdown';
import { SelectDropdownPage } from '../../../src/pages/correspondant/select-dropdown';
import { SpinnerPage } from '../../../src/pages/correspondant/spinner';
import { StandardPage } from '../../../src/pages/correspondant/standard';
import { StatusInactivePage } from '../../../src/pages/correspondant/status-inactive-';
import { UpdatePermissionsButtonPage } from '../../../src/pages/correspondant/update-permissions-button';
import { UploadNewBidRequestButtonPage } from '../../../src/pages/correspondant/upload-new-bid-request-button';

test.describe('REG_TC_Bid_Requests', () => {
  let vars: Record<string, string> = {};
  let bidRequestPage: BidRequestPage;
  let chaseDirectPage: ChaseDirectPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let customerPermissionPage: CustomerPermissionPage;
  let editPermissionsPage: EditPermissionsPage;
  let p3715DropdownPage: P3715DropdownPage;
  let selectDropdownPage: SelectDropdownPage;
  let spinnerPage: SpinnerPage;
  let standardPage: StandardPage;
  let statusInactivePage: StatusInactivePage;
  let updatePermissionsButtonPage: UpdatePermissionsButtonPage;
  let uploadNewBidRequestButtonPage: UploadNewBidRequestButtonPage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    bidRequestPage = new BidRequestPage(page);
    chaseDirectPage = new ChaseDirectPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    customerPermissionPage = new CustomerPermissionPage(page);
    editPermissionsPage = new EditPermissionsPage(page);
    p3715DropdownPage = new P3715DropdownPage(page);
    selectDropdownPage = new SelectDropdownPage(page);
    spinnerPage = new SpinnerPage(page);
    standardPage = new StandardPage(page);
    statusInactivePage = new StatusInactivePage(page);
    updatePermissionsButtonPage = new UpdatePermissionsButtonPage(page);
    uploadNewBidRequestButtonPage = new UploadNewBidRequestButtonPage(page);
  });

  test('REG_TS01_TC02_Verify that if the user select any company that has only standard execution type, then he should be able to select the valiues from the standard exe type only and chase should be disbale', async ({ page }) => {
    const testData: Record<string, string> = {
  "CompanyName(CustomerPermissions)": "Freedom - A4187",
  "Execution Type Header": "Exe.Type",
  "Resubmit Pricing Error Standard1": "( nmlsId = 2767 )",
  "Company Name.": "Wik1C BeuLD MoJbr CoEmy LLpoJ  - A2964",
  "BidMappingID": "Deepika Aug1",
  "Geo Coding Reducer flow(Errors Column)": "Geo Coding error",
  "Bid Valid File(Error Description)": "No Errors",
  "Company Name New": "American Pacific  - A4257",
  "Email Success Message": "Email sent successfuly",
  "Loan Field Validation(Number)": "Deepika_June_invaliddatafield",
  "Bid Valid File(Loan Status)": "Success",
  "Bid Request ID Header": "BidRequestID",
  "Resubmit Pricing Error Chase Direct": "Execution type 'Chase Direct' not permitted for client",
  "Geo Coding happy flow(Error Description)": "No Errors",
  "Bid Enum Check(Loan Status)": "Error",
  "Pos Check(Errors Column)": "No eligibility results",
  "Eligibility Check(LoanStatus)": "Error",
  "Geo Coding Reducer flow(Error Description))": "Geocode unknown",
  "Selected Company Count": "2",
  "Geo Coding happy flow(Loan Status)": "Success",
  "Geo Coding happy flow (Errors Column)": "No errors",
  "Resubmit Pricing Error Standard": "Execution type 'Standard' not permitted for client",
  "MissingHeaders_ErrorMessage1": "Bid tape is missing values for following headers: Loan Purpose.",
  "Price Offered": "Price Offered",
  "Geo Coding Failed flow(Errors))": "Geo Coding error",
  "Ccode for freedom": "A4187",
  "MissingHeaders_ErrorMessage2": "Please verify the correct Map ID is selected or tape is formatted correctly.",
  "Geo Coding Reducer flow(Loan Status)": "Success",
  "Eligibility Check(Error Description)": "Minimum loan amount $5,000",
  "Stored_Text1": "10:10 AM",
  "Status Name": "Committed",
  "Bid Valid File(Error Column)": "No errors",
  "CompanyName3": "American Pacific - A4257",
  "Assigned Companies1": "Wik1C BeuLD MoJbr CoEmy LLpoJ",
  "SpecialCharacter_ErrorHeader": "EXTRA_SPACE_FOUND",
  "Geo Coding Failed flow(Loan Status)": "Error",
  "Pos Check(Loan Status)": "Error",
  "Loan Field Validation(Status)": "Error",
  "Eligibility Check(Error Column)": "Minimum Loan Amount $5,000",
  "Loan Field Validation(Error description)": "Loan value cannot be blank or zero for 'loan purpose'",
  "Last One Month": "Last One Month",
  "Resubmit Pricing Error Standard and Chase": "Execution type 'Standard' not permitted for client",
  "Reason For Cancellation": "To be Cancelled",
  "Reason For Deletion": "To be deleted",
  "Loan Field Validation(Error)": "Invalid Loan Data",
  "DeletingMessage for File": "You have selected to delete this file. Do you want to proceed?",
  "Resubmit Pricing Error Standard and Chase1": "( nmlsId = 2767 )",
  "Creating Batch Success Message": "Batch timing has been created successfull",
  "Bid Enum Check(Errors Column)": "Secondary Residence, Investment (NOO)]. Path: search.criteria.propertyUse is missing value",
  "Status Count 1": "3",
  "Display_Text1": "Delete Batch Time",
  "New Company Name": "Home Sweet Mortgage",
  "CCode Header": "Ccode",
  "FileRow": "4",
  "SpecialCharacter_ErrorMessage": "Found extra space(s) in row 3 for 'Correspondent Loan Number'. Please modify and retry upload.",
  "Display_Text2": "Delete Batch",
  "Email Message Verification": "Do you want to resend Bid Offer email?",
  "BidMappingIDNew": "Default Map Internal",
  "Geo Coding Failed flow(Error Description)": "Geocode unknown, no eligibility results: cannot find zip detail information for : 09999",
  "Pos Check(Error Description)": "Not approved for [nonagency], no eligibility results",
  "MissingHeaders_ErrorHeader": "Missing Headers",
  "Search Field Company Name": "Wik1C",
  "DuplicateLoans_HeaderMessage": "Duplicate Loans",
  "Company Name": "Freedom - A4187",
  "Stored_Text": "09:19 AM",
  "Resubmit Pricing Error Chase Direct1": "( nmlsId = 2767 )",
  "DuplicateLoans_ErrorMessage": "Duplicate loan numbers contained in this file: Deepika_June_02_02, Deepika_June_02_04. Please remove these from the file and retry upload.",
  "Missing Headers(Error Message)": "Bid tape is missing values for following headers: Loan Purpose. Please verify the correct Map ID is selected or tape is formatted correctly.",
  "Bid Enum Check(Error Description)": "enum field occupancy type is missing value or value is not in valid list [primary residence, secondary residence, investment (noo)]. path: search.criteria.propertyuse is missing value"
}; // Profile: "Bid Requests", row: 0

    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Navigation_and_Verification_of_Customer_Permission_in_Bid_Re(page, vars);
    await customerPermissionPage.Search_Filter_Input.fill(testData["CompanyName(CustomerPermissions)"]);
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await correspondentPortalPage.Edit_Permission_Button.click();
    await expect(page.getByText("Edit Permissions")).toBeVisible();
    await expect(correspondentPortalPage.close_pop_up_bid_request_details).toBeVisible();
    await page.waitForLoadState('networkidle');
    if (true) /* Radio button Set_StandardFlow=On is not selected */ {
      // [DISABLED] Select the radio button Set_StandardFlow=On
      // await statusInactivePage.TodayOnly_Radio_Button.check();
    }
    if (true) /* Radio button Set_ChaseDirect=OFF is not selected */ {
      // [DISABLED] Select the radio button Set_ChaseDirect=OFF
      // await correspondentPortalPage.ChaseDirect_OFFEdit_Permissions_Popup.check();
    }
    await statusInactivePage.TodayOnly_Radio_Button.check();
    await correspondentPortalPage.ChaseDirect_OFFEdit_Permissions_Popup.check();
    if (true) /* Element UpdatePermissions_Button is enabled */ {
      await updatePermissionsButtonPage.UpdatePermissions_Button.click();
    } else {
      await editPermissionsPage.Close_pop_up.click();
    }
    await expect(customerPermissionPage.Standard_Execution_PermissionAllowed).toContainText("Allowed");
    await expect(customerPermissionPage.Chasedirect_Execution_PermissionDisabled).toContainText("Disabled");
    await correspondentPortalPage.Bid_Requests.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await expect(page.getByText("Bid Requests")).toBeVisible();
    await uploadNewBidRequestButtonPage.Upload_New_Bid_Request_Button.click();
    await spinnerPage.Spinner.waitFor({ state: 'hidden' });
    await selectDropdownPage.Select_Company_In_BidRequest.click();
    await expect(bidRequestPage.Bid_Mapping_IdSearch_Input_box).toBeVisible();
    await bidRequestPage.Bid_Mapping_IdSearch_Input_box.fill(testData["CompanyName(CustomerPermissions)"]);
    await correspondentPortalPage.SelectCompany_Value.click();
    await expect(bidRequestPage.Selected_Company_Value_Upload_Bid_Request_Screen).toBeVisible();
    await expect(standardPage.Standard_Execution_Checkbox).toBeEnabled();
    await p3715DropdownPage.StandardExecution_Dropdown.selectOption({ label: "3" });
    await expect(chaseDirectPage.ChaseDirect_Checkbox).toBeVisible();
    await expect(correspondentPortalPage.ChaseExceution_Dropdown).toBeVisible();
  });
});
