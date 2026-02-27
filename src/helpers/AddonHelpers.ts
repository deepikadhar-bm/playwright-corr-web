/**
 * PlaywrightHelpers.ts
 *
 * All 37 helper methods using date-fns for date operations.
 * Pass your test-level vars into the constructor so helper results
 * land directly in the same vars object you read from in your test.
 *
 * Usage:
 *   let vars: Record<string, string> = {};
 *   const Methods = new PlaywrightHelpers(page, vars);
 *   Methods.concatenate('pricing-request-', vars['CorrLoanUI'], 'ExpectedFileName1');
 *   console.log(vars['ExpectedFileName1']); //  result in vars directly
 */

import { Page, Locator } from '@playwright/test';
import {
  parse,
  format,
  addDays,
  subMinutes,
  isEqual,
  isBefore,
  isAfter,
  parseISO,
} from 'date-fns';

// ─── Console Logger ───────────────────────────────────────────────────────────

function pass(method: string, detail: string): void {
  console.log(`\x1b[32m[PASS]\x1b[0m ${method} » ${detail}`);
}

function fail(method: string, detail: string, error: unknown): never {
  const msg = error instanceof Error ? error.message : String(error);
  console.error(`\x1b[31m[FAIL]\x1b[0m ${method} » ${detail} | Error: ${msg}`);
  throw error instanceof Error ? error : new Error(msg);
}

// ─────────────────────────────────────────────────────────────────────────────

export class PlaywrightHelpers {
  private page: Page;

  // ── vars — shared reference with test-level vars ───────────────────────────
  // Pass your test's local vars into the constructor.
  // Every helper writes results into this same object,
  // so vars['key'] in your test is updated automatically.
  //
  // Usage:
  //   let vars: Record<string, string> = {};
  //   const Methods = new PlaywrightHelpers(page, vars);
  //   Methods.concatenate('pricing-request-', vars['CorrLoanUI'], 'ExpectedFileName1');
  //   console.log(vars['ExpectedFileName1']); // result in vars directly
  public vars: Record<string, string>;

  constructor(page: Page, vars?: Record<string, string>) {
    this.page = page;
    this.vars = vars ?? {};
  }

  // ── Locator Builder ────────────────────────────────────────────────────────
  private buildLocator(strategy: string, value: string): Locator {
    switch (strategy.toLowerCase()) {
      case 'id': return this.page.locator(`#${value}`);
      case 'name': return this.page.locator(`[name="${value}"]`);
      case 'tagname': return this.page.locator(value);
      case 'classname': return this.page.locator(`.${value}`);
      case 'linktext': return this.page.getByRole('link', { name: value, exact: true });
      case 'partiallinktext': return this.page.getByRole('link', { name: value });
      case 'cssselector': return this.page.locator(value);
      case 'xpath': return this.page.locator(`xpath=${value}`);
      default: throw new Error(`Unknown locator strategy: "${strategy}"`);
    }
  }

  // ==========================================================================
  // 1. Verify multiple elements have the SAME exact text
  // ==========================================================================
  async verifyMultipleElementsHaveSameText(
    locator: Locator,
    expectedText: string
  ): Promise<void> {

    const METHOD = 'verifyMultipleElementsHaveSameText';
    try {
      const elements = await locator.all();
      if (elements.length === 0) throw new Error('No elements found');

      for (let i = 0; i < elements.length; i++) {
        const actual = ((await elements[i].textContent()) ?? '').trim();
        if (actual !== expectedText)
          throw new Error(`Element [${i}] → Expected: "${expectedText}" | Got: "${actual}"`);
      }

      pass(METHOD, `All ${elements.length} element(s) have exact text: "${expectedText}"`);
    } catch (e) {
      fail(METHOD, `Expected text "${expectedText}"`, e);
    }
  }
  // ==========================================================================
  // 2. Verify numeric ascending/descending order
  // ==========================================================================
  async verifyNumericOrder(
    strategy: string, value: string, order: 'ascending' | 'descending'
  ): Promise<void> {
    const METHOD = 'verifyNumericOrder';
    try {
      const elements = await this.buildLocator(strategy, value).all();
      if (elements.length === 0) throw new Error(`No elements found using ${strategy}="${value}"`);
      const numbers: number[] = [];
      for (const el of elements) {
        const text = (await el.textContent() ?? '').replace(/,/g, '').trim();
        const num = parseFloat(text);
        if (isNaN(num)) throw new Error(`Cannot parse "${text}" as a number`);
        numbers.push(num);
      }
      for (let i = 1; i < numbers.length; i++) {
        if (order === 'ascending' && numbers[i] < numbers[i - 1])
          throw new Error(`Order broken at [${i}]: ${numbers[i - 1]} > ${numbers[i]}`);
        if (order === 'descending' && numbers[i] > numbers[i - 1])
          throw new Error(`Order broken at [${i}]: ${numbers[i - 1]} < ${numbers[i]}`);
      }
      pass(METHOD, `${numbers.length} values in ${order} order: [${numbers.join(', ')}]`);
    } catch (e) { fail(METHOD, `Numeric ${order} order [${strategy}="${value}"]`, e); }
  }

