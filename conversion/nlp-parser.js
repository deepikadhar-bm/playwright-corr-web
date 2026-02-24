/**
 * NLP Parser - Maps Testsigma NLP template IDs to Playwright TypeScript code.
 *
 * Each handler receives:
 *   - step: the full step object
 *   - ctx: { dataLoader, resolveElement(name), resolveData(key) }
 *
 * Returns: { code: string, confidence: 'high'|'medium'|'low', warnings: string[] }
 */

class NlpParser {
  constructor(dataLoader) {
    this.dataLoader = dataLoader;
    this.handlers = this.buildHandlers();
    this.kibbutzHandlers = this.buildKibbutzHandlers();
    this.stats = { high: 0, medium: 0, low: 0, unknown: 0 };
  }

  /**
   * Parse a single test step into Playwright code.
   */
  parse(step) {
    if (step.disabled) {
      const inner = this._parseEnabled(step);
      return {
        code: `// [DISABLED] ${step.action || 'Step group'}\n// ${inner.code.split('\n').join('\n// ')}`,
        confidence: inner.confidence,
        warnings: inner.warnings,
        disabled: true,
      };
    }
    return this._parseEnabled(step);
  }

  _parseEnabled(step) {
    // Handle step groups
    if (step.type === 'STEP_GROUP') {
      return this.handleStepGroup(step);
    }

    // Handle BLOCK type (condition/loop containers)
    if (step.type === 'BLOCK') {
      return this.handleBlock(step);
    }

    // Handle API steps
    if (step.type === 'API_STEP') {
      return this._convertApiStep(step);
    }

    // Handle BREAK_LOOP
    if (step.type === 'BREAK_LOOP') {
      return {
        code: `break;`,
        confidence: 'high',
        warnings: [],
      };
    }

    // Look up handler by templateId
    if (step.templateId === null || step.templateId === undefined) {
      // Check for Kibbutz plugin NLP action
      if (step.kibbutzPluginNlpId) {
        const kHandler = this.kibbutzHandlers.get(step.kibbutzPluginNlpId);
        if (kHandler) {
          try {
            const result = kHandler(step, this.makeKibbutzContext(step));
            this.stats[result.confidence]++;
            return result;
          } catch (e) {
            this.stats.low++;
            return {
              code: `// TODO: Kibbutz plugin ${step.kibbutzPluginNlpId} error: ${e.message}\n// Action: ${(step.action || '').substring(0, 100)}`,
              confidence: 'low',
              warnings: [`Kibbutz handler error: ${e.message}`],
            };
          }
        }
        // Unknown kibbutz plugin
        this.stats.unknown++;
        return {
          code: `// TODO: Unknown kibbutz plugin ${step.kibbutzPluginNlpId}\n// Action: ${(step.action || '').substring(0, 100)}`,
          confidence: 'low',
          warnings: [`Unknown kibbutz plugin ID: ${step.kibbutzPluginNlpId}`],
        };
      }
      // Step with no template and no kibbutz plugin
      this.stats.unknown++;
      const action = step.action || 'Unknown step';
      return {
        code: `// TODO: No template - ${action.substring(0, 100)}`,
        confidence: 'low',
        warnings: [`Step has no templateId: ${action.substring(0, 60)}`],
      };
    }
    const handler = this.handlers.get(step.templateId);
    if (handler) {
      try {
        const result = handler(step, this.makeContext(step));
        this.stats[result.confidence]++;
        return result;
      } catch (e) {
        this.stats.low++;
        return {
          code: `// TODO: Handler error for template ${step.templateId}: ${e.message}\n// Action: ${step.action}`,
          confidence: 'low',
          warnings: [`Handler error: ${e.message}`],
        };
      }
    }

    // Unknown template
    this.stats.unknown++;
    return {
      code: `// TODO: Manual conversion needed - unknown template ${step.templateId}\n// Action: ${step.action}`,
      confidence: 'low',
      warnings: [`Unknown template ID: ${step.templateId}`],
    };
  }

  handleStepGroup(step) {
    const groupId = step.stepGroupId;
    const groupName = step.action || `StepGroup_${groupId}`;
    const fnName = this.stepGroupToFunctionName(groupName);

    // Check if step group exists in loaded data
    const hasGroup = this.dataLoader.stepGroups.has(groupId);
    const warnings = hasGroup ? [] : [`Step group ${groupId} not loaded - function may not exist`];

    return {
      code: `await stepGroups.${fnName}(page, vars);`,
      confidence: hasGroup ? 'high' : 'medium',
      warnings,
    };
  }

  handleBlock(step) {
    // BLOCK steps are containers - the actual condition is on child steps
    return {
      code: `// Block container`,
      confidence: 'high',
      warnings: [],
      isBlock: true,
    };
  }

  makeContext(step) {
    const self = this;
    return {
      dataLoader: this.dataLoader,
      resolveElement(nameOrIndex) {
        // Get element name - either from parameter or testStepElements
        let elementName = nameOrIndex;
        if (step.testStepElements && step.testStepElements.length > 0) {
          const idx = typeof nameOrIndex === 'number' ? nameOrIndex : 0;
          const el = step.testStepElements[idx];
          if (el) elementName = el.name;
        }
        const resolved = self.dataLoader.resolveElement(elementName, step);
        if (!resolved) {
          return { locator: `/* MISSING: ${elementName} */ '//*'`, name: elementName, missing: true };
        }
        return {
          locator: JSON.stringify(resolved.definition),
          name: resolved.name,
          missing: false,
        };
      },
      resolveData(key) {
        if (!step.stepDataList) return { code: "''", type: 'raw' };
        const entry = step.stepDataList.find(d => d.key === key);
        return self.dataLoader.resolveDataValue(entry);
      },
      getElement(index = 0) {
        if (step.testStepElements && step.testStepElements[index]) {
          const el = step.testStepElements[index];
          const resolved = self.dataLoader.resolveElement(el.name, step);
          if (resolved) {
            return { locator: JSON.stringify(resolved.definition), name: el.name, missing: false };
          }
        }
        return { locator: "'//*'", name: 'MISSING', missing: true };
      },
    };
  }

  stepGroupToFunctionName(name) {
    // Convert step group name to valid JS function name
    return 'stepGroup_' + name
      .replace(/[^a-zA-Z0-9_\s]/g, '')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .substring(0, 60);
  }

