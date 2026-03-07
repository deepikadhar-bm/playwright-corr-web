// [POM-APPLIED]
import { test, expect } from '@playwright/test';
import path from 'path';
import * as stepGroups from '../../../src/helpers/step-groups';
import { AmortizationTermPage } from '../../../src/pages/correspondant/amortization-term';
import { AppraisedValuePage } from '../../../src/pages/correspondant/appraised-value';
import { ContinueEditingButtonPage } from '../../../src/pages/correspondant/continue-editing-button';
import { CorrespondentPortalPage } from '../../../src/pages/correspondant/correspondent-portal';
import { MultipleClientHeadersAreMappedToTheSameChasePage } from '../../../src/pages/correspondant/multiple-client-headers-are-mapped-to-the-same-chase';
import { testDataManager } from 'testdata/TestDataManager';
test.describe('REG_Bid Maps', () => {
  let vars: Record<string, string> = {};
  let amortizationTermPage: AmortizationTermPage;
  let appraisedValuePage: AppraisedValuePage;
  let continueEditingButtonPage: ContinueEditingButtonPage;
  let correspondentPortalPage: CorrespondentPortalPage;
  let multipleClientHeadersAreMappedToTheSameChasePage: MultipleClientHeadersAreMappedToTheSameChasePage;

  test.beforeEach(async ({ page }) => {
    vars = {};
    amortizationTermPage = new AmortizationTermPage(page);
    appraisedValuePage = new AppraisedValuePage(page);
    continueEditingButtonPage = new ContinueEditingButtonPage(page);
    correspondentPortalPage = new CorrespondentPortalPage(page);
    multipleClientHeadersAreMappedToTheSameChasePage = new MultipleClientHeadersAreMappedToTheSameChasePage(page);
  });

  test('REG_TS06_TC01_Verify the save actions should not allow the duplicate selections for the chase field name values.', async ({ page }) => {

const profileName = "Bid_Maps";
const profile = testDataManager.getProfileByName(profileName);
if (profile && profile.data){
  const ChaseFieldName = profile.data[0]['ChaseFieldName'];
  vars["ChaseFieldName"] = ChaseFieldName;
}
    await stepGroups.stepGroup_Login_to_CORR_Portal(page, vars);
    await stepGroups.stepGroup_Creation_Of_Bid_Map_Upto_Header_Mapping(page, vars);
    await expect(correspondentPortalPage.Rules_and_Actions_Step_4_of_4).toBeVisible();
    await correspondentPortalPage.First_Checkbox_Header_Mapping.selectOption({ label: vars["ChaseFieldName"] });
    vars["Select Bid Sample Field Name"] = await correspondentPortalPage.Select_Bid_Sample_Field_Name.textContent() || '';
    vars["Chase Field Name"] = await correspondentPortalPage.Appraised_Value_Dropdown.evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });
    await correspondentPortalPage.Save_Draft_Button1.click();
    vars["BidSampleField"] = await amortizationTermPage.Bid_Sample_Field_in_Alert_Pop_Up.textContent() || '';
    vars["Chase Field Namepopup"] = await appraisedValuePage.Bid_Sample_Field_In_Alert_Pop_Up.textContent() || '';
    expect(String(vars["Select Bid Sample Field Name"])).toBe(vars["BidSampleField"]);
    expect(String(vars["Chase Field Name"])).toBe(vars["Chase Field Namepopup"]);
    await expect(page.getByText("Multiple client headers are mapped to the same Chase Field name. Please review and make changes.")).toBeVisible();
    await expect(multipleClientHeadersAreMappedToTheSameChasePage.Multiple_client_headers_are_mapped_to_the_same_Chase).toBeVisible();
    await continueEditingButtonPage.Continue_Editing_Button.waitFor({ state: 'visible' });
  });
});