  // ==========================================================================
  // 3. Verify string ascending/descending order
  // ==========================================================================
  async verifyStringOrder(
    strategy: string, value: string, order: 'ascending' | 'descending'
  ): Promise<void> {
    const METHOD = 'verifyStringOrder';
    try {
      const elements = await this.buildLocator(strategy, value).all();
      if (elements.length === 0) throw new Error(`No elements found using ${strategy}="${value}"`);
      const texts: string[] = [];
      for (const el of elements) texts.push((await el.textContent() ?? '').trim());
      for (let i = 1; i < texts.length; i++) {
        const cmp = texts[i - 1].localeCompare(texts[i]);
        if (order === 'ascending' && cmp > 0)
          throw new Error(`Order broken at [${i}]: "${texts[i - 1]}" > "${texts[i]}"`);
        if (order === 'descending' && cmp < 0)
          throw new Error(`Order broken at [${i}]: "${texts[i - 1]}" < "${texts[i]}"`);
      }
      pass(METHOD, `${texts.length} strings in ${order} order`);
    } catch (e) { fail(METHOD, `String ${order} order [${strategy}="${value}"]`, e); }
  }

  // ==========================================================================
  // 4. Add days to a date → store in vars
  // ==========================================================================
  addDaysToDate(
    dateString: string, inputFormat: string, daysToAdd: number,
    outputFormat: string, varName: string
  ): void {
    const METHOD = 'addDaysToDate';
    try {
      const parsed = parse(dateString, inputFormat, new Date());
      const stored = format(addDays(parsed, daysToAdd), outputFormat);
      this.vars[varName] = stored;
      pass(METHOD, `"${dateString}" + ${daysToAdd} days = "${stored}" → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Add ${daysToAdd} days to "${dateString}"`, e); }
  }

  // ==========================================================================
  // 5. Verify element text contains (case-insensitive)
  // ==========================================================================
  async verifyElementTextContainsCaseInsensitive(
    strategy: string, value: string, testData: string
  ): Promise<void> {
    const METHOD = 'verifyElementTextContainsCaseInsensitive';
    try {
      const actual = (await this.buildLocator(strategy, value).textContent() ?? '').trim();
      if (!actual.toLowerCase().includes(testData.toLowerCase()))
        throw new Error(`"${actual}" does not contain "${testData}"`);
      pass(METHOD, `"${actual}" contains "${testData}" (case-insensitive)`);
    } catch (e) { fail(METHOD, `[${strategy}="${value}"] does not contain "${testData}"`, e); }
  }

  // ==========================================================================
  // 6. Verify attribute contains (case-insensitive)
  // ==========================================================================
  async verifyAttributeContainsCaseInsensitive(
    strategy: string, value: string, attributeName: string, testData: string
  ): Promise<void> {
    const METHOD = 'verifyAttributeContainsCaseInsensitive';
    try {
      const attrValue = (await this.buildLocator(strategy, value).getAttribute(attributeName) ?? '');
      if (!attrValue.toLowerCase().includes(testData.toLowerCase()))
        throw new Error(`"${attributeName}"="${attrValue}" does not contain "${testData}"`);
      pass(METHOD, `"${attributeName}"="${attrValue}" contains "${testData}" (case-insensitive)`);
    } catch (e) { fail(METHOD, `[${strategy}="${value}"] attr "${attributeName}"`, e); }
  }

  // ==========================================================================
  // 7. Verify input value contains (case-insensitive)
  // ==========================================================================
  async verifyElementValueContainsCaseInsensitive(
    strategy: string, value: string, testData: string
  ): Promise<void> {
    const METHOD = 'verifyElementValueContainsCaseInsensitive';
    try {
      const inputValue = await this.buildLocator(strategy, value).inputValue();
      if (!inputValue.toLowerCase().includes(testData.toLowerCase()))
        throw new Error(`"${inputValue}" does not contain "${testData}"`);
      pass(METHOD, `Input value "${inputValue}" contains "${testData}" (case-insensitive)`);
    } catch (e) { fail(METHOD, `[${strategy}="${value}"] input value`, e); }
  }

