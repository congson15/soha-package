import { axiosServices } from '../axios';
import { HTML_DOM_PARAMS, SGU_PARAMS, TABLE_DOM_PARAMS } from '../constants/SGU';
import { getHeaders, getLoginFormData, parseCookieFromHeaders, transformTableElement } from '../utils';
import CheerioHelper from './cheerio';
import { CRAWL_LOGIN_PATH, CRAWL_PATH, CRAWL_CHECK_LIVE_PATH, LIVE_REGEX, TD_REGEX } from '../constants';
import { ISubject } from '../types';
import { MESSAGE_LIST } from '../constants/message';

class SoHaHelper {
  private _viewState!: string;
  private cookie!: string;
  private cheerioHelper: CheerioHelper = new CheerioHelper();
  private username!: string;
  private password!: string;
  private subjectList: ISubject[] = [];

  public setupAccount(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  private generateSubject(element: cheerio.Element) {
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
    this.subjectList.push(subject);
  }

  private async checkLiveCookie() {
    const response = await axiosServices.get(CRAWL_CHECK_LIVE_PATH as string, {
      ...getHeaders(this.cookie as string),
    });
    if (!response) return false;
    this.cheerioHelper.setHTML(response.data as string);
    const live = this.cheerioHelper.getElementText(`#${HTML_DOM_PARAMS.CHANGE_INFORMATION}`);
    if (live.includes(LIVE_REGEX)) {
      return true;
    }
  }

  private async refreshAccount() {
    this.getCookieAndViewState();
    const data = {
      __VIEWSTATE: this._viewState,
      ...getLoginFormData({ username: this.username, password: this.password }),
    };
    await axiosServices.post(CRAWL_LOGIN_PATH as string, data, { ...getHeaders(this.cookie as string) });
  }

  private parseViewStateFromBody(body: string): string | undefined {
    this.cheerioHelper.setHTML(body);
    return this.cheerioHelper.getElementValue(`#${SGU_PARAMS.__VIEWSTATE}`);
  }

  public async getCookieAndViewState() {
    try {
      const result = await axiosServices.get('/');
      this.cookie = parseCookieFromHeaders(result.headers) as string;
      this._viewState = this.parseViewStateFromBody(result.data as string) as string;
      return {
        cookie: this.cookie,
        _viewState: this._viewState,
      };
    } catch (error) {}
  }

  public async generateSubjects(html: string) {
    if (html.indexOf('Object reference not set to an instance of an object.') !== -1) {
      return {
        message: MESSAGE_LIST.FILTER_SUBJECT_FAILED,
      };
    }
    if (!this.checkLiveCookie()) {
      await this.refreshAccount();
    }
    const allSubject = html.split(`"value":"`);
    const tableElm = transformTableElement(allSubject[1]);
    if (this.subjectList.length > 0) this.subjectList = [];
    this.cheerioHelper.getTableElement(tableElm, (element) => this.generateSubject(element));
  }

  public async getSubjectsByName(subjectName: string) {
    try {
      const { X_AJAXPRO_METHOD } = SGU_PARAMS;
      const header = {
        ...getHeaders(this.cookie as string),
        [X_AJAXPRO_METHOD]: SGU_PARAMS.LOC_THEO_MON_HOC,
      };
      const data = `{"dkLoc":"${subjectName}"}`;
      const response = await axiosServices.post(CRAWL_PATH as string, data, header);
      if (response && response.data) {
        await this.generateSubjects(JSON.stringify(response.data));
        return {
          message: MESSAGE_LIST.GET_SUBJECTS_SUCCESS,
          subjectList: this.subjectList,
        };
      }
      return {
        message: MESSAGE_LIST.GET_SUBJECTS_FAILED,
        subjectList: [],
      };
    } catch (error) {}
  }

  public async login() {
    try {
      await this.getCookieAndViewState();

      const data = {
        __VIEWSTATE: this._viewState,
        ...getLoginFormData({ username: this.username, password: this.password }),
      };
      const response = await axiosServices.post(CRAWL_LOGIN_PATH as string, data, {
        ...getHeaders(this.cookie as string),
      });
      this.cheerioHelper.setHTML(response.data as string);
      const fullName = this.cheerioHelper.getElementText(`#${HTML_DOM_PARAMS.FULLNAME}`);
      const isLogin = this.cheerioHelper.getElementText(`#${HTML_DOM_PARAMS.TTCN}`);
      if (isLogin) {
        return {
          fullName,
          message: MESSAGE_LIST.LOGIN_SUCCESS,
        };
      }
      return {
        fullName: '',
        message: MESSAGE_LIST.LOGIN_FAILED,
      };
    } catch (error) {}
  }
}

export default SoHaHelper;
