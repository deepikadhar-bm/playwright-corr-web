/**
 * Page Object Generator - Groups elements by functional area and generates
 * Page Object Model classes for Playwright.
 */
const fs = require('fs');
const path = require('path');

class PageObjectGenerator {
  constructor(dataLoader) {
    this.dataLoader = dataLoader;
  }

  /**
   * Generate page object files grouped by suite/screen.
   */
  generateAll(outputDir, project) {
    const pagesDir = path.join(outputDir, 'src', 'pages', project);
    fs.mkdirSync(pagesDir, { recursive: true });

    // Group elements by screenNameObj
    const screens = new Map();
    for (const el of this.dataLoader.elements) {
      const screenName = el.screenNameObj?.name || 'Common';
      if (!screens.has(screenName)) {
        screens.set(screenName, []);
      }
      screens.get(screenName).push(el);
    }

    const files = [];
    const usedClassNames = new Set();
    const usedFileNames = new Set();

    for (const [screenName, elements] of screens) {
      let className = this.toClassName(screenName);
      let fileName = this.toFileName(screenName);
      // Deduplicate class names
      if (usedClassNames.has(className)) {
        let suffix = 2;
        while (usedClassNames.has(`${className.replace(/Page$/, '')}${suffix}Page`)) suffix++;
        className = `${className.replace(/Page$/, '')}${suffix}Page`;
      }
      usedClassNames.add(className);
      // Deduplicate file names
      if (usedFileNames.has(fileName)) {
        let suffix = 2;
        while (usedFileNames.has(`${fileName}-${suffix}`)) suffix++;
        fileName = `${fileName}-${suffix}`;
      }
      usedFileNames.add(fileName);
      const content = this.generatePageObject(className, screenName, elements);
      const filePath = path.join(pagesDir, `${fileName}.ts`);
      fs.writeFileSync(filePath, content);
      files.push({ fileName, className, elementCount: elements.length });
    }

    // Generate barrel export (deduplicate class names)
    const exportedNames = new Set();
    const exportLines = [];
    for (const f of files) {
      if (!exportedNames.has(f.className)) {
        exportedNames.add(f.className);
        exportLines.push(`export { ${f.className} } from './${f.fileName}';`);
      }
    }
    const indexContent = exportLines.join('\n') + '\n';
    fs.writeFileSync(path.join(pagesDir, 'index.ts'), indexContent);

    console.log(`  Page objects: ${files.length} classes, ${this.dataLoader.elements.length} elements total`);
    return files;
  }

  generatePageObject(className, screenName, elements) {
    const lines = [
      `import { Page, Locator } from '@playwright/test';`,
      ``,
      `/**`,
      ` * Page Object: ${screenName}`,
      ` * Elements: ${elements.length}`,
      ` */`,
      `export class ${className} {`,
      `  constructor(private page: Page) {}`,
      ``,
    ];

    // Generate getter for each element (deduplicate property names)
    const usedProps = new Set();
    for (const el of elements) {
      let propName = this.toPropName(el.name);
      if (usedProps.has(propName)) {
        let suffix = 2;
        while (usedProps.has(`${propName}_${suffix}`)) suffix++;
        propName = `${propName}_${suffix}`;
      }
      usedProps.add(propName);
      const locatorCode = this.getLocatorCode(el);
      lines.push(`  get ${propName}(): Locator {`);
      lines.push(`    return ${locatorCode};`);
      lines.push(`  }`);
      lines.push(``);
    }

    lines.push(`}`);
    return lines.join('\n');
  }

  getLocatorCode(element) {
    const def = element.definition;
    if (!def) return `this.page.locator('//*')`;

    switch (element.locatorType) {
      case 'xpath':
        return `this.page.locator(${JSON.stringify(def)})`;
      case 'css':
      case 'css_selector':
        return `this.page.locator(${JSON.stringify(def)})`;
      case 'id':
        return `this.page.locator(${JSON.stringify('#' + def)})`;
      case 'name':
        return `this.page.locator(${JSON.stringify(`[name="${def}"]`)})`;
      default:
        return `this.page.locator(${JSON.stringify(def)})`;
    }
  }

  toClassName(name) {
    let result = name
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('') + 'Page';
    // Ensure doesn't start with number
    if (/^\d/.test(result)) result = 'P' + result;
    return result;
  }

  toFileName(name) {
    let result = name
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .map(w => w.toLowerCase())
      .join('-');
    if (/^\d/.test(result)) result = 'p-' + result;
    return result;
  }

  toPropName(name) {
    // Convert element name to valid JS property name
    const cleaned = name
      .replace(/[^a-zA-Z0-9_\s.]/g, '')
      .replace(/\s+/g, '_')
      .replace(/\.+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

    // Ensure doesn't start with number
    if (/^\d/.test(cleaned)) return '_' + cleaned;
    return cleaned || '_unnamed';
  }
}

module.exports = PageObjectGenerator;