  buildHandlers() {
    const handlers = new Map();

    // ============ CLICK ACTIONS ============

    // 109: Click on <Element>
    handlers.set(109, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await page.locator(${el.locator}).click();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 97: Double click on <Element>
    handlers.set(97, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await page.locator(${el.locator}).dblclick();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 1023: Click on <Element> using javascript executor
    handlers.set(1023, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await page.locator(${el.locator}).evaluate(el => (el as HTMLElement).click());`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 328: Click on <Element> if visible
    handlers.set(328, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `if (await page.locator(${el.locator}).isVisible()) {\n  await page.locator(${el.locator}).click();\n}`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 1130: Click on text <Text>
    handlers.set(1130, (step, ctx) => {
      const data = ctx.resolveData('testData');
      return {
        code: `await page.getByText(${data.code}).click();`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 1039: Click on <Element> with text containing <Text>
    handlers.set(1039, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await page.locator(${el.locator}).filter({ hasText: ${data.code} }).click();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // ============ INPUT ACTIONS ============

    // 971: Enter <Value> in the <Element> field
    handlers.set(971, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await page.locator(${el.locator}).fill(${data.code});`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 111: Clear the text displayed in the <Element> field
    handlers.set(111, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await page.locator(${el.locator}).clear();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 110: Clear the value displayed in the <Element> field
    handlers.set(110, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await page.locator(${el.locator}).clear();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // ============ WAIT ACTIONS ============

    // 1080: Wait until the element <Element> is <visible/not visible>
    handlers.set(1080, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      const state = (data.code || '').includes('not visible') ? 'hidden' : 'visible';
      return {
        code: `await page.locator(${el.locator}).waitFor({ state: '${state}' });`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 4: Wait until the current page is loaded completely
    handlers.set(4, () => ({
      code: `await page.waitForLoadState('networkidle');`,
      confidence: 'high',
      warnings: [],
    }));

    // 27: Wait for <N> seconds
    handlers.set(27, (step, ctx) => {
      const data = ctx.resolveData('testData');
      const isRuntime = data.type === 'runtime';
      if (isRuntime) {
        return {
          code: `await page.waitForTimeout(parseInt(${data.code}) * 1000);`,
          confidence: 'high',
          warnings: [],
        };
      }
      const seconds = parseInt(data.code.replace(/['"]/g, '')) || 1;
      return {
        code: `await page.waitForTimeout(${seconds * 1000});`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 1: Wait until the text <Text> is present on the current page
    handlers.set(1, (step, ctx) => {
      const data = ctx.resolveData('testData');
      return {
        code: `await page.getByText(${data.code}).waitFor({ state: 'visible' });`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 2: Wait until the text <Text> is absent on the current page
    handlers.set(2, (step, ctx) => {
      const data = ctx.resolveData('testData');
      return {
        code: `await page.getByText(${data.code}).waitFor({ state: 'hidden' });`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 1053: Wait until download is complete only for chrome
    handlers.set(1053, () => ({
      code: `// Wait for download - handled by Playwright download events\nawait page.waitForTimeout(2000);`,
      confidence: 'medium',
      warnings: ['Download wait may need custom handling'],
    }));

    // ============ VERIFY / ASSERT ACTIONS ============

    // 1079: Verify that the element <Element> is displayed
    handlers.set(1079, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await expect(page.locator(${el.locator})).toBeVisible();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 1086: Element <Element> is visible
    handlers.set(1086, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await expect(page.locator(${el.locator})).toBeVisible();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 970: Verify that the element <Element> displays text contains <Value>
    handlers.set(970, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator})).toContainText(${data.code});`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 71: Verify that the element <Element> displays text <Value> (exact)
    handlers.set(71, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator})).toContainText(${data.code});`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 35: Verify that the current page displays text <Text>
    handlers.set(35, (step, ctx) => {
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.getByText(${data.code})).toBeVisible();`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 1032: Verify that the current page does not display text <Text>
    handlers.set(1032, (step, ctx) => {
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.getByText(${data.code})).not.toBeVisible();`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 36: Verify that the current page displays an element <Element>
    handlers.set(36, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await expect(page.locator(${el.locator})).toBeVisible();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 9120: Verify that the current page displays text (variant)
    handlers.set(9120, (step, ctx) => {
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.getByText(${data.code})).toBeVisible();`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 48: Verify that the element <Element> display value <Value>
    handlers.set(48, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator})).toHaveValue(${data.code});`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 70: Verify that the element <Element> has value <Value>
    handlers.set(70, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator})).toHaveValue(${data.code});`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 44: Verify that the element <Element> has empty value
    handlers.set(44, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await expect(page.locator(${el.locator})).toHaveValue('');`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 43: Verify that the element <Element> has non-empty value
    handlers.set(43, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await expect(page.locator(${el.locator})).not.toHaveValue('');`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 50: Verify that the element <Element> displays CSS attribute for property
    handlers.set(50, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator})).toHaveCSS('border', ${data.code});`,
        confidence: 'medium',
        warnings: ['CSS property check - verify property name'],
      };
    });

    // 60438: Verify element CSS property (variant)
    handlers.set(60438, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator})).toHaveCSS('background-color', ${data.code});`,
        confidence: 'medium',
        warnings: ['CSS property check - verify property name'],
      };
    });

    // 1013: Verify that the text is not displayed in the element
    handlers.set(1013, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator})).not.toContainText(${data.code});`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 1125: Verify text is present in table element
    handlers.set(1125, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator})).toContainText(${data.code});`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 49: Verify elements with locator displays text
    handlers.set(49, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator})).toContainText(${data.code});`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 1048: Verify element contains value for attribute
    handlers.set(1048, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator})).toHaveAttribute('aria-label', ${data.code});`,
        confidence: 'medium',
        warnings: ['Verify attribute name matches'],
      };
    });

    // 1047: Verify element contains value for attribute (variant)
    handlers.set(1047, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator})).toHaveAttribute('value', ${data.code});`,
        confidence: 'medium',
        warnings: ['Verify attribute name matches'],
      };
    });

    // 47: Verify element has value for attribute (title)
    handlers.set(47, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator})).toHaveAttribute('title', ${data.code});`,
        confidence: 'medium',
        warnings: ['Verify attribute name matches'],
      };
    });

    // 61471: Verify element displays text contains (with scroll variant)
    handlers.set(61471, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator})).toContainText(${data.code});`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 1014: Verify count of elements
    handlers.set(1014, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator})).toHaveCount(parseInt(${data.code}));`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : ['Count assertion - verify expected value'],
      };
    });

    // ============ CONDITIONAL VERIFICATIONS (if/else) ============

    // 61121: Verify if <Var1> == <Value> — used as condition (if/else) or assertion
    handlers.set(61121, (step, ctx) => {
      const d1 = ctx.resolveData('testData1');
      const d2 = ctx.resolveData('testData2');
      const d3 = ctx.resolveData('testData3');
      const operator = d2.code.replace(/['"]/g, '');
      const opMap = { '==': '===', '!=': '!==', '<=': '<=', '>=': '>=', '<': '<', '>': '>' };
      const jsOp = opMap[operator] || '===';
      const isCondition = !!step.conditionType;
      if (isCondition) {
        return { code: `if (${d1.code} ${jsOp} ${d3.code})`, confidence: 'high', warnings: [], isCondition: true };
      }
      return { code: `expect(String(${d1.code})).toBe(${d3.code});`, confidence: 'high', warnings: [] };
    });

    // 1096: Verify if <Var1> == <Value> (variant)
    handlers.set(1096, (step, ctx) => {
      const d1 = ctx.resolveData('testData1');
      const d2 = ctx.resolveData('testData2');
      const d3 = ctx.resolveData('testData3');
      const operator = d2.code.replace(/['"]/g, '').toLowerCase();
      const isCondition = !!step.conditionType;
      // Handle 'contains' and other string operators
      if (operator === 'contains') {
        if (isCondition) {
          return { code: `if (String(${d1.code}).includes(String(${d3.code})))`, confidence: 'high', warnings: [], isCondition: true };
        }
        return { code: `expect(String(${d1.code})).toContain(String(${d3.code}));`, confidence: 'high', warnings: [] };
      }
      if (operator === 'startswith' || operator === 'starts with') {
        if (isCondition) {
          return { code: `if (String(${d1.code}).startsWith(String(${d3.code})))`, confidence: 'high', warnings: [], isCondition: true };
        }
        return { code: `expect(String(${d1.code}).startsWith(String(${d3.code}))).toBe(true);`, confidence: 'high', warnings: [] };
      }
      if (operator === 'endswith' || operator === 'ends with') {
        if (isCondition) {
          return { code: `if (String(${d1.code}).endsWith(String(${d3.code})))`, confidence: 'high', warnings: [], isCondition: true };
        }
        return { code: `expect(String(${d1.code}).endsWith(String(${d3.code}))).toBe(true);`, confidence: 'high', warnings: [] };
      }
      // Standard comparison operators
      const opMap = {
        '==': '===', '!=': '!==', '<=': '<=', '>=': '>=', '<': '<', '>': '>',
        'equals': '===', 'notequals': '!==', 'is': '===',
      };
      const jsOp = opMap[operator] || '===';
      if (isCondition) {
        return { code: `if (String(${d1.code}) ${jsOp} String(${d3.code}))`, confidence: 'high', warnings: [], isCondition: true };
      }
      return { code: `expect(String(${d1.code})).toBe(String(${d3.code}));`, confidence: 'high', warnings: [] };
    });

    // 1097: Verify if <Var1> <= <Var2> (comparison)
    handlers.set(1097, (step, ctx) => {
      const d1 = ctx.resolveData('testData1');
      const d2 = ctx.resolveData('testData2');
      const d3 = ctx.resolveData('testData3');
      const operator = d2.code.replace(/['"]/g, '').toLowerCase();
      const opMap = {
        '==': '===', '!=': '!==', '<=': '<=', '>=': '>=', '<': '<', '>': '>',
        'equals': '===', 'notequals': '!==',
        'lessthan': '<', 'greaterthan': '>',
        'lessthanorequal': '<=', 'greaterthanorequal': '>=',
      };
      const jsOp = opMap[operator] || '===';
      // For numeric operators, wrap in parseFloat; for equality, compare as strings
      const numericOps = new Set(['<', '>', '<=', '>=']);
      const isNumeric = numericOps.has(jsOp);
      const left = isNumeric ? `parseFloat(String(${d1.code}))` : `String(${d1.code})`;
      const right = isNumeric ? `parseFloat(String(${d3.code}))` : `String(${d3.code})`;
      if (step.conditionType === 'LOOP_WHILE') {
        return { code: `while (${left} ${jsOp} ${right})`, confidence: 'high', warnings: [], isLoop: true };
      }
      const isCondition = !!step.conditionType;
      if (isCondition) {
        return { code: `if (${left} ${jsOp} ${right})`, confidence: 'high', warnings: [], isCondition: true };
      }
      return { code: `expect(parseInt(${d1.code})).toBeLessThanOrEqual(parseInt(${d3.code}));`, confidence: 'high', warnings: [] };
    });

    // ============ STORE / VARIABLE ACTIONS ============

    // 67: Store text from the element <Element> into a variable <Var>
    handlers.set(67, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      const varName = data.code.replace(/['"]/g, '') || step.action?.split('variable ')?.pop() || 'storedValue';
      return {
        code: `vars[${JSON.stringify(varName)}] = await page.locator(${el.locator}).textContent() || '';`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 60: Store value from text box <Element> into a variable <Var>
    handlers.set(60, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      const varName = data.code.replace(/['"]/g, '') || 'storedValue';
      return {
        code: `vars[${JSON.stringify(varName)}] = await page.locator(${el.locator}).inputValue() || '';`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 63: Store text of selected option from <Element> list into variable
    handlers.set(63, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      const varName = data.code.replace(/['"]/g, '') || 'selectedOption';
      return {
        code: `vars[${JSON.stringify(varName)}] = await page.locator(${el.locator}).evaluate(el => { const s = el as HTMLSelectElement; return s.options[s.selectedIndex]?.text || ''; });`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 66: Store count of elements by locator into variable
    handlers.set(66, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      const varName = data.code.replace(/['"]/g, '') || 'elementCount';
      return {
        code: `vars[${JSON.stringify(varName)}] = String(await page.locator(${el.locator}).count());`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 61: Store the url of the current page into a variable
    handlers.set(61, (step, ctx) => {
      const data = ctx.resolveData('testData');
      const varName = data.code.replace(/['"]/g, '') || 'currentUrl';
      return {
        code: `vars[${JSON.stringify(varName)}] = page.url();`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 59: Store attribute value of element into variable
    handlers.set(59, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      const varName = data.code.replace(/['"]/g, '') || 'attrValue';
      return {
        code: `vars[${JSON.stringify(varName)}] = await page.locator(${el.locator}).getAttribute('title') || '';`,
        confidence: 'medium',
        warnings: ['Verify attribute name - defaulting to title'],
      };
    });

    // 68: Store tag name of element into variable
    handlers.set(68, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      const varName = data.code.replace(/['"]/g, '') || 'tagName';
      return {
        code: `vars[${JSON.stringify(varName)}] = await page.locator(${el.locator}).evaluate(el => (el as HTMLElement).tagName);`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 30161: Store function result into variable
    handlers.set(30161, (step, ctx) => {
      const funcData = ctx.resolveData('testData1');
      const varData = ctx.resolveData('testData2');
      const varName = varData.code.replace(/['"]/g, '') || 'functionResult';
      return {
        code: `vars[${JSON.stringify(varName)}] = ${funcData.code};`,
        confidence: funcData.type === 'function' ? 'medium' : 'high',
        warnings: funcData.type === 'function' ? ['Function call - verify implementation'] : [],
      };
    });

    // ============ SELECT / DROPDOWN ACTIONS ============

    // 79: Select option by text <Text> in the <Element> list
    handlers.set(79, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await page.locator(${el.locator}).selectOption({ label: ${data.code} });`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 78: Select option using value <Value> in the <Element> list
    handlers.set(78, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await page.locator(${el.locator}).selectOption({ label: ${data.code} });`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 80: Select option by index <Index> in the <Element> list
    handlers.set(80, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      const isRaw = data.type === 'raw';
      const idxCode = isRaw ? `parseInt(${data.code})` : `parseInt(${data.code})`;
      return {
        code: `await page.locator(${el.locator}).selectOption({ index: ${idxCode} });`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 1030: Select multiple options by index
    handlers.set(1030, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await page.locator(${el.locator}).selectOption({ index: parseInt(${data.code}) });`,
        confidence: 'medium',
        warnings: ['Multi-select - may need array of options'],
      };
    });

    // 41: Verify select list has option selected
    handlers.set(41, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator})).toHaveValue(${data.code});`,
        confidence: 'medium',
        warnings: ['Select verification - may need label vs value check'],
      };
    });

    // 40: Verify list has option with value selected
    handlers.set(40, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator})).toHaveValue(${data.code});`,
        confidence: 'medium',
        warnings: ['Select verification - may need label vs value check'],
      };
    });

    // 1067: Verify options with text is present in select list
    handlers.set(1067, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator}).locator('option', { hasText: ${data.code} })).toBeVisible();`,
        confidence: 'medium',
        warnings: ['Select option presence check'],
      };
    });

    // 1054: Verify option in dropdown is not present
    handlers.set(1054, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator}).locator('option', { hasText: ${data.code} })).not.toBeVisible();`,
        confidence: 'medium',
        warnings: ['Select option absence check'],
      };
    });

    // ============ CHECKBOX / RADIO ACTIONS ============

    // 636: Check the checkbox <Element>
    handlers.set(636, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await page.locator(${el.locator}).check();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 28: Uncheck the checkbox <Element>
    handlers.set(28, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await page.locator(${el.locator}).uncheck();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 1022: Select the radio button <Element>
    handlers.set(1022, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await page.locator(${el.locator}).check();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 635: Verify checkbox is enabled
    handlers.set(635, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await expect(page.locator(${el.locator})).toBeEnabled();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 1089: Checkbox is checked
    handlers.set(1089, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await expect(page.locator(${el.locator})).toBeChecked();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 1090: Radio button is not selected
    handlers.set(1090, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await expect(page.locator(${el.locator})).not.toBeChecked();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 634: Verify radio button is enabled
    handlers.set(634, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await expect(page.locator(${el.locator})).toBeEnabled();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // ============ SCROLL ACTIONS ============

    // 1081: Scroll down to the element <Element> into view
    handlers.set(1081, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await page.locator(${el.locator}).scrollIntoViewIfNeeded();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 1082: Scroll inside an element to bottom
    handlers.set(1082, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await page.locator(${el.locator}).evaluate(el => { (el as HTMLElement).scrollTop = (el as HTMLElement).scrollHeight; });`,
        confidence: 'medium',
        warnings: ['Scroll inside element - verify behavior'],
      };
    });

    // ============ KEYBOARD ACTIONS ============

    // 1008: Press Enter/Return Key
    handlers.set(1008, () => ({
      code: `await page.keyboard.press('Enter');`,
      confidence: 'high',
      warnings: [],
    }));

    // 40013: Press Control/Command + key
    handlers.set(40013, (step, ctx) => {
      const key1 = ctx.resolveData('testData1');
      const key2 = ctx.resolveData('testData2');
      const k1 = key1.code.replace(/['"]/g, '');
      const k2 = key2.code.replace(/['"]/g, '');
      return {
        code: `await page.keyboard.press('${k1}+${k2}');`,
        confidence: 'medium',
        warnings: ['Keyboard combo - verify key names'],
      };
    });

    // ============ MOUSE ACTIONS ============

    // 85: Mouseover the element <Element>
    handlers.set(85, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await page.locator(${el.locator}).hover();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // ============ NAVIGATION ACTIONS ============

    // 1044: Navigate to <URL>
    handlers.set(1044, (step, ctx) => {
      const data = ctx.resolveData('testData');
      return {
        code: `await page.goto(${data.code});`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 1083: Click Refresh button in the browser
    handlers.set(1083, () => ({
      code: `await page.reload();`,
      confidence: 'high',
      warnings: [],
    }));

    // 1018: Open a new tab
    handlers.set(1018, () => ({
      code: `const newPage = await page.context().newPage();`,
      confidence: 'medium',
      warnings: ['New tab - may need to track page references'],
    }));

    // 107: Click OK button in alert
    handlers.set(107, () => ({
      code: `page.once('dialog', dialog => dialog.accept());`,
      confidence: 'high',
      warnings: [],
    }));

    // ============ FILE ACTIONS ============

    // 969: Upload file using element
    handlers.set(969, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await page.locator(${el.locator}).setInputFiles(${data.code});`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : ['Verify file path exists'],
      };
    });

    // 80077: Get most recently downloaded file path
    handlers.set(80077, (step, ctx) => {
      const data = ctx.resolveData('testData');
      const varName = data.code.replace(/['"]/g, '') || 'downloadPath';
      return {
        code: `vars[${JSON.stringify(varName)}] = vars['_lastDownloadPath'] || '';`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 80076: Read cell value from file
    handlers.set(80076, (step, ctx) => {
      const d1 = ctx.resolveData('testData1');
      const d2 = ctx.resolveData('testData2');
      const d3 = ctx.resolveData('testData3');
      const data = ctx.resolveData('testData');
      const varName = data.code.replace(/['"]/g, '') || 'excelValue';
      return {
        code: `vars[${JSON.stringify(varName)}] = excelHelper.readCell(${d1.code}, ${d2.code}, ${d3.code});`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 9134: Write to file
    handlers.set(9134, (step, ctx) => {
      return {
        code: `// TODO: Write to file - ${step.action}`,
        confidence: 'low',
        warnings: ['File write requires manual implementation'],
      };
    });

    // ============ TEST DATA ACTIONS ============

    // 1104: Write value to test data profile column
    handlers.set(1104, (step, ctx) => {
      const data = ctx.resolveData('testData');
      const param = ctx.resolveData('parameter');
      return {
        code: `// Write to test data profile: ${param.code} = ${data.code}\n// TODO: Test data profile writes need custom implementation`,
        confidence: 'low',
        warnings: ['Test data profile write - needs custom implementation'],
      };
    });

    // ============ LOOP ACTIONS ============

    // 1099: Loop over data set from index to index
    handlers.set(1099, (step, ctx) => {
      if (!step.forLoopCondition) {
        return { code: '// TODO: For loop - missing condition', confidence: 'low', warnings: ['Missing loop condition'] };
      }
      const cond = step.forLoopCondition;
      const leftVal = cond.leftData?.type === 'runtime' ? `parseInt(vars[${JSON.stringify(cond.leftData.value)}])` : (parseInt(cond.leftParamValue) || 0);
      const rightVal = cond.rightData?.type === 'runtime' ? `parseInt(vars[${JSON.stringify(cond.rightData.value)}])` : (parseInt(cond.rightParamValue) || 0);
      const profileName = cond.testDataProfile?.value || 'unknown';
      return {
        code: `for (let dataIdx = ${leftVal}; dataIdx <= ${rightVal}; dataIdx++)`,
        confidence: 'medium',
        warnings: [`Data loop over "${profileName}" - verify index bounds`],
        isLoop: true,
      };
    });

    // 1103: Loop over data set from Set Name to Set Name
    handlers.set(1103, (step, ctx) => {
      if (!step.forLoopCondition) {
        return { code: '// TODO: For loop - missing condition', confidence: 'low', warnings: ['Missing loop condition'] };
      }
      const cond = step.forLoopCondition;
      const profileName = cond.testDataProfile?.value || 'unknown';
      return {
        code: `// Loop over test data sets in "${profileName}" from ${cond.leftParamValue} to ${cond.rightParamValue}\nfor (const testDataSet of testDataSets)`,
        confidence: 'low',
        warnings: [`Data set loop - needs test data profile "${profileName}" loaded`],
        isLoop: true,
      };
    });

    // 1084: While element is visible on the page
    handlers.set(1084, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      const isNotVisible = (data.code || '').includes('not visible') || (step.action || '').includes('not visible');
      if (step.conditionType === 'LOOP_WHILE') {
        const condition = isNotVisible
          ? `!(await page.locator(${el.locator}).isVisible())`
          : `await page.locator(${el.locator}).isVisible()`;
        return {
          code: `while (${condition})`,
          confidence: el.missing ? 'low' : 'medium',
          warnings: ['While loop - ensure exit condition prevents infinite loop'],
          isLoop: true,
        };
      }
      // Used as a regular check, not a loop
      if (isNotVisible) {
        return {
          code: `await expect(page.locator(${el.locator})).not.toBeVisible();`,
          confidence: el.missing ? 'low' : 'high',
          warnings: el.missing ? [`Element not found: ${el.name}`] : [],
        };
      }
      return {
        code: `await expect(page.locator(${el.locator})).toBeVisible();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // ============ MISC ACTIONS ============

    // 40056: Test Case Result is Failed
    handlers.set(40056, () => ({
      code: `// Test case result check - no direct Playwright equivalent\n// This was used for conditional branching in Testsigma`,
      confidence: 'medium',
      warnings: ['Test case result check - used for conditional flow'],
    }));

    // 1093: Element has attribute with value
    handlers.set(1093, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator})).toHaveAttribute('class', new RegExp(${data.code}));`,
        confidence: 'medium',
        warnings: ['Attribute check - verify attribute name'],
      };
    });

    // 627: Verify button is disabled
    handlers.set(627, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await expect(page.locator(${el.locator})).toBeDisabled();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 632: Verify button is enabled
    handlers.set(632, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await expect(page.locator(${el.locator})).toBeEnabled();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 631: Verify textarea is editable
    handlers.set(631, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await expect(page.locator(${el.locator})).toBeEditable();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 1055: Verify element is clickable
    handlers.set(1055, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await expect(page.locator(${el.locator})).toBeEnabled();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 588: Wait until checkbox with text is displayed
    handlers.set(588, (step, ctx) => {
      const data = ctx.resolveData('testData');
      return {
        code: `await page.getByText(${data.code}).waitFor({ state: 'visible' });`,
        confidence: 'medium',
        warnings: ['Checkbox text wait - verify selector'],
      };
    });

    // 80072: Split string and store result
    handlers.set(80072, (step, ctx) => {
      const d1 = ctx.resolveData('testData1');
      const d2 = ctx.resolveData('testData2');
      const d3 = ctx.resolveData('testData3');
      const data = ctx.resolveData('testData');
      const varName = data.code.replace(/['"]/g, '') || 'splitResult';
      return {
        code: `vars[${JSON.stringify(varName)}] = String(${d1.code}).substring(0, parseInt(${d2.code}));`,
        confidence: 'medium',
        warnings: ['String split - verify split logic'],
      };
    });

    // ============ ADDITIONAL TEMPLATES (from EXT/full scan) ============

    // 29: Type <Value> in the <Element> field (variant of enter)
    handlers.set(29, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await page.locator(${el.locator}).fill(${data.code});`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 57: Verify that the Alert displays the message <Text>
    handlers.set(57, (step, ctx) => {
      const data = ctx.resolveData('testData');
      return {
        code: `page.once('dialog', dialog => {\n  expect(dialog.message()).toContain(${data.code});\n  dialog.accept();\n});`,
        confidence: 'medium',
        warnings: ['Alert dialog verification'],
      };
    });

    // 65: Store the count of options in the <Element> list into variable
    handlers.set(65, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      const varName = data.code.replace(/['"]/g, '') || 'optionCount';
      return {
        code: `vars[${JSON.stringify(varName)}] = String(await page.locator(${el.locator}).locator('option').count());`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 608: Wait until a button with text <Text> is displayed
    handlers.set(608, (step, ctx) => {
      const data = ctx.resolveData('testData');
      return {
        code: `await page.getByRole('button', { name: ${data.code} }).waitFor({ state: 'visible' });`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 1009: Press Tab Key
    handlers.set(1009, () => ({
      code: `await page.keyboard.press('Tab');`,
      confidence: 'high',
      warnings: [],
    }));

    // 1012: Press ARROW_DOWN Keys
    handlers.set(1012, () => ({
      code: `await page.keyboard.press('ArrowDown');`,
      confidence: 'high',
      warnings: [],
    }));

    // 1019: Take full page screenshot
    handlers.set(1019, () => ({
      code: `await page.screenshot({ fullPage: true });`,
      confidence: 'high',
      warnings: [],
    }));

    // 1024: Clear text using javascript executor
    handlers.set(1024, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await page.locator(${el.locator}).evaluate(el => { (el as HTMLInputElement).value = ''; el.dispatchEvent(new Event('input')); });`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 1052: Verify that the element <Element> is not displayed
    handlers.set(1052, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await expect(page.locator(${el.locator})).not.toBeVisible();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 1078: Verify that the element <Element> is present
    handlers.set(1078, (step, ctx) => {
      const el = ctx.getElement();
      return {
        code: `await expect(page.locator(${el.locator})).toBeVisible();`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 1092: Element <Element> has <status>
    handlers.set(1092, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await expect(page.locator(${el.locator})).toContainText(${data.code});`,
        confidence: 'medium',
        warnings: ['Element status check - verify expected text'],
      };
    });

    // 1098: Loop over data set where set name EQUALS <Name>
    handlers.set(1098, (step, ctx) => {
      if (!step.forLoopCondition) {
        return { code: '// TODO: For loop - missing condition', confidence: 'low', warnings: ['Missing loop condition'] };
      }
      const cond = step.forLoopCondition;
      const profileName = cond.testDataProfile?.value || 'unknown';
      return {
        code: `// Loop over test data "${profileName}" where set name equals ${cond.leftParamValue}\nfor (const testDataRow of testDataRows)`,
        confidence: 'low',
        warnings: [`Data set loop - needs test data profile "${profileName}" loaded`],
        isLoop: true,
      };
    });

    // 1112: Store row number in table containing text into variable
    handlers.set(1112, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      const varName = data.code.replace(/['"]/g, '') || 'rowNum';
      return {
        code: `// TODO: Find row in table containing text\nvars[${JSON.stringify(varName)}] = '0'; // Manual: find row in ${el.name} containing ${data.code}`,
        confidence: 'low',
        warnings: ['Table row search - needs manual implementation'],
      };
    });

    // 40021: Scroll the window to offset vertically
    handlers.set(40021, (step, ctx) => {
      const data = ctx.resolveData('testData');
      return {
        code: `await page.evaluate((y) => window.scrollTo(0, y), parseInt(${data.code || '"0"'}));`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 40022: Scroll element to offset vertically
    handlers.set(40022, (step, ctx) => {
      const el = ctx.getElement();
      const data = ctx.resolveData('testData');
      return {
        code: `await page.locator(${el.locator}).evaluate((el, y) => { (el as HTMLElement).scrollTop = y; }, parseInt(${data.code || '"0"'}));`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 40062: Test Case Iteration Result is <status>
    handlers.set(40062, () => ({
      code: `// Test case iteration result check - no direct Playwright equivalent`,
      confidence: 'medium',
      warnings: ['Test iteration result check - used for conditional flow'],
    }));

    return handlers;
  }

  /**
   * Generate inline JavaScript code to format a Date object using a Java-style format string.
   * Returns a 'return ...' statement that can be used inside an IIFE.
   */
  /**
   * Convert an API_STEP into Playwright request code.
   */
  _convertApiStep(step) {
    const api = step.apiStep;
    if (!api) {
      return { code: `// API step: ${step.action || 'unnamed'} (no apiStep data)`, confidence: 'low', warnings: ['API step missing apiStep data'] };
    }

    const method = (api.requestType || 'GET').toLowerCase();
    const url = api.url || '';
    const title = api.title || step.action || 'API call';
    const lines = [];

    lines.push(`// API: ${title}`);

    // Build request options
    const hasHeaders = api.headers && api.headers.length > 0;
    const hasBody = api.bodyType && api.bodyType !== 'NONE';

    let optsParts = [];
    if (hasHeaders) {
      const headerObj = api.headers.reduce((acc, h) => { acc[h.name || h.key] = h.value; return acc; }, {});
      optsParts.push(`headers: ${JSON.stringify(headerObj)}`);
    }
    if (hasBody && api.rawBodyDetails) {
      optsParts.push(`data: ${JSON.stringify(api.rawBodyDetails)}`);
    }

    const opts = optsParts.length > 0 ? `, { ${optsParts.join(', ')} }` : '';

    // Generate the request call
    const varName = `_apiResponse_${step.id || 'x'}`;
    lines.push(`const ${varName} = await page.request.${method}(${JSON.stringify(url)}${opts});`);

    // Status verification
    if (api.statusResponseSizeVerificationDetails) {
      for (const v of api.statusResponseSizeVerificationDetails) {
        if (v.keyName === 'RESPONSE_STATUS' && v.keyValue) {
          lines.push(`expect(${varName}.status()).toBe(${v.keyValue});`);
        }
      }
    }

    // Response variable extraction
    if (api.responseVariablesDetails && api.responseVariablesDetails.length > 0) {
      const bodyVar = `_apiBody_${step.id || 'x'}`;
      lines.push(`const ${bodyVar} = await ${varName}.json();`);
      for (const rv of api.responseVariablesDetails) {
        const jsonPath = rv.keyName || '';
        const target = rv.variableId || rv.keyName;
        if (jsonPath) {
          const pathParts = jsonPath.split('.').map(p => `[${JSON.stringify(p)}]`).join('');
          lines.push(`vars[${JSON.stringify(target)}] = String(${bodyVar}${pathParts} ?? '');`);
        }
      }
    }

    return {
      code: lines.join('\n'),
      confidence: 'medium',
      warnings: [],
    };
  }

  _genFormatDate(dateVar, format) {
    if (!format || format === 'output-format') {
      return `return ${dateVar}.toLocaleDateString('en-US');`;
    }
    // Generate code that formats the date according to the Java-style format
    // All values must be String() to satisfy TypeScript's .replace() signature
    return `const _p = { yyyy: String(${dateVar}.getFullYear()), yy: String(${dateVar}.getFullYear()).slice(-2), MM: String(${dateVar}.getMonth()+1).padStart(2,'0'), M: String(${dateVar}.getMonth()+1), dd: String(${dateVar}.getDate()).padStart(2,'0'), d: String(${dateVar}.getDate()), HH: String(${dateVar}.getHours()).padStart(2,'0'), hh: String(${dateVar}.getHours()%12||12).toString().padStart(2,'0'), h: String(${dateVar}.getHours()%12||12), mm: String(${dateVar}.getMinutes()).padStart(2,'0'), ss: String(${dateVar}.getSeconds()).padStart(2,'0'), a: ${dateVar}.getHours() >= 12 ? 'PM' : 'AM' };\n  return ${JSON.stringify(format)}.replace('yyyy',_p.yyyy).replace('yy',_p.yy).replace('MM',_p.MM).replace('dd',_p.dd).replace('HH',_p.HH).replace('hh',_p.hh).replace('mm',_p.mm).replace('ss',_p.ss).replace(/a/g,_p.a).replace(/M(?!M)/g,_p.M).replace(/d(?!d)/g,_p.d).replace(/h(?!h)/g,_p.h);`;
  }

  /**
   * Build context for Kibbutz plugin steps.
   * Plugin data lives in step.kibbutzPluginNlpData with testData and uiIdentifiers.
   */
  makeKibbutzContext(step) {
    const self = this;
    const pluginData = step.kibbutzPluginNlpData || {};
    const testData = pluginData.testData || {};
    const uiIdentifiers = pluginData.uiIdentifiers || {};

    // Build flexible key lookup map: case-insensitive + hyphen-normalized
    const keyMap = {};
    for (const k of Object.keys(testData)) {
      keyMap[k] = k;
      keyMap[k.toLowerCase()] = k;
      keyMap[k.toLowerCase().replace(/-/g, '')] = k;  // runtime-variable -> runtimevariable
      keyMap[k.replace(/-/g, '').toLowerCase()] = k;  // same
    }
    const findEntry = (key) => {
      const actualKey = keyMap[key] || keyMap[key.toLowerCase()] || keyMap[key.toLowerCase().replace(/-/g, '')];
      return actualKey ? testData[actualKey] : undefined;
    };

    return {
      dataLoader: this.dataLoader,
      /** Get a testData parameter, resolving runtime/raw/function types.
       *  Returns fallback {code:"''"} if key not found. */
      param(key) {
        const entry = findEntry(key);
        if (!entry) return { code: "''", type: 'raw', raw: '' };
        return self._resolveKibbutzValue(entry);
      },
      /** Check if a key exists in testData */
      hasParam(key) {
        return !!findEntry(key);
      },
      /** Get raw string value of a param (unquoted for variable names) */
      rawValue(key) {
        const entry = findEntry(key);
        if (!entry) return '';
        return entry.value || '';
      },
      /** Resolve a UI element from uiIdentifiers */
      getElement(key = 'element-locator') {
        const uiRef = uiIdentifiers[key];
        if (!uiRef || !uiRef.name) {
          // Try alternate keys
          const altKey = Object.keys(uiIdentifiers)[0];
          if (altKey) {
            const altRef = uiIdentifiers[altKey];
            if (altRef?.name) {
              const resolved = self.dataLoader.resolveElement(altRef.name, step);
              if (resolved) return { locator: JSON.stringify(resolved.definition), name: altRef.name, missing: false };
            }
          }
          return { locator: "'//*'", name: 'MISSING', missing: true };
        }
        const resolved = self.dataLoader.resolveElement(uiRef.name, step);
        if (resolved) return { locator: JSON.stringify(resolved.definition), name: uiRef.name, missing: false };
        return { locator: `/* MISSING: ${uiRef.name} */ '//*'`, name: uiRef.name, missing: true };
      },
    };
  }

  _resolveKibbutzValue(entry) {
    if (!entry) return { code: "''", type: 'raw', raw: '' };
    const val = entry.value || '';
    switch (entry.type) {
      case 'raw':
        return { code: JSON.stringify(val), type: 'raw', raw: val };
      case 'runtime':
        return { code: `vars[${JSON.stringify(val)}]`, type: 'runtime', raw: val };
      case 'parameter':
        return { code: `testData[${JSON.stringify(val)}]`, type: 'parameter', raw: val };
      case 'function':
        return this.dataLoader.resolveFunctionValue(val);
      case 'global':
        return { code: `vars[${JSON.stringify(val)}]`, type: 'global', raw: val };
      default:
        return { code: JSON.stringify(val), type: entry.type || 'raw', raw: val };
    }
  }

  /**
   * Build handlers for Kibbutz plugin NLP IDs.
   * These are custom Testsigma plugins for string ops, math, dates, etc.
   */
  buildKibbutzHandlers() {
    const handlers = new Map();

    // ============ MATH OPERATIONS ============
    // 87: Perform addition/subtraction/multiplication/division
    handlers.set(87, (step, ctx) => {
      const op = ctx.rawValue('mathematical_operations');
      const a = ctx.param('testdata1');
      const b = ctx.param('testdata2');
      const rawDecimals = ctx.rawValue('number') || '0';
      const decimals = /^\d+$/.test(rawDecimals) ? rawDecimals : '0';
      const target = ctx.rawValue('runtimevariable');
      const opMap = { addition: '+', subtraction: '-', multiplication: '*', division: '/' };
      const operator = opMap[op] || '+';
      return {
        code: `vars[${JSON.stringify(target)}] = (parseFloat(String(${a.code})) ${operator} parseFloat(String(${b.code}))).toFixed(${decimals});`,
        confidence: 'high',
        warnings: [],
      };
    });

    // ============ STRING OPERATIONS ============

    // 94: Trim data and store
    handlers.set(94, (step, ctx) => {
      const input = ctx.param('testdata');
      const target = ctx.rawValue('trimdata') || ctx.rawValue('runtimevariable') || ctx.rawValue('Variable') || ctx.rawValue('variable');
      if (!target) {
        return { code: `/* trim: */ String(${input.code}).trim(); // TODO: Missing target variable`, confidence: 'low', warnings: ['Trim target variable is empty'] };
      }
      return {
        code: `vars[${JSON.stringify(target)}] = String(${input.code}).trim();`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 91: Trim whitespace and store
    handlers.set(91, (step, ctx) => {
      const input = ctx.param('testdata');
      const target = ctx.rawValue('trimdata') || ctx.rawValue('runtimevariable') || ctx.rawValue('Variable') || ctx.rawValue('variable');
      if (!target) {
        return { code: `/* trim: */ String(${input.code}).trim(); // TODO: Missing target variable`, confidence: 'low', warnings: ['Trim target variable is empty'] };
      }
      return {
        code: `vars[${JSON.stringify(target)}] = String(${input.code}).trim();`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 215: Remove special characters from string
    handlers.set(215, (step, ctx) => {
      const chars = ctx.rawValue('testdata1');
      const input = ctx.param('testdata2');
      const target = ctx.rawValue('Variable');
      const escaped = chars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      return {
        code: `vars[${JSON.stringify(target)}] = String(${input.code}).replace(/${escaped}/g, '');`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 111: Get testdata and remove special char
    handlers.set(111, (step, ctx) => {
      const chars = ctx.rawValue('testdata1') || ctx.rawValue('testdata');
      const input = ctx.param('testdata2') || ctx.param('testdata');
      const target = ctx.rawValue('Variable') || ctx.rawValue('runtimevariable');
      const escaped = (chars || '').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      return {
        code: `vars[${JSON.stringify(target)}] = String(${input.code}).replace(/${escaped || '.'}/g, '');`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // Helper to make index expression numeric for array access
    const numericIndex = (pos) => {
      if (pos.type === 'raw') return pos.code; // raw numbers are fine as-is
      return `parseInt(String(${pos.code}))`; // runtime vars need parseInt
    };

    // Helper: resolve target variable from common key names used across split/trim/string ops
    const resolveTarget = (ctx) => {
      return ctx.rawValue('output-variable') || ctx.rawValue('runtime-variable') || ctx.rawValue('runtimevariable') || ctx.rawValue('variable') || ctx.rawValue('Variable');
    };

    // 132: Split with value extraction (1-based index)
    handlers.set(132, (step, ctx) => {
      const input = ctx.param('given-string') || ctx.param('text') || ctx.param('testdata');
      const delim = ctx.rawValue('regex-condition') || ctx.rawValue('character');
      const pos = ctx.param('position');
      const target = resolveTarget(ctx);
      if (!target) {
        return { code: `// TODO: Split operation with missing target variable\n// Action: ${(step.action || '').substring(0, 100)}`, confidence: 'low', warnings: ['Missing target variable in split'] };
      }
      return {
        code: `vars[${JSON.stringify(target)}] = String(${input.code}).split(${JSON.stringify(delim)})[${numericIndex(pos)}] || '';`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 456: Split string using delimiter (variant)
    handlers.set(456, (step, ctx) => {
      const input = ctx.param('given-string') || ctx.param('text') || ctx.param('testdata');
      const delim = ctx.rawValue('regex-condition') || ctx.rawValue('character') || ctx.rawValue('testdata1');
      const pos = ctx.param('position') || ctx.param('testdata2');
      const target = resolveTarget(ctx);
      if (!target) return { code: `// TODO: Split operation with missing params\n// Action: ${(step.action || '').substring(0, 100)}`, confidence: 'low', warnings: ['Missing params in split'] };
      return {
        code: `vars[${JSON.stringify(target)}] = String(${input.code}).split(${JSON.stringify(delim)})[${numericIndex(pos)}] || '';`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 271: Split string using delimiter (another variant)
    handlers.set(271, (step, ctx) => {
      const input = ctx.param('given-string') || ctx.param('text') || ctx.param('testdata');
      const delim = ctx.rawValue('regex-condition') || ctx.rawValue('character') || ctx.rawValue('testdata1');
      const pos = ctx.param('position') || ctx.param('testdata2');
      const target = resolveTarget(ctx);
      if (!target) return { code: `// TODO: Split operation with missing params\n// Action: ${(step.action || '').substring(0, 100)}`, confidence: 'low', warnings: ['Missing params in split'] };
      return {
        code: `vars[${JSON.stringify(target)}] = String(${input.code}).split(${JSON.stringify(delim)})[${numericIndex(pos)}] || '';`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 298: Split with delimiter (colon variant)
    handlers.set(298, (step, ctx) => {
      const input = ctx.param('given-string') || ctx.param('text') || ctx.param('testdata');
      const delim = ctx.rawValue('regex-condition') || ctx.rawValue('character') || ctx.rawValue('testdata1') || ':';
      const pos = ctx.param('position') || ctx.param('testdata2');
      const target = resolveTarget(ctx);
      if (!target) return { code: `// TODO: Split operation with missing params\n// Action: ${(step.action || '').substring(0, 100)}`, confidence: 'low', warnings: ['Missing params in split'] };
      return {
        code: `vars[${JSON.stringify(target)}] = String(${input.code}).split(${JSON.stringify(delim)})[${numericIndex(pos)}] || '';`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 475: Split range of characters OR substring extraction
    // Two data shapes:
    //   Split: keys 'given-string', 'regex-condition', 'position', 'output-variable'
    //   Substring: keys 'text', 'from', 'to', 'runtime-variable'
    handlers.set(475, (step, ctx) => {
      // Detect substring variant (has 'from' and 'to' keys)
      const fromVal = ctx.rawValue('from');
      const toVal = ctx.rawValue('to');
      if (fromVal !== '' || toVal !== '') {
        const input = ctx.param('text') || ctx.param('given-string') || ctx.param('testdata');
        const target = resolveTarget(ctx);
        if (!target) return { code: `// TODO: Substring operation with missing target\n// Action: ${(step.action || '').substring(0, 100)}`, confidence: 'low', warnings: ['Missing target in substring'] };
        const from = fromVal || '0';
        const to = toVal || '';
        if (to) {
          return {
            code: `vars[${JSON.stringify(target)}] = String(${input.code}).substring(${from}, ${to});`,
            confidence: 'high',
            warnings: [],
          };
        }
        return {
          code: `vars[${JSON.stringify(target)}] = String(${input.code}).substring(${from});`,
          confidence: 'high',
          warnings: [],
        };
      }
      // Split variant
      const input = ctx.param('given-string') || ctx.param('text') || ctx.param('testdata');
      const delim = ctx.rawValue('regex-condition') || ctx.rawValue('character') || ctx.rawValue('testdata1');
      const pos = ctx.param('position') || ctx.param('testdata2');
      const target = resolveTarget(ctx);
      if (!target) return { code: `// TODO: Split operation with missing params\n// Action: ${(step.action || '').substring(0, 100)}`, confidence: 'low', warnings: ['Missing params in split'] };
      return {
        code: `vars[${JSON.stringify(target)}] = String(${input.code}).split(${JSON.stringify(delim)})[${numericIndex(pos)}] || '';`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 121: Remove positions from string (substring extraction)
    // "Remove the no of (start,length) positions" = substring(start, str.length - length)
    handlers.set(121, (step, ctx) => {
      const input = ctx.param('testdata');
      const positions = ctx.rawValue('first,last');
      const target = ctx.rawValue('runtime_testdata');
      const parts = positions.split(',').map(s => s.trim());
      const start = parseInt(parts[0]) || 0;
      const end = parseInt(parts[1]) || 0;
      if (end === 0) {
        return {
          code: `vars[${JSON.stringify(target)}] = String(${input.code}).substring(${start});`,
          confidence: 'high',
          warnings: [],
        };
      }
      return {
        code: `vars[${JSON.stringify(target)}] = String(${input.code}).substring(${start}, String(${input.code}).length - ${end});`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 449: Get last N characters
    handlers.set(449, (step, ctx) => {
      const input = ctx.param('Input-data');
      const n = ctx.rawValue('number-of');
      const target = ctx.rawValue('Out-data');
      return {
        code: `vars[${JSON.stringify(target)}] = String(${input.code}).slice(-${n});`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 445: Get character at index
    handlers.set(445, (step, ctx) => {
      const input = ctx.param('Input-data') || ctx.param('testdata');
      const idx = ctx.rawValue('number-of') || ctx.rawValue('testdata1') || '0';
      const target = ctx.rawValue('Out-data') || ctx.rawValue('runtimevariable') || ctx.rawValue('variable') || ctx.rawValue('runtime-variable');
      if (!target) {
        return { code: `/* charAt ${idx} */ String(${input.code}).charAt(${idx}); // TODO: Missing target variable`, confidence: 'low', warnings: ['Missing target variable'] };
      }
      return {
        code: `vars[${JSON.stringify(target)}] = String(${input.code}).charAt(${idx});`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 253: Add character at position in string
    handlers.set(253, (step, ctx) => {
      const input = ctx.param('testdata') || ctx.param('testdata2');
      const char = ctx.rawValue('testdata1') || ctx.rawValue('testdata');
      const pos = ctx.rawValue('position') || ctx.rawValue('testdata2');
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      return {
        code: `vars[${JSON.stringify(target)}] = String(${input.code}).slice(0, ${pos}) + ${JSON.stringify(char)} + String(${input.code}).slice(${pos});`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 277: Concat with special char separator
    handlers.set(277, (step, ctx) => {
      const s1 = ctx.param('String1');
      const s2 = ctx.param('String2');
      const sep = ctx.rawValue('testdata1');
      const target = ctx.rawValue('testdata2');
      return {
        code: `vars[${JSON.stringify(target)}] = String(${s1.code}) + ${JSON.stringify(sep)} + String(${s2.code});`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 278: Concat with space
    handlers.set(278, (step, ctx) => {
      const s1 = ctx.param('String1');
      const s2 = ctx.param('String2');
      const target = ctx.rawValue('testdata2') || ctx.rawValue('runtimevariable');
      return {
        code: `vars[${JSON.stringify(target)}] = String(${s1.code}) + ' ' + String(${s2.code});`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 279: Concatenate two strings
    handlers.set(279, (step, ctx) => {
      const s1 = ctx.param('String1') || ctx.param('string1');
      const s2 = ctx.param('String2') || ctx.param('string2');
      const target = ctx.rawValue('testdata2') || ctx.rawValue('testdata') || ctx.rawValue('runtimevariable') || ctx.rawValue('runtime-variable') || ctx.rawValue('variable');
      return {
        code: `vars[${JSON.stringify(target)}] = String(${s1.code}) + String(${s2.code});`,
        confidence: 'high',
        warnings: target ? [] : ['Missing target variable for concatenation'],
      };
    });

    // 70: Simple concat
    handlers.set(70, (step, ctx) => {
      const s1 = ctx.param('String1') || ctx.param('testdata1');
      const s2 = ctx.param('String2') || ctx.param('testdata2');
      const sep = ctx.rawValue('testdata1');
      const target = ctx.rawValue('testdata2') || ctx.rawValue('runtimevariable');
      return {
        code: `vars[${JSON.stringify(target)}] = String(${s1.code}) + String(${s2.code});`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 422: Replace character in string
    handlers.set(422, (step, ctx) => {
      const input = ctx.param('testdata') || ctx.param('testdata2');
      const find = ctx.rawValue('testdata1') || ctx.rawValue('testdata');
      const replace = ctx.rawValue('testdata2') || '';
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      const escaped = find.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      return {
        code: `vars[${JSON.stringify(target)}] = String(${input.code}).replace(/${escaped}/g, ${JSON.stringify(replace)});`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 424: Replace string with string
    handlers.set(424, (step, ctx) => {
      const input = ctx.param('testdata') || ctx.param('testdata2');
      const find = ctx.rawValue('testdata1');
      const replace = ctx.rawValue('testdata3') || '';
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      return {
        code: `vars[${JSON.stringify(target)}] = String(${input.code}).replace(${JSON.stringify(find)}, ${JSON.stringify(replace)});`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 377: Count characters in string
    handlers.set(377, (step, ctx) => {
      const input = ctx.param('testdata');
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      return {
        code: `vars[${JSON.stringify(target)}] = String(${input.code}).length.toString();`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 381: Store count of characters
    handlers.set(381, (step, ctx) => {
      const input = ctx.param('testdata');
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      return {
        code: `vars[${JSON.stringify(target)}] = String(${input.code}).length.toString();`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 102: Store value in runtime variable
    handlers.set(102, (step, ctx) => {
      const input = ctx.param('testdata');
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      return {
        code: `vars[${JSON.stringify(target)}] = String(${input.code});`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 226: Convert to positive (absolute value)
    handlers.set(226, (step, ctx) => {
      const input = ctx.param('testdata');
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      return {
        code: `vars[${JSON.stringify(target)}] = Math.abs(parseFloat(String(${input.code}))).toString();`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 217: Format decimal
    handlers.set(217, (step, ctx) => {
      const input = ctx.param('testdata');
      const format = ctx.rawValue('testdata1') || ctx.rawValue('format');
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      // Count decimal places from format like "0.0##" or "0"
      const match = (format || '').match(/\.(#+|0+)/);
      const decimals = match ? match[1].length : 0;
      return {
        code: `vars[${JSON.stringify(target)}] = parseFloat(String(${input.code})).toFixed(${decimals});`,
        confidence: 'high',
        warnings: [],
      };
    });

    // ============ VERIFY / ASSERT OPERATIONS ============

    // 113: Verify contains/equals (ignore-case)
    handlers.set(113, (step, ctx) => {
      const s1 = ctx.param('string1');
      const s2 = ctx.param('string2');
      const mode = ctx.rawValue('selectable-list') || 'contains';
      if (mode.includes('equals') && mode.includes('ignore')) {
        return { code: `expect(String(${s1.code}).toLowerCase()).toBe(String(${s2.code}).toLowerCase());`, confidence: 'high', warnings: [] };
      } else if (mode.includes('equals')) {
        return { code: `expect(String(${s1.code})).toBe(String(${s2.code}));`, confidence: 'high', warnings: [] };
      } else if (mode.includes('ignore')) {
        return { code: `expect(String(${s1.code}).toLowerCase()).toContain(String(${s2.code}).toLowerCase());`, confidence: 'high', warnings: [] };
      }
      return { code: `expect(String(${s1.code})).toContain(String(${s2.code}));`, confidence: 'high', warnings: [] };
    });

    // 114: Verify contains
    handlers.set(114, (step, ctx) => {
      const s1 = ctx.param('string1');
      const s2 = ctx.param('string2');
      return { code: `expect(String(${s1.code})).toContain(String(${s2.code}));`, confidence: 'high', warnings: [] };
    });

    // 274: Verify not contains
    handlers.set(274, (step, ctx) => {
      const s1 = ctx.param('string1');
      const s2 = ctx.param('string2');
      return { code: `expect(String(${s1.code})).not.toContain(String(${s2.code}));`, confidence: 'high', warnings: [] };
    });

    // 184: Verify equals (==)
    handlers.set(184, (step, ctx) => {
      const s1 = ctx.param('string1') || ctx.param('testdata1');
      const s2 = ctx.param('string2') || ctx.param('testdata2');
      return { code: `expect(String(${s1.code})).toBe(String(${s2.code}));`, confidence: 'high', warnings: [] };
    });

    // 191: Verify equals variant
    handlers.set(191, (step, ctx) => {
      const s1 = ctx.param('string1') || ctx.param('testdata1');
      const s2 = ctx.param('string2') || ctx.param('testdata2');
      return { code: `expect(String(${s1.code})).toBe(String(${s2.code}));`, confidence: 'high', warnings: [] };
    });

    // 1: Compare two strings
    handlers.set(1, (step, ctx) => {
      const s1 = ctx.param('string1') || ctx.param('testdata1');
      const s2 = ctx.param('string2') || ctx.param('testdata2');
      return { code: `expect(String(${s1.code})).toBe(String(${s2.code}));`, confidence: 'medium', warnings: [] };
    });

    // 361: Verify text matches regex
    handlers.set(361, (step, ctx) => {
      const input = ctx.param('testdata') || ctx.param('string1');
      const pattern = ctx.rawValue('testdata1') || ctx.rawValue('regex');
      if (!pattern) {
        return { code: `// TODO: Regex verification with empty pattern\n// Action: ${(step.action || '').substring(0, 100)}`, confidence: 'low', warnings: ['Empty regex pattern'] };
      }
      return { code: `expect(String(${input.code})).toMatch(/${pattern}/);`, confidence: 'medium', warnings: [] };
    });

    // 388: Verify element text contains ignore-case
    handlers.set(388, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const expected = ctx.param('expectedText') || ctx.param('testdata');
      return {
        code: `expect((await page.locator(${el.locator}).textContent() || '').toLowerCase()).toContain(String(${expected.code}).toLowerCase());`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 390: Verify element value contains ignore-case
    handlers.set(390, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const expected = ctx.param('expectedText') || ctx.param('testdata');
      return {
        code: `expect((await page.locator(${el.locator}).inputValue() || '').toLowerCase()).toContain(String(${expected.code}).toLowerCase());`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 103: If value is (not) empty
    handlers.set(103, (step, ctx) => {
      const input = ctx.param('testdata');
      const condition = ctx.rawValue('testdata1') || 'empty';
      if (condition.includes('not')) {
        return { code: `if (String(${input.code}).trim() !== '')`, confidence: 'medium', warnings: [], isCondition: true };
      }
      return { code: `if (String(${input.code}).trim() === '')`, confidence: 'medium', warnings: [], isCondition: true };
    });

    // 105: If text contains
    handlers.set(105, (step, ctx) => {
      const s1 = ctx.param('string1') || ctx.param('testdata1');
      const s2 = ctx.param('string2') || ctx.param('testdata2');
      return { code: `if (String(${s1.code}).includes(String(${s2.code})))`, confidence: 'medium', warnings: [], isCondition: true };
    });

    // ============ MULTIPLE ELEMENTS OPERATIONS ============

    // 463: Verify multiple elements have same text
    handlers.set(463, (step, ctx) => {
      const el = ctx.getElement('Element');
      const expected = ctx.param('expectedText');
      return {
        code: `for (let i = 0; i < await page.locator(${el.locator}).count(); i++) {\n  await expect(page.locator(${el.locator}).nth(i)).toHaveText(String(${expected.code}));\n}`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 461: Verify multiple elements enabled/disabled
    handlers.set(461, (step, ctx) => {
      const el = ctx.getElement('Element');
      const state = ctx.rawValue('testdata') || ctx.rawValue('selectable-list') || 'disabled';
      const assertion = state.includes('disabled') ? 'toBeDisabled' : 'toBeEnabled';
      return {
        code: `for (let i = 0; i < await page.locator(${el.locator}).count(); i++) {\n  await expect(page.locator(${el.locator}).nth(i)).${assertion}();\n}`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 469: Verify multiple elements partial text
    handlers.set(469, (step, ctx) => {
      const el = ctx.getElement('Element');
      const expected = ctx.param('expectedText');
      return {
        code: `for (let i = 0; i < await page.locator(${el.locator}).count(); i++) {\n  await expect(page.locator(${el.locator}).nth(i)).toContainText(String(${expected.code}));\n}`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 468: Verify multiple elements attribute value
    handlers.set(468, (step, ctx) => {
      const el = ctx.getElement('Element');
      const attr = ctx.rawValue('attribute') || ctx.rawValue('testdata1') || 'data-value';
      const expected = ctx.param('expectedText');
      return {
        code: `for (let i = 0; i < await page.locator(${el.locator}).count(); i++) {\n  expect(await page.locator(${el.locator}).nth(i).getAttribute(${JSON.stringify(attr)})).toBe(String(${expected.code}));\n}`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 470: Verify multiple elements partial attribute
    handlers.set(470, (step, ctx) => {
      const el = ctx.getElement('Element');
      const attr = ctx.rawValue('attribute') || ctx.rawValue('testdata1') || 'data-value';
      const expected = ctx.param('expectedText');
      return {
        code: `for (let i = 0; i < await page.locator(${el.locator}).count(); i++) {\n  expect(await page.locator(${el.locator}).nth(i).getAttribute(${JSON.stringify(attr)})).toContain(String(${expected.code}));\n}`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 234: Fetch text from multiple elements
    handlers.set(234, (step, ctx) => {
      const el = ctx.getElement('Element');
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable') || ctx.rawValue('testdata');
      return {
        code: `vars[${JSON.stringify(target)}] = (await page.locator(${el.locator}).allTextContents()).join(', ');`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 419: Fetch text from multiple elements (variant)
    handlers.set(419, (step, ctx) => {
      const el = ctx.getElement('Element');
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable') || ctx.rawValue('testdata');
      return {
        code: `vars[${JSON.stringify(target)}] = (await page.locator(${el.locator}).allTextContents()).join(', ');`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 479: Store text from element
    handlers.set(479, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      return {
        code: `vars[${JSON.stringify(target)}] = await page.locator(${el.locator}).textContent() || '';`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // ============ UI OPERATIONS ============

    // 527: Clear existing text and enter new text
    handlers.set(527, (step, ctx) => {
      const el = ctx.getElement('element-locator');
      const text = ctx.param('testdata');
      return {
        code: `await page.locator(${el.locator}).fill(String(${text.code}));`,
        confidence: el.missing ? 'low' : 'high',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 231: Select option by attribute value
    handlers.set(231, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const attr = ctx.rawValue('attribute') || 'value';
      const val = ctx.param('testdata');
      return {
        code: `await page.locator(${el.locator}).selectOption({ ${attr}: String(${val.code}) });`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 233: Fetch data values from element
    handlers.set(233, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      return {
        code: `vars[${JSON.stringify(target)}] = await page.locator(${el.locator}).textContent() || '';`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 237: Get CSS property of element
    handlers.set(237, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const prop = ctx.rawValue('testdata1') || ctx.rawValue('property') || 'color';
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      return {
        code: `vars[${JSON.stringify(target)}] = await page.locator(${el.locator}).evaluate((el) => window.getComputedStyle(el as HTMLElement).${prop});`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 238: Get background color
    handlers.set(238, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      return {
        code: `vars[${JSON.stringify(target)}] = await page.locator(${el.locator}).evaluate((el) => window.getComputedStyle(el as HTMLElement).backgroundColor);`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 239: Get background color and convert to name
    handlers.set(239, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      return {
        code: `vars[${JSON.stringify(target)}] = await page.locator(${el.locator}).evaluate((el) => window.getComputedStyle(el as HTMLElement).backgroundColor);`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 255: Get pseudo element CSS property
    handlers.set(255, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const prop = ctx.rawValue('testdata1') || ctx.rawValue('property') || 'color';
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      return {
        code: `vars[${JSON.stringify(target)}] = await page.locator(${el.locator}).evaluate((el) => window.getComputedStyle(el as HTMLElement, '::after').${prop});`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 420: Copy element text to clipboard (keyboard)
    handlers.set(420, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      return {
        code: `vars[${JSON.stringify(target)}] = await page.locator(${el.locator}).textContent() || '';`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 465: Copy element attribute to clipboard
    handlers.set(465, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const attr = ctx.rawValue('attribute') || ctx.rawValue('testdata1') || 'value';
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      return {
        code: `vars[${JSON.stringify(target)}] = await page.locator(${el.locator}).getAttribute(${JSON.stringify(attr)}) || '';`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 531: Copy element attribute to clipboard (variant)
    handlers.set(531, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const attr = ctx.rawValue('attribute') || 'value';
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      return {
        code: `vars[${JSON.stringify(target)}] = await page.locator(${el.locator}).getAttribute(${JSON.stringify(attr)}) || '';`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 428: Enter text in prompt popup
    handlers.set(428, (step, ctx) => {
      const text = ctx.param('testdata');
      return {
        code: `page.once('dialog', async dialog => { await dialog.accept(String(${text.code})); });`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 19: Click in row with text
    handlers.set(19, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const text = ctx.param('testdata');
      return {
        code: `await page.locator(${el.locator}).filter({ hasText: String(${text.code}) }).click();`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // ============ DATE/TIME OPERATIONS ============

    // 194: Pick current date by timezone
    handlers.set(194, (step, ctx) => {
      const format = ctx.rawValue('dateformat');
      const tz = ctx.rawValue('timezone');
      const target = ctx.rawValue('testdata');
      return {
        code: `vars[${JSON.stringify(target)}] = (() => {\n  const d = new Date();\n  const opts: Intl.DateTimeFormatOptions = { timeZone: ${JSON.stringify(tz)} };\n  const fmt = ${JSON.stringify(format)};\n  // Map Java date format to Intl parts\n  const parts = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).formatToParts(d);\n  const p = Object.fromEntries(parts.map(({type, value}) => [type, value]));\n  return fmt.replace('yyyy', p.year || '').replace('yy', (p.year||'').slice(-2)).replace('MM', p.month || '').replace('dd', p.day || '').replace('HH', String(d.getHours()).padStart(2,'0')).replace('hh', p.hour || '').replace('mm', p.minute || '').replace('ss', p.second || '').replace('a', p.dayPeriod || '').replace(/M(?!M)/g, String(parseInt(p.month||'0'))).replace(/d(?!d)/g, String(parseInt(p.day||'0'))).replace(/h(?!h)/g, String(parseInt(p.hour||'0')));\n})();`,
        confidence: 'medium',
        warnings: ['Date formatting may need manual verification for edge cases'],
      };
    });

    // 270: Add days to date
    handlers.set(270, (step, ctx) => {
      const input = ctx.param('input-date');
      const days = ctx.param('days');
      const inFmt = ctx.rawValue('input-format');
      const outFmt = ctx.rawValue('output-format');
      const target = ctx.rawValue('testdata');
      return {
        code: `vars[${JSON.stringify(target)}] = (() => {\n  const d = new Date(String(${input.code}));\n  d.setDate(d.getDate() + parseInt(String(${days.code})));\n  ${this._genFormatDate('d', outFmt)}\n})();`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 338: Get date after adding (format variant)
    handlers.set(338, (step, ctx) => {
      const input = ctx.param('input-date');
      const days = ctx.param('days');
      const inFmt = ctx.rawValue('input-format');
      const outFmt = ctx.rawValue('output-format');
      const target = ctx.rawValue('testdata');
      return {
        code: `vars[${JSON.stringify(target)}] = (() => {\n  const d = new Date(String(${input.code}));\n  d.setDate(d.getDate() + parseInt(String(${days.code})));\n  ${this._genFormatDate('d', outFmt)}\n})();`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 216: Convert date format
    handlers.set(216, (step, ctx) => {
      const input = ctx.param('testdata');
      const fmt1 = ctx.rawValue('format1');
      const fmt2 = ctx.rawValue('format2');
      const target = ctx.rawValue('variable');
      return {
        code: `vars[${JSON.stringify(target)}] = (() => {\n  const d = new Date(String(${input.code}));\n  ${this._genFormatDate('d', fmt2)}\n})();`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 294: Add minutes to time
    handlers.set(294, (step, ctx) => {
      const input = ctx.param('input-datetime');
      const minutes = ctx.param('minute');
      const inFmt = ctx.rawValue('input-datetime-format');
      const outFmt = ctx.rawValue('output-datetime-format');
      const target = ctx.rawValue('variable-name');
      return {
        code: `vars[${JSON.stringify(target)}] = (() => {\n  const d = new Date('2000-01-01 ' + String(${input.code}));\n  d.setMinutes(d.getMinutes() + parseInt(String(${minutes.code})));\n  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: ${inFmt.includes('a') || inFmt.includes('h')} }); // Format: ${outFmt}\n})();`,
        confidence: 'medium',
        warnings: ['Time parsing/formatting may need manual adjustment'],
      };
    });

    // 295: Add minutes variant
    handlers.set(295, (step, ctx) => {
      return handlers.get(294)(step, ctx);
    });

    // 337: Add hours/minutes to date
    handlers.set(337, (step, ctx) => {
      const input = ctx.param('input-datetime') || ctx.param('testdata');
      const amount = ctx.param('minute') || ctx.param('testdata1');
      const target = ctx.rawValue('variable-name') || ctx.rawValue('runtimevariable');
      return {
        code: `vars[${JSON.stringify(target)}] = (() => {\n  const d = new Date(String(${input.code}));\n  d.setMinutes(d.getMinutes() + parseInt(String(${amount.code})));\n  return d.toLocaleString('en-US');\n})();`,
        confidence: 'medium',
        warnings: ['Time manipulation may need manual adjustment'],
      };
    });

    // 384: Subtract minutes from EST time
    handlers.set(384, (step, ctx) => {
      const input = ctx.param('input-datetime') || ctx.param('testdata');
      const minutes = ctx.param('minute') || ctx.param('testdata1');
      const target = ctx.rawValue('variable-name') || ctx.rawValue('runtimevariable');
      return {
        code: `vars[${JSON.stringify(target)}] = (() => {\n  const d = new Date('2000-01-01 ' + String(${input.code}));\n  d.setMinutes(d.getMinutes() - parseInt(String(${minutes.code})));\n  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });\n})();`,
        confidence: 'medium',
        warnings: ['EST time subtraction may need timezone adjustment'],
      };
    });

    // 376: Adjust EST by subtracting minutes
    handlers.set(376, (step, ctx) => {
      return handlers.get(384)(step, ctx);
    });

    // 299: Subtract minutes (UTC)
    handlers.set(299, (step, ctx) => {
      return handlers.get(384)(step, ctx);
    });

    // 268: Get day from date
    handlers.set(268, (step, ctx) => {
      const input = ctx.param('testdata') || ctx.param('input-date');
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      return {
        code: `vars[${JSON.stringify(target)}] = new Date(String(${input.code})).toLocaleDateString('en-US', { weekday: 'long' });`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 340: Get day from date (format variant)
    handlers.set(340, (step, ctx) => {
      return handlers.get(268)(step, ctx);
    });

    // 342: Get date before subtracting
    handlers.set(342, (step, ctx) => {
      const input = ctx.param('input-date');
      const days = ctx.param('days');
      const target = ctx.rawValue('testdata');
      return {
        code: `vars[${JSON.stringify(target)}] = (() => {\n  const d = new Date(String(${input.code}));\n  d.setDate(d.getDate() - parseInt(String(${days.code})));\n  return d.toLocaleDateString('en-US');\n})();`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 332: Calculate time difference
    handlers.set(332, (step, ctx) => {
      const t1 = ctx.param('testdata1');
      const t2 = ctx.param('testdata2');
      const unit = ctx.rawValue('unit') || 'MINUTES';
      const target = ctx.rawValue('runtime-variable');
      const divisor = unit === 'HOURS' ? '3600000' : unit === 'SECONDS' ? '1000' : '60000';
      return {
        code: `vars[${JSON.stringify(target)}] = Math.abs(new Date('2000-01-01 ' + String(${t2.code})).getTime() - new Date('2000-01-01 ' + String(${t1.code})).getTime()) / ${divisor} + '';`,
        confidence: 'medium',
        warnings: ['Time difference calculation may need format adjustment'],
      };
    });

    // 341: Verify date month equals
    handlers.set(341, (step, ctx) => {
      const input = ctx.param('testdata');
      const expected = ctx.param('testdata1');
      return {
        code: `expect(new Date(String(${input.code})).getMonth()).toBe(new Date(String(${expected.code})).getMonth());`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // ============ SORTING / ORDER VERIFICATION ============

    // 180: Verify data in ascending/descending order
    handlers.set(180, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const order = ctx.rawValue('testdata') || ctx.rawValue('selectable-list') || 'ascending';
      return {
        code: `{\n  const texts = await page.locator(${el.locator}).allTextContents();\n  const sorted = [...texts].sort((a, b) => ${order.includes('desc') ? 'b.localeCompare(a)' : 'a.localeCompare(b)'});\n  expect(texts).toEqual(sorted);\n}`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 431: Verify numeric list order
    handlers.set(431, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const order = ctx.rawValue('testdata') || 'ascending';
      return {
        code: `{\n  const texts = await page.locator(${el.locator}).allTextContents();\n  const nums = texts.map(t => parseFloat(t));\n  const sorted = [...nums].sort((a, b) => ${order.includes('desc') ? 'b - a' : 'a - b'});\n  expect(nums).toEqual(sorted);\n}`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 320: Verify date order with format
    handlers.set(320, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const order = ctx.rawValue('testdata') || 'ascending';
      return {
        code: `{\n  const texts = await page.locator(${el.locator}).allTextContents();\n  const dates = texts.map(t => new Date(t).getTime());\n  const sorted = [...dates].sort((a, b) => ${order.includes('desc') ? 'b - a' : 'a - b'});\n  expect(dates).toEqual(sorted);\n}`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // ============ LOOP CONDITIONS ============

    // 240: While element does not display text
    handlers.set(240, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const text = ctx.param('testdata');
      return {
        code: `while (!(await page.locator(${el.locator}).textContent() || '').includes(String(${text.code})))`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
        isLoop: true,
      };
    });

    // 242: While element does not display text (variant)
    handlers.set(242, (step, ctx) => {
      return handlers.get(240)(step, ctx);
    });

    // 266: Click until text visible
    handlers.set(266, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const text = ctx.param('testdata');
      return {
        code: `while (!(await page.locator(${el.locator}).textContent() || '').includes(String(${text.code}))) {\n  await page.locator(${el.locator}).click();\n  await page.waitForTimeout(500);\n}`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // ============ FILE OPERATIONS ============

    // 209: Read Excel cell
    handlers.set(209, (step, ctx) => {
      const rowKey = ctx.hasParam('row-index') ? 'row-index' : ctx.hasParam('row') ? 'row' : ctx.hasParam('rowNo') ? 'rowNo' : 'testdata1';
      const colKey = ctx.hasParam('column-index') ? 'column-index' : ctx.hasParam('column') ? 'column' : ctx.hasParam('columnNo') ? 'columnNo' : 'testdata2';
      const row = ctx.param(rowKey);
      const col = ctx.param(colKey);
      const sheet = ctx.rawValue('testdata3') || ctx.rawValue('sheetIndex') || ctx.rawValue('sheet-index') || ctx.rawValue('sheet') || '0';
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('runtime-variable') || ctx.rawValue('Variable') || ctx.rawValue('variable') || ctx.rawValue('testdata');
      const file = ctx.hasParam('file-path') ? ctx.param('file-path') : ctx.hasParam('filepath') ? ctx.param('filepath') : ctx.hasParam('file-url') ? ctx.param('file-url') : null;
      const filePath = file ? file.code : `vars['_lastDownloadPath'] || ''`;
      return {
        code: `vars[${JSON.stringify(target)}] = excelHelper.readCell(${filePath}, ${row.code}, ${col.code}, ${JSON.stringify(sheet)});`,
        confidence: 'medium',
        warnings: target ? [] : ['Missing target variable for excel read'],
      };
    });

    // 284: Read latest Excel cell
    handlers.set(284, (step, ctx) => {
      return handlers.get(209)(step, ctx);
    });

    // 539: Read latest Excel cell (variant)
    handlers.set(539, (step, ctx) => {
      return handlers.get(209)(step, ctx);
    });

    // 211: Write data to Excel cell
    handlers.set(211, (step, ctx) => {
      const dataKey = ctx.hasParam('data') ? 'data' : ctx.hasParam('datavalue') ? 'datavalue' : 'testdata';
      const rowKey = ctx.hasParam('row-index') ? 'row-index' : ctx.hasParam('rowNo') ? 'rowNo' : ctx.hasParam('row') ? 'row' : 'testdata1';
      const colKey = ctx.hasParam('column-index') ? 'column-index' : ctx.hasParam('columnNo') ? 'columnNo' : ctx.hasParam('column') ? 'column' : 'testdata2';
      const data = ctx.param(dataKey);
      const row = ctx.param(rowKey);
      const col = ctx.param(colKey);
      const file = ctx.hasParam('file-path') ? ctx.param('file-path') : ctx.hasParam('filepath') ? ctx.param('filepath') : null;
      const sheet = ctx.rawValue('testdata3') || ctx.rawValue('sheet') || ctx.rawValue('sheetIndex') || '0';
      const filePath = file ? file.code : `vars['_lastDownloadPath'] || ''`;
      return {
        code: `excelHelper.writeCell(${filePath}, ${row.code}, ${col.code}, String(${data.code}), ${JSON.stringify(sheet)});`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 210: Write data to xlsx newline
    handlers.set(210, (step, ctx) => {
      return handlers.get(211)(step, ctx);
    });

    // 497: Write to file by row/column
    handlers.set(497, (step, ctx) => {
      return handlers.get(211)(step, ctx);
    });

    // 283: Excel read entire column
    // 283: Excel read entire column. Keys: Index,testdata
    handlers.set(283, (step, ctx) => {
      const target = ctx.rawValue('testdata') || ctx.rawValue('runtimevariable') || ctx.rawValue('Variable') || ctx.rawValue('variable');
      const colKey = ctx.hasParam('Index') ? 'Index' : ctx.hasParam('column') ? 'column' : ctx.hasParam('column-index') ? 'column-index' : 'testdata1';
      const col = ctx.param(colKey);
      const sheet = ctx.rawValue('testdata2') || ctx.rawValue('sheet') || ctx.rawValue('sheet-index') || '0';
      const file = ctx.hasParam('file-url') ? ctx.param('file-url') : ctx.hasParam('filepath') ? ctx.param('filepath') : null;
      const filePath = file ? file.code : `vars['_lastDownloadPath'] || ''`;
      return {
        code: `vars[${JSON.stringify(target)}] = excelHelper.readColumn(${filePath}, ${col.code}, ${JSON.stringify(sheet)});`,
        confidence: 'medium',
        warnings: target ? [] : ['Missing target variable'],
      };
    });

    // 290: Excel read entire row. Keys: Index,testdata
    handlers.set(290, (step, ctx) => {
      const target = ctx.rawValue('testdata') || ctx.rawValue('runtimevariable') || ctx.rawValue('Variable') || ctx.rawValue('variable');
      const rowKey = ctx.hasParam('Index') ? 'Index' : ctx.hasParam('row') ? 'row' : ctx.hasParam('row-index') ? 'row-index' : 'testdata1';
      const row = ctx.param(rowKey);
      const sheet = ctx.rawValue('testdata2') || ctx.rawValue('sheet') || ctx.rawValue('sheet-index') || '0';
      const file = ctx.hasParam('file-url') ? ctx.param('file-url') : ctx.hasParam('filepath') ? ctx.param('filepath') : null;
      const filePath = file ? file.code : `vars['_lastDownloadPath'] || ''`;
      return {
        code: `vars[${JSON.stringify(target)}] = excelHelper.readRow(${filePath}, ${row.code}, ${JSON.stringify(sheet)});`,
        confidence: 'medium',
        warnings: target ? [] : ['Missing target variable'],
      };
    });

    // 309: Count non-empty cells in Excel row. Keys: rowIndex,testData
    handlers.set(309, (step, ctx) => {
      const target = ctx.rawValue('testData') || ctx.rawValue('testdata') || ctx.rawValue('runtimevariable') || ctx.rawValue('Variable') || ctx.rawValue('variable');
      const rowKey = ctx.hasParam('rowIndex') ? 'rowIndex' : ctx.hasParam('row-index') ? 'row-index' : ctx.hasParam('row') ? 'row' : 'testdata1';
      const row = ctx.param(rowKey);
      const sheet = ctx.rawValue('testdata2') || ctx.rawValue('sheet') || '0';
      return {
        code: `vars[${JSON.stringify(target)}] = String(excelHelper.countNonEmptyCells(vars['_lastDownloadPath'] || '', ${row.code}, ${JSON.stringify(sheet)}));`,
        confidence: 'medium',
        warnings: target ? [] : ['Missing target variable'],
      };
    });

    // 315: Store column count from Excel
    handlers.set(315, (step, ctx) => {
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('runtime-variable') || ctx.rawValue('Variable') || ctx.rawValue('variable');
      const testDataKey = ctx.rawValue('test-data') || ctx.rawValue('testdata1') || '';
      const file = ctx.param('file-url') || ctx.param('filepath');
      const filePath = (file && file.code !== "''") ? file.code : `vars['_lastDownloadPath'] || ''`;
      const sheet = ctx.rawValue('sheet') || ctx.rawValue('testdata2') || '0';
      const isRowCount = testDataKey.toLowerCase().includes('row');
      const helperCall = isRowCount
        ? `excelHelper.getRowCount(${filePath}, ${JSON.stringify(sheet)})`
        : `excelHelper.getColumnCount(${filePath}, ${JSON.stringify(sheet)})`;
      return {
        code: `vars[${JSON.stringify(target)}] = String(${helperCall});`,
        confidence: 'medium',
        warnings: target ? [] : ['Missing target variable for excel count'],
      };
    });

    // 316: Excel read row by index + sheet. Keys: row-index,sheet-index,testdata
    handlers.set(316, (step, ctx) => {
      const target = ctx.rawValue('testdata') || ctx.rawValue('runtimevariable') || ctx.rawValue('Variable') || ctx.rawValue('variable');
      const rowKey = ctx.hasParam('row-index') ? 'row-index' : ctx.hasParam('row') ? 'row' : 'testdata1';
      const row = ctx.param(rowKey);
      const sheet = ctx.rawValue('sheet-index') || ctx.rawValue('testdata2') || ctx.rawValue('sheet') || '0';
      return {
        code: `vars[${JSON.stringify(target)}] = excelHelper.readRow(vars['_lastDownloadPath'] || '', ${row.code}, ${JSON.stringify(sheet)});`,
        confidence: 'medium',
        warnings: target ? [] : ['Missing target variable'],
      };
    });

    // 350: Excel read row (unique values). Keys: row-index,sheet-index,variable-name
    handlers.set(350, (step, ctx) => {
      const target = ctx.rawValue('variable-name') || ctx.rawValue('testdata') || ctx.rawValue('runtimevariable');
      const rowKey = ctx.hasParam('row-index') ? 'row-index' : ctx.hasParam('Index') ? 'Index' : 'testdata1';
      const row = ctx.param(rowKey);
      const sheet = ctx.rawValue('sheet-index') || ctx.rawValue('sheet') || '0';
      return {
        code: `vars[${JSON.stringify(target)}] = excelHelper.readRow(vars['_lastDownloadPath'] || '', ${row.code}, ${JSON.stringify(sheet)});`,
        confidence: 'medium',
        warnings: target ? [] : ['Missing target variable'],
      };
    });

    // 351: Excel read column (unique values). Keys: column-index,sheet-index,variable-name
    handlers.set(351, (step, ctx) => {
      const target = ctx.rawValue('variable-name') || ctx.rawValue('testdata') || ctx.rawValue('runtimevariable');
      const colKey = ctx.hasParam('column-index') ? 'column-index' : ctx.hasParam('Index') ? 'Index' : 'testdata1';
      const col = ctx.param(colKey);
      const sheet = ctx.rawValue('sheet-index') || ctx.rawValue('sheet') || '0';
      return {
        code: `vars[${JSON.stringify(target)}] = excelHelper.readColumn(vars['_lastDownloadPath'] || '', ${col.code}, ${JSON.stringify(sheet)});`,
        confidence: 'medium',
        warnings: target ? [] : ['Missing target variable'],
      };
    });

    // 201: PDF extract content
    handlers.set(201, (step, ctx) => {
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable') || ctx.rawValue('testdata');
      return {
        code: `vars[${JSON.stringify(target)}] = fileHelper.extractPdfText(vars['_lastDownloadPath'] || '');`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // ============ DOWNLOAD / FILE MANAGEMENT ============

    // 275: Store recent downloaded filename
    handlers.set(275, (step, ctx) => {
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable') || ctx.rawValue('variable');
      return {
        code: `vars[${JSON.stringify(target)}] = vars['_lastDownloadPath'] ? require('path').basename(vars['_lastDownloadPath']) : '';`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 291: Copy latest downloaded file
    handlers.set(291, (step, ctx) => {
      const dest = ctx.rawValue('testdata') || ctx.rawValue('filepath') || '';
      return {
        code: `if (vars['_lastDownloadPath']) { require('fs').copyFileSync(vars['_lastDownloadPath'], ${dest ? JSON.stringify(dest) : "vars['_lastDownloadPath'] + '.copy'"}); }`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 292: File upload
    handlers.set(292, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const file = ctx.param('testdata');
      return {
        code: `await page.locator(${el.locator}).setInputFiles(${file.code});`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 357: Wait until downloads complete
    handlers.set(357, (step, ctx) => {
      return {
        code: `await page.waitForTimeout(3000); // Wait for download to complete`,
        confidence: 'medium',
        warnings: ['Should use Playwright download event instead of timeout'],
      };
    });

    // 528: Check if folder contains file
    handlers.set(528, (step, ctx) => {
      const folder = ctx.param('testdata') || ctx.param('folder');
      const file = ctx.param('testdata1') || ctx.param('filename');
      return {
        code: `expect(require('fs').existsSync(require('path').join(String(${folder.code}), String(${file.code})))).toBeTruthy();`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 529: ZIP extract file names
    handlers.set(529, (step, ctx) => {
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable') || ctx.rawValue('variable');
      return {
        code: `vars[${JSON.stringify(target)}] = fileHelper.getZipFileNames(vars['_lastDownloadPath'] || '');`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 530: ZIP unzip and store path
    handlers.set(530, (step, ctx) => {
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable') || ctx.rawValue('variable');
      return {
        code: `vars[${JSON.stringify(target)}] = fileHelper.unzip(vars['_lastDownloadPath'] || '');`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 360: Extract data matching regex
    handlers.set(360, (step, ctx) => {
      const input = ctx.param('testdata');
      const pattern = ctx.rawValue('testdata1') || ctx.rawValue('regex');
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      if (!pattern) {
        return { code: `// TODO: Regex extraction with empty pattern\n// Action: ${(step.action || '').substring(0, 100)}`, confidence: 'low', warnings: ['Empty regex pattern'] };
      }
      return {
        code: `vars[${JSON.stringify(target)}] = (String(${input.code}).match(/${pattern}/) || [''])[0];`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 407: Fetch data from JSON file
    handlers.set(407, (step, ctx) => {
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable') || ctx.rawValue('variable');
      const filePath = ctx.param('testdata') || ctx.param('filepath');
      const jsonKey = ctx.rawValue('testdata1') || ctx.rawValue('key') || '';
      return {
        code: `vars[${JSON.stringify(target)}] = fileHelper.readJsonValue(${filePath.code}, ${JSON.stringify(jsonKey)});`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // ============ MISC OPERATIONS ============

    // 256: Export testdata and email
    handlers.set(256, (step, ctx) => {
      return {
        code: `// TODO: Export testdata and email - not applicable in Playwright`,
        confidence: 'low',
        warnings: ['Export/email functionality needs manual implementation'],
      };
    });

    // 307: Verify multiple dropdown contains
    handlers.set(307, (step, ctx) => {
      const el = ctx.getElement('Element') || ctx.getElement();
      const expected = ctx.param('expectedText') || ctx.param('testdata');
      return {
        code: `expect(await page.locator(${el.locator}).textContent() || '').toContain(String(${expected.code}));`,
        confidence: el.missing ? 'low' : 'medium',
        warnings: el.missing ? [`Element not found: ${el.name}`] : [],
      };
    });

    // 415: Get month name by number
    handlers.set(415, (step, ctx) => {
      const input = ctx.param('testdata');
      const target = ctx.rawValue('runtimevariable') || ctx.rawValue('Variable');
      return {
        code: `vars[${JSON.stringify(target)}] = new Date(2000, parseInt(String(${input.code})) - 1, 1).toLocaleString('en-US', { month: 'long' });`,
        confidence: 'high',
        warnings: [],
      };
    });

    // 438: Allow clipboard access
    handlers.set(438, (step, ctx) => {
      return {
        code: `// Clipboard access is handled by Playwright browser context permissions`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 439: Set Chrome permission
    handlers.set(439, (step, ctx) => {
      return {
        code: `// Chrome permissions are handled via Playwright browser context`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 466: Set notification permission
    handlers.set(466, (step, ctx) => {
      return {
        code: `// Notification permissions are handled via Playwright browser context`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 532: Set notification permission (variant)
    handlers.set(532, (step, ctx) => {
      return {
        code: `// Notification permissions are handled via Playwright browser context`,
        confidence: 'medium',
        warnings: [],
      };
    });

    // 534: Set clipboard permission
    handlers.set(534, (step, ctx) => {
      return {
        code: `// Clipboard permissions are handled via Playwright browser context`,
        confidence: 'medium',
        warnings: [],
      };
    });

    return handlers;
  }

  getStats() {
    return { ...this.stats, handlerCount: this.handlers.size, kibbutzHandlerCount: this.kibbutzHandlers.size };
  }
}

module.exports = NlpParser;