  // ==========================================================================
  // 8. Verify selected option in multiple dropdowns
  // ==========================================================================
  async verifySelectedOptionInMultipleDropdowns(
    strategy: string, value: string, mode: 'contains' | 'not contains', expectedText: string
  ): Promise<void> {
    const METHOD = 'verifySelectedOptionInMultipleDropdowns';
    try {
      const elements = await this.buildLocator(strategy, value).all();
      if (elements.length === 0) throw new Error(`No elements found using ${strategy}="${value}"`);
      for (let i = 0; i < elements.length; i++) {
        const selectedText = await elements[i].evaluate(
          (sel: HTMLSelectElement) => sel.options[sel.selectedIndex]?.text ?? ''
        );
        if (mode === 'contains' && !selectedText.includes(expectedText))
          throw new Error(`Dropdown [${i}] "${selectedText}" does not contain "${expectedText}"`);
        if (mode === 'not contains' && selectedText.includes(expectedText))
          throw new Error(`Dropdown [${i}] "${selectedText}" unexpectedly contains "${expectedText}"`);
      }
      pass(METHOD, `All ${elements.length} dropdown(s) ${mode} "${expectedText}"`);
    } catch (e) { fail(METHOD, `Dropdown check [${strategy}="${value}"]`, e); }
  }

  // ==========================================================================
  // 9. Get day name from date → store in vars
  // ==========================================================================
  getDayFromDate(dateString: string, dateFormat?: string, varName?: string): void {
    const METHOD = 'getDayFromDate';
    try {
      let parsedDate: Date;
      if (dateFormat) {
        parsedDate = parse(dateString, dateFormat, new Date());
      } else {
        parsedDate = parseISO(dateString);
      }
      if (isNaN(parsedDate.getTime())) throw new Error(`Cannot parse date: "${dateString}"`);
      const dayName = format(parsedDate, 'EEEE');
      this.vars[varName!] = dayName;
      pass(METHOD, `Day of "${dateString}" is "${dayName}" → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Get day from "${dateString}"`, e); }
  }

  // ==========================================================================
  // 10. Verify date comparison
  // ==========================================================================
  verifyDateComparison(
    date1: string, format1: string, operator: '==' | '<=' | '>=' | '!=',
    date2: string, format2: string
  ): void {
    const METHOD = 'verifyDateComparison';
    try {
      const d1 = parse(date1, format1, new Date());
      const d2 = parse(date2, format2, new Date());
      let passed = false;
      switch (operator) {
        case '==': passed = isEqual(d1, d2); break;
        case '!=': passed = !isEqual(d1, d2); break;
        case '<=': passed = isEqual(d1, d2) || isBefore(d1, d2); break;
        case '>=': passed = isEqual(d1, d2) || isAfter(d1, d2); break;
      }
      if (!passed) throw new Error(`"${date1}" ${operator} "${date2}" is false`);
      pass(METHOD, `"${date1}" ${operator} "${date2}" → PASSED`);
    } catch (e) { fail(METHOD, `Date comparison "${date1}" ${operator} "${date2}"`, e); }
  }

  // ==========================================================================
  // 11. Verify typed comparison
  // ==========================================================================
  verifyTypedComparison(
    testData1: string, operator: 'EQUAL' | 'NOT_EQUAL',
    dataType: 'INT' | 'FLOAT' | 'DOUBLE' | 'BOOLEAN' | 'STRING' | 'CHAR',
    testData2: string
  ): void {
    const METHOD = 'verifyTypedComparison';
    try {
      let v1: unknown = testData1, v2: unknown = testData2;
      if (dataType === 'INT') { v1 = parseInt(testData1, 10); v2 = parseInt(testData2, 10); }
      else if (dataType === 'FLOAT' || dataType === 'DOUBLE') { v1 = parseFloat(testData1); v2 = parseFloat(testData2); }
      else if (dataType === 'BOOLEAN') { v1 = testData1.toLowerCase() === 'true'; v2 = testData2.toLowerCase() === 'true'; }
      const areEqual = JSON.stringify(v1) === JSON.stringify(v2);
      if (operator === 'EQUAL' && !areEqual) throw new Error(`"${testData1}" EQUAL "${testData2}" failed`);
      if (operator === 'NOT_EQUAL' && areEqual) throw new Error(`"${testData1}" NOT_EQUAL "${testData2}" failed`);
      pass(METHOD, `[${dataType}] "${testData1}" ${operator} "${testData2}" → PASSED`);
    } catch (e) { fail(METHOD, `[${dataType}] "${testData1}" ${operator} "${testData2}"`, e); }
  }

