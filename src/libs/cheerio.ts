import cheerio from 'cheerio';

class CheerioHelper {
  private $: cheerio.Root;

  constructor(html = '') {
    this.$ = cheerio.load(html);
  }

  public setHTML(html: string): void {
    this.$ = cheerio.load(html);
  }

  public getChild(element: cheerio.Element, selector: string) {
    return this.$(element).find(selector);
  }

  public getElementText(selector: string): string {
    return this.$(selector).text() ?? '';
  }

  public getElementValue(selector: string): string {
    return this.$(selector).val() ?? '';
  }

  public getChildText(element: cheerio.Element, selector: string): string {
    return this.getChild(element, selector).text() ?? '';
  }
  public getChildValue(element: cheerio.Element, selector: string): string {
    return this.getChild(element, selector).val() ?? '';
  }

  public getAttributeValue(selector: string, attributeName: string): string {
    return this.$(selector).attr(attributeName) ?? '';
  }

  public getTableElement(tableElm: string, callback: (element: cheerio.Element) => void): void {
    this.setHTML(tableElm);
    this.$('table').each((index, element) => {
      callback(element);
    });
  }
}

export default CheerioHelper;
