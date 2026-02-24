/**
 * Element Resolver - Maps element names to locator definitions.
 * Uses data already loaded by DataLoader; provides lookup helpers.
 */

class ElementResolver {
  constructor(dataLoader) {
    this.dataLoader = dataLoader;
    this.usedElements = new Map(); // name -> { element, usageCount }
  }

  /**
   * Resolve an element name to a Playwright locator string.
   * Priority: step-embedded element > global element index
   */
  resolve(elementName, step) {
    const el = this.dataLoader.resolveElement(elementName, step);
    if (el) {
      this.trackUsage(el.name, el);
      return this.toPlaywrightLocator(el);
    }
    return null;
  }

  /**
   * Convert element definition to Playwright locator code string.
   */
  toPlaywrightLocator(element) {
    const { locatorType, definition } = element;

    if (!definition) return `page.locator('//*')`;

    switch (locatorType) {
      case 'xpath':
        return `page.locator(${JSON.stringify(definition)})`;
      case 'css':
      case 'css_selector':
        return `page.locator(${JSON.stringify(definition)})`;
      case 'id':
        return `page.locator(${JSON.stringify('#' + definition)})`;
      case 'name':
        return `page.locator(${JSON.stringify(`[name="${definition}"]`)})`;
      case 'className':
      case 'class_name':
        return `page.locator(${JSON.stringify('.' + definition.replace(/\s+/g, '.'))})`;
      case 'link_text':
        return `page.getByRole('link', { name: ${JSON.stringify(definition)} })`;
      case 'tag_name':
        return `page.locator(${JSON.stringify(definition)})`;
      default:
        return `page.locator(${JSON.stringify(definition)})`;
    }
  }

  trackUsage(name, element) {
    if (!this.usedElements.has(name)) {
      this.usedElements.set(name, { element, usageCount: 0 });
    }
    this.usedElements.get(name).usageCount++;
  }

  /**
   * Get all elements grouped by screen/functional area for page objects.
   */
  getElementsByScreen() {
    const screens = new Map();

    for (const [name, { element, usageCount }] of this.usedElements) {
      const screenName = element.screenNameObj?.name || 'Common';
      if (!screens.has(screenName)) {
        screens.set(screenName, []);
      }
      screens.get(screenName).push({ name, element, usageCount });
    }

    return screens;
  }

  /**
   * Get usage stats.
   */
  getStats() {
    return {
      totalElements: this.dataLoader.elements.length,
      usedElements: this.usedElements.size,
      unusedElements: this.dataLoader.elements.length - this.usedElements.size,
    };
  }
}

module.exports = ElementResolver;
