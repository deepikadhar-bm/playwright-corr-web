import { Page, Locator } from '@playwright/test';

/**
 * Page Object: login
 * Elements: 6
 */
export class LoginPage {
  constructor(private page: Page) {}

  get Delete_button_in_Header_Mapping(): Locator {
    return this.page.locator("//div[@class=\"gap-2 header-grid-layout unidentified-header\"]/..//i[@class=\"fas fa-trash-alt text-danger\"]");
  }

  get header_chase_name(): Locator {
    return this.page.locator("//div[@class=\"gap-2 header-grid-layout\"]");
  }

  get Header_chase_name(): Locator {
    return this.page.locator("(//div[@class=\"flex-grow-1\"]/../..//div[@class=\"gap-2 header-grid-layout\"])[$|count|]");
  }

   Impound(number:string): Locator {
    return this.page.locator('div.group', { hasText: 'Impound Type' });
  
  }

  get Mapping_Header(): Locator {
    return this.page.locator("(//div[contains(@class,\"cursor-pointer\")])[$|count|]\n\n\n\n\n\n\n");
  }

  get Mappingheadingname(): Locator {
    return this.page.locator("((//table/tbody/tr))/td[$|Columncount|]");
  }

}