  // ==========================================================================
  // 12. Verify DB-type comparison
  // ==========================================================================
  verifyDbTypes(
    testData1: string, operator: 'EQUAL' | 'NOT_EQUAL',
    dataType: 'NUMBER' | 'VARCHAR' | 'DATE' | 'TIMESTAMP' | 'BOOLEAN',
    testData2: string
  ): void {
    const METHOD = 'verifyDbTypes';
    try {
      let v1: unknown = testData1, v2: unknown = testData2;
      if (dataType === 'NUMBER') { v1 = parseFloat(testData1); v2 = parseFloat(testData2); }
      if (dataType === 'BOOLEAN') { v1 = testData1.toLowerCase() === 'true'; v2 = testData2.toLowerCase() === 'true'; }
      const areEqual = JSON.stringify(v1) === JSON.stringify(v2);
      if (operator === 'EQUAL' && !areEqual) throw new Error(`"${testData1}" EQUAL "${testData2}" failed`);
      if (operator === 'NOT_EQUAL' && areEqual) throw new Error(`"${testData1}" NOT_EQUAL "${testData2}" failed`);
      pass(METHOD, `[${dataType}] "${testData1}" ${operator} "${testData2}" → PASSED`);
    } catch (e) { fail(METHOD, `[${dataType}] "${testData1}" ${operator} "${testData2}"`, e); }
  }

  // ==========================================================================
  // 13. Extract substring after reference → store in vars
  // ==========================================================================
  extractSubstringAfterReference(
    source: string, referenceText: string, length: number, varName: string
  ): void {
    const METHOD = 'extractSubstringAfterReference';
    try {
      const idx = source.indexOf(referenceText);
      if (idx === -1) throw new Error(`"${referenceText}" not found in "${source}"`);
      const result = source.substring(idx + referenceText.length, idx + referenceText.length + length);
      if (result.length < length) throw new Error(`Extracted "${result}" length ${result.length} < ${length}`);
      this.vars[varName] = result;
      pass(METHOD, `Extracted "${result}" → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Extract after "${referenceText}" length ${length}`, e); }
  }

  // ==========================================================================
  // 14. Verify date matches format
  // ==========================================================================
  verifyDateMatchesFormat(dateValue: string, dateFormat: string): void {
    const METHOD = 'verifyDateMatchesFormat';
    try {
      const parsed = parse(dateValue, dateFormat, new Date());
      const reformatted = format(parsed, dateFormat);
      if (reformatted !== dateValue)
        throw new Error(`"${dateValue}" re-formatted to "${reformatted}" — mismatch`);
      pass(METHOD, `"${dateValue}" matches format "${dateFormat}"`);
    } catch (e) { fail(METHOD, `"${dateValue}" format "${dateFormat}"`, e); }
  }

  // ==========================================================================
  // 15. Verify selected option in single dropdown
  // ==========================================================================
  async verifySelectedDropdownOption(
    locator: string, mode: 'contains' | 'not contains', expectedText: string
  ): Promise<void> {
    const METHOD = 'verifySelectedDropdownOption';
    try {
      const selectedText = await this.page.locator(locator).evaluate(
        (sel: HTMLSelectElement) => sel.options[sel.selectedIndex]?.text ?? ''
      );
      if (mode === 'contains' && !selectedText.includes(expectedText))
        throw new Error(`"${selectedText}" does not contain "${expectedText}"`);
      if (mode === 'not contains' && selectedText.includes(expectedText))
        throw new Error(`"${selectedText}" unexpectedly contains "${expectedText}"`);
      pass(METHOD, `"${locator}" selected "${selectedText}" ${mode} "${expectedText}"`);
    } catch (e) { fail(METHOD, `Dropdown "${locator}"`, e); }
  }

