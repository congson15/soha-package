import cheerio from 'cheerio';

class CheerioHelper {
  private $: cheerio.Root;

  constructor(html = '') {
    this.$ = cheerio.load(html);
  }

  public setHTML(html: string): void {
    this.$ = cheerio.load(html);
  }

  public getElementText(selector: string): string {
    return this.$(selector).text() ?? '';
  }

  public getAttributeValue(selector: string, attributeName: string): string {
    return this.$(selector).attr(attributeName) ?? '';
  }
}

export default CheerioHelper;
