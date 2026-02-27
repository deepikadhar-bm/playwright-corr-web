import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Correspondent Portal
 * Elements: 544
 */
export class CorrespondentPortalPage {
  constructor(private page: Page) {}

  get Chases_Values_1(): Locator {
    return this.page.locator("(//div[@class=\"mb-2\"]//..//select[@class=\"form-select\"])[$|count|]");
  }

  get Bellow_Dropdown_Fourth_Company(): Locator {
    return this.page.locator("(//div[@role=\"listitem\"])[4]");
  }

  get BidEnumeratedTapeValue_3(): Locator {
    return this.page.locator("//span[@title=\"425000\"]");
  }

  get Select_Rules_Checkbox(): Locator {
    return this.page.locator("//td[@data-title=\"Select\"]//input[@type=\"checkbox\"]");
  }

  get _2_more_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"+2 more\"]]");
  }

  get _214_2530_Yr_Freddie_Mac_Fixed_Dropdown(): Locator {
    return this.page.locator("//button[@title=\"214_25/30 Yr Freddie Mac Fixed\"]//div[text()[normalize-space() = \"214_25/30 Yr Freddie Mac Fixed\"]]");
  }

  get _214_2530_Yr_Freddie_Mac_Fixed_Dropdown1(): Locator {
    return this.page.locator("//button[@title=\"214_25/30 Yr Freddie Mac Fixed\"]");
  }

  get _214_2530_Yr_Freddie_Mac_Fixed_Dropdown2(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"214_25/30 Yr Freddie Mac Fixed\"]]");
  }

  get _332025(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"3\"] and contains(@class, 'custom-day') and contains(@class, 'today')]");
  }

  get _876RE6C0D47C_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"View details for bid request 876RE6C0D47C\"]");
  }

  get _87IJ1CA67642_Button(): Locator {
    return this.page.locator("//a[@aria-label=\"View details for price offered 87IJ1CA67642\"]");
  }

  get _91125_123_PM_169757(): Locator {
    return this.page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/div[3]/div[2]");
  }

  get Action_in_SearchFilter(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Action\"]]");
  }

  get Actions_Show_All(): Locator {
    return this.page.locator("(//a[@class='show-all'][contains(.,'Show All')])[5]");
  }

  get Active_Map_Name(): Locator {
    return this.page.locator("(//span[@class='active']/../../..//td[@data-title=\"Map Name\"])[1]");
  }

  get Add_A_Batch_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Add A Batch\"]]");
  }

  get Add_Action_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Add Action\"]]");
  }

  get Add_Actions(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Add Actions\"]]");
  }

  get Add_Batch_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Add Batch\"]]");
  }

  get Add_Condition_Button(): Locator {
    return this.page.locator("(//button[text()[normalize-space() = \"Add Condition\"]])[2]");
  }

  get Add_Conditions(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Add Conditions\"]]");
  }

  get Add_Conditions_in_Rule(): Locator {
    return this.page.locator("(//h6[text()[normalize-space() = \"Add Conditions\"]])[2]");
  }

  get Add_Email_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Add Email\"]]");
  }

  get Add_Field_Button(): Locator {
    return this.page.locator("(//button[text()[normalize-space() = \"Add Field\"]])[7]");
  }

  get Add_Field_Button1(): Locator {
    return this.page.locator("(//button[text()[normalize-space() = \"Add Field\"]])[1]");
  }

  get Add_Header(): Locator {
    return this.page.locator("//h5[text()[normalize-space() = \"Add Header\"]]");
  }

  get Add_Lock_Days_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Add Lock Days\"]]");
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

  get Add_New_Thresholds_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Add New Thresholds\"]]");
  }

  get Add_OR_Block_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Add OR Block\"]]");
  }

  get Add_POS_Validation_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Add POS Validation\"]]");
  }

  get Add_Row(): Locator {
    return this.page.locator("//a[text()[normalize-space() = \"Add Row\"]]");
  }

  get Add_Row_Field(): Locator {
    return this.page.locator("(//input[@class='form-control w-100'])[last()]");
  }

  get Add_Rule_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Add Rule\"]]");
  }

  get Add_Threshold_Button(): Locator {
    return this.page.locator("//button[contains(@class, 'fw-bold')]");
  }

  get Add_to_Commit(): Locator {
    return this.page.locator("//span[text()=\"Add to Commit\"]//parent::button");
  }

  get Add_A_Batch_Button_2(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Add A Batch\"]]");
  }

  get AddBatch_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Add Batch\"]]");
  }

  get Added_CLM_Field(): Locator {
    return this.page.locator("(//div[@class=\"d-flex gap-3 align-items-start mb-3\"])[2]");
  }

  get Added_Company(): Locator {
    return this.page.locator("(//button[contains(@class,'more-clients custom-bg-primary text-white fs-xs border-0')])[1]");
  }

  get Added_On(): Locator {
    return this.page.locator("(//td[@data-title=\"Added On\"])[1]");
  }

  get Added_Timing_In_Batch(): Locator {
    return this.page.locator("//*[contains(text(),\"Batch\")]/../..//h5[contains(text(),\"$|BulkBatchTiming|\")]");
  }

  get Administration_Menu(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Administration\"]]");
  }

  get Advanced_SearchFilter(): Locator {
    return this.page.locator("//*[text()[normalize-space() = \"Advanced Search/Filter\"]]");
  }

  get All_Companies_Dropdown(): Locator {
    return this.page.locator("//label[text()=\"Select Company\"]//following::div[contains(@class,\"dropdown\")]//button[@id]");
  }

  get ALL_Files(): Locator {
    return this.page.locator("//button[text()=\" ALL \"]");
  }

  get American_Pacific_check_box(): Locator {
    return this.page.locator("//input[@id=\"chkItem67ae505ed7affd7a32a6cc23undefined\"]");
  }

  get Amortization_Term(): Locator {
    return this.page.locator("//div[@class=\"gap-2 header-grid-layout unidentified-header\"]");
  }

  get Amortization_Type(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Amortization Type\"]]/../..//select[@id=\"id\"]");
  }

  get Amortization_Type_Add_Field(): Locator {
    return this.page.locator("(//div[contains(normalize-space(),\"Amortization Type Add Field\")])[12]");
  }

  get Amortization_Type_Dropdown(): Locator {
    return this.page.locator("(//option/../..//select[@class=\"form-select\"])[2]");
  }

  get Amortization_Type_Select_Amortization_Type_Appraised(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Amortization Type\"]]/..");
  }

  get Amortization_Type_2(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Amortization Type\"]]/preceding-sibling::div//input[@type=\"checkbox\"]");
  }

  get AmortizationTerm(): Locator {
    return this.page.locator("(//input[contains(@type,'checkbox')])[2]");
  }

  get Apply_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Apply\"]]");
  }

  get Apply_Selected(): Locator {
    return this.page.locator("//button[contains(text(),\" Apply Selected \")]");
  }

  get Apply_Selected_1_button_in_Rule(): Locator {
    return this.page.locator("//button[contains(normalize-space(),\"Apply Selected 1\")]");
  }

  get Apply_Selected_Button_in_Import_Rule(): Locator {
    return this.page.locator("//span[contains(normalize-space(),\"Apply Selected 1\")]");
  }

  get Apply_Selected_Button1(): Locator {
    return this.page.locator("//button[text()=\" Apply Selected \"]");
  }

  get Apply_Selected_for_Bid_Maps(): Locator {
    return this.page.locator("//span[@class=\"counter bg-white text-primary mx-2 text-center fw-semibold small\"]");
  }

  get Apply_Selected2(): Locator {
    return this.page.locator("(//button[@aria-label=\"Apply selected items\"])[2]");
  }

  get Apply_Changes_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Apply Changes\"]]");
  }

  get Appraised_Value_Dropdown(): Locator {
    return this.page.locator("(//select[@class=\"form-select\"])[2]");
  }

  get Are_you_sure_you_want_to_delete_fixed_from_enumeration(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"This action cannot be undone\"]]/..");
  }

  get Assigned_Companies(): Locator {
    return this.page.locator("//span[@class='pl-2'][contains(.,'@|Company Name|')]");
  }

  get Attachment_Type(): Locator {
    return this.page.locator("(//div[text()='Attachment Type']/../..//select[@id=\"id\"])[1]");
  }

  get Attachment_Type1(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Attachment Type\"]]");
  }

  get Attachment_Types(): Locator {
    return this.page.locator("(//div[text()=\"Attachment Type\"]/../..//select)[1]");
  }

  get Auth_Limit_In_Total_Commited_Loans(): Locator {
    return this.page.locator("//div[text()=\"Auth Limit: \"]//..//div[@class=\"fw-semibold\"]");
  }

  get Auth_LimitCommitment_List(): Locator {
    return this.page.locator("//div[text()=\"Auth Limit: \"]//..//div[@class=\"fw-semibold\"]");
  }

  get BACK_Button_bid(): Locator {
    return this.page.locator("//span[normalize-space()='BACK']");
  }

  get Backward_Arrow(): Locator {
    return this.page.locator("//i[contains(@class, 'fa-arrow-left') and contains(@class, 'btn-primary')]");
  }

  get Base_Loan_Amount_Dropdown(): Locator {
    return this.page.locator("(//span[@title=\"Base Loan Amount\"])[2]");
  }

  get Batch_Number(): Locator {
    return this.page.locator("(//div[contains(@class,\"card rounded-3\")]//div//div//h6)[last()]");
  }

  get Batch_Processing_Time_Buffer_Input(): Locator {
    return this.page.locator("//input[@id='batchProcessingTimeBuffer']");
  }

  get Batch_timing_has_been_created_successfully_Success_Message(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Batch timing has been created successfully\"]]");
  }

  get Batch_timing_has_been_updated_successfully_Success_Message(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Batch timing has been updated successfully\"]]");
  }

  get Batches_Count(): Locator {
    return this.page.locator("//h6[@class=\"card-subtitle text-body-secondary flex-grow-1 mb-0\"]");
  }

  get Below_Dropdown_Second_Company(): Locator {
    return this.page.locator("//div[@class=\"custom-class dropdown\"]//app-custom-chips/div/div[2]");
  }

  get Below_Dropdown_Third_Company(): Locator {
    return this.page.locator("//div[@class=\"custom-class dropdown\"]//app-custom-chips/div/div[3]");
  }

  get Bid_Enumarated_tape_values_for_base_amount(): Locator {
    return this.page.locator("((//button[@id=\"singleSelectDropDownWithSearch\"])[2]/../../..//span[@class=\"pl-2\"])[4]");
  }

  get Bid_Enumerated_Tape_Value_Dropdown(): Locator {
    return this.page.locator("//label[text()=\" Bid Enumerated Tape Value \"]/..//*[text()=\" Select \"]/..");
  }

  get Bid_Enumerated_Tape_Value_Dropdown_When_Bid_Field(): Locator {
    return this.page.locator("(//*[contains(text(),\"Bid Enumerated Tape Value\")]/..//button//div)[2]");
  }

  get Bid_Enumerated_Tape_Values_Dropdown(): Locator {
    return this.page.locator("(//button[contains(@class, 'dropdown-item') and contains(@class, 'd-flex')])[93]");
  }

  get Bid_EnumeratedTape_value_Existing_RowDropdown(): Locator {
    return this.page.locator("//span[@title=\"SAIKAT_18_FEB_002\"]");
  }

  get Bid_Enumeration_Tape_Value_in_rule(): Locator {
    return this.page.locator("//label[text()[normalize-space() = \"Bid Enumerated Tape Value\"]]/following-sibling::div[contains(@class, 'd-flex')]//div[text()[normalize-space() = \"Select\"]]");
  }

  get BId_Field_Data(): Locator {
    return this.page.locator("(//span[@title='@|BidFields.|'])[4]");
  }

  get Bid_Map_Creation(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Bid Map Creation\"]]");
  }

  get Bid_Map_Creation_in_General_Settings(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/bidmap-creation\"]");
  }

  get Bid_Mapping_ID_Dropdown(): Locator {
    return this.page.locator("(//button[contains(@class, 'dropdown-item') and contains(@class, 'd-flex')])[57]");
  }

  get Bid_Maps_name(): Locator {
    return this.page.locator("//button[contains(text(),\"$|BidMap|\")]");
  }

  get Bid_Maps_Menu(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Bid Maps\"]]");
  }

  get Bid_Requested_Date(): Locator {
    return this.page.locator("//form//div//label[text()=\"Bid Requested Date\"]");
  }

  get Bid_Requests(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Bid Requests\"] and contains(@class, 'hide-text')]");
  }

  get Bid_Requests_Dropdown(): Locator {
    return this.page.locator("//a[@href=\"#/reports/reports-bid-requests\"]//span[text()[normalize-space() = \"Bid Requests\"]]");
  }

  get Bid_Requests_Side_Menu(): Locator {
    return this.page.locator("//a[@href=\"#/bid-requests\"]");
  }

  get Bid_Requestsside_bar_menu(): Locator {
    return this.page.locator("//li[@class=\"nav-item\"]//a[@href=\"#/bid-requests\"]");
  }

  get Bid_Tape_Value(): Locator {
    return this.page.locator("//input[@type=\"text\" and contains(@class, 'input-field-edit')]");
  }

  get Bid_Enumerated(): Locator {
    return this.page.locator("(//button[@id=\"singleSelectDropDownWithSearch\"])[2]");
  }

  get Bid_Map_Name_Active(): Locator {
    return this.page.locator("(//span[@class='active']/../../..//td[@data-title=\"Map Name\"])[1]");
  }

  get Bid_Map_Name_with_ExistingName(): Locator {
    return this.page.locator("//span[contains(text(),\"$|ExistingBidMapName|\")]");
  }

  get Bid_Mapping_ID_Dropdown_2(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Select Mapping\"]]");
  }

  get Bid_Request_Date(): Locator {
    return this.page.locator("//input[@id='bidRequestToday']");
  }

  get BidEnumeratedTapeValue_Block_2(): Locator {
    return this.page.locator("//span[@title=\"Fixed\"]");
  }

  get BidMap_already_exists_Error_Message(): Locator {
    return this.page.locator("//div[contains(.,'already exists')][last()]");
  }

  get BidMap_Download(): Locator {
    return this.page.locator("//td[@data-title='Map Name'][contains(.,'$|BidMapName|')]/following-sibling::td[@data-title='Actions']//a[@ngbtooltip=\"Download Map\"]");
  }

  get BidMapTitle(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"BidMap\"]]");
  }

  get bidRequestDate_Next_Bussiness_Radio_Button(): Locator {
    return this.page.locator("//label[text()[normalize-space() = \"Next Business Day\"]]/preceding-sibling::input[@type=\"radio\"]");
  }

  get Bulk_Batch_Timing(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/batch-timing\"]\n");
  }

  get Cancel_Bid_Request_Button(): Locator {
    return this.page.locator("((//span[contains(@class, 'fa-times')]))[1]/..");
  }

  get Cancel_Bid_Request_PopUp(): Locator {
    return this.page.locator("//div[@aria-describedby=\"modalBody\"]");
  }

  get Cancel_ButtonPopup_Dashboard(): Locator {
    return this.page.locator("//button[@aria-label=\"Cancel\"]");
  }

  get Category_Name(): Locator {
    return this.page.locator("//span[text()=\"@|Date Range Filter Type|\"]");
  }

  get CCode_Valuebid_request_details(): Locator {
    return this.page.locator("//div[text()=\"CCode\"]/..//h5");
  }

  get Change_Page_Size_Dropdown(): Locator {
    return this.page.locator("//button[@aria-label=\"Change Page Size\"]");
  }

  get Chase_Direct_in_Customer_Permission(): Locator {
    return this.page.locator("(//div[@class='text-success'][contains(.,'Allowed')])[2]");
  }

  get Chase_Direct_is_Disabled(): Locator {
    return this.page.locator("(//div[contains(@class,'text-danger')])[2]");
  }

  get Chase_Direct_Checkbox(): Locator {
    return this.page.locator("//label[text()[normalize-space() = \"Chase Direct\"]]/preceding-sibling::input[@type=\"checkbox\"]");
  }

  get Chase_Field_Name(): Locator {
    return this.page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/following-sibling::div[contains(@class, 'd-flex')]//select[contains(@class, 'form-select')]");
  }

  get Chase_Field_Name_Drowpdown(): Locator {
    return this.page.locator("(//div[@class='parent']//fieldset//select[@class='form-select'])[$|count|]");
  }

  get Chase_Field_Value_Input_Box(): Locator {
    return this.page.locator("(//label[text()=\"Chase value\"])[2]/../..//*[@aria-label=\"LP Field Value\"]//input");
  }

  get Chase_Value(): Locator {
    return this.page.locator("(//select[contains(normalize-space(),\"Select Fixed rate Variable rate\")])[2]");
  }

  get Chase_Value_in_Enumeration(): Locator {
    return this.page.locator("(//select[contains(normalize-space(),\"Select Attached Detached\")])[1]");
  }

  get Chase_Values_Dropdown(): Locator {
    return this.page.locator("(//select[@id=\"id\"])[3]");
  }

  get Chase_Values_In_Advanced_Search_field(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"=\"]]/following-sibling::app-lp-fieldtype-input-selection//input[contains(@class, 'form-control')]");
  }

  get Chase_Field_Name_in_Rule(): Locator {
    return this.page.locator("(//*[text()=\"Add Actions\"]/..//select)[3]");
  }

  get Chase_Value_in_RulesandActions(): Locator {
    return this.page.locator("(//*[text()=\"Add Actions\"]/..//select)[4]");
  }

  get ChaseDirect_OFFEdit_Permissions_Popup(): Locator {
    return this.page.locator("(//input[@type=\"radio\"])[4]");
  }

  get ChaseDirect_ValueDisabled(): Locator {
    return this.page.locator("(//div[contains(@class,'text-danger')])[1]");
  }

  get ChaseExceution_Dropdown(): Locator {
    return this.page.locator("//select[@class=\"form-select ng-untouched ng-pristine\"]");
  }

  get ChaseValue_for_the_Rules(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Actions\"]]/preceding-sibling::div[contains(@class, 'd-flex') and contains(@class, 'flex-column')]//input[contains(@class, 'form-control')]");
  }

  get Check_box(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[1]");
  }

  get Checkbox_in_Header_Mapping(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"CLTV\"]]/preceding-sibling::div//input[@type=\"checkbox\"]");
  }

  get Checkbox(): Locator {
    return this.page.locator("(//input[contains(@type,'checkbox')])[7]");
  }

  get Clear_all_Button(): Locator {
    return this.page.locator("//span[@role=\"button\" and @aria-label=\"Clear all chips\"]");
  }

  get Clear_all_Button1(): Locator {
    return this.page.locator("//span[@role=\"button\"]");
  }

  get Clear_Search_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Clear search\"]");
  }

  get Clear_All_Button(): Locator {
    return this.page.locator("//span[text()='Clear all']");
  }

  get CLM_Field_Name(): Locator {
    return this.page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/following-sibling::div[contains(@class, 'd-flex')]//select[contains(@class, 'form-select')]");
  }

  get Clone_Map(): Locator {
    return this.page.locator("(//span[contains(@class, 'fa-copy')])[1]");
  }

  get Close_ButtonCommitment_List(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Close\"]]");
  }

  get Close_Buttonemail_config(): Locator {
    return this.page.locator("//button[@aria-label=\"Close\"]");
  }

  get close_pop_up_bid_request_details(): Locator {
    return this.page.locator("//i[contains(@class, 'fa-lg') and contains(@class, 'color-primary') and contains(@class, 'fa-times')]");
  }

  get CLTV_Dropdown(): Locator {
    return this.page.locator("(//button[contains(@class, 'dropdown-item') and contains(@class, 'd-flex')])[96]");
  }

  get Column_Header(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Column Header\"]]");
  }

  get Commit_Correction_Cutoff_Time(): Locator {
    return this.page.locator("//label[contains(text(),\"Commit Correction Cut-off\")]//following::input[contains(@id,\"CorrectionCutOfHours\")]");
  }

  get Commitment_OrderCommitment_List(): Locator {
    return this.page.locator("//div[text()=\"$|CommitID|\"]//preceding-sibling::div[contains(text(),\"Commitment Order\")]");
  }

  get Commitment_OrderCommitment_List_2(): Locator {
    return this.page.locator("//div[text()=\"$|CommitID|\"]//preceding-sibling::div[contains(text(),\"Commitment Order\")]");
  }

  get Commitment_Rows_Count(): Locator {
    return this.page.locator("//div[normalize-space(text())=\"Commit. ID\"]//following-sibling::h5[normalize-space(text())=\"$|CommitmentID|\"]//following::table[1]//tbody//tr[@role=\"row\"]");
  }

  get Commitments_Side_Menu(): Locator {
    return this.page.locator("//ul[contains(@class, 'navbar-nav') and contains(@class, 'flex-column')]/li[3]/a[1]");
  }

  get Companies_In_Dropdown(): Locator {
    return this.page.locator("(//label[@class='dropdown-item d-flex'])");
  }

  get Company_Check_Box(): Locator {
    return this.page.locator("//span[contains(text(),\"$|CompanyName|\")]/../..//input[@type=\"checkbox\"]");
  }

  get Company_ConfigGenral_settings(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/company-config\"]");
  }

  get Company_Name(): Locator {
    return this.page.locator("(//td[@data-title=\"Company\"])[1]");
  }

  get Company_Name_Action_Button_FirstRow(): Locator {
    return this.page.locator("(//div[@id=\"common-table-results\"]//following-sibling::td[@data-title=\"Actions\"])[1]//button[@aria-label=\"Edit Permission\"]");
  }

  get Company_Name_ActionButton_SecondRow(): Locator {
    return this.page.locator("(//div[@id=\"common-table-results\"]//following-sibling::td[@data-title=\"Actions\"])[2]//button[@aria-label=\"Edit Permission\"]");
  }

  get Company_Name_Customer_Permission(): Locator {
    return this.page.locator("//div[@id='common-table-results']/table//tr[$|CompanyIndex|]//td[@data-title=\"Company Name\"]");
  }

  get Company2(): Locator {
    return this.page.locator("//td[@data-title='Company'][contains(.,'@|Company Name.|')]");
  }

  get CompanyName_Action_Button_By_Index(): Locator {
    return this.page.locator("(//div[@id=\"common-table-results\"]//following-sibling::td[@data-title=\"Actions\"])[$|CompanyIndex|]//button[@aria-label=\"Edit Permission\"]");
  }

  get Corr_Loan_Column_Sort_Arrow(): Locator {
    return this.page.locator("//th[@aria-label=\"Corr. Loan#\"]//span[contains(@class, 'small') and contains(@class, 'fa-sort')]/preceding-sibling::div");
  }

  get Correspondent_Loan_NumberSearch_Dropdown(): Locator {
    return this.page.locator("(//li[contains(@class,\"text-primary\")]//span)[4]");
  }

  get Create_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Create\"]");
  }

  get Create_New_Map_Field(): Locator {
    return this.page.locator("mapName");
  }

  get Created_On(): Locator {
    return this.page.locator("//td[@data-title=\"Created On\"]");
  }

  get Cross_button_in_Bid_Map(): Locator {
    return this.page.locator("//i[@class=\"fas fa-times-circle text-primary\"]");
  }

  get Cross_Button_in_Header_Mapping(): Locator {
    return this.page.locator("(//i[contains(@class, 'fa-lg') and contains(@class, 'color-primary') and contains(@class, 'fa-times')])[2]");
  }

  get Cross_In_Search_Field(): Locator {
    return this.page.locator("//i[contains(@class, 'fa-times')]");
  }

  get CrossButton_Edit_Customer_Permissions(): Locator {
    return this.page.locator("//i[contains(@class, 'fa-lg') and contains(@class, 'color-primary') and contains(@class, 'fa-times')]");
  }

  get Curr_GrossCommitment_List(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Curr Gross\"]");
  }

  get Current_Date_From_Calendar(): Locator {
    return this.page.locator("//span[contains(@class,\"today\")]//parent::div");
  }

  get Current_Date_On_Filters(): Locator {
    return this.page.locator("//input[@placeholder=\"Select Date\"]");
  }

  get Current_Month_Requested_DateIndividual(): Locator {
    return this.page.locator("(//div[contains(@aria-label,\"Requested Date:\")])[$|count1|]");
  }

  get Custom_Header_Field(): Locator {
    return this.page.locator("//div[text()='Custom Header']//..//..//input[contains(@class, 'form-control')]");
  }

  get Custome_Date_Range_button(): Locator {
    return this.page.locator("//button[contains(@class, 'clear')]");
  }

  get Dashboard_Menu(): Locator {
    return this.page.locator("//span[normalize-space(text())=\"Dashboard\"]");
  }

  get Data_Table(): Locator {
    return this.page.locator("(//td[@role=\"cell\"])[26]");
  }

  get Data_Table_Count(): Locator {
    return this.page.locator("//tbody[@role=\"rowgroup\"]/tr[3]/td[1]");
  }

  get Date_Input_Box(): Locator {
    return this.page.locator("//button[@role=\"button\" and contains(@class, 'form-control') and contains(@class, 'd-flex') and contains(@class, 'dropdown-toggle')]");
  }

  get Datepicker_Button(): Locator {
    return this.page.locator("//input[@placeholder=\"Select Date\"]//following::button[contains(@aria-label,\"Datepicker\")]");
  }

  get datepicker_Input(): Locator {
    return this.page.locator("//input[@placeholder=\"Select Date\" and @name=\"datepicker\"]");
  }

  get DeepikaAugBidQA_xlsx(): Locator {
    return this.page.locator("//label[@for=\"mappingFile\"]/following-sibling::div//span");
  }

  get Default_dropdown_selection_Dropdown(): Locator {
    return this.page.locator("(//div[text()=\"Loan Purpose\"]/../..//select)[2]");
  }

  get Default_dropdown_selection_Dropdown1(): Locator {
    return this.page.locator("//option[@value=\"UnitDwelling_2_4\"]/..");
  }

  get Deferred_Radio_ButtonUpload_Bid(): Locator {
    return this.page.locator("//form[@aria-labelledby=\"executionDetailsHeader\"]/div[4]/div[1]/div[2]/input[1]");
  }

  get Delete(): Locator {
    return this.page.locator("//div[contains(@class, 'modal-header')]");
  }

  get Delete_batch(): Locator {
    return this.page.locator("//div//button[@aria-label=\"Delete batch\"]//span[text()=\"Delete batch \"]");
  }

  get Delete_Batch_Time(): Locator {
    return this.page.locator("(//div[contains(@class,\"card rounded-3\")]//button[@aria-label=\"Delete Batch Time\"])[last()]");
  }

  get Delete_Block_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Delete Block\"]]");
  }

  get Delete_Button_BidRequest(): Locator {
    return this.page.locator("//i[contains(@class, 'fa-trash-alt')]/..");
  }

  get Delete_Button(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Taxes and I\"]]/following-sibling::button");
  }

  get Delete_ButtonEarly_Conf(): Locator {
    return this.page.locator("//button[@aria-label=\"Delete\"]//span");
  }

  get Delete_Enumeration_Pair(): Locator {
    return this.page.locator("//h5[text()[normalize-space() = \"Delete Enumeration Pair\"]]");
  }

  get Delete_icon(): Locator {
    return this.page.locator("(//i[@class=\"fas fa-trash-alt text-danger\"])[5]");
  }

  get Delete_icon_in_Enumeration_Mappings(): Locator {
    return this.page.locator("(//i[@class=\"fa fas fa-trash trash-icon\"])[5]");
  }

  get Delete_Message_in_the_List_Screen(): Locator {
    return this.page.locator("//ngb-modal-window[contains(@class,'d-block modal')]//h5");
  }

  get Delete_Rule(): Locator {
    return this.page.locator("//h5[text()[normalize-space() = \"Delete Rule\"]]");
  }

  get Delete_Block_AddActions(): Locator {
    return this.page.locator("(//button[contains(@class, 'fa-trash-alt')])[5]");
  }

  get Delete_Button_for_AddConditions(): Locator {
    return this.page.locator("//label[text()[normalize-space() = \"Bid Enumerated Tape Value\"]]/following-sibling::div[contains(@class, 'd-flex')]//button[contains(@class, 'fa-trash-alt')]");
  }

  get Delete_Button_In_AddActions(): Locator {
    return this.page.locator("((//*[text()=\" Add Action \"]/..//select)/../..//button)[1]");
  }

  get Delete_Button_inAddConditions(): Locator {
    return this.page.locator("//div[text()=' Base Loan Amount ']/ancestor::div[@class=\"rules-conditions\"]//button[contains(@class,\"btn bg-transparent text-danger fas fa-trash\")]");
  }

  get Delete_Existing_Company_Name(): Locator {
    return this.page.locator("//td[@data-title=\"Map Name\"][contains(.,'$|ExistingBidMapName|')]/following-sibling::td[@data-title=\"Actions\"]//button[@ngbtooltip=\"Delete Map Delete Map\"]");
  }

  get demo_chase_element(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and text()=\" First Time Home Buyer\"]/following::div)[1]");
  }

  get Disabled_Company_Name(): Locator {
    return this.page.locator("//div[@class=\"disabled\"]");
  }

  get Download_Button(): Locator {
    return this.page.locator("//a[contains(@class,\"download\")]");
  }

  get Download_ButtonPopup_Dashboard(): Locator {
    return this.page.locator("//button[@aria-label=\"Download\"]");
  }

  get Download_Commitment_Letter(): Locator {
    return this.page.locator("(//div[@id=\"modalBody\"]//i[contains(@class,\"fas fa-arrow-to-bottom\")]//parent::button)[1]");
  }

  get Download_File_Text(): Locator {
    return this.page.locator("//h5[contains(text(),\"Download file\")]");
  }

  get Download_Grid_Button1(): Locator {
    return this.page.locator("//button[@aria-label=\"Download Grid\"]");
  }

  get Download_Map(): Locator {
    return this.page.locator("//h5[text()[normalize-space() =\"Download Map - $|MapNames|\"]]");
  }

  get Draft_Rule_Name_Input(): Locator {
    return this.page.locator("//input[@placeholder='Enter a Rule Name']");
  }

  get Drag_and_drop_files_here_or_click_to_browse_Allowed(): Locator {
    return this.page.locator("//form[@aria-labelledby=\"executionDetailsHeader\"]/div[6]/app-file-upload[1]/div[1]/div[1]/div[1]");
  }

  get Dropdown_selection(): Locator {
    return this.page.locator("//*[@aria-disabled=\"true\"]");
  }

  get Dropdown_Company_for_Selected(): Locator {
    return this.page.locator("//label[@class=\"dropdown-item d-flex checked\"]/div/span");
  }

  get Dropdown_selection_2(): Locator {
    return this.page.locator("//select[@aria-label=\"Dropdown selection\"]");
  }

  get Dropdown_Search_In_Commitments_Status(): Locator {
    return this.page.locator("(//input[@id=\"searchBox\"])[2]");
  }

  get Dropdown_Select_105_202530_Yr_FHA_FixedGNMA_I_105(): Locator {
    return this.page.locator("(//input[@type=\"search\"])[2]");
  }

  get Dropdown_Select_105_202530_Yr_FHA_FixedGNMA_I_105_1(): Locator {
    return this.page.locator("//a[text()[normalize-space() = \"Select\"]]/preceding-sibling::input[@type=\"search\"]");
  }

  get Dropdown_Select_All_Show_Selected_Freedom_A4187_Guara(): Locator {
    return this.page.locator("button.btn-primary.apply-button");
  }

  get Dropdown_Show_All_Enumerations_Show_Unidentified_Enum(): Locator {
    return this.page.locator("//select[contains(normalize-space(),\"Select Show All Enumerations Show Unidentified Enumerations (0) Show Unused Enumerations\")]");
  }

  get Dropdown_Show_Selected_In_Status(): Locator {
    return this.page.locator("(//div[text()=\" Show Selected \"])[2]");
  }

  get DTI_Dropdown(): Locator {
    return this.page.locator("(//button[contains(@class, 'dropdown-item') and contains(@class, 'd-flex')])[141]");
  }

  get Each_Batch(): Locator {
    return this.page.locator("//div[contains(@class,\"card rounded-3\")]");
  }

  get Early_Close_Config(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/early-close-config\"]");
  }

  get Edit_Button(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Appraisal Waiver\"]]/following-sibling::div[contains(@class, 'd-flex')]//i[contains(@class, 'fa-pencil-alt')]");
  }

  get Edit_icon_in_Header_Mapping(): Locator {
    return this.page.locator("(//i[@class=\"fas fa-pencil-alt\"])[3]");
  }

  get Edit_Permission_Button(): Locator {
    return this.page.locator("//td[@data-title=\"Company Name\" and text()=\" @|CompanyName(CustomerPermissions)| \"]/..//button");
  }

  get Edit_Batch_Time(): Locator {
    return this.page.locator("(//button[@aria-label=\"Edit Batch Time\"])[last()]");
  }

  get Editting_Chase_Field_Name(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1\"]/../..//select)[2]");
  }

  get Email_Configuration(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/email-config\"]");
  }

  get Email_Id_Input(): Locator {
    return this.page.locator("//input[@id='emailInput']");
  }

  get Enable_or_disable_field_Amortization_Type_Checkbox(): Locator {
    return this.page.locator("//input[@aria-label=\"Enable or disable field Amortization Type\"]");
  }

  get Enabled_Pricing_Return_Time(): Locator {
    return this.page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]/..//option[@aria-disabled=\"false\" and @value]");
  }

  get Enter_a_Rule_Name_Field(): Locator {
    return this.page.locator("//input[@placeholder=\"Enter a Rule Name\"]");
  }

  get Enter_maximum_display_value_in_percentage_Input(): Locator {
    return this.page.locator("//input[@aria-label=\"Enter maximum display value in percentage\"]");
  }

  get Enter_maximum_value_in_BPS_Input(): Locator {
    return this.page.locator("//input[@aria-label=\"Enter maximum value in BPS\"]");
  }

  get Enter_minimum_value_in_BPS_Input(): Locator {
    return this.page.locator("//input[@aria-label=\"Enter minimum value in BPS\"]");
  }

  get Enter_the_custom_header_name_you_would_like_to_add_a(): Locator {
    return this.page.locator("//p[contains(@class, 'lh-sm')]");
  }

  get Enum(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Enum\"]]");
  }

  get Enumeartion_Checkbox_Mapping(): Locator {
    return this.page.locator("(//input[contains(@class, 'mapping-select')])[2]");
  }

  get Enumeration_Checkbox(): Locator {
    return this.page.locator("(//input[contains(@class, 'mapping-select')])[1]");
  }

  get Enumeration_Mapping_Button1(): Locator {
    return this.page.locator("//a[text()[normalize-space() = \"Enumeration Mapping\"]]");
  }

  get Enumeration_Mapping1(): Locator {
    return this.page.locator("//a[text()[normalize-space() = \"Enumeration Mapping\"]]");
  }

  get Errors_Found(): Locator {
    return this.page.locator("//h5[contains(@class, \"text-danger\")]");
  }

  get Errors_Foundred_text_danger(): Locator {
    return this.page.locator("//h5[contains(@class,\"text-danger\")]");
  }

  get Execution_Type_Button(): Locator {
    return this.page.locator("//div[@aria-label=\"Sort by Execution Type\"]");
  }

  get Execution_Type_Dropdown(): Locator {
    return this.page.locator("//select[contains(@class,'form-select ng-valid')]");
  }

  get ExistingCompany_Name(): Locator {
    return this.page.locator("//table[contains(@class,'table table-hover')]/tbody[1]/tr[1]/td[@data-title=\"Map Name\"]");
  }

  get Expand_Button(): Locator {
    return this.page.locator("(//a[contains(@class,\"expand\")])[$|Count|]");
  }

  get Expired_Option(): Locator {
    return this.page.locator("//div[@id=\"multiSelectOptionsDropDown\"]//div//div//label//input[@aria-label=\"Select Expired\"]");
  }

  get Export_Button_Spinner_Bid_Request(): Locator {
    return this.page.locator("//i[contains(@class, 'spinner-border') and contains(@class, 'spinner-border-sm')]");
  }

  get Export_List(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Export List\"]]");
  }

  get Export_List_Maps_List_details_only_Dropdown(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Export List\"]]");
  }

  get Export_Records_Count(): Locator {
    return this.page.locator("(//button[@aria-label=\"Export Selected Bid Requests\"]//span)[2]");
  }

  get Export_Selected_1_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Export Selected\"]]");
  }

  get Export_Selected_Button_Bid_Request(): Locator {
    return this.page.locator("//button[@aria-label=\"Export Selected Bid Requests\"]");
  }

  get Export_Selected_Dropdown1(): Locator {
    return this.page.locator("exportdropdownMenuButton");
  }

  get FICO_BID_Value(): Locator {
    return this.page.locator("(//div[@aria-labelledby='singleSelectDropDown'])[2]//button[2]");
  }

  get FICO_Score(): Locator {
    return this.page.locator("//span[@title=\"FICO Score\"]");
  }

  get FICO_Score_value(): Locator {
    return this.page.locator("(//button//span[contains(.,\"FICO\")])[1]");
  }

  get Fifth_Company_Name(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[6]//following-sibling::div/span");
  }

  get Filter_Enumeration(): Locator {
    return this.page.locator("//input[@type=\"checkbox\"]/..//input[@class=\"mr-2 cursor-pointer\"]");
  }

  get Filter_Enumerations_Drowpdown_Data(): Locator {
    return this.page.locator("((//div[@class='d-flex']/following-sibling::div)[2]//span[@class='pl-2'])[$|Count|]");
  }

  get First_Bid_Req_Id(): Locator {
    return this.page.locator("//a[contains(@aria-label, \"View details for price offered\")]\n");
  }

  get First_Bid_Request_Checkbox(): Locator {
    return this.page.locator("//input[@id='chkItemPROCESSINGundefined']");
  }

  get First_Bid_Request_ID(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Req. ID\"]");
  }

  get First_Bid_Request_Text(): Locator {
    return this.page.locator("(//label[text()='Select Bid Request Status']//..//div[@class=\"cursor-pointer py-3 text-wrap\"])[2]");
  }

  get First_Chase_Value(): Locator {
    return this.page.locator("//div[text()=\"Chase Field Name\"]     /ancestor::div[2]     //div[@class=\"apply-grid\"]     //div[@class=\"border-bottom p-2 tr-value\"]");
  }

  get First_Checkbox_Bid_Request(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[2]");
  }

  get First_Corr_loan_Value_Unchecked(): Locator {
    return this.page.locator("//tbody[@role=\"rowgroup\"]/tr[1]/td[1]//..//button[contains(@aria-label,\"View loan details for\")]");
  }

  get First_Corr_Loan(): Locator {
    return this.page.locator("//button[contains(@aria-label, \"View loan details for\")]\n");
  }

  get First_Market_adjustment_Value(): Locator {
    return this.page.locator("//tbody//input//ancestor::tr//td[@data-title=\"Mark Adj\"]");
  }

  get First_Checkbox_Header_Mapping(): Locator {
    return this.page.locator("(//select[contains(@class, 'form-select')])[2]");
  }

  get First_Company_Name(): Locator {
    return this.page.locator("(//label[text()='Select Company/CCode']//..//span[@class=\"pl-2\"])[2]");
  }

  get FirstComapny_Client_Asscociation(): Locator {
    return this.page.locator("(//div[@class='custom-input searchbox']/following-sibling::div//span)[1]");
  }

  get fixed(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"fixed\"]]");
  }

  get Fixed_rate_Dropdown(): Locator {
    return this.page.locator("//*[text()=\"First Time Home Buyer\"]/../..//select");
  }

  get Fourth_Company_Name(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[5]//following-sibling::div/span");
  }

  get Freedom_A4187_A4187_Option(): Locator {
    return this.page.locator("//div//span[@title=\"Freedom A4187 (A4187)\"]");
  }

  get Freedom_A4187_Dropdown(): Locator {
    return this.page.locator("//span[@title=\"Freedom A4187\"]/..");
  }

  get Future_Date_In_Colander(): Locator {
    return this.page.locator("//div[@aria-label=\"$|FutureDate|\"]");
  }

  get GeneralSettings_Menu(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"General Settings\"]]");
  }

  get Get_Price_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Get Price\"]]");
  }

  get Go_to_Next_Page_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Go to Next Page\"]");
  }

  get Go_to_Next_Page_Button_2(): Locator {
    return this.page.locator("//span[contains(@class, 'dlp-icon') and contains(@class, 'fa-chevron-right')]");
  }

  get Guaranteed_Financial_Dropdown(): Locator {
    return this.page.locator("(//label[contains(@class, 'dropdown-item') and contains(@class, 'd-flex')])[3]");
  }

  get Header_Counts(): Locator {
    return this.page.locator("//div[@class='parent']//fieldset");
  }

  get Header_Mapping_Dropdown(): Locator {
    return this.page.locator("//select[contains(normalize-space(),\"Select Show All Headers Show Unidentified Headers (10) Show Unused Headers Show Used Headers\")]");
  }

  get Header_Mapping_for_the_Dropdowns(): Locator {
    return this.page.locator("(//select[contains(@class,'form-select')])[8]");
  }

  get Header_Mapping_for_Unidentified_Headers(): Locator {
    return this.page.locator("(//select[contains(@class, 'form-select')])[$|Headercount|]");
  }

  get Header_Mappingback_link(): Locator {
    return this.page.locator("//a[@href=\"#/admin/bid-maps/add-new-mapping/header-mapping\"]");
  }

  get Header_Mapping1(): Locator {
    return this.page.locator("//a[contains(text(),\"Header Mapping\")]");
  }

  get Header_Sort_Down(): Locator {
    return this.page.locator("//span[contains(@class, 'small') and contains(@class, 'fa-sort-down')]");
  }

  get Header_Data_Mapping_Field(): Locator {
    return this.page.locator("(//div[@class='parent']//fieldset)[2]//select[@id=\"id\"]");
  }

  get Header_Data_Name(): Locator {
    return this.page.locator("(//div[@class='col-2']//div)[$|HeaderMappingCount|]");
  }

  get Header_Filter(): Locator {
    return this.page.locator("(//select[@class='form-select'])[1]");
  }

  get HeaderData_HeaderMapping(): Locator {
    return this.page.locator("//div[@class='parent']//fieldset[1]/parent::div");
  }

  get Headers_From_UI(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"]/../..//div[@class=\"flex-grow-1\"])[$|count|]");
  }

  get Headers_from_UI_Count(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"]/../..//div[@class=\"flex-grow-1\"])");
  }

  get Headers_Mappings(): Locator {
    return this.page.locator("//div[contains(@class, 'scrollable-page')]/div[1]/app-mapping-wizard-container[1]/app-header-mapping-container[1]/app-header-mapping[1]/div[1]");
  }

  get Headers_Name(): Locator {
    return this.page.locator("(//a[contains(@class,\"download\")]/../../..//div[contains(@class,\"items\")]//h5)[$|Count|]");
  }

  get Heading_96741285_96_74(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"$96,741,285 (96.74%)\"]]");
  }

  get Heading_3_5(): Locator {
    return this.page.locator("//h5[text()[normalize-space() = \"3.5\"]]");
  }

  get Heading_Bid_Request_Details(): Locator {
    return this.page.locator("//h3[text()[normalize-space() = \"Bid Request Details\"]]");
  }

  get Heading_Bid_Requests(): Locator {
    return this.page.locator("//h3[text()[normalize-space() = \"Bid Requests\"]]");
  }

  get Heading_Customer_Permission(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Customer Permission\"]]");
  }

  get Heading_Dashboard(): Locator {
    return this.page.locator("//h3[text()[normalize-space() = \"Dashboard\"]]");
  }

  get Heading_Enumeration_Mapping_Step_3_of_41(): Locator {
    return this.page.locator("//h5[contains(normalize-space(),\"Enumeration Mapping / Step 3 of 4\")]");
  }

  get Heading_Header_Mapping_Step_2_of_41(): Locator {
    return this.page.locator("//h5[contains(normalize-space(),\"Header Mapping / Step 2 of 4\")]");
  }

  get Heading_Mappings(): Locator {
    return this.page.locator("//h1[text()[normalize-space() = \"Mappings\"]]");
  }

  get Heading_Save_and_Move_to_Next_Page1(): Locator {
    return this.page.locator("//h5[text()[normalize-space() = \"Save and Move to Next Page\"]]");
  }

  get If_Bid_Field_Dropdown(): Locator {
    return this.page.locator("//select[@id='bidField']");
  }

  get If_Chase_Field_Dropdown(): Locator {
    return this.page.locator("//select[@id='ppePath']");
  }

  get Import_Rule_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Import Rule\"]]");
  }

  get Import_Rule_Checkbox(): Locator {
    return this.page.locator("//input[@id=\"TEst - 0\"]");
  }

  get Individual_Download_Button(): Locator {
    return this.page.locator("(//a[contains(@class,\"download\")])[$|Count|]");
  }

  get Insert_Header_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Insert Header\"]]");
  }

  get Inserted_Data_ChaseField_Name(): Locator {
    return this.page.locator("(//select[@class='form-select'])[2]");
  }

  get Inserted_Header_Data(): Locator {
    return this.page.locator("(//div[contains(@class,'gap-2 header-grid-layout')][contains(.,'@|Custom Header|')])[1]");
  }

  get Internal_User_Minutes_Input(): Locator {
    return this.page.locator("//input[@aria-label=\"Internal User Minutes\"]");
  }

  get Internal_User_Username_Replacement_Input(): Locator {
    return this.page.locator("//input[@aria-label=\"Internal User Username Replacement\"]");
  }

  get Last_Batch_Time(): Locator {
    return this.page.locator("(//div[contains(@class,\"card rounded-3\")]//div//h5)[last()]");
  }

  get Last_Month(): Locator {
    return this.page.locator("//div[contains(@class, 'popover-body')]//span[text()[normalize-space() = \"Last Month\"]]");
  }

  get Last_One_Month_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Last One Month\"]]");
  }

  get Line_by_line_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Line by line\"]]");
  }

  get Loan_Amount_In_Total_Commited(): Locator {
    return this.page.locator("//td[@role=\"cell\"]//input[@type=\"checkbox\"]//..//..//td[@data-title=\"Loan Amount\"]//div");
  }

  get Loan_Greater_Text(): Locator {
    return this.page.locator("(//div[@class=\"modal-content\"]//li)[2]");
  }

  get Loan_Purpose(): Locator {
    return this.page.locator("//div[text()='Loan Purpose']/../..//select[@id=\"id\"]");
  }

  get Loans_failed_to_be_added_to_commitment(): Locator {
    return this.page.locator("//li[text()[normalize-space() = \"Loans failed to be added to commitment\"]]");
  }

  get Lock_Terms_15_Days(): Locator {
    return this.page.locator("//div[@class='col-6'][contains(.,'$|Lock Terms 15 Days|')]");
  }

  get Lock_Terms_7_Days(): Locator {
    return this.page.locator("//div[@class='col-6'][contains(.,'$|Lock Terms 7 Days|')]");
  }

  get Login_Button(): Locator {
    return this.page.locator("//button[contains(@class, 'btn-primary') and contains(@class, 'caps') and contains(@class, 'login-button')]");
  }

  get Logo(): Locator {
    return this.page.locator("//img[@alt=\"Image\"]");
  }

  get Mandatory_Processing_Time_Report(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Mandatory Processing Time Report\"]]");
  }

  get Map_Versions(): Locator {
    return this.page.locator("//td[@data-title=\"Version Number\"]");
  }

  get Mark_Adj_Values(): Locator {
    return this.page.locator("(//td[contains(@data-title, \"Mark Adj\")])[$|Count|]");
  }

  get Market_Thresholds(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/market-thresholds\"]");
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

  get More_companies(): Locator {
    return this.page.locator("//button/span[text()='+2 more']");
  }

  get name_Header_Rule(): Locator {
    return this.page.locator("//a[contains(normalize-space(),\"test test\")]/preceding-sibling::i[text()[normalize-space() = \"name:\"]]");
  }

  get New_Data_TextLine_by_Line(): Locator {
    return this.page.locator("(//td[@class=\"d2h-ins d2h-change\"]//span[@class=\"d2h-code-line-ctn\"])[1]");
  }

  get New_Header_Mapping(): Locator {
    return this.page.locator("//div[contains(@class, 'header-grid-layout') and contains(@class, 'custom-header')]");
  }

  get New_Field_Chase_Dropdown(): Locator {
    return this.page.locator("/html/body/app-root/div/div/div/div/div/div/div/app-mapping-wizard-container/main/app-enumeration-mapping-container/section[2]/app-enumeration-mapping/fieldset/div/div/div[1]/div/div[5]/div/div/div/app-single-select-dropdown/select");
  }

  get No_Result_Data_on_Bid_Request(): Locator {
    return this.page.locator("//td[@role=\"cell\"]");
  }

  get No_Of_Batches(): Locator {
    return this.page.locator("//label[@for=\"batches\"]/following-sibling::input[@placeholder=\"00\"]");
  }

  get Not_Selected_Company_Name(): Locator {
    return this.page.locator("((//input[@type=\"checkbox\" and not(contains(@aria-label,\"Home Sweet Mortgage\"))])[position() > 1 and position() < last()]/..//div)[2]");
  }

  get Occupancy_Type(): Locator {
    return this.page.locator("//div[text()=\"Occupancy Type\"]/../..//select");
  }

  get Off_Radio_Button(): Locator {
    return this.page.locator("bulk-bid-select-off");
  }

  get Off_Radio_StandardEdit_Permissions_Popup(): Locator {
    return this.page.locator("(//input[@type=\"radio\"])[2]");
  }

  get OK_ButtonCommitment_List(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"OK\"]]");
  }

  get Ok_Button1(): Locator {
    return this.page.locator("//button[@aria-label=\"Ok\"]");
  }

  get Okay_Button1(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Okay\"]]");
  }

  get Okay_Close_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Okay, Close\"]]");
  }

  get On_Radio_button_in_Bid_Request(): Locator {
    return this.page.locator("(//input[@type=\"radio\"])[1]");
  }

  get On_Radio_ChaseDirectEdit_Permissions_Popup(): Locator {
    return this.page.locator("(//input[@type=\"radio\"])[3]");
  }

  get Open_Auth_Limit_Total_Loan(): Locator {
    return this.page.locator("//div[text()=\"Open Auth Limit: \"]//..//div[@class=\"fw-semibold\"]");
  }

  get Operation_Dropdown2(): Locator {
    return this.page.locator("(//select[contains(normalize-space(),\"Select = != > < >= <= contains\")])[4]");
  }

  get Operations_Dropdown_in_Search_Field(): Locator {
    return this.page.locator("//select[@id='id']");
  }

  get Operations_Dropdown_Rules(): Locator {
    return this.page.locator("(//select[contains(normalize-space(),\"Select = != > < >= <= contains\")])[$|count|]");
  }

  get Operations_Dropdown2(): Locator {
    return this.page.locator("(//select[contains(normalize-space(),\"Select = != > < >= <= contains\")])[2]");
  }

  get Option_in_Chase_Field_Name(): Locator {
    return this.page.locator("(//option[@value='search.criteria.propertyValuationType'])[3]");
  }

  get Pagination_Count(): Locator {
    return this.page.locator("//div[@aria-label=\"Pagination Controls\"]//span[@aria-atomic=\"true\"]");
  }

  get Password_Field(): Locator {
    return this.page.locator("//input[@type=\"password\"]");
  }

  get Paste_loan_numbers_here1(): Locator {
    return this.page.locator("//div[@role=\"textbox\"]");
  }

  get Paste_Loans_Button1(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Paste Loans\"]]");
  }

  get Pasted_loan_number(): Locator {
    return this.page.locator("//span[contains(@class,\"error-loan\")]");
  }

  get POS_Validation_Delegated_Conventional_Mandatory(): Locator {
    return this.page.locator("(//app-single-select-dropdown   [.//text()[normalize-space()='Conventional']]   /following-sibling::input[@type='text'])[3]");
  }

  get POS_REQ_ACK_Date(): Locator {
    return this.page.locator("//li[normalize-space()=\"POS_REQ_ACK\"]/following::ul//li[2]//div[contains(@aria-label,\"Date:\")]");
  }

  get PQ_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Deepika_JULY_16_13\"]]/following-sibling::button[text()[normalize-space() = \"PQ\"]]");
  }

  get PQ_Button_In_Price_Offered(): Locator {
    return this.page.locator("//input[@type='checkbox']/ancestor::tr//td//button[text()=\"PQ\"]");
  }

  get Price_Offered_List_Dropdown(): Locator {
    return this.page.locator("//a[@href=\"#/commitments/price-offered\"]");
  }

  get Price_Return_Timing(): Locator {
    return this.page.locator("((//option[text()=\"Select\"])[3]/..//option)[2]");
  }

  get Pricing_Return_Time(): Locator {
    return this.page.locator("(//select[@aria-label=\"Dropdown selection\"])[3]");
  }

  get Processing_Failed_Checkbox(): Locator {
    return this.page.locator("(//label[text()='Select Bid Request Status']//..//input[@type=\"checkbox\"])[3]");
  }

  get Product_Name_Dropdown(): Locator {
    return this.page.locator("//div[@class='flex-grow-1 text-start text-truncate'][contains(.,'214_25/30 Yr Freddie Mac Fixed')]");
  }

  get Products_Checkbox(): Locator {
    return this.page.locator("//input[@id=\"chkItem66bb292725f5a41e44678f7c0\"]");
  }

  get Products_Checkbox_2(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[2]");
  }

  get Property_Valuation_Type(): Locator {
    return this.page.locator("//option[@value=\"Desktop1004\"]/..");
  }

  get Queued_For_07302025_0809_AM_ET_Time(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Queued For: 07/30/2025 08:09 AM ET\"]]");
  }

  get Random_BidRequest(): Locator {
    return this.page.locator("(//td[@data-title=\"Bid Req. ID\"]//button)[$|RandomNumber|]");
  }

  get Random_BidRequest_Checkbox(): Locator {
    return this.page.locator("(//tbody//input[@type=\"checkbox\"])[$|RandomNumber|]");
  }

  get ReSubmit_For_Pricing(): Locator {
    return this.page.locator("//button//span[text()=\"Re-Submit For Pricing\"]");
  }

  get ReSubmit_For_Pricing_Button(): Locator {
    return this.page.locator("//button[contains(@class, 'btn-primary')]");
  }

  get Real_Time_Radio_ButtonUpload_Bid(): Locator {
    return this.page.locator("//form[@aria-labelledby=\"executionDetailsHeader\"]/div[4]/div[1]/div[1]/input[1]");
  }

  get Reason_for_cancelling_bid_request_Input(): Locator {
    return this.page.locator("//input[@placeholder=\"Reason for cancelling bid request...\"]");
  }

  get Reason_for_deleting_bid_request_Input(): Locator {
    return this.page.locator("//input[@placeholder=\"Reason for deleting bid request...\"]");
  }

  get Remaining_Time_Price_Offered(): Locator {
    return this.page.locator("//div[text()=\"Remaining Time\"]/..//h5");
  }

  get Remove_errors_and_continue_CheckboxPopup(): Locator {
    return this.page.locator("//label[text()=\"Remove errors and continue\"]/preceding-sibling::input[@type=\"checkbox\"]");
  }

  get Reports_Dropdown(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Reports\"]]");
  }

  get Required_Companys_Name_Value(): Locator {
    return this.page.locator("//span[@class='pl-2'][contains(.,'$|Companyname|')]");
  }

  get Required_Product_Code_Value(): Locator {
    return this.page.locator("//td[@data-title=\"Security Product\"]//div[contains(text(),\"$|ExpectedProductCode|\")]/../..//td[@data-title=\"Security Product\"]");
  }

  get Restore_this_version_Button(): Locator {
    return this.page.locator("//td[@data-title=\"Version Number\"][contains(.,'1')]/following-sibling::td[@data-title=\"Action\"]//a");
  }

  get Rule_in_Active_Version(): Locator {
    return this.page.locator("//div[@class='container px-4']//fieldset[1]");
  }

  get Rule_Name_is_required(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Rule Name is required.\"]]");
  }

  get RuleName_SearchField(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Rule Name\"]]");
  }

  get Rules_and_Actions_Step_4_of_4(): Locator {
    return this.page.locator("//h1[@class=\"fw-semibold py-3\"]");
  }

  get Save_BufferBulk_Batches(): Locator {
    return this.page.locator("//button[text()=\"Save Buffer\"]");
  }

  get Save_ButtonEmail_Config(): Locator {
    return this.page.locator("//button[@aria-label=\"Save\"]");
  }

  get Save_Changes_Button(): Locator {
    return this.page.locator("//button[normalize-space(text())=\"Save changes\" or contains(text(),\"Save Changes\")]");
  }

  get Save_Config_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Save Configuration\"]");
  }

  get Save_Draft_Button_in_Enumeration_Mapping(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Save Draft\"]]/..");
  }

  get Save_Draft_Button1(): Locator {
    return this.page.locator("//div[contains(@class, 'container') and contains(@class, 'd-flex')]/div[2]/button[2]");
  }

  get Save_Settings(): Locator {
    return this.page.locator("//div[contains(@class, 'scrollable-page')]/div[1]/app-general-settings-container[1]/div[2]/div[1]/div[2]/app-company-config-container[1]/app-company-config[1]/div[2]//button");
  }

  get Search_Filter_Input_in_Customer_Permission(): Locator {
    return this.page.locator("//input[@placeholder=\"Search / Filter\"]");
  }

  get Search_boxBid_mapping_id(): Locator {
    return this.page.locator("//div[contains(@class, 'shadow') and contains(@class, 'dropdown-menu') and contains(@class, 'show')]//input[@placeholder=\"Search\"]");
  }

  get Search_By_Bid_Request_ID_Input(): Locator {
    return this.page.locator("//input[@placeholder=\"Search By Bid Request ID\"]");
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

  get Search_Field_in_Enum(): Locator {
    return this.page.locator("(//input[@type=\"search\"])[2]");
  }

  get Search_Fields_Input(): Locator {
    return this.page.locator("//input[@placeholder=\"Search Fields\"]");
  }

  get Search_Map_Input(): Locator {
    return this.page.locator("typeahead-dropdown");
  }

  get Search_Map_Input_Dropdown(): Locator {
    return this.page.locator("(//span[text()[normalize-space() = \"Deepika Aug1\"]])[1]");
  }

  get Search_Text_Field(): Locator {
    return this.page.locator("//input[@placeholder=\"Search\"]");
  }

  get Search_Username_Input(): Locator {
    return this.page.locator("//input[@placeholder=\"Search Username\"]");
  }

  get SearchBox_In_NewMapScreen(): Locator {
    return this.page.locator("//input[@id='searchBox']");
  }

  get Searched_Company(): Locator {
    return this.page.locator("//span[contains(text(),\"$|CompanyName|\")]");
  }

  get Second_Bid_Request_Text(): Locator {
    return this.page.locator("(//label[text()='Select Bid Request Status']//..//div[@class=\"cursor-pointer py-3 text-wrap\"])[3]");
  }

  get Second_Company_Text(): Locator {
    return this.page.locator("(//div[@class=\"dropdown-overflow\"]//input[@type=\"checkbox\"])[2]/..//span");
  }

  get Second_MPRP_Button(): Locator {
    return this.page.locator("(//button[text()=\"MPRP\"])[2]");
  }

  get SecondComapny_Client_Asscociation(): Locator {
    return this.page.locator("(//div[@class='custom-input searchbox']/following-sibling::div//span)[2]");
  }

  get See_the_difference_Button(): Locator {
    return this.page.locator("//tbody[@role=\"rowgroup\"]/tr[1]/td[4]/div[1]/button[1]");
  }

  get Select_All_Checkbox(): Locator {
    return this.page.locator("//input[@type=\"checkbox\" and contains(@class, 'custom-control-input')]");
  }

  get Select_All_Companies_Check_Box(): Locator {
    return this.page.locator("//input[@id='chkItemallIdundefined' and @type=\"checkbox\"]");
  }

  get Select_Attached_Detached_Dropdowns(): Locator {
    return this.page.locator("(//select[contains(normalize-space(),\"Select Attached Detached\")])[3]");
  }

  get Select_Attached_Detached_Dropdowns_2(): Locator {
    return this.page.locator("(//select[contains(normalize-space(),\"Select Attached Detached\")])[4]");
  }

  get Select_Bid_Enumerated_Bid_Tape_values(): Locator {
    return this.page.locator("(//input[@type=\"search\"])[6]");
  }

  get Select_Bid_Request_Status(): Locator {
    return this.page.locator("(//div[@class=\"d-flex\"]//div//button[@id=\"multiSelectDropDown\"])[last()]");
  }

  get Select_Bid_Request_Status_Dropdown1(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Select Bid Request Status\"]]");
  }

  get Select_Bid_Sample_Field_Name_Bid_Tape_Value_Chase_Fi(): Locator {
    return this.page.locator("//div[contains(@class, 'mapping-header') and contains(@class, 'small')]");
  }

  get Select_Bid_Sample_Field_Name(): Locator {
    return this.page.locator("//div[@class=\"flex-grow-1\"]/..//div[text()=\"Amortization Term\"]");
  }

  get Select_Button(): Locator {
    return this.page.locator("//a[text()=\"Select\"]");
  }

  get Select_Clients_Dropdown(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Select Clients\"]]");
  }

  get Select_Clients_Dropdown_2(): Locator {
    return this.page.locator("//button[@id='multiSelectDropDown']");
  }

  get Select_Commitments_Status_Dropdown(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Select Commitments Status\"]]");
  }

  get Select_CompanyCCode_Dropdown1(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Select Company/CCode\"]]");
  }

  get Select_Companys_Dropdown(): Locator {
    return this.page.locator("//div//div[@id=\"companySelect\"]//div//button[@id=\"multiSelectDropDown\"]");
  }

  Select_Current_DateAdd_Config(CurrentDate: string): Locator { 
    return this.page.locator(`//div[@class=\"ngb-dp-month\"]//div[@aria-label='${CurrentDate}']`);
  }

  get Select_Date_From_Calenderyesterday(): Locator {
    return this.page.locator("//span[normalize-space(text())='$|YesterdaysDate|' and @class=\"custom-day\"]");
  }

  get Select_Date_From_Custom_Date_Range(): Locator {
    return this.page.locator("//input[@placeholder=\"Select Date\"]");
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

  get Select_Date_Range_Dropdown1(): Locator {
    return this.page.locator("//label[text()=\"Select Date Range\"]//following::div[contains(@class,\"custom\")]//a[@role=\"button\"]");
  }

  get Select_Dropdown_Elements(): Locator {
    return this.page.locator("(//select[@id='id'])");
  }

  get Select_Dropdown_in_Enumeration_Mapping(): Locator {
    return this.page.locator("//select[contains(normalize-space(),\"Select Fixed rate Variable rate\")]");
  }

  get Select_Dropdown_in_Headers_Mapping(): Locator {
    return this.page.locator("(//select[contains(@class, 'form-select')])[3]");
  }

  get Select_False_True_Dropdown(): Locator {
    return this.page.locator("//select[contains(normalize-space(),\"Select False True\")]");
  }

  get Select_row_6842bc66c346bc7360617302_Checkbox(): Locator {
    return this.page.locator("//input[@aria-label=\"Select row 6842bc66c346bc7360617302\"]");
  }

  get Select_Select_Dropdown(): Locator {
    return this.page.locator("Select");
  }

  get Select_under_When_field_name(): Locator {
    return this.page.locator("//a[@aria-label=\"Select text option\"]");
  }

  get SelectAmortizationType_a_div(): Locator {
    return this.page.locator("(//a[contains(@class, 'fa-trash-alt')])[last()]");
  }

  get SelectCompany_Value(): Locator {
    return this.page.locator("(//span[contains(@class,'pl-2')])[1]");
  }

  get Selected_Bid_Request_Status(): Locator {
    return this.page.locator("//label[text()=\"Select Bid Request Status\"]/..//label[contains(@class,\"checked\")]//span[@title]");
  }

  get Selected_Category(): Locator {
    return this.page.locator("//span[text()=\"@|Date Range Filter Type|\"]");
  }

  get Selected_Category_Dropdown(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Selected (1)\"]]");
  }

  get Selected_Companies_Count(): Locator {
    return this.page.locator("//button[@aria-label=\"Apply selected items\"]//span[@aria-label]");
  }

  get Selected_CompaniesBid_Req_Filters(): Locator {
    return this.page.locator("//label[text()=\"Select Company/CCode\"]/..//label[contains(@class,\"checked\")]//span[@title]");
  }

  get Selected_Date_Range(): Locator {
    return this.page.locator("(//label[text()=\"Select Date Range\"]//following::span)[1]");
  }

  get Selected_Items_CountBeside_Apply_Selected(): Locator {
    return this.page.locator("//label[text()=\"Select Company/CCode\"]/..//span[contains(@aria-label,\"items selected\")]");
  }

  get Selected_Status_CountBeside_Apply_Selected(): Locator {
    return this.page.locator("//label[text()=\"Select Bid Request Status\"]/..//span[contains(@aria-label,\"items selected\")]");
  }

  get Selected_Company_Name(): Locator {
    return this.page.locator("((//input[@type=\"checkbox\" and not(contains(@aria-label,\"Home Sweet Mortgage\"))])[position() > 1 and position() < last()]/..//div)[1]");
  }

  get Selecting_Company_Name_in_Map_Name(): Locator {
    return this.page.locator("(//td[@data-title=\"Company\"])[21]");
  }

  get Selecting_Multiple_Companies_number(): Locator {
    return this.page.locator("//table[contains(@class, 'table')]/tbody[1]/tr[2]/td[4]/a[1]");
  }

  get SelectText_HedaerMapping_Field(): Locator {
    return this.page.locator("(//div[contains(@class,\"gap-2 header-grid-layout\")]/..//select)[$|IndexCount|]");
  }

  get Send_Email_Button(): Locator {
    return this.page.locator("//tr[contains(normalize-space(),\"A4187 87W396593360 Freedom A4187 $888.71K 3 / 0 Standard Price Offered 05/22/2025 05/22/2025\")]//td[@data-title=\"Actions\"]//div[@role=\"group\"]//button[@aria-label=\"Send Email\"]//span[contains(@class, 'fa-envelope')]");
  }

  get Send_Email_Button_On_Pop_Up(): Locator {
    return this.page.locator("//button[@aria-label=\"Send Email\" and contains(@class, 'fw-bold') and contains(@class, 'btn-primary')]");
  }

  get Send_Email_ButtonCommitment_List(): Locator {
    return this.page.locator("//button[@aria-label=\"Send Email\"]//span");
  }

  get Set_page_size_to_50_Dropdown(): Locator {
    return this.page.locator("//button[@aria-label=\"Set page size to 50\"]");
  }

  get Show_20(): Locator {
    return this.page.locator("//button[@role=\"button\" and contains(text(),\"Show 20\")]");
  }

  get Show_All_Button(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Show All\"]]");
  }

  get Show_All_Dropdown(): Locator {
    return this.page.locator("//div[@role=\"listbox\"]/div[2]/button[1]");
  }

  get Show_All_Headers(): Locator {
    return this.page.locator("//select[@id=\"id\"]");
  }

  get Show_All_Headers_in_Header_Mappings(): Locator {
    return this.page.locator("//div[@class=\"gap-2 header-grid-layout\"]/../..//div[@class=\"flex-grow-1\"]");
  }

  get Show_All_ColumnHeader(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Column Header\"]]/following-sibling::a[text()[normalize-space() = \"Show All\"]]");
  }

  get Show_All1(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"BidMap\"]]/following-sibling::a[text()[normalize-space() = \"Show All\"]]");
  }

  get Show_Selected_Button(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Show Selected\"]]");
  }

  get Show_All_Enum_SearchField(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Enum\"]]/following-sibling::a[text()[normalize-space() = \"Show All\"]]");
  }

  get Show_All_For_Actions_SearchFilter(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Action\"]]/following-sibling::a[text()[normalize-space() = \"Show All\"]]");
  }

  get Show_All_for_RuleName_SearchField(): Locator {
    return this.page.locator("//h6[text()[normalize-space() = \"Rule Name\"]]/following-sibling::a[text()[normalize-space() = \"Show All\"]]");
  }

  get Side_by_side_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Side by side\"]]");
  }

  get Sixth_Company_Name(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[7]//following-sibling::div/span");
  }

  get Smart_Mapper(): Locator {
    return this.page.locator("//label[text()[normalize-space() = \"Smart Mapper\"]]");
  }

  get Standard_Flow_Off_Button(): Locator {
    return this.page.locator("(//label[normalize-space(text())='Standard Flow']/parent::div//input)[2]");
  }

  get StandardExceutionType_Dropdown(): Locator {
    return this.page.locator("(//option[@value=\"3\"])[1]/../..//select[@aria-label=\"Dropdown selection\"]");
  }

  get StartTime_In_Hour(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"H\"]]/preceding-sibling::input[@placeholder=\"0\"]");
  }

  get StartTime_In_Minutes(): Locator {
    return this.page.locator("(//input[@placeholder=\"00\"])[1]");
  }

  get Status(): Locator {
    return this.page.locator("(//td[@data-title=\"Status\"])[1]");
  }

  get Status_Processing(): Locator {
    return this.page.locator("//div[normalize-space(text())='Status']//..//..//..//..//..//div[@class=\"d-flex align-items-start\"]");
  }

  get Status_Processing_Failed_Count(): Locator {
    return this.page.locator("//div[normalize-space(text())='Status']//..//..//..//..//..//div[@class=\"d-flex align-items-start text-danger\"]");
  }

  get Third_Company_Name(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\"])[4]//following-sibling::div/span");
  }

  get ThirdComapny_Client_Asscociation(): Locator {
    return this.page.locator("(//div[@class='custom-input searchbox']/following-sibling::div//span)[3]");
  }

  get This_Quarter_Button(): Locator {
    return this.page.locator("//button[contains(@class, 'fa-times-circle') and contains(@class, 'popover-close') and contains(@class, 'btn-link')]/following-sibling::ul//span[text()[normalize-space() = \"This Quarter\"]]");
  }

  get This_Year_Button(): Locator {
    return this.page.locator("//button[contains(@class, 'fa-times-circle') and contains(@class, 'popover-close') and contains(@class, 'btn-link')]/following-sibling::ul//span[text()[normalize-space() = \"This Year\"]]");
  }

  get Time_Standard_Dropdown(): Locator {
    return this.page.locator("//div[text()=\"Comm. Cut Off\"]/following::select[@class=\"form-select\"]");
  }

  get Time_Zone_OptionAmericaNew_York(): Locator {
    return this.page.locator("//div[@role=\"listbox\"]//button[@role=\"option\"]//span[contains(text(),\"America/New_York\")]");
  }

  get Time_Interval(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Time Interval\"]]/following-sibling::div[contains(@class, 'custom-input')]//input[@placeholder=\"0\"]");
  }

  get Time_Pricing(): Locator {
    return this.page.locator("//select[@class=\"form-select ng-untouched ng-pristine ng-invalid\"]");
  }

  get Today(): Locator {
    return this.page.locator("(//form//div[@class=\"col\"]//div//input[@name=\"bidRequestDate\"])[1]");
  }

  get Toggle_Date_Picker_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Toggle Date Picker\"]");
  }

  get Toggle_Date_Picker_Button1(): Locator {
    return this.page.locator("//button[@aria-label=\"Toggle Date Picker\"]//i");
  }

  get Toggle_dropdown_Dropdown(): Locator {
    return this.page.locator("//button[@aria-label=\"Toggle dropdown\"]");
  }

  get Total_commitments(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Total # commitments\"]]");
  }

  get Total_Bid_Req_Statuses_Count(): Locator {
    return this.page.locator("//label[text()=\"Select Bid Request Status\"]/..//div[@class=\"dropdown-overflow\"]//label[@role=\"option\"]");
  }

  get Total_Commitments(): Locator {
    return this.page.locator("//div[contains(text(),\"commitments\")]//following-sibling::h5");
  }

  get Total_CompaniesBid_Request_Filters(): Locator {
    return this.page.locator("//label[text()=\"Select Company/CCode\"]/..//div[@class=\"dropdown-overflow\"]//label[@role=\"option\"]");
  }

  get Total_Dropdown_Companies(): Locator {
    return this.page.locator("//div[@class=\"dropdown-overflow\"]//label[@role=\"option\"]");
  }

  get True_Dropdown_in_chase_value(): Locator {
    return this.page.locator("//select[@title=\"True\"]");
  }

  get Try_Advanced_Search_and_Filter_option_Button(): Locator {
    return this.page.locator("//a[text()[normalize-space() = \"Try Advanced Search and Filter option\"]]");
  }

  get Uncommited_LoanNum2(): Locator {
    return this.page.locator("(//tr[@class=\"row-highlight\"]//button[contains(@aria-label,\"View loan details\")])[2]");
  }

  get Unmapped_Headers(): Locator {
    return this.page.locator("(//select[@class='form-select'])");
  }

  get Update_Header(): Locator {
    return this.page.locator("//h5[text()[normalize-space() = \"Update Header\"]]");
  }

  get Update_Header_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Update Header\"]]");
  }

  get UpdateConfig_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Update Configuration\"]");
  }

  get Updated_ChaseField_Value(): Locator {
    return this.page.locator("(//select[@id=\"id\"]//option[@value='search.criteria.propertyValuationType'])[2]");
  }

  get UpdatedWhenBidField1(): Locator {
    return this.page.locator("//div[contains(@class, 'shadow') and contains(@class, 'dropdown-menu') and contains(@class, 'show')]//button[@role=\"option\"]//span[@title=\"Correspondent Loan Number\"]");
  }

  get upload_Company_Config(): Locator {
    return this.page.locator("//span[text()=\"upload\"]/..//input");
  }

  get Upload_File(): Locator {
    return this.page.locator("(//input[@type=\"file\"])[1]");
  }

  get UploadBid_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Upload Bid\"]]");
  }

  get Uploaded_Dates(): Locator {
    return this.page.locator("(//td[@data-title=\"Uploaded\"])[$|count|]");
  }

  get Uploaded_Time(): Locator {
    return this.page.locator("//td[@data-title=\"Upload Time\"]//div[contains(@aria-label,\"Value\")]");
  }

  get Username_Field(): Locator {
    return this.page.locator("//input[@type=\"text\"]");
  }

  get Version(): Locator {
    return this.page.locator("(//td[@data-title=\"Version\"])[1]");
  }

  get When_Bid_Field(): Locator {
    return this.page.locator("//label[text()[normalize-space() = \"When Bid Field\"]]/following-sibling::div[contains(@class, 'd-flex')]//div[@aria-labelledby=\"singleSelectDropDown\"]//input[@type=\"search\"]");
  }

  get When_Bid_Field_Dropdown(): Locator {
    return this.page.locator("//label[text()=\" When Bid Field \"]/..//*[text()=\" Select \"]/..");
  }

  get When_Bid_Field_in_Add_Conditions(): Locator {
    return this.page.locator("//label[text()[normalize-space() = \"When Bid Field\"]]/following-sibling::div[contains(@class, 'd-flex')]//div[text()[normalize-space() = \"Select\"]]");
  }

  get When_Bid_Field_Search_List(): Locator {
    return this.page.locator("(//span[@title='$|Bid Field|'])[2]");
  }

  get When_Bid_Fields_Dropdown(): Locator {
    return this.page.locator("(//input[@type=\"search\"])[5]");
  }

  get When_Bid_Fields(): Locator {
    return this.page.locator("(//div[contains(@class, 'block')])[1]");
  }

  get When_Bid_Field_1(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1 text-start text-truncate\"])[2]");
  }

  get WhenBidFieldValue_3(): Locator {
    return this.page.locator("//div[contains(@class, 'shadow') and contains(@class, 'dropdown-menu') and contains(@class, 'show')]//button[@role=\"option\"]//span[@title=\"Appraised Value\"]");
  }

  get WhenBidFieldValue_Block_2(): Locator {
    return this.page.locator("//div[contains(@class, 'shadow') and contains(@class, 'dropdown-menu') and contains(@class, 'show')]//button[@role=\"option\"]//span[@title=\"Amortization Type\"]");
  }

  get Yes_Commit_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Yes, Commit\"]]");
  }

  get Yes_Delete_ButtonEarly_config(): Locator {
    return this.page.locator("//button[@aria-label=\"Yes, Delete\"]");
  }

  get Yes_Go_ahead_Button_Bid_Request_List(): Locator {
    return this.page.locator("//button[@aria-label=\"Yes, Go ahead\"]");
  }

  get Yes_Go_ahead_Buttondelete(): Locator {
    return this.page.locator("//i[contains(@class,\"trash-alt\")]/ancestor::button");
  }

  get Yes_Go_ahead_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Yes, Go ahead.\"]]");
  }

  get Yes_Proceed_Button(): Locator {
    return this.page.locator("(//button[@type=\"button\"])[last()]");
  }

  get Yes_proceed_Button_BidRequest(): Locator {
    return this.page.locator("//button[@aria-label=\"Yes, proceed\"]");
  }

  get You_have_unidentified_fields_do_you_want_to_proceed_Further(): Locator {
    return this.page.locator("//p[text()[normalize-space() = \"You have unidentified fields do you want to proceed further.\"]]");
  }

  get You_have_unidentified_fields_This_action_will_save_the_changes_and_Move_to_Next_Page(): Locator {
    return this.page.locator("//*[contains(text(),\" You have unidentified fields do you want to proceed further\")]");
  }

}