  // ==========================================================================
  // 16. Verify multiple elements attribute same text
  // ==========================================================================
  async verifyMultipleElementsAttributeSameText(
    strategy: string, value: string, attributeName: string, expectedText: string
  ): Promise<void> {
    const METHOD = 'verifyMultipleElementsAttributeSameText';
    try {
      const elements = await this.buildLocator(strategy, value).all();
      if (elements.length === 0) throw new Error(`No elements found using ${strategy}="${value}"`);
      for (let i = 0; i < elements.length; i++) {
        const attrVal = await elements[i].getAttribute(attributeName) ?? '';
        if (attrVal !== expectedText)
          throw new Error(`Element [${i}] "${attributeName}"="${attrVal}" ≠ "${expectedText}"`);
      }
      pass(METHOD, `All ${elements.length} element(s) "${attributeName}" = "${expectedText}"`);
    } catch (e) { fail(METHOD, `Attribute same-text [${strategy}="${value}"] "${attributeName}"`, e); }
  }

  // ==========================================================================
  // 17. Verify multiple elements have partial text
  // ==========================================================================
  async verifyMultipleElementsHavePartialText(
    strategy: string, value: string, expectedText: string
  ): Promise<void> {
    const METHOD = 'verifyMultipleElementsHavePartialText';
    try {
      const elements = await this.buildLocator(strategy, value).all();
      if (elements.length === 0) throw new Error(`No elements found using ${strategy}="${value}"`);
      for (let i = 0; i < elements.length; i++) {
        const actual = (await elements[i].textContent() ?? '').trim();
        if (!actual.includes(expectedText))
          throw new Error(`Element [${i}] "${actual}" does not contain "${expectedText}"`);
      }
      pass(METHOD, `All ${elements.length} element(s) contain "${expectedText}"`);
    } catch (e) { fail(METHOD, `Partial text [${strategy}="${value}"]`, e); }
  }

  // ==========================================================================
  // 18. Verify multiple elements attribute partial text
  // ==========================================================================
  async verifyMultipleElementsAttributePartialText(
    strategy: string, value: string, attributeName: string, expectedText: string
  ): Promise<void> {
    const METHOD = 'verifyMultipleElementsAttributePartialText';
    try {
      const elements = await this.buildLocator(strategy, value).all();
      if (elements.length === 0) throw new Error(`No elements found using ${strategy}="${value}"`);
      for (let i = 0; i < elements.length; i++) {
        const attrVal = await elements[i].getAttribute(attributeName) ?? '';
        if (!attrVal.includes(expectedText))
          throw new Error(`Element [${i}] "${attributeName}"="${attrVal}" does not contain "${expectedText}"`);
      }
      pass(METHOD, `All ${elements.length} element(s) "${attributeName}" contains "${expectedText}"`);
    } catch (e) { fail(METHOD, `Attr partial text [${strategy}="${value}"] "${attributeName}"`, e); }
  }

  // ==========================================================================
  // 19. Verify multiple elements checked/unchecked
  // ==========================================================================
  async verifyMultipleElementsCheckedState(
    strategy: string, value: string, state: 'checked' | 'unchecked'
  ): Promise<void> {
    const METHOD = 'verifyMultipleElementsCheckedState';
    try {
      const elements = await this.buildLocator(strategy, value).all();
      if (elements.length === 0) throw new Error(`No elements found using ${strategy}="${value}"`);
      for (let i = 0; i < elements.length; i++) {
        const isChecked = await elements[i].isChecked();
        if (state === 'checked' && !isChecked) throw new Error(`Element [${i}] is NOT checked`);
        if (state === 'unchecked' && isChecked) throw new Error(`Element [${i}] IS checked`);
      }
      pass(METHOD, `All ${elements.length} element(s) are ${state}`);
    } catch (e) { fail(METHOD, `Checked state [${strategy}="${value}"]`, e); }
  }

  // ==========================================================================
  // 20. Replace char between positions → store in vars
  // ==========================================================================
  replaceCharBetweenPositions(
    charToInsert: string, sourceString: string, start: number, end: number, varName: string
  ): void {
    const METHOD = 'replaceCharBetweenPositions';
    try {
      if (start < 0 || end > sourceString.length || start > end)
        throw new Error(`Invalid positions start=${start} end=${end} for length ${sourceString.length}`);
      const result = sourceString.substring(0, start) + charToInsert + sourceString.substring(end);
      this.vars[varName] = result;
      pass(METHOD, `"${sourceString}"[${start}:${end}] → "${result}" → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Replace [${start}:${end}] in "${sourceString}"`, e); }
  }

