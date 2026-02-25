import { Page, Locator } from '@playwright/test';

/**
 * Page Object: CorrPortalPage
 * Elements: 508
 * Single unified page object — all elements used across step groups.
 * XPath values sourced from Testsigma — do not modify.
 */
export class CorrPortalPage {
  constructor(private page: Page) {}

  get Action_Chase_Field_Name_1(): Locator {
    return this.page.locator("(//div[@class=\"row rules-actions\"]//div[@class=\"col-4\"]//select)[1]");
  }

  get Action_Chase_Field_Name_2(): Locator {
    return this.page.locator("(//label[normalize-space(text())='Chase Field Name']//..//select[@class=\"form-select\"])[2]");
  }

  get Action_Chase_Value1(): Locator {
    return this.page.locator("//div[@class=\"row rules-actions\"]//label[text()=\"Chase Value\"]/..//select");
  }

  get Action_Chase_Value_1(): Locator {
    return this.page.locator("//label[text()=\"Chase Value\"]/..//div[@class=\"d-flex\"]//select");
  }

  get Action_Chase_Value_2(): Locator {
    return this.page.locator("(//label[normalize-space(text())='Chase Value']//..//select[@class=\"form-select\"])[2]");
  }

  get Actions(): Locator {
    return this.page.locator("(//*[text()[normalize-space() = \"Actions\"]])[2]");
  }

