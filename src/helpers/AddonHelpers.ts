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
  addMinutes,
  isEqual,
  isBefore,
  isAfter,
  parseISO,
} from 'date-fns';
import { Logger as log } from '../helpers/log-helper';

// ─────────────────────────────────────────────────────────────────────────────
// Logger usage:
//   log.pass(`[METHOD] detail`)  → green [PASS]  – verify* methods on success
//   log.fail(`[METHOD] detail`)  → red   [FAIL]  – verify* methods on failure
//   log.info(`[METHOD] detail`)  → white [INFO]  – all other helpers
// ─────────────────────────────────────────────────────────────────────────────

export class AddonHelpers {
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
  private buildLocator(strategyOrLocator: string | Locator, value?: string): Locator {
    // If a Locator is passed directly (from POM), return it as-is
    if (typeof strategyOrLocator !== 'string') return strategyOrLocator as Locator;

    const val = value as string;
    switch (strategyOrLocator.toLowerCase()) {
      case 'id': return this.page.locator(`#${val}`);
      case 'name': return this.page.locator(`[name="${val}"]`);
      case 'tagname': return this.page.locator(`${val}`);
      case 'classname': return this.page.locator(`.${val}`);
      case 'linktext': return this.page.getByRole('link', { name: val, exact: true });
      case 'partiallinktext': return this.page.getByRole('link', { name: val });
      case 'cssselector': return this.page.locator(val);
      case 'xpath': return this.page.locator(`xpath=${val}`);
      case 'text': return this.page.getByText(val);
      case 'testid': return this.page.getByTestId(val);
      case 'placeholder': return this.page.getByPlaceholder(val);
      case 'label': return this.page.getByLabel(val);
      default: throw new Error(`Unknown locator strategy: "${strategyOrLocator}"`);
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

      log.pass(`[${METHOD}] All ${elements.length} element(s) have exact text: "${expectedText}"`);
    } catch (e) {
      log.fail(`[${METHOD}] Expected text "${expectedText}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e)));
    }
  }
  // ==========================================================================
  // 2. Verify numeric ascending/descending order
  // ==========================================================================
  async verifyNumericOrder(
    strategyOrLocator: string | Locator, value: string | undefined, order: 'ascending' | 'descending'
  ): Promise<void> {
    const METHOD = 'verifyNumericOrder';
    try {
      const elements = await this.buildLocator(strategyOrLocator, value).all();
      if (elements.length === 0) throw new Error(`No elements found`);
      const numbers: number[] = [];
      for (const el of elements) {
        const raw = (await el.textContent() ?? '').trim();
        const cleaned = raw.replace(/[^0-9.\-]/g, '').trim();
        const num = parseFloat(cleaned);
        if (isNaN(num)) throw new Error(`Cannot parse "${raw}" as a number`);
        numbers.push(num);
      }
      for (let i = 1; i < numbers.length; i++) {
        if (order === 'ascending' && numbers[i] < numbers[i - 1])
          throw new Error(`Order broken at [${i}]: ${numbers[i - 1]} > ${numbers[i]}`);
        if (order === 'descending' && numbers[i] > numbers[i - 1])
          throw new Error(`Order broken at [${i}]: ${numbers[i - 1]} < ${numbers[i]}`);
      }
      log.pass(`[${METHOD}] ${numbers.length} values in ${order} order: [${numbers.join(', ')}]`);
    } catch (e) { log.fail(`[${METHOD}] Numeric ${order} order | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }
  // ==========================================================================
  // 3. Verify string ascending/descending order
  // ==========================================================================
  async verifyStringOrder(
    strategyOrLocator: string | Locator, value: string | undefined, order: 'ascending' | 'descending'
  ): Promise<void> {
    const METHOD = 'verifyStringOrder';
    try {
      const elements = await this.buildLocator(strategyOrLocator, value).all();
      if (elements.length === 0) throw new Error(`No elements found`);
      const texts: string[] = [];
      for (const el of elements) texts.push((await el.textContent() ?? '').trim());
      for (let i = 1; i < texts.length; i++) {
        const cmp = texts[i - 1].localeCompare(texts[i]);
        if (order === 'ascending' && cmp > 0)
          throw new Error(`Order broken at [${i}]: "${texts[i - 1]}" > "${texts[i]}"`);
        if (order === 'descending' && cmp < 0)
          throw new Error(`Order broken at [${i}]: "${texts[i - 1]}" < "${texts[i]}"`);
      }
      log.pass(`[${METHOD}] ${texts.length} strings in ${order} order`);
    } catch (e) { log.fail(`[${METHOD}] String ${order} order | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.info(`[${METHOD}] "${dateString}" + ${daysToAdd} days = "${stored}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Add ${daysToAdd} days to "${dateString}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }

  // ==========================================================================
  // 5. Verify element text contains (case-insensitive)
  // ==========================================================================
  async verifyElementTextContainsCaseInsensitive(
    strategyOrLocator: string | Locator, value: string | undefined, testData: string
  ): Promise<void> {
    const METHOD = 'verifyElementTextContainsCaseInsensitive';
    try {
      const actual = (await this.buildLocator(strategyOrLocator, value).textContent() ?? '').trim();
      if (!actual.toLowerCase().includes(testData.toLowerCase()))
        throw new Error(`"${actual}" does not contain "${testData}"`);
      log.pass(`[${METHOD}] "${actual}" contains "${testData}" (case-insensitive)`);
    } catch (e) { log.fail(`[${METHOD}] Does not contain "${testData}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }

  // 6. Verify attribute contains (case-insensitive)
  async verifyAttributeContainsCaseInsensitive(
    strategyOrLocator: string | Locator, value: string | undefined, attributeName: string, testData: string
  ): Promise<void> {
    const METHOD = 'verifyAttributeContainsCaseInsensitive';
    try {
      const attrValue = (await this.buildLocator(strategyOrLocator, value).getAttribute(attributeName) ?? '');
      if (!attrValue.toLowerCase().includes(testData.toLowerCase()))
        throw new Error(`"${attributeName}"="${attrValue}" does not contain "${testData}"`);
      log.pass(`[${METHOD}] "${attributeName}"="${attrValue}" contains "${testData}" (case-insensitive)`);
    } catch (e) { log.fail(`[${METHOD}] attr "${attributeName}" does not contain "${testData}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }

  // ==========================================================================
  // 7. Verify input value contains (case-insensitive)
  // ==========================================================================
  async verifyElementValueContainsCaseInsensitive(
    strategyOrLocator: string | Locator, value: string | undefined, testData: string
  ): Promise<void> {
    const METHOD = 'verifyElementValueContainsCaseInsensitive';
    try {
      const inputValue = await this.buildLocator(strategyOrLocator, value).inputValue();
      if (!inputValue.toLowerCase().includes(testData.toLowerCase()))
        throw new Error(`"${inputValue}" does not contain "${testData}"`);
      log.pass(`[${METHOD}] Input value "${inputValue}" contains "${testData}" (case-insensitive)`);
    } catch (e) { log.fail(`[${METHOD}] Input value does not contain "${testData}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }

  // ==========================================================================
  // 8. Verify selected option in multiple dropdowns
  // ==========================================================================
  async verifySelectedOptionInMultipleDropdowns(
    strategyOrLocator: string | Locator, value: string | undefined, mode: 'contains' | 'not contains', expectedText: string
  ): Promise<void> {
    const METHOD = 'verifySelectedOptionInMultipleDropdowns';
    try {
      const elements = await this.buildLocator(strategyOrLocator, value).all();
      if (elements.length === 0) throw new Error(`No elements found`);
      for (let i = 0; i < elements.length; i++) {
        const selectedText = await elements[i].evaluate(
          (sel: HTMLSelectElement) => sel.options[sel.selectedIndex]?.text ?? ''
        );
        if (mode === 'contains' && !selectedText.includes(expectedText))
          throw new Error(`Dropdown [${i}] "${selectedText}" does not contain "${expectedText}"`);
        if (mode === 'not contains' && selectedText.includes(expectedText))
          throw new Error(`Dropdown [${i}] "${selectedText}" unexpectedly contains "${expectedText}"`);
      }
      log.pass(`[${METHOD}] All ${elements.length} dropdown(s) ${mode} "${expectedText}"`);
    } catch (e) { log.fail(`[${METHOD}] Dropdown check | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.info(`[${METHOD}] Day of "${dateString}" is "${dayName}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Get day from "${dateString}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.pass(`[${METHOD}] "${date1}" ${operator} "${date2}" → PASSED`);
    } catch (e) { log.fail(`[${METHOD}] Date comparison "${date1}" ${operator} "${date2}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.pass(`[${METHOD}] [${dataType}] "${testData1}" ${operator} "${testData2}" → PASSED`);
    } catch (e) { log.fail(`[${METHOD}] [${dataType}] "${testData1}" ${operator} "${testData2}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.pass(`[${METHOD}] [${dataType}] "${testData1}" ${operator} "${testData2}" → PASSED`);
    } catch (e) { log.fail(`[${METHOD}] [${dataType}] "${testData1}" ${operator} "${testData2}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.info(`[${METHOD}] Extracted "${result}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Extract after "${referenceText}" length ${length} | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.pass(`[${METHOD}] "${dateValue}" matches format "${dateFormat}"`);
    } catch (e) { log.fail(`[${METHOD}] "${dateValue}" format "${dateFormat}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.pass(`[${METHOD}] "${locator}" selected "${selectedText}" ${mode} "${expectedText}"`);
    } catch (e) { log.fail(`[${METHOD}] Dropdown "${locator}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }

  // ==========================================================================
  // 16. Verify multiple elements attribute same text
  // ==========================================================================
  async verifyMultipleElementsAttributeSameText(
    strategyOrLocator: string | Locator, value: string | undefined, attributeName: string, expectedText: string
  ): Promise<void> {
    const METHOD = 'verifyMultipleElementsAttributeSameText';
    try {
      const elements = await this.buildLocator(strategyOrLocator, value).all();
      if (elements.length === 0) throw new Error(`No elements found`);
      for (let i = 0; i < elements.length; i++) {
        const attrVal = await elements[i].getAttribute(attributeName) ?? '';
        if (attrVal !== expectedText)
          throw new Error(`Element [${i}] "${attributeName}"="${attrVal}" ≠ "${expectedText}"`);
      }
      log.pass(`[${METHOD}] All ${elements.length} element(s) "${attributeName}" = "${expectedText}"`);
    } catch (e) { log.fail(`[${METHOD}] Attribute same-text "${attributeName}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }

  // ==========================================================================
  // 17. Verify multiple elements have partial text
  // ==========================================================================
  async verifyMultipleElementsHavePartialText(
    strategyOrLocator: string | Locator,
    value: string | undefined,
    expectedText?: string
  ): Promise<void> {
    const METHOD = 'verifyMultipleElementsHavePartialText';
    try {
      // If first arg is Locator: (locator, expectedText)
      // If first arg is string strategy: (strategy, value, expectedText)
      const locator = this.buildLocator(strategyOrLocator, typeof strategyOrLocator !== 'string' ? undefined : value);
      const text = typeof strategyOrLocator !== 'string' ? value as string : expectedText as string;
      const elements = await locator.all();
      if (elements.length === 0) throw new Error(`No elements found`);

      for (const el of elements) {
        const elText = await el.textContent() || '';
        if (!elText.trim().toLowerCase().includes(text.trim().toLowerCase())) {
          throw new Error(`Element text "${elText.trim()}" does not contain "${text}"`);
        }
      }
      log.pass(`[${METHOD}] All ${elements.length} element(s) partially match: "${text}"`);
    } catch (e) { log.fail(`[${METHOD}] verifyMultipleElementsHavePartialText | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }
  // ==========================================================================
  // 18. Verify multiple elements attribute partial text
  // ==========================================================================
  async verifyMultipleElementsAttributePartialText(
    strategyOrLocator: string | Locator, value: string | undefined, attributeName: string, expectedText: string
  ): Promise<void> {
    const METHOD = 'verifyMultipleElementsAttributePartialText';
    try {
      const elements = await this.buildLocator(strategyOrLocator, value).all();
      if (elements.length === 0) throw new Error(`No elements found`);
      for (let i = 0; i < elements.length; i++) {
        const attrVal = await elements[i].getAttribute(attributeName) ?? '';
        if (!attrVal.includes(expectedText))
          throw new Error(`Element [${i}] "${attributeName}"="${attrVal}" does not contain "${expectedText}"`);
      }
      log.pass(`[${METHOD}] All ${elements.length} element(s) "${attributeName}" contains "${expectedText}"`);
    } catch (e) { log.fail(`[${METHOD}] Attr partial text "${attributeName}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }

  // ==========================================================================
  // 19. Verify multiple elements checked/unchecked
  // ==========================================================================
  async verifyMultipleElementsCheckedState(
    strategyOrLocator: string | Locator, value: string | undefined, state: 'checked' | 'unchecked'
  ): Promise<void> {
    const METHOD = 'verifyMultipleElementsCheckedState';
    try {
      const elements = await this.buildLocator(strategyOrLocator, value).all();
      if (elements.length === 0) throw new Error(`No elements found`);
      for (let i = 0; i < elements.length; i++) {
        const isChecked = await elements[i].isChecked();
        if (state === 'checked' && !isChecked) throw new Error(`Element [${i}] is NOT checked`);
        if (state === 'unchecked' && isChecked) throw new Error(`Element [${i}] IS checked`);
      }
      log.pass(`[${METHOD}] All ${elements.length} element(s) are ${state}`);
    } catch (e) { log.fail(`[${METHOD}] Checked state [${state}] | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.info(`[${METHOD}] "${sourceString}"[${start}:${end}] → "${result}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Replace [${start}:${end}] in "${sourceString}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.info(`[${METHOD}] "${string1}" → "${string2}" = "${result}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Replace all "${string1}" in "${string3}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.info(`[${METHOD}] "${charToAdd}" at pos ${startPosition} → "${result}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Add "${charToAdd}" at pos ${startPosition} | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.info(`[${METHOD}] "${charToAdd}" at end-offset ${endPosition} → "${result}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Add "${charToAdd}" at end-pos ${endPosition} | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.info(`[${METHOD}] First "${string1}" → "${string2}" = "${result}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Replace first "${string1}" in "${string3}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }

  // ==========================================================================
  // 25. Fetch texts from multiple elements → store JSON array in vars
  // ==========================================================================
  async fetchTextFromMultipleElements(
    strategyOrLocator: string | Locator, value: string | undefined, varName: string
  ): Promise<void> {
    const METHOD = 'fetchTextFromMultipleElements';
    try {
      const elements = await this.buildLocator(strategyOrLocator, value).all();
      if (elements.length === 0) throw new Error(`No elements found`);
      const texts: string[] = [];
      for (const el of elements) texts.push((await el.textContent() ?? '').trim());
      this.vars[varName] = JSON.stringify(texts);
      log.info(`[${METHOD}] Fetched ${texts.length} text(s) → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Fetch texts | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }

  // ==========================================================================
  // 26. Fetch attributes from multiple elements → store JSON array in vars
  // ==========================================================================
  async fetchAttributeFromMultipleElements(
    strategyOrLocator: string | Locator, value: string | undefined, attributeName: string, varName: string
  ): Promise<void> {
    const METHOD = 'fetchAttributeFromMultipleElements';
    try {
      const elements = await this.buildLocator(strategyOrLocator, value).all();
      if (elements.length === 0) throw new Error(`No elements found`);
      const values: string[] = [];
      for (const el of elements) values.push(await el.getAttribute(attributeName) ?? '');
      this.vars[varName] = JSON.stringify(values);
      log.info(`[${METHOD}] Fetched ${values.length} "${attributeName}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Fetch "${attributeName}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }

  // ==========================================================================
  // 27. Concatenate two strings → store in vars
  // ==========================================================================
  concatenate(testData1: string, testData2: string, varName: string): void {
    const METHOD = 'concatenate';
    try {
      const result = testData1 + testData2;
      this.vars[varName] = result;
      log.info(`[${METHOD}] "${testData1}" + "${testData2}" = "${result}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Concatenate "${testData1}" + "${testData2}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.info(`[${METHOD}] "${dateString}" (${inputFormat}) → "${converted}" (${outputFormat}) → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Convert "${dateString}" from "${inputFormat}" to "${outputFormat}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }

  // ==========================================================================
  // 29. Clear element and enter text
  // ==========================================================================
  async clearAndEnterText(
    strategyOrLocator: string | Locator, value: string | undefined, testData: string
  ): Promise<void> {
    const METHOD = 'clearAndEnterText';
    try {
      const el = this.buildLocator(strategyOrLocator, value);
      await el.clear();
      await el.fill(testData);
      const actual = await el.inputValue();
      if (actual !== testData) throw new Error(`After fill got "${actual}", expected "${testData}"`);
      log.info(`[${METHOD}] Filled with "${testData}"`);
    } catch (e) { log.error(`[${METHOD}] Clear and enter "${testData}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }
  // 30b. Add minutes to datetime → store in vars
  // Supports any format: date+time, time-only, custom separators
  // Examples:
  //   addMinutesToDatetime('10:30 AM', 'h:mm a', 1, 'h:mm a', 'Result') → '10:31 AM'
  //   addMinutesToDatetime('3/17/25 10:30 AM', 'M/d/yy h:mm a', 5, 'M/d/yy h:mm a', 'Result')
  // ==========================================================================
  addMinutesToDatetime(
    inputDatetime: string, inputFormat: string, minutes: number,
    outputFormat: string, varName: string
  ): void {
    const METHOD = 'addMinutesToDatetime';
    try {
      const parsed = parse(inputDatetime, inputFormat, new Date());
      const stored = format(addMinutes(parsed, minutes), outputFormat);
      this.vars[varName] = stored;
      log.info(`[${METHOD}] "${inputDatetime}" + ${minutes} min = "${stored}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Add ${minutes} min to "${inputDatetime}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.info(`[${METHOD}] "${inputDatetime}" - ${minutes} min = "${stored}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Subtract ${minutes} min from "${inputDatetime}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }

  // ==========================================================================
  // 31. Store character count → store in vars
  // ==========================================================================
  storeCharacterCount(sourceString: string, varName: string): void {
    const METHOD = 'storeCharacterCount';
    try {
      const count = String(sourceString.length);
      this.vars[varName] = count;
      log.info(`[${METHOD}] Length of "${sourceString}" is ${count} → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Count chars in "${sourceString}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }
  // 32. Split string by special character → store specific position in var
  // ==========================================================================
  splitBySpecialChar(sourceString: string, delimiter: string, position: string, varName: string): void {
    const METHOD = 'splitBySpecialChar';
    try {
      const pos = parseInt(position, 10);
      const parts = sourceString.split(delimiter).map(v => v.trim()).filter(v => v !== '');
      const value = parts[pos];
      if (value === undefined) {
        log.error(`[${METHOD}] Position ${pos} does not exist in "${sourceString}" split by "${delimiter}" | Error: Invalid position ${pos}`); throw new Error(`Invalid position ${pos}`);
        return;
      }
      this.vars[varName] = value;
      log.info(`[${METHOD}] Split "${sourceString}" by "${delimiter}" → position[${pos}] = "${value}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Split "${sourceString}" by "${delimiter}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.info(`[${METHOD}] "${string1}" + "${specialChar}" + "${string2}" = "${result}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Concatenate with "${specialChar}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }

  // ==========================================================================
  // 33. Concatenate with space → store in vars
  // ==========================================================================
  concatenateWithSpace(string1: string, string2: string, varName: string): void {
    const METHOD = 'concatenateWithSpace';
    try {
      const result = `${string1} ${string2}`;
      this.vars[varName] = result;
      log.info(`[${METHOD}] "${string1}" + " " + "${string2}" = "${result}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Concatenate with space | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }

  // ==========================================================================
  // 34. Trim whitespace → store in vars
  // ==========================================================================
  trimWhitespace(testData: string, varName: string): void {
    const METHOD = 'trimWhitespace';
    try {
      const result = testData.replace(/\s+/g, ''); // removes ALL whitespace including between words
      this.vars[varName] = result;
      log.info(`[${METHOD}] Trimmed "${testData}" → "${result}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Trim "${testData}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.info(`[${METHOD}] Removed "${specialChar}" from "${sourceString}" → "${result}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Remove "${specialChar}" from "${sourceString}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.info(`[${METHOD}] Removed [${specialChars.map(c => '"' + c + '"').join(', ')}] from "${sourceString}" → "${result}" → vars['${varName}']`);
    }
    catch (e) { log.error(`[${METHOD}] Remove multiple chars from "${sourceString}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }
  // ==========================================================================
  // 36. Verify testdata 1 with testdata2
  // ==========================================================================
  verifyString(
  testData: string,
  condition: 'contains' | 'notContains' | 'equals' | 'notEquals',
  testData1: string
): void {
  const METHOD = 'verifyString';
  try {
    // Guard: fail immediately if the expected value is empty or blank
    // Prevents false positives — e.g. "anyString".includes("") is always true in JS
    if (testData1 === null || testData1 === undefined || testData1.trim() === '') {
      throw new Error(`Expected value is empty or blank. Received: "${testData1}"`);
    }
     if (testData === null || testData === undefined || testData.trim() === '') {
      throw new Error(`Expected value is empty or blank. Received: "${testData}"`);
    }

    const conditions: Record<string, { result: boolean; pass: string; fail: string }> = {
      contains:    { result: testData.includes(testData1),  pass: `"${testData}" contains "${testData1}"`,              fail: `"${testData}" does not contain "${testData1}"` },
      notContains: { result: !testData.includes(testData1), pass: `"${testData}" does not contain "${testData1}"`,      fail: `"${testData}" unexpectedly contains "${testData1}"` },
      equals:      { result: testData === testData1,        pass: `"${testData}" equals "${testData1}"`,                fail: `"${testData}" does not equal "${testData1}"` },
      notEquals:   { result: testData !== testData1,        pass: `"${testData}" does not equal "${testData1}"`,        fail: `"${testData}" unexpectedly equals "${testData1}"` },
    };

    const check = conditions[condition];
    if (!check) throw new Error(`Invalid condition "${condition}"`);
    if (!check.result) throw new Error(check.fail);

    log.pass(`[${METHOD}] ${check.pass}`);
  } catch (e) {
    log.fail(`[${METHOD}] verifyString | "${testData}" ${condition} "${testData1}" | Error: ${e instanceof Error ? e.message : String(e)}`);
    throw (e instanceof Error ? e : new Error(String(e)));
  }
}
  // ==========================================================================
  // 37. Get character by index → store in vars
  // ==========================================================================
  getCharByIndex(sourceString: string, index: number | string, varName: string): void {
    const METHOD = 'getCharByIndex';
    try {
      const idx = typeof index === 'string' ? parseInt(index, 10) : index;
      if (isNaN(idx)) throw new Error(`Index "${index}" is not a valid number`);
      if (idx < 0 || idx >= sourceString.length)
        throw new Error(`Index ${idx} out of bounds (0 to ${sourceString.length - 1})`);
      const char = sourceString.substring(idx, idx + 1);
      this.vars[varName] = char;
      log.info(`[${METHOD}] Char at index [${idx}] in "${sourceString}" is "${char}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Get char at index ${index} from "${sourceString}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.info(`[${METHOD}] Current "${timeZone}" timestamp "${result}" (${timestampFormat}) → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Get current timestamp [${timeZone}] with format "${timestampFormat}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }

  //39.verifying the mathematic operation
  MathematicalOperation(a: string | number, operator: '+' | '-' | '*' | '/', b: string | number, varName: string): void {
    const METHOD = 'MathematicalOperation';
    try {
      // Strip currency symbols, commas and whitespace before parsing
      const clean = (val: string | number): number => {
        const cleaned = String(val).replace(/[$,\s%]/g, '').trim();
        const num = parseFloat(cleaned);
        if (isNaN(num)) throw new Error(`"${val}" is not a valid number (cleaned: "${cleaned}")`);
        return num;
      };
      const numA = clean(a);
      const numB = clean(b);
      const ops: Record<string, () => number> = {
        '+': () => numA + numB,
        '-': () => numA - numB,
        '*': () => numA * numB,
        '/': () => { if (numB === 0) throw new Error('Division by zero'); return numA / numB; },
      };
      if (!ops[operator]) throw new Error(`Invalid operator: "${operator}"`);
      const result = ops[operator]();
      this.vars[varName] = String(result);
      log.info(`[${METHOD}] ${numA} ${operator} ${numB} = ${result} → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] ${a} ${operator} ${b} | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
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
      log.pass(`[${METHOD}] ${a} ${operator} ${b} → PASSED`);
    } catch (e) { log.fail(`[${METHOD}] ${value1} ${operator} ${value2} | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }
  //Trim the string and store in vars
  trimtestdata(value: string, varName: string): void {
    const trimmed = value.trim();
    this.vars[varName] = trimmed;
    log.info(`[trimtestdata] Trimmed value stored in '${varName}': '${trimmed}'`);
  }
  // 33. Get month name by month number → store in vars
  // ==========================================================================
  getMonthNameByNumber(monthNumber: string, varName: string): void {
    const METHOD = 'getMonthNameByNumber';
    try {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const index = parseInt(monthNumber, 10) - 1;
      if (index < 0 || index > 11) {
        log.error(`[${METHOD}] Invalid month number "${monthNumber}". Must be between 1 and 12. | Error: Invalid month number: ${monthNumber}`); throw new Error(`Invalid month number: ${monthNumber}`);
        return;
      }
      const monthName = monthNames[index];
      this.vars[varName] = monthName;
      log.info(`[${METHOD}] Month number "${monthNumber}" → "${monthName}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Get month name for month number "${monthNumber}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }
  // 34. Remove characters from first and last position → store in vars
  // ==========================================================================
  removeCharactersFromPosition(sourceString: string, firstCount: string, lastCount: string, varName: string): void {
    const METHOD = 'removeCharactersFromPosition';
    try {
      const first = parseInt(firstCount, 10) || 0;
      const last = parseInt(lastCount, 10) || 0;
      const result = sourceString.substring(first, last === 0 ? undefined : sourceString.length - last);
      this.vars[varName] = result;
      log.info(`[${METHOD}] Removed ${first} from start and ${last} from end of '${sourceString}' = '${result}' → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Remove characters from "${sourceString}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }
  //verifying the element contains text with ignore case
  async verifyElementContainsTextIgnoreCase(element: Locator, expectedText: string): Promise<void> {
    const METHOD = 'verifyElementContainsTextIgnoreCase';
    const actualText = await element.textContent() || '';
    const actual = actualText.trim().toLowerCase();
    const expected = expectedText.trim().toLowerCase();
    if (actual.includes(expected)) {
      log.pass(`[${METHOD}] Element contains "${expectedText}" (case-insensitive)`);
    } else {
      log.fail(`[${METHOD}] Expected to contain "${expectedText}" (case-insensitive) | Error: Got: "${actualText.trim()}"`); throw new Error(`Got: "${actualText.trim()}"`);
    }
  }
  /**
 * Verifies that textData1 equals or contains textData2 (case-insensitive).
 * Throws synchronously on failure so execution stops immediately.
 *
 * Usage:
 *   Methods.verifyTestdataIgnoreCase(vars['HeaderUI'], 'contains', vars['HeaderExcel']);
 */
verifyTestdataIgnoreCase(
  textData1: string,
  matchType: 'equals' | 'contains',
  textData2: string
): void {
  const METHOD = 'verifyTestdataIgnoreCase';
  const actual   = textData1.trim().toLowerCase();
  const expected = textData2.trim().toLowerCase();

  if (!expected) {
    log.fail(`[${METHOD}] Expected value is empty or blank for comparison with "${textData1}" | Error: Empty expected value`);
    throw new Error(`Empty expected value`);
  }

  const isMatch = matchType === 'equals'
    ? actual === expected
    : actual.includes(expected);

  if (isMatch) {
    log.pass(`[${METHOD}] "${textData1}" ${matchType} "${textData2}" (case-insensitive)`);
  } else {
    log.fail(`[${METHOD}] "${textData1}" does not ${matchType} "${textData2}" (case-insensitive)`);
    throw new Error(`Expected "${textData1}" to ${matchType} "${textData2}" (case-insensitive)`);
  }
}
  //count the substrings
  countCharacter(text: string, character: string, varName: string): void {
    const METHOD = 'countCharacter';
    try {
      if (!text) throw new Error(`Input text is null or undefined`);
      if (!character) throw new Error(`Character to count is null or undefined`);
      const count = text.split(character).length - 1;
      this.vars[varName] = String(count);
      log.info(`[${METHOD}] Count of "${character}" in "${text}" = ${count} → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Count "${character}" in "${text}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }
  //spliting the string with first and last positions
  splitRangeOfCharacters(source: string, start: number, end: number, varName: string): void {
    const METHOD = 'splitRangeOfCharacters';
    try {
      if (!source) throw new Error(`Source string is empty or undefined`);
      if (start < 0 || end > source.length || start >= end) throw new Error(`Invalid range [${start}:${end}] for string of length ${source.length}`);
      const result = source.substring(start, end);
      this.vars[varName] = result;
      log.info(`[${METHOD}] Split range [${start}:${end}] from "${source}" = "${result}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Split range [${start}:${end}] from "${source}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }
  //subtract the days from given date
  subtractDaysFromDate(inputDate: string, daysToSubtract: number, inputFormat: string, outputFormat: string, varName: string): void {
    const METHOD = 'subtractDaysFromDate';
    try {
      const parsed = parse(inputDate, inputFormat, new Date());
      if (isNaN(parsed.getTime())) throw new Error(`"${inputDate}" could not be parsed with format "${inputFormat}"`);
      parsed.setDate(parsed.getDate() - daysToSubtract);
      const result = format(parsed, outputFormat);
      this.vars[varName] = result;
      log.info(`[${METHOD}] ${inputDate} - ${daysToSubtract} day(s) = ${result} → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Subtract ${daysToSubtract} day(s) from "${inputDate}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }
  //verification of ascending or descending order based on date format
  async verifyDateOrder(
    locator: Locator,
    order: 'ascending' | 'descending',
    dateFormat: string
  ): Promise<void> {
    const METHOD = 'verifyDateOrder';
    try {
      const elements = await locator.all();
      if (elements.length === 0) throw new Error(`No elements found`);
      const dates: Date[] = [];
      for (const el of elements) {
        const text = (await el.textContent() ?? '').trim();
        const parsed = parse(text, dateFormat, new Date());
        if (isNaN(parsed.getTime())) throw new Error(`Cannot parse "${text}" as date with format "${dateFormat}"`);
        dates.push(parsed);
      }
      for (let i = 1; i < dates.length; i++) {
        if (order === 'ascending' && dates[i] < dates[i - 1])
          throw new Error(`Order broken at [${i}]: "${format(dates[i - 1], dateFormat)}" > "${format(dates[i], dateFormat)}"`);
        if (order === 'descending' && dates[i] > dates[i - 1])
          throw new Error(`Order broken at [${i}]: "${format(dates[i - 1], dateFormat)}" < "${format(dates[i], dateFormat)}"`);
      }
      log.pass(`[${METHOD}] ${dates.length} dates in ${order} order with format "${dateFormat}"`);
    } catch (e) { log.fail(`[${METHOD}] Date ${order} order | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }
  splitStringByRegConditionWithPosition(sourceString: string, delimiter: string, position: string | number, varName: string): void {
    const METHOD = 'splitStringByRegConditionWithPosition';
    try {
      if (!sourceString) throw new Error(`Source string is empty or undefined`);
      if (!delimiter) throw new Error(`Delimiter is empty or undefined`);
      const parts = sourceString.split(delimiter);
      const pos = typeof position === 'string' ? parseInt(position, 10) : position;
      if (isNaN(pos)) throw new Error(`Position "${position}" is not a valid number`);
      const index = pos - 1;
      if (index < 0 || index >= parts.length)
        throw new Error(`Position ${pos} out of range. "${sourceString}" split by "${delimiter}" has ${parts.length} part(s) [1 to ${parts.length}]`);
      const result = parts[index];
      this.vars[varName] = result;
      log.info(`[${METHOD}] Split "${sourceString}" by "${delimiter}" → position[${pos}] = "${result}" → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] Split "${sourceString}" by "${delimiter}" at position ${position} | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }
  getMonthFromDate(dateText: string): string {
    const METHOD = 'getMonthFromDate';
    try {
      const uploadedDate = new Date(dateText.trim());
      if (isNaN(uploadedDate.getTime())) throw new Error(`Invalid date format: ${dateText}`);
      const month = String(uploadedDate.getMonth() + 1).padStart(2, '0');
      log.info(`[${METHOD}] Extracted month "${month}" from date "${dateText}"`);
      return month;
    } catch (e) {
      log.error(`[${METHOD}] Get month from date "${dateText}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e)));
    }
  }
  verifyDateStringMonthMatchesExpectedMonth(
    uploadedDateText: string,
    expectedMonth: string
  ): void {
    const METHOD = 'verifyDateStringMonthMatchesExpectedMonth';
    try {
      const uploadedMonth = this.getMonthFromDate(uploadedDateText.trim());
      if (uploadedMonth !== expectedMonth)
        throw new Error(`Month extracted from date "${uploadedDateText}" is "${uploadedMonth}" but expected "${expectedMonth}"`);
      log.pass(`[${METHOD}] Month "${uploadedMonth}" extracted from "${uploadedDateText}" matches expected month "${expectedMonth}"`);
    } catch (e) { log.fail(`[${METHOD}] Verify month from date "${uploadedDateText}" matches expected month "${expectedMonth}" | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }
  //perform arithmetic operation and store the results with decimal
  performArithmetic(
    value1: string,
    operation: 'ADDITION' | 'SUBTRACTION' | 'MULTIPLICATION' | 'DIVISION',
    value2: string,
    varName: string,
    decimalPlaces: number = 0
  ): void {
    const METHOD = 'performArithmetic';
    try {
      const clean = (val: string): string =>
        String(val)
          .replace(/\(.*?\)/g, '')
          .replace(/[^\d.\-]/g, '')
          .trim();
      const cleaned1 = clean(value1);
      const cleaned2 = clean(value2);
      const num1 = parseFloat(cleaned1);
      const num2 = parseFloat(cleaned2);
      if (isNaN(num1)) throw new Error(`value1 is not a valid number: '${value1}' → cleaned: '${cleaned1}'`);
      if (isNaN(num2)) throw new Error(`value2 is not a valid number: '${value2}' → cleaned: '${cleaned2}'`);
      if (operation === 'DIVISION' && num2 === 0) throw new Error(`Division by zero is not allowed`);
      let result: number;
      switch (operation) {
        case 'ADDITION': result = num1 + num2; break;
        case 'SUBTRACTION': result = num1 - num2; break;
        case 'MULTIPLICATION': result = num1 * num2; break;
        case 'DIVISION': result = num1 / num2; break;
        default: throw new Error(`Unsupported operation: '${operation}'`);
      }
      this.vars[varName] = result.toFixed(decimalPlaces);
      log.info(`[${METHOD}] '${value1}' ${operation} '${value2}' = ${this.vars[varName]} → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] performArithmetic '${value1}' ${operation} '${value2}' | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }
  //Get last no.of character by index
  getLastCharacters(value: string, Index: string, varName: string): void {
    const METHOD = 'getLastCharacters';
    try {
      const n = parseInt(String(Index));
      if (isNaN(n) || n < 0) throw new Error(`count is not a valid number: '${Index}'`);
      const result = String(value).slice(-n);
      this.vars[varName] = result;
      log.info(`[${METHOD}] Last ${n} character(s) of '${value}' = '${result}' → vars['${varName}']`);
    } catch (e) { log.error(`[${METHOD}] getLastCharacters '${value}' count '${Index}' | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }
  // 19b. Verify multiple elements have the same DOM state
  //      state: 'enabled' | 'disabled' | 'visible' | 'hidden' |
  //             'present' | 'notPresent' | 'clickable' | 'notClickable'
  // ==========================================================================
  async verifyMultipleElementsState(
    locator: Locator,
    state: 'enabled' | 'disabled' | 'visible' | 'hidden' | 'present' | 'notPresent' | 'clickable' | 'notClickable'
  ): Promise<void> {
    const METHOD = 'verifyMultipleElementsState';
    try {
      const elements = await locator.all();
      if (elements.length === 0) throw new Error(`No elements found`);

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        let passed = false;

        switch (state) {
          case 'enabled':
            passed = await el.isEnabled();
            if (!passed) throw new Error(`Element [${i}] is DISABLED but expected to be ENABLED`);
            break;
          case 'disabled':
            passed = await el.isDisabled();
            if (!passed) throw new Error(`Element [${i}] is ENABLED but expected to be DISABLED`);
            break;
          case 'visible':
            passed = await el.isVisible();
            if (!passed) throw new Error(`Element [${i}] is HIDDEN but expected to be VISIBLE`);
            break;
          case 'hidden':
            passed = await el.isHidden();
            if (!passed) throw new Error(`Element [${i}] is VISIBLE but expected to be HIDDEN`);
            break;
          case 'present':
            passed = (await el.count()) > 0;
            if (!passed) throw new Error(`Element [${i}] is NOT PRESENT in the DOM`);
            break;
          case 'notPresent':
            passed = (await el.count()) === 0;
            if (!passed) throw new Error(`Element [${i}] is PRESENT in the DOM but expected NOT PRESENT`);
            break;
          case 'clickable':
            passed = await el.isEnabled() && await el.isVisible();
            if (!passed) throw new Error(`Element [${i}] is NOT CLICKABLE — must be both enabled and visible`);
            break;
          case 'notClickable':
            passed = await el.isDisabled() || await el.isHidden();
            if (!passed) throw new Error(`Element [${i}] is CLICKABLE but expected NOT CLICKABLE`);
            break;
        }
      }

      log.pass(`[${METHOD}] All ${elements.length} element(s) are ${state}`);
    } catch (e) { log.fail(`[${METHOD}] State [${state}] | Error: ${e instanceof Error ? e.message : String(e)}`); throw (e instanceof Error ? e : new Error(String(e))); }
  }
  /**
 * Splits the given string by whitespace and stores the value
 * at the specified position into the target runtime variable.
 *
 * @param value       - The string to split
 * @param position    - The index (as string) of the part to extract (0-based)
 * @param targetVar   - The runtime variable key to store the result in
 *
 * Usage:
 *   Methods.splitByWhiteSpace(vars['LastCommittedBid'], '0', 'LastCommittedBidDate');
 *   Methods.splitByWhiteSpace(vars['LastCommittedBid'], '1', 'LastCommittedBidTime');
 *   Methods.splitByWhiteSpace(vars['LastCommittedBid'], '2', 'LastCommittedBidPeriod');
 */
  splitByWhiteSpace(value: string, position: string, targetVar: string): void {
  try {
    const parts = String(value).split(' ');
    const index = parseInt(position, 10);
    const result = parts[index] !== undefined ? parts[index] : '';
    this.vars[targetVar] = result;
    log.info(`splitByWhiteSpace | Input: "${value}" | Position: ${position} | Result: "${result}" | StoredIn: ${targetVar}`);
  } catch (e) {
    log.error(`splitByWhiteSpace failed | Input: "${value}" | Position: ${position} | Error: ${e}`);
    throw e;
  }
}
// ─── Random Generators ─────────────────────────────────────────────────────

  /**
   * Generates a random number with the specified number of digits
   * and stores it in the target runtime variable.
   *
   * @param digits    - Number of digits in the generated number (as string)
   * @param targetVar - The runtime variable key to store the result in
   *
   * Usage:
   *   Methods.generateRandomNumber('3', 'RandomNum');  // → e.g. "472"
   *   Methods.generateRandomNumber('6', 'RandomNum');  // → e.g. "839201"
   */
  generateRandomNumber(digits: string, targetVar: string): void {
    const length = parseInt(digits, 10);
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    const result = String(Math.floor(Math.random() * (max - min + 1)) + min);
    this.vars[targetVar] = result;
    log.info(`generateRandomNumber | Digits: ${digits} | Result: "${result}" | StoredIn: ${targetVar}`);
  }

  /**
   * Generates a random alphanumeric string with the specified length
   * and stores it in the target runtime variable.
   *
   * @param length    - Length of the generated string (as string)
   * @param targetVar - The runtime variable key to store the result in
   *
   * Usage:
   *   Methods.generateRandomString('4', 'RandomStr');  // → e.g. "A3KP"
   *   Methods.generateRandomString('8', 'RandomStr');  // → e.g. "B7XQ2MNT"
   */
  generateRandomString(length: string, targetVar: string): void {
    const len = parseInt(length, 10);
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.vars[targetVar] = result;
    log.info(`generateRandomString | Length: ${length} | Result: "${result}" | StoredIn: ${targetVar}`);
  }

/**
 * Gets a CSS property value of an element and stores it into a target variable.
 *
 * @param locator    - Playwright Locator of the element
 * @param property   - CSS property name (e.g. 'color', 'background-color', 'font-size')
 * @param targetVar  - Variable name to store the result in vars
 *
 * Usage:
 *   await Methods.getCSSProperty(priceOfferedPage.Duplicate_Loantext_box_popup, 'color', 'ColorValueDuplicateLoan');
 *   log.info('ColorValueDuplicateLoan: ' + vars['ColorValueDuplicateLoan']);
 */
async getCSSProperty(
  locator: Locator,
  property: string,
  targetVar: string
): Promise<void> {
  const METHOD = 'getCSSProperty';

  if (!property || property.trim() === '') {
    log.fail(`[${METHOD}] CSS property name is empty or blank | Error: Empty property`);
    throw new Error(`Empty CSS property name`);
  }

  if (!targetVar || targetVar.trim() === '') {
    log.fail(`[${METHOD}] Target variable name is empty or blank | Error: Empty targetVar`);
    throw new Error(`Empty target variable name`);
  }

  const value: string = await locator.evaluate(
    (el: HTMLElement, prop: string) => window.getComputedStyle(el).getPropertyValue(prop),
    property
  );

  this.vars[targetVar] = value.trim();
  log.pass(`[${METHOD}] CSS property "${property}" = "${this.vars[targetVar]}" stored in "${targetVar}"`);
}
/**
 * Calculates the time difference between two timestamps and stores the result in a target variable.
 *
 * @param timestamp1  - First timestamp string (e.g. vars['CurrentTime'])
 * @param timestamp2  - Second timestamp string (e.g. vars['CommitTime'])
 * @param unit        - Unit of result: 'HOURS' | 'MINUTES' | 'SECONDS' | 'HH:MM:SS' | 'HH:MM'
 * @param targetVar   - Variable name to store the result in vars
 *
 * Usage:
 *   Methods.calculateTimeDifference(vars['CurrentTime'], vars['CommitTime'], 'HOURS', 'TimeDiff');
 *   Methods.calculateTimeDifference(vars['CurrentTime'], vars['CommitTime'], 'MINUTES', 'TimeDiff');
 *   Methods.calculateTimeDifference(vars['CurrentTime'], vars['CommitTime'], 'HH:MM:SS', 'TimeDiff');
 *   Methods.calculateTimeDifference(vars['CurrentTime'], vars['CommitTime'], 'HH:MM', 'TimeDiff');
 */
calculateTimeDifference(
  timestamp1: string,
  timestamp2: string,
  unit: 'HOURS' | 'MINUTES' | 'SECONDS' | 'HH:MM:SS' | 'HH:MM',
  targetVar: string
): void {
  const METHOD = 'calculateTimeDifference';

  if (!timestamp1 || timestamp1.trim() === '') {
    log.info(`[${METHOD}] timestamp1 is empty or blank`);
    throw new Error(`Empty timestamp1`);
  }

  if (!timestamp2 || timestamp2.trim() === '') {
    log.info(`[${METHOD}] timestamp2 is empty or blank`);
    throw new Error(`Empty timestamp2`);
  }

  if (!targetVar || targetVar.trim() === '') {
    log.info(`[${METHOD}] Target variable name is empty or blank`);
    throw new Error(`Empty target variable name`);
  }

  const parseTime = (input: string): number => {
    const fullDate = new Date(input);
    if (!isNaN(fullDate.getTime())) return fullDate.getTime();

    const match = input.trim().match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const meridian = match[3].toUpperCase();

      if (meridian === 'PM' && hours !== 12) hours += 12;
      if (meridian === 'AM' && hours === 12) hours = 0;

      const now = new Date();
      now.setHours(hours, minutes, 0, 0);
      return now.getTime();
    }

    return NaN;
  };

  const date1 = parseTime(timestamp1);
  const date2 = parseTime(timestamp2);

  if (isNaN(date1)) {
    log.info(`[${METHOD}] timestamp1 "${timestamp1}" is not a valid date`);
    throw new Error(`Invalid timestamp1: "${timestamp1}"`);
  }

  if (isNaN(date2)) {
    log.info(`[${METHOD}] timestamp2 "${timestamp2}" is not a valid date`);
    throw new Error(`Invalid timestamp2: "${timestamp2}"`);
  }

  const diffMs = Math.abs(date1 - date2);
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

  let result: string;

  switch (unit) {
    case 'HOURS':
      result = String(diffHrs);
      break;
    case 'MINUTES':
      result = String(diffMins);
      break;
    case 'SECONDS':
      result = String(diffSecs);
      break;
    case 'HH:MM:SS': {
      const hh = String(Math.floor(diffMs / (1000 * 60 * 60))).padStart(2, '0');
      const mm = String(Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      const ss = String(Math.floor((diffMs % (1000 * 60)) / 1000)).padStart(2, '0');
      result = `${hh}:${mm}:${ss}`;
      break;
    }
    case 'HH:MM': {
      const hh = String(Math.floor(diffMs / (1000 * 60 * 60))).padStart(2, '0');
      const mm = String(Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      result = `${hh}:${mm}`;
      break;
    }
    default:
      log.info(`[${METHOD}] Invalid unit "${unit}"`);
      throw new Error(`Invalid unit: "${unit}"`);
  }

  this.vars[targetVar] = result;
  log.info(`[${METHOD}] Time difference between "${timestamp1}" and "${timestamp2}" in ${unit} = "${result}" stored in "${targetVar}"`);
}
/**
 * Generates a random integer between min and max (inclusive) and stores in targetVar.
 *
 * @param min        - Minimum value (inclusive)
 * @param max        - Maximum value (inclusive)
 * @param targetVar  - Variable name to store the result in vars
 *
 * Usage:
 *   Methods.generateRandomInteger('3', '6', 'RandomInteger');
 *   // vars['RandomInteger'] could be '3', '4', '5', or '6'
 *
 *   Methods.generateRandomInteger('1', '100', 'RandomNumber');
 *   // vars['RandomNumber'] could be any integer from 1 to 100
 */
generateRandomInteger(
  min: string | number,
  max: string | number,
  targetVar: string
): void {
  const METHOD = 'generateRandomInteger';

  const minVal = typeof min === 'string' ? parseInt(min, 10) : min;
  const maxVal = typeof max === 'string' ? parseInt(max, 10) : max;

  if (isNaN(minVal)) {
    log.info(`[${METHOD}] Min value "${min}" is not a valid integer`);
    throw new Error(`Invalid min value: "${min}"`);
  }

  if (isNaN(maxVal)) {
    log.info(`[${METHOD}] Max value "${max}" is not a valid integer`);
    throw new Error(`Invalid max value: "${max}"`);
  }

  if (minVal > maxVal) {
    log.info(`[${METHOD}] Min (${minVal}) must be less than or equal to Max (${maxVal})`);
    throw new Error(`Min (${minVal}) is greater than Max (${maxVal})`);
  }

  if (!targetVar || targetVar.trim() === '') {
    log.info(`[${METHOD}] Target variable name is empty or blank`);
    throw new Error(`Empty target variable name`);
  }

  const result = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
  this.vars[targetVar] = String(result);

  log.info(`[${METHOD}] Random integer between ${minVal} and ${maxVal} = "${result}" stored in "${targetVar}"`);
}
}