  // ==========================================================================
  // 21. Replace ALL occurrences → store in vars
  // ==========================================================================
  replaceAllOccurrences(
    string1: string, string2: string, string3: string, varName: string
  ): void {
    const METHOD = 'replaceAllOccurrences';
    try {
      if (!string3.includes(string1)) throw new Error(`"${string1}" not found in "${string3}"`);
      const result = string3.split(string1).join(string2);
      this.vars[varName] = result;
      pass(METHOD, `"${string1}" → "${string2}" = "${result}" → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Replace all "${string1}" in "${string3}"`, e); }
  }

  // ==========================================================================
  // 22. Add char from start position → store in vars
  // ==========================================================================
  addCharFromStart(
    charToAdd: string, sourceString: string, startPosition: number, varName: string
  ): void {
    const METHOD = 'addCharFromStart';
    try {
      if (startPosition < 0 || startPosition > sourceString.length)
        throw new Error(`Position ${startPosition} out of range for "${sourceString}"`);
      const result = sourceString.substring(0, startPosition) + charToAdd + sourceString.substring(startPosition);
      this.vars[varName] = result;
      pass(METHOD, `"${charToAdd}" at pos ${startPosition} → "${result}" → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Add "${charToAdd}" at pos ${startPosition}`, e); }
  }

  // ==========================================================================
  // 23. Add char from end position → store in vars
  // ==========================================================================
  addCharFromEnd(
    charToAdd: string, sourceString: string, endPosition: number, varName: string
  ): void {
    const METHOD = 'addCharFromEnd';
    try {
      if (endPosition < 0 || endPosition > sourceString.length)
        throw new Error(`End position ${endPosition} out of range for "${sourceString}"`);
      const insertAt = sourceString.length - endPosition;
      const result = sourceString.substring(0, insertAt) + charToAdd + sourceString.substring(insertAt);
      this.vars[varName] = result;
      pass(METHOD, `"${charToAdd}" at end-offset ${endPosition} → "${result}" → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Add "${charToAdd}" at end-pos ${endPosition}`, e); }
  }

  // ==========================================================================
  // 24. Replace FIRST occurrence → store in vars
  // ==========================================================================
  replaceFirstOccurrence(
    string1: string, string2: string, string3: string, varName: string
  ): void {
    const METHOD = 'replaceFirstOccurrence';
    try {
      if (!string3.includes(string1)) throw new Error(`"${string1}" not found in "${string3}"`);
      const result = string3.replace(string1, string2);
      this.vars[varName] = result;
      pass(METHOD, `First "${string1}" → "${string2}" = "${result}" → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Replace first "${string1}" in "${string3}"`, e); }
  }

  // ==========================================================================
  // 25. Fetch texts from multiple elements → store JSON array in vars
  // ==========================================================================
  async fetchTextFromMultipleElements(
    strategy: string, value: string, varName: string
  ): Promise<void> {
    const METHOD = 'fetchTextFromMultipleElements';
    try {
      const elements = await this.buildLocator(strategy, value).all();
      if (elements.length === 0) throw new Error(`No elements found using ${strategy}="${value}"`);
      const texts: string[] = [];
      for (const el of elements) texts.push((await el.textContent() ?? '').trim());
      this.vars[varName] = JSON.stringify(texts);
      pass(METHOD, `Fetched ${texts.length} text(s) → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Fetch texts [${strategy}="${value}"]`, e); }
  }

  // ==========================================================================
  // 26. Fetch attributes from multiple elements → store JSON array in vars
  // ==========================================================================
  async fetchAttributeFromMultipleElements(
    strategy: string, value: string, attributeName: string, varName: string
  ): Promise<void> {
    const METHOD = 'fetchAttributeFromMultipleElements';
    try {
      const elements = await this.buildLocator(strategy, value).all();
      if (elements.length === 0) throw new Error(`No elements found using ${strategy}="${value}"`);
      const values: string[] = [];
      for (const el of elements) values.push(await el.getAttribute(attributeName) ?? '');
      this.vars[varName] = JSON.stringify(values);
      pass(METHOD, `Fetched ${values.length} "${attributeName}" → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Fetch "${attributeName}" [${strategy}="${value}"]`, e); }
  }

  // ==========================================================================
  // 27. Concatenate two strings → store in vars
  // ==========================================================================
  concatenate(testData1: string, testData2: string, varName: string): void {
    const METHOD = 'concatenate';
    try {
      const result = testData1 + testData2;
      this.vars[varName] = result;
      pass(METHOD, `"${testData1}" + "${testData2}" = "${result}" → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Concatenate "${testData1}" + "${testData2}"`, e); }
  }