  get AddBatch_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Add Batch\"]]");
  }

  get Add_A_Batch_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Add A Batch\"]]");
  }

  get Add_Action_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Add Action\"]]");
  }

  get Add_Actions_Chase_Field_Name(): Locator {
    return this.page.locator("(//label[normalize-space(text())='Chase Field Name']//..//select[@class=\"form-select\"])[1]");
  }

  get Add_Actions_Chase_Value(): Locator {
    return this.page.locator("(//label[normalize-space(text())='Chase Value']//..//select[@class=\"form-select\"])[1]");
  }

  get Add_Actions_Chase_Value_Not_a_list(): Locator {
    return this.page.locator("//label[normalize-space(text())='Chase Value']/..//*[@class=\"form-control p-0\"]");
  }

  get Add_Conditions(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Add Conditions\"]]");
  }

  get Add_Field_Button1(): Locator {
    return this.page.locator("(//button[text()[normalize-space() = \"Add Field\"]])[1]");
  }

  get Add_Header(): Locator {
    return this.page.locator("//h5[text()[normalize-space() = \"Add Header\"]]");
  }

  get Add_New_Config_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Add New\"]]");
  }

  get Add_New_Header_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Add New Header\"]]");
  }

  get Add_New_Mapping_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Add New Mapping\"]]");
  }

  get Add_Rule_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Add Rule\"]]");
  }

  get Administration_Menu(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Administration\"]]");
  }

  get Advanced_Search_Bid_maps_Delete_Button_1(): Locator {
    return this.page.locator("//tbody//td[@data-title=\"Map Name\"]//*[contains(text(),\"TS_AdvanceSearch\")]/../..//button[@aria-label=\"Delete Map\"]");
  }

  get Advanced_Search_Filter(): Locator {
    return this.page.locator("//*[text()[normalize-space() = \"Advanced Search/Filter\"]]");
  }

  get All_Bid_Request_ID_Rows_price_offered_screen1(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"])[position() >=2 and position()<=last()]");
  }

  get All_Companies_DropdownDash_Board(): Locator {
    return this.page.locator("//button[@id='multiSelectDropDown']");
  }

  get All_Select_in_header(): Locator {
    return this.page.locator("//div[contains(@class,\"gap-2 header-grid-layout\")]/..//select[@title=\"\"]");
  }

  get Apply_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Apply\"]]");
  }

  get Apply_Filters_Button(): Locator {
    return this.page.locator("//div[contains(@class, \"justify-content-end\")]//button[text()=\"Apply Filters\"]");
  }

  get Apply_Selected(): Locator {
    return this.page.locator("//button[contains(text(),\" Apply Selected \")]");
  }

  get Apply_Selected2(): Locator {
    return this.page.locator("(//button[@aria-label=\"Apply selected items\"])[2]");
  }

  get Apply_Selected_1_button_in_Rule(): Locator {
    return this.page.locator("//button[contains(normalize-space(),\"Apply Selected 1\")]");
  }

  get Apply_Selected_Button_2_filter(): Locator {
    return this.page.locator("(//button[contains(normalize-space(),\"Apply Selected 1\")])[2]");
  }

  get Apply_Selected_Button_in_Import_Rule(): Locator {
    return this.page.locator("//span[contains(normalize-space(),\"Apply Selected 1\")]");
  }

  get Apply_selected_Number(): Locator {
    return this.page.locator("//span[@class=\"counter bg-white text-primary mx-2 text-center fw-semibold small\"]");
  }

  get Auth_Limit_All_Loans(): Locator {
    return this.page.locator("//div[normalize-space(text())=\"Auth Limit:\"]/following-sibling::div");
  }

  get Back_To_Commitment_List(): Locator {
    return this.page.locator("//a[contains(text(),\"Commitment List\")]//i[contains(@class,\"fas fa-arrow-left \")]");
  }

  get BatchTime(): Locator {
    return this.page.locator("(//h6[@class=\"card-subtitle text-body-secondary flex-grow-1 mb-0\"]/../..//h5)[$|BatchNum|]");
  }

  get Batch_In_Bulk_Batch_Timing(): Locator {
    return this.page.locator("(//div[@class=\"card-body\"])[last()]");
  }

  get Batch_timing_has_been_created_successfully_Success_Message(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Batch timing has been created successfully\"]]");
  }

  get Batches_Count(): Locator {
    return this.page.locator("//h6[@class=\"card-subtitle text-body-secondary flex-grow-1 mb-0\"]");
  }

  get BidMap1_Advanced_Search(): Locator {
    return this.page.locator("(//td//button[text()=\" $|BidMapName1| \"])");
  }

  get BidMapFieldSet(): Locator {
    return this.page.locator("//fieldset//div[@class=\"flex-grow-1\"]");
  }

  get BidReqId_Chase_Direct(): Locator {
    return this.page.locator("//td[@data-title=\"Execution Type\"]//div[contains(text(),\"CHASE_DIRECT\")]//ancestor::tr//td[@data-title=\"Bid Req. ID\"]//a[contains(@aria-label,\"View details for\")]");
  }

  get BidRequestIDText_Details(): Locator {
    return this.page.locator("//div[text()=\"Bid Req. ID\"]//following-sibling::h5");
  }

  get BidRequest_Company_Column_Data(): Locator {
    return this.page.locator("//td[@data-title=\"Company\"]//div");
  }

  get BidRequests_Menu(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Bid Requests\"] and contains(@class, 'hide-text')]");
  }

  get BidStatus_From_List(): Locator {
    return this.page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Status\"]");
  }

  get BidTapeFieldCountForBidField(): Locator {
    return this.page.locator("//div[text()=\"$|ColumnHeader|\" and not(@class=\"my-2\")]/../..//div[contains(@class,\"input-field-name\")]");
  }

  get Bid_Enumerated(): Locator {
    return this.page.locator("(//button[@id=\"singleSelectDropDownWithSearch\"])[2]");
  }

  get Bid_Enumeration_Tape_Value_in_Rule(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[3]");
  }

  get Bid_Loan_Num_Loan_Details_Popup(): Locator {
    return this.page.locator("//div[text()=\"Bid Loan Number\"]//following-sibling::h5");
  }

  get Bid_Loan_Number_Loan_Details_Pop_up(): Locator {
    return this.page.locator("(//h5[@aria-labelledby=\"bidRequestIdLabel\"])[2]");
  }

  get Bid_Map_Creation(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Bid Map Creation\"]]");
  }

  get Bid_Map_Creation_in_General_Settings(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/bidmap-creation\"]");
  }

  get Bid_Map_Name_Field_In_Row(): Locator {
    return this.page.locator("//td[@data-title=\"Map Name\"]//button[text()=\" $|Create New Map| \"]");
  }

  get Bid_Mapping_ID_Dropdown(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Select Mapping\"]]");
  }

  get Bid_Mapping_ID_Dropdown_1(): Locator {
    return this.page.locator("//span[text()[normalize-space() =\"Deepika Aug1\"]]");
  }

  get Bid_Mapping_Id_Search_Input_box(): Locator {
    return this.page.locator("(//div[@class=\"mb-0 overflow-hidden\"])[1]/../..//input[@placeholder=\"Search\"]");
  }

  get Bid_Maps(): Locator {
    return this.page.locator("//tbody//tr");
  }

  get Bid_Maps_Menu(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Bid Maps\"]]");
  }

  get Bid_Maps_Name(): Locator {
    return this.page.locator("//span[contains(.,' $|Create New Map|')]");
  }

  get Bid_Request_Config_Menu(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/bid-request\"]");
  }

  get Bid_Request_Date(): Locator {
    return this.page.locator("//input[@id='bidRequestToday']");
  }

  get Bid_Request_Details_Text(): Locator {
    return this.page.locator("//div[@aria-label=\"Request ID Label\"]/..//h5");
  }

  get Bid_Request_ID_Dropdown_Commitment_List_Page(): Locator {
    return this.page.locator("//span[normalize-space(text())=\"Bid Request ID\"]");
  }

  get Bid_Request_ID_On_Loan_Details_Popup(): Locator {
    return this.page.locator("(//h5[@aria-labelledby=\"bidRequestIdLabel\"])[1]");
  }

  get Bid_Request_Status_Column_Data(): Locator {
    return this.page.locator("//td[@data-title=\"Status\"]//span");
  }

  get Bid_Requested_Date(): Locator {
    return this.page.locator("//form//div//label[text()=\"Bid Requested Date\"]");
  }

  get Bid_Requests_Side_Menu(): Locator {
    return this.page.locator("//a[@href=\"#/bid-requests\"]");
  }

  get Bid_Sample_Field_Name_For_Header_Mapping(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1\"])[7]");
  }

  get Bid_Sample_Field_Name_for_Header_Mapping(): Locator {
    return this.page.locator("(//div[contains(@class,\"gap-2 header-grid-layout\")]//div[@class=\"flex-grow-1\"])[5]");
  }

  get Bid_Sample_Field_Name_in_Header_Mapping(): Locator {
    return this.page.locator("//i[@class=\"fas fa-pencil-alt\"]");
  }

  get Bid_Sample_Name_1(): Locator {
    return this.page.locator("(//div[@class=\"col-2\"]//div[text()=\"$|FirstBidSampleName|\"])[1]/../..//input[@type=\"checkbox\"]");
  }

  get Bid_Sample_Name_Field_Enumeration_Mapping(): Locator {
    return this.page.locator("(//div[@class=\"my-2\" and text()=\"$|ChaseName|\"]/../..//div)[3]");
  }

  get Bid_Status_From_Details(): Locator {
    return this.page.locator("//div[text()=\"Status\"]/..//h5");
  }

  get Bid_Tape_Value(): Locator {
    return this.page.locator("//input[@type=\"text\" and contains(@class, 'input-field-edit')]");
  }

  get Bid_Value_From_Table_Header1(): Locator {
    return this.page.locator("//h5[@aria-labelledby=\"bidValueLabel\"]");
  }

  get Bid_Value_from_Table_Header_2(): Locator {
    return this.page.locator("(//h5[@aria-labelledby=\"bidValueLabel\"])[2]");
  }

  get Bulk_Batch_Timing(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/batch-timing\"]");
  }

  get CLM_Field_Name(): Locator {
    return this.page.locator("//div[text()='CLM Field Name']//..//..//select");
  }

  get Category_In_Dropdown(): Locator {
    return this.page.locator("//input[contains(@aria-label,\"$|CategoryName|\")]");
  }

  get Change_Page_Size_Dropdown(): Locator {
    return this.page.locator("//button[@aria-label=\"Change Page Size\"]");
  }

  get ChaseDirect_OFF_Edit_Permissions_Popup(): Locator {
    return this.page.locator("(//input[@type=\"radio\"])[4]");
  }

  get ChaseDirect_Off_Button(): Locator {
    return this.page.locator("(//label[normalize-space(text())='Chase Direct']/parent::div//input)[2]");
  }

  get ChaseFieldValue_Popup(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and normalize-space((text())=\"$|ChaseFieldNamePopup|\")]/following-sibling::div)[1]");
  }

  get ChaseFields_Count_Popup_Loan_Details(): Locator {
    return this.page.locator("//div[@class=\"border-bottom p-2\"]");
  }

  get ChaseValuePopup_AllLoans(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"$|ChaseFieldNamePopupAllLoans|\")]/following-sibling::div)[1]");
  }

  get ChaseValues_Corresponding_to_Chase_Field(): Locator {
    return this.page.locator("(//div[@class=\"my-2\" and text()=\"$|IndividualChaseFieldName|\"]/..//following-sibling::div)//div[@class=\"mb-2\"]");
  }

  get Chase_Direct_Checkbox(): Locator {
    return this.page.locator("//label[text()[normalize-space() = \"Chase Direct\"]]/preceding-sibling::input[@type=\"checkbox\"]");
  }

  get Chase_Direct_Dropdown_Upload_Bidrequest(): Locator {
    return this.page.locator("(//select[contains(normalize-space(),\"Select 3 7 15\")])[2]");
  }

  get Chase_Direct_ON_button(): Locator {
    return this.page.locator("(//label[normalize-space(text())='Chase Direct']/parent::div//input)[1]");
  }

  get Chase_Enum_Names(): Locator {
    return this.page.locator("//div[@class=\"my-2\"]");
  }

  get Chase_Field_Checkbox(): Locator {
    return this.page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]/../../..//input[@type=\"checkbox\"]");
  }

  get Chase_Field_Input_box(): Locator {
    return this.page.locator("//div[@aria-labelledby=\"actionsGroup\"]//label[text()=\"Chase value\"]/../..//*[@aria-label=\"LP Field Value\"]//input");
  }

  get Chase_Field_Name(): Locator {
    return this.page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/following-sibling::div[contains(@class, 'd-flex')]//select[contains(@class, 'form-select')]");
  }

  get Chase_Field_Name_in_Rule(): Locator {
    return this.page.locator("(//*[text()=\"Add Actions\"]/..//select)[3]");
  }

  get Chase_Field_Select_list(): Locator {
    return this.page.locator("//label[text()=\"Chase value\"]/../..//*[@aria-label=\"LP Field Value\"]//select");
  }

  get Chase_New_Data_pop_up_sub_text(): Locator {
    return this.page.locator("//td[@class=\"d2h-ins d2h-change\"]//span[contains(text(),\"executionTypeFastPath\" )]//ins");
  }

  get Chase_Off_RadioGlobal_Restrictions(): Locator {
    return this.page.locator("//input[@id='executionTypeFastPath-select-off']");
  }

  get Chase_On_RadioGlobal_Restriction(): Locator {
    return this.page.locator("//input[@id='executionTypeFastPath-select-on']");
  }

  get Chase_Previous_Data_pop_up(): Locator {
    return this.page.locator("//td[@class=\"d2h-del d2h-change\"]//span[contains(text(),\"executionTypeFastPath\" )]");
  }

  get Chase_Previous_Data_pop_up_sub_text(): Locator {
    return this.page.locator("//td[@class=\"d2h-del d2h-change\"]//span[contains(text(),\"executionTypeFastPath\" )]//del");
  }

  get Chase_State_First_Record(): Locator {
    return this.page.locator("(//td[@data-title=\"Chase Direct\"]//div)[1]");
  }

  get Chase_Value(): Locator {
    return this.page.locator("(//select[@class=\"form-select\" and @id=\"id\"])[last()]");
  }

  get Chase_Value_Dropdown_Enumeration_Mapping(): Locator {
    return this.page.locator("((//div[@class=\"field-block mb-2\"])/../../../..//select)[4]");
  }

  get Chase_Value_Dropdown_Rules_Actions(): Locator {
    return this.page.locator("//label[text()=\"Chase Value\"]/..//div[@class=\"form-control p-0\"]");
  }

  get Chase_Value_Input_box(): Locator {
    return this.page.locator("//div[@aria-labelledby=\"rulesGroup\"]/following-sibling::div//*[@aria-label=\"LP Field Value\"]//input");
  }

  get Chase_Value_Search_field(): Locator {
    return this.page.locator("(//label[text()=\"Chase Value\"]/..//input[@type=\"search\"])[1]");
  }

  get Chase_Value_in_RulesandActions(): Locator {
    return this.page.locator("(//*[text()=\"Add Actions\"]/..//select)[4]");
  }

  get Chase_Values_Dropdown(): Locator {
    return this.page.locator("(//select[@id=\"id\"])[3]");
  }

  get Chase_Values_In_Enumration_Page(): Locator {
    return this.page.locator("//div[@class=\"mb-2\"]//..//select[@class=\"form-select\"]");
  }

  get Chase_Values_Select(): Locator {
    return this.page.locator("//div[@aria-labelledby=\"rulesGroup\"]/following-sibling::div//*[@aria-label=\"LP Field Value\"]//select");
  }

  get Chase_value_2026(): Locator {
    return this.page.locator("//div[contains(@class,'border-bottom p-2') and contains(normalize-space(.),'$|ChaseFieldNameBeforeSubmit|')]/following-sibling::div[1]");
  }

  get Chases_Values_1(): Locator {
    return this.page.locator("(//div[@class=\"mb-2\"]//..//select[@class=\"form-select\"])[$|count|]");
  }

  get Check_Bid_Loan_Num_Standard_Exe(): Locator {
    return this.page.locator("//tbody//tr[not(descendant::button[contains(text(),\"$|CommittedLoanNumChaseDirect|\")])]//input[@type=\"checkbox\"]");
  }

  get Check_box(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[1]");
  }

  get Checkbox_in_the_Header_Mapping(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[3]");
  }

  get Checked_Corr_Loan(): Locator {
    return this.page.locator("//tr[contains(@class,\"row\")]//button[contains(@class,\"btn bg-transparent text-primary\")][1]");
  }

  get Checked_header_1(): Locator {
    return this.page.locator("//div[@class=\"flex-grow-1\" and text()=\"$|FirstCheckedBidName|\"]");
  }

  get Checked_header_2(): Locator {
    return this.page.locator("//div[@class=\"flex-grow-1\" and text()=\"$|SecondCheckedBidName|\"]");
  }

  get Close_Advance_Search_Pop_up_Button(): Locator {
    return this.page.locator("//h2[text()=\"Advanced Search/Filter\"]/..//button");
  }

  get Close_Button_Loan_Details_Popup(): Locator {
    return this.page.locator("//button[@aria-label=\"Close\"]");
  }

  get Close_Model_Button(): Locator {
    return this.page.locator("//button[@data-dismiss='modal']");
  }

  get Close_pop_up(): Locator {
    return this.page.locator("//button[@data-dismiss=\"modal\"]");
  }

  get Column_Count_UI_Locked_Loans(): Locator {
    return this.page.locator("(//span[contains(@class,\"fa fas fa-lock lock-icon\")])[$|count|]//ancestor::tr//td[@data-title][position() >2 and position()!= 4 and position()!= 12]");
  }

  get Column_Count_UI_Price_Offered_Details(): Locator {
    return this.page.locator("//table[@role='table']//tbody//tr[$|count|]//td[@data-title][position() >= 3]");
  }

  get CommitCutOffTime(): Locator {
    return this.page.locator("//input[@id='commitCreationCutOffTime']");
  }

  get Commit_Correction_Cut_off_Time(): Locator {
    return this.page.locator("//label[contains(text(),\"Commit Correction Cut-off\")]//following::input[contains(@id,\"CorrectionCutOfHours\")]");
  }

  get Commit_Creation_Cut_Off(): Locator {
    return this.page.locator("//input[@id='externalUserCreationCutOfTime']");
  }

  get Commitment_ID_Chase_Direct(): Locator {
    return this.page.locator("//td[@data-title=\"Execution Type\"]//div[contains(text(),\"CHASE_DIRECT\")]//ancestor::tr//a[contains(@aria-label,\"View details for commitment ID\")]");
  }

  get Commitment_ID_Commitment_List(): Locator {
    return this.page.locator("//div[contains(text(),\"$|BidReqIdPriceOffered|\")]/ancestor::tr/td[@data-title=\"Comm. ID\"]");
  }

  get Commitment_ID_Standard(): Locator {
    return this.page.locator("//td[@data-title=\"Execution Type\"]//div[contains(text(),\"STANDARD\")]//ancestor::tr//a[contains(@aria-label,\"View details for commitment ID\")]");
  }

  get Commitment_List_Text(): Locator {
    return this.page.locator("//h3[text()[normalize-space() = \"Commitment List\"]]");
  }

  get Commitment_Order_Dropdown(): Locator {
    return this.page.locator("//div[contains(text(),\"Commitment Order\")]");
  }

  get Commitments_Side_Menu(): Locator {
    return this.page.locator("//ul[contains(@class, 'navbar-nav') and contains(@class, 'flex-column')]/li[3]/a[1]");
  }

  get Committed_Date(): Locator {
    return this.page.locator("//td[@data-title=\"Comm. Date\"]//div");
  }

  get Committed_List_Dropdown(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Committed List\"]]");
  }

  get Committed_Loan_Amount_Price_Offered(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Loan Amount\"]");
  }

  get Committed_Loan_Num_Commitment_List(): Locator {
    return this.page.locator("//div[text()=\"Commit. ID\"]//following-sibling::h5[text()=\"$|CommitID|\"]//ancestor::div[contains(@class,\"accordion-item\")]//div[@class=\"accordion-body\"]//tbody//button[\"$|CommittedCorrLoan|\"]");
  }

  get Committed_Loan_Num_Price_Offered_Page(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]");
  }

  get Companies_In_Dropdown(): Locator {
    return this.page.locator("(//label[@class='dropdown-item d-flex'])");
  }

  get CompanyName_Action_Button_By_Index(): Locator {
    return this.page.locator("(//div[@id=\"common-table-results\"]//following-sibling::td[@data-title=\"Actions\"])[$|CompanyIndex|]//button[@aria-label=\"Edit Permission\"]");
  }

  get Company_ConfigGenral_settings(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/company-config\"]");
  }

  get Company_Name(): Locator {
    return this.page.locator("(//td[@data-title=\"Company\"])[1]");
  }

  get Company_Name_ActionButton_SecondRow(): Locator {
    return this.page.locator("(//div[@id=\"common-table-results\"]//following-sibling::td[@data-title=\"Actions\"])[2]//button[@aria-label=\"Edit Permission\"]");
  }

  get Company_Name_Action_Button_FirstRow(): Locator {
    return this.page.locator("(//div[@id=\"common-table-results\"]//following-sibling::td[@data-title=\"Actions\"])[1]//button[@aria-label=\"Edit Permission\"]");
  }

  get Company_Name_ChaseDirect(): Locator {
    return this.page.locator("//td[contains(.,\"Allowed\") and @data-title=\"Chase Direct\"]/../td[@data-title=\"Company Name\"]");
  }

  get Company_Name_ChaseDirect_FirstRow(): Locator {
    return this.page.locator("//div[@id='common-table-results']/table//tr[1]//td[@data-title=\"Company Name\"]");
  }

  get Company_Name_Customer_Permission(): Locator {
    return this.page.locator("//div[@id='common-table-results']/table//tr[$|CompanyIndex|]//td[@data-title=\"Company Name\"]");
  }

  get Compare_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Create\"]");
  }

  get Condition_BidField_1(): Locator {
    return this.page.locator("(//div[@class=\"rules-conditions\"]//button//div[contains(@class,\"flex-grow-1\")])[1]");
  }

  get Condition_BidTape1(): Locator {
    return this.page.locator("(//div[@class=\"rules-conditions\"]//button//div[contains(@class,\"flex-grow-1\")])[2]");
  }

  get Condition_BidTape_2(): Locator {
    return this.page.locator("(//div[@class=\"rules-conditions\"]//button//div[contains(@class,\"flex-grow-1\")])[4]");
  }

  get Config_Type_Column_Data(): Locator {
    return this.page.locator("//td[@data-title=\"Config Type\"]");
  }

  get Continue_Button_Upload_Pop_up(): Locator {
    return this.page.locator("//span[text()=\"Continue\"]/..");
  }

  get Continue_Editing_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Continue Editing\"]]");
  }

  get Correspondent_Bid_sample_name(): Locator {
    return this.page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]/../../..//div[@class=\"flex-grow-1\"]");
  }

  get Count_of_Columns_Request_list(): Locator {
    return this.page.locator("//th[position() > 1 and position() < last()]");
  }

  get Create_New_Map(): Locator {
    return this.page.locator("//h5[text()[normalize-space() = \"Create New Map\"]]");
  }

  get Create_New_Map_Field(): Locator {
    return this.page.locator("#mapName");
  }

  get Created_Date_Time_Column_Data(): Locator {
    return this.page.locator("//td[@data-title=\"Created\"]");
  }

  get Curr_Gross_Commitment_List(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Curr Gross\"]");
  }

  get Curr_Gross_price_offered_screen_table(): Locator {
    return this.page.locator("(//table//td[@data-title=\"Curr Gross\"])[$|count1|]");
  }

  get Curr_Market_Value_Commitment_List(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Curr Market Value\"]");
  }

  get Current_Gross_Price(): Locator {
    return this.page.locator("(//td[@data-title=\"Curr Gross\"])[$|RowCount|]");
  }

  get Current_Market_Diff_price_offered(): Locator {
    return this.page.locator("//div[@id=\"price-offered-details-header\"]//div/div[text()=\"Current Market Diff\"]/..//h5");
  }

  get Current_Market_price_offered(): Locator {
    return this.page.locator("//div[@id=\"price-offered-details-header\"]//div/div[text()=\"Current Market\"]/..//h5");
  }

  get Custom_Header_Field(): Locator {
    return this.page.locator("//div[text()='Custom Header']//..//..//input[contains(@class, 'form-control')]");
  }

  get Custom_Header_On_Pop_Up(): Locator {
    return this.page.locator("//div[text()=\"Custom Header\"]/../..//input");
  }

  get CustomerPermission_Menu(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/customer-restrictions\"]");
  }

  get Dashboard(): Locator {
    return this.page.locator("//h3[text()[normalize-space() = \"Dashboard\"]]");
  }

  get Date_Filter_Tube_Bid_request_List(): Locator {
    return this.page.locator("//div[@class=\"pill rounded-pill relative\" and contains(@aria-label,\"Chip Date\")]");
  }

  get Date_Range_DropdownFilter(): Locator {
    return this.page.locator("//input[@placeholder=\"Select Date\"]");
  }

  get Deferred_Radio_Button(): Locator {
    return this.page.locator("//label[normalize-space(text())=\"Deferred\"]/..//input[@name=\"pricingMode\" and @type=\"radio\"]");
  }

  get Deferred_Radio_ButtonUpload_Bid(): Locator {
    return this.page.locator("//form[@aria-labelledby=\"executionDetailsHeader\"]/div[4]/div[1]/div[2]/input[1]");
  }

  get Delete(): Locator {
    return this.page.locator("//div[contains(@class, 'modal-header')]");
  }

  get Delete_Batch_Time(): Locator {
    return this.page.locator("(//button[@aria-label=\"Delete Batch Time\"])[last()]");
  }

  get Delete_Early_Config_Button(): Locator {
    return this.page.locator("(//td[@data-title='Date' and contains(text(), '$|NextBusinessDateList|')]/..//button[2])");
  }

  get Delete_Enumeration_Pair(): Locator {
    return this.page.locator("//h5[text()[normalize-space() = \"Delete Enumeration Pair\"]]");
  }

  get Delete_In_EnumerationMapping(): Locator {
    return this.page.locator("(//div[contains(@class,\"input-field-name text\")]/..//button[@type=\"button\"])[1]");
  }

  get Delete_Message(): Locator {
    return this.page.locator("//div[text()[normalize-space() = 'You have selected to delete \"$|DeleteHeaderMapping|\" mapping. Do you want to proceed?']]");
  }

  get Delete_Option_Field(): Locator {
    return this.page.locator("//table//td[@data-title=\"Actions\"]//div/button[@aria-label=\"Delete\"]/span");
  }

  get Delete_Rule(): Locator {
    return this.page.locator("//h5[text()[normalize-space() = \"Delete Rule\"]]");
  }

  get Delete_Rule_Button(): Locator {
    return this.page.locator("(//span[text()[normalize-space() = \"Delete Rule\"]])[1]");
  }

  get Delete_batch_Button(): Locator {
    return this.page.locator("//span[normalize-space(text())=\"Delete batch\"]//parent::button");
  }

  get Delete_button_in_Header_Mapping(): Locator {
    return this.page.locator("//div[@class=\"gap-2 header-grid-layout unidentified-header\"]/..//i[@class=\"fas fa-trash-alt text-danger\"]");
  }

  get Delete_icon(): Locator {
    return this.page.locator("(//i[@class=\"fas fa-trash-alt text-danger\"])[5]");
  }

  get Delete_icon_Header_Mapping(): Locator {
    return this.page.locator("(//i[@class=\"fas fa-trash-alt text-danger\"])[3]");
  }

  get Delete_icon_in_Enumeration_Mappings(): Locator {
    return this.page.locator("(//i[@class=\"fa fas fa-trash trash-icon\"])[5]");
  }

  get Deleted_Action_Block(): Locator {
    return this.page.locator("(//div[@class=\"block\"])[2]");
  }

  get Deleted_Field_In_Enumeration(): Locator {
    return this.page.locator("(//div[@class=\"field-block mb-2\"])//div[text()=\" $|BidTapeValueforBeforeDeleted| \"]");
  }

  get Duplicate_Copy_Button(): Locator {
    return this.page.locator("(//span[text()[normalize-space() = \"Duplicate/Copy\"]])[1]");
  }

  get Duplicated_BidField_Value(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/..//button//div[contains(@class,\"text-truncate\")])[2]");
  }

  get Duplicated_Bidfield_Search_Field(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/..//input[@type=\"search\"])[2]");
  }

  get Duplicated_Rule_Enum_Value(): Locator {
    return this.page.locator("((//label[text()=\" Bid Enumerated Tape Value \"]/..//button)//div)[4]");
  }

  get Duplicated_enum_search_field(): Locator {
    return this.page.locator("(//label[text()=\" Bid Enumerated Tape Value \"]/..//input[@type=\"search\"])[2]");
  }

  get Early_Close_Config(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/early-close-config\"]");
  }

  get Early_Close_Config_Rows(): Locator {
    return this.page.locator("(//table//tr[@role=\"row\"])[position() >1 and position() <= last()]");
  }

  get Early_Conf_Del_Button_other_than_today(): Locator {
    return this.page.locator("//td[@data-title=\"Date\" and not(contains(text(),\"$|CurrentDateList|\"))]/..//button[@aria-label=\"Delete\"]");
  }

  get Early_Config_For_Current_Date(): Locator {
    return this.page.locator("//td[contains(text(),\" $|CurrentDateList|\")]");
  }

  get Early_Config_tomorrows_Date(): Locator {
    return this.page.locator("//td[contains(text(),\" $|TomorrowDateList|\")]");
  }

  get Edit_Map_Button(): Locator {
    return this.page.locator("//td[@role=\"cell\"]//input[@type=\"checkbox\"]//..//..//button[contains(@aria-label,\"Edit Map\")]");
  }

  get Edit_Permission_Button_For_Freedomcompany(): Locator {
    return this.page.locator("//td[contains(text(),\"@|Company Name|\")]/following-sibling::td[@data-title=\"Actions\"]//button[@aria-label=\"Edit Permission\"]//span[contains(@class, 'fa-pencil-alt')]");
  }

  get Edit_Permission_Buttonfirst_record(): Locator {
    return this.page.locator("//tbody[@role=\"rowgroup\"]/tr[1]/td[8]/div[1]/button[1]/span[1]");
  }

  get Edit_Permissions(): Locator {
    return this.page.locator("//h5[contains(.,'Edit Permissions')]");
  }

  get Edit_icon_in_Header_Mapping(): Locator {
    return this.page.locator("(//i[@class=\"fas fa-pencil-alt\"])[3]");
  }

  get Edited_Chase_Field_Name(): Locator {
    return this.page.locator("((//div[@class=\"field-block mb-2\"])/../../../..//div[@class=\"my-2\"])[2]");
  }

  get Edited_Chase_Value_After_Save(): Locator {
    return this.page.locator("(//button[text()=\" Add Field \"]/../div[text()=\"$|EditedChaseFieldName|\"]/../..//select)[1]");
  }

  get Enabled_Loan_Numbers_In_Price_Offered(): Locator {
    return this.page.locator("//button[contains(@aria-label,\"View loan details\")]");
  }

  get Enabled_PricingReturnTime(): Locator {
    return this.page.locator("//option[contains(text(),\"$|BulkBatchTiming|\")]");
  }

  get Enabled_Time(): Locator {
    return this.page.locator("//option[@aria-disabled=\"false\"]");
  }

  get Enabled_Time_New(): Locator {
    return this.page.locator("(//option[@aria-disabled=\"false\"])");
  }

  get Enter_maximum_display_value_in_percentage_Input(): Locator {
    return this.page.locator("//input[@aria-label=\"Enter maximum display value in percentage\"]");
  }

  get Enter_minimum_display_value_in_percentage(): Locator {
    return this.page.locator("//input[@aria-label=\"Enter minimum display value in percentage\"]");
  }

  get Entered_Bid_Mapping_Id_New(): Locator {
    return this.page.locator("//span[contains(text(),\"@|BidMappingIDNew|\")]");
  }

  get Enumeration_Mapping_Button(): Locator {
    return this.page.locator("//span[text()='Enumeration Mapping']");
  }

  get Error_Message_in_Header_Mapping(): Locator {
    return this.page.locator("//p[text()[normalize-space() = \"Multiple client headers are mapped to the same Chase Field name. Please review and make changes.\"]]/..");
  }

  get Errored_Loans_Count_from_Rows_table_1(): Locator {
    return this.page.locator("(//table)[1]//td[@data-title=\"Loan Status\"]//*[text()=\" Error \"]");
  }

  get Errored_Loans_Header1(): Locator {
    return this.page.locator("(//h5[@aria-labelledby=\"totalLoanRowsLabel\"]//span[contains(@aria-label,\"Errored Loans\")])[1]");
  }

  get Errors_Check_On_Laon_Details_Popup(): Locator {
    return this.page.locator("//div[@class=\"flex-grow-1 d-flex gap-3\"]//div/div[@id=\"errorsCheckLabel\"]/..//h5[@aria-labelledby=\"errorsCheckLabel\"]");
  }

  get Execution_Type_Dropdown_New(): Locator {
    return this.page.locator("//label[text()=\"Execution Type\"]/..//select");
  }

  get Execution_Type_from_Details_table1(): Locator {
    return this.page.locator("(//div[text()=\" Execution Type \"]/..//h5)[1]");
  }

  get Export_List(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Export List\"]]");
  }

  get Export_Selected(): Locator {
    return this.page.locator("//button[@type=\"button\" and text()=\" Export Selected \"]");
  }

  get Export_Selected_1_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Export Selected\"]]");
  }

  get FICO_Score(): Locator {
    return this.page.locator("//span[@title=\"FICO Score\"]");
  }

  get FifthCompany_Checkbox(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[6]");
  }

  get Fifth_Company_Name(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[6]//following-sibling::div/span");
  }

  get File_Input(): Locator {
    return this.page.locator("//input[@type=\"file\"]");
  }

  get Filter_Dropdown(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Filter\"]]");
  }

  get Filtered_Lastmonth_Uploaded_Date(): Locator {
    return this.page.locator("//td[@data-title=\"Uploaded\"]//div[starts-with(text(),\" $|Last Month|\")]");
  }

  get Filtered_Status_BidRequest_ID(): Locator {
    return this.page.locator("//div[   contains(@aria-label, 'Loans total:') and   number(substring-before(substring-after(@aria-label, 'Loans total: '), ',')) < 10 ]/../..//td[@data-title=\"Execution Type\"]//div[text()=\" $|ExecutionType| \"]/../..//td[@data-title=\"Status\"]//span[contains(text(),\"$|StatusToBeSelected|\")]/../../..//td[@data-title=\"Bid Req. ID\"]");
  }

  get Filtered_Status_BidRequest_ID_Standard_and_chase(): Locator {
    return this.page.locator("//div[   contains(@aria-label, 'Loans total:') and   number(substring-before(substring-after(@aria-label, 'Loans total: '), ',')) <= 10 ]/../..//td[@data-title='Execution Type']/div[normalize-space(.) = 'Standard , Chase Direct']/../..//td[@data-title=\"Status\"]//*[text()=\" $|StatusToBeSelected| \"]/../../..//td[@data-title=\"Bid Req. ID\"]");
  }

  get First_Active_Rule_Name(): Locator {
    return this.page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[1]");
  }

  get First_Bid_Request_ID(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Req. ID\"]");
  }

  get First_CheckboxData(): Locator {
    return this.page.locator("//tbody//input[@type=\"checkbox\"]");
  }

  get First_Checkbox_Enum(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\" and @class=\"mapping-select mt-1\"])[1]");
  }

  get First_Comm_Date_Commiment_list(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Committed Date:\")]");
  }

  get First_Company_Name(): Locator {
    return this.page.locator("(//div[@class='d-flex align-items-end'][contains(.,'Company Name')]/../../../..//td[@data-title=\"Company Name\"])");
  }

  get First_Header_Checkbox(): Locator {
    return this.page.locator("(//fieldset//input[@type=\"checkbox\"])[1]");
  }

  get First_Select_Category_box_text(): Locator {
    return this.page.locator("(//button[@id=\"multiSelectDropDown\"]//div)[1]");
  }

  get First_User_Name_UI(): Locator {
    return this.page.locator("//td[@data-title=\"Username\"]");
  }

  get First_loan_Number_In_table(): Locator {
    return this.page.locator("(//tbody//tr//td)[1]//button[1]");
  }

  get Footer_Queued_For_Date(): Locator {
    return this.page.locator("//div[@id=\"page-footer\"]//span[contains(text(),\"Queued For\")]");
  }

  get Footer_Submission_Date(): Locator {
    return this.page.locator("//div[@id=\"page-footer\"]//span[@class=\"d-block\"]");
  }

  get FourthCompany_Checkbox(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[5]");
  }

  get Fourth_Company_Name(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[5]//following-sibling::div/span");
  }

  get GeneralSettings_Menu(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"General Settings\"]]");
  }

  get General_Settings(): Locator {
    return this.page.locator("//*[text()[normalize-space() = \"General Settings\"]]");
  }

  get Get_Price_Button(): Locator {
    return this.page.locator("//button[normalize-space(text())=\"Get Price\"]");
  }

  get Get_Price_Button_price_offered(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Get Price\"]]");
  }

  get Go_to_Next_Page_Button(): Locator {
    return this.page.locator("//span[contains(@class, 'dlp-icon') and contains(@class, 'fa-chevron-right')]");
  }

  get Gross_Price_Commitment_List(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Gross Price\"]");
  }

  get Gross_Price_price_offered_screen_table(): Locator {
    return this.page.locator("( //table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Gross Price\"]/div)[$|count1|]");
  }

  get Header_Mapping(): Locator {
    return this.page.locator("//a[text()[normalize-space() = \"Header Mapping\"]]");
  }

  get Header_Mapping1(): Locator {
    return this.page.locator("//a[contains(text(),\"Header Mapping\")]");
  }

  get Header_Mapping_Dropdown(): Locator {
    return this.page.locator("//select[contains(normalize-space(),\"Select Show All Headers Show Unidentified Headers (10) Show Unused Headers Show Used Headers\")]");
  }

  get Header_Mapping_Show_Unidentified_Header(): Locator {
    return this.page.locator("//select[@class=\"form-select\"]/../..//option[@value=\"Show Unidentified Headers\"]/..//span[text()=\"(10)\"]");
  }

  get Header_Mapping_for_Unidentified_Headers(): Locator {
    return this.page.locator("(//select[contains(@class, 'form-select')])[$|Headercount|]");
  }

  get Header_Names_UI(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Sort by\")]");
  }

  get Headers(): Locator {
    return this.page.locator("(//div[@role=\"button\"])[$|indexExcel|]");
  }

  get Headers_Names_UI_Commitment_List(): Locator {
    return this.page.locator("(//div[contains(@aria-label,\"Sort by\")])[position() != 2 and position() != 10]");
  }

  get Headers_UI(): Locator {
    return this.page.locator("(//div[contains(@aria-label,\"Sort by\")])[position() <= 8]");
  }

  get Headers_UI_Closed_List(): Locator {
    return this.page.locator("(//div[contains(@aria-label,\"Sort by\")])[position() <= 13]");
  }

  get Hedge_Ratio_Commitment_List(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Hedge Ratio\"]");
  }

  get Hedge_Ratio_price_offered_screen_table(): Locator {
    return this.page.locator("( //table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Hedge Ratio\"]/div)[$|count1|]");
  }

  get IF_Bid_Field_Dropdown_new(): Locator {
    return this.page.locator("//label[text()=\"If Bid Field\"]/../..//select/ancestor::div//*[@aria-label=\"Bid Map Field\"]//select");
  }

  get IF_Chase_Field(): Locator {
    return this.page.locator("//label[text()=\"Chase value\"]/../..//*[@aria-label=\"LP Field Type\"]//select");
  }

  get Import_Rule_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Import Rule\"]]");
  }

  get Import_Rule_Checkbox(): Locator {
    return this.page.locator("//input[@id=\"TEst - 0\"]");
  }

  get Individual_BidSample_Chasename_In_Dropdown(): Locator {
    return this.page.locator("//div[@class=\"dropdown-overflow\"]//*[contains(text(),\"$|ChaseName|\")]");
  }

  get Individual_BidSample_Name(): Locator {
    return this.page.locator("(//fieldset//div[@class=\"flex-grow-1\"])[$|count|]");
  }

  get Individual_Bid_Sample_Name_Enum_Page(): Locator {
    return this.page.locator("(//div[@class=\"my-2\"])[$|count1|]/ancestor::div[contains(@class,\"mapping-card\")]//div[@class=\"col-2\"]//div[not(contains(@class,\"my-2\"))]");
  }

  get Individual_Bid_Tape_Value_2(): Locator {
    return this.page.locator("(//div[text()=\"$|ColumnHeader|\" and not(@class=\"my-2\")]/../..//div[contains(@class,\"input-field-name\")])[$|count2|]");
  }

  get Individual_Cell_Data(): Locator {
    return this.page.locator("(//tr[$|RowsCount|]//td)[$|ColumnCount|]");
  }

  get Individual_Cell_Data_UI(): Locator {
    return this.page.locator("(//table[@role='table']//tbody//tr[$|count|]//td[@data-title][position() >= 3])[$|Count|]");
  }

  get Individual_Cell_Data_UI_Locked_Loans(): Locator {
    return this.page.locator("((//span[contains(@class,\"fa fas fa-lock lock-icon\")])[$|count|]//ancestor::tr//td[@data-title][position() >2 and position()!= 4 and position()!= 12])[$|Count|]");
  }

  get Individual_Cell_Value_Closed_List(): Locator {
    return this.page.locator("(//tr[contains(@class,'row')][$|RowCount|]//td[position() >= 2 and position() <= 14])[$|ColumnCountUI|]");
  }

  get Individual_Cell_Value_UI(): Locator {
    return this.page.locator("(//tbody//tr[$|RowCountUI|]//td)[$|ColumnCountUI|]");
  }

  get Individual_ChaseValue_of_ChaseField(): Locator {
    return this.page.locator("((//div[@class=\"my-2\" and text()=\"$|IndividualChaseFieldName|\"]/..//following-sibling::div)//div[@class=\"mb-2\"]//*[contains(@class,\"form-control p-0\") or contains(@class,\"form-select\")])[$|count2|]");
  }

  get Individual_Chase_Enum_Name(): Locator {
    return this.page.locator("(//div[@class=\"my-2\"])[$|count1|]");
  }

  get Individual_Chase_Field_Name_Popup(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\"])[$|count|]");
  }

  get Individual_Chase_Value_Popup(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"$|ChaseFieldNameBeforeSubmit|\")]/following-sibling::div)[1]");
  }

  get Individual_Chase_Value_popup2(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"$|ChaseFieldPopupAfterSubmit|\")]/following-sibling::div)[1]");
  }

  get Individual_Checkbox_Enum(): Locator {
    return this.page.locator("(//div[@class=\"my-2\"])[$|count1|]/ancestor::div[contains(@class,\"mapping-card\")]//input[@type=\"checkbox\"]");
  }

  get Individual_Column_Name(): Locator {
    return this.page.locator("//th[position() >1 and position() < last()][$|count|]");
  }

  get Individual_Corr_Loan_Num(): Locator {
    return this.page.locator("(//td[@data-title=\"Corr. Loan#\"]//button[1])[$|RowCount|]");
  }

  get Individual_Header_Name_UI(): Locator {
    return this.page.locator("(//div[contains(@aria-label,\"Sort by\")])[$|count|]");
  }

  get Individual_Header_Names_UI_Commitment_List(): Locator {
    return this.page.locator("((//div[contains(@aria-label,\"Sort by\")])[position() != 2 and position() != 10])[$|count|]");
  }

  get Individual_Headers(): Locator {
    return this.page.locator("((//div[contains(@aria-label,\"Sort by\")])[position() <= 8])[$|Count|]");
  }

  get Individual_Headers_Commitment_List(): Locator {
    return this.page.locator("((//div[contains(@aria-label,\"Sort by\")])[position() <= 13])[$|Count|]");
  }

  get Individual_Loan_Num_Price_Offered(): Locator {
    return this.page.locator("(//button[contains(@aria-label,\"View loan details\")])[$|count|]");
  }

  get Individual_Mapped_Chase_Name(): Locator {
    return this.page.locator("(//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select)[$|count|]");
  }

  get Individual_Mark_Adjust_Value_Fresh_Loans(): Locator {
    return this.page.locator("(//*[contains(@aria-label,\"Select loan\")]/../..//td[@data-title=\"Mark Adj\"])[$|count|]");
  }

  get Individual_Selected_Company(): Locator {
    return this.page.locator("//label[text()=\"Select Company/s\"]/..//div[@class=\"pill rounded-pill relative\"]//span");
  }

  get Individual_Status_On_Popup(): Locator {
    return this.page.locator("(//td[@data-title=\"Status\"]//span)[$|count|]");
  }

  get Insert_Header_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Insert Header\"]]");
  }

  get Int_Rate_price_offered_screen_table(): Locator {
    return this.page.locator("( //table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Int. Rate\"])[$|count1|]");
  }

  get Interest_Rate_Commitment_List(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Int. Rate\"]");
  }

  get Internal_User_Minutes_Input(): Locator {
    return this.page.locator("//input[@aria-label=\"Internal User Minutes\"]");
  }

  get Internal_User_Username_Replacement_Input(): Locator {
    return this.page.locator("//input[@aria-label=\"Internal User Username Replacement\"]");
  }

  get LMI_Price_Popup_Details(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"LMI_INCENTIVE_PRICE\")]/following-sibling::div)[1]");
  }

  get LMI_Type_Popup_Details(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"LMI_TYPE\")]/following-sibling::div)[1]");
  }

  get Last_Batch_Time_Input_Box(): Locator {
    return this.page.locator("//input[@id='lastBatchTime']");
  }

  get Last_Batch_Time_Unit_Dropdown(): Locator {
    return this.page.locator("//input[@id='lastBatchTime']/following-sibling::div//select[@aria-label=\"Default dropdown selection\"]");
  }

  get Last_Modified_Data_Right_Corner_Screen(): Locator {
    return this.page.locator("(//div[contains(text(),\"Last Modified\")])[1]");
  }

  get Last_Name_Commitment_List(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Last Name\"]");
  }

  get Last_Name_Down_Arrow_Details(): Locator {
    return this.page.locator("//div[contains(text(),\"Last Name\")]//following::span[contains(@class,\"fas small px-1 fa-sort-down\")]");
  }

  get Last_Name_Sort_Button(): Locator {
    return this.page.locator("//div[@aria-label=\"Sort by Last Name\"]");
  }

  get Last_One_Month_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Last One Month\"]]");
  }

  get Last_batch_Time_bulk_batch_screen(): Locator {
    return this.page.locator("(//h5[@class=\"mb-0\"])[last()]");
  }

  get Line_by_line_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Line by line\"]]");
  }

  get Line_by_line_Table(): Locator {
    return this.page.locator("//div[@class=\"d2h-file-diff\"]//table");
  }

  get Loan_Numbers_Expect_the_Current_Loan(): Locator {
    return this.page.locator("(//button[contains(@aria-label,\"View loan details\")])[not(position()=$|count|)]");
  }

  get LockedLoans_ChaseFieldValuePopup(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"$|ChaseFieldPopupLockedLoans|\")]/following-sibling::div)[1]");
  }

  get Locked_Loans_Rows_Count_Commitment_List(): Locator {
    return this.page.locator("//span[contains(@class,\"fa fas fa-lock lock-icon\")]//ancestor::tr[@role=\"row\"]");
  }

  get Login_Button(): Locator {
    return this.page.locator("//button[contains(@class, 'btn-primary') and contains(@class, 'caps') and contains(@class, 'login-button')]");
  }

  get Logo(): Locator {
    return this.page.locator("//img[@alt=\"Image\"]");
  }

  get Map_Headers_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Map Headers\"]]");
  }

  get Map_Name_Field_in_Bid_Maps(): Locator {
    return this.page.locator("//input[@id='mapName']");
  }

  get MappedChaseFieldName(): Locator {
    return this.page.locator("//fieldset//div[@class=\"gap-2 header-grid-layout\"]//select");
  }

  get Mapped_Chase_Value(): Locator {
    return this.page.locator("//div[@class=\"flex-grow-1\" and text()=\"$|BidSampleName|\"]/..//select");
  }

  get Mapped_Chase_Value_2(): Locator {
    return this.page.locator("//div[@class=\"flex-grow-1\" and text()=\"@|Bid Sample Field Name|\"]/..//select");
  }

  get Mappings(): Locator {
    return this.page.locator("//h1[text()=\"Mappings\"]");
  }

  get Mark_Adj_Commitment_List(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Mark Adj\"]");
  }

  get Mark_Adj_price_offered_screen_table(): Locator {
    return this.page.locator("(//table//td[@data-title=\"Mark Adj\"])[$|count1|]");
  }

  get Market_Thresholds(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/market-thresholds\"]");
  }

  get Maximum_Display_Value(): Locator {
    return this.page.locator("//label[text()=\"Max Display Value\"]/..//input[contains(@aria-label,\"Enter maximum display value in percentage\")]");
  }

  get Minimum_Display_value(): Locator {
    return this.page.locator("//label[text()=\"Min Display Value\"]/..//input[contains(@aria-label,\"Enter minimum display value in percentage\")]");
  }

  get Modified_batch_timings_successfully_Message(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Modified batch timings successfully\"]]");
  }

  get Modify_Batch_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Modify Batch\"]]");
  }

  get Modify_Batch_Intervals_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Modify Batch Intervals\"]]");
  }

  get New_Chase_value(): Locator {
    return this.page.locator("(//div[contains(@class,'border-bottom') and contains(.,'AmortizationTerm')])[1]/following-sibling::div[1]");
  }

  get New_Field_Chase_Dropdown(): Locator {
    return this.page.locator("((//input[@type=\"text\" and contains(@class, 'input-field-edit')])/ancestor::div[@class=\"mapping-card rounded-3 unchecked\"]//select)[last()]");
  }

  get New_Field_Chase_Dropdown2(): Locator {
    return this.page.locator("(//input[@class=\"input-field-edit\"]/../../../../..//select[@class=\"form-select\"])[2]");
  }

  get New_Header_Mapping(): Locator {
    return this.page.locator("//div[contains(@class, 'header-grid-layout') and contains(@class, 'custom-header')]");
  }

  get New_Map_Name_Input(): Locator {
    return this.page.locator("//input[contains(@id,\"mappingName\")]");
  }

  get No_Of_Batches(): Locator {
    return this.page.locator("//label[@for=\"batches\"]/following-sibling::input[@placeholder=\"00\"]");
  }

  get Not_Committed_Loans_Count(): Locator {
    return this.page.locator("//*[contains(@aria-label,\"Select loan\")]");
  }

  get Off_Radio_Button(): Locator {
    return this.page.locator("#bulk-bid-select-off");
  }

  get Off_Radio_Standard_Edit_Permissions_Popup(): Locator {
    return this.page.locator("(//input[@type=\"radio\"])[2]");
  }

  get Ok_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Ok\"]]");
  }

  get Okay_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Okay\"]]");
  }

  get Okay_Button_Popup(): Locator {
    return this.page.locator("//button[contains(text(),\"Okay\")]");
  }

  get On_Radio_Button(): Locator {
    return this.page.locator("//input[@id='bulk-bid-select-on']");
  }

  get On_Radio_ChaseDirect_Edit_Permissions_Popup(): Locator {
    return this.page.locator("(//input[@type=\"radio\"])[3]");
  }

  get On_Radio_button_in_Bid_Request(): Locator {
    return this.page.locator("(//input[@type=\"radio\"])[1]");
  }

  get Open_Auth_Limit_All_Loans(): Locator {
    return this.page.locator("//div[contains(text(),\"Open Auth Limit:\")]//following-sibling::div");
  }

  get Operation_Dropdown(): Locator {
    return this.page.locator("//select[contains(normalize-space(),\"Select = != > < >= <= contains\")]");
  }

  get Operations_Dropdown_2(): Locator {
    return this.page.locator("(//select[contains(normalize-space(),\"Select = != > < >= <= contains\")])[2]");
  }

  get Operations_Dropdown_Advance_Search(): Locator {
    return this.page.locator("//div[@aria-labelledby=\"rulesGroup\"]/following-sibling::div//*[@aria-label=\"Operator\"]//select");
  }

  get Option_in_PricingReturn_Dropdown(): Locator {
    return this.page.locator("//option[contains(text(),\"$|BatchTime|\")]");
  }

  get OptionsCountInPricingDropdownPastTime(): Locator {
    return this.page.locator("//option[@value and @aria-disabled=\"true\"]");
  }

  get Other_Config(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/other-config\"]");
  }

  get POS_Validation_Delegated_Conventional_Mandatory(): Locator {
    return this.page.locator("(//app-single-select-dropdown   [.//text()[normalize-space()='Conventional']]   /following-sibling::input[@type='text'])[3]");
  }

  get Pagination_Count(): Locator {
    return this.page.locator("//div[@aria-label=\"Pagination Controls\"]//span[@aria-atomic=\"true\"]");
  }

  get Password_Field(): Locator {
    return this.page.locator("//input[@type=\"password\"]");
  }

  get Price_Offered_Status_of_searched_bid(): Locator {
    return this.page.locator("//button[contains(text(),\"$|RequestIDDetails|\")]/../..//td[@data-title=\"Status\"]//span[contains(text(),\"Price Offered\")]");
  }

  get Pricing_ReturnTime_Dropdown(): Locator {
    return this.page.locator("//*[@id=\"pricingReturnTimeDropdown\"]//select[contains(@class,\"form-select\")]");
  }

  get Pricing_Return_Time(): Locator {
    return this.page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]");
  }

  get Pricing_Return_Time_Buffer(): Locator {
    return this.page.locator("//input[@id=\"pricingReturnTimeBuffer\"]");
  }

  get Proceed_with_Saving_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Proceed with Saving\"]");
  }

  get Product_Name_Details(): Locator {
    return this.page.locator("//div[text()=\"Product\"]//following-sibling::h5");
  }

  get Product_Name_Popup_Details(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"Product Name\")]/following-sibling::div)[1]");
  }

  get Queued_Forbid_request_details_text_dark(): Locator {
    return this.page.locator("//div/span[@class=\"text-dark\"]");
  }

  get Real_Time_Radio_ButtonUpload_Bid(): Locator {
    return this.page.locator("//form[@aria-labelledby=\"executionDetailsHeader\"]/div[4]/div[1]/div[1]/input[1]");
  }

  get Ref_Sec_Price_price_offered_screen_table(): Locator {
    return this.page.locator("( //table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Ref Sec Price\"]/div)[$|count1|]");
  }

  get Reference_Security_Commitment_List(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Ref Sec Prod.\"]");
  }

  get Reference_Security_Price_Commitment_List(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Ref Sec Price\"]");
  }

  get Remaining_Time_Price_Offered(): Locator {
    return this.page.locator("//div[text()=\"Remaining Time\"]/..//h5");
  }

  get Request_Id_From_Details(): Locator {
    return this.page.locator("//div[text()=\"Request ID\"]/..//h5");
  }

  get Required_Company_Checkbox_Bidmap_Company_dropdown(): Locator {
    return this.page.locator("((//input[@type=\"checkbox\" and not(contains(@aria-label,\"Home Sweet Mortgage\"))])[position() > 1 and position() < last()])[1]");
  }

  get Required_Company_Checkbox_filter(): Locator {
    return this.page.locator("//input[@type=\"checkbox\" and contains(@aria-label,\"@|Company Name|\")]");
  }

  get Required_Company_s_Name_Value(): Locator {
    return this.page.locator("//span[@class='pl-2'][contains(.,'$|Companyname|')]");
  }

  get Required_Date_Filters(): Locator {
    return this.page.locator("//div[@role=\"gridcell\" and @aria-label=\"$|DateFormatFilter|\"]");
  }

  get Required_Delete_Email_Button(): Locator {
    return this.page.locator("(//td[@data-title=\"Email\" and contains(text(),\"$|ExpectedEmail|\")])/..//button[2]");
  }

  get Required_Loan_Num(): Locator {
    return this.page.locator("//td[@role=\"cell\"]//input[@type=\"checkbox\"]");
  }

  get Required_Status_Name(): Locator {
    return this.page.locator("//span[text()=\"@|Status Name|\"]");
  }

  get Reset_Button(): Locator {
    return this.page.locator("//i[contains(@class, 'fa-undo')]");
  }

  get Rows_Count_Table_1(): Locator {
    return this.page.locator("(//table)[1]//tbody//tr");
  }

  get Rows_Count_Total_Loans_Tab(): Locator {
    return this.page.locator("//tr[@role=\"row\"]");
  }

  get Rule_Name_Field(): Locator {
    return this.page.locator("//input[@placeholder=\"Enter a Rule Name\"]");
  }

  get Rule_Name_Input_Field_Duplicated(): Locator {
    return this.page.locator("(//input[@placeholder=\"Enter a Rule Name\"])[2]");
  }

  get Rules_and_Actions_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Rules and Actions\"]]");
  }

  get Rules_and_Actions_Heading(): Locator {
    return this.page.locator("//h1[text()=\" Rules and Actions / \"]");
  }

  get Rules_and_Actions_Step_4_of_4(): Locator {
    return this.page.locator("//h1[@class=\"fw-semibold py-3\"]");
  }

  get Save_Changes_Button(): Locator {
    return this.page.locator("//button[text()=\"Save Changes\"]");
  }

  get Save_Config_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Save Configuration\"]");
  }

  get Save_Draft_Button(): Locator {
    return this.page.locator("//div[contains(@class, 'container') and contains(@class, 'd-flex')]/div[2]/button[2]");
  }

  get Save_Draft_Exit_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Save Draft & Exit\"]]");
  }

  get Save_Settings(): Locator {
    return this.page.locator("//div[contains(@class, 'scrollable-page')]/div[1]/app-general-settings-container[1]/div[2]/div[1]/div[2]/app-company-config-container[1]/app-company-config[1]/div[2]//button");
  }

  get Save_and_Move_to_Next_Page(): Locator {
    return this.page.locator("//h5[text()[normalize-space() = \"Save and Move to Next Page\"]]");
  }

  get Save_and_Publish_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Save and Publish\"]]");
  }

  get SearchFilter_Input_Field(): Locator {
    return this.page.locator("//input[@placeholder=\"Search/Filter\"]");
  }

  get Search_Field(): Locator {
    return this.page.locator("(//input[@type=\"search\"])[1]");
  }

  get Search_FieldLon_Details_Popup(): Locator {
    return this.page.locator("//input[@placeholder=\"Search Fields\"]");
  }

  get Search_Field_For_Company(): Locator {
    return this.page.locator("//input[@id='searchBox']");
  }

  get Search_Field_in_Add_Condition(): Locator {
    return this.page.locator("(//input[@type=\"search\"])[3]");
  }

  get Search_Field_in_Bid_Enumerated_Tape_Value(): Locator {
    return this.page.locator("(//label[text()[normalize-space() = \"Bid Enumerated Tape Value\"]]/following-sibling::div[contains(@class, 'd-flex')]//div[@aria-labelledby=\"singleSelectDropDown\"]//input[@type=\"search\"])[1]");
  }

  get Search_Filter_Input(): Locator {
    return this.page.locator("//div[@class=\"custom-input\"]//input");
  }

  get Search_Filter_Input_in_Customer_Permission(): Locator {
    return this.page.locator("//input[@placeholder=\"Search / Filter\"]");
  }

  get Search_In_Committed_Page(): Locator {
    return this.page.locator("//div//input[@placeholder=\"Search\"]");
  }

  get Search_Input(): Locator {
    return this.page.locator("//input[@placeholder=\"Search\"]");
  }

  get Search_Map_Input(): Locator {
    return this.page.locator("#typeahead-dropdown");
  }

  get Search_Map_Input_Dropdown(): Locator {
    return this.page.locator("(//span[text()[normalize-space() = \"Deepika Aug1\"]])[1]");
  }

  get Search_box_Bid_mapping_id(): Locator {
    return this.page.locator("//div[contains(@class, 'shadow') and contains(@class, 'dropdown-menu') and contains(@class, 'show')]//input[@placeholder=\"Search\"]");
  }

  get Search_by_Bid_Request_ID_Field(): Locator {
    return this.page.locator("//div//input[@placeholder=\"Search By Bid Request ID\"]");
  }

  get Second_Bid_Map(): Locator {
    return this.page.locator("//tbody//tr[2]");
  }

  get Second_Category_Checkbox(): Locator {
    return this.page.locator("((//div[@class=\"cursor-pointer py-3 text-wrap\"])/..//input)[3]");
  }

  get Second_Category_In_Dropdown(): Locator {
    return this.page.locator("(//div[@class=\"cursor-pointer py-3 text-wrap\"])[3]");
  }

  get Second_Enabled_Time(): Locator {
    return this.page.locator("(//option[@aria-disabled=\"false\"])[2]");
  }

  get See_the_difference_Button(): Locator {
    return this.page.locator("//tbody[@role=\"rowgroup\"]/tr[1]/td[4]/div[1]/button[1]");
  }

  get SelectCompany_Value(): Locator {
    return this.page.locator("(//span[contains(@class,'pl-2')])[1]");
  }

  get SelectText_HedaerMapping_Field(): Locator {
    return this.page.locator("(//div[contains(@class,\"gap-2 header-grid-layout\")]/..//select)[$|IndexCount|]");
  }

  get Select_All_Checkbox(): Locator {
    return this.page.locator("//input[@id='chkItemallIdundefined']");
  }

  get Select_All_Loan_Num(): Locator {
    return this.page.locator("//input[contains(@aria-label,\"Select all for\") and @type=\"checkbox\"]");
  }

  get Select_Bid_Request_Status_Dropdown1(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Select Bid Request Status\"]]");
  }

  get Select_Button(): Locator {
    return this.page.locator("//a[text()=\"Select\"]");
  }

  get Select_Category(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[2]");
  }

  get Select_Category_Dropdown(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Select Category\"]]");
  }

  get Select_Category_Dropdown_Duplicated(): Locator {
    return this.page.locator("(//button[@id=\"multiSelectDropDown\"])[2]");
  }

  get Select_Category_On_Rules_and_Actions(): Locator {
    return this.page.locator("(//div[@class=\"cursor-pointer py-3 text-wrap\"])[2]");
  }

  get Select_Company_CCode_Dropdown(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Select Company/CCode\"]]");
  }

  get Select_Company_In_BidRequest(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Select\"]]");
  }

  get Select_Company_Names(): Locator {
    return this.page.locator("//span[@class='pl-2'][contains(.,'@|Company name 1|')]");
  }

  get Select_Companys_Dropdown(): Locator {
    return this.page.locator("//div//div[@id=\"companySelect\"]//div//button[@id=\"multiSelectDropDown\"]");
  }

  get Select_Current_Date_Filters_Price_Offered(): Locator {
    return this.page.locator("//div[@class=\"ngb-dp-month\"]//div[@aria-label=\"$|CurrentDate|\"]");
  }

  get Select_Date_Range_Dropdown(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Select Date Range\"]]");
  }

  get Select_Date_Range_Dropdown_Field(): Locator {
    return this.page.locator("//label[text()=\"Select Date Range\"]/..//button");
  }

  get Select_Date_Range_Dropdown_Value(): Locator {
    return this.page.locator("//button[@class=\"form-control text-dark text-start d-flex align-items-center dropdown-toggle\"]");
  }

  get Select_Dropdown_for_First_Time_Home_Buyer(): Locator {
    return this.page.locator("//*[text()=\"First Time Home Buyer\"]/../..//select");
  }

  get Select_Pricing_Batch_Dropdown(): Locator {
    return this.page.locator("//select[@class=\"form-select ng-pristine ng-invalid ng-touched\"] | //select[@class=\"form-select ng-untouched ng-pristine ng-invalid\"]");
  }

  get Select_Rule_1(): Locator {
    return this.page.locator("(//span[@class='ngb-highlight'][contains(.,'@|Search Map Input|')])[1]");
  }

  get Select_Rule_s(): Locator {
    return this.page.locator("//h5[text()[normalize-space() = \"Select Rule/s\"]]");
  }

  get Select_all_for_Checkbox(): Locator {
    return this.page.locator("//input[normalize-space(@aria-label)=\"Select all for\" and @type=\"checkbox\"]");
  }

  get Select_month_Dropdownfilters(): Locator {
    return this.page.locator("//select[@aria-label=\"Select month\"]");
  }

  get Select_text_Chase_Value(): Locator {
    return this.page.locator("(//label[text()=\"Chase Value\"]/..//a[text()=\"Select\"])[1]");
  }

  get Select_text_Duplicated_Bid_field(): Locator {
    return this.page.locator("(//label[text()=\" When Bid Field \"]/..//a[text()=\"Select\"])");
  }

  get Select_text_Duplicated_Enum(): Locator {
    return this.page.locator("(//label[text()=\" Bid Enumerated Tape Value \"]/..//a[text()=\"Select\"])");
  }

  get Select_year_Dropdownfilters(): Locator {
    return this.page.locator("//select[@aria-label=\"Select year\"]");
  }

  get Selected_Companies(): Locator {
    return this.page.locator("//label[text()=\"Select Company/s\"]/..//div[@class=\"pill rounded-pill relative\"]");
  }

  get Selected_Company_Name_Customer_Permissions(): Locator {
    return this.page.locator("//td[@data-title=\"Company Name\" and text()=\" @|CompanyName(CustomerPermissions)| \"]");
  }

  get Set_page_size_to_50_Dropdown(): Locator {
    return this.page.locator("//button[@aria-label=\"Set page size to 50\"]");
  }

  get Show_20(): Locator {
    return this.page.locator("//button[@role=\"button\" and contains(text(),\"Show 20\")]");
  }

  get Show_All_Headers_in_Header_Mappings(): Locator {
    return this.page.locator("//div[@class=\"gap-2 header-grid-layout\"]/../..//div[@class=\"flex-grow-1\"]");
  }

  get Show_Results_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Show Results\"]]");
  }

  get Side_by_Side_Tables(): Locator {
    return this.page.locator("//div[@class=\"d2h-file-side-diff\"]//table");
  }

  get Side_by_side_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Side by side\"]]");
  }

  get SixthCompany_Checkbox(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[7]");
  }

  get Sixth_Company_Name(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[7]//following-sibling::div/span");
  }

  get Smart_Mapper(): Locator {
    return this.page.locator("//label[text()[normalize-space() = \"Smart Mapper\"]]");
  }

  get Spinner(): Locator {
    return this.page.locator("//span[contains(@class,'circle')]");
  }

  get StandardExceutionType_Dropdown(): Locator {
    return this.page.locator("(//option[@value=\"3\"])[1]/../..//select[@aria-label=\"Dropdown selection\"]");
  }

  get StandardExecution_Dropdown(): Locator {
    return this.page.locator("(//select[contains(normalize-space(),\"Select 3 7 15\")])[1]");
  }

  get Standard_Dropdown(): Locator {
    return this.page.locator("//select[@aria-label=\"Dropdown selection\"]");
  }

  get Standard_Execution_Checkbox(): Locator {
    return this.page.locator("//label[text()=\"Standard\"]/..//input[@type=\"checkbox\"]");
  }

  get Standard_Flow_Off_Button(): Locator {
    return this.page.locator("(//label[normalize-space(text())='Standard Flow']/parent::div//input)[2]");
  }

  get Standard_Flow_On_Button(): Locator {
    return this.page.locator("(//label[normalize-space(text())='Standard']/parent::div//input)[1]");
  }

  get Standard_New_Data_pop_up_sub_text(): Locator {
    return this.page.locator("//td[@class=\"d2h-ins d2h-change\"]//span[contains(text(),\"dynamicPricing\" )]//ins");
  }

  get Standard_Off_Radio_button(): Locator {
    return this.page.locator("(//label[normalize-space(text())='Standard']/parent::div//input)[2]");
  }

  get Standard_On_RadioGlobal_Restriction(): Locator {
    return this.page.locator("//input[@id='dynamicPricing-select-on']");
  }

  get Standard_Previous_Data_pop_up(): Locator {
    return this.page.locator("//td[@class=\"d2h-del d2h-change\"]//span[contains(text(),\"dynamicPricing\" )]");
  }

  get Standard_State_First_Record(): Locator {
    return this.page.locator("(//td[@data-title=\"Standard\"]//div)[1]");
  }

  get Standard_previous_data_pop_up_sub_text(): Locator {
    return this.page.locator("//td[@class=\"d2h-del d2h-change\"]//span[contains(text(),\"dynamicPricing\" )]//del");
  }

  get StartTime_In_Hour(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"H\"]]/preceding-sibling::input[@placeholder=\"0\"]");
  }

  get StartTime_In_Minutes(): Locator {
    return this.page.locator("(//input[@placeholder=\"00\"])[1]");
  }

  get Start_task_Button(): Locator {
    return this.page.locator("(//button[@class=\"el-button el-button--primary\"])[2]");
  }

  get Status(): Locator {
    return this.page.locator("(//td[@data-title=\"Status\"])[1]");
  }

  get Status_Filter_Tube(): Locator {
    return this.page.locator("//div[@class=\"pill rounded-pill relative\" and contains(@aria-label,\"Chip Status\")]");
  }

  get Status_checkbox_Filter(): Locator {
    return this.page.locator("//input[@type=\"checkbox\" and @aria-label=\"Select $|StatusToBeSelected|\"]");
  }

  get Submit_for_Pricing_Enabled(): Locator {
    return this.page.locator("//button/span[text()=\"Submit For Pricing\"]/..");
  }

  get Success_Loans_Count_From_Rows_table1(): Locator {
    return this.page.locator("(//table)[1]//td[@data-title=\"Loan Status\"]//*[text()=\" Success \"]");
  }

  get Success_Loans_Header_1(): Locator {
    return this.page.locator("(//h5[@aria-labelledby=\"totalLoanRowsLabel\"]//span[contains(@aria-label,\"Successful Loans\")])[1]");
  }

  get Third_Company_Name(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[4]//following-sibling::div/span");
  }

  get This_action_will_save_the_changes_and_Move_to_Next_Page(): Locator {
    return this.page.locator("//*[contains(text(),\"This action will save the changes and Move to Next Page\")]");
  }

  get Time_Interval(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Time Interval\"]]/following-sibling::div[contains(@class, 'custom-input')]//input[@placeholder=\"0\"]");
  }

  get Time_Standard_Dropdown(): Locator {
    return this.page.locator("//div[text()=\"Comm. Cut Off\"]/following::select[@class=\"form-select\"]");
  }

  get Toggle_Date_Picker_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Toggle Date Picker\"]");
  }

  get Tomorrow_date(): Locator {
    return this.page.locator("//div[@aria-label=\"$|TomorrowsDateCalender|\"]");
  }

  get Tool_Tip_Text(): Locator {
    return this.page.locator("//div[@class=\"tooltip-inner\"]");
  }

  get Total_Committed_Loans_Tab(): Locator {
    return this.page.locator("//span[contains(text(),\" Total Committed Loans\")]");
  }

  get Total_Loans_Commitment_List(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Total Loans\"]]");
  }

  get Total_Loans_Count_From_Rows_table_1(): Locator {
    return this.page.locator("(//table)[1]//td[@data-title=\"Loan Status\"]");
  }

  get Total_Rows_Count(): Locator {
    return this.page.locator("(//tbody//tr)[position() >= 1 and position() <= last()]");
  }

  get Total_Rows_Count_UITotal_Loans(): Locator {
    return this.page.locator("//tbody//tr[@role=\"row\"]");
  }

  get Total_loans_TableHeader_1(): Locator {
    return this.page.locator("(//h5[@aria-labelledby=\"totalLoanRowsLabel\"]//span[contains(@aria-label,\"Total Loans\")])[1]");
  }

  get Try_Advanced_Search_and_Filter_option_Button(): Locator {
    return this.page.locator("//a[text()[normalize-space() = \"Try Advanced Search and Filter option\"]]");
  }

  get Uncommit_Selected_Button(): Locator {
    return this.page.locator("//button[@id='commitdropdownMenuButton']");
  }

  get Update_Header(): Locator {
    return this.page.locator("//h5[text()[normalize-space() = \"Update Header\"]]");
  }

  get Update_Header_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Update Header\"]]");
  }

  get Update_Permissions_Button(): Locator {
    return this.page.locator("//button[contains(.,'Update Permissions')]");
  }

  get Update_Threshold_Button(): Locator {
    return this.page.locator("//span[contains(text(),\"Update Threshold\")]");
  }

  get UploadBid_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]");
  }

  get Upload_File(): Locator {
    return this.page.locator("(//input[@type=\"file\"])[1]");
  }

  get Upload_New_Bid_Request_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Upload New Bid Request\"]]");
  }

  get Uploaded_File_Name(): Locator {
    return this.page.locator("//label[text()=\"Upload File\"]/..//div[contains(@class,\"text-truncate flex-grow-1\")]");
  }

  get Username_Field(): Locator {
    return this.page.locator("//input[@type=\"text\"]");
  }

  get Value_for_chase(): Locator {
    return this.page.locator("//*[contains(text(),\"False\")]");
  }

  get Version(): Locator {
    return this.page.locator("(//td[@data-title=\"Version\"])[1]");
  }

  get When_Bid_Field(): Locator {
    return this.page.locator("//label[text()[normalize-space() = \"When Bid Field\"]]/following-sibling::div[contains(@class, 'd-flex')]//div[@aria-labelledby=\"singleSelectDropDown\"]//input[@type=\"search\"]");
  }

  get When_Bid_Field_Name(): Locator {
    return this.page.locator("//span[@title=\"CLTV\"]");
  }

  get When_Bid_Field_in_Add_Conditions(): Locator {
    return this.page.locator("//label[text()[normalize-space() = \"When Bid Field\"]]/following-sibling::div[contains(@class, 'd-flex')]//div[text()[normalize-space() = \"Select\"]]");
  }

  get Yes_Commit_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Yes, Commit\"]]");
  }

  get Yes_Commit_Button_Popup(): Locator {
    return this.page.locator("//span[text()=\"Yes, Commit\"]//parent::button");
  }

  get Yes_Delete_ButtonEarly_config(): Locator {
    return this.page.locator("//button[@aria-label=\"Yes, Delete\"]");
  }

  get Yes_Go_ahead_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Yes, Go ahead.\"]]");
  }

  get Yes_Proceed_Button(): Locator {
    return this.page.locator("(//button[@type=\"button\"])[last()]");
  }

  get Yes_Submit_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Yes Submit\"]");
  }

  get Yes_Uncommit_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Yes, Uncommit\"]]");
  }

  get header_anme(): Locator {
    return this.page.locator("//div[@class=\"gap-2 header-grid-layout unidentified-header\"]");
  }

  get datepicker_Input(): Locator {
    return this.page.locator("//input[@placeholder=\"Select Date\"]");
  }

}
