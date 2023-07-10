import { axiosServices } from '../axios';
import { SGU_PARAMS, TABLE_DOM_PARAMS } from '../constants/SGU';
import { getHeaders, getLoginFormData, parseCookieFromHeaders, transformTableElement } from '../utils';
import CheerioHelper from './cheerio';
import { CRAWL_PATH, TD_REGEX } from '../constants';
import { ISubject } from '../types';

class SoHaHelper {
  private _viewState!: string;
  private cookie!: string;
  private cheerioHelper: CheerioHelper = new CheerioHelper();
  private username: string;
  private password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  private generateSubject(element: cheerio.Element, subjectList: ISubject[]) {
    let match;
    const subject: ISubject = {
      id: this.cheerioHelper.getChildValue(element, TABLE_DOM_PARAMS.id),
      maMon: this.cheerioHelper.getChildText(element, TABLE_DOM_PARAMS.maMon),
      tenMon: this.cheerioHelper.getChildText(element, TABLE_DOM_PARAMS.tenMon),
      maNhom: this.cheerioHelper.getChildText(element, TABLE_DOM_PARAMS.maNhom),
      maTTH: this.cheerioHelper.getChildText(element, TABLE_DOM_PARAMS.maTTH),
      soTC: this.cheerioHelper.getChildText(element, TABLE_DOM_PARAMS.soTC),
      siSo: this.cheerioHelper.getChildText(element, TABLE_DOM_PARAMS.siSo),
      conLai: this.cheerioHelper.getChildText(element, TABLE_DOM_PARAMS.conLai),
      thu: [],
      tietBatDau: [],
      soTiet: [],
      phongHoc: [],
      giangVien: [],
    };
    while ((match = TD_REGEX.exec(this.cheerioHelper.getChild(element, TABLE_DOM_PARAMS.thu).toString()))) {
      subject.thu.push(match[1]);
    }
    while ((match = TD_REGEX.exec(this.cheerioHelper.getChild(element, TABLE_DOM_PARAMS.tietBatDau).toString()))) {
      subject.tietBatDau.push(match[1]);
    }
    while ((match = TD_REGEX.exec(this.cheerioHelper.getChild(element, TABLE_DOM_PARAMS.soTiet).toString()))) {
      subject.soTiet.push(match[1]);
    }
    while ((match = TD_REGEX.exec(this.cheerioHelper.getChild(element, TABLE_DOM_PARAMS.phongHoc).toString()))) {
      subject.phongHoc.push(match[1]);
    }
    while ((match = TD_REGEX.exec(this.cheerioHelper.getChild(element, TABLE_DOM_PARAMS.giangVien).toString()))) {
      subject.giangVien.push(match[1]);
    }
    subjectList.push(subject);
  }

  private async checkLiveCookie() {
    const response = await axiosServices.get('/Default.aspx?page=thaydoittcn', {
      ...getHeaders(this.cookie as string),
    });
    if (response && response.data) {
      this.cheerioHelper.setHTML(response.data as string);
      const live = this.cheerioHelper.getElementText(`#${SGU_PARAMS.CHANGE_INFORMATION}`);
      if (live.includes('THAY ĐỔI THÔNG TIN CÁ NHÂN')) {
        return true;
      }
    }
    return false;
  }

  private async refreshAccount() {
    this.getCookieAndViewState();
    const data = {
      __VIEWSTATE: this._viewState,
      ...getLoginFormData({ username: this.username, password: this.password }),
    };
    await axiosServices.post(`/default.aspx`, data, { ...getHeaders(this.cookie as string) });
  }

  private parseViewStateFromBody(body: string): string | undefined {
    this.cheerioHelper.setHTML(body);
    return this.cheerioHelper.getElementValue(`#${SGU_PARAMS.__VIEWSTATE}`);
  }

  public async getCookieAndViewState(): Promise<void> {
    try {
      const result = await axiosServices.get('/');
      this.cookie = parseCookieFromHeaders(result.headers) as string;
      this._viewState = this.parseViewStateFromBody(result.data as string) as string;
    } catch (error) {}
  }

  public async generateSubjects(html: string) {
    if (html.indexOf('Object reference not set to an instance of an object.') !== -1) {
      return {
        message: 'Không lọc được môn, vui lòng thử lại sau.',
      };
    }
    if (!this.checkLiveCookie()) {
      await this.refreshAccount();
    }
    const subjectList: ISubject[] = [];
    const allSubject = html.split(`"value":"`);
    const tableElm = transformTableElement(allSubject[1]);
    this.cheerioHelper.getTableElement(tableElm, (element) => this.generateSubject(element, subjectList));
    return subjectList;
  }

  public async filterSubjects(subjectName: string) {
    try {
      const { X_AJAXPRO_METHOD } = SGU_PARAMS;
      const header = {
        ...getHeaders(this.cookie as string),
        [X_AJAXPRO_METHOD]: 'LocTheoMonHoc',
      };
      const data = `{"dkLoc":"${subjectName}"}`;
      const response = await axiosServices.post(CRAWL_PATH as string, data, header);
      if (response && response.data) {
        return {
          subjectList: await this.generateSubjects(JSON.stringify(response.data)),
        };
      }
    } catch (error) {}
  }

  public async login(): Promise<string | undefined> {
    try {
      await this.getCookieAndViewState();

      const data = {
        __VIEWSTATE: this._viewState,
        ...getLoginFormData({ username: this.username, password: this.password }),
      };
      const response = await axiosServices.post(`/default.aspx`, data, { ...getHeaders(this.cookie as string) });
      this.cheerioHelper.setHTML(response.data as string);
      const fullName = this.cheerioHelper.getElementText('#ctl00_Header1_Logout1_lblNguoiDung');
      const isLogin = this.cheerioHelper.getElementText('#ctl00_menu_lblThayDoiTTCN');
      if (isLogin) {
        Promise.resolve({
          fullName,
        });
      }
    } catch (error) {
      console.log(error);
    }
    return undefined;
  }
}

export default SoHaHelper;