  // ==========================================================================
  // 28. Convert date format → store in vars
  // ==========================================================================
  convertDateFormat(
    dateString: string, inputFormat: string, outputFormat: string, varName: string
  ): void {
    const METHOD = 'convertDateFormat';
    try {
      const converted = format(parse(dateString, inputFormat, new Date()), outputFormat);
      this.vars[varName] = converted;
      pass(METHOD, `"${dateString}" (${inputFormat}) → "${converted}" (${outputFormat}) → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Convert "${dateString}" from "${inputFormat}" to "${outputFormat}"`, e); }
  }

  // ==========================================================================
  // 29. Clear element and enter text
  // ==========================================================================
  async clearAndEnterText(
    strategy: string, value: string, testData: string
  ): Promise<void> {
    const METHOD = 'clearAndEnterText';
    try {
      const el = this.buildLocator(strategy, value);
      await el.clear();
      await el.fill(testData);
      const actual = await el.inputValue();
      if (actual !== testData) throw new Error(`After fill got "${actual}", expected "${testData}"`);
      pass(METHOD, `[${strategy}="${value}"] filled with "${testData}"`);
    } catch (e) { fail(METHOD, `Clear and enter "${testData}" into [${strategy}="${value}"]`, e); }
  }

  // ==========================================================================
  // 30. Subtract minutes from datetime → store in vars
  // ==========================================================================
  subtractMinutesFromDatetime(
    inputDatetime: string, inputFormat: string, minutes: number,
    outputFormat: string, varName: string
  ): void {
    const METHOD = 'subtractMinutesFromDatetime';
    try {
      const parsed = parse(inputDatetime, inputFormat, new Date());
      const stored = format(subMinutes(parsed, minutes), outputFormat);
      this.vars[varName] = stored;
      pass(METHOD, `"${inputDatetime}" - ${minutes} min = "${stored}" → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Subtract ${minutes} min from "${inputDatetime}"`, e); }
  }

  // ==========================================================================
  // 31. Store character count → store in vars
  // ==========================================================================
  storeCharacterCount(sourceString: string, varName: string): void {
    const METHOD = 'storeCharacterCount';
    try {
      const count = String(sourceString.length);
      this.vars[varName] = count;
      pass(METHOD, `Length of "${sourceString}" is ${count} → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Count chars in "${sourceString}"`, e); }
  }

  // ==========================================================================
  // 32. Concatenate with special char → store in vars
  // ==========================================================================
  concatenateWithSpecialChar(
    string1: string, string2: string, specialChar: string, varName: string
  ): void {
    const METHOD = 'concatenateWithSpecialChar';
    try {
      const result = string1 + specialChar + string2;
      this.vars[varName] = result;
      pass(METHOD, `"${string1}" + "${specialChar}" + "${string2}" = "${result}" → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Concatenate with "${specialChar}"`, e); }
  }

  // ==========================================================================
  // 33. Concatenate with space → store in vars
  // ==========================================================================
  concatenateWithSpace(string1: string, string2: string, varName: string): void {
    const METHOD = 'concatenateWithSpace';
    try {
      const result = `${string1} ${string2}`;
      this.vars[varName] = result;
      pass(METHOD, `"${string1}" + " " + "${string2}" = "${result}" → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Concatenate with space`, e); }
  }

  // ==========================================================================
  // 34. Trim whitespace → store in vars
  // ==========================================================================
  trimWhitespace(testData: string, varName: string): void {
    const METHOD = 'trimWhitespace';
    try {
      const result = testData.trim();
      this.vars[varName] = result;
      pass(METHOD, `Trimmed "${testData}" → "${result}" → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Trim "${testData}"`, e); }
  }

