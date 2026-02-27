import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Commitment list
 * Elements: 219
 */
export class CommitmentListPage {
  constructor(private page: Page) {}

  get AllFiles_File_Name(): Locator {
    return this.page.locator("(//td[@data-title=\"File Name\"])[last()]");
  }
  get Lock_Icon(): Locator {  
    return this.page.locator("//span[contains(@class,'lock-icon')]");
  }

  get Bid_Request_IDCommitment_List_Screen(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Request ID\"]");
  }

  get Bid_Request_IDSearch_Dropdown(): Locator {
    return this.page.locator("(//li[contains(@class,\"text-primary\")]//span)[2]");
  }

  get BidReqId2Commitment_List_Screen(): Locator {
    return this.page.locator("//td[@data-title=\"Company\"]//div[normalize-space(text())=\"$|CompanyName|\"] //ancestor::tr //td[@data-title=\"Bid Request ID\"] //div[not(contains(normalize-space(text()),\"$|BidReqId1|\"))]");
  }

  get CaseSensitiveXpath(): Locator {
    return this.page.locator("//h5[text()='$|CommitID|']/ancestor::div[@id=\"accordionHeader\"]/following-sibling::div//tbody//tr//td[@data-title=\"Corr. Loan#\"]//button[contains(translate(text()'ABCDEFGHIJKLMNOPQRSTUVWXYZ''abcdefghijklmnopqrstuvwxyz'),translate('$|CorrespondentLoanNumber|', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'))]\n");
  }

  get Chase_Loan_Button(): Locator {
    return this.page.locator("//div[@aria-label=\"Sort by Chase Loan#\"]");
  }

  get Chase_Loan_Num(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Chase Loan#\"]");
  }

  get Chase_Loan_Number_DropdownCommitment_List_Page(): Locator {
    return this.page.locator("//span[normalize-space(text())=\"Chase Loan Number\"]");
  }

  get Chase_Loan_NumberSearch_Dropdown(): Locator {
    return this.page.locator("(//li[contains(@class,\"text-primary\")]//span)[3]");
  }

  get Check_Duplicate_Loan_Num(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]/ancestor::tr//input[@type=\"checkbox\"]");
  }

  get Check_Req_Loan_Num(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNum|\"]//ancestor::tr//input[@type=\"checkbox\"]");
  }

  get Check_the_Req_Company_Name(): Locator {
    return this.page.locator("//label[@class=\"dropdown-item d-flex\"]//input[@type=\"checkbox\"]");
  }

  get Clear_all_ButtonCommitment_List(): Locator {
    return this.page.locator("//button[@aria-label=\"Clear all filters\"]");
  }

  get Clear_All_FiltersCommitment_List(): Locator {
    return this.page.locator("//button[@aria-label=\"Clear all filters\"]");
  }

  get Closed_Date(): Locator {
    return this.page.locator("(//td[@data-title=\"Closed Date\"]/parent::*//div[contains(@aria-label,'Expiration Date')])[1]");
  }

  get Closed_List_Tab(): Locator {
    return this.page.locator("//div[normalize-space()=\"Closed List\"]");
  }

  get Column_Count_UICommitment_List(): Locator {
    return this.page.locator("(//table[@role='table']//tbody//tr[$|count|]//td[@data-title][position() > 2 and position() != 4 and position() != 12])");
  }

  get Column_Count_UICommitted_Loans(): Locator {
    return this.page.locator("(//table)[1]//tbody//tr[$|count|]//td[@data-title][position() >= 3]");
  }

  get Column_Count_UILocked_Loans(): Locator {
    return this.page.locator("(//span[contains(@class,\"fa fas fa-lock lock-icon\")])[$|count|]//ancestor::tr//td[@data-title][position() >2 and position()!= 4 and position()!= 12]");
  }

  get Comm_Date_column(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Committed Date:\")]");
  }

  get Comm_Amount(): Locator {
    return this.page.locator("//td[@data-title=\"Comm. Amount\"]");
  }

  get Comm_Amount_Button(): Locator {
    return this.page.locator("//div[@aria-label=\"Sort by Comm. Amount\"]");
  }

  get Commit_Check_Boxes(): Locator {
    return this.page.locator("//*[@disabled]//input[normalize-space(@aria-label)=\"Select all for\"]");
  }

  get Commit_IDCommitment_List_Screen(): Locator {
    return this.page.locator("//td[@data-title=\"Comm. ID\"]//a");
  }

  get Commit_IDCommitment_List3(): Locator {
    return this.page.locator("(//div[text()=\"Commit. ID\"]/following-sibling::h5)[3]");
  }

  get Commit_OrderLatest(): Locator {
    return this.page.locator("(//div[text()=\"Commit. #\"]//following-sibling::h5)[last()]");
  }

  get Commit_OrderPrice_Offered(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//div[@class=\"commit-order\"]");
  }

  get Commit_TimeCommitment_Screen(): Locator {
    return this.page.locator("//div[text()=\"Commit. Time\"]//following-sibling::h5");
  }

  get Commit_OrderCommitment_List(): Locator {
    return this.page.locator("//div[text()=\"Commit. #\"]//following-sibling::h5");
  }

  get Commitment_ID_Same_Loan_Num(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Request ID\"]//div[normalize-space(text())=\"$|BidReqId|\"]//ancestor::tr//td[@data-title=\"Comm. ID\"]//a[normalize-space(text())=\"$|CommitmentIDPriceOffered|\"]");
  }

  get Commitment_ID_DropdownChase(): Locator {
    return this.page.locator("//div[normalize-space(text())=\"$|CommitIDChase|\"]\n");
  }

  get Commitment_ID_DropdownStandard(): Locator {
    return this.page.locator("//div[normalize-space(text())=\"$|CommitIDStandard|\"]");
  }

  get Commitment_IdAdd_To_Commit_Dropdown(): Locator {
    return this.page.locator("//div[normalize-space(text())=\"$|CommitmentID|\"]");
  }

  get Commitment_IDChase_Direct(): Locator {
    return this.page.locator("//td[@data-title=\"Execution Type\"]//div[normalize-space(text())=\"CHASE_DIRECT\"]//ancestor::tr//td[@data-title=\"Comm. ID\"]//a[contains(@aria-label,\"View details for commitment\")]");
  }

  Commitment_IDCommitment_List_Page(BidReqId: string): Locator {
    return this.page.locator(`//td[@data-title="Bid Request ID"]//div[normalize-space(text())="${BidReqId}"]//ancestor::tr//td[@data-title="Comm. ID"]`);
  }

  get Commitment_IDCommitment_List(): Locator {
    return this.page.locator("//div[contains(text(),\"$|BidReqIdPriceOffered|\")]/ancestor::tr/td[@data-title=\"Comm. ID\"]");
  }

  get Commitment_IDLatest(): Locator {
    return this.page.locator("(//div[text()=\"Commit. ID\"]//following-sibling::h5)[last()]");
  }

  get Commitment_IDMore_Than_one_Commited_Loan(): Locator {
    return this.page.locator("//td[@data-title=\"Comm. Loans\"]//div[not(contains(text(),'1'))]//ancestor::tr//td[@data-title=\"Comm. ID\"] ");
  }

  get Commitment_IDSame_Loan_Num(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Request ID\"]//div[normalize-space(text())=\"$|BidReqIdCommitmentList|\"]//ancestor::tr//td[@data-title=\"Comm. ID\"]//a[normalize-space(text())=\"$|CommitmentIDPriceOffered|\"]");
  }

  get Commitment_IDSearch_Dropdown(): Locator {
    return this.page.locator("(//li[contains(@class,\"text-primary\")]//span)[1]");
  }

  get Commitment_IDStandard(): Locator {
    return this.page.locator("//td[@data-title=\"Execution Type\"]//div[normalize-space(text())=\"STANDARD\"]//ancestor::tr//td[@data-title=\"Comm. ID\"]//a[contains(@aria-label,\"View details for commitment\")]");
  }

  get Commitment_ID2_Screen(): Locator {
    return this.page.locator("(//div[text()=\"Commit. ID\"]//following-sibling::h5)[2]");
  }

  get Commitment_Letter(): Locator {
    return this.page.locator("//td[@data-title=\"Comm. Letter\"]//span");
  }

  get Commitment_List_Text(): Locator {
    return this.page.locator("//h3[text()[normalize-space() = \"Commitment List\"]]");
  }

  get Commitment_Order_Dropdown1(): Locator {
    return this.page.locator("//div[contains(text(),\"Commitment Order\")]");
  }

  get Commitment_OrderAdd_To_Commit_Dropdown(): Locator {
    return this.page.locator("//div[normalize-space(text())=\"$|CommitmentID|\"]//preceding-sibling::div[contains(text(),\"Commitment Order\")]");
  }

  get Commitment_OrderCommitment_List_Details(): Locator {
    return this.page.locator("//button[text()=\"@|Corr Loan Num|\"]//ancestor::tr//div[@class=\"commit-order\"]");
  }

  get Commitment_OrderCommitment_List_New(): Locator {
    return this.page.locator("//div[text()=\"574X3D2A\"]//preceding-sibling::div[contains(text(),\"Commitment Order\")]//parent::a[contains(@class,\"disabled\")]");
  }

  get Commitment_OrderCommitment_List(): Locator {
    return this.page.locator("//div[text()=\"$|CommitID|\"]//preceding-sibling::div[contains(text(),\"Commitment Order\")]");
  }

  get Commitment_OrderDisabled(): Locator {
    return this.page.locator("//div[contains(text(),\"Commitment Order\")]//parent::a[contains(@class,\"disabled\")]");
  }

  get Commitment_OrderLatest_Committed_Loan(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//div[@class=\"commit-order\"]");
  }

  get Commitment_OrderUncommitted_Loan(): Locator {
    return this.page.locator("//div[text()=\"$|CommitID|\"]//preceding-sibling::div[contains(text(),\"Commitment Order\")]\n");
  }

  get Commitment_Time_List_Details_ScreenLatest(): Locator {
    return this.page.locator("(//div[text()=\"Commit. Time\"]//following-sibling::h5)[last()]");
  }

  get Commitment_UpdatePopup(): Locator {
    return this.page.locator("(//div[@class=\"modal-body\"]//div)[2]");
  }

  get Committed_Corr_Loan_Num(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]");
  }

  get Committed_Corr_Loan_Number(): Locator {
    return this.page.locator("//button[\"$|CommittedCorrLoan|\"]");
  }

  get Committed_Date(): Locator {
    return this.page.locator("//td[@data-title=\"Comm. Date\"]//div");
  }

  get Committed_List_Dropdown(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Committed List\"]]");
  }

  get Committed_List_Execution_Type(): Locator {
    return this.page.locator("//td[@data-title=\"Execution Type\"]");
  }

  get Committed_Loan_Commitment_Order(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//div[@class=\"commit-order\"]");
  }

  get Committed_Loan_Locked_iconCommitment_List(): Locator {
    return this.page.locator("//button[text()=\"@|Corr Loan Num|\"]//ancestor::tr//span[contains(@class,\"fa fas fa-lock lock-icon\")]");
  }

  get Committed_Loan_NumCommitment_List(): Locator {
    return this.page.locator("//div[text()=\"Commit. ID\"]//following-sibling::h5[text()=\"$|CommitID|\"]//ancestor::div[contains(@class,\"accordion-item\")]//div[@class=\"accordion-body\"]//tbody//button[\"$|CommittedCorrLoan|\"]");
  }

  get Committed_Loan_NumStandard_Commitment_List(): Locator {
    return this.page.locator("//span[contains(@class,\"fa fas fa-lock lock-icon\")]//ancestor::tr//td[@data-title=\"Corr. Loan#\"]//button[contains(@class,\"btn bg-transparent text-primary\")][1]");
  }

  get Committed_Loan_NumUncommitted_Loan(): Locator {
    return this.page.locator("//div[text()=\"Commit. ID\"]//following-sibling::h5[text()=\"$|CommitID|\"]//ancestor::div[contains(@class,\"accordion-item\")]//div[@class=\"accordion-body\"]//tbody//button[\"|$UncommittedLoanNum|\"]");
  }

  get Committed_Loan_Number(): Locator {
    return this.page.locator("//button[contains(text(),\"$|CommittedLoan|\")]/ancestor::tr//input[@type=\"checkbox\"]");
  }

  get Committed_Loan_NumberChase_Direct(): Locator {
    return this.page.locator("//span[contains(@class,\"fa fas fa-lock lock-icon\")]//ancestor::tr//td[@data-title=\"Corr. Loan#\"]//button[1]");
  }

  get Company_Filter_ChipCommitment_List_Page(): Locator {
    return this.page.locator("//div[@class=\"pill rounded-pill relative\" and contains(@aria-label,\"Chip Company\")]");
  }

  get Company_Filter_ChipCommitted_Page(): Locator {
    return this.page.locator("//span[@aria-label[contains(., 'Company: ')]]");
  }

  get Company_NameCommitment_List_Screen(): Locator {
    return this.page.locator("//td[@data-title=\"Company\"]//div");
  }

  get Company_NameCommitment_List(): Locator {
    return this.page.locator("//div[text()=\"Customer\"]//following-sibling::h5");
  }

  get Corr_Loan_NumCommitments_Details(): Locator {
    return this.page.locator("//td[@data-title=\"Corr. Loan#\"]//button[1]");
  }

  get Corr_LoanHeader_Name(): Locator {
    return this.page.locator("//div[@aria-label=\"Sort by Corr. Loan#\"]");
  }

  get Correction_Cut_Off(): Locator {
    return this.page.locator("//input[@id=\"internalUserCorrectionCutOfHours\"and @type=\"number\"]");
  }

  get Correspondent_Loan_Num_DropdownCommitment_List_Page(): Locator {
    return this.page.locator("//span[normalize-space(text())=\"Correspondent Loan Number\"]");
  }

  get Creation_DatePopup(): Locator {
    return this.page.locator("//td[@data-title=\"Creation Date\"]");
  }

  get Curr_Market_ValueCommitment_List(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Curr Market Value\"]");
  }

  get Current_Gross_Price(): Locator {
    return this.page.locator("(//td[@data-title=\"Curr Gross\"])[$|RowCount|]");
  }

  get Current_Market_ValueCommitment_List(): Locator {
    return this.page.locator("//ancestor::tr//td[@data-title=\"Curr Market Value\"]");
  }

  get Date_Filter_ChipCommitted_Page(): Locator {
    return this.page.locator("//div[@class=\"pill rounded-pill relative\" and contains(@aria-label,\"Chip Date\")]");
  }

  get Download_Commitment_LatterLast(): Locator {
    return this.page.locator("(//div[@id=\"modalBody\"]//i[contains(@class,\"fas fa-arrow-to-bottom\")]//parent::button)[last()-1]");
  }

  get Download_Commitment_Letter_Button(): Locator {
    return this.page.locator("(//td[@data-title=\"Comm. Letter\"]//span)[2]");
  }

  get Download_Commitment_Letter1(): Locator {
    return this.page.locator("//td[@data-title=\"File Name\" and contains(text(),\"$|FileNamePopup|\")]/following-sibling::td[@data-title=\"Actions\"]//button[i[contains(@class,'fa-arrow-to-bottom')]]");
  }

  get Download_File_TextPopup(): Locator {
    return this.page.locator("//h5[text()=\"Download file\"]");
  }

  get Duplicate_CorrLoan_Number(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]");
  }

  get Enter_minimum_display_value_in_percentage(): Locator {
    return this.page.locator("//input[@aria-label=\"Enter minimum display value in percentage\"]");
  }

  get Export_Selected(): Locator {
    return this.page.locator(" //span[text()=\" Export Selected\"]/following-sibling::span");
  }

  get FICO_Value(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"FICO Score\")]/following-sibling::div)[1]");
  }

  get File_NameCommitment_List(): Locator {
    return this.page.locator("(//div[@id='modalBody']//td[@data-title='File Name' and contains(text(), '.xlsx')])[$|count|]");
  }

  get File_NamePopup(): Locator {
    return this.page.locator("//td[@data-title=\"File Name\"]");
  }

  get Files_Count(): Locator {
    return this.page.locator("//div[@id='modalBody']//td[@data-title='File Name' and contains(text(), '.xlsx')]");
  }

  get First_Bid_Req_IDCommitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Request ID\"]");
  }

  get First_Commitment_IDCommitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Comm. ID\"]//a[contains(@aria-label,\"View details for commitment\")]");
  }

  get First_Commitment_Letter(): Locator {
    return this.page.locator("//button[i[contains(@class,'fa-arrow-to-bottom')]]");
  }

  get First_Commitment_Rows(): Locator {
    return this.page.locator("(//table)[1]//tr[@role=\"row\"]");
  }

  get First_Loan_NumberCommitment_List(): Locator {
    return this.page.locator("//tr[@role=\"row\"]//button[1]");
  }

  get First_PQ_Button(): Locator {
    return this.page.locator("//tr[@role=\"row\"]//button[2]");
  }

  get Fresh_Loan_NumChase_Direct(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]/ancestor::tr//input[@type=\"checkbox\"]");
  }

  get Fresh_Loan_Num1Standard_Commitment_List(): Locator {
    return this.page.locator("//input//ancestor::tr//button[contains(@class,\"btn bg-transparent text-primary\")][1]");
  }

  get Fresh_Loan_Num2Standard(): Locator {
    return this.page.locator("(//input//ancestor::tr//button[contains(@class,\"btn bg-transparent text-primary\")][1])[2]");
  }

  get Gross_PriceCommitment_List(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Gross Price\"]");
  }

  get Headers_Names_UICommitment_List(): Locator {
    return this.page.locator("(//div[contains(@aria-label,\"Sort by\")])[position() != 2 and position() != 10]");
  }

  get Headers_UI_Commitment_List(): Locator {
    return this.page.locator("(//div[contains(@aria-label,\"Sort by\")])[position() <= 12]");
  }

  get Headers_UIClosed_List(): Locator {
    return this.page.locator("(//div[contains(@aria-label,\"Sort by\")])[position() <= 13]");
  }

  get Headers_UIFirst_Commitment(): Locator {
    return this.page.locator("(//table)[1]//div[contains(@aria-label,\"Sort by\")]");
  }

  get Hedge_RatioCommitment_List(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Hedge Ratio\"]  ");
  }

  get Individual_Cell_Data_UILocked_Loans(): Locator {
    return this.page.locator("((//span[contains(@class,\"fa fas fa-lock lock-icon\")])[$|count|]//ancestor::tr//td[@data-title][position() >2 and position()!= 4 and position()!= 12])[$|Count|]");
  }

  get Individual_Cell_Data_UITotal_Loans_Tab(): Locator {
    return this.page.locator("(//table[@role='table']//tbody//tr[$|count|]//td[@data-title][position() >2 and position()!= 4and  position()!= 12])[$|Count|]");
  }

  get Individual_Cell_DataCommitted_Loans(): Locator {
    return this.page.locator("((//table)[1]//tbody//tr[$|count|]//td[@data-title][position() >= 3])[$|Count|]");
  }

  get Individual_Cell_ValueClosed_List(): Locator {
    return this.page.locator("(//tr[contains(@class,'row')][$|RowCount|]//td[position() >= 2 and position() <= 14])[$|ColumnCountUI|]");
  }

  get Individual_Chase_Value_Total_LoansPopup(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"$|ChaseFieldNamePopupTotalLoans|\")]/following-sibling::div)[1]");
  }

  get Individual_Chase_ValueTotal_Committed_Loans_Popup(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"$|ChaseFieldNamePopupTotalCommittedLoans|\")]/following-sibling::div)[1]\n");
  }

  get Individual_Column_Data_UI(): Locator {
    return this.page.locator("(//tbody//tr[$|RowCount|]//td[position()=3 or position()=4 or position()=5 or position()=6 or position()=10])[$|ColumnCountUI|]");
  }

  get Individual_Column_Header_Details_Screen_Commitment_List(): Locator {
    return this.page.locator("((//th//div[@role=\"button\"])[position() >=1 and position() <= 12])[$|count|]");
  }

  get Individual_Column_Header_UI_Commitment_List(): Locator {
    return this.page.locator("(//th//div[@role=\"button\"])[$|count|]");
  }

  get Individual_Commitment_IDList_Screen(): Locator {
    return this.page.locator("(//td[@data-title=\"Comm. ID\"]//a)[$|count|]");
  }

  get Individual_Corr_Loan_Num(): Locator {
    return this.page.locator("(//td[@data-title=\"Corr. Loan#\"]//button[1])[$|RowCount|]");
  }

  get Individual_Header_Name_UIClosed_List(): Locator {
    return this.page.locator("((//div[contains(@aria-label,\"Sort by\")])[position() <= 13])[$|Count|]");
  }

  get Individual_Header_Names_UICommitment_List(): Locator {
    return this.page.locator("((//div[contains(@aria-label,\"Sort by\")])[position() != 2 and position() != 10])[$|count|]");
  }

  get Individual_Headers_Commitment_List(): Locator {
    return this.page.locator("((//div[contains(@aria-label,\"Sort by\")])[position() <= 13])[$|Count|]");
  }

  get Individual_Headers_Commitment_ListClosed(): Locator {
    return this.page.locator("((//div[contains(@aria-label,\"Sort by\")])[position() <= 13])[$|Count|]");
  }

  get Individual_Mark_Adjust(): Locator {

    return this.page.locator("//*[contains(@aria-label,\"Select loan\")]/../..//td[@data-title=\"Mark Adj\"]");
  }

    IndividualSetPageSize(count: string ): Locator {
    return this.page.locator(`(//button[contains(@aria-label, \"Set page size to\")])[${count}]`);  
  }

  get Interest_RateCommitment_List(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Int. Rate\"]");
  }

  get Interest_RateHeader_Name(): Locator {
    return this.page.locator("//div[@aria-label=\"Sort by Int. Rate\"]");
  }

  get Last_Commit_Loan_Amount(): Locator {
    return this.page.locator("//td[@data-title=\"Loan Amount\"]");
  }

  get Last_Name_Down_ArrowCommitment_List(): Locator {
    return this.page.locator("//div[contains(text(),\"Last Name\")]//following::span[contains(@class,\"fas small px-1 fa-sort-down\")]");
  }

  get Last_NameCommitment_List(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Last Name\"]");
  }

  get Last_NameHeader_Name(): Locator {
    return this.page.locator("//div[@aria-label=\"Sort by Last Name\"]");
  }

  get LMI_PricePopup_Details(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"LMI_INCENTIVE_PRICE\")]/following-sibling::div)[1]");
  }

  get LMI_TypePopup_Details(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"LMI_TYPE\")]/following-sibling::div)[1]");
  }

  get Loan_AmountCommitment_List(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Loan Amount\"]");
  }

  get Loan_AmountFresh_Committed_Loan(): Locator {
    return this.page.locator("//button[text()=\"$|FreshLoanNumStandard|\"]//ancestor::tr//div[contains(@aria-label,\"Loan amount:\")]");
  }

  get Loan_AmountHeader_Name(): Locator {
    return this.page.locator("//div[@aria-label=\"Sort by Loan Amount\"]");
  }

  get Loan_Details_Text_Popup(): Locator {
    return this.page.locator("//h5[text()=\"Loan Details\"]");
  }

  get Locked_Loans_Rows_CountCommitment_List(): Locator {
    return this.page.locator("//span[contains(@class,\"fa fas fa-lock lock-icon\")]//ancestor::tr[@role=\"row\"]");
  }

  get Mark_AdjCommitment_List(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Mark Adj\"]");
  }

  get Market_ValueCommitment_List(): Locator {
    return this.page.locator("//div[text()=\"Market Value\"]//following-sibling::h5");
  }

  get Market_ValueCommitment_List2(): Locator {
    return this.page.locator("(//div[text()=\"Market Value\"]//following-sibling::h5)[2]");
  }

  get Max_Threshold(): Locator {
    return this.page.locator("(//div[text()=\"Min/Max Threshold\"]//..//span)[2]");
  }

  get Min_Threshold(): Locator {
    return this.page.locator("(//div[text()=\"Min/Max Threshold\"]//..//span)[1]");
  }

  get No_Loans_Last(): Locator {
    return this.page.locator("(//div[text()=\"No. Loans \"]//..//h5)[last()]");
  }

  get No_LoansCommitment_List(): Locator {
    return this.page.locator("//div[text()=\"No. Loans \"]//..//h5");
  }

  get No_ofLoansCommitment_List_Details(): Locator {
    return this.page.locator("//div[normalize-space(text())=\"No. Loans\"]//following-sibling::h5");
  }

  get Open_List_Tab(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Open List\"]]");
  }

  get Product_CodePopup_Details(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"Product Code\")]/following-sibling::div)[1]");
  }

  get Product_NamePopup_Details(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"Product Name\")]/following-sibling::div)[1]");
  }

  get PS_Button_Committed_Loan(): Locator {
    return this.page.locator("//div[@class=\"commit-order\"]//../..//button[contains(text(),'PS')]");
  }

  get Ref_Sec_Price_Commitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Ref Sec Price\"]");
  }

  get Ref_Sec_Prod_Commitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Ref Sec Prod.\"]");
  }

  get Ref_Sec_ProdHeader_Name(): Locator {
    return this.page.locator("//div[@aria-label=\"Sort by Ref Sec Prod.\"]");
  }

  get Reference_Security_PriceCommitment_List(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Ref Sec Price\"]  ");
  }

  get Reference_SecurityCommitment_List(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Ref Sec Prod.\"]");
  }

  get Req_CarrLoan_Num(): Locator {
    return this.page.locator("//h5[text()='$|CommitID|']/ancestor::div[@id=\"accordionHeader\"]/following-sibling::div//tbody//tr//td[@data-title=\"Corr. Loan#\"]//button[contains(text(),'$|CorrespondentLoanNumber|') or contains(text(),\"tes\")]");
  }

  get Req_Committed_First_Loan_NumTotal_Committed_Loans(): Locator {
    return this.page.locator("(//button[contains(@class,\"btn bg-transparent text-primary\")])[1]");
  }

  get Req_Committed_Loan_Num(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]");
  }

  get Req_Loan_NumCommitment_List(): Locator {
    return this.page.locator("//tbody//input[@type=\"checkbox\"]");
  }

  get Required_Chase_Loan_Num(): Locator {
    return this.page.locator("//div[@id=\"accordionHeader\"]//div[text()=\"Commit. ID\"]//following-sibling::h5[text()=\"$|CommitID|\"]//following::div[@class=\"accordion-body\"]//td[@data-title=\"Chase Loan#\"]//div[contains(text(),\"$|ChaseLoanNumber|\")]\n");
  }

  get Required_Record(): Locator {
    return this.page.locator("//tbody//input[@type=\"checkbox\"]");
  }

  get Row_CountClosed_List(): Locator {
    return this.page.locator("//tr[contains(@class,'row')]");
  }

  get Rows_Count_Total_Loans_Tab(): Locator {
    return this.page.locator("//tr[@role=\"row\"]");
  }

  get Search_Cancel_Button(): Locator {
    return this.page.locator("//button[contains(@class,\"search-cancel-btn btn\")]");
  }

  get Search_FieldLon_Details_Popup(): Locator {
    return this.page.locator("//input[@placeholder=\"Search Fields\"]");
  }

  get Second_Bid_Request_IdCommitment_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Bid Request ID\"])[2]");
  }

  get Second_Commit_IDCommitment_List(): Locator {
    return this.page.locator("(//div[text()=\"Commit. ID\"]/following-sibling::h5)[2]");
  }

  get Second_Commit_Time(): Locator {
    return this.page.locator("(//div[text()=\"Commit. Time\"]//following-sibling::h5)[2]");
  }

  get Second_Commit_OrderCommitment_List(): Locator {
    return this.page.locator("(//div[text()=\"Commit. #\"]//following-sibling::h5)[2]");
  }

  get Second_Commitment_IDCommitment_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Comm. ID\"])[2]");
  }

  get Second_Current_Market_Value(): Locator {
    return this.page.locator("(//ancestor::tr//td[@data-title=\"Curr Market Value\"])[2]");
  }

  get Second_Locked_CorrLoanPrice_Offered(): Locator {
    return this.page.locator("((//span[@aria-label=\"Committed loan\"])[2]//ancestor::tr//td[@data-title=\"Corr. Loan#\"]//button)[1]");
  }

  get Second_Locked_CurrGrossCommitment_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Curr Gross\"])[2]");
  }

  get Second_Locked_CurrGrossPrice_Offered(): Locator {
    return this.page.locator("(//span[@aria-label=\"Committed loan\"])[2]//ancestor::tr//td[@data-title=\"Curr Gross\"]");
  }

  get Second_Locked_Gross_PricePrice_Offered(): Locator {
    return this.page.locator("(//span[@aria-label=\"Committed loan\"])[2]//ancestor::tr//td[@data-title=\"Gross Price\"]");
  }

  get Second_Locked_GrossPriceCommitment_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Gross Price\"])[2]");
  }

  get Second_Locked_Hedge_RatioCommitment_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Hedge Ratio\"])[2]");
  }

  get Second_Locked_Hedge_RatioPrice_Offered(): Locator {
    return this.page.locator("(//span[@aria-label=\"Committed loan\"])[2]//ancestor::tr//td[@data-title=\"Hedge Ratio\"]");
  }

  get Second_Locked_Last_NameCommitment_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Last Name\"])[2]");
  }

  get Second_Locked_Last_namePrice_Offered(): Locator {
    return this.page.locator("(//span[@aria-label=\"Committed loan\"])[2]//ancestor::tr//td[@data-title=\"Last Name\"]");
  }

  get Second_Locked_Loan_AmountCommitment_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Loan Amount\"])[2]");
  }

  get Second_Locked_Loan_AmountPrice_Offered(): Locator {
    return this.page.locator("(//span[@aria-label=\"Committed loan\"])[2]//ancestor::tr//td[@data-title=\"Loan Amount\"]");
  }

  get Second_Locked_MarkAdjCommitment_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Mark Adj\"])[2]");
  }

  get Second_Locked_MarkAdjPrice_Offered(): Locator {
    return this.page.locator("(//span[@aria-label=\"Committed loan\"])[2]//ancestor::tr//td[@data-title=\"Mark Adj\"]");
  }

  get Second_Locked_Ref_Sec_ProdPrice_Offered(): Locator {
    return this.page.locator("(//span[@aria-label=\"Committed loan\"])[2]//ancestor::tr//td[@data-title=\"Ref Sec Prod.\"]");
  }

  get Second_Locked_RefSec_PricePriceOffered(): Locator {
    return this.page.locator("(//span[@aria-label=\"Committed loan\"])[2]//ancestor::tr//td[@data-title=\"Ref Sec Price\"]");
  }

  get Second_Locked_RefSecPriceCommitment_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Ref Sec Price\"])[2]");
  }

  get Second_Locked_RefSecProdCommitment_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Ref Sec Prod.\"])[2]");
  }

  get Second_LockedInterest_ratePrice_Offered(): Locator {
    return this.page.locator("(//span[@aria-label=\"Committed loan\"])[2]//ancestor::tr//td[@data-title=\"Int. Rate\"]");
  }

  get Second_Market_Value(): Locator {
    return this.page.locator("(//div[text()=\"Market Value\"]//following-sibling::h5)[2]");
  }

  get Select_All_CheckboxCommitted_List_Page(): Locator {
    return this.page.locator("//input[@aria-label=\"Select all for \" and @type=\"checkbox\"]");
  }

  get Select_All_Loans(): Locator {
    return this.page.locator("(//input[@aria-label=\"Select all for \"])[2]");
  }

  get Select_All_Records(): Locator {
    return this.page.locator("//input[normalize-space(@aria-label)=\"Select all for\" and @type=\"checkbox\"]");
  }

  get Select_Current_Date_Filters_Committed_List(): Locator {
    return this.page.locator("//div[@class=\"ngb-dp-month\"]//div[@aria-label=\"$|CurrentDate|\"]");
  }

  get Select_Loan_Num2(): Locator {
    return this.page.locator("(//tbody//input[@type=\"checkbox\"])[2]");
  }

  get Set_page_size_to_Dropdown(): Locator {
    return this.page.locator("//button[contains(@aria-label, \"Set page size to\")]");
  }

  get Third_Commit_Time_Screen(): Locator {
    return this.page.locator("(//div[text()=\"Commit. Time\"]//following-sibling::h5)[3]");
  }

  get Third_Commit_OrderCommitment_List(): Locator {
    return this.page.locator("(//div[text()=\"Commit. #\"]//following-sibling::h5)[3]");
  }

  get Third_Committed_Corr_Loan(): Locator {
    return this.page.locator("((//span[@aria-label=\"Committed loan\"])[3]//ancestor::tr//td[@data-title=\"Corr. Loan#\"]//button)[1]");
  }

  get Third_Committed_Gross_Price(): Locator {
    return this.page.locator("(//span[@aria-label=\"Committed loan\"])[3]//ancestor::tr//td[@data-title=\"Gross Price\"]");
  }

  get Third_Committed_Hedge_Ratio(): Locator {
    return this.page.locator("(//span[@aria-label=\"Committed loan\"])[3]//ancestor::tr//td[@data-title=\"Hedge Ratio\"]");
  }

  get Third_Committed_Last_Name(): Locator {
    return this.page.locator("(//span[@aria-label=\"Committed loan\"])[3]//ancestor::tr//td[@data-title=\"Last Name\"]");
  }

  get Third_Committed_Loan_Amount(): Locator {
    return this.page.locator("(//span[@aria-label=\"Committed loan\"])[3]//ancestor::tr//td[@data-title=\"Loan Amount\"]");
  }

  get Third_Committed_Loan_Curr_Gross(): Locator {
    return this.page.locator("(//span[@aria-label=\"Committed loan\"])[3]//ancestor::tr//td[@data-title=\"Curr Gross\"]");
  }

  get Third_Committed_Mark_Adj(): Locator {
    return this.page.locator("(//span[@aria-label=\"Committed loan\"])[3]//ancestor::tr//td[@data-title=\"Mark Adj\"]");
  }

  get Third_Committed_Ref_Sec_Price(): Locator {
    return this.page.locator("(//span[@aria-label=\"Committed loan\"])[3]//ancestor::tr//td[@data-title=\"Ref Sec Price\"]");
  }

  get Third_Committed_Ref_Sec_Prod(): Locator {
    return this.page.locator("(//span[@aria-label=\"Committed loan\"])[3]//ancestor::tr//td[@data-title=\"Ref Sec Prod.\"]");
  }

  get Third_Current_Market_Value(): Locator {
    return this.page.locator("(//ancestor::tr//td[@data-title=\"Curr Market Value\"])[3]");
  }

  get Third_Locked_CurrGrossCommitment_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Curr Gross\"])[3]");
  }

  get Third_Locked_GrossCommitment_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Gross Price\"])[3]");
  }

  get Third_Locked_HedgeRatioCommitment_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Hedge Ratio\"])[3]");
  }

  get Third_Locked_Last_NameCommitment_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Last Name\"])[3]");
  }

  get Third_Locked_LoanAmountCommitment_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Loan Amount\"])[3]");
  }

  get Third_Locked_MarAdjCommitment_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Mark Adj\"])[3]");
  }

  get Third_Locked_RefSecPriceCommitment_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Ref Sec Price\"])[3]");
  }

  get Third_Locked_RefSecProdCommitment_List(): Locator {
    return this.page.locator("(//td[@data-title=\"Ref Sec Prod.\"])[3]");
  }

  get Third_Market_ValueCommitment_List(): Locator {
    return this.page.locator("(//div[text()=\"Market Value\"]//following-sibling::h5)[3]");
  }

  get Total_Committed_Loans_Tab(): Locator {
    return this.page.locator("//span[contains(text(),\" Total Committed Loans\")]");
  }

  get Total_LoansCommitment_List(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Total Loans\"]]");
  }

  get Total_Rows_Count_UIFirst_Commitment(): Locator {
    return this.page.locator("(//table)[1]//tbody//tr[@role=\"row\"]");
  }

  get Total_Rows_Count_UITotal_Loans(): Locator {
    return this.page.locator("//tbody//tr[@role=\"row\"]");
  }

  get Uncommit_Selected_Button(): Locator {
    return this.page.locator("//button[@id='commitdropdownMenuButton']");
  }

}