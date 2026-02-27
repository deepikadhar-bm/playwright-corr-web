import { Page, Locator } from '@playwright/test';

/**
 * Page Object: Price Offered
 * Elements: 594
 */
export class PriceOfferedPage {
  constructor(private page: Page) {}
   get  LockSymbolOpen(): Locator {
    return this.page.locator("//span[contains(@class,'lock-open')]");
  }
  get Add_to_Commit_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Add loans to commit\"]");
  }

  get Add_to_Commit_Button_Paste_Loan_Popup(): Locator {
    return this.page.locator("//button[@aria-label=\"Add loans to commit\"]");
  }

  get Add_To_Commit_Dropdown(): Locator {
    return this.page.locator("//button[@id='commitdropdownMenuButton']");
  }

  get All_Bid_Request_ID_Rowsprice_offered_screen1(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"])[position() >=2 and position()<=last()]");
  }

  get All_Bid_Request_IDprice_offered1(): Locator {
    return this.page.locator("//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Bid Req. ID\"]");
  }

  get All_Bid_Request_IDprice_offered2(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Bid Req. ID\"])[$|count|]");
  }

  get All_Bid_Request_ID2price_offered_screen1(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Bid Req. ID\"]/a)[$|count|]");
  }

  get All_Execution_Typeprice_offered_screen1(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Execution Type\"]/div)[$|count|]");
  }

  get All_Loans_Tabprice_offered_screen(): Locator {
    return this.page.locator("//div[@id=\"price-offered-list-tabs\"]/div//span[text()=\"All Loans\"]");
  }

  get All_Loans_PriceofferedPage(): Locator {
    return this.page.locator("//span[text()=\"All Loans\"]");
  }

  get All_UnChecked_Check_Boxprice_offered_screen(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//input[@type=\"checkbox\"])[position()>=2 and position()<=last()]");
  }

  get All_Unchecked_Check_box2price_offered_screen(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//input[@type=\"checkbox\" and not(contains(@aria-label,\"Select all for \"))])[$|count1|]");
  }

  get American_Pacific_Checkbox(): Locator {
    return this.page.locator("//input[@type=\"checkbox\" and contains(@aria-label,\"Select American Pacific\")]");
  }

  get Amount_DeliveredCommitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Request ID\"]//div[normalize-space(text())='$|BidReqId|']//ancestor::tr//td[@data-title=\"Amt. Delivered\"]");
  }

  get Amount_FundedCommitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Request ID\"]//div[normalize-space(text())='$|BidReqId|']//ancestor::tr//td[@data-title=\"Amt. Funded\"]");
  }

  get Amount_Paired_OffCommitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Request ID\"]//div[normalize-space(text())='$|BidReqId|']//ancestor::tr//td[@data-title=\"Amt. Pair-off\"]");
  }

  get Apply_Selected_In_Status(): Locator {
    return this.page.locator("(//button[contains(text(),\" Apply Selected \")])[2]");
  }

  get Auth_Limit(): Locator {
    return this.page.locator("//div[normalize-space(text())=\"Auth Limit:\"]//following-sibling::div");
  }

  get Auth_Limit_All_Loans(): Locator {
    return this.page.locator("//div[normalize-space(text())=\"Auth Limit:\"]/following-sibling::div");
  }

  get Back_To_Commitment_List(): Locator {
    return this.page.locator("//a[contains(text(),\"Commitment List\")]//i[contains(@class,\"fas fa-arrow-left \")]");
  }

  get BackTo_PriceofferedPage(): Locator {
    return this.page.locator("//i[contains(@class,'fa-arrow-left')]");
  }

  get Bid_Id_Chase_Direct(): Locator {
    return this.page.locator("//td[@data-title=\"Execution Type\"]//div[contains(text(),\"CHASE_DIRECT\")]/../..//a");
  }

  get Bid_Id_Not_Freedom(): Locator {
    return this.page.locator("//a[contains(@aria-label, \"View details for price offered\")]\n");
  }

  get Bid_Id_Price_offered(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Status: Price Offered\")]/../..//td[contains(@data-title,\"Bid Req. ID\")]");
  }

  get Bid_Ids(): Locator {
    return this.page.locator("(//a[contains(@aria-label, \"View details for price offered\")])[$|Count1|]");
  }

  get Bid_Loan_Num_Committed_Loans(): Locator {
    return this.page.locator("//button[contains(text(),\"$|BidLoanNumAllLoans|\")]");
  }

  get Bid_Loan_NumLoan_Details_Popup(): Locator {
    return this.page.locator("//div[text()=\"Bid Loan Number\"]//following-sibling::h5");
  }

  get Bid_Loan_Number(): Locator {
    return this.page.locator("//h5[contains(normalize-space(.),\"TestSigma_08-09-2025_SC1_0g_932\")]\n");
  }

  get Bid_Req_Freedom(): Locator {
    return this.page.locator("//a[contains(@aria-label, \"View details for price offered\")]\n");
  }

  get Bid_Req_ID(): Locator {
    return this.page.locator("//div[@aria-label=\"Status: Partially Committed\"]//..//..//a[contains(@aria-label, \"View details for price offered\")]");
  }

  get Bid_Req_Id_other_than_the_given_id_Company_Name_Price_offered_or_Partial(): Locator {
    return this.page.locator("(//tr[td[@data-title=\"Company\"]//div[contains(text(),\"@|Company Name|\")]]//td[@data-title=\"Bid Req. ID\"]//a[not(contains(text(),\"$|Bidreq_ID|\"))]/../..//td[@data-title=\"Status\"]//span[contains(text(),\" Price Offered \") or contains(text(),\" Partially Committed \")]/../../..//td[@data-title=\"Bid Req. ID\"])[1]");
  }

  get Bid_Req_Id_Company_Freedom(): Locator {
    return this.page.locator("//tr[td[@data-title=\"Status\"]//span[contains(text(),'Partially Committed') or contains(text(),'Price Offered')] and td[@data-title=\"Company\"]/div[contains(text(),\"Freedom\")]]/td[@data-title=\"Bid Req. ID\"]");
  }

  get Bid_Req_Id_in_Price_Offered(): Locator {
    return this.page.locator("//div[text()=\"Bid Req. ID\"]//..//h5");
  }

  get Bid_Req_Id_Not_a_Freedom(): Locator {
    return this.page.locator("//tr[td[@data-title=\"Status\"]//span[contains(text(),'Partially Committed')or contains(text(),'Price Offered')]and not(td[@data-title=\"Company\"]/div[contains(text(),\"Freedom\")]) ]/td[@data-title=\"Bid Req. ID\"]");
  }

  get Bid_Req_Id_Price_Offered(): Locator {
    return this.page.locator("//a[contains(@aria-label, \"View details for price offered\")]\n");
  }

  get Bid_Req_IDChase_Direct(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Execution type: CHASE_DIRECT\")]/../..//a[contains(@aria-label,\"View details for price offered \")]");
  }

  get Bid_Req_IdExpire_Popup(): Locator {
    return this.page.locator("//span[@id=\"expirePricingTitle\"]//b");
  }

  get Bid_Req_IdPrice_Offered_Page(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Req. ID\"]//a[contains(text(),\"$|BidReqIdPriceOffered|\")]");
  }

  get Bid_Req_IDPrice_Offered(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Req. ID\"]");
  }

  get Bid_Req_IDStandard(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Execution type: STANDARD\")]/../..//a[contains(@aria-label,\"View details for price offered \")]");
  }

  get Bid_Req_ID1price_offered_standard(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Bid Req. ID\"]/a)[1]");
  }

  get Bid_Req_ID1price_offered(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Bid Req. ID\"]/a)[$|count|]");
  }

  get Bid_Req_ID2price_offered(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Bid Req. ID\"]/a)[$|count|]");
  }

  get Bid_Request_ID(): Locator {
    return this.page.locator("//div[@aria-label=\"Status: Partially Committed\"]//..//..//a[contains(@aria-label,\"View details for price offered\")]");
  }

  get Bid_Request_ID_DropdownCommitment_List_Page(): Locator {
    return this.page.locator("//span[normalize-space(text())=\"Bid Request ID\"]");
  }

  get Bid_Request_ID_Exceution_Type_Both(): Locator {
    return this.page.locator("//tr[td[@data-title=\"Status\"]//div[contains(@aria-label,\"Status: Price Offered\")] and td[@data-title=\"Execution Type\"]//div[(contains(normalize-space(),\"Standard , Chase Direct\"))] ]//td[@data-title=\"Bid Req. ID\"]  ");
  }

  get Bid_Request_ID_Exceution_Type_One(): Locator {
    return this.page.locator("//tr[td[@data-title=\"Status\"]//div[contains(@aria-label,\"Status: Price Offered\")] and td[@data-title=\"Execution Type\"]//div[not(contains(normalize-space(),\"Standard , Chase Direct\"))] ]//td[@data-title=\"Bid Req. ID\"]\n");
  }

  get Bid_Request_Id_Price_Offered(): Locator {
    return this.page.locator("//div[text()=\"Bid Req. ID\"]//..//h5[text()]");
  }

  get Bid_Request_IDCompany_Name_Partial_or_Price_Offered(): Locator {
    return this.page.locator("//tr[.//td[@data-title='Company']//div[normalize-space(text())='@|Company Name|'] and .//td[@data-title='Status']//span[normalize-space(text())='Partially Committed' or normalize-space(text())='Price Offered']]//td[@data-title='Bid Req. ID']");
  }

  get Bid_Request_Idprice_offered(): Locator {
    return this.page.locator("//a[contains(text(),\"$|Bid ID Price Offered|\")]");
  }

  get Bid_Request_IDprice_offered(): Locator {
    return this.page.locator("//div[@id=\"price-offered-details-header\"]//div/div[text()=\"Bid Req. ID\"]/..//h5");
  }

  get Bid_Request_ID1Price_Offered(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Req. ID\"]//a[contains(text(),\"$|BidReqId1|\")]");
  }

  get Bid_Status(): Locator {
    return this.page.locator("//a[contains(text(),\"$|BidReqIdPriceOffered|\")]//ancestor::tr//td[@data-title=\"Status\"]//span[text()[normalize-space() = \"Expired\"]]");
  }

  get Bid_Status_Chase_DirectPrice_Offered_Page(): Locator {
    return this.page.locator("//td[@data-title=\"Execution Type\"]//div[contains(text(),\"CHASE_DIRECT\")]//ancestor::tr//td[@data-title=\"Status\"]");
  }

  get Bid_Status_Price_OfferedExe_Type1(): Locator {
    return this.page.locator("//a[contains(text(),\"$|BidReqIdPriceOffered|\")]//ancestor::tr//td[@data-title=\"Status\"]//span");
  }

  get Bid_Status_StandardPrice_Offered_Page(): Locator {
    return this.page.locator("//td[@data-title=\"Execution Type\"]//div[contains(text(),\"STANDARD\")]//ancestor::tr//td[@data-title=\"Status\"]");
  }

  get Bid_StatusPrice_Offered(): Locator {
    return this.page.locator("//a[contains(text(),\"$|BidReqIdPriceOffered|\")]//ancestor::tr//td[@data-title=\"Status\"]//span");
  }

  get Bid_Value(): Locator {
    return this.page.locator("//div[text()=\"Last Committed Bid: \"]//..//div[@class=\"fw-semibold\"]//span");
  }

  get Bid_ValueActions_Popup(): Locator {
    return this.page.locator("//div[text()=\"Bid Value: \"]//following-sibling::h4");
  }

  get Bid_ValuePrice_Offered_Page(): Locator {
    return this.page.locator("//a[contains(text(),\"$|BidReqIdPriceOffered|\")]//ancestor::tr//td[@data-title=\"Bid Value\"]");
  }

  get Bid_ValuePrice_Offered_Screen(): Locator {
    return this.page.locator("//td[@data-title='Bid Req. ID']/a[normalize-space(text())='$|BidReqIdCommitmentList|']//ancestor::tr//td[@data-title=\"Bid Value\"]");
  }

  get Bid_Value1price_offered_standard(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Bid Value\"]/div)[1]");
  }

  get Bid_Value1price_offered(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Bid Value\"]/div)[$|count|]");
  }

  get BidLoan_Number(): Locator {
    return this.page.locator("//button[contains(@aria-label,\"View loan details\")]");
  }

  get Bidreq_IdPartially_Committed(): Locator {
    return this.page.locator("//tr[td[@data-title=\"Status\"]//span[contains(text(),'Partially Committed')] and td[@data-title=\"Company\"]/div[contains(text(),\"Freedom\")] ]/td[@data-title=\"Bid Req. ID\"]");
  }

  get Bidreq_IDStatus_PartiallyCommittedExec1(): Locator {
    return this.page.locator("//span[contains(text(),\"Partially Committed\")]//ancestor::tr/td/a[contains(@aria-label,\"View details for price offered \")]");
  }

  get BidReqID_2Price_Offered_Screen(): Locator {
    return this.page.locator("//a[normalize-space(text())=\"$|BidReqId2|\"]");
  }

  get BidReqId_Chase_Direct(): Locator {
    return this.page.locator("//td[@data-title=\"Execution Type\"]//div[contains(text(),\"CHASE_DIRECT\")]//ancestor::tr//td[@data-title=\"Bid Req. ID\"]//a[contains(@aria-label,\"View details for\")]");
  }

  get BidReqId_PriceOfferedPage(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Req. ID\"]");
  }

  get BidReqId_Standard(): Locator {
    return this.page.locator("//td[@data-title=\"Execution Type\"]//div[contains(text(),\"STANDARD\")]//ancestor::tr//td[@data-title=\"Bid Req. ID\"]//a[contains(@aria-label,\"View details \")]");
  }

  get BidReqIdChange_Status_Popoup(): Locator {
    return this.page.locator("//span[@id=\"changeStatusTitle\"]//b");
  }

  get BidReqIdLoan_Details_Popup(): Locator {
    return this.page.locator("//div[text()=\"Bid Request ID\"]//following-sibling::h5");
  }

  get BidReqIDPartially_Committed_or_Committed(): Locator {
    return this.page.locator("//tr[td[@data-title=\"Status\"]//span[contains(text(),'Partially Committed') or contains(text(),'Committed')]]/td[@data-title=\"Bid Req. ID\"]");
  }

  get BidReqIDPrice_Offered_Screen(): Locator {
    return this.page.locator("//a[normalize-space(text())=\"$|BidReqIdCommitmentList|\"]");
  }

  get BidReqIdPrice_Offered(): Locator {
    return this.page.locator("//a[contains(text(),\"$|RequestIDDetails|\")]");
  }

  get BidReqIDUncommitment_Page_Popup(): Locator {
    return this.page.locator("//div[contains(@class,\"mb\")]//b");
  }

  get BidReqIdCompanyFreedom(): Locator {
    return this.page.locator("//tr[td[normalize-space(.)='Freedom']  and (td[normalize-space(.)='Price Offered'] or td[normalize-space(.)='Partially Committed'])]//td[@data-title=\"Bid Req. ID\"]");
  }

  get BidReqIdExeType1_PriceOffered(): Locator {
    return this.page.locator("//td[@data-title=\"Execution Type\"]//div[contains(text(),\"$|ExecutionTypePriceOfferedPage|\")]//ancestor::tr//td[@data-title=\"Bid Req. ID\"]");
  }

  get BidReqIdExeType2_PriceOffered(): Locator {
    return this.page.locator("//td[@data-title=\"Execution Type\"]//div[not(contains(text(),\"$|ExecutionTypePriceOfferedPage|\"))]//ancestor::tr//td[@data-title=\"Bid Req. ID\"]");
  }

  get BidRequesIdPartially_or_Committed(): Locator {
    return this.page.locator("//a[contains(text(),\"$|BidRequestID|\")]");
  }

  get BidRequest_IDPriceOffered(): Locator {
    return this.page.locator("//tr[td[@data-title=\"Status\"]//span[contains(text(),' Price Offered ')]]//td[@data-title=\"Bid Req. ID\"]");
  }

  get BidrequestId_ExecutionType2(): Locator {
    return this.page.locator("//tr[td[@data-title=\"Execution Type\"]/div[not(contains(text(),'$|Executiontype|'))]]/td/a[contains(text(),\"$|Bidreq_ID|\")]");
  }

  get BidRequestID_PriceOfferedScreen(): Locator {
    return this.page.locator("//button[contains(text(),\"$|BidReqIdPriceOfferedPage|\")]");
  }

  get BidRequestIdPopup(): Locator {
    return this.page.locator("//div[contains(@class,\"mb\")]//b");
  }

  get BidRequestIDPopupDetails(): Locator {
    return this.page.locator("//div[@class=\"mb-2\"]//b[text()]");
  }

  get BidRequestIDPrice_Offered_New(): Locator {
    return this.page.locator("//a[contains(text(),\"$|BidReqId|\")]");
  }

  get BidRequestIDPrice_Offered(): Locator {
    return this.page.locator("//a[contains(text(),\"$|BidReqIdPriceOffered|\")]");
  }

  get BidRequestIDTextDetails(): Locator {
    return this.page.locator("//div[text()=\"Bid Req. ID\"]//following-sibling::h5");
  }

  get BidValue(): Locator {
    return this.page.locator("//div[text()=\" Bid Value \"]");
  }

  get BidValue_Column(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Value\"]");
  }

  get Birequest_IDPartially_Committed(): Locator {
    return this.page.locator("//tr[td[@data-title=\"Status\"]//span[contains(text(),'Partially Committed')]]//td[@data-title=\"Bid Req. ID\"]");
  }

  get CCode_In_Commitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Request ID\"]//div[normalize-space(text())='$|BidReqId|']//ancestor::tr//td[@data-title=\"CCode\"]");
  }

  get CCode_In_UI(): Locator {
    return this.page.locator("//div[text()=\"CCode\"]//following-sibling::h5");
  }

  get CCodeDetails(): Locator {
    return this.page.locator("//div[text()=\"CCode\"]//following-sibling::h5");
  }

  get CCodePrice_Offered_Page(): Locator {
    return this.page.locator("//a[contains(text(),\"$|BidReqIdPriceOffered|\")]//ancestor::tr//td[@data-title=\"CCode\"]");
  }

  get CCodeprice_offered(): Locator {
    return this.page.locator("//div[@id=\"price-offered-details-header\"]//div/div[text()=\"CCode\"]/..//h5");
  }

  get CCode1price_offered_standard(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"CCode\"]/div)[1]");
  }

  get CCode1price_offered(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"CCode\"]/div)[$|count|]");
  }

  get CCode2price_offered(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"CCode\"]/div)[$|count|]");
  }

  get Change_Status_ButtonPopup(): Locator {
    return this.page.locator("//h5[text()=\"Change Status\"]//ancestor::div//button[@aria-label=\"Change Status\"]");
  }

  get Change_StatusPrice_Offered(): Locator {
    return this.page.locator("//a[contains(text(),\"$|BidReqIdPriceOffered|\")]//ancestor::tr//button[@aria-label=\"Change Status\"]");
  }

  get Chase_Field_Count(): Locator {
    return this.page.locator("//div[@class=\"border-bottom p-2\"]");
  }

  get Chase_Field_Value_Exe_Chase(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and normalize-space((text())=\"$ChaseFieldNamePopupExeChase|\")]/following-sibling::div)[1]");
  }

  get Chase_Field_Value_Exe_Standard(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and normalize-space((text())=\"$|ChaseFieldNamePopupExeStandard|\")]/following-sibling::div)[1]");
  }

  get Chase_Usercommitment_timer(): Locator {
    return this.page.locator("//div/input[@aria-label=\"Internal User Minutes\"]");
  }

  get ChaseFieldValue_Popup(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and normalize-space((text())=\"$|ChaseFieldNamePopup|\")]/following-sibling::div)[1]");
  }

  get ChaseValuePopup_AllLoans(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"$|ChaseFieldNamePopupAllLoans|\")]/following-sibling::div)[1]");
  }

  get Check_Bid_Loan_NumChase_Exe(): Locator {
    return this.page.locator("//tbody//input[@type=\"checkbox\"]");
  }

  get Check_Bid_Loan_NumStandard_Exe(): Locator {
    return this.page.locator("//tbody//tr[not(descendant::button[contains(text(),\"$|CommittedLoanNumChaseDirect|\")])]//input[@type=\"checkbox\"]");
  }

  get Check_Commitments_Status(): Locator {
    return this.page.locator("(//div[normalize-space(text())=\"Select Commitments Status\"]//ancestor::div[contains(@class,\"dropdown\")]//label[@class=\"dropdown-item d-flex\"]//input[@type=\"checkbox\"])[$|RandomNumber|]");
  }

  get Check_Company(): Locator {
    return this.page.locator("(//div[@class=\"dropdown-overflow\"])[1]//input[@type=\"checkbox\"]");
  }

  get Check_Duplicate_Loan_NumChase_Direct(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedLoanNumStandard|\"]/ancestor::tr//input[@type=\"checkbox\"]");
  }

  get Check_Fresh_Loan_NumChase_Direct(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNumStandard|\"]/ancestor::tr//input[@type=\"checkbox\"]");
  }

  get Check_the_Loan_Num(): Locator {
    return this.page.locator("//tbody//input[@type=\"checkbox\"]");
  }

  get Check_Uncommitted_LoanNum2(): Locator {
    return this.page.locator("(//input[contains(@aria-label, \"Select loan\") and @type=\"checkbox\"])[2]");
  }

  get Check_UncommittedLoanNum1(): Locator {
    return this.page.locator("(//input[contains(@aria-label, \"Select loan\") and @type=\"checkbox\"])[1]");
  }

  get Checkbox(): Locator {
    return this.page.locator("//input[@type=\"checkbox\"]");
  }

  get Checked_Checkbox_Count_From_Second_Checkboxprice_offered_screen(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//input[@type=\"checkbox\"])[position()>=3 and position()<=last()]");
  }

  get Checked_Checkbox_Count_From_Second_Checkbox2price_offered_screen(): Locator {
    return this.page.locator("((//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//input[@type=\"checkbox\"])[position()>=3 and position()<=last()])[$|count1|]");
  }

  get Checked_Company(): Locator {
    return this.page.locator("(//div[@class=\"dropdown-overflow\"])[1]//input[@type=\"checkbox\"]//..//span");
  }

  get Checked_Corr_Loan(): Locator {
    return this.page.locator("//tr[contains(@class,\"row\")]//button[contains(@class,\"btn bg-transparent text-primary\")][1]");
  }

  get Checked_Loan_Amount(): Locator {
    return this.page.locator("//tr[@class=\"row-highlight\"]//td[@data-title=\"Loan Amount\"]");
  }

  get Checked_Row(): Locator {
    return this.page.locator("//tr[@class=\"row-highlight\"]");
  }

  get Checked_Row_2(): Locator {
    return this.page.locator("(//tr[@class=\"row-highlight\"])[2]");
  }

  get Checked_Rows_Count(): Locator {
    return this.page.locator("//tr[@class=\"row-highlight\"]");
  }

  get Checked_Status(): Locator {
    return this.page.locator("(//div[@class=\"dropdown-overflow\"])[2]//input[@type=\"checkbox\"]//..//span");
  }

  get Clear_all_ButtonPrice_Offered(): Locator {
    return this.page.locator("//span[@aria-label=\"Clear all filters\"]");
  }

  get Clear_All_In_Filter(): Locator {
    return this.page.locator("//button[text()=\"Clear All\"]");
  }

  get Clear_Search(): Locator {
    return this.page.locator("//button[@aria-label=\"Clear search\"]");
  }

  get Close_ButtonLoan_Details(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Close\"]]");
  }

  get Close_ButtonPasteLoans(): Locator {
    return this.page.locator("//i[contains(@class, 'fa-lg') and contains(@class, 'color-primary') and contains(@class, 'fa-times')]");
  }

  get CloseButtonPopup(): Locator {
    return this.page.locator("//button[@aria-label=\"Close modal\"]");
  }

  get color_text(): Locator {
    return this.page.locator("//div[@class=\"loanPasteTextArea\"]");
  }

  get Column_Count_UIPrice_Offered_Details(): Locator {
    return this.page.locator("//table[@role='table']//tbody//tr[$|count|]//td[@data-title][position() >= 3]");
  }

  get Column_Data_Details_Screen(): Locator {
    return this.page.locator("//td[@data-title=\"$|IndividualHeaderScreenDetails|\"]//div\n");
  }

  get Column_Data_UI(): Locator {
    return this.page.locator("//td[@data-title=\"$|IndividualHeaderUI|\"]//*[not(@aria-label=\"Expiration Date: \")]");
  }

  get Column_Data_UI_Commom_xpath(): Locator {
    return this.page.locator("//td[@data-title=\"$|IndividualHeaderUI|\"]");
  }

  get Column_Header_Data(): Locator {
    return this.page.locator("(//th[@aria-label=\"$|IndividualHeaderScreenDetails|\"])[1]");
  }

  get Column_Headers_Details_ScreenUI(): Locator {
    return this.page.locator("(//th//div[@role=\"button\"])[position() >=1 and position() <= last()]");
  }

  get Columns_Headers(): Locator {
    return this.page.locator("(//th//div[@role=\"button\"])[position() >=1 and position() < last()]");
  }

  get Comm_AmountCommitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Request ID\"]//div[normalize-space(text())='$|BidReqId|']//ancestor::tr//td[@data-title=\"Comm. Amount\"]");
  }

  get Commit_Creation_Cut_Off(): Locator {
    return this.page.locator("//input[@id='externalUserCreationCutOfTime']");
  }

  get Commit_Creation_Time_Standard(): Locator {
    return this.page.locator("//select[@aria-label=\"Dropdown selection\"]");
  }

  get Commit_IDCommitment_List(): Locator {
    return this.page.locator("//div[text()=\"Commit. ID\"]/following-sibling::h5");
  }

  get Commit_Loan_TextPopup(): Locator {
    return this.page.locator("(//li[text()])[2]");
  }

  get Commit_OrderCommitment_List(): Locator {
    return this.page.locator("//div[text()=\"Commit. #\"]/following-sibling::h5");
  }

  get Commit_OrderLatest_Committed_Loan(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNum|\"]//ancestor::tr//div[@class=\"commit-order\"]\n");
  }

  get Commit_Selected_1_Dropdown(): Locator {
    return this.page.locator("//button[@id='commitdropdownMenuButton']");
  }

  get Commit_Selected_Button(): Locator {
    return this.page.locator("//button[@id='commitdropdownMenuButton']");
  }

  get Commit_Selected_Button_Disabledprice_offered(): Locator {
    return this.page.locator("//div[@id=\"page-footer\"]/div//button[@id=\"commitdropdownMenuButton\" and (contains(@class,'disabled') or @disabled)]");
  }

  get Commit_Selected_Count_Footer_Displayprice_offered(): Locator {
    return this.page.locator("//div[@id=\"page-footer\"]/div//button[@id=\"commitdropdownMenuButton\"][@id=\"commitdropdownMenuButton\"]/i/../span");
  }

  get Commit_Selected_Dropdown(): Locator {
    return this.page.locator("//button[@id='commitdropdownMenuButton']");
  }

  get Commit_Selected_Footer_Buttonprice_offered(): Locator {
    return this.page.locator("//div[@id=\"page-footer\"]/div//button[@id=\"commitdropdownMenuButton\"]");
  }

  get Commit_Selected_Loans_Successful_Popup(): Locator {
    return this.page.locator("//div[contains(text(),\"Commitment \")]/..//span/..");
  }

  get Commit_Selected_Loanspopupprice_offered_screen(): Locator {
    return this.page.locator(" //div[@class=\"modal-header\"]//h5[contains(text(), \" Commit Selected Loans \")] ");
  }

  get Commit_Selected_Loans2popup_price_offered_screen(): Locator {
    return this.page.locator("//div[@class=\"modal-body\"]/div\n\n");
  }

  get CommitedOrderStandard(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedLoanNumStandard|\"]//ancestor::tr/td//div[contains(@class,\"commit-order\")]");
  }

  get CommitID(): Locator {
    return this.page.locator("//div[text()='Commit. ID']/..//h5[text()='$|Commitment updated Num|']");
  }

  get Commitment_ID(): Locator {
    return this.page.locator("//span[@class=\"fw-bold\"]");
  }

  get Commitment_ID_2(): Locator {
    return this.page.locator("//tr[td[@data-title=\"Bid Request ID\"]//div[contains(text(),\"$|BidReqIdPriceOffered|\")]]//td[@data-title=\"Comm. ID\"]");
  }

  get Commitment_ID_Chase_Direct(): Locator {
    return this.page.locator("//td[@data-title=\"Execution Type\"]//div[contains(text(),\"CHASE_DIRECT\")]//ancestor::tr//a[contains(@aria-label,\"View details for commitment ID\")]");
  }

  get Commitment_Id_DropdownCommitment_List_Page(): Locator {
    return this.page.locator("//span[normalize-space(text())=\"Commitment ID\"]");
  }

  get Commitment_ID_Standard(): Locator {
    return this.page.locator("//td[@data-title=\"Execution Type\"]//div[contains(text(),\"STANDARD\")]//ancestor::tr//a[contains(@aria-label,\"View details for commitment ID\")]");
  }

  get Commitment_IDCommitment_List_Page_New(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Request ID\"]//div[normalize-space(text())=\"$|BidReqId|\"]//ancestor::tr//td[@data-title=\"Comm. ID\"]//a[contains(@aria-label,\"View details for commitme\")]");
  }

  get Commitment_IdCommitment_List_Screen(): Locator {
    return this.page.locator("//td[@data-title=\"Comm. ID\"]//a[normalize-space(text())=\"$|CommitmentID|\"]");
  }

  get Commitment_IdPrice_Offered(): Locator {
    return this.page.locator("//div[contains(text(),'Commitment')]/span\n");
  }

  get Commitment_ID2Commitment_List_Page(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Request ID\"]//div[normalize-space(text())=\"$|BidReqId2|\"]//ancestor::tr//td[@data-title=\"Comm. ID\"]");
  }

  get Commitment_Order_Dropdown(): Locator {
    return this.page.locator("//div[contains(text(),\"Commitment Order\")]");
  }

  get Commitment_OrderChase_Direct(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNumStandard|\"]//ancestor::tr/td//div[contains(@class,\"commit-order\")]");
  }

  get Commitment_OrderDetails_Screen(): Locator {
    return this.page.locator("//button[text()=\"$|CorrLoanNumAllLoans|\"]//ancestor::tr//div[@class=\"commit-order\"]");
  }

  get Commitment_OrderPrice_Offred(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//div[@class=\"commit-order\"]");
  }

  get Commitment_Page_Bid_Request_ID(): Locator {
    return this.page.locator("//span[text()=\"Bid Request ID\"]");
  }

  get Commitment_updated_Num(): Locator {
    return this.page.locator("//span[@class=\"fw-bold\"]");
  }

  get Commitment_IDCommitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Request ID\"]//div[normalize-space(text())='$|BidReqId|']//ancestor::tr//td[@data-title=\"Comm. ID\"]");
  }

  get CommitmentID(): Locator {
    return this.page.locator("//div[contains(text(),\"$|BidReqIdPriceOffered|\")]/ancestor::tr/td[@data-title=\"Comm. ID\"]");
  }

  get CommitmentID_from_commitmentList(): Locator {
    return this.page.locator("//div[contains(text(), '$|BidReqIdPriceOffered|')]/../..//td[@data-title='Comm. ID']");
  }

  get Committed_Bid_Loan_Number(): Locator {
    return this.page.locator("//div[text()=\"Bid Loan Number\"]//..//h5");
  }

  get Committed_Bid_Req_Id(): Locator {
    return this.page.locator("//tr[td[normalize-space(.)='Committed']]//a");
  }

  get Committed_Corr_LoanLocked_Icon(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//span[@aria-label=\"Committed loan\"]");
  }

  get Committed_Corr_LoanPrice_Offered(): Locator {
    return this.page.locator("//button[contains(@aria-label,\"View loan details for \")]");
  }

  get Committed_CorrLoan(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]");
  }

  get Committed_Curr_GrossPrice_Offered(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Curr Gross\"]");
  }

  get Committed_DateCommitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Request ID\"]//div[normalize-space(text())='$|BidReqId|']//ancestor::tr//td[@data-title=\"Comm. Date\"]");
  }

  get Committed_Gross_PricePrice_Offered(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Gross Price\"]");
  }

  get Committed_Hedge_RatioPrice_Offered(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Hedge Ratio\"]  ");
  }

  get Committed_Interest_RatePrice_Offered(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Int. Rate\"]");
  }

  get Committed_Last_NamePrice_Offered(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Last Name\"]\n ");
  }

  get Committed_Loan(): Locator {
    return this.page.locator("//span[@aria-label=\"Committed loan\"]//..//..//button[contains(@aria-label, \"View loan details for\")]");
  }

  get Committed_Loan_AmountPrice_Offered(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Loan Amount\"]");
  }

  get Committed_Loan_amounts(): Locator {
    return this.page.locator("(//div[contains(@aria-label,\"Locked loan\")]//../..//div[contains(@aria-label,\"Loan amount: \")])[$|count|]");
  }

  get Committed_Loan_icon(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedLoanNumber|\"]//ancestor::tr//span[contains(@aria-label,\"Committed loan\")]");
  }

  get Committed_Loan_ID(): Locator {
    return this.page.locator("//tr[@class=\"row-highlight\"]/.//button[contains(@aria-label,\"View loan details\")]");
  }

  get Committed_Loan_Lock_iconDetail_Screen(): Locator {
    return this.page.locator("//button[text()=\"$|CorrLoanNumAllLoans|\"]//ancestor::tr//span[contains(@class,\"fa fas fa-lock lock-icon\")]");
  }

  get Committed_Loan_Locked_Icon(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNumStandard|\"]//ancestor::tr//span[@aria-label=\"Committed loan\"]");
  }

  get Committed_Loan_Num(): Locator {
    return this.page.locator("//tr[td[@data-title=\"Status\"]//span[contains(text(),'Partially Committed') or contains(text(),'Committed') and not(contains(text(),\"Expired\"))]]/td[@data-title=\"Bid Req. ID\"]");
  }

  get Committed_Loan_NumChase_Direct(): Locator {
    return this.page.locator("//div[@aria-label=\"Locked loan\"]//ancestor::tr//div[contains(@aria-label,\"Loan actions\")]");
  }

  get Committed_Loan_NumChase(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNumStandard|\"]");
  }

  get Committed_Loan_NumLatest(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNum|\"]");
  }

  get Committed_Loan_NumPrice_Offered_Page(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]");
  }

  get Committed_Loan_NumStandard(): Locator {
    return this.page.locator("//span[@aria-label=\"Committed loan\"]//ancestor::tr//button[contains(@aria-label,\"View loan details\")]");
  }

  get Committed_Loan_Value(): Locator {
    return this.page.locator("//td[@data-title]//input[@type=\"checkbox\"]//../..//td[@data-title=\"Loan Amount\"]");
  }

  get Committed_Loans(): Locator {
    return this.page.locator("//span[@aria-label=\"Committed loan\"]");
  }

  get Committed_Mar_AdjPrice_Offered(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Mark Adj\"]");
  }

  get Committed_Reference_Security_PricePrice_Offered(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Ref Sec Price\"]  ");
  }

  get Committed_Reference_SecurityPrice_Offered(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//td[@data-title=\"Ref Sec Prod.\"]");
  }

  get Committed_StatusPrice_Offered_List(): Locator {
    return this.page.locator("//a[contains(text(),\"$|BidReqIdPriceOffered|\")]//ancestor::tr//td[@data-title=\"Status\"]//span[text()[normalize-space() = \"Committed\"]]");
  }

  get CommittedLoan_Locked_Icon(): Locator {
    return this.page.locator("(//span[@aria-label=\"Committed loan\"])[$|count|]");
  }

  get CommittedLoansCount(): Locator {
    return this.page.locator("//div[@aria-label=\"Locked loan\"]");
  }

  get CommLoans_Commitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Request ID\"]//div[normalize-space(text())='$|BidReqId|']//ancestor::tr//td[@data-title=\"Comm. Loans\"]");
  }

  get Company_CCodePrice_Offered_Screen(): Locator {
    return this.page.locator("//td[@data-title='Bid Req. ID']/a[normalize-space(text())='$|BidReqId|']//ancestor::tr//td[@data-title=\"CCode\"]");
  }

  get Company_Count_In_Filters(): Locator {
    return this.page.locator("(//div[@class=\"dropdown-overflow\"])[1]//input[@type=\"checkbox\"]\n");
  }

  get Company_Filter_ChipPrice_Offered_Page(): Locator {
    return this.page.locator("//div[@class=\"pill rounded-pill relative\" and contains(@aria-label,\"Chip Company\")]");
  }

  get Company_In_Commitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Request ID\"]//div[normalize-space(text())='$|BidReqId|']//ancestor::tr//td[@data-title=\"Company\"]");
  }

  get Company_Name_Count(): Locator {
    return this.page.locator("//td[@data-title=\"Company Name\"]");
  }

  get Company_NameActions_Popup(): Locator {
    return this.page.locator("//div[text()=\"Company: \"]//following-sibling::h4");
  }

  get Company_NameDetails(): Locator {
    return this.page.locator("//div[text()=\"Company\"]//following-sibling::h5");
  }

  get Company_NamePrice_Offered_Page(): Locator {
    return this.page.locator("//a[contains(text(),\"$|BidReqIdPriceOffered|\")]//ancestor::tr//td[@data-title=\"Company\"]\n ");
  }

  get Company_NamePrice_Offered_Screen(): Locator {
    return this.page.locator("//td[@data-title='Bid Req. ID']/a[normalize-space(text())='$|BidReqId|']//ancestor::tr//td[@data-title='Company']");
  }

  get Company_NamePrice_Offered(): Locator {
    return this.page.locator("//td[@data-title=\"Company\"]");
  }

  get Company_NamePriceoffered(): Locator {
    return this.page.locator("//h5[@class=\"text-nowrap\"]");
  }

  get Companyprice_offered(): Locator {
    return this.page.locator("//div[@id=\"price-offered-details-header\"]//div/div[text()=\"Company\"]/..//h5");
  }

  get Company1price_offered_standard(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Company\"]/div)[1]");
  }

  get Company1price_offered(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Company\"]/div)[$|count|]");
  }

  get Company2price_offered(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Company\"]/div)[$|count|]");
  }

  get Corr_Loan_Down_Arrow_Sort(): Locator {
    return this.page.locator("//div[text()=\" Corr. Loan# \"]/..//span[@class=\"fas small px-1 fa-sort-down\"]");
  }

  get Corr_Loan_NumDetails_Screen(): Locator {
    return this.page.locator("(//tbody//tr[$|count|]//td[@data-title=\"Corr. Loan#\"]//button)[1]");
  }

  get Corr_Loan_Number_ID(): Locator {
    return this.page.locator("//button[contains(@aria-label,\"View loan details\")]");
  }

  get Corr_Loan_price_offered_table(): Locator {
    return this.page.locator("(//div[@aria-label=\"Locked loan\"]/ancestor::tr//button[contains(@aria-label,\"View loan details\")])[$|count|]");
  }

  get Corr_Loan1(): Locator {
    return this.page.locator("//button[contains(@aria-label,\"View loan details for TestSigma_08-09-2025_SC1_0g_932\")]\n");
  }

  get Count_Bid_Id(): Locator {
    return this.page.locator("//td//a[@role=\"button\"]");
  }

  get Count_of_Selected_Loans(): Locator {
    return this.page.locator("//tr[@class=\"row-highlight\"]//*[contains(@aria-label, \"Loan amount:\")]");
  }

  get Count_Of_Unlocked_Loans(): Locator {
    return this.page.locator("//input//ancestor::tr//td[@data-title=\"Loan Amount\"]");
  }

  get Couponprice_offered(): Locator {
    return this.page.locator("//div[@id=\"price-offered-details-header\"]//div/div[text()=\"Coupon\"]/..//h5");
  }

  get Cross_Symbolpopup_price_offered_screen(): Locator {
    return this.page.locator("(//button[@type=\"button\"]/i)[3]");
  }

  get cs11(): Locator {
    return this.page.locator("(//div[normalize-space(text())=\"Select Commitments Status\"]//ancestor::div[contains(@class,\"dropdown\")]//label[@class=\"dropdown-item d-flex\"]//input[@type=\"checkbox\"])");
  }

  get Curr_Gross_Values(): Locator {
    return this.page.locator("(//td[contains(@data-title, \"Curr\")])[$|Count1|]");
  }

  get Curr_Grossprice_offered_screen_table(): Locator {
    return this.page.locator(" (//table//td[@data-title=\"Curr Gross\"])[$|count1|]");
  }

  get Curr_Grossprice_offered_table(): Locator {
    return this.page.locator("(//div[@aria-label=\"Locked loan\"]/ancestor::tr//div[contains(@aria-label, \"Current gross price\")])[$|count|]");
  }

  get Current_Gross_Price_Committed_Laon(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNumStandard|\"]//ancestor::tr/td/div[contains(@aria-label,\"Current gross price:\")]");
  }

  get Current_Gross_PriceDetails_Screen(): Locator {
    return this.page.locator("//tbody//tr[$|count|]//td[@data-title=\"Curr Gross\"]");
  }

  get Current_GrossHeader_Name(): Locator {
    return this.page.locator("//div[@aria-label=\"Sort by Curr Gross\"]");
  }

  get Current_Market_Diffprice_offered(): Locator {
    return this.page.locator("//div[@id=\"price-offered-details-header\"]//div/div[text()=\"Current Market Diff\"]/..//h5");
  }

  get Current_Market_Difference(): Locator {
    return this.page.locator("//div[contains(text(),\"Current Market Diff\")]/..//h5");
  }

  get Current_Market_ValueDetails_Screen(): Locator {
    return this.page.locator("//div[contains(text(),\"Current Market\")]//following-sibling::h5");
  }

  get Current_Marketprice_offered(): Locator {
    return this.page.locator("//div[@id=\"price-offered-details-header\"]//div/div[text()=\"Current Market\"]/..//h5");
  }

  get CutOff_Time_Input(): Locator {
    return this.page.locator("//input[@id='commitCreationCutOffTime']");
  }

  get CutOff_Time_selection_Dropdown(): Locator {
    return this.page.locator("//div[text()=\"Comm. Cut Off\"]//..//select");
  }

  get Data_Table_No_ResultsPrice_Offered(): Locator {
    return this.page.locator("//td[@role=\"cell\" and text()=\" No result \"]");
  }

  get Date_Filter_ChipPrice_Offered_Page(): Locator {
    return this.page.locator("//div[@class=\"pill rounded-pill relative\" and contains(@aria-label,\"Chip Date\")]");
  }

  get Date_Price_Offered(): Locator {
    return this.page.locator("//a[contains(text(),\"$|BidReqIdPriceOffered|\")]//ancestor::tr//td[@data-title=\"Date Price Offered\"]");
  }

  get Date_Price_Offered1price_offered_standard(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Date Price Offered\"]/div)[1]");
  }

  get Date_Price_Offered1price_offered(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Date Price Offered\"]/div)[$|count|]");
  }

  get Date_Price_Offered2price_offered(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Date Price Offered\"]/div)[$|count|]");
  }

  get Date_VErification(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Requested Date:\")]");
  }
   get CommitedDateVerification(): Locator {
    return this.page.locator("//div[contains(@aria-label,'Committed Date:')]");
  }

  get DatePrice_Offered_Screen(): Locator {
    return this.page.locator("//td[@data-title='Bid Req. ID']/a[normalize-space(text())='$|BidReqId|']//ancestor::tr//td[@data-title=\"Date Price Offered\"]");
  }

  get Deferred_Radio_Button(): Locator {
    return this.page.locator("//label[normalize-space(text())=\"Deferred\"]/..//input[@name=\"pricingMode\" and @type=\"radio\"]");
  }

  get Download_File(): Locator {
    return this.page.locator("//a[normalize-space(text())=\"Download File\"]");
  }

  get Dropdown_Commitment_ID_Bid_Request_ID(): Locator {
    return this.page.locator("//div[contains(@class, 'popover-body')]/ul[1]/li[3]/a[1]");
  }

  get Dropdown_Search_Show_All(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Show All\"]]");
  }

  get Duplicate_Loan(): Locator {
    return this.page.locator("//div[text()=\"Duplicate Loan # \"]");
  }

  get Duplicate_Loan_NumStandard(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedLoanNumStandard|\"]");
  }

  get Duplicate_Loan_Text_Under_Errors(): Locator {
    return this.page.locator("//div[text()=\"Duplicate Loan # \"]");
  }

  get Duplicate_Loanerrors_found_popup(): Locator {
    return this.page.locator("//div//div[contains(text(),\"Duplicate Loan\")]/../hr/..//div//div");
  }

  get Duplicate_Loantext_box_popup(): Locator {
    return this.page.locator("//div[@role=\"textbox\"]/span[contains(text(),\"$|CommittedLoanNumber(errors found popup)|\")]");
  }

  get Eceution_Type_Price_Offered_Details(): Locator {
    return this.page.locator("//div[@id=\"price-offered-details-header\"]//div[text()=\"Execution Type\"]/..//h5");
  }

  get Edit_Map_Button(): Locator {
    return this.page.locator("//td[@role=\"cell\"]//input[@type=\"checkbox\"]//..//..//button[contains(@aria-label,\"Edit Map\")]");
  }

  get Enabled_Loan_Numbers_In_Price_Offered(): Locator {
    return this.page.locator("//button[contains(@aria-label,\"View loan details\")]");
  }

  get Entered_Bid_Mapping_Id_New(): Locator {
    return this.page.locator("//span[contains(text(),\"@|BidMappingIDNew|\")]");
  }

  get Error_Found_Text(): Locator {
    return this.page.locator("//h5[contains(normalize-space(.), \"Errors Found\")]\n");
  }

  get Error_message(): Locator {
    return this.page.locator("//h5[contains(@class,\"text-danger mb\")]");
  }

  get Errors_CheckLoan_Details_Popup(): Locator {
    return this.page.locator("//div[text()=\"Errors Check\"]//following-sibling::h5");
  }

  get Errors_Found_Loan_error(): Locator {
    return this.page.locator("//h5[text()[normalize-space() = \"1 Errors Found\"]]");
  }

  get Execution_type_Price_Offered(): Locator {
    return this.page.locator("//div[@id=\"price-offered-details-header\"]//*[text()=\"Execution Type\"]/..//h5");
  }

  get Execution_Type_In_Screen(): Locator {
    return this.page.locator("//a[contains(text(),\"$|BidReqIdPriceOffered|\")]//ancestor::tr//td[@data-title=\"Execution Type\"]\n ");
  }

  get Execution_TypeCommitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Request ID\"]//div[normalize-space(text())='$|BidReqId|']//ancestor::tr//td[@data-title=\"Execution Type\"]");
  }

  get Execution_TypeDetails(): Locator {
    return this.page.locator("//div[text()=\"Execution Type\"]//following-sibling::h5");
  }

  get Execution_TypePrice_Offered_Screen(): Locator {
    return this.page.locator("//td[@data-title='Bid Req. ID']/a[normalize-space(text())='$|BidReqId|']//ancestor::tr//td[@data-title=\"Execution Type\"]");
  }

  get Execution_Typeprice_offered_screen2(): Locator {
    return this.page.locator("//div/div[text()=\"Execution Type\"]/../h5");
  }

  get Execution_TypePrice_Offered(): Locator {
    return this.page.locator("//div[text()=\"Execution Type\"]//following-sibling::h5");
  }

  get Execution_Type1price_offered(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"])[2]//td[@data-title=\"Execution Type\"]/div");
  }

  get Executiontype(): Locator {
    return this.page.locator("//div[text()='Execution Type']/..//h5[text()='STANDARD']");
  }

  get ExecutionType_From_PriceOffered(): Locator {
    return this.page.locator("//td[@data-title=\"Execution Type\"]");
  }

  get Executiontypepartially_committed(): Locator {
    return this.page.locator("//div[text()=\"Execution Type\"]//following-sibling::h5");
  }

  get Expiration_DateCommitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Bid Request ID\"]//div[normalize-space(text())='$|BidReqId|']//ancestor::tr//td[@data-title=\"Expiration Date\"]");
  }

  get Expire_Pricing_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Expire Pricing\"]//span");
  }

  get Expire_Pricing_ButtonPrice_Offered(): Locator {
    return this.page.locator("//a[contains(text(),\"$|BidReqIdPriceOffered|\")]//ancestor::tr//button[@aria-label=\"Expire Pricing\"]//span");
  }

  get Export_Selected_Count(): Locator {
    return this.page.locator("//button[not(@disabled)]//span[contains(normalize-space(),'Export Selected')]//following-sibling::span");
  }

  get Filter_Dropdown1(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Filter\"]]");
  }

  get Filtered_Company_NameChip(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Company:\")]");
  }

  get Filtered_In_Status(): Locator {
    return this.page.locator("//div[contains(@aria-label, \"Chip Status:\")]");
  }

  get Filtered_Status(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Status:\") and @role=\"listitem\"]");
  }

  get First_bid_id(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Bid Req. ID\"]/a)[1]");
  }

  get First_Bid_Req_IDprice_offered_first_screen(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Bid Req. ID\"]/a)[1]");
  }

  get First_Bid_Req_IdPrice_Offered_or_Partially_Commited(): Locator {
    return this.page.locator("//tr[td[@data-title=\"Status\"]//span[contains(text(),'Partially Committed') or contains(text(),'Price Offered')]]/td[@data-title=\"Bid Req. ID\"]");
  }

  get First_Chase_Field_Name(): Locator {
    return this.page.locator("//div[text()=\"Chase Field Name\"]    /ancestor::div[2]     //div[@class=\"apply-grid\"]     //div[@class=\"border-bottom p-2\"]");
  }

  get First_Check_Boxprice_offered_screen(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\" and contains(@aria-label,\"Select loan\")])[1]");
  }

  get First_Column_Data_UI(): Locator {
    return this.page.locator("(//td[@data-title=\"$|IndividualHeaderUI|\"])[1]");
  }

  get First_Comitted_loan_Number(): Locator {
    return this.page.locator("//td//span[@aria-label=\"Committed loan\"]/../..//td[@data-title=\"Corr. Loan#\"]");
  }

  get First_Loan_Num_Price_offered(): Locator {
    return this.page.locator("(//input[contains(@aria-label,\"Select loan\")]/../..//td[@data-title=\"Corr. Loan#\"]/div/button)[1]");
  }

  get First_UnLocked_Loan_Corr_Number(): Locator {
    return this.page.locator("//input[@type='checkbox']/ancestor::tr//td//button");
  }

  get Freedom_A4187(): Locator {
    return this.page.locator("//span[@title=\"Freedom (A4187)\"]");
  }

  get Freedom_Checkbox(): Locator {
    return this.page.locator("//input[@type=\"checkbox\" and contains(@aria-label,\"Select Freedom\")]");
  }

  get Fresh_Loan_Num_Price_Offered_after_Error_check(): Locator {
    return this.page.locator("//input[contains(@aria-label,\"Select loan\")]/../..//td[@data-title=\"Corr. Loan#\"]/div/button[text()=\"$|FreshLoanNumber(price offered table)|\"]");
  }

  get Fresh_Loantext_box_popup(): Locator {
    return this.page.locator("//div[@class=\"loanPasteTextArea\"]");
  }

  get FTHB_TS_082225_1000DEE01sep3_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"View loan details for FTHB_TS_082225_1000-DEE-01-sep3\"]");
  }

  get Get_Price_Buttonprice_offered(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Get Price\"]]");
  }

  get Get_Price_Button(): Locator {
    return this.page.locator("//button[normalize-space(text())=\"Get Price\"]");
  }

  get Go_to_Previous_Page(): Locator {
    return this.page.locator("//button[@aria-label=\"Go to Previous Page\"  and @aria-disabled=\"true\"]");
  }

  get Gross_Price_Committed_Loan(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNumStandard|\"]//ancestor::tr/td/div[contains(@aria-label,\"Gross price:\")]");
  }

  get Gross_price_Values(): Locator {
    return this.page.locator("(//div[contains(@aria-label, \"Gross price\")])[$|Count1|]");
  }

  get Gross_Price_Values_Count(): Locator {
    return this.page.locator("//div//ancestor::tr//td[@data-title=\"Gross Price\"]");
  }

  get Gross_PriceDetails_Screen(): Locator {
    return this.page.locator("//tbody//tr[$|count|]//td[@data-title=\"Gross Price\"]");
  }

  get Gross_PriceHeader_Name(): Locator {
    return this.page.locator("//div[@aria-label=\"Sort by Gross Price\"]");
  }

  get Gross_Priceprice_offered_screen_table(): Locator {
    return this.page.locator("( //table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Gross Price\"]/div)[$|count1|]");
  }

  get Gross_Priceprice_offered_table(): Locator {
    return this.page.locator("(//div[@aria-label=\"Locked loan\"]/ancestor::tr//div[contains(@aria-label, \"Gross price\")])[$|count|]");
  }

  get Header_Names_UI(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Sort by\")]");
  }

  get Header_Sort_Down_Symbol(): Locator {
    return this.page.locator("//span[contains(@class, 'small') and contains(@class, 'fa-sort-down')]");
  }

  get Header_Sort_Up_Symbol(): Locator {
    return this.page.locator("//span[contains(@class, 'small') and contains(@class, 'fa-sort-up')]");
  }

  get Headers(): Locator {
    return this.page.locator("(//div[@role=\"button\"])[$|indexExcel|]");
  }

  get Headers_UI(): Locator {
    return this.page.locator("(//div[contains(@aria-label,\"Sort by\")])[position() <= 8]");
  }

  get Hedge_Ratio_Committed_Loan(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNumStandard|\"]//ancestor::tr/td/div[contains(@aria-label,\"Hedge ratio:\")]");
  }

  get Hedge_Ratio_Value(): Locator {
    return this.page.locator("//span[contains(@aria-label,\"Committed loan\")]/../..//div[contains(@aria-label,\"Hedge ratio:\")]");
  }

  get Hedge_RatioDetails_Screen(): Locator {
    return this.page.locator("//tbody//tr[$|count|]//td[@data-title=\"Hedge Ratio\"]");
  }

  get Hedge_RatioHeader_Name(): Locator {
    return this.page.locator("//div[@aria-label=\"Sort by Hedge Ratio\"]");
  }

  get Hedge_Ratioprice_offered_screen_table(): Locator {
    return this.page.locator("( //table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Hedge Ratio\"]/div)[$|count1|]");
  }

  get Hedge_Ratioprice_offered_table(): Locator {
    return this.page.locator("(//div[@aria-label=\"Locked loan\"]/ancestor::tr//div[contains(@aria-label, \"Hedge ratio\")])[$|count|]");
  }

  get Individual_Bid_Request_Ids(): Locator {
    return this.page.locator("(//a[contains(@aria-label, \"View details for price offered\")])[$|Count|]\n");
  }

  get Individual_Cell_Data_UI(): Locator {
    return this.page.locator("(//table[@role='table']//tbody//tr[$|count|]//td[@data-title][position() >= 3])[$|Count|]");
  }

  get Individual_Cell_UI(): Locator {
    return this.page.locator("(//tbody//tr[$|RowCountUI|]//td)[$|ColumnCountUI|]");
  }

  get Individual_Column_Header_Details_Locked_Loans(): Locator {
    return this.page.locator("((//th//div[@role=\"button\"])[position() >=1 and position() <= 10])[$|Count|]");
  }

  get Individual_Column_Header_Details_Screen(): Locator {
    return this.page.locator("((//th//div[@role=\"button\"])[position() >=1 and position() <= 10])[$|count|]");
  }

  get Individual_Column_Header_UI(): Locator {
    return this.page.locator("((//th//div[@role=\"button\"])[position() >=1 and position() <= 13])[$|count|]");
  }

  get Individual_Header_Name_UI(): Locator {
    return this.page.locator("(//div[contains(@aria-label,\"Sort by\")])[$|count|]");
  }

  get Individual_Headers(): Locator {
    return this.page.locator("((//div[contains(@aria-label,\"Sort by\")])[position() <= 8])[$|Count|]");
  }

  get Individual_ID(): Locator {
    return this.page.locator("(//td//a[@role=\"button\"])[$|Count|]");
  }

  get Individual_Loan_AmountPrice_Offered(): Locator {
    return this.page.locator("(//td[@data-title=\"Loan Amount\"])[$|count|]");
  }

  get Individual_Loan_Num_Price_Offered(): Locator {
    return this.page.locator("(//button[contains(@aria-label,\"View loan details\")])[$|count|]");
  }

  get Individual_Loans_AmountPrice_Offered_Details(): Locator {
    return this.page.locator("(//input//ancestor::tr//td[@data-title=\"Loan Amount\"])[$|count|]");
  }

  get Individual_Mark_Adj_New(): Locator {
    return this.page.locator("(//td[@data-title=\"Mark Adj\"])[$|count|]");
  }

  get Individual_Mark_Adj_Value_Commited_Loans(): Locator {
    return this.page.locator("(//*[contains(@aria-label,\"Committed loan\")]/../..//td[@data-title=\"Mark Adj\"]//div)[$|Count|]");
  }

  get individual_new_mark_adj(): Locator {
    return this.page.locator("(//td[@data-title=\"Mark Adj\"])[$|Count1|]");
  }

  get Individual_Status(): Locator {
    return this.page.locator("(//div[@role=\"status\"]//span)[$|Count1|]");
  }

  get Individual_Status_In_Filters(): Locator {
    return this.page.locator("((//div[@class=\"dropdown-overflow\"])[2]//input[@type=\"checkbox\"]//..//span)[$|count|]");
  }

  get Individual_UI_Details(): Locator {
    return this.page.locator("(//div[@role=\"text\"])[$|count|]");
  }

  get IndividualCompany(): Locator {
    return this.page.locator("(//td[@data-title=\"Company\"])[$|count|]");
  }

  get Int_Rateprice_offered_screen_table(): Locator {
    return this.page.locator("( //table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Int. Rate\"])[$|count1|]");
  }

  get Int_Rateprice_offered_table(): Locator {
    return this.page.locator("(//div[@aria-label=\"Locked loan\"]/ancestor::tr//div[contains(@aria-label, \"Interest rate\")])[$|count|]");
  }

  get Interest_Rate_Committed_Loan(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNumStandard|\"]//ancestor::tr/td/div[contains(@aria-label,\"Interest rate:\")]");
  }

  get Interest_rateDetails_Screen(): Locator {
    return this.page.locator("//tbody//tr[$|count|]//td[@data-title=\"Int. Rate\"]");
  }

  get Items_Selected(): Locator {
    return this.page.locator("//span[contains(@aria-label, \"items selected\")]");
  }

  get Last_Committed_Bid(): Locator {
    return this.page.locator("//div[normalize-space(text())=\"Last Committed Bid:\"]/following-sibling::div");
  }

  get Last_Committed_Bid_2(): Locator {
    return this.page.locator("//div[normalize-space(text())=\"Last Committed Bid:\"]/following-sibling::div");
  }

  get Last_Committed_Bid_LoanAmount(): Locator {
    return this.page.locator("//div[contains(text(),\"Last Committed Bid:\")]//following::span[1]");
  }

  get Last_Name_Button(): Locator {
    return this.page.locator("//div[@aria-label=\"Sort by Last Name\"]");
  }

  get Last_Name_Committed_Loan(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNumStandard|\"]//ancestor::tr/td/div[contains(@aria-label,\"Last name:\")]");
  }

  get Last_Name_Down_Arrow_Sort(): Locator {
    return this.page.locator("//div[text()=\" Last Name \"]/..//span[@class=\"fas small px-1 fa-sort-down\"]");
  }

  get Last_Name_Down_ArrowDetails(): Locator {
    return this.page.locator("//div[contains(text(),\"Last Name\")]//following::span[contains(@class,\"fas small px-1 fa-sort-down\")]");
  }

  get Last_NameDetails_Screen(): Locator {
    return this.page.locator("//tbody//tr[$|count|]//td[@data-title=\"Last Name\"]");
  }

  get Last_Nameprice_offered_screen_table(): Locator {
    return this.page.locator("(//table//td[@data-title=\"Last Name\"]/div)[$|count1|]");
  }

  get Last_Nameprice_offered_table(): Locator {
    return this.page.locator("(//div[@aria-label=\"Locked loan\"]/ancestor::tr//div[contains(@aria-label, \"Last name\")])[$|count|]");
  }

  get Latest_Committed_LoanLocked_Icon(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedCorrLoan|\"]//ancestor::tr//span[@aria-label=\"Committed loan\"]");
  }

  get Loan_Amount_Commited_Loan(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedLoanNumStandard|\"]//ancestor::tr/td/div[contains(@aria-label,\"Loan amount:\")]");
  }

  get Loan_Amount_Committed_Loan(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNumStandard|\"]//ancestor::tr/td/div[contains(@aria-label,\"Loan amount:\")]");
  }

  get Loan_Amount_Down_Arrow_Sort(): Locator {
    return this.page.locator("//div[text()=\" Loan Amount \"]/..//span[@class=\"fas small px-1 fa-sort-down\"]");
  }

  get Loan_amount_For_First_Selected_Check_Boxprice_offered_screen(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\" and contains(@aria-label,\"Select loan\")]/../..//td[@data-title=\"Loan Amount\"])[1]");
  }

  get Loan_Amount_From_Second_Checked_Checkboxprice_offered(): Locator {
    return this.page.locator("((//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//input[@type=\"checkbox\"])[position()>=3 and position()<=last()])[$|count1|]/../..//td[@data-title=\"Loan Amount\"]");
  }

  get Loan_Amount_Only_Selected_Check_Boxprice_offered_screen(): Locator {
    return this.page.locator("(//input[@type=\"checkbox\" and contains(@aria-label,\"Select loan\")]/../..//td[@data-title=\"Loan Amount\"])[$|count1|]");
  }

  get Loan_AmountDetails_Screen(): Locator {
    return this.page.locator("//tbody//tr[$|count|]//td[@data-title=\"Loan Amount\"]");
  }

  get Loan_AmountDuplicate_Loan_Num(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedLoanNumStandard|\"]//ancestor::tr//td[@data-title=\"Loan Amount\"]");
  }

  get Loan_AmountFresh_Loan_Num(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNumStandard|\"]//ancestor::tr//div[contains(@aria-label,\"Loan amount:\")]");
  }

  get Loan_Amountprice_offered_screen_table(): Locator {
    return this.page.locator("(//table//td[@data-title=\"Loan Amount\"]/div)[$|count1|]");
  }

  get Loan_Amountprice_offered_table(): Locator {
    return this.page.locator("(//div[@aria-label=\"Locked loan\"]/ancestor::tr//div[contains(@aria-label, \"Loan amount\")])[$|count|]");
  }

  get Loan_Amount1AllLoans(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNum1|\"]/ancestor::tr//div[contains(@aria-label,\"Loan amount:\")]");
  }

  get Loan_Amount2AllLoans(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNum2|\"]/ancestor::tr//div[contains(@aria-label,\"Loan amount:\")]");
  }

  get Loan_Checkbox(): Locator {
    return this.page.locator("//input[contains(@aria-label, \"Select loan\") and @type=\"checkbox\"]");
  }

  get Loan_Checkbox2(): Locator {
    return this.page.locator("(//input[contains(@aria-label, \"Select loan\") and @type=\"checkbox\"])[position() <=2]");
  }

  get Loan_Num_Required_Last_Name(): Locator {
    return this.page.locator("(//div[contains(@aria-label,\"Last name\") and contains(text(),\"$|Last Name|\")])/../..//td[@data-title=\"Corr. Loan#\"]//button[contains(@aria-label,\"View loan details\")]");
  }

  get Loan_Number_Text(): Locator {
    return this.page.locator("//span[@class=\"error-loan\"]");
  }

  get Loan_Number_Text_Paste_Loan_Popup(): Locator {
    return this.page.locator("//span[@class=\"error-loan\"]");
  }

  get Loan_Numberprice_offered_screen_table(): Locator {
    return this.page.locator("(//table//td[@data-title=\"Corr. Loan#\"]/div)[$|count1|]");
  }

  get Loan_Numbers_Expect_the_Current_Loan(): Locator {
    return this.page.locator("(//button[contains(@aria-label,\"View loan details\")])[not(position()=$|count|)]");
  }

  get Loan_Term_Chase_Field_Name(): Locator {
    return this.page.locator("//div[text()=\"Chase Field Name\"]     /ancestor::div[2]     //div[@class=\"apply-grid\"]     //div[@class=\"border-bottom p-2\"]");
  }

  get Loan_Value_Price_Offered(): Locator {
    return this.page.locator("//tr[@class=\"row-highlight\"]//*[contains(@aria-label, \"Loan amount:\")]");
  }

  get Loan_Value_Price_Offered_2(): Locator {
    return this.page.locator("(//tr[@class=\"row-highlight\"]//*[contains(@aria-label, \"Loan amount:\")])[2]");
  }

  get Loan_ValuePopup(): Locator {
    return this.page.locator("//div[text()=\"Loan Value\"]//following-sibling::div/b");
  }

  get LOannnn_corr(): Locator {
    return this.page.locator("(//div//button[contains(@aria-label, \"sep3\")])[1]");
  }

  get Loans_added_successfullyPopup(): Locator {
    return this.page.locator("(//li[text()])[1]");
  }

  get Loans_Failed_Popup(): Locator {
    return this.page.locator("(//li[text()])[1]");
  }

  get Loans_Failed_TextPopup(): Locator {
    return this.page.locator("(//li[text()])[4]");
  }

  get Loans_failedPopup(): Locator {
    return this.page.locator("(//li[text()])[3]");
  }

  get Loans_Header_Text(): Locator {
    return this.page.locator("//div[text()=\" #Loans \"]");
  }

  get Loansprice_offered(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"#Loans\"]/div)[$|count|]");
  }

  get Loans1price_offered_standard(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"#Loans\"]/div)[1]");
  }

  get Loans1price_offered(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"#Loans\"]/div)[$|count|]");
  }

  get LoanValueUncommitment_Page_Popup(): Locator {
    return this.page.locator("//div[text()=\"Loan Value\"]//following-sibling::div/b");
  }

  get Locked_Auth_Limit(): Locator {
    return this.page.locator("//div[text()=\"Auth Limit: \"]//..//div[@class=\"fw-semibold\"]");
  }

  get Locked_Corr_LoanPrice_Offered(): Locator {
    return this.page.locator("(//span[@aria-label=\"Committed loan\"]//ancestor::tr//td[@data-title=\"Corr. Loan#\"]//button)[1]");
  }

  get Locked_CorrLoan(): Locator {
    return this.page.locator("//button[contains(@aria-label,\"View loan details for\")]");
  }

  get Locked_CurrGrossCommitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Curr Gross\"]");
  }

  get Locked_CurrGrossPrice_Offered(): Locator {
    return this.page.locator("//span[@aria-label=\"Committed loan\"]//ancestor::tr//td[@data-title=\"Curr Gross\"]");
  }

  get Locked_Gross_PricePrice_Offered(): Locator {
    return this.page.locator("//span[@aria-label=\"Committed loan\"]//ancestor::tr//td[@data-title=\"Gross Price\"]");
  }

  get Locked_GrossPriceCommitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Gross Price\"]");
  }

  get Locked_Hedge_RatioCommitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Hedge Ratio\"]");
  }

  get Locked_Hedge_RatioPrice_Offered(): Locator {
    return this.page.locator("//span[@aria-label=\"Committed loan\"]//ancestor::tr//td[@data-title=\"Hedge Ratio\"]");
  }

  get Locked_IconLatest_Committed_Loan(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNum|\"]//ancestor::tr//span[@aria-label=\"Committed loan\"]");
  }

  get Locked_Last_Commited_Bid(): Locator {
    return this.page.locator("//div[contains(@class, 'd-flex') and contains(@class, 'small')]/div[3]/div[2]");
  }

  get Locked_Last_NameCommitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Last Name\"]");
  }

  get Locked_Last_namePrice_Offered(): Locator {
    return this.page.locator("//span[@aria-label=\"Committed loan\"]//ancestor::tr//td[@data-title=\"Last Name\"]");
  }

  get Locked_Loan_Amount(): Locator {
    return this.page.locator("(//div[@aria-label=\"Locked loan\"]//..//..//div[@aria-label[contains(., 'Loan amount')]])[1]");
  }

  get Locked_Loan_Amount_2(): Locator {
    return this.page.locator("(//div[@aria-label=\"Locked loan\"]//..//..//div[@aria-label[contains(., 'Loan amount')]])[2]");
  }

  get Locked_Loan_AmountCommitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Loan Amount\"]");
  }

  get Locked_Loan_AmountPrice_Offered(): Locator {
    return this.page.locator("//span[@aria-label=\"Committed loan\"]//ancestor::tr//td[@data-title=\"Loan Amount\"]");
  }

  get Locked_Loan_CommitOrder(): Locator {
    return this.page.locator("(//div[@class=\"commit-order\"])[$|count|]");
  }

  get Locked_loans(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Locked loan\")]");
  }

  get Locked_Loans_Count(): Locator {
    return this.page.locator("//span[text()=\"Locked/Committed Loans\"]//following-sibling::span");
  }

  get Locked_MarkAdjCommitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Mark Adj\"]");
  }

  get Locked_MarkAdjPrice_Offered(): Locator {
    return this.page.locator("//span[@aria-label=\"Committed loan\"]//ancestor::tr//td[@data-title=\"Mark Adj\"]");
  }

  get Locked_Open_Auth_Limit(): Locator {
    return this.page.locator("//div[text()=\"Open Auth Limit: \"]//..//div[@class=\"fw-semibold\"]");
  }

  get Locked_Ref_Sec_ProdPrice_Offered(): Locator {
    return this.page.locator("//span[@aria-label=\"Committed loan\"]//ancestor::tr//td[@data-title=\"Ref Sec Prod.\"]");
  }

  get Locked_RefSecPriceCommitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Ref Sec Price\"]");
  }

  get Locked_RefSecProdCommitment_List(): Locator {
    return this.page.locator("//td[@data-title=\"Ref Sec Prod.\"]");
  }

  get Locked_Row(): Locator {
    return this.page.locator("(//td[@role=\"cell\"]//..//..//tr[@role=\"row\"])[1]");
  }

  get LockedCommitted_Loans(): Locator {
    return this.page.locator("//div[@id='price-offered-list-tabs']//span[text()[normalize-space() = \"Locked/Committed Loans\"]]");
  }

  get LockedCommitted_Loans_2(): Locator {
    return this.page.locator("//div[@id='price-offered-list-tabs']/div[1]/div[2]");
  }

  get LockedCommitted_Loans_Count(): Locator {
    return this.page.locator("//span[contains(text(),\"Locked/Committed Loans\")]/following-sibling::span[contains(@class,\"counter\")]");
  }

  get LockedInterest_ratePrice_Offered(): Locator {
    return this.page.locator("//span[@aria-label=\"Committed loan\"]//ancestor::tr//td[@data-title=\"Int. Rate\"]");
  }

  get LockedLoans_ChaseFieldValuePopup(): Locator {
    return this.page.locator("(//div[@class=\"border-bottom p-2\" and contains(text(),\"$|ChaseFieldPopupLockedLoans|\")]/following-sibling::div)[1]");
  }

  get LockedRefSecPricePriceOffered(): Locator {
    return this.page.locator("//span[@aria-label=\"Committed loan\"]//ancestor::tr//td[@data-title=\"Ref Sec Price\"]");
  }

  get Mark_AdjHeader_Name(): Locator {
    return this.page.locator("//div[@aria-label=\"Sort by Mark Adj\"]");
  }

  get Mark_Adjprice_offered_screen_table(): Locator {
    return this.page.locator(" (//table//td[@data-title=\"Mark Adj\"])[$|count1|]");
  }

  get Mark_Adjprice_offered_table(): Locator {
    return this.page.locator("(//div[@aria-label=\"Locked loan\"]/ancestor::tr//td[@data-title=\"Mark Adj\"])[$|count|]");
  }

  get Mark_Adjustment_Value_Enabled_Loans(): Locator {
    return this.page.locator("//input//ancestor::tr//td[@data-title=\"Mark Adj\"]");
  }

  get Market_Adjustment_Committed_Loan(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNumStandard|\"]//ancestor::tr/td[@data-title=\"Mark Adj\"]");
  }

  get Market_adjustment_Value(): Locator {
    return this.page.locator("//td[@role=\"cell\"]//input[@type=\"checkbox\"]//..//..//div[contains(@aria-label,\"Market adjustment: \")]");
  }

  get Market_AdjustmentDetails_Screen(): Locator {
    return this.page.locator("//tbody//tr[$|count|]//td[@data-title=\"Mark Adj\"]");
  }

  get Maximum_Display_Value(): Locator {
    return this.page.locator("//label[text()=\"Max Display Value\"]/..//input[contains(@aria-label,\"Enter maximum display value in percentage\")]");
  }

  get MinMax_ThresholdDetails(): Locator {
    return this.page.locator("//div[text()=\"Min/Max Threshold\"]//following-sibling::h5");
  }

  get MinMax_Thresholdprice_offered(): Locator {
    return this.page.locator("//div[@id=\"price-offered-details-header\"]//div/div[text()=\"Min/Max Threshold\"]/..//h5");
  }

  get Minimum_Display_value(): Locator {
    return this.page.locator("//label[text()=\"Min Display Value\"]/..//input[contains(@aria-label,\"Enter minimum display value in percentage\")]");
  }

  get Modal_Title(): Locator {
    return this.page.locator("//h4[@id=\"modalTitle\"]");
  }

  get No_Result(): Locator {
    return this.page.locator("//td[text()=\" No result \"]");
  }

  get Number_50(): Locator {
    return this.page.locator("//button[text()=\" 50 \"]");
  }

  get number_of_items_selected(): Locator {
    return this.page.locator("//span[contains(@aria-label,\"items selected\")]");
  }

  get Okay_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Okay\"]]");
  }

  get Okay_Buttonpopup_price_offered_screen(): Locator {
    return this.page.locator("//div[@class=\"modal-footer\"]//button[contains(text(), \"Okay\")]");
  }

  get Okay_ButtonPopup(): Locator {
    return this.page.locator("//button[contains(text(),\"Okay\")]");
  }

  get Open_Auth_Limit(): Locator {
    return this.page.locator("//div[contains(text(),\"Open Auth Limit:\")]//following-sibling::div");
  }

  get Open_Auth_Limit_All_Loans(): Locator {
    return this.page.locator("//div[contains(text(),\"Open Auth Limit:\")]//following-sibling::div");
  }

  get Open_Auth_LimitCommitment_List(): Locator {
    return this.page.locator("//div[text()=\"Open Auth Limit: \"]//..//div[@class=\"fw-semibold\"]");
  }

  get Other_Config(): Locator {
    return this.page.locator("//a[@href=\"#/admin/general-settings/other-config\"]");
  }

  get Page_Selection(): Locator {
    return this.page.locator("//button[contains(text(),\"Show \")]");
  }

  get Partially_Committed_Bid_Req_Id(): Locator {
    return this.page.locator("//div[@aria-label=\"Status: Partially Committed\"]//..//..//a[contains(@aria-label, \"View details for price offered\")]");
  }

  get Partially_Committed_Status(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Status\")]//span[contains(text(), \"Partially Committed\")]");
  }

  get Paste_Clipboard_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Paste Clipboard\"]]");
  }

  get Paste_loan_numbers(): Locator {
    return this.page.locator("//span[@class=\"error-loan\"]");
  }

  get Paste_loan_numbers_here(): Locator {
    return this.page.locator("//div[@role=\"textbox\"]");
  }

  get Paste_loan_numbers_to_commit_TextBox(): Locator {
    return this.page.locator("//div[@role=\"textbox\"]");
  }

  get Paste_Loans_Button(): Locator {
    return this.page.locator("//button[text()[normalize-space() = \"Paste Loans\"]]");
  }

  get Paste_Loans_ButtonPrice_Offered_Page(): Locator {
    return this.page.locator("//button[contains(text(),\"Paste Loans\")]\n");
  }

  get Price_Offered_Back_Arrowprice_offered(): Locator {
    return this.page.locator("//div[contains(@id,\"price-offered-back\")]//i");
  }

  get Price_Offered_Bid_Req_Id(): Locator {
    return this.page.locator("//a[contains(text(),\"$|PriceOfferedBidReqId|\")]");
  }

  get Price_Offered_Company_Name_Column_Data(): Locator {
    return this.page.locator("//td[@data-title=\"Company\"]//div");
  }

  get Price_Offered_Loan_Value(): Locator {
    return this.page.locator("//div[text()=\"Loan Value\"]//..//b[text()]");
  }

  get Price_Offered_Status_Column_Data(): Locator {
    return this.page.locator("//td[@data-title=\"Status\"]//span");
  }

  get Price_Offered_Text(): Locator {
    return this.page.locator("//h3[text()[normalize-space() = \"Price Offered\"]]");
  }

  get Product_NameDetails(): Locator {
    return this.page.locator("//div[text()=\"Product\"]//following-sibling::h5");
  }

  get Productprice_offered(): Locator {
    return this.page.locator("//div[@id=\"price-offered-details-header\"]//div/div[text()=\"Product\"]/..//h5");
  }

  get PS_Button_Locked_Loan(): Locator {
    return this.page.locator("//tr[td//div[contains(@aria-label,'Locked loan')]]//button[contains(text(),'PS')]");
  }

  get PS_Button_Uncommitted_Loan(): Locator {
    return this.page.locator("(//input[contains(@aria-label, \"Select loan\") and @type=\"checkbox\"])[1]/../..//button[contains(text(),\"PS\")]");
  }

  get Ref_Sec_CouponDetails(): Locator {
    return this.page.locator("//div[contains(text(),\"Coupon\")]//following-sibling::h5");
  }

  get Ref_Sec_Price_Locked_Loan(): Locator {
    return this.page.locator("//tr[td//div[contains(@aria-label,\"Locked loan\")]]//div[contains(@aria-label,\"Reference security price: \")]");
  }

  get Ref_Sec_PriceHeader_Name(): Locator {
    return this.page.locator("//div[@aria-label=\"Sort by Ref Sec Price\"]");
  }

  get Ref_Sec_Priceprice_offered_screen_table(): Locator {
    return this.page.locator("( //table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Ref Sec Price\"]/div)[$|count1|]");
  }

  get Ref_Sec_Priceprice_offered_table(): Locator {
    return this.page.locator("(//div[@aria-label=\"Locked loan\"]/ancestor::tr//div[contains(@aria-label, \"Reference security price\")])[$|count|]");
  }

  get Ref_Sec_Prod(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Reference security: \")]");
  }

  get Ref_Sec_Prodprice_offered_screen_table(): Locator {
    return this.page.locator("(//table//td[@data-title=\"Ref Sec Prod.\"]/div)[$|count1|]");
  }

  get Ref_Sec_Prodprice_offered_table(): Locator {
    return this.page.locator("(//div[@aria-label=\"Locked loan\"]/ancestor::tr//div[contains(@aria-label, \"Reference security\")])[$|count|]");
  }

  get Reference_Month(): Locator {
    return this.page.locator("//div[contains(text(),\"Sec. Month\")]//following-sibling::h5");
  }

  get Reference_Security_Committed_Loan(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNumStandard|\"]//ancestor::tr/td/div[contains(@aria-label,\"Reference security:\")]");
  }

  get Reference_Security_Price_Committed_Loan(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNumStandard|\"]//ancestor::tr/td/div[contains(@aria-label,\"Reference security price:\")]");
  }

  get Reference_security_price_Unlocked_Loan(): Locator {
    return this.page.locator("//input[@class=\"text-primary pointer\"]/../..//div[contains(@aria-label,\"Reference security price: \")]");
  }

  get Reference_security_priceDetails_Screen(): Locator {
    return this.page.locator("//tbody//tr[$|count|]//td[@data-title=\"Ref Sec Price\"]");
  }

  get Reference_SecurityDetails_Screen(): Locator {
    return this.page.locator("//tbody//tr[$|count|]//td[@data-title=\"Ref Sec Prod.\"]");
  }

  get Remaining_Timeprice_offered(): Locator {
    return this.page.locator("//div[@id=\"price-offered-details-header\"]//div/div[text()=\"Remaining Time\"]");
  }

  get Remove_Date_FilterCross_Symbol(): Locator {
    return this.page.locator("//button[contains(@aria-label,\"Remove Date:\")]");
  }

  get Remove_errors_and_continue_Checkbox(): Locator {
    return this.page.locator("//input[contains(@id,'errorsCheckbox')]\n");
  }

  get Requested_Date(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Requested Date:\")]");
  }

  get Requested_Date_Count1(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Requested Date:\")]");
  }

  get Required_Bid_Id_Partially_Committed_Status(): Locator {
    return this.page.locator("//tr//td[@data-title=\"Status\"]//span[text()=\" Partially Committed \"]/ancestor::tr//td[@data-title=\"Bid Req. ID\"]//a[@aria-label=\"View details for price offered $|Bidreq_ID|\"]");
  }

  get Required_Bid_Loan_Num_Chase(): Locator {
    return this.page.locator("//button[text()=\"$|BidLoanNumBidReqPageChase|\"]");
  }

  get Required_Bid_Loan_Num_Exe2(): Locator {
    return this.page.locator("//button[text()=\"$|BidLoanNumExeType2BidReqPage|\"]");
  }

  get Required_Loan_Num(): Locator {
    return this.page.locator("//td[@role=\"cell\"]//input[@type=\"checkbox\"]");
  }

  get Required_Loan_Number(): Locator {
    return this.page.locator("//button[contains(text(),\"$|BidLoanNumBidReqPage|\")]");
  }

  get Required_Loan_Number_Check_box(): Locator {
    return this.page.locator("//button[contains(@aria-label,\"View loan details\") and text()=\"$|LoanNumFreedom|\"]/../../..//input");
  }

  get Required_BidRequestID(): Locator {
    return this.page.locator("//a[contains(text(),\"$|BidReqID|\")]");
  }

  get Row_Count(): Locator {
    return this.page.locator("//tbody[@role=\"rowgroup\"]//tr");
  }

  get Row_Count_For_Loan_Numberprice_offered_screen(): Locator {
    return this.page.locator("//table//td[@data-title=\"Corr. Loan#\"]/div");
  }

  get Row_Count_UI(): Locator {
    return this.page.locator("//tr[@role=\"row\"]");
  }

  get RowCount(): Locator {
    return this.page.locator("(//tbody//tr)[position() >= 1 and position() <= last()]");
  }

  get Rows_Count_AllLoans_Tab(): Locator {
    return this.page.locator("//tr[@role=\"row\"]");
  }

  get Search_Dropdown(): Locator {
    return this.page.locator("//input[@id='searchTagInput']");
  }

  get Search_Dropdown_Committed_List_Page(): Locator {
    return this.page.locator("//input[@id='searchTagInput']");
  }

  get Search_Field_in_Price_Offered_Page(): Locator {
    return this.page.locator("//input[@placeholder=\"Search By Bid Request ID\"]");
  }

  get Search_In_Committed_Page(): Locator {
    return this.page.locator("//div//input[@placeholder=\"Search\"]");
  }

  get Search_In_Select_Company(): Locator {
    return this.page.locator("//input[@aria-label=\"Search items\"]");
  }

  get Sec_Month(): Locator {
    return this.page.locator("//div[contains(text(),\"Sec. Month\")]/..//h5");
  }

  get Sec_Monthprice_offered(): Locator {
    return this.page.locator("//div[@id=\"price-offered-details-header\"]//div/div[text()=\"Sec. Month\"]/..//h5");
  }

  get Second_Bid_Request_ID(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Bid Req. ID\"])[2]");
  }

  get Second_Check_Boxprice_offered_screen(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"])[3]/td/input[@type=\"checkbox\"]");
  }

  get Select_all_Checkbox_2_Execution(): Locator {
    return this.page.locator("//tbody//tr[not(descendant::button[contains(text(),\"$|CommittedLoanNumExeType1|\")])]//input[@aria-label=\"Select all for \" and @type=\"checkbox\"]");
  }

  get Select_All_CheckboxPrice_Offred_Page(): Locator {
    return this.page.locator("//input[@aria-label=\"Select all for \" and @type=\"checkbox\"]");
  }

  get Select_all_for_Checkbox(): Locator {
    return this.page.locator("//input[normalize-space(@aria-label)=\"Select all for\" and @type=\"checkbox\"]");
  }

  get Select_all_for_Checkboxprice_offered_screen(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"])/th/div//input[@aria-label=\"Select all for \" and @type=\"checkbox\"]");
  }

  get Select_All_In_Filters(): Locator {
    return this.page.locator("(//span[@title=\"Select All\"])");
  }

  get Select_All_In_Status(): Locator {
    return this.page.locator("(//span[@title=\"Select All\"])[2]");
  }

  get Select_All_Loan_Num(): Locator {
    return this.page.locator("//input[contains(@aria-label,\"Select all for\") and @type=\"checkbox\"]");
  }

  get Select_Bidrequest_ID_Option_in_commitement_list(): Locator {
    return this.page.locator("//span[text()='Bid Request ID']");
  }

  get Select_Company_Search_Field(): Locator {
    return this.page.locator("(//div[normalize-space(text())=\"Select Company/CCode\"]//following::input[@aria-label=\"Search items\"])[1]");
  }

  get Select_Current_Date_Filters_Price_Offered(): Locator {
    return this.page.locator("//div[@class=\"ngb-dp-month\"]//div[@aria-label=\"$|CurrentDate|\"]");
  }

  get Select_Date_Dropdown(): Locator {
    return this.page.locator("//input[@placeholder=\"Select Date\"]");
  }

  get Select_Date_Range(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Select Date Range\"]]");
  }

  get Select_Date_RangePopup(): Locator {
    return this.page.locator("(//div[@class=\"popover-body\"]//button[contains(@class,\"btn btn-link\")])[position() >= 2 and position() <= 5][$|RandomNumber|]");
  }

  get Select_Loan_Num1(): Locator {
    return this.page.locator("(//tbody//input[@type=\"checkbox\"])[1]");
  }

  get Select_Loan_which_is_committed_in_Chase_Direct(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedLoanNumber|\"]/ancestor::tr//input[@type=\"checkbox\"]");
  }

  get Select_Loan_which_is_committed_in_Standard(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedLoanNumber|\"]/ancestor::tr//input[@type=\"checkbox\"]");
  }

  get Selected_Commitments_Status(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Select Commitments Status\"]]//following::label[@class=\"dropdown-item d-flex checked\"]//span[@title]");
  }

  get Selected_Company(): Locator {
    return this.page.locator("(//div[@class=\"dropdown-overflow\"])[1]//input[@type=\"checkbox\"]//..//div");
  }

  get Selected_Company_Count(): Locator {
    return this.page.locator("//td[@data-title=\"Company\"]");
  }

  get Selected_Company_Count_in_Filters(): Locator {
    return this.page.locator("//label[@class=\"dropdown-item d-flex checked\"]");
  }

  get Selected_CompanyPrice_Offered(): Locator {
    return this.page.locator("//label[@class=\"dropdown-item d-flex checked\"]//span[@title]");
  }

  get Selected_Loan_Amount_Footer_Displayprice_offered(): Locator {
    return this.page.locator("(//div[@id=\"page-footer\"]//div)[3]/div/small[text()=\"Selected Loan Amt\"]/../../../div/div[@class=\"fw-bold\"]");
  }

  get Selected_Loan_Amt(): Locator {
    return this.page.locator("//small[text()=\"Selected Loan Amt\"]/following::div[@class=\"fw-bold\"]");
  }

  get Selected_Loan_Amt_Footer_Textprice_offered(): Locator {
    return this.page.locator("(//div[@id=\"page-footer\"]//div)[3]/div/small/../../../div/div[@class=\"fw-bold\"]/..");
  }

  get Selected_loan_Checkboxprice_offered_screen(): Locator {
    return this.page.locator("//input[contains(@aria-label,\"Select loan\")]/../..//td[@data-title=\"Corr. Loan#\"]/..//td[@role=\"cell\"]/input[@type=\"checkbox\"]");
  }

  get Selected_Loans_Number(): Locator {
    return this.page.locator("//div[text()=\"Selected Loans\"]//..//b[text()]");
  }

  get Selected_LoansPopup(): Locator {
    return this.page.locator("//div[text()=\"Selected Loans\"]//following-sibling::div/b");
  }

  get Selected_LoansUncommitment_page_Popup(): Locator {
    return this.page.locator("//div[text()=\"Selected Loans\"]//following-sibling::div/b");
  }

  get Selected_Status(): Locator {
    return this.page.locator("(//div[@class=\"dropdown-overflow\"])[2]//input[@type=\"checkbox\"]//..//div");
  }

  get Selected_Status_In_Filter_Count(): Locator {
    return this.page.locator("//label[@class=\"dropdown-item d-flex checked\"]");
  }

  get Selected_Uncommitted_Loan_Amount(): Locator {
    return this.page.locator("//button[text()=\"$|CommittedLoan|\"]//ancestor::tr//td[@data-title=\"Loan Amount\"]");
  }

  get Show_Selected(): Locator {
    return this.page.locator("//div[text()=\" Show Selected \"]");
  }

  get spanTag_spinner(): Locator {
    return this.page.locator("//span[contains(@class, 'circle')]");
  }

  get Standard_Time_Selection(): Locator {
    return this.page.locator("//option[@value=\"$|TimeStandard|\"]");
  }

  get Status(): Locator {
    return this.page.locator("//div[contains(@aria-label,\"Status:\")]//span");
  }

  get Status_Checkbox(): Locator {
    return this.page.locator("(//div[@class=\"dropdown-overflow\"])[2]//input[@type=\"checkbox\"]");
  }

  get Status_Count_After_Filtering(): Locator {
    return this.page.locator("//div[@role=\"status\"]//span");
  }

  get Status_Count_In_Filters(): Locator {
    return this.page.locator("(//div[@class=\"dropdown-overflow\"])[2]//input[@type=\"checkbox\"]\n");
  }

  get Status_Expired(): Locator {
    return this.page.locator("//a[contains(text(),\"$|BidReqIdPriceOffered|\")]//ancestor::tr//td[@data-title=\"Status\"]//span[text()[normalize-space() = \"Expired\"]]");
  }

  get Status_Filter_ChipPrice_Offered_Page(): Locator {
    return this.page.locator("//div[@class=\"pill rounded-pill relative\" and contains(@aria-label,\"Chip Status\")]");
  }

  get Status_In_Screen(): Locator {
    return this.page.locator("//a[contains(text(),\"$|BidReqIdPriceOffered|\")]//ancestor::tr//td[@data-title=\"Status\"]");
  }

  get Status_In_UI(): Locator {
    return this.page.locator("//div[@role=\"status\"]//span");
  }

  get Status_Individual(): Locator {
    return this.page.locator("(//div[@role=\"status\"]//span)[$|Count|]");
  }

  get Status_Individual_2(): Locator {
    return this.page.locator("(//div[@role=\"status\"]//span)[$|CCount|]");
  }

  get Status_Individual_In_Screen(): Locator {
    return this.page.locator("(//div[@role=\"status\"]//span)");
  }

  get StatusPrice_Offered_Screen(): Locator {
    return this.page.locator("//td[@data-title='Bid Req. ID']/a[normalize-space(text())='$|BidReqId|']//ancestor::tr//td[@data-title=\"Status\"]");
  }

  get Status1price_offered_standard(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Status\"])[1]");
  }

  get Status1price_offered(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Status\"])[$|count|]");
  }

  get Status2price_offered(): Locator {
    return this.page.locator("(//table[@aria-label=\"Data Table\"]//tr[@role=\"row\"]//td[@data-title=\"Status\"])[$|count|]");
  }

  get Successful_Loan_NumberPopup(): Locator {
    return this.page.locator("(//li[text()])[2]");
  }

  get Text_from_Remaining_Timeprice_offered(): Locator {
    return this.page.locator("//div[@id=\"price-offered-details-header\"]//div/div[text()=\"Remaining Time\"]/../h5");
  }

  get Today_Date(): Locator {
    return this.page.locator("//span[text()=\" $|CurrentDate| \"]");
  }

  get Toggle_Date_Picker_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Toggle Date Picker\"]");
  }

  get Total_Cells_All_Loans(): Locator {
    return this.page.locator("//tbody//tr[$|count|]//td[@role='cell'][position() >= 3 and position() <= 12]");
  }

  get Total_Chips_Count(): Locator {
    return this.page.locator("//div[@role=\"listitem\" and contains(@aria-label,\"Chip\")]");
  }

  get Total_Committed_LoansCommitment_List(): Locator {
    return this.page.locator("//span[contains(text(),\"Total Committed Loans\")]//following-sibling::span[contains(@class,\"counter\")]");
  }

  get Total_Count_Loan_Amounts(): Locator {
    return this.page.locator("//td[@data-title=\"Loan Amount\"]");
  }

  get Total_LoansActions_Popup(): Locator {
    return this.page.locator("//div[text()=\"Total Loans: \"]//following-sibling::h4");
  }

  get Total_LoansDetails_Screen(): Locator {
    return this.page.locator("//td[@data-title=\"Corr. Loan#\"]");
  }

  get Total_LoansPrice_Offered_Page(): Locator {
    return this.page.locator("//a[contains(text(),\"$|BidReqIdPriceOffered|\")]//ancestor::tr//td[@data-title=\"#Loans\"]\n ");
  }

  get Total_LoansPrice_Offered_Screen(): Locator {
    return this.page.locator("//td[@data-title='Bid Req. ID']/a[normalize-space(text())='$|BidReqIdCommitmentList|']//ancestor::tr//td[@data-title=\"#Loans\"]");
  }

  get Total_Rows_Count_UIDetails(): Locator {
    return this.page.locator("//tbody//tr[@role=\"row\"]");
  }

  get UI_Details(): Locator {
    return this.page.locator("//div[@role=\"text\"]");
  }

  get Uncommit_Selected_1_Button(): Locator {
    return this.page.locator("//button[@id='commitdropdownMenuButton']");
  }

  get Uncommitted_Bid(): Locator {
    return this.page.locator("(//input[contains(@aria-label, \"Select loan\") and @type=\"checkbox\"])");
  }

  get Uncommitted_Loan_Num(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNum|\"]");
  }

  get Uncommitted_Loan_NumStandard(): Locator {
    return this.page.locator("//input[contains(@aria-label,\"Select loan\")]/ancestor::tr//button[contains(@aria-label,\"View loan details\")]");
  }

  get Uncommitted_LoanCheck_Box(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNum|\"]//ancestor::tr//input[@type=\"checkbox\"]");
  }

  get Uncommitted_LoanLocked_Icon(): Locator {
    return this.page.locator("//button[text()=\"$|UncommittedLoanNum|\"]//ancestor::tr//span[@aria-label=\"Committed loan\"]");
  }

  get Uncommitted_successfully(): Locator {
    return this.page.locator("//div[text()[normalize-space() = \"Uncommitted successfully\"]]");
  }

  get Uncommitted_LoanNum1(): Locator {
    return this.page.locator("(//tr[@class=\"row-highlight\"]//button[contains(@aria-label,\"View loan details\")])[1]");
  }

  get Unidentified_Loan_Name(): Locator {
    return this.page.locator("//div[contains(text(),\"Unidentified Loan\")]//following::div[1]/div");
  }

  get Unidentified_Loan_Number(): Locator {
    return this.page.locator("//div[contains(text(),\"Unidentified Loan\")]/../div[contains(@class,\"d-flex flex-wrap gap-1 flex-grow\")]");
  }

  get Unidentified_Loan_Text(): Locator {
    return this.page.locator("//div[contains(normalize-space(.),\"Unidentified Loan #\")]\n");
  }

  get Unidentified_Loanerrors_found_popup(): Locator {
    return this.page.locator("//div//div[contains(text(),\"Unidentified Loan\")]/../hr/..//div//div");
  }

  get Unidentified_Loantext_box_popup(): Locator {
    return this.page.locator("//div[@role=\"textbox\"]/span[contains(text(),\"$|UnidentifiedLoanNumber(errors found popup)|\")]");
  }

  get Unlocked_Loan(): Locator {
    return this.page.locator("//tbody[@role=\"rowgroup\"]/tr[3]/td[1]");
  }

  get UnLocked_Loan_Number(): Locator {
    return this.page.locator("//td//input[@type=\"checkbox\"]//..//..//button[contains(@aria-label, \"View loan details for\")]");
  }

  get Update_Threshold_Button(): Locator {
    return this.page.locator("//span[contains(text(),\"Update Threshold\")]");
  }

  get Validate_Button_Paste_loan_popup(): Locator {
    return this.page.locator("//button[@aria-label=\"Validate loan numbers\"]");
  }

  get Validate_ButtonPrice_Offered_Page(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Validate\"]]");
  }

  get Yes_Commit_Buttonpopup_price_offered_screen(): Locator {
    return this.page.locator("(//div[@class=\"modal-footer\"]/button)[2]");
  }

  get Yes_Commit_ButtonPopup(): Locator {
    return this.page.locator("//span[text()=\"Yes, Commit\"]//parent::button");
  }

  get Yes_Expire_Button(): Locator {
    return this.page.locator("//button[@aria-label=\"Yes, Expire\"]");
  }

  get Yes_Uncommit_Button(): Locator {
    return this.page.locator("//span[text()[normalize-space() = \"Yes, Uncommit\"]]");
  }

}