  // ==========================================================================
  // 35. Remove special char → store in vars
  // ==========================================================================
  removeSpecialChar(specialChar: string, sourceString: string, varName: string): void {
    const METHOD = 'removeSpecialChar';
    try {
      const escaped = specialChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const result = sourceString.replace(new RegExp(escaped, 'g'), '');
      this.vars[varName] = result;
      pass(METHOD, `Removed "${specialChar}" from "${sourceString}" → "${result}" → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Remove "${specialChar}" from "${sourceString}"`, e); }
  }
  removeMultipleSpecialChars(specialChars: string[], sourceString: string, varName: string): void {
    const METHOD = 'removeMultipleSpecialChars';
    try {
      let result = sourceString;
      for (const char of specialChars) {
        const escaped = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        result = result.replace(new RegExp(escaped, 'g'), '');
      }
      this.vars[varName] = result;
      pass(METHOD, `Removed [${specialChars.map(c => `"${c}"`).join(', ')}] from "${sourceString}" → "${result}" → vars['${varName}']`);
    }
    catch (e) { fail(METHOD, `Remove multiple chars from "${sourceString}"`, e); }
  }
  // ==========================================================================
  // 36. Verify NOT contains
  // ==========================================================================
  verifyNotContains(testData: string, testData1: string): void {
    const METHOD = 'verifyNotContains';
    try {
      if (testData.includes(testData1))
        throw new Error(`"${testData}" unexpectedly contains "${testData1}"`);
      pass(METHOD, `"${testData}" does NOT contain "${testData1}"`);
    } catch (e) { fail(METHOD, `"${testData}" should not contain "${testData1}"`, e); }
  }

  // ==========================================================================
  // 37. Get character by index → store in vars
  // ==========================================================================
  getCharByIndex(sourceString: string, index: number, varName: string): void {
    const METHOD = 'getCharByIndex';
    try {
      if (index < 0 || index >= sourceString.length)
        throw new Error(`Index ${index} out of bounds (0 to ${sourceString.length - 1})`);
      const char = sourceString[index];
      this.vars[varName] = char;
      pass(METHOD, `Char at [${index}] in "${sourceString}" is "${char}" → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Get char at index ${index} from "${sourceString}"`, e); }
  }

  // ==========================================================================
  // 38. Get current timestamp in given format → store in vars
  // ==========================================================================
  getCurrentTimestamp(timestampFormat: string, varName: string, timeZone: string = 'America/New_York'): void {
    const METHOD = 'getCurrentTimestamp';
    try {
      const tzDate = new Date(new Date().toLocaleString('en-US', { timeZone }));
      const result = format(tzDate, timestampFormat);
      this.vars[varName] = result;
      pass(METHOD, `Current "${timeZone}" timestamp "${result}" (${timestampFormat}) → vars['${varName}']`);
    } catch (e) { fail(METHOD, `Get current timestamp [${timeZone}] with format "${timestampFormat}"`, e); }
  }

  //39.verifying the mathematic operation
    MathematicalOperation(a: string | number, operator: string, b: string | number, varName: string): void {
    const METHOD = 'MathematicalOperation';
    try {
      const numA = parseFloat(String(a));
      const numB = parseFloat(String(b));
      if (isNaN(numA)) throw new Error(`"${a}" is not a valid number`);
      if (isNaN(numB)) throw new Error(`"${b}" is not a valid number`);
      const ops: Record<string, () => number> = {
        '+': () => numA + numB,
        '-': () => numA - numB,
        '*': () => numA * numB,
        '/': () => { if (numB === 0) throw new Error('Division by zero'); return numA / numB; },
      };
      if (!ops[operator]) throw new Error(`Invalid operator: "${operator}"`);
      const result = ops[operator]();
      this.vars[varName] = String(result);
      pass(METHOD, `${numA} ${operator} ${numB} = ${result} → vars['${varName}']`);
    } catch (e) { fail(METHOD, `${a} ${operator} ${b}`, e); }
  }
  //verifying the comparison
  verifyComparison(value1: string, operator: '>' | '<' | '>=' | '<=' | '==' | '!=', value2: string): void {
    const METHOD = 'verifyComparison';
    try {
      const a = parseFloat(value1);
      const b = parseFloat(value2);
      if (isNaN(a)) throw new Error(`"${value1}" is not a valid number`);
      if (isNaN(b)) throw new Error(`"${value2}" is not a valid number`);
      const ops: Record<string, boolean> = {
        '>': a > b,
        '<': a < b,
        '>=': a >= b,
        '<=': a <= b,
        '==': a == b,
        '!=': a != b,
      };
      if (!ops[operator]) throw new Error(`"${value1}" ${operator} "${value2}" → FAILED`);
      pass(METHOD, `${a} ${operator} ${b} → PASSED`);
    } catch (e) { fail(METHOD, `${value1} ${operator} ${value2}`, e); }
  }
  //Trim the string and store in vars
   trimtestdata(value: string, varName: string): void {
  const trimmed = value.trim();
  this.vars[varName] = trimmed;
  console.log(`[trimFrontBack] "${value}" → "${trimmed}" → vars['${varName}']`);